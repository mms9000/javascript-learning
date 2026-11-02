import { describe, expect, it } from "vitest";
import { createContext, runInContext } from "node:vm";
import {
  assertNoDynamicImports,
  disableFunctionConstructorAccess,
} from "./dom-code-policy.js";
import { disableDomWorkerCapabilities } from "./dom-worker-capabilities.js";

describe("DOM learner-code policy", () => {
  it("rejects dynamic imports wherever they occur in parsed JavaScript", () => {
    const sources = [
      'import("/src/dom-model.js");',
      'import("https://example.invalid/module.js");',
      'import("data:text/javascript,export default 1");',
      'import("blob:https://example.invalid/id");',
      'import("file:///module.js");',
      'async function load() { return await import(/* hidden */ "data:text/javascript,"); }',
      'button.addEventListener("click", () => import(url));',
      'Promise.resolve().then(function () { return import(url); });',
      'const result = `${import(url)}`;',
    ];

    for (const source of sources) {
      expect(() => assertNoDynamicImports(source)).toThrow(/Dynamic import\(\) is unavailable/);
    }
  });

  it("does not mistake import-like strings, comments, or properties for imports", () => {
    expect(() => assertNoDynamicImports(`
      // import("comment")
      const text = 'import("string")';
      object.import("property");
      console.log(text);
    `)).not.toThrow();
  });

  it("fails closed for malformed source", () => {
    expect(() => assertNoDynamicImports("if (")).toThrow(SyntaxError);
  });

  it("blocks indirect dynamic code constructors while preserving function execution", () => {
    const context = createContext({});
    const prototypes = runInContext(`[
      Object.getPrototypeOf(function () {}),
      Object.getPrototypeOf(async function () {}),
      Object.getPrototypeOf(function* () {}),
      Object.getPrototypeOf(async function* () {}),
    ]`, context);

    disableFunctionConstructorAccess(prototypes);
    runInContext(`Object.defineProperty(globalThis, "Function", {
      value: undefined,
      writable: false,
      configurable: false,
    });`, context);

    expect(runInContext(`[
      typeof Function,
      typeof (function () {}).constructor,
      typeof (async function () {}).constructor,
      typeof (function* () {}).constructor,
      typeof (async function* () {}).constructor,
      typeof ({}).constructor.constructor,
      (() => 42)(),
    ]`, context)).toEqual([
      "undefined",
      "undefined",
      "undefined",
      "undefined",
      "undefined",
      "undefined",
      42,
    ]);
  });

  it("disables network, storage, host, and nested-worker capabilities", () => {
    const context = createContext({
      postMessage() {},
      addEventListener() {},
    });
    const scope = runInContext("globalThis", context);
    const bridge = disableDomWorkerCapabilities(scope);

    expect(runInContext(`[
      typeof fetch,
      typeof XMLHttpRequest,
      typeof WebSocket,
      typeof WebTransport,
      typeof EventSource,
      typeof importScripts,
      typeof indexedDB,
      typeof caches,
      typeof localStorage,
      typeof sessionStorage,
      typeof location,
      typeof self,
      typeof globalThis,
      typeof document,
      typeof window,
      typeof navigator,
      typeof Worker,
      typeof SharedWorker,
      typeof BroadcastChannel,
      typeof MessageChannel,
      typeof setTimeout,
      typeof setInterval,
      typeof Function,
      typeof eval,
    ]`, context)).toEqual(Array(24).fill("undefined"));
    expect(bridge.nativePostMessage).toBeTypeOf("function");
    expect(bridge.nativeAddEventListener).toBeTypeOf("function");
  });
});
