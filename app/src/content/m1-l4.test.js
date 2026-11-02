/**
 * content/m1-l4.test.js — Tests for Module 1, Lesson 4 exercise and validator.
 *
 * Verifies compliance with curriculum-spec.md and feature-spec-playground.md §9:
 * - Lesson 4 metadata, learning objectives, 4 sections with non-empty headings.
 * - Exercise definition, prompt, progressive hints, and starterCode.
 * - Validation of actual execution result: exact match "Syntax errors are normal!".
 * - Tolerance for trailing newlines only.
 * - Rejection of empty output, multiple lines, and capitalization errors.
 * - Friendly SyntaxError diagnosis for missing closing parenthesis.
 * - Safe handling of timeouts and runtime errors.
 */

import { describe, it, expect } from "vitest";
import { lessonM1L4, validateM1L4Exercise } from "./m1-l4.js";

describe("Module 1, Lesson 4 Exercise Definition", () => {
  it("defines the exercise with expected metadata, prompt, hints, and validator", () => {
    expect(lessonM1L4.exercise).toBeDefined();
    expect(lessonM1L4.exercise.id).toBe("m1-l4-ex1");
    expect(lessonM1L4.exercise.title).toBe("Exercise: Fix the Syntax Error");
    expect(lessonM1L4.exercise.expectedOutput).toBe("Syntax errors are normal!");
    expect(lessonM1L4.exercise.hints).toHaveLength(2);
    expect(lessonM1L4.exercise.starterCode).toContain('console.log("Syntax errors are normal!";');
    expect(typeof lessonM1L4.exercise.validate).toBe("function");
  });

  it("contains lesson metadata, learning objectives, and structured sections", () => {
    expect(lessonM1L4.lessonId).toBe("m1-l4");
    expect(lessonM1L4.moduleId).toBe("m1");
    expect(lessonM1L4.title).toBe("Understanding Common Syntax Errors");
    expect(lessonM1L4.objectives.length).toBeGreaterThanOrEqual(4);
    expect(lessonM1L4.sections.length).toBe(4);
    expect(lessonM1L4.summary.length).toBeGreaterThanOrEqual(4);
  });

  it("defines all sections with non-empty headings and semantic HTML content", () => {
    lessonM1L4.sections.forEach((sec) => {
      expect(sec.id).toBeTruthy();
      expect(sec.heading).toBeTruthy();
      expect(sec.heading.trim().length).toBeGreaterThan(0);
      expect(sec.content).toContain("<p>");
    });
  });
});

describe("validateM1L4Exercise()", () => {
  it("passes when exactly one output line matches 'Syntax errors are normal!'", () => {
    const outputs = [{ type: "log", text: "Syntax errors are normal!" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L4Exercise(outputs, runResult);
    expect(res.passed).toBe(true);
    expect(res.status).toBe("success");
    expect(res.message).toContain("Success!");
    expect(res.message).toContain("fixed the syntax error");
  });

  it("ignores trailing newline and carriage-return characters only", () => {
    const outputs = [{ type: "log", text: "Syntax errors are normal!\r\n" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L4Exercise(outputs, runResult);
    expect(res.passed).toBe(true);
    expect(res.status).toBe("success");
  });

  it("rejects when runResult is missing or null", () => {
    const outputs = [{ type: "log", text: "Syntax errors are normal!" }];
    const res = validateM1L4Exercise(outputs, null);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("No execution result recorded");
  });

  it("rejects when runResult has non-success status", () => {
    const outputs = [{ type: "log", text: "Syntax errors are normal!" }];
    const res = validateM1L4Exercise(outputs, { status: "aborted" });
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Execution did not complete successfully");
  });

  it("rejects executions that produce no output", () => {
    const outputs = [];
    const runResult = { status: "success", error: null };

    const res = validateM1L4Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("No output was printed");
  });

  it("rejects executions that produce multiple output lines", () => {
    const outputs = [
      { type: "log", text: "Syntax errors are normal!" },
      { type: "log", text: "Extra output line" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L4Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Multiple output lines detected (2 lines)");
  });

  it("rejects capitalization mismatches with targeted guidance", () => {
    const outputs = [{ type: "log", text: "syntax errors are normal!" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L4Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Capitalization mismatch");
  });

  it("rejects other output mismatches", () => {
    const outputs = [{ type: "log", text: "Something else" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L4Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain('Output mismatch: Expected "Syntax errors are normal!"');
  });

  it("handles SyntaxError with parenthesis-matching diagnostic guidance", () => {
    // When learner runs the starter code with missing closing parenthesis
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "SyntaxError", message: "Unexpected token ';'" },
    };

    const res = validateM1L4Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Syntax Error");
    expect(res.message).toContain("Check that every opening parenthesis '(' has a matching closing parenthesis ')'");
  });

  it("handles ReferenceError with function spelling diagnostic", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "ReferenceError", message: "consl is not defined" },
    };

    const res = validateM1L4Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Reference Error");
    expect(res.message).toContain("spelling and capitalization");
  });

  it("handles TypeError with function call diagnostic", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "TypeError", message: "console.log is not a function" },
    };

    const res = validateM1L4Exercise(outputs, runResult);
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

    const res = validateM1L4Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Execution timed out");
  });
});
