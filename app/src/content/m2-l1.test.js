/**
 * content/m2-l1.test.js — Unit tests for Module 2, Lesson 1.
 */

import { describe, it, expect } from "vitest";
import { lessonM2L1, validateM2L1Exercise } from "./m2-l1.js";

describe("Module 2, Lesson 1 Content", () => {
  it("defines the required lesson structure complying with curriculum-spec.md", () => {
    expect(lessonM2L1.lessonId).toBe("m2-l1");
    expect(lessonM2L1.moduleId).toBe("m2");
    expect(lessonM2L1.title).toBe("Strings, Numbers, Booleans, null, and undefined");
    expect(lessonM2L1.estimatedMinutes).toBe(20);
    expect(lessonM2L1.prerequisites).toEqual(["m1-l4"]);
    expect(lessonM2L1.objectives.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L1.sections.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L1.summary.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L1.exercise).toBeDefined();
    expect(lessonM2L1.exercise.id).toBe("m2-l1-ex1");
  });

  describe("validateM2L1Exercise()", () => {
    const successResult = { status: "success", error: null };

    it("passes when output has exact expected 3 lines: string, number, boolean", () => {
      const output = [
        { type: "log", text: "string" },
        { type: "log", text: "number" },
        { type: "log", text: "boolean" },
      ];
      const res = validateM2L1Exercise(output, successResult);
      expect(res.passed).toBe(true);
      expect(res.status).toBe("success");
      expect(res.message).toContain("Success!");
    });

    it("passes when output has trailing newlines that need stripping", () => {
      const output = [
        { type: "log", text: "string\n" },
        { type: "log", text: "number\r\n" },
        { type: "log", text: "boolean\n" },
      ];
      const res = validateM2L1Exercise(output, successResult);
      expect(res.passed).toBe(true);
    });

    it("rejects when no output is provided (unmodified starter output of 1 line or 0 lines)", () => {
      const resEmpty = validateM2L1Exercise([], successResult);
      expect(resEmpty.passed).toBe(false);
      expect(resEmpty.status).toBe("mismatch");
      expect(resEmpty.message).toContain("No output was printed");

      const resStarter = validateM2L1Exercise([{ type: "log", text: "string" }], successResult);
      expect(resStarter.passed).toBe(false);
      expect(resStarter.message).toContain("Expected 3 lines of output, but only received 1");
    });

    it("rejects when extra output lines are produced", () => {
      const output = [
        { type: "log", text: "string" },
        { type: "log", text: "number" },
        { type: "log", text: "boolean" },
        { type: "log", text: "undefined" },
      ];
      const res = validateM2L1Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Expected exactly 3 lines of output, but received 4");
    });

    it("rejects capitalization mismatches with friendly guidance", () => {
      const output = [
        { type: "log", text: "String" },
        { type: "log", text: "Number" },
        { type: "log", text: "Boolean" },
      ];
      const res = validateM2L1Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Capitalization mismatch");
    });

    it("rejects inverted line order with specific guidance", () => {
      const output = [
        { type: "log", text: "boolean" },
        { type: "log", text: "number" },
        { type: "log", text: "string" },
      ];
      const res = validateM2L1Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Line order mismatch");
    });

    it("handles execution errors with friendly diagnostics", () => {
      const syntaxErr = {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      };
      const resSyntax = validateM2L1Exercise([], syntaxErr);
      expect(resSyntax.passed).toBe(false);
      expect(resSyntax.message).toContain("Syntax Error");

      const refErr = {
        status: "error",
        error: { name: "ReferenceError", message: "typeoff is not defined" },
      };
      const resRef = validateM2L1Exercise([], refErr);
      expect(resRef.passed).toBe(false);
      expect(resRef.message).toContain("Reference Error");
    });

    it("handles worker timeout/termination", () => {
      const timeoutRes = validateM2L1Exercise([], { status: "terminated" });
      expect(timeoutRes.passed).toBe(false);
      expect(timeoutRes.message).toContain("Execution timed out");
    });
  });
});
