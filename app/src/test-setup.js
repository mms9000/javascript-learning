/**
 * test-setup.js — Global setup for Vitest / jsdom environment.
 *
 * Provides browser globals that jsdom does not include but that
 * CodeMirror and other DOM-heavy libraries expect to be present.
 */

// requestAnimationFrame — required by CodeMirror 6 view updates
const raf = (cb) => setTimeout(cb, 0);
const cafs = (id) => clearTimeout(id);
globalThis.requestAnimationFrame = raf;
globalThis.cancelAnimationFrame = cafs;
if (typeof window !== "undefined") {
  window.requestAnimationFrame = raf;
  window.cancelAnimationFrame = cafs;
}

// ResizeObserver — required by CodeMirror 6
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = MockResizeObserver;
if (typeof window !== "undefined") {
  window.ResizeObserver = MockResizeObserver;
}

// matchMedia — expected by some UI libraries
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Range measurement mocks for CodeMirror in jsdom
if (typeof document !== "undefined") {
  document.createRange = () => {
    const range = new Range();
    range.getBoundingClientRect = () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    range.getClientRects = () => ({
      item: () => null,
      length: 0,
      [Symbol.iterator]: function* () {},
    });
    return range;
  };
}

// URL objectURL mocks for Blob workers in jsdom
if (typeof URL !== "undefined") {
  if (typeof URL.createObjectURL !== "function") {
    URL.createObjectURL = () => "blob:mock-worker-" + Math.random().toString(36).slice(2);
  }
  if (typeof URL.revokeObjectURL !== "function") {
    URL.revokeObjectURL = () => {};
  }
}

// MockWorker for jsdom test environment
if (typeof Worker === "undefined") {
  class MockWorker {
    constructor(scriptUrl) {
      this.scriptUrl = scriptUrl;
      this.onmessage = null;
      this.onerror = null;
      this.terminated = false;
    }

    postMessage(data) {
      if (this.terminated) return;

      setTimeout(() => {
        if (this.terminated) return;
        if (!data || data.type !== "run" || !data.executionId) return;

        // If testing timeout / infinite loop, do not post back to simulate hang
        if (data.code && (data.code.includes("while (true)") || data.code.includes("HANG_TEST"))) {
          return;
        }

        const MAX_ENTRIES = 100;
        const MAX_LENGTH = 2000;
        let logCount = 0;

        function safeSerialize(val, depth = 0, seen = new WeakSet()) {
          if (depth > 3) return "[Object]";
          if (val === null) return "null";
          if (val === undefined) return "undefined";
          if (typeof val === "string") return val.length > MAX_LENGTH ? val.slice(0, MAX_LENGTH) + "... [truncated]" : val;
          if (typeof val === "number" || typeof val === "boolean") return String(val);
          if (typeof val === "bigint") return val.toString() + "n";
          if (typeof val === "symbol") return val.toString();
          if (typeof val === "function") return "[Function" + (val.name ? ": " + val.name : "") + "]";
          if (val instanceof Error) return val.name + ": " + val.message;
          if (typeof val === "object") {
            if (seen.has(val)) return "[Circular]";
            seen.add(val);
            try {
              if (Array.isArray(val)) {
                const items = val.slice(0, 50).map((item) => safeSerialize(item, depth + 1, seen));
                if (val.length > 50) items.push("... " + (val.length - 50) + " more items");
                return "[" + items.join(", ") + "]";
              }
              const keys = Object.keys(val).slice(0, 30);
              const props = keys.map((k) => k + ": " + safeSerialize(val[k], depth + 1, seen));
              if (Object.keys(val).length > 30) props.push("...");
              return "{" + props.join(", ") + "}";
            } catch {
              return String(val);
            }
          }
          return String(val);
        }

        const sendOutput = (kind, rawArgs) => {
          if (this.terminated) return;
          logCount++;
          if (logCount === MAX_ENTRIES + 1) {
            if (this.onmessage) {
              this.onmessage({
                data: {
                  type: "output",
                  executionId: data.executionId,
                  kind: "warn",
                  args: ["[Output truncated: maximum " + MAX_ENTRIES + " log entries reached]"],
                },
              });
            }
            return;
          }
          if (logCount > MAX_ENTRIES) return;

          const serialized = rawArgs.map((arg) => {
            const s = safeSerialize(arg);
            return s.length > MAX_LENGTH ? s.slice(0, MAX_LENGTH) + "... [truncated]" : s;
          });

          if (this.onmessage) {
            this.onmessage({
              data: {
                type: "output",
                executionId: data.executionId,
                kind,
                args: serialized,
              },
            });
          }
        };

        const mockConsole = {
          log: (...args) => sendOutput("log", args),
          info: (...args) => sendOutput("info", args),
          warn: (...args) => sendOutput("warn", args),
          error: (...args) => sendOutput("error", args),
        };

        const mockSelf = {
          fetch: undefined,
          XMLHttpRequest: undefined,
          WebSocket: undefined,
          indexedDB: undefined,
          caches: undefined,
          console: mockConsole,
        };

        try {
          const runnerFn = new Function(
            "console",
            "window",
            "document",
            "localStorage",
            "sessionStorage",
            "fetch",
            "XMLHttpRequest",
            "WebSocket",
            "indexedDB",
            "caches",
            "self",
            data.code
          );
          const result = runnerFn(
            mockConsole,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            mockSelf
          );

          if (result && typeof result.then === "function") {
            result.then(() => {
              if (this.terminated) return;
              if (this.onmessage) {
                this.onmessage({
                  data: {
                    type: "done",
                    executionId: data.executionId,
                    status: "success",
                    error: null,
                  },
                });
              }
            }).catch((err) => {
              if (this.terminated) return;
              if (this.onmessage) {
                this.onmessage({
                  data: {
                    type: "done",
                    executionId: data.executionId,
                    status: "error",
                    error: {
                      name: err ? err.name || "Error" : "Error",
                      message: err ? err.message || String(err) : "Unknown error",
                    },
                  },
                });
              }
            });
          } else {
            if (this.terminated) return;
            if (this.onmessage) {
              this.onmessage({
                data: {
                  type: "done",
                  executionId: data.executionId,
                  status: "success",
                  error: null,
                },
              });
            }
          }
        } catch (err) {
          if (this.terminated) return;
          if (this.onmessage) {
            this.onmessage({
              data: {
                type: "done",
                executionId: data.executionId,
                status: "error",
                error: {
                  name: err ? err.name || "Error" : "Error",
                  message: err ? err.message || String(err) : "Unknown error",
                },
              },
            });
          }
        }
      }, 10);
    }

    terminate() {
      this.terminated = true;
    }

    addEventListener(type, listener) {
      if (type === "message") this.onmessage = listener;
      if (type === "error") this.onerror = listener;
    }

    removeEventListener() {}
  }

  globalThis.Worker = MockWorker;
  if (typeof window !== "undefined") {
    window.Worker = MockWorker;
  }
}


