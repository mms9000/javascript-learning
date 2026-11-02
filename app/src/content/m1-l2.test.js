/**
 * content/m1-l2.test.js — Tests for Module 1, Lesson 2 exercise and validator.
 *
 * Verifies compliance with curriculum-spec.md and feature-spec-playground.md §9:
 * - Validates sequential execution output (Line 1: "Player Score:", Line 2: 100).
 * - Documents that validation operates on serialized output stream from worker.
 * - Enforces runner status "success".
 * - Tests missing output, single line, extra lines, inverted order, and casing mismatches.
 * - Safely handles SyntaxError, ReferenceError, TypeError, and timeouts.
 */

import { describe, it, expect } from "vitest";
import { lessonM1L2, validateM1L2Exercise } from "./m1-l2.js";

describe("Module 1, Lesson 2 Exercise Definition", () => {
  it("defines the exercise with expected metadata, prompt, hints, and validator", () => {
    expect(lessonM1L2.exercise).toBeDefined();
    expect(lessonM1L2.exercise.id).toBe("m1-l2-ex1");
    expect(lessonM1L2.exercise.title).toBe("Exercise: Sequential Output");
    expect(lessonM1L2.exercise.expectedOutput).toBe("Player Score:\n100");
    expect(lessonM1L2.exercise.hints).toHaveLength(2);
    expect(lessonM1L2.exercise.starterCode).toContain("Player Score:");
    expect(typeof lessonM1L2.exercise.validate).toBe("function");
  });

  it("contains lesson metadata, learning objectives, and structured sections", () => {
    expect(lessonM1L2.lessonId).toBe("m1-l2");
    expect(lessonM1L2.moduleId).toBe("m1");
    expect(lessonM1L2.title).toBe("Your First Program and console.log()");
    expect(lessonM1L2.objectives.length).toBeGreaterThanOrEqual(2);
    expect(lessonM1L2.sections.length).toBeGreaterThanOrEqual(3);
    expect(lessonM1L2.summary.length).toBeGreaterThanOrEqual(3);
  });
});

describe("validateM1L2Exercise()", () => {
  it("passes when output sequence is 'Player Score:' followed by '100'", () => {
    const outputs = [
      { type: "log", text: "Player Score:" },
      { type: "log", text: "100" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(true);
    expect(res.status).toBe("success");
    expect(res.message).toContain("Success!");
  });

  it("ignores trailing newline and carriage-return characters on both lines", () => {
    const outputs = [
      { type: "log", text: "Player Score:\n" },
      { type: "log", text: "100\r\n" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(true);
    expect(res.status).toBe("success");
  });

  it("rejects when runResult is missing or incomplete", () => {
    const outputs = [
      { type: "log", text: "Player Score:" },
      { type: "log", text: "100" },
    ];
    const res = validateM1L2Exercise(outputs, null);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("No execution result");
  });

  it("rejects when runResult has non-success status", () => {
    const outputs = [
      { type: "log", text: "Player Score:" },
      { type: "log", text: "100" },
    ];
    const res = validateM1L2Exercise(outputs, { status: "aborted" });
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Execution did not complete successfully");
  });

  it("rejects empty output with guidance to call console.log() twice", () => {
    const outputs = [];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("No output was printed");
    expect(res.message).toContain("twice");
  });

  it("provides specific guidance when only Line 1 is printed", () => {
    const outputs = [{ type: "log", text: "Player Score:" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Line 1 was printed, but Line 2 is missing");
  });

  it("provides single line guidance when an arbitrary single line is printed", () => {
    const outputs = [{ type: "log", text: "Hello" }];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain('Only 1 output line was detected ("Hello")');
  });

  it("detects and rejects inverted output order to reinforce sequential execution", () => {
    const outputs = [
      { type: "log", text: "100" },
      { type: "log", text: "Player Score:" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Inverted order");
    expect(res.message).toContain("sequentially top-to-bottom");
  });

  it("rejects Line 1 casing mismatches with capitalization feedback", () => {
    const outputs = [
      { type: "log", text: "player score:" },
      { type: "log", text: "100" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Line 1 capitalization mismatch");
  });

  it("rejects Line 1 content mismatches", () => {
    const outputs = [
      { type: "log", text: "Score:" },
      { type: "log", text: "100" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Line 1 mismatch");
  });

  it("rejects Line 2 content mismatches", () => {
    const outputs = [
      { type: "log", text: "Player Score:" },
      { type: "log", text: "99" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Line 2 mismatch");
  });

  it("rejects executions producing more than 2 output lines", () => {
    const outputs = [
      { type: "log", text: "Player Score:" },
      { type: "log", text: "100" },
      { type: "log", text: "Bonus: 50" },
    ];
    const runResult = { status: "success", error: null };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("mismatch");
    expect(res.message).toContain("Multiple extra output lines detected (3 lines)");
  });

  it("safely handles SyntaxError with quote and parenthesis advice", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "SyntaxError", message: "Unexpected token" },
    };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Syntax Error");
    expect(res.message).toContain("matching parentheses and quotation marks");
  });

  it("safely handles ReferenceError with console.log spelling advice", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "ReferenceError", message: "consoled is not defined" },
    };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Reference Error");
    expect(res.message).toContain("spelling and capitalization");
  });

  it("safely handles TypeError with function call advice", () => {
    const outputs = [];
    const runResult = {
      status: "error",
      error: { name: "TypeError", message: "console.log is not a function" },
    };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Type Error");
  });

  it("safely handles timeout / terminated execution", () => {
    const outputs = [];
    const runResult = {
      status: "terminated",
      error: { name: "TimeoutError", message: "Timed out" },
    };

    const res = validateM1L2Exercise(outputs, runResult);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("infinite loop");
  });
});
