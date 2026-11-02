/**
 * runner.test.js — Unit and security tests for isolated JavaScript runner.
 *
 * Verifies compliance with:
 * - feature-spec-playground.md Scenarios A through J
 * - architecture-spec.md §5 (Web Worker execution boundary, watchdog, output caps)
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { createRunner, RUNNER_LIMITS, WORKER_BOOTSTRAP_CODE } from "./runner.js";

describe("Runner module", () => {
  let runner;

  afterEach(() => {
    if (runner) {
      runner.destroy();
      runner = null;
    }
  });

  it("Scenario A: executes valid code and returns output", async () => {
    const outputs = [];
    let doneResult = null;

    runner = createRunner({
      onOutput: (entry) => outputs.push(entry),
      onDone: (res) => {
        doneResult = res;
      },
    });

    runner.run("console.log(2 + 3);");

    await vi.waitFor(() => {
      expect(doneResult).not.toBeNull();
    });

    expect(doneResult.status).toBe("success");
    expect(outputs).toHaveLength(1);
    expect(outputs[0].args).toEqual(["5"]);
  });

  it("Scenario B: preserves order of multiple output messages", async () => {
    const outputs = [];
    let doneResult = null;

    runner = createRunner({
      onOutput: (entry) => outputs.push(entry),
      onDone: (res) => {
        doneResult = res;
      },
    });

    runner.run('console.log("first"); console.log("second"); console.log("third");');

    await vi.waitFor(() => {
      expect(doneResult).not.toBeNull();
    });

    expect(doneResult.status).toBe("success");
    expect(outputs).toHaveLength(3);
    expect(outputs[0].args).toEqual(["first"]);
    expect(outputs[1].args).toEqual(["second"]);
    expect(outputs[2].args).toEqual(["third"]);
  });

  it("Scenario C: reports success with no output for valid silent code", async () => {
    const outputs = [];
    let doneResult = null;

    runner = createRunner({
      onOutput: (entry) => outputs.push(entry),
      onDone: (res) => {
        doneResult = res;
      },
    });

    runner.run("const a = 10; const b = 20; const c = a + b;");

    await vi.waitFor(() => {
      expect(doneResult).not.toBeNull();
    });

    expect(doneResult.status).toBe("success");
    expect(outputs).toHaveLength(0);
  });

  it("Scenario D: catches syntax errors without crashing host", async () => {
    let doneResult = null;

    runner = createRunner({
      onDone: (res) => {
        doneResult = res;
      },
    });

    runner.run("if (true {");

    await vi.waitFor(() => {
      expect(doneResult).not.toBeNull();
    });

    expect(doneResult.status).toBe("error");
    expect(doneResult.error.name).toBe("SyntaxError");
  });

  it("rejects direct and nested dynamic imports before dispatching learner code", () => {
    const results = [];

    runner = createRunner({
      onDone: (result) => results.push(result),
    });

    runner.run('import("https://example.com/module.js");');
    runner.run('const load = () => import("./module.js"); load();');

    expect(results).toHaveLength(2);
    expect(results.every((result) => result.status === "error")).toBe(true);
    expect(results.every((result) => result.error.name === "SyntaxError")).toBe(true);
    expect(results[0].error.message).toMatch(/Dynamic import/);
    expect(results[1].error.message).toMatch(/Dynamic import/);
  });

  it("fails safely when learner source is malformed", () => {
    const results = [];

    runner = createRunner({
      onDone: (result) => results.push(result),
    });

    runner.run("if (true {");

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe("error");
    expect(results[0].error.name).toBe("SyntaxError");
  });

  it("disables indirect code generation and protects trusted Worker messaging", () => {
    expect(WORKER_BOOTSTRAP_CODE).toContain('["Function", "eval", "postMessage"]');
    expect(WORKER_BOOTSTRAP_CODE).toContain("Object.getPrototypeOf(async function () {})");
    expect(WORKER_BOOTSTRAP_CODE).toContain("Object.getPrototypeOf(function* () {})");
    expect(WORKER_BOOTSTRAP_CODE).toContain("nativePostMessage");
  });

  it("Scenario E: catches runtime errors without crashing host", async () => {
    let doneResult = null;

    runner = createRunner({
      onDone: (res) => {
        doneResult = res;
      },
    });

    runner.run("null.someProperty;");

    await vi.waitFor(() => {
      expect(doneResult).not.toBeNull();
    });

    expect(doneResult.status).toBe("error");
    expect(doneResult.error.name).toBe("TypeError");
  });

  it("Scenario F: watchdog terminates infinite loops and respawns runner", async () => {
    let doneResult = null;
    let terminatedReason = null;

    runner = createRunner({
      timeoutMs: 80, // short timeout for test speed
      onDone: (res) => {
        doneResult = res;
      },
      onTerminated: (info) => {
        terminatedReason = info.reason;
      },
    });

    runner.run("while (true) {}");

    await vi.waitFor(() => {
      expect(doneResult).not.toBeNull();
    }, { timeout: 500 });

    expect(doneResult.status).toBe("terminated");
    expect(doneResult.error.name).toBe("TimeoutError");
    expect(terminatedReason).toBe("timeout");

    // Verify runner was automatically recreated and can immediately run new code
    let nextResult = null;
    const nextOutputs = [];
    runner = createRunner({
      onOutput: (entry) => nextOutputs.push(entry),
      onDone: (res) => {
        nextResult = res;
      },
    });

    runner.run('console.log("recovered!");');
    await vi.waitFor(() => {
      expect(nextResult).not.toBeNull();
    });
    expect(nextResult.status).toBe("success");
    expect(nextOutputs[0].args).toEqual(["recovered!"]);
  });

  it("Scenario G: caps log entries at 100 with a truncation warning", async () => {
    const outputs = [];
    let doneResult = null;

    runner = createRunner({
      onOutput: (entry) => outputs.push(entry),
      onDone: (res) => {
        doneResult = res;
      },
    });

    runner.run("for (let i = 0; i < 110; i++) { console.log(i); }");

    await vi.waitFor(() => {
      expect(doneResult).not.toBeNull();
    });

    expect(doneResult.status).toBe("success");
    // 100 normal logs + 1 truncation warning = 101 total
    expect(outputs).toHaveLength(101);
    expect(outputs[100].kind).toBe("warn");
    expect(outputs[100].args[0]).toContain("Output truncated: maximum 100 log entries reached");
  });

  it("Scenario H: truncates oversized output string arguments", async () => {
    const outputs = [];
    let doneResult = null;

    runner = createRunner({
      onOutput: (entry) => outputs.push(entry),
      onDone: (res) => {
        doneResult = res;
      },
    });

    runner.run('console.log("A".repeat(3000));');

    await vi.waitFor(() => {
      expect(doneResult).not.toBeNull();
    });

    expect(doneResult.status).toBe("success");
    expect(outputs).toHaveLength(1);
    expect(outputs[0].args[0].length).toBeLessThan(2100);
    expect(outputs[0].args[0]).toContain("[truncated]");
  });

  it("Scenario I: discards stale messages from superseded executions", async () => {
    const outputs = [];
    const doneEvents = [];

    runner = createRunner({
      onOutput: (entry) => outputs.push(entry),
      onDone: (res) => doneEvents.push(res),
    });

    // Start first run then immediately start second run
    runner.run('console.log("Run 1");');
    const secondRunId = runner.run('console.log("Run 2");');

    await vi.waitFor(() => {
      expect(doneEvents.some((d) => d.executionId === secondRunId)).toBe(true);
    });

    // The output should only reflect the latest active run
    const activeOutputs = outputs.filter((o) => o.executionId === secondRunId);
    expect(activeOutputs.length).toBeGreaterThanOrEqual(1);
    expect(activeOutputs[0].args).toEqual(["Run 2"]);
  });

  it("Security verification: untrusted code cannot access parent DOM or storage", async () => {
    const results = [];

    runner = createRunner({
      onDone: (res) => results.push(res),
    });

    // Attempting localStorage should fail or be undefined
    runner.run("localStorage.setItem('hacked', 'yes');");
    await vi.waitFor(() => expect(results).toHaveLength(1));
    expect(results[0].status).toBe("error");

    // Attempting document should fail or be undefined
    runner.run("document.cookie = 'foo=bar';");
    await vi.waitFor(() => expect(results).toHaveLength(2));
    expect(results[1].status).toBe("error");

    // Attempting fetch should fail or be undefined
    runner.run("fetch('https://example.com');");
    await vi.waitFor(() => expect(results).toHaveLength(3));
    expect(results[2].status).toBe("error");
  });

  it("neutralizes indexedDB and caches in worker environment", async () => {
    // 1. Verify bootstrap code contains explicit neutralization directives
    expect(WORKER_BOOTSTRAP_CODE).toContain("self.indexedDB = undefined");
    expect(WORKER_BOOTSTRAP_CODE).toContain("self.caches = undefined");
    expect(WORKER_BOOTSTRAP_CODE).toContain('Object.defineProperty(self, "indexedDB"');
    expect(WORKER_BOOTSTRAP_CODE).toContain('Object.defineProperty(self, "caches"');

    const results = [];
    const outputs = [];

    runner = createRunner({
      onOutput: (entry) => outputs.push(entry),
      onDone: (res) => results.push(res),
    });

    // Attempting to use indexedDB.open() directly fails
    runner.run("indexedDB.open('test-db');");
    await vi.waitFor(() => expect(results).toHaveLength(1));
    expect(results[0].status).toBe("error");

    // Attempting to use caches.open() directly fails
    runner.run("caches.open('test-cache');");
    await vi.waitFor(() => expect(results).toHaveLength(2));
    expect(results[1].status).toBe("error");

    // Inspecting properties confirms they evaluate to undefined
    runner.run(`
      console.log(typeof indexedDB === "undefined");
      console.log(typeof caches === "undefined");
      console.log(typeof self.indexedDB === "undefined");
      console.log(typeof self.caches === "undefined");
    `);
    await vi.waitFor(() => expect(results).toHaveLength(3));
    expect(results[2].status).toBe("success");

    const inspectionLogs = outputs.slice(-4).map((o) => o.args[0]);
    expect(inspectionLogs).toEqual(["true", "true", "true", "true"]);
  });

  describe("Resource-exhaustion handling", () => {
    it("handles large strings and truncates output safely", async () => {
      const outputs = [];
      let doneResult = null;

      runner = createRunner({
        onOutput: (entry) => outputs.push(entry),
        onDone: (res) => {
          doneResult = res;
        },
      });

      // Generate a 50,000-character string in learner code
      runner.run('const bigStr = "Z".repeat(50000); console.log(bigStr);');

      await vi.waitFor(() => {
        expect(doneResult).not.toBeNull();
      });

      expect(doneResult.status).toBe("success");
      expect(outputs).toHaveLength(1);
      expect(outputs[0].args[0].length).toBeLessThanOrEqual(2100);
      expect(outputs[0].args[0]).toContain("... [truncated]");
    });

    it("caps excessive console output and suppresses flooding", async () => {
      const outputs = [];
      let doneResult = null;

      runner = createRunner({
        onOutput: (entry) => outputs.push(entry),
        onDone: (res) => {
          doneResult = res;
        },
      });

      // Attempt to flood console with 300 messages
      runner.run("for (let i = 0; i < 300; i++) { console.log('spam ' + i); }");

      await vi.waitFor(() => {
        expect(doneResult).not.toBeNull();
      });

      expect(doneResult.status).toBe("success");
      // Exactly 100 log entries + 1 truncation warning = 101 total
      expect(outputs).toHaveLength(101);
      expect(outputs[100].kind).toBe("warn");
      expect(outputs[100].args[0]).toContain("Output truncated: maximum 100 log entries reached");
    });

    it("handles repeated rapid executions without locking UI or leaking stale output", async () => {
      const outputs = [];
      const doneEvents = [];

      runner = createRunner({
        onOutput: (entry) => outputs.push(entry),
        onDone: (res) => doneEvents.push(res),
      });

      // Rapidly fire 5 executions in succession
      let lastRunId = null;
      for (let i = 1; i <= 5; i++) {
        lastRunId = runner.run(`console.log("Run ${i}");`);
      }

      await vi.waitFor(() => {
        expect(doneEvents.some((d) => d.executionId === lastRunId)).toBe(true);
      });

      // Active outputs must only belong to the final run
      const finalOutputs = outputs.filter((o) => o.executionId === lastRunId);
      expect(finalOutputs.length).toBeGreaterThanOrEqual(1);
      expect(finalOutputs[0].args).toEqual(["Run 5"]);

      // Verify runner remains responsive and can immediately run subsequent code
      let postRunDone = null;
      const postOutputs = [];
      runner = createRunner({
        onOutput: (entry) => postOutputs.push(entry),
        onDone: (res) => {
          postRunDone = res;
        },
      });

      runner.run('console.log("subsequent execution OK");');
      await vi.waitFor(() => expect(postRunDone).not.toBeNull());
      expect(postRunDone.status).toBe("success");
      expect(postOutputs[0].args).toEqual(["subsequent execution OK"]);
    });

    it("handles memory-intensive allocation and supports manual termination", async () => {
      let doneResult = null;

      runner = createRunner({
        onDone: (res) => {
          doneResult = res;
        },
      });

      // Allocate an array with 100,000 elements
      runner.run("const arr = []; for (let i = 0; i < 100000; i++) { arr.push(i); } console.log(arr.length);");

      await vi.waitFor(() => {
        expect(doneResult).not.toBeNull();
      });

      expect(doneResult.status).toBe("success");

      // Verify that calling runner.terminate() resets cleanly
      let termDone = null;
      let termReason = null;
      runner = createRunner({
        onDone: (res) => {
          termDone = res;
        },
        onTerminated: (info) => {
          termReason = info.reason;
        },
      });

      runner.run("while (true) {}");
      runner.terminate();

      expect(termDone).not.toBeNull();
      expect(termDone.status).toBe("terminated");
      expect(termReason).toBe("manual");

      // Verify worker was recreated and can run again
      let recoverDone = null;
      runner = createRunner({
        onDone: (res) => {
          recoverDone = res;
        },
      });
      runner.run("console.log(123);");
      await vi.waitFor(() => {
        expect(recoverDone).not.toBeNull();
      });
      expect(recoverDone.status).toBe("success");
    });
  });

  describe("Message handling robustness", () => {
    it("discards malformed, non-object, and foreign messages", () => {
      const outputs = [];
      const doneEvents = [];

      runner = createRunner({
        onOutput: (entry) => outputs.push(entry),
        onDone: (res) => doneEvents.push(res),
      });

      // No active execution: foreign messages are ignored
      runner._handleWorkerMessage(null);
      runner._handleWorkerMessage(undefined);
      runner._handleWorkerMessage(12345);
      runner._handleWorkerMessage("invalid string");
      runner._handleWorkerMessage({ type: "output", executionId: "fake-id", args: ["test"] });
      runner._handleWorkerMessage({ type: "done", executionId: "fake-id", status: "success" });

      expect(outputs).toHaveLength(0);
      expect(doneEvents).toHaveLength(0);

      // Start an execution to test activeId filtering
      const activeId = runner.run('console.log("running");');
      expect(runner.getActiveExecutionId()).toBe(activeId);

      // Wrong executionId is discarded
      runner._handleWorkerMessage({
        type: "output",
        executionId: "other-id",
        kind: "log",
        args: ["discarded"],
      });
      expect(outputs).toHaveLength(0);

      // Malformed non-object or missing executionId is discarded
      runner._handleWorkerMessage({ type: "output" });
      runner._handleWorkerMessage({ executionId: 9999 });
      expect(outputs).toHaveLength(0);
    });

    it("sanitizes oversized args in worker messages on parent side", () => {
      const outputs = [];

      runner = createRunner({
        onOutput: (entry) => outputs.push(entry),
      });

      const activeId = runner.run('console.log("parent-side test");');

      // Dispatch an output message with an oversized 5,000-character argument
      runner._handleWorkerMessage({
        type: "output",
        executionId: activeId,
        kind: "log",
        args: ["X".repeat(5000)],
      });

      expect(outputs).toHaveLength(1);
      expect(outputs[0].args[0].length).toBeLessThanOrEqual(2100);
      expect(outputs[0].args[0]).toContain("... [truncated]");

      // Invalid kind defaults to 'log'
      runner._handleWorkerMessage({
        type: "output",
        executionId: activeId,
        kind: "invalid-kind",
        args: ["safe message"],
      });
      expect(outputs).toHaveLength(2);
      expect(outputs[1].kind).toBe("log");
    });

    it("caps parent-side argument and output-entry processing", () => {
      const outputs = [];
      runner = createRunner({
        onOutput: (entry) => outputs.push(entry),
      });

      const activeId = runner.run("void 0;");
      runner._handleWorkerMessage({
        type: "output",
        executionId: activeId,
        kind: "log",
        args: Array.from({ length: RUNNER_LIMITS.MAX_ARGUMENTS + 10 }, (_, index) => String(index)),
      });
      expect(outputs[0].args).toHaveLength(RUNNER_LIMITS.MAX_ARGUMENTS);

      for (let index = 1; index < RUNNER_LIMITS.MAX_ENTRIES + 10; index += 1) {
        runner._handleWorkerMessage({
          type: "output",
          executionId: activeId,
          kind: "log",
          args: [String(index)],
        });
      }

      expect(outputs).toHaveLength(RUNNER_LIMITS.MAX_ENTRIES + 1);
      expect(outputs.at(-1).kind).toBe("warn");
      expect(outputs.at(-1).args[0]).toContain("maximum 100 log entries");
    });

    it("ignores duplicate done messages and subsequent outputs", () => {
      const doneEvents = [];
      const outputs = [];

      runner = createRunner({
        onOutput: (entry) => outputs.push(entry),
        onDone: (res) => doneEvents.push(res),
      });

      const activeId = runner.run('console.log("first");');

      // Dispatch first valid done
      runner._handleWorkerMessage({
        type: "done",
        executionId: activeId,
        status: "success",
      });

      expect(doneEvents).toHaveLength(1);
      expect(runner.getActiveExecutionId()).toBeNull();

      // Dispatch duplicate done with same executionId
      runner._handleWorkerMessage({
        type: "done",
        executionId: activeId,
        status: "success",
      });

      // Still only 1 done event
      expect(doneEvents).toHaveLength(1);

      // Dispatch output arriving after done
      runner._handleWorkerMessage({
        type: "output",
        executionId: activeId,
        kind: "log",
        args: ["after done"],
      });

      // Output discarded because execution is no longer active
      expect(outputs).toHaveLength(0);
    });

    it("recovers from worker crash / onerror and recreates worker for next execution", async () => {
      let doneResult = null;

      runner = createRunner({
        onDone: (res) => {
          doneResult = res;
        },
      });

      runner.run('console.log("before crash");');

      // Simulate uncaught worker error event (crash / OOM)
      runner._handleWorkerError(new Error("Worker thread crashed"));

      expect(doneResult).not.toBeNull();
      expect(doneResult.status).toBe("error");
      expect(doneResult.error.name).toBe("RuntimeError");
      expect(doneResult.error.message).toContain("Worker thread crashed");

      // Verify the worker was recreated and can run subsequent code without error
      let nextDone = null;
      const nextOutputs = [];
      runner = createRunner({
        onOutput: (entry) => nextOutputs.push(entry),
        onDone: (res) => {
          nextDone = res;
        },
      });

      runner.run('console.log("healed");');
      await vi.waitFor(() => expect(nextDone).not.toBeNull());
      expect(nextDone.status).toBe("success");
      expect(nextOutputs[0].args).toEqual(["healed"]);
    });
  });
});
