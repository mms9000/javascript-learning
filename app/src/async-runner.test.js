import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ASYNC_RUNNER_LIMITS,
  createAsyncRunner,
  validateAsyncLearnerCode,
} from "./async-runner.js";

class FakeWorker {
  constructor() {
    this.messages = [];
    this.terminated = false;
  }

  postMessage(message) {
    this.messages.push(message);
  }

  emit(data) {
    this.onmessage?.({ data });
  }

  terminate() {
    this.terminated = true;
  }
}

function outputMessage(executionId, sequence, args = ["ready"]) {
  return {
    protocol: 1,
    type: "output",
    executionId,
    sequence,
    kind: "log",
    args,
  };
}

function doneMessage(executionId, status = "success", error = null) {
  return {
    protocol: 1,
    type: "done",
    executionId,
    status,
    error,
  };
}

describe("async Worker runner", () => {
  let runner;

  afterEach(() => {
    runner?.destroy();
    runner = null;
    vi.useRealTimers();
  });

  it("accepts top-level await and rejects module loading through syntax-tree analysis", () => {
    expect(() => validateAsyncLearnerCode('const value = await Promise.resolve("ready"); console.log(value);'))
      .not.toThrow();
    expect(() => validateAsyncLearnerCode('const source = "import(\\"https://example.com\\")"; // import()'))
      .not.toThrow();
    expect(() => validateAsyncLearnerCode('await import("https://example.com/module.js");'))
      .toThrow("Module loading is not available in async exercises.");
    expect(() => validateAsyncLearnerCode("a".repeat(ASYNC_RUNNER_LIMITS.MAX_CODE_LENGTH + 1)))
      .toThrow("50,000-character limit");
  });

  it("uses a separate Worker, routes output, and terminates it after terminal success", () => {
    const worker = new FakeWorker();
    const output = vi.fn();
    const done = vi.fn();
    runner = createAsyncRunner({
      workerFactory: () => worker,
      onOutput: output,
      onDone: done,
    });

    const executionId = runner.run('const value = await Promise.resolve("ready"); console.log(value);');
    expect(worker.messages[0]).toEqual({
      protocol: 1,
      type: "run",
      executionId,
      code: 'const value = await Promise.resolve("ready"); console.log(value);',
    });
    worker.emit(outputMessage(executionId, 0));
    worker.emit(doneMessage(executionId));

    expect(output).toHaveBeenCalledWith({ executionId, kind: "log", args: ["ready"] });
    expect(done).toHaveBeenCalledWith({ executionId, status: "success", error: null });
    expect(worker.terminated).toBe(true);
    expect(runner.getActiveExecutionId()).toBeNull();
  });

  it("ignores stale execution results and recovers with a fresh Worker", () => {
    const firstWorker = new FakeWorker();
    const secondWorker = new FakeWorker();
    const workers = [firstWorker, secondWorker];
    const output = vi.fn();
    const done = vi.fn();
    runner = createAsyncRunner({
      workerFactory: () => workers.shift(),
      onOutput: output,
      onDone: done,
    });

    const oldId = runner.run("await Promise.resolve();");
    const newId = runner.run("await Promise.resolve();");
    firstWorker.emit(outputMessage(oldId, 0, ["stale"]));

    const activeWorker = runner.isAvailable() ? runner.getActiveExecutionId() : null;
    expect(activeWorker).toBe(newId);
    expect(output).not.toHaveBeenCalled();
    expect(firstWorker.terminated).toBe(true);
    expect(done).toHaveBeenCalledWith(expect.objectContaining({
      executionId: oldId,
      status: "terminated",
    }));

    secondWorker.emit(doneMessage(newId));
    expect(secondWorker.terminated).toBe(true);
  });

  it("rejects malformed, out-of-sequence, and oversized output messages", () => {
    const worker = new FakeWorker();
    const done = vi.fn();
    const output = vi.fn();
    runner = createAsyncRunner({ workerFactory: () => worker, onDone: done, onOutput: output });

    const id = runner.run("await Promise.resolve();");
    worker.emit(outputMessage(id, 1));
    expect(done).toHaveBeenCalledWith(expect.objectContaining({
      status: "error",
      error: expect.objectContaining({ name: "ProtocolError" }),
    }));
    expect(worker.terminated).toBe(true);

    const nextWorker = new FakeWorker();
    runner = createAsyncRunner({ workerFactory: () => nextWorker, onDone: done });
    const nextId = runner.run("await Promise.resolve();");
    nextWorker.emit(outputMessage(nextId, 0, ["x".repeat(ASYNC_RUNNER_LIMITS.MAX_ENTRY_LENGTH + 21)]));
    expect(done).toHaveBeenLastCalledWith(expect.objectContaining({
      status: "error",
      error: expect.objectContaining({ name: "ProtocolError" }),
    }));
  });

  it("caps output messages and preserves the Worker truncation warning", () => {
    const worker = new FakeWorker();
    const output = vi.fn();
    const done = vi.fn();
    runner = createAsyncRunner({ workerFactory: () => worker, onOutput: output, onDone: done });
    const executionId = runner.run("for (let index = 0; index < 110; index += 1) console.log(index);");

    for (let sequence = 0; sequence < 101; sequence += 1) {
      worker.emit(outputMessage(executionId, sequence, [String(sequence)]));
    }
    worker.emit({
      protocol: 1,
      type: "output",
      executionId,
      sequence: 101,
      kind: "warn",
      args: ["[Output truncated: maximum 100 log entries reached]"],
    });
    worker.emit(doneMessage(executionId));

    expect(output).toHaveBeenCalledTimes(102);
    expect(output.mock.calls.at(-1)[0].args[0]).toContain("Output truncated");
    expect(done).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
  });

  it("terminates pending runs at the watchdog and accepts a subsequent run", () => {
    vi.useFakeTimers();
    const firstWorker = new FakeWorker();
    const nextWorker = new FakeWorker();
    const workers = [firstWorker, nextWorker];
    const done = vi.fn();
    runner = createAsyncRunner({
      timeoutMs: 40,
      workerFactory: () => workers.shift(),
      onDone: done,
    });

    const timedOutId = runner.run("await new Promise(() => {});");
    vi.advanceTimersByTime(40);
    expect(done).toHaveBeenCalledWith(expect.objectContaining({
      executionId: timedOutId,
      status: "terminated",
      error: expect.objectContaining({ name: "TimeoutError" }),
    }));
    expect(firstWorker.terminated).toBe(true);

    const nextId = runner.run("await Promise.resolve();");
    nextWorker.emit(doneMessage(nextId));
    expect(done).toHaveBeenLastCalledWith(expect.objectContaining({
      executionId: nextId,
      status: "success",
    }));
  });

  it("mediates only allowlisted GET requests and preserves HTTP status results", async () => {
    const worker = new FakeWorker();
    const fetchApi = vi.fn().mockResolvedValue({
      status: 404,
      ok: false,
      data: {},
    });
    runner = createAsyncRunner({ workerFactory: () => worker, fetchApi });

    const executionId = runner.run("const response = await fetch(url);");
    worker.emit({
      protocol: 1,
      type: "fetch-request",
      executionId,
      requestId: "fetch-1",
      url: "https://jsonplaceholder.typicode.com/todos/999999999",
    });
    await vi.waitFor(() => {
      expect(worker.messages).toHaveLength(2);
    });
    expect(fetchApi).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/todos/999999999",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(worker.messages[1]).toMatchObject({
      type: "fetch-result",
      requestId: "fetch-1",
      result: { status: 404, ok: false, data: {} },
    });

    worker.emit(doneMessage(executionId));
  });

  it("rejects unauthorized URLs before fetch and cancels outstanding requests on termination", async () => {
    const worker = new FakeWorker();
    const requestSignal = vi.fn();
    const fetchApi = vi.fn((_, { signal }) => {
      requestSignal.mockImplementation(() => signal.aborted);
      return new Promise(() => {});
    });
    runner = createAsyncRunner({ workerFactory: () => worker, fetchApi });

    const executionId = runner.run("await fetch(url);");
    worker.emit({
      protocol: 1,
      type: "fetch-request",
      executionId,
      requestId: "fetch-1",
      url: "https://attacker.example/exfiltrate",
    });
    expect(fetchApi).not.toHaveBeenCalled();
    expect(worker.messages.at(-1)).toMatchObject({
      type: "fetch-result",
      error: { name: "TypeError" },
    });

    worker.emit({
      protocol: 1,
      type: "fetch-request",
      executionId,
      requestId: "fetch-2",
      url: "https://jsonplaceholder.typicode.com/todos/1",
    });
    await vi.waitFor(() => expect(fetchApi).toHaveBeenCalledOnce());
    runner.terminate();
    expect(requestSignal()).toBe(true);
  });

  it("enforces the host request quota and rejects malformed protocol messages", () => {
    const worker = new FakeWorker();
    const fetchApi = vi.fn();
    const done = vi.fn();
    runner = createAsyncRunner({ workerFactory: () => worker, fetchApi, onDone: done });

    const executionId = runner.run("await Promise.resolve();");
    for (let requestNumber = 1; requestNumber <= 4; requestNumber += 1) {
      worker.emit({
        protocol: 1,
        type: "fetch-request",
        executionId,
        requestId: `fetch-${requestNumber}`,
        url: "https://attacker.example/exfiltrate",
      });
    }
    expect(worker.messages.at(-1)).toMatchObject({
      type: "fetch-result",
      error: { name: "RangeError" },
    });
    expect(fetchApi).not.toHaveBeenCalled();

    runner.destroy();
    const malformedWorker = new FakeWorker();
    runner = createAsyncRunner({ workerFactory: () => malformedWorker, fetchApi, onDone: done });
    const malformedId = runner.run("await Promise.resolve();");
    malformedWorker.emit({
      protocol: 1,
      type: "fetch-request",
      executionId: malformedId,
      requestId: "fetch-1",
      url: "https://jsonplaceholder.typicode.com/todos/1",
      method: "POST",
    });
    expect(done).toHaveBeenCalledWith(expect.objectContaining({
      status: "error",
      error: expect.objectContaining({ name: "ProtocolError" }),
    }));
    expect(fetchApi).not.toHaveBeenCalled();
    expect(malformedWorker.terminated).toBe(true);
  });

  it("rejects reused request IDs", async () => {
    const worker = new FakeWorker();
    const fetchApi = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      data: { userId: 1, id: 1, title: "task", completed: false },
    });
    const done = vi.fn();
    runner = createAsyncRunner({ workerFactory: () => worker, fetchApi, onDone: done });
    const executionId = runner.run("await fetch(url);");
    const request = {
      protocol: 1,
      type: "fetch-request",
      executionId,
      requestId: "fetch-1",
      url: "https://jsonplaceholder.typicode.com/todos/1",
    };
    worker.emit(request);
    await vi.waitFor(() => expect(worker.messages).toHaveLength(2));
    worker.emit(request);
    expect(done).toHaveBeenCalledWith(expect.objectContaining({
      status: "error",
      error: expect.objectContaining({ name: "ProtocolError" }),
    }));
    expect(fetchApi).toHaveBeenCalledOnce();
  });
});
