import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDomModel, DOM_PROTOCOL } from "./dom-model.js";
import { createDomRunner } from "./dom-runner.js";

class FakeWorker {
  static instances = [];

  constructor(url, options) {
    this.url = url;
    this.options = options;
    this.messages = [];
    this.terminated = false;
    FakeWorker.instances.push(this);
  }

  postMessage(message) {
    this.messages.push(message);
  }

  terminate() {
    this.terminated = true;
  }

  respond(message) {
    this.onmessage?.({ data: message });
  }
}

function doneMessage(runId, phase, sequence, snapshot, outputs = []) {
  return {
    protocol: DOM_PROTOCOL,
    type: "done",
    runId,
    phase,
    sequence,
    status: "success",
    error: null,
    snapshot,
    outputs,
    outputTruncated: false,
  };
}

describe("createDomRunner()", () => {
  let runner;

  beforeEach(() => {
    FakeWorker.instances = [];
    vi.stubGlobal("Worker", FakeWorker);
  });

  afterEach(() => {
    runner?.destroy();
    runner = null;
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("uses a separate module Worker and delivers bounded, validated snapshots", () => {
    const onSnapshot = vi.fn();
    const onDone = vi.fn();
    runner = createDomRunner({ onSnapshot, onDone });

    const runId = runner.run("console.log('ready')", "m6-l2");
    const worker = FakeWorker.instances[0];
    expect(worker.options).toEqual({ type: "module" });
    expect(worker.messages[0]).toMatchObject({
      protocol: DOM_PROTOCOL,
      type: "run",
      runId,
      lessonId: "m6-l2",
    });

    const model = createDomModel("m6-l2");
    worker.respond(doneMessage(runId, "initial", 1, model.snapshot(), [
      { kind: "log", text: "ready" },
    ]));

    expect(onSnapshot).toHaveBeenCalledOnce();
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({
      status: "success",
      phase: "initial",
      outputEntries: [{ type: "log", text: "ready" }],
    }));
    expect(runner._getState().currentPhase).toBeNull();
  });

  it("ignores stale and duplicate execution messages", () => {
    const onDone = vi.fn();
    runner = createDomRunner({ onDone });
    const runId = runner.run("", "m6-l2");
    const worker = FakeWorker.instances[0];
    const snapshot = createDomModel("m6-l2").snapshot();

    worker.respond(doneMessage("old-run", "initial", 1, snapshot));
    expect(onDone).not.toHaveBeenCalled();

    const result = doneMessage(runId, "initial", 1, snapshot);
    worker.respond(result);
    worker.respond(result);
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("terminates malformed same-run messages and reports a protocol error", () => {
    const onDone = vi.fn();
    runner = createDomRunner({ onDone });
    const runId = runner.run("", "m6-l2");
    const worker = FakeWorker.instances[0];

    worker.respond({ protocol: DOM_PROTOCOL, type: "done", runId, sequence: 1 });
    expect(worker.terminated).toBe(true);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({
      status: "error",
      error: expect.objectContaining({ name: "ProtocolError" }),
    }));
  });

  it("rejects oversized snapshot text before rendering it", () => {
    const onDone = vi.fn();
    runner = createDomRunner({ onDone });
    const runId = runner.run("", "m6-l2");
    const worker = FakeWorker.instances[0];
    const snapshot = createDomModel("m6-l2").snapshot();
    snapshot.roots[0].text = "x".repeat(2001);

    worker.respond(doneMessage(runId, "initial", 1, snapshot));

    expect(worker.terminated).toBe(true);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({
      status: "error",
      error: expect.objectContaining({ name: "ProtocolError" }),
    }));
  });

  it("rejects output floods that exceed the combined message budget", () => {
    const onDone = vi.fn();
    runner = createDomRunner({ onDone });
    const runId = runner.run("", "m6-l2");
    const worker = FakeWorker.instances[0];
    const snapshot = createDomModel("m6-l2").snapshot();
    const outputs = Array.from({ length: 100 }, () => ({ kind: "log", text: "output" }));

    worker.respond(doneMessage(runId, "initial", 1, snapshot, outputs));

    expect(worker.terminated).toBe(true);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({
      status: "error",
      error: expect.objectContaining({ name: "ProtocolError" }),
    }));
  });

  it("terminates synchronous runaway work after the watchdog timeout", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    runner = createDomRunner({ onDone, timeoutMs: 100 });
    runner.run("while (true) {}", "m6-l2");

    vi.advanceTimersByTime(100);

    expect(FakeWorker.instances[0].terminated).toBe(true);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({
      status: "terminated",
      error: expect.objectContaining({ name: "TimeoutError" }),
    }));
  });

  it("uses a heartbeat to terminate code that blocks after its initial result", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    runner = createDomRunner({ onDone, timeoutMs: 100 });
    const runId = runner.run("", "m6-l2");
    const worker = FakeWorker.instances[0];
    worker.respond(doneMessage(
      runId,
      "initial",
      1,
      createDomModel("m6-l2").snapshot(),
    ));

    vi.advanceTimersByTime(2500);

    expect(worker.terminated).toBe(true);
    expect(onDone).toHaveBeenLastCalledWith(expect.objectContaining({
      status: "terminated",
      error: expect.objectContaining({ name: "TimeoutError" }),
    }));
  });

  it("sends only registered interactions and validates their result", () => {
    const onDone = vi.fn();
    runner = createDomRunner({ onDone });
    const runId = runner.run("", "m6-l3");
    const worker = FakeWorker.instances[0];
    const model = createDomModel("m6-l3");
    model.document.querySelector("#increment").addEventListener("click", () => {});
    const snapshot = model.snapshot();
    worker.respond(doneMessage(runId, "initial", 1, snapshot));

    expect(runner.interact({ nodeId: snapshot.roots[1].children[0].id, type: "click" })).toBe(false);
    expect(runner.interact({ nodeId: snapshot.roots[0].id, type: "click" })).toBe(true);
    expect(runner._getState().currentPhase).toBe("interaction");
    const interaction = worker.messages.at(-1);
    expect(interaction.type).toBe("interaction");

    worker.respond(doneMessage(runId, "interaction", 2, snapshot));
    expect(onDone).toHaveBeenLastCalledWith(expect.objectContaining({
      status: "success",
      phase: "interaction",
    }));
    expect(runner.interact({ nodeId: "unknown", type: "click" })).toBe(false);
  });

  it("accepts form values keyed by fixture element IDs only for a registered submit", () => {
    const onDone = vi.fn();
    runner = createDomRunner({ onDone });
    const runId = runner.run("", "m6-l4");
    const worker = FakeWorker.instances[0];
    const model = createDomModel("m6-l4");
    model.document.querySelector("#task-form").addEventListener("submit", () => {});
    const snapshot = model.snapshot();
    worker.respond(doneMessage(runId, "initial", 1, snapshot));
    const form = snapshot.roots[0];

    expect(runner.interact({
      nodeId: form.id,
      type: "submit",
      formValues: { "task-input": "Review DOM" },
    })).toBe(true);
    expect(worker.messages.at(-1)).toMatchObject({
      type: "interaction",
      event: { formValues: { "task-input": "Review DOM" } },
    });
  });

  it("cleans up the Worker when reset or destroyed", () => {
    runner = createDomRunner();
    runner.run("", "m6-l2");
    const worker = FakeWorker.instances[0];
    runner.reset();
    expect(worker.terminated).toBe(true);

    runner.run("", "m6-l2");
    const nextWorker = FakeWorker.instances[1];
    runner.destroy();
    expect(nextWorker.terminated).toBe(true);
    expect(() => runner.run("", "m6-l2")).toThrow(/destroyed/);
  });
});
