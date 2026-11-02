import { parse } from "acorn";
import { fetchApprovedApiResponse, ASYNC_FETCH_LIMITS } from "./async-fetch.js";
import { generateExecutionId } from "./runner.js";

export const ASYNC_RUNNER_LIMITS = Object.freeze({
  TIMEOUT_MS: 5000,
  MAX_CODE_LENGTH: 50_000,
  MAX_OUTPUT_ENTRIES: 100,
  MAX_ENTRY_LENGTH: 2000,
  MAX_ARGUMENTS: 20,
  MAX_WORKER_MESSAGES: 110,
  MAX_TIMER_CALLBACKS: 50,
  MAX_TIMER_DELAY_MS: 2000,
  MAX_FETCH_REQUESTS: ASYNC_FETCH_LIMITS.MAX_REQUESTS_PER_EXECUTION,
});

const PROTOCOL_VERSION = 1;
const allowedOutputKinds = new Set(["log", "info", "warn", "error"]);
const allowedFetchUrls = new Set([
  "https://jsonplaceholder.typicode.com/todos/1",
  "https://jsonplaceholder.typicode.com/todos/999999999",
]);

function hasOnlyKeys(value, allowedKeys) {
  const keys = Object.keys(value);
  return keys.length === allowedKeys.length && keys.every((key) => allowedKeys.includes(key));
}

export function validateAsyncLearnerCode(code) {
  if (typeof code !== "string") {
    throw new TypeError("Exercise code must be a string.");
  }
  if (code.length > ASYNC_RUNNER_LIMITS.MAX_CODE_LENGTH) {
    throw new RangeError("Exercise code exceeds the 50,000-character limit.");
  }

  const tree = parse(`async function __learnerExercise__() {\n${code}\n}`, {
    ecmaVersion: "latest",
    sourceType: "script",
  });
  const pending = [tree];
  while (pending.length > 0) {
    const node = pending.pop();
    if (!node || typeof node !== "object") continue;
    if (
      node.type === "ImportExpression" ||
      node.type === "ImportDeclaration" ||
      (typeof node.type === "string" && node.type.startsWith("Export"))
    ) {
      throw new SyntaxError("Module loading is not available in async exercises.");
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === "start" || key === "end" || key === "loc") continue;
      if (Array.isArray(value)) {
        for (const child of value) pending.push(child);
      } else if (value && typeof value === "object") {
        pending.push(value);
      }
    }
  }
}

function safeError(error) {
  const name = typeof error?.name === "string" ? error.name.slice(0, 200) : "Error";
  let message = "Execution failed.";
  try {
    message = String(error?.message ?? error).slice(0, ASYNC_RUNNER_LIMITS.MAX_ENTRY_LENGTH);
  } catch {
    message = "An unprintable error occurred.";
  }
  return { name, message };
}

function defaultWorkerFactory() {
  return new Worker(new URL("./async-worker.js", import.meta.url), {
    type: "module",
    name: "javascript-learning-async-execution",
  });
}

export function createAsyncRunner(options = {}) {
  const configuredTimeout = Number(options.timeoutMs ?? ASYNC_RUNNER_LIMITS.TIMEOUT_MS);
  const timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? Math.min(configuredTimeout, ASYNC_RUNNER_LIMITS.TIMEOUT_MS)
    : ASYNC_RUNNER_LIMITS.TIMEOUT_MS;
  const workerFactory = options.workerFactory || defaultWorkerFactory;
  const fetchApi = options.fetchApi || fetchApprovedApiResponse;

  let activeExecutionId = null;
  let worker = null;
  let watchdog = null;
  let isDestroyed = false;
  let workerMessageCount = 0;
  let workerOutputSequence = 0;
  let fetchRequestCount = 0;
  const pendingRequests = new Map();
  const seenRequestIds = new Set();

  function clearWatchdog() {
    if (watchdog !== null) {
      clearTimeout(watchdog);
      watchdog = null;
    }
  }

  function discardWorker() {
    if (worker) {
      worker.onmessage = null;
      worker.onerror = null;
      worker.onmessageerror = null;
      worker.terminate();
      worker = null;
    }
  }

  function abortRequests() {
    for (const request of pendingRequests.values()) {
      request.controller.abort();
    }
    pendingRequests.clear();
  }

  function finish(result, reason = null) {
    if (activeExecutionId === null || (
      result.executionId !== undefined &&
      result.executionId !== activeExecutionId
    )) return;
    const completedId = activeExecutionId;
    activeExecutionId = null;
    clearWatchdog();
    abortRequests();
    discardWorker();

    if (reason && typeof options.onTerminated === "function") {
      options.onTerminated({
        executionId: completedId,
        reason,
        message: result.error?.message || "Execution was terminated.",
      });
    }
    if (typeof options.onDone === "function") {
      options.onDone({ ...result, executionId: completedId });
    }
  }

  function failProtocol(message) {
    finish({
      status: "error",
      error: { name: "ProtocolError", message },
    });
  }

  function sendFetchResult(requestId, result, error) {
    if (!worker || activeExecutionId === null) return;
    const message = {
      protocol: PROTOCOL_VERSION,
      type: "fetch-result",
      executionId: activeExecutionId,
      requestId,
    };
    if (error) {
      message.error = safeError(error);
    } else {
      message.result = result;
    }
    worker.postMessage(message);
  }

  function handleFetchRequest(data) {
    const validKeys = ["protocol", "type", "executionId", "requestId", "url"];
    if (
      !hasOnlyKeys(data, validKeys) ||
      data.protocol !== PROTOCOL_VERSION ||
      typeof data.requestId !== "string" ||
      !/^fetch-[1-9]\d{0,2}$/.test(data.requestId) ||
      typeof data.url !== "string" ||
      data.url.length > 256 ||
      pendingRequests.has(data.requestId) ||
      seenRequestIds.has(data.requestId)
    ) {
      failProtocol("The Worker sent an invalid API request.");
      return;
    }

    seenRequestIds.add(data.requestId);
    fetchRequestCount += 1;
    if (fetchRequestCount > ASYNC_RUNNER_LIMITS.MAX_FETCH_REQUESTS) {
      sendFetchResult(data.requestId, null, new RangeError("An execution may make at most 3 API requests."));
      return;
    }
    if (!allowedFetchUrls.has(data.url)) {
      sendFetchResult(
        data.requestId,
        null,
        new TypeError("This exercise can request only the approved task API endpoint."),
      );
      return;
    }

    const controller = new AbortController();
    pendingRequests.set(data.requestId, { controller });
    fetchApi(data.url, { signal: controller.signal }).then(
      (result) => {
        if (activeExecutionId !== data.executionId || !pendingRequests.has(data.requestId)) return;
        pendingRequests.delete(data.requestId);
        sendFetchResult(data.requestId, result);
      },
      (error) => {
        if (activeExecutionId !== data.executionId || !pendingRequests.has(data.requestId)) return;
        pendingRequests.delete(data.requestId);
        sendFetchResult(data.requestId, null, error);
      },
    );
  }

  function handleWorkerMessage(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      failProtocol("The Worker sent a malformed message.");
      return;
    }
    if (typeof data.executionId !== "string" || data.executionId !== activeExecutionId) {
      return;
    }

    workerMessageCount += 1;
    if (workerMessageCount > ASYNC_RUNNER_LIMITS.MAX_WORKER_MESSAGES) {
      failProtocol("The Worker exceeded the message limit.");
      return;
    }
    if (data.protocol !== PROTOCOL_VERSION || typeof data.type !== "string") {
      failProtocol("The Worker sent an unsupported protocol message.");
      return;
    }

    if (data.type === "output") {
      if (
        !hasOnlyKeys(data, ["protocol", "type", "executionId", "sequence", "kind", "args"]) ||
        data.sequence !== workerOutputSequence ||
        !allowedOutputKinds.has(data.kind) ||
        !Array.isArray(data.args) ||
        data.args.length > ASYNC_RUNNER_LIMITS.MAX_ARGUMENTS ||
        data.args.some((arg) => typeof arg !== "string" || arg.length > ASYNC_RUNNER_LIMITS.MAX_ENTRY_LENGTH + 20)
      ) {
        failProtocol("The Worker sent invalid console output.");
        return;
      }
      workerOutputSequence += 1;
      if (typeof options.onOutput === "function") {
        const args = data.args.map((arg) => arg.length > ASYNC_RUNNER_LIMITS.MAX_ENTRY_LENGTH
          ? `${arg.slice(0, ASYNC_RUNNER_LIMITS.MAX_ENTRY_LENGTH)}... [truncated]`
          : arg);
        options.onOutput({
          executionId: data.executionId,
          kind: data.kind,
          args,
        });
      }
      return;
    }

    if (data.type === "fetch-request") {
      if (data.executionId !== activeExecutionId) return;
      handleFetchRequest(data);
      return;
    }

    if (data.type === "done") {
      if (
        !hasOnlyKeys(data, ["protocol", "type", "executionId", "status", "error"]) ||
        !["success", "error"].includes(data.status) ||
        (data.error !== null && (
          !data.error ||
          typeof data.error !== "object" ||
          typeof data.error.name !== "string" ||
          typeof data.error.message !== "string"
        )) ||
        (data.status === "success" && data.error !== null) ||
        (data.status === "error" && data.error === null) ||
        pendingRequests.size > 0
      ) {
        failProtocol("The Worker sent an invalid completion message.");
        return;
      }
      finish({
        status: data.status,
        error: data.error,
      });
      return;
    }

    failProtocol("The Worker sent an unknown message type.");
  }

  function handleWorkerError(error) {
    finish({
      status: "error",
      error: {
        name: "RuntimeError",
        message: String(error?.message || "The async Worker failed.").slice(0, 2000),
      },
    });
  }

  function terminate(reason = "manual") {
    if (activeExecutionId === null) return;
    const message = reason === "timeout"
      ? `Execution was terminated after ${timeoutMs} milliseconds.`
      : "Execution was cancelled.";
    finish({
      status: "terminated",
      error: {
        name: reason === "timeout" ? "TimeoutError" : "AbortError",
        message,
      },
    }, reason);
  }

  return {
    run(code, customTimeout = timeoutMs) {
      if (isDestroyed) throw new Error("Async runner has been destroyed.");
      if (activeExecutionId !== null) terminate("superseded");

      const executionId = generateExecutionId();
      activeExecutionId = executionId;
      workerMessageCount = 0;
      workerOutputSequence = 0;
      fetchRequestCount = 0;
      seenRequestIds.clear();

      try {
        validateAsyncLearnerCode(code ?? "");
      } catch (error) {
        finish({ status: "error", error: safeError(error) });
        return executionId;
      }

      try {
        worker = workerFactory();
      } catch (error) {
        finish({
          status: "error",
          error: {
            name: "EnvironmentError",
            message: String(error?.message || "The async Worker could not be created.").slice(0, 2000),
          },
        });
        return executionId;
      }

      if (!worker) {
        finish({
          status: "error",
          error: {
            name: "EnvironmentError",
            message: "Web Worker execution is unavailable in this browser.",
          },
        });
        return executionId;
      }

      worker.onmessage = (event) => handleWorkerMessage(event.data);
      worker.onerror = (error) => {
        error.preventDefault?.();
        handleWorkerError(error);
      };
      worker.onmessageerror = () => failProtocol("The Worker message could not be decoded.");

      const requestedTimeout = Number(customTimeout);
      const runTimeout = Number.isFinite(requestedTimeout) && requestedTimeout > 0
        ? Math.min(requestedTimeout, timeoutMs)
        : timeoutMs;
      watchdog = setTimeout(() => terminate("timeout"), runTimeout);

      try {
        worker.postMessage({
          protocol: PROTOCOL_VERSION,
          type: "run",
          executionId,
          code: code ?? "",
        });
      } catch (error) {
        finish({ status: "error", error: safeError(error) });
      }
      return executionId;
    },
    terminate,
    destroy() {
      isDestroyed = true;
      if (activeExecutionId !== null) terminate("destroy");
      clearWatchdog();
      abortRequests();
      discardWorker();
    },
    isAvailable() {
      return !isDestroyed && (Boolean(options.workerFactory) || typeof Worker !== "undefined");
    },
    getActiveExecutionId() {
      return activeExecutionId;
    },
    _handleWorkerMessage: handleWorkerMessage,
  };
}
