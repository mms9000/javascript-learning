const PROTOCOL_VERSION = 1;
const MAX_OUTPUT_ENTRIES = 100;
const MAX_STRING_LENGTH = 2000;
const MAX_TIMER_COUNT = 50;
const MAX_TIMER_DELAY_MS = 2000;
const MAX_FETCH_REQUESTS = 3;
const MAX_CODE_LENGTH = 50_000;

const nativePostMessage = self.postMessage.bind(self);
const nativeAddEventListener = self.addEventListener.bind(self);
const nativeSetTimeout = self.setTimeout.bind(self);
const nativeClearTimeout = self.clearTimeout.bind(self);
const NativePromise = Promise;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
let runState = null;

function createError(name, message) {
  const error = new Error(message);
  error.name = name;
  return error;
}

function serialize(value, depth = 0, seen = new WeakSet()) {
  if (depth > 3) return "[Object]";
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") {
    return value.length > MAX_STRING_LENGTH
      ? `${value.slice(0, MAX_STRING_LENGTH)}... [truncated]`
      : value;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "bigint") return `${value}n`;
  if (typeof value === "symbol") return value.toString();
  if (typeof value === "function") return `[Function${value.name ? `: ${value.name}` : ""}]`;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value !== "object") return String(value);
  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  try {
    if (Array.isArray(value)) {
      const entries = [];
      const length = Math.min(value.length, 50);
      for (let index = 0; index < length; index += 1) {
        entries.push(serialize(value[index], depth + 1, seen));
      }
      if (value.length > length) entries.push(`... ${value.length - length} more items`);
      return `[${entries.join(", ")}]`;
    }

    const keys = Object.keys(value);
    const entries = [];
    for (let index = 0; index < Math.min(keys.length, 30); index += 1) {
      const key = keys[index];
      entries.push(`${key}: ${serialize(value[key], depth + 1, seen)}`);
    }
    if (keys.length > 30) entries.push("...");
    return `{${entries.join(", ")}}`;
  } catch {
    return "[Unserializable]";
  }
}

function defineWorkerGlobal(name, value) {
  let prototype = Object.getPrototypeOf(self);
  while (prototype) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (descriptor && descriptor.configurable) {
      try {
        Object.defineProperty(prototype, name, {
          configurable: true,
          value: undefined,
          writable: false,
        });
      } catch {
        // Continue with the Worker instance's own capability surface.
      }
    }
    prototype = Object.getPrototypeOf(prototype);
  }

  try {
    Object.defineProperty(self, name, {
      configurable: false,
      enumerable: false,
      value,
      writable: false,
    });
  } catch {
    try {
      self[name] = value;
    } catch {
      // Some browser globals have non-configurable descriptors.
    }
  }
}

function neutralizeFunctionConstructors() {
  const functionPrototypes = [
    Function.prototype,
    Object.getPrototypeOf(async function () {}),
    Object.getPrototypeOf(function* () {}),
    Object.getPrototypeOf(async function* () {}),
  ];

  for (const prototype of functionPrototypes) {
    try {
      Object.defineProperty(prototype, "constructor", {
        configurable: false,
        value: undefined,
        writable: false,
      });
    } catch {
      // The Worker is disposable; the host watchdog remains the hard stop.
    }
  }
}

function sanitizeError(error) {
  let name = "Error";
  let message = "Execution failed.";
  try {
    if (typeof error?.name === "string") name = error.name.slice(0, MAX_STRING_LENGTH);
    const text = error?.message === undefined ? String(error) : String(error.message);
    message = text.slice(0, MAX_STRING_LENGTH);
  } catch {
    message = "An unprintable error occurred.";
  }
  return { name, message };
}

function clearTrackedTasks(state) {
  for (const timer of state.timers.values()) {
    nativeClearTimeout(timer.nativeId);
  }
  state.timers.clear();
  for (const request of state.requests.values()) {
    request.reject(createError("AbortError", "Execution ended before the request completed."));
  }
  state.requests.clear();
}

function postTerminal(state, status, error = null) {
  if (state.terminal) return;
  state.terminal = true;
  clearTrackedTasks(state);
  nativePostMessage({
    protocol: PROTOCOL_VERSION,
    type: "done",
    executionId: state.executionId,
    status,
    error,
  });
}

function fail(state, error) {
  if (state?.terminal) return;
  postTerminal(state, "error", sanitizeError(error));
}

function postOutput(state, kind, args) {
  if (state.terminal) return;
  state.outputCount += 1;
  if (state.outputCount > MAX_OUTPUT_ENTRIES) {
    if (state.outputCount === MAX_OUTPUT_ENTRIES + 1) {
      nativePostMessage({
        protocol: PROTOCOL_VERSION,
        type: "output",
        executionId: state.executionId,
        sequence: state.sequence++,
        kind: "warn",
        args: ["[Output truncated: maximum 100 log entries reached]"],
      });
    }
    return;
  }

  const serialized = [];
  for (let index = 0; index < Math.min(args.length, 20); index += 1) {
    serialized.push(serialize(args[index]));
  }
  nativePostMessage({
    protocol: PROTOCOL_VERSION,
    type: "output",
    executionId: state.executionId,
    sequence: state.sequence++,
    kind,
    args: serialized,
  });
}

function maybeComplete(state) {
  if (
    state.terminal ||
    !state.rootSettled ||
    state.timers.size > 0 ||
    state.requests.size > 0 ||
    state.activeCallbacks > 0 ||
    state.completionScheduled
  ) {
    return;
  }

  state.completionScheduled = true;
  function waitForUnhandledRejections(remainingTurns) {
    nativeSetTimeout(() => {
      if (state.terminal) return;
      if (
        !state.rootSettled ||
        state.timers.size > 0 ||
        state.requests.size > 0 ||
        state.activeCallbacks > 0
      ) {
        state.completionScheduled = false;
        maybeComplete(state);
        return;
      }
      if (remainingTurns > 0) {
        waitForUnhandledRejections(remainingTurns - 1);
        return;
      }
      state.completionScheduled = false;
      postTerminal(state, "success");
    }, 0);
  }
  NativePromise.resolve().then(() => waitForUnhandledRejections(2));
}

function makeTimerApi(state) {
  function schedule(callback, delay = 0, ...args) {
    if (typeof callback !== "function") {
      throw new TypeError("setTimeout requires a callback function.");
    }
    const numericDelay = Number(delay);
    if (!Number.isFinite(numericDelay) || numericDelay < 0 || numericDelay > MAX_TIMER_DELAY_MS) {
      throw new RangeError("Timer delay must be between 0 and 2000 milliseconds.");
    }
    if (state.timerCount >= MAX_TIMER_COUNT) {
      throw new RangeError("An execution may schedule at most 50 timer callbacks.");
    }

    state.timerCount += 1;
    const id = state.nextTimerId++;
    const nativeId = nativeSetTimeout(() => {
      state.timers.delete(id);
      if (state.terminal) return;

      state.activeCallbacks += 1;
      let callbackResult;
      try {
        callbackResult = callback(...args);
      } catch (error) {
        state.activeCallbacks -= 1;
        fail(state, error);
        return;
      }

      NativePromise.resolve(callbackResult).then(
        () => {
          state.activeCallbacks -= 1;
          maybeComplete(state);
        },
        (error) => {
          state.activeCallbacks -= 1;
          fail(state, error);
        },
      );
    }, numericDelay);
    state.timers.set(id, { nativeId });
    return id;
  }

  function cancel(id) {
    const timer = state.timers.get(id);
    if (!timer) return;
    nativeClearTimeout(timer.nativeId);
    state.timers.delete(id);
    maybeComplete(state);
  }

  return { schedule, cancel };
}

function makeFetchApi(state) {
  function fetchApprovedEndpoint(input, init) {
    if (typeof input !== "string") {
      return NativePromise.reject(new TypeError("Use the exact HTTPS task URL shown in this lesson."));
    }
    if (init !== undefined) {
      if (!init || typeof init !== "object" || Array.isArray(init)) {
        return NativePromise.reject(new TypeError("Only GET requests without custom options are supported."));
      }
      const keys = Object.keys(init);
      if (keys.some((key) => key !== "method") || (init.method !== undefined && init.method !== "GET")) {
        return NativePromise.reject(new TypeError("Only GET requests without headers or a body are supported."));
      }
    }
    if (
      input !== "https://jsonplaceholder.typicode.com/todos/1" &&
      input !== "https://jsonplaceholder.typicode.com/todos/999999999"
    ) {
      return NativePromise.reject(
        new TypeError("This exercise can request only the approved task API endpoint."),
      );
    }
    if (state.fetchCount >= MAX_FETCH_REQUESTS) {
      return NativePromise.reject(new RangeError("An execution may make at most 3 API requests."));
    }

    state.fetchCount += 1;
    const requestId = `fetch-${state.nextRequestId++}`;
    return new NativePromise((resolve, reject) => {
      state.requests.set(requestId, { resolve, reject });
      nativePostMessage({
        protocol: PROTOCOL_VERSION,
        type: "fetch-request",
        executionId: state.executionId,
        requestId,
        url: input,
      });
    });
  }

  return fetchApprovedEndpoint;
}

function isPlainRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function receiveFetchResult(data) {
  const state = runState;
  if (!state || state.terminal || data.executionId !== state.executionId) return;
  if (
    !isPlainRecord(data) ||
    data.protocol !== PROTOCOL_VERSION ||
    data.type !== "fetch-result" ||
    typeof data.requestId !== "string"
  ) {
    fail(state, createError("ProtocolError", "The host sent an invalid API response message."));
    return;
  }

  const pending = state.requests.get(data.requestId);
  if (!pending) return;
  state.requests.delete(data.requestId);

  if (data.error !== undefined) {
    if (!isPlainRecord(data.error) || typeof data.error.name !== "string" || typeof data.error.message !== "string") {
      fail(state, createError("ProtocolError", "The host sent an invalid API error."));
      return;
    }
    const error = createError(data.error.name, data.error.message);
    pending.reject(error);
    maybeComplete(state);
    return;
  }

  if (
    !isPlainRecord(data.result) ||
    ![200, 404].includes(data.result.status) ||
    data.result.ok !== (data.result.status >= 200 && data.result.status < 300) ||
    !isPlainRecord(data.result.data)
  ) {
    fail(state, createError("ProtocolError", "The host sent an invalid API response."));
    return;
  }

  pending.resolve({
    ok: data.result.ok,
    status: data.result.status,
    json: () => NativePromise.resolve(data.result.data),
  });
  maybeComplete(state);
}

function startExecution(data) {
  if (
    runState ||
    !isPlainRecord(data) ||
    data.protocol !== PROTOCOL_VERSION ||
    data.type !== "run" ||
    typeof data.executionId !== "string" ||
    typeof data.code !== "string" ||
    data.code.length > MAX_CODE_LENGTH
  ) {
    return;
  }

  const state = {
    executionId: data.executionId,
    terminal: false,
    outputCount: 0,
    sequence: 0,
    timerCount: 0,
    nextTimerId: 1,
    timers: new Map(),
    activeCallbacks: 0,
    fetchCount: 0,
    nextRequestId: 1,
    requests: new Map(),
    rootSettled: false,
    completionScheduled: false,
  };
  runState = state;
  const timers = makeTimerApi(state);
  const consoleApi = Object.freeze({
    log: (...args) => postOutput(state, "log", args),
    info: (...args) => postOutput(state, "info", args),
    warn: (...args) => postOutput(state, "warn", args),
    error: (...args) => postOutput(state, "error", args),
  });

  neutralizeFunctionConstructors();
  defineWorkerGlobal("XMLHttpRequest", undefined);
  defineWorkerGlobal("WebSocket", undefined);
  defineWorkerGlobal("EventSource", undefined);
  defineWorkerGlobal("Worker", undefined);
  defineWorkerGlobal("SharedWorker", undefined);
  defineWorkerGlobal("BroadcastChannel", undefined);
  defineWorkerGlobal("MessageChannel", undefined);
  defineWorkerGlobal("importScripts", undefined);
  defineWorkerGlobal("indexedDB", undefined);
  defineWorkerGlobal("caches", undefined);
  defineWorkerGlobal("postMessage", undefined);
  defineWorkerGlobal("close", undefined);
  defineWorkerGlobal("addEventListener", undefined);
  defineWorkerGlobal("removeEventListener", undefined);
  defineWorkerGlobal("dispatchEvent", undefined);
  defineWorkerGlobal("onmessage", undefined);
  defineWorkerGlobal("onerror", undefined);
  defineWorkerGlobal("onunhandledrejection", undefined);
  defineWorkerGlobal("eval", undefined);
  defineWorkerGlobal("Function", undefined);
  defineWorkerGlobal("setInterval", undefined);
  defineWorkerGlobal("clearInterval", undefined);
  defineWorkerGlobal("console", consoleApi);
  defineWorkerGlobal("setTimeout", timers.schedule);
  defineWorkerGlobal("clearTimeout", timers.cancel);
  defineWorkerGlobal("fetch", makeFetchApi(state));
  if (self.navigator) {
    try {
      self.navigator.sendBeacon = undefined;
    } catch {
      // The Worker is still constrained by the host protocol and CSP.
    }
  }

  let learnerFunction;
  try {
    learnerFunction = new AsyncFunction(data.code);
  } catch (error) {
    fail(state, error);
    return;
  }

  let rootPromise;
  try {
    rootPromise = learnerFunction();
  } catch (error) {
    fail(state, error);
    return;
  }

  NativePromise.resolve(rootPromise).then(
    () => {
      state.rootSettled = true;
      maybeComplete(state);
    },
    (error) => fail(state, error),
  );
}

nativeAddEventListener("message", (event) => {
  const data = event.data;
  if (!isPlainRecord(data)) {
    if (runState) fail(runState, createError("ProtocolError", "The host sent an invalid message."));
    return;
  }
  if (data.type === "run") {
    startExecution(data);
    return;
  }
  if (data.type === "fetch-result") {
    receiveFetchResult(data);
    return;
  }
  if (runState) fail(runState, createError("ProtocolError", "The host sent an unknown message."));
});

nativeAddEventListener("error", (event) => {
  event.preventDefault();
  fail(runState, event.error || createError("RuntimeError", event.message || "Worker execution failed."));
});

nativeAddEventListener("unhandledrejection", (event) => {
  event.preventDefault();
  fail(runState, event.reason || createError("UnhandledRejectionError", "A Promise rejection was not handled."));
});
