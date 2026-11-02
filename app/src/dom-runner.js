import { DOM_LIMITS, DOM_PROTOCOL } from "./dom-model.js";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateSnapshot(snapshot) {
  if (
    !isRecord(snapshot) ||
    !Array.isArray(snapshot.roots) ||
    !Array.isArray(snapshot.registeredEvents) ||
    snapshot.registeredEvents.length > DOM_LIMITS.MAX_LISTENERS ||
    !(snapshot.focusRequest === null || typeof snapshot.focusRequest === "string")
  ) {
    return false;
  }
  const ids = new Set();
  let nodeCount = 0;
  function validateNode(node, depth) {
    nodeCount += 1;
    if (
      nodeCount > DOM_LIMITS.MAX_NODES ||
      depth > DOM_LIMITS.MAX_DEPTH ||
      !isRecord(node) ||
      typeof node.id !== "string" ||
      !/^dom-node-[1-9]\d{0,2}$/.test(node.id) ||
      ids.has(node.id) ||
      typeof node.tag !== "string" ||
      !["div", "h2", "p", "ul", "li", "button", "form", "label", "input", "output"].includes(node.tag) ||
      !isRecord(node.attributes) ||
      typeof node.text !== "string" ||
      node.text.length > DOM_LIMITS.MAX_STRING_LENGTH ||
      typeof node.value !== "string" ||
      node.value.length > DOM_LIMITS.MAX_STRING_LENGTH ||
      typeof node.checked !== "boolean" ||
      !Array.isArray(node.children)
    ) {
      return false;
    }
    ids.add(node.id);
    for (const [name, value] of Object.entries(node.attributes)) {
      if (!["id", "type", "role", "aria-live", "name"].includes(name) ||
        typeof value !== "string" ||
        value.length > DOM_LIMITS.MAX_STRING_LENGTH
      ) {
        return false;
      }
    }
    return node.children.every((child) => validateNode(child, depth + 1));
  }
  if (!snapshot.roots.every((node) => validateNode(node, 1))) return false;
  if (
    snapshot.focusRequest !== null &&
    !ids.has(snapshot.focusRequest)
  ) {
    return false;
  }
  return snapshot.registeredEvents.every((item) =>
    isRecord(item) &&
    ids.has(item.nodeId) &&
    ["click", "submit", "change"].includes(item.type)
  );
}

function validateWorkerResult(data) {
  if (
    !isRecord(data) ||
    data.protocol !== DOM_PROTOCOL ||
    data.type !== "done" ||
    !Number.isInteger(data.sequence) ||
    !["initial", "interaction"].includes(data.phase) ||
    !["success", "error"].includes(data.status) ||
    !Array.isArray(data.outputs) ||
    data.outputs.length > DOM_LIMITS.MAX_ENTRIES ||
    typeof data.outputTruncated !== "boolean" ||
    !validateSnapshot(data.snapshot)
  ) {
    return false;
  }
  if (
    data.error !== null &&
    (!isRecord(data.error) ||
      typeof data.error.name !== "string" ||
      data.error.name.length > 100 ||
      typeof data.error.message !== "string" ||
      data.error.message.length > DOM_LIMITS.MAX_STRING_LENGTH)
  ) {
    return false;
  }
  return data.outputs.every((entry) =>
    isRecord(entry) &&
    ["log", "info", "warn", "error"].includes(entry.kind) &&
    typeof entry.text === "string" &&
    entry.text.length <= DOM_LIMITS.MAX_STRING_LENGTH
  );
}

function validateInteraction(event, snapshot) {
  if (
    !isRecord(event) ||
    typeof event.nodeId !== "string" ||
    !["click", "submit", "change"].includes(event.type)
  ) {
    return false;
  }
  const node = findSnapshotNode(snapshot.roots, event.nodeId);
  if (
    !node ||
    !snapshot.registeredEvents.some(
      (registration) => registration.nodeId === event.nodeId && registration.type === event.type
    )
  ) {
    return false;
  }
  if (
    (event.type === "submit" && node.tag !== "form") ||
    (event.type === "change" && node.tag !== "input")
  ) {
    return false;
  }
  if (event.value !== undefined &&
    (event.type !== "change" || node.tag !== "input" || typeof event.value !== "string" ||
      event.value.length > DOM_LIMITS.MAX_STRING_LENGTH)
  ) {
    return false;
  }
  if (event.checked !== undefined &&
    (event.type !== "change" || node.tag !== "input" || node.attributes.type !== "checkbox" ||
      typeof event.checked !== "boolean")
  ) {
    return false;
  }
  if (event.formValues !== undefined) {
    if (event.type !== "submit" || !isRecord(event.formValues) ||
      Object.keys(event.formValues).length > 20
    ) return false;
    for (const [id, value] of Object.entries(event.formValues)) {
      const field = findSnapshotNodeByElementId(snapshot.roots, id);
      if (!field || field.tag !== "input" || typeof value !== "string" ||
        value.length > DOM_LIMITS.MAX_STRING_LENGTH
      ) {
        return false;
      }
    }
  }
  return true;
}

function findSnapshotNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = findSnapshotNode(node.children, id);
    if (child) return child;
  }
  return null;
}

function findSnapshotNodeByElementId(nodes, elementId) {
  for (const node of nodes) {
    if (node.attributes.id === elementId) return node;
    const child = findSnapshotNodeByElementId(node.children, elementId);
    if (child) return child;
  }
  return null;
}

/**
 * Runs DOM-mode learner code in a dedicated Worker and validates all messages.
 * The ordinary JavaScript runner and its protocol remain unchanged.
 */
export function createDomRunner(options = {}) {
  const timeoutMs = options.timeoutMs ?? DOM_LIMITS.TIMEOUT_MS;
  let worker = null;
  let runId = null;
  let sequence = 0;
  let interactionId = 0;
  let budgetUsed = 0;
  let previousSnapshot = null;
  let watchdog = null;
  let heartbeatInterval = null;
  let heartbeatTimeout = null;
  let heartbeatCounter = 0;
  let pendingHeartbeatToken = null;
  let interactionHistory = [];
  let outputLimitNotified = false;
  let pendingInteractions = [];
  let destroyed = false;
  let workerAvailable = typeof Worker !== "undefined";
  let currentPhase = null;

  function clearWatchdog() {
    if (watchdog !== null) {
      clearTimeout(watchdog);
      watchdog = null;
    }
  }

  function clearHeartbeat() {
    if (heartbeatInterval !== null) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    if (heartbeatTimeout !== null) {
      clearTimeout(heartbeatTimeout);
      heartbeatTimeout = null;
    }
    pendingHeartbeatToken = null;
  }

  function terminateWorker() {
    clearWatchdog();
    clearHeartbeat();
    pendingInteractions = [];
    if (worker) {
      worker.terminate();
      worker = null;
    }
    runId = null;
    currentPhase = null;
  }

  function finish(status, error, phase = currentPhase) {
    clearWatchdog();
    currentPhase = null;
    if (typeof options.onDone === "function") {
      options.onDone({
        status,
        error,
        phase,
        snapshot: previousSnapshot,
        outputEntries: [],
      });
    }
  }

  function failProtocol(message) {
    const failedPhase = currentPhase;
    terminateWorker();
    finish("error", { name: "ProtocolError", message }, failedPhase);
  }

  function terminateRun(reason, message = "Execution exceeded the time limit and was stopped.") {
    const timedOutPhase = currentPhase;
    terminateWorker();
    finish(reason === "timeout" ? "terminated" : "error", {
      name: reason === "timeout" ? "TimeoutError" : "ExecutionError",
      message,
    }, timedOutPhase);
  }

  function sendPing() {
    if (!worker || !runId || currentPhase || heartbeatTimeout !== null) return;
    const token = `${runId}:${++heartbeatCounter}`;
    pendingHeartbeatToken = token;
    worker.postMessage({ protocol: DOM_PROTOCOL, type: "ping", token });
    heartbeatTimeout = setTimeout(() => {
      if (worker && runId && !currentPhase) {
        terminateRun("timeout", "The DOM training Worker stopped responding and was terminated.");
      }
    }, DOM_LIMITS.HEARTBEAT_TIMEOUT_MS);
  }

  function startHeartbeat() {
    clearHeartbeat();
    if (!worker || !runId || destroyed) return;
    heartbeatInterval = setInterval(sendPing, DOM_LIMITS.HEARTBEAT_MS);
  }

  function setWatchdog(phase) {
    clearWatchdog();
    currentPhase = phase;
    watchdog = setTimeout(() => {
      if (currentPhase === phase) {
        terminateRun("timeout");
      }
    }, timeoutMs);
  }

  function validateAndHandle(data) {
    if (!isRecord(data)) return;
    if (data.type === "pong") {
      if (data.protocol !== DOM_PROTOCOL || data.runId !== runId ||
        typeof data.token !== "string" || data.token !== pendingHeartbeatToken
      ) {
        return;
      }
      if (heartbeatTimeout !== null) {
        clearTimeout(heartbeatTimeout);
        heartbeatTimeout = null;
      }
      pendingHeartbeatToken = null;
      return;
    }
    if (data.runId !== runId) return;
    if (!validateWorkerResult(data)) {
      failProtocol("The DOM training Worker returned an invalid message.");
      return;
    }
    if (data.sequence <= sequence) return;
    if (data.sequence !== sequence + 1) {
      failProtocol("The DOM training Worker returned messages out of order.");
      return;
    }
    if (data.phase !== currentPhase) {
      failProtocol("The DOM training Worker returned a result for an inactive execution.");
      return;
    }

    const budget = 1 + data.outputs.length;
    if (budgetUsed + budget > DOM_LIMITS.MAX_ENTRIES) {
      failProtocol("The DOM training Worker exceeded its message and output limit.");
      return;
    }
    sequence = data.sequence;
    budgetUsed += budget;
    previousSnapshot = data.snapshot;
    if (typeof options.onSnapshot === "function") options.onSnapshot(data.snapshot);
    if (typeof options.onOutput === "function") {
      for (const entry of data.outputs) options.onOutput(entry);
    }
    if (data.outputTruncated && !outputLimitNotified) {
      outputLimitNotified = true;
      if (typeof options.onLimit === "function") {
        options.onLimit(`Output was capped at ${DOM_LIMITS.MAX_ENTRIES} entries.`);
      }
    }

    const completedPhase = currentPhase;
    clearWatchdog();
    currentPhase = null;
    if (data.status !== "success") {
      const error = data.error || { name: "Error", message: "The exercise could not be completed." };
      terminateWorker();
      finish("error", error, completedPhase);
      return;
    }

    if (typeof options.onDone === "function") {
      options.onDone({
        status: "success",
        error: null,
        phase: completedPhase,
        snapshot: previousSnapshot,
        outputEntries: data.outputs.map((entry) => ({ type: entry.kind, text: entry.text })),
        interactions: interactionHistory.map((event) => ({ ...event })),
      });
    }
    if (completedPhase === "interaction" && pendingInteractions.length > 0) {
      sendNextInteraction();
    } else {
      startHeartbeat();
    }
  }

  function createWorker() {
    if (!workerAvailable || destroyed) return false;
    try {
      worker = new Worker(new URL("./dom-worker.js", import.meta.url), { type: "module" });
      worker.onmessage = (event) => validateAndHandle(event.data);
      worker.onerror = (event) => {
        event.preventDefault?.();
        terminateRun("worker-error", "The DOM training Worker encountered an unexpected error.");
      };
      worker.onmessageerror = () => {
        terminateRun("worker-error", "The DOM training Worker returned data that could not be read.");
      };
      return true;
    } catch (error) {
      workerAvailable = false;
      if (typeof options.onDone === "function") {
        options.onDone({
          status: "error",
          phase: "initial",
          error: {
            name: "EnvironmentError",
            message: error?.message || "The DOM training Worker could not be started.",
          },
          snapshot: null,
          outputEntries: [],
        });
      }
      return false;
    }
  }

  function sendNextInteraction() {
    if (!worker || !runId || currentPhase || pendingInteractions.length === 0) return;
    if (budgetUsed + 2 > DOM_LIMITS.MAX_ENTRIES) {
      pendingInteractions = [];
      if (typeof options.onLimit === "function") {
        options.onLimit("This exercise reached its interaction and message limit. Reset it to start again.");
      }
      return;
    }
    const event = pendingInteractions.shift();
    interactionId += 1;
    interactionHistory.push({ ...event });
    budgetUsed += 1;
    setWatchdog("interaction");
    worker.postMessage({
      protocol: DOM_PROTOCOL,
      type: "interaction",
      runId,
      interactionId,
      event,
    });
  }

  return {
    run(code, lessonId) {
      if (destroyed) throw new Error("DOM runner has been destroyed.");
      if (typeof code !== "string" || code.length > DOM_LIMITS.MAX_CODE_LENGTH) {
        if (typeof options.onDone === "function") {
          options.onDone({
            status: "error",
            phase: "initial",
            error: {
              name: "InputError",
              message: `Exercise code is limited to ${DOM_LIMITS.MAX_CODE_LENGTH} characters.`,
            },
            snapshot: null,
            outputEntries: [],
          });
        }
        return null;
      }
      terminateWorker();
      previousSnapshot = null;
      sequence = 0;
      interactionId = 0;
      budgetUsed = 1;
      interactionHistory = [];
      outputLimitNotified = false;
      if (!createWorker()) return null;
      runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      setWatchdog("initial");
      worker.postMessage({
        protocol: DOM_PROTOCOL,
        type: "run",
        runId,
        lessonId,
        code,
      });
      return runId;
    },
    interact(event) {
      if (!worker || !runId || !previousSnapshot || !validateInteraction(event, previousSnapshot)) {
        return false;
      }
      if (interactionId + pendingInteractions.length >= DOM_LIMITS.MAX_ENTRIES) {
        if (typeof options.onLimit === "function") {
          options.onLimit("The controlled preview reached its interaction limit. Reset it to continue.");
        }
        return false;
      }
      pendingInteractions.push(event);
      if (!currentPhase) {
        clearHeartbeat();
        sendNextInteraction();
      }
      return true;
    },
    isAvailable() {
      return workerAvailable;
    },
    isRunning() {
      return currentPhase !== null;
    },
    reset() {
      terminateWorker();
      previousSnapshot = null;
    },
    destroy() {
      destroyed = true;
      terminateWorker();
      previousSnapshot = null;
    },
    _handleWorkerMessage(data) {
      validateAndHandle(data);
    },
    _getState() {
      return {
        runId,
        sequence,
        budgetUsed,
        interactionId,
        currentPhase,
        pendingInteractions: pendingInteractions.length,
      };
    },
  };
}
