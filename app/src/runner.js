/**
 * runner.js — Secure JavaScript Execution Boundary.
 *
 * Implements Phase 3 execution boundary conforming to:
 * - constitution.md § Principle VIII & §5
 * - architecture-spec.md §5 (Web Worker thread isolation & watchdog termination)
 * - feature-spec-playground.md §4 (Scenarios A through J), §6, §7
 *
 * Thread & Capability Isolation:
 * - Runs learner code in a dedicated Web Worker on an independent OS thread.
 * - If code enters an infinite loop (e.g. while(true){}), the parent UI thread does not freeze.
 * - Parent watchdog timer terminates the worker (worker.terminate()) and respawns a fresh worker.
 * - Global capabilities (fetch, XHR, WebSocket, importScripts) are neutralized inside the worker scope.
 * - Learner code has zero access to parent DOM, cookies, or localStorage.
 * - Output entries capped at 100 lines; entry strings capped at 2,000 characters.
 * - Output rendered strictly as text nodes (document.createTextNode) on the host UI.
 */

import { assertNoDynamicImports } from "./dom-code-policy.js";

export const RUNNER_LIMITS = {
  TIMEOUT_MS: 5000,
  MAX_ENTRIES: 100,
  MAX_ENTRY_LENGTH: 2000,
  MAX_ARGUMENTS: 20,
};

/**
 * Worker bootstrap script string executed inside the dedicated Web Worker.
 */
export const WORKER_BOOTSTRAP_CODE = `(() => {
// ── 1. Security: Neutralize Prohibited Capabilities ─────────────────────────
const nativePostMessage = self.postMessage.bind(self);
const NativeFunction = Function;
let bootstrapError = null;

try {
  self.fetch = undefined;
  self.XMLHttpRequest = undefined;
  self.WebSocket = undefined;
  self.EventSource = undefined;
  if (self.navigator) {
    self.navigator.sendBeacon = undefined;
  }
  self.importScripts = undefined;
  self.indexedDB = undefined;
  self.caches = undefined;
} catch (e) {
  bootstrapError = e;
}

try {
  Object.defineProperty(self, "indexedDB", {
    value: undefined,
    configurable: false,
    writable: false,
  });
  Object.defineProperty(self, "caches", {
    value: undefined,
    configurable: false,
    writable: false,
  });
} catch (error) {
  bootstrapError = error;
}

try {
  const functionPrototypes = [
    Function.prototype,
    Object.getPrototypeOf(async function () {}),
    Object.getPrototypeOf(function* () {}),
    Object.getPrototypeOf(async function* () {}),
  ];
  for (const prototype of new Set(functionPrototypes)) {
    Object.defineProperty(prototype, "constructor", {
      value: undefined,
      configurable: false,
      writable: false,
    });
  }
  for (const name of ["Function", "eval", "postMessage"]) {
    Object.defineProperty(self, name, {
      value: undefined,
      configurable: false,
      writable: false,
    });
    if (self[name] !== undefined) {
      throw new Error("Unable to disable " + name + " in the exercise Worker.");
    }
  }
} catch (error) {
  bootstrapError = error;
}

let activeExecutionId = null;
let logCount = 0;
let isTerminal = false;
const MAX_ENTRIES = ${RUNNER_LIMITS.MAX_ENTRIES};
const MAX_LENGTH = ${RUNNER_LIMITS.MAX_ENTRY_LENGTH};
const MAX_ARGUMENTS = ${RUNNER_LIMITS.MAX_ARGUMENTS};

function truncate(value) {
  const suffix = "... [truncated]";
  return value.length > MAX_LENGTH ? value.slice(0, MAX_LENGTH - suffix.length) + suffix : value;
}

function postDone(executionId, status, error = null) {
  if (activeExecutionId !== executionId || isTerminal) return;
  isTerminal = true;
  nativePostMessage({
    type: "done",
    executionId,
    status,
    error,
  });
}

function safeError(error) {
  let name = "Error";
  let message = "Execution failed.";
  try {
    if (typeof error?.name === "string") name = error.name.slice(0, MAX_LENGTH);
    message = String(error?.message ?? error).slice(0, MAX_LENGTH);
  } catch {
    message = "An unprintable error occurred.";
  }
  return { name, message };
}

// ── 2. Safe Object & Argument Serialization ──────────────────────────────────
function safeSerialize(val, depth = 0, seen = new WeakSet()) {
  try {
    if (depth > 3) return "[Object]";
    if (val === null) return "null";
    if (val === undefined) return "undefined";
    if (typeof val === "string") return truncate(val);
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (typeof val === "bigint") return val.toString() + "n";
    if (typeof val === "symbol") return val.toString();
    if (typeof val === "function") return "[Function" + (val.name ? ": " + val.name : "") + "]";
    if (val instanceof Error) return truncate(val.name + ": " + val.message);

    if (typeof val === "object") {
      if (seen.has(val)) return "[Circular]";
      seen.add(val);
      if (Array.isArray(val)) {
        const length = Math.min(val.length, 50);
        const items = [];
        for (let index = 0; index < length; index += 1) {
          items.push(safeSerialize(val[index], depth + 1, seen));
        }
        if (val.length > 50) items.push("... " + (val.length - 50) + " more items");
        return truncate("[" + items.join(", ") + "]");
      }
      const keys = Object.keys(val);
      const props = [];
      for (let index = 0; index < Math.min(keys.length, 30); index += 1) {
        const key = keys[index];
        props.push(key + ": " + safeSerialize(val[key], depth + 1, seen));
      }
      if (keys.length > 30) props.push("...");
      return truncate("{" + props.join(", ") + "}");
    }
    return truncate(String(val));
  } catch {
    return "[Unserializable]";
  }
}

// ── 3. Output Interception & Truncation ───────────────────────────────────────
function sendOutput(kind, rawArgs) {
  if (!activeExecutionId || isTerminal) return;
  logCount++;
  if (logCount === MAX_ENTRIES + 1) {
    nativePostMessage({
      type: "output",
      executionId: activeExecutionId,
      kind: "warn",
      args: ["[Output truncated: maximum " + MAX_ENTRIES + " log entries reached]"]
    });
    return;
  }
  if (logCount > MAX_ENTRIES) return;

  const serialized = [];
  const serializedCount = rawArgs.length > MAX_ARGUMENTS ? MAX_ARGUMENTS - 1 : rawArgs.length;
  for (let index = 0; index < serializedCount; index += 1) {
    serialized.push(truncate(safeSerialize(rawArgs[index])));
  }
  if (rawArgs.length > MAX_ARGUMENTS) {
    serialized.push(truncate("... " + (rawArgs.length - serializedCount) + " more arguments"));
  }

  nativePostMessage({
    type: "output",
    executionId: activeExecutionId,
    kind,
    args: serialized
  });
}

// Intercept console logging
self.console.log = (...args) => sendOutput("log", args);
self.console.info = (...args) => sendOutput("info", args);
self.console.warn = (...args) => sendOutput("warn", args);
self.console.error = (...args) => sendOutput("error", args);

// ── 4. Execution Message Handler ─────────────────────────────────────────────
self.onmessage = function(e) {
  const data = e.data;
  if (!data || data.type !== "run" || !data.executionId) return;

  activeExecutionId = data.executionId;
  logCount = 0;
  isTerminal = false;

  if (bootstrapError) {
    postDone(data.executionId, "error", {
      name: "SecurityError",
      message: "The exercise Worker could not disable restricted capabilities.",
    });
    return;
  }

  try {
    const runner = new NativeFunction(data.code);
    const result = runner();

    if (result && typeof result.then === "function") {
      result.then(() => {
        postDone(data.executionId, "success");
      }).catch(err => {
        postDone(data.executionId, "error", safeError(err));
      });
    } else {
      postDone(data.executionId, "success");
    }
  } catch (err) {
    postDone(data.executionId, "error", safeError(err));
  }
};
})();`;

/**
 * Creates a unique execution UUID.
 * @returns {string}
 */
export function generateExecutionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "exec-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

/**
 * Creates an isolated execution runner instance.
 *
 * @param {Object} [options={}]
 * @param {number} [options.timeoutMs=5000] Watchdog timer timeout in milliseconds.
 * @param {Function} [options.onOutput] Callback fired on console output.
 * @param {Function} [options.onDone] Callback fired when execution completes.
 * @param {Function} [options.onTerminated] Callback fired when execution times out.
 * @returns {Object} Runner controller handle.
 */
export function createRunner(options = {}) {
  const timeoutMs = options.timeoutMs ?? RUNNER_LIMITS.TIMEOUT_MS;
  let worker = null;
  let blobUrl = null;
  let activeExecutionId = null;
  let watchdogTimer = null;
  let isDestroyed = false;
  let outputEntryCount = 0;
  let outputLimitReported = false;

  /**
   * Initializes or recreates the background Web Worker.
   */
  function initWorker() {
    if (isDestroyed) return;
    if (worker) {
      try {
        worker.terminate();
      } catch {
        // Ignore termination errors on dead workers
      }
      worker = null;
    }
    if (blobUrl) {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch {
        // Ignore
      }
      blobUrl = null;
    }

    if (typeof Worker !== "undefined") {
      try {
        const blob = new Blob([WORKER_BOOTSTRAP_CODE], { type: "application/javascript" });
        blobUrl = URL.createObjectURL(blob);
        worker = new Worker(blobUrl);

        worker.onmessage = (e) => {
          handleWorkerMessage(e.data);
        };

        worker.onerror = (err) => {
          handleWorkerError(err);
        };
      } catch {
        worker = null;
      }
    }
  }

  function clearWatchdog() {
    if (watchdogTimer !== null) {
      clearTimeout(watchdogTimer);
      watchdogTimer = null;
    }
  }

  function handleWorkerMessage(data) {
    if (!data || typeof data !== "object") {
      // Discard invalid non-object payload
      return;
    }

    if (typeof data.executionId !== "string" || data.executionId !== activeExecutionId) {
      // Discard stale or foreign message
      return;
    }

    if (data.type === "output") {
      if (outputEntryCount >= RUNNER_LIMITS.MAX_ENTRIES) {
        if (!outputLimitReported) {
          outputLimitReported = true;
          if (typeof options.onOutput === "function") {
            options.onOutput({
              executionId: data.executionId,
              kind: "warn",
              args: [`[Output truncated: maximum ${RUNNER_LIMITS.MAX_ENTRIES} log entries reached]`],
            });
          }
        }
        return;
      }
      outputEntryCount += 1;

      if (typeof options.onOutput === "function") {
        const validKinds = ["log", "info", "warn", "error"];
        const kind = validKinds.includes(data.kind) ? data.kind : "log";
        const rawArgs = Array.isArray(data.args)
          ? data.args
          : [data.args !== undefined && data.args !== null ? String(data.args) : ""];

        // Cap args list length to prevent UI flooding from malicious payloads
        const sanitizedArgs = rawArgs.slice(0, RUNNER_LIMITS.MAX_ARGUMENTS).map((arg) => {
          const str = typeof arg === "string" ? arg : String(arg ?? "");
          return str.length > RUNNER_LIMITS.MAX_ENTRY_LENGTH
            ? str.slice(0, RUNNER_LIMITS.MAX_ENTRY_LENGTH) + "... [truncated]"
            : str;
        });

        options.onOutput({
          executionId: data.executionId,
          kind,
          args: sanitizedArgs,
        });
      }
      return;
    }

    if (data.type === "done") {
      clearWatchdog();
      const currentId = activeExecutionId;
      activeExecutionId = null;
      initWorker();

      if (typeof options.onDone === "function") {
        const validStatuses = ["success", "error", "terminated"];
        const status = validStatuses.includes(data.status) ? data.status : "error";
        let error = null;
        if (data.error && typeof data.error === "object") {
          error = {
            name: typeof data.error.name === "string" ? data.error.name : "Error",
            message:
              typeof data.error.message === "string"
                ? data.error.message
                : String(data.error.message || "Unknown error"),
          };
        } else if (data.error) {
          error = {
            name: "Error",
            message: String(data.error),
          };
        }

        options.onDone({
          executionId: currentId,
          status,
          error,
        });
      }
    }
  }

  function handleWorkerError(err) {
    clearWatchdog();
    const currentId = activeExecutionId;
    activeExecutionId = null;

    // Resiliently terminate crashed worker and recreate fresh worker instance
    if (worker) {
      try {
        worker.terminate();
      } catch {
        // Ignore
      }
      worker = null;
    }
    initWorker();

    if (typeof options.onDone === "function" && currentId !== null) {
      options.onDone({
        executionId: currentId,
        status: "error",
        error: {
          name: "RuntimeError",
          message: err?.message || "Execution error in sandbox worker",
        },
      });
    }
  }

  function terminateActive(reason = "timeout") {
    clearWatchdog();
    const timedOutId = activeExecutionId;
    activeExecutionId = null;

    // Hard kill the background thread
    if (worker) {
      try {
        worker.terminate();
      } catch {
        // Ignore
      }
      worker = null;
    }

    // Immediately spawn a fresh worker for subsequent executions
    initWorker();

    if (typeof options.onTerminated === "function") {
      options.onTerminated({
        executionId: timedOutId,
        reason,
        message: `Execution was terminated because it exceeded the ${timeoutMs}ms time limit.`,
      });
    }

    if (typeof options.onDone === "function") {
      options.onDone({
        executionId: timedOutId,
        status: "terminated",
        error: {
          name: "TimeoutError",
          message: `Execution was terminated because it exceeded the ${timeoutMs}ms time limit.`,
        },
      });
    }
  }

  // Initialize the worker initially
  initWorker();

  return {
    /**
     * Executes code in the isolated environment.
     * @param {string} code - The learner's code.
     * @param {number} [customTimeout] - Optional custom timeout in ms.
     * @returns {string} The assigned execution ID.
     */
    run(code, customTimeout = timeoutMs) {
      if (isDestroyed) {
        throw new Error("Runner has been destroyed");
      }

      // If an existing run is in progress, cancel and terminate it
      if (activeExecutionId !== null) {
        terminateActive("superseded");
      }

      activeExecutionId = generateExecutionId();
      const runId = activeExecutionId;
      outputEntryCount = 0;
      outputLimitReported = false;
      const source = code ?? "";

      try {
        if (typeof source !== "string") {
          throw new TypeError("Exercise code must be a string.");
        }
        assertNoDynamicImports(source);
      } catch (error) {
        activeExecutionId = null;
        if (typeof options.onDone === "function") {
          options.onDone({
            executionId: runId,
            status: "error",
            error: {
              name: typeof error?.name === "string" ? error.name : "SyntaxError",
              message: typeof error?.message === "string" ? error.message : "Exercise code could not be parsed.",
            },
          });
        }
        return runId;
      }

      // Start the watchdog timer on the main application thread
      clearWatchdog();
      watchdogTimer = setTimeout(() => {
        if (activeExecutionId === runId) {
          terminateActive("timeout");
        }
      }, customTimeout);

      if (!worker) {
        // If worker is unavailable, report immediate error
        clearWatchdog();
        activeExecutionId = null;
        setTimeout(() => {
          if (typeof options.onDone === "function") {
            options.onDone({
              executionId: runId,
              status: "error",
              error: {
                name: "EnvironmentError",
                message: "Web Worker execution environment is not available in this browser.",
              },
            });
          }
        }, 0);
        return runId;
      }

      // Send the execution request as a pure structured data message (no HTML interpolation)
      worker.postMessage({
        type: "run",
        executionId: runId,
        code: source,
        timeoutMs: customTimeout,
      });

      return runId;
    },

    /**
     * Forcibly terminates the current execution and resets the environment.
     */
    terminate() {
      terminateActive("manual");
    },

    /**
     * Returns true if worker environment is available.
     */
    isAvailable() {
      return worker !== null;
    },

    /**
     * Returns the active execution ID, or null if idle.
     */
    getActiveExecutionId() {
      return activeExecutionId;
    },

    /**
     * Shuts down the runner permanently.
     */
    destroy() {
      isDestroyed = true;
      clearWatchdog();
      activeExecutionId = null;
      if (worker) {
        try {
          worker.terminate();
        } catch {
          // Ignore
        }
        worker = null;
      }
      if (blobUrl) {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch {
          // Ignore
        }
        blobUrl = null;
      }
    },

    /**
     * Internal handle to simulate incoming worker messages in test suites.
     * @private
     */
    _handleWorkerMessage(data) {
      handleWorkerMessage(data);
    },

    /**
     * Internal handle to simulate worker errors / crashes in test suites.
     * @private
     */
    _handleWorkerError(err) {
      handleWorkerError(err);
    },
  };
}
