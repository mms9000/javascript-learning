/**
 * content/m1-l1.test.js — Tests for Module 1, Lesson 1 exercise and validator.
 *
 * Verifies compliance with curriculum-spec.md and feature-spec-playground.md §9:
 * - Evaluates actual execution results and runner status, not source code strings.
 * - Requires exactly one output line matching "Hello, JavaScript!", ignoring trailing newlines only.
 * - Rejects additional output, case mismatch, syntax errors, runtime errors, and timeouts.
 * - Provides targeted diagnostic feedback for each failure case.
 */

import { describe, it, expect } from "vitest";
import { lessonM1L1, validateM1L1Exercise } from "./m1-l1.js";

describe("Module 1, Lesson 1 Exercise Definition", () => {
  it("defines the exercise with expected metadata, prompt, and hints", () => {
    expect(lessonM1L1.exercise).toBeDefined();
    expect(lessonM1L1.exercise.id).toBe("m1-l1-ex1");
    expect(lessonM1L1.exercise.expectedOutput).toBe("Hello, JavaScript!");
    expect(lessonM1L1.exercise.hints).toHaveLength(2);
    expect(lessonM1L1.exercise.starterCode).toContain("Hello, world!");
    expect(typeof lessonM1L1.exercise.validate).toBe("function");
  });
});

describe("validateM1L1Exercise()", () => {
  it("passes when exactly one output line matches 'Hello, JavaScript!'", () => {
    const outputs = [{ type: "log", text: "Hello, JavaScript!" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L1Exercise(outputs, runResult);
    expect(res.passed).toBe(true);
    expect(res.status).toBe("success");
    expect(res.message).toContain("Success!");
  });

  it("ignores trailing newline and carriage-return characters only", () => {
    const outputsWithNewline = [{ type: "log", text: "Hello, JavaScript!\n" }];
    const outputsWithCRLF = [{ type: "log", text: "Hello, JavaScript!\r\n" }];
    const runResult = { status: "success", error: null };

    const res1 = validateM1L1Exercise(outputsWithNewline, runResult);
    expect(res1.passed).toBe(true);

    const res2 = validateM1L1Exercise(outputsWithCRLF, runResult);
    expect(res2.passed).toBe(true);
  });

  it("rejects leading whitespace or untrimmed inner whitespace", () => {
    const outputs = [{ type: "log", text: "  Hello, JavaScript!" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L1Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
  });

  it("rejects case mismatches with targeted capitalization feedback", () => {
    const lower = [{ type: "log", text: "hello, javascript!" }];
    const mixed = [{ type: "log", text: "Hello, Javascript!" }];
    const runResult = { status: "success", error: null };

    const resLower = validateM1L1Exercise(lower, runResult);
    expect(resLower.passed).toBe(false);
    expect(resLower.status).toBe("mismatch");
    expect(resLower.message).toContain("case-sensitive");

    const resMixed = validateM1L1Exercise(mixed, runResult);
    expect(resMixed.passed).toBe(false);
    expect(resMixed.status).toBe("mismatch");
    expect(resMixed.message).toContain("case-sensitive");
  });

  it("provides specific guidance when starter code 'Hello, world!' is executed unmodified", () => {
    const outputs = [{ type: "log", text: "Hello, world!" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L1Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain('Your code printed "Hello, world!"');
  });

  it("rejects executions that produce multiple output lines", () => {
    const outputs = [
      { type: "log", text: "Hello, JavaScript!" },
      { type: "log", text: "Second line" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L1Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Multiple output lines detected");
  });

  it("rejects executions that produce no output", () => {
    const outputs = [];
    const runResult = { status: "success", error: null };

    const res = validateM1L1Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("No output was printed");
  });

  it("handles syntax errors with friendly diagnostics", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "SyntaxError", message: "Unexpected token" },
    };

    const res = validateM1L1Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Syntax Error");
    expect(res.message).toContain("matching quotes and parentheses");
  });

  it("handles reference errors with spelling diagnostics", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "ReferenceError", message: "consol is not defined" },
    };

    const res = validateM1L1Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Reference Error");
    expect(res.message).toContain("spelling and capitalization");
  });

  it("handles type errors with function call diagnostics", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "TypeError", message: "console.log is not a function" },
    };

    const res = validateM1L1Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Type Error");
  });

  it("handles timeout errors with loop diagnostics", () => {
    const outputs = [];
    const runResult = {
      status: "terminated",
      error: { name: "TimeoutError", message: "Execution exceeded time limit" },
    };

    const res = validateM1L1Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("infinite loop");
  });
});
