import { disableFunctionConstructorAccess } from "./dom-code-policy.js";

export const DOM_BLOCKED_GLOBALS = [
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "WebSocketStream",
  "WebTransport",
  "EventSource",
  "importScripts",
  "location",
  "indexedDB",
  "caches",
  "localStorage",
  "sessionStorage",
  "self",
  "globalThis",
  "document",
  "window",
  "navigator",
  "Worker",
  "SharedWorker",
  "BroadcastChannel",
  "MessageChannel",
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
  "queueMicrotask",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "addEventListener",
  "removeEventListener",
  "dispatchEvent",
  "onmessage",
  "onmessageerror",
  "onerror",
  "close",
  "console",
  "Function",
  "eval",
];

function lockCapability(target, name, value) {
  try {
    Object.defineProperty(target, name, {
      value,
      writable: false,
      configurable: false,
    });
  } catch (error) {
    if (target[name] !== value) {
      throw new Error(`The DOM Worker could not disable the "${name}" capability.`, {
        cause: error,
      });
    }
  }
}

function disableGlobal(scope, name, value = undefined) {
  lockCapability(scope, name, value);
  for (
    let prototype = Object.getPrototypeOf(scope);
    prototype;
    prototype = Object.getPrototypeOf(prototype)
  ) {
    if (Object.prototype.hasOwnProperty.call(prototype, name)) {
      lockCapability(prototype, name, value);
    }
  }
}

export function disableDomWorkerCapabilities(scope) {
  const nativePostMessage = scope.postMessage.bind(scope);
  const nativeAddEventListener = scope.addEventListener.bind(scope);
  const NativeFunction = scope.Function;
  const trustedFunction = (body) => NativeFunction(`return ${body}`)();

  for (const name of DOM_BLOCKED_GLOBALS) disableGlobal(scope, name);
  disableGlobal(scope, "postMessage", () => {});
  disableFunctionConstructorAccess([
    NativeFunction.prototype,
    Object.getPrototypeOf(trustedFunction("async function () {}")),
    Object.getPrototypeOf(trustedFunction("function* () {}")),
    Object.getPrototypeOf(trustedFunction("async function* () {}")),
  ]);

  return {
    nativePostMessage,
    nativeAddEventListener,
    NativeFunction,
  };
}
