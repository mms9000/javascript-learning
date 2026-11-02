/**
 * content/m1-l3.test.js — Tests for Module 1, Lesson 3 exercise and validator.
 *
 * Verifies compliance with curriculum-spec.md and feature-spec-playground.md §9:
 * - Exercise definition, metadata, prompt, hints, starterCode.
 * - Validation of actual execution result: exact match "Hello from JavaScript!".
 * - Tolerance for trailing newlines only.
 * - Rejection of empty output, multiple lines, and capitalization errors.
 * - Specific diagnostics for ReferenceError and SyntaxError (primary error paths for un-commented notes).
 * - Safe handling of timeouts and execution failures.
 */

import { describe, it, expect } from "vitest";
import { lessonM1L3, validateM1L3Exercise } from "./m1-l3.js";

describe("Module 1, Lesson 3 Exercise Definition", () => {
  it("defines the exercise with expected metadata, prompt, hints, and validator", () => {
    expect(lessonM1L3.exercise).toBeDefined();
    expect(lessonM1L3.exercise.id).toBe("m1-l3-ex1");
    expect(lessonM1L3.exercise.title).toBe("Exercise: Fix the Comment");
    expect(lessonM1L3.exercise.expectedOutput).toBe("Hello from JavaScript!");
    expect(lessonM1L3.exercise.hints).toHaveLength(2);
    expect(lessonM1L3.exercise.starterCode).toContain("This line is a note to the reader");
    expect(typeof lessonM1L3.exercise.validate).toBe("function");
  });

  it("contains lesson metadata, learning objectives, and structured sections", () => {
    expect(lessonM1L3.lessonId).toBe("m1-l3");
    expect(lessonM1L3.moduleId).toBe("m1");
    expect(lessonM1L3.title).toBe("Reading Basic Syntax and Comments");
    expect(lessonM1L3.objectives.length).toBeGreaterThanOrEqual(3);
    expect(lessonM1L3.sections.length).toBe(4);
    expect(lessonM1L3.summary.length).toBeGreaterThanOrEqual(4);
  });

  it("defines all sections with non-empty headings and semantic HTML content", () => {
    lessonM1L3.sections.forEach((sec) => {
      expect(sec.id).toBeTruthy();
      expect(sec.heading).toBeTruthy();
      expect(sec.heading.trim().length).toBeGreaterThan(0);
      expect(sec.content).toContain("<p>");
    });
  });
});

describe("validateM1L3Exercise()", () => {
  it("passes when exactly one output line matches 'Hello from JavaScript!'", () => {
    const outputs = [{ type: "log", text: "Hello from JavaScript!" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(true);
    expect(res.status).toBe("success");
    expect(res.message).toContain("Success!");
    expect(res.message).toContain("ignored by the JavaScript engine");
  });

  it("ignores trailing newline and carriage-return characters only", () => {
    const outputs = [{ type: "log", text: "Hello from JavaScript!\r\n" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(true);
    expect(res.status).toBe("success");
  });

  it("rejects when runResult is missing or null", () => {
    const outputs = [{ type: "log", text: "Hello from JavaScript!" }];
    const res = validateM1L3Exercise(outputs, null);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("No execution result");
  });

  it("rejects when runResult has non-success status", () => {
    const outputs = [{ type: "log", text: "Hello from JavaScript!" }];
    const res = validateM1L3Exercise(outputs, { status: "aborted" });
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Execution did not complete successfully");
  });

  it("rejects executions that produce no output", () => {
    const outputs = [];
    const runResult = { status: "success", error: null };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("No output was printed");
    expect(res.message).toContain("not commented out");
  });

  it("rejects executions that produce multiple output lines", () => {
    const outputs = [
      { type: "log", text: "Hello from JavaScript!" },
      { type: "log", text: "Extra output line" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Multiple output lines detected (2 lines)");
  });

  it("rejects capitalization mismatches with targeted guidance", () => {
    const outputs = [{ type: "log", text: "hello from javascript!" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Capitalization mismatch");
  });

  it("rejects other output mismatches", () => {
    const outputs = [{ type: "log", text: "Something completely different" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain('Output mismatch: Expected "Hello from JavaScript!"');
  });

  it("handles ReferenceError with comment-specific diagnostic guidance", () => {
    // When learner runs the starter code with un-commented note "This line is a note..."
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "ReferenceError", message: "This is not defined" },
    };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Reference Error");
    expect(res.message).toContain("The un-commented line is being treated as code");
    expect(res.message).toContain("Add // at the start of it");
  });

  it("handles SyntaxError with comment diagnostic", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "SyntaxError", message: "Unexpected identifier" },
    };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Syntax Error");
    expect(res.message).toContain("comment line starts with //");
  });

  it("handles TypeError with function call diagnostic", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "TypeError", message: "console.log is not a function" },
    };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Type Error");
  });

  it("handles timeout error with loop diagnostic", () => {
    const outputs = [];
    const runResult = {
      status: "terminated",
      error: { name: "TimeoutError", message: "Watchdog terminated" },
    };

    const res = validateM1L3Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Execution timed out");
  });
});
