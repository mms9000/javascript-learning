import { createDomModel, DOM_LIMITS, DOM_PROTOCOL } from "./dom-model.js";
import { assertNoDynamicImports } from "./dom-code-policy.js";
import {
  disableDomWorkerCapabilities,
  DOM_BLOCKED_GLOBALS,
} from "./dom-worker-capabilities.js";

const scope = globalThis;
const {
  nativePostMessage,
  nativeAddEventListener,
  NativeFunction,
} = disableDomWorkerCapabilities(scope);

let runId = null;
let sequence = 0;
let budgetUsed = 0;
let interactionCount = 0;
let model = null;
let phase = "idle";
let phaseOutput = [];
let outputCount = 0;
let outputTruncated = false;

function sendDone(status, error = null, completedPhase) {
  if (!model || !runId) return;
  const snapshot = model.snapshot();
  const availableOutput = Math.max(0, DOM_LIMITS.MAX_ENTRIES - budgetUsed - 1);
  const outputs = phaseOutput.slice(0, availableOutput);
  budgetUsed += 1 + outputs.length;
  phaseOutput = [];
  phase = "idle";
  nativePostMessage({
    protocol: DOM_PROTOCOL,
    type: "done",
    runId,
    sequence: ++sequence,
    phase: completedPhase,
    status,
    error,
    snapshot,
    outputs,
    outputTruncated,
  });
}

function serialize(value) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (typeof value === "function") return "[Function]";
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (Array.isArray(value)) {
    return `[${value.slice(0, 20).map(serialize).join(", ")}${value.length > 20 ? ", …" : ""}]`;
  }
  return "[Object]";
}

const consoleFacade = Object.freeze({
  log: (...args) => captureOutput("log", args),
  info: (...args) => captureOutput("info", args),
  warn: (...args) => captureOutput("warn", args),
  error: (...args) => captureOutput("error", args),
});

function captureOutput(kind, args) {
  if (phase === "idle") return;
  if (outputCount >= DOM_LIMITS.MAX_ENTRIES) {
    if (!outputTruncated) {
      outputTruncated = true;
      phaseOutput.push({
        kind: "warn",
        text: `[Output truncated: maximum ${DOM_LIMITS.MAX_ENTRIES} entries reached]`,
      });
    }
    return;
  }
  const remaining = DOM_LIMITS.MAX_ENTRIES - budgetUsed - phaseOutput.length - 1;
  if (remaining <= 0) {
    outputTruncated = true;
    return;
  }
  outputCount += 1;
  const rendered = args.map((value) => {
    let text;
    try {
      text = serialize(value);
    } catch {
      text = "[Unserializable]";
    }
    return text.length > DOM_LIMITS.MAX_STRING_LENGTH
      ? `${text.slice(0, DOM_LIMITS.MAX_STRING_LENGTH)}... [truncated]`
      : text;
  });
  phaseOutput.push({ kind, text: rendered.join(" ") });
}

function normalizeError(error) {
  let name = "Error";
  let message = "The exercise could not be completed.";
  try {
    if (typeof error?.name === "string") name = error.name.slice(0, 100);
  } catch {
    name = "Error";
  }
  try {
    if (typeof error?.message === "string") {
      message = error.message.slice(0, DOM_LIMITS.MAX_STRING_LENGTH);
    }
  } catch {
    message = "The exercise could not be completed.";
  }
  return {
    name,
    message,
  };
}

function runCode(code) {
  phase = "running";
  phaseOutput = [];
  const blockedNames = [...new Set([
    "self",
    "globalThis",
    "postMessage",
    "close",
    "addEventListener",
    "removeEventListener",
    "dispatchEvent",
    ...DOM_BLOCKED_GLOBALS,
  ])].filter((name) =>
    name !== "document" && name !== "console" && name !== "eval"
  );
  const parameters = ["document", "console", ...blockedNames];
  const args = [model.document, consoleFacade, ...blockedNames.map(() => undefined)];

  try {
    assertNoDynamicImports(code);
    const execute = new NativeFunction(...parameters, `"use strict";\n${code}`);
    execute(...args);
    sendDone("success", null, "initial");
  } catch (error) {
    sendDone("error", normalizeError(error), "initial");
  }
}

function handleRun(data) {
  if (
    typeof data.runId !== "string" ||
    data.runId.length === 0 ||
    data.runId.length > 100 ||
    typeof data.lessonId !== "string" ||
    !["m6-l2", "m6-l3", "m6-l4"].includes(data.lessonId) ||
    typeof data.code !== "string" ||
    data.code.length > DOM_LIMITS.MAX_CODE_LENGTH
  ) {
    return;
  }
  runId = data.runId;
  sequence = 0;
  budgetUsed = 1;
  interactionCount = 0;
  outputCount = 0;
  outputTruncated = false;
  model = createDomModel(data.lessonId);
  runCode(data.code);
}

function handleInteraction(data) {
  if (
    phase !== "idle" ||
    !model ||
    data.runId !== runId ||
    !Number.isInteger(data.interactionId) ||
    data.interactionId !== interactionCount + 1 ||
    interactionCount >= DOM_LIMITS.MAX_ENTRIES ||
    budgetUsed + 2 > DOM_LIMITS.MAX_ENTRIES ||
    !data.event ||
    typeof data.event !== "object"
  ) {
    return;
  }
  interactionCount += 1;
  budgetUsed += 1;
  phase = "running";
  phaseOutput = [];
  try {
    model.dispatch(data.event);
    sendDone("success", null, "interaction");
  } catch (error) {
    sendDone("error", normalizeError(error), "interaction");
  }
}

nativeAddEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object" || data.protocol !== DOM_PROTOCOL) return;

  if (data.type === "ping" && typeof data.token === "string" && data.token.length <= 100) {
      nativePostMessage({ protocol: DOM_PROTOCOL, type: "pong", runId, token: data.token });
    return;
  }

  if (data.type === "run" && !model) {
    handleRun(data);
    return;
  }

  if (data.type === "interaction") {
    handleInteraction(data);
  }
});
