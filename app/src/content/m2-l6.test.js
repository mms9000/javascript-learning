/**
 * content/m2-l6.test.js — Unit tests for Module 2, Lesson 6.
 */

import { describe, it, expect } from "vitest";
import { lessonM2L6, validateM2L6Exercise } from "./m2-l6.js";

describe("Module 2, Lesson 6 Content", () => {
  it("defines the required lesson structure complying with curriculum-spec.md", () => {
    expect(lessonM2L6.lessonId).toBe("m2-l6");
    expect(lessonM2L6.moduleId).toBe("m2");
    expect(lessonM2L6.title).toBe("Equality and Comparisons");
    expect(lessonM2L6.estimatedMinutes).toBe(15);
    expect(lessonM2L6.prerequisites).toEqual(["m2-l5"]);
    expect(lessonM2L6.objectives.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L6.sections.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L6.summary.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L6.exercise).toBeDefined();
    expect(lessonM2L6.exercise.id).toBe("m2-l6-ex1");
  });

  describe("validateM2L6Exercise()", () => {
    const successResult = { status: "success", error: null };

    it("passes when output has exact expected 3 lines: '74', 'true', 'true'", () => {
      const output = [
        { type: "log", text: "74" },
        { type: "log", text: "true" },
        { type: "log", text: "true" },
      ];
      const res = validateM2L6Exercise(output, successResult);
      expect(res.passed).toBe(true);
      expect(res.status).toBe("success");
      expect(res.message).toContain("Module 2 Milestone");
    });

    it("passes with trailing newlines", () => {
      const output = [
        { type: "log", text: "74\n" },
        { type: "log", text: "true\r\n" },
        { type: "log", text: "true\n" },
      ];
      const res = validateM2L6Exercise(output, successResult);
      expect(res.passed).toBe(true);
    });

    it("rejects when no output is produced", () => {
      const res = validateM2L6Exercise([], successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("No output was printed");
    });

    it("rejects when fewer than 3 lines are produced", () => {
      const output = [
        { type: "log", text: "74" },
        { type: "log", text: "true" },
      ];
      const res = validateM2L6Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Expected 3 lines of output, but only received 2");
    });

    it("rejects when more than 3 lines are produced", () => {
      const output = [
        { type: "log", text: "74" },
        { type: "log", text: "true" },
        { type: "log", text: "true" },
        { type: "log", text: "extra" },
      ];
      const res = validateM2L6Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Multiple extra output lines detected");
    });

    it("provides specific diagnostic when finalTotal calculation is incorrect", () => {
      const output = [
        { type: "log", text: "70" },
        { type: "log", text: "true" },
        { type: "log", text: "true" },
      ];
      const res = validateM2L6Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("finalTotal calculation mismatch");
      expect(res.message).toContain("(80 + 4 - 10 = 74)");
    });

    it("provides specific diagnostic when isUnderBudget is incorrect", () => {
      const output = [
        { type: "log", text: "74" },
        { type: "log", text: "false" },
        { type: "log", text: "true" },
      ];
      const res = validateM2L6Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("isUnderBudget comparison mismatch");
      expect(res.message).toContain("finalTotal <= 75");
    });

    it("provides specific diagnostic when isTargetTotal is incorrect", () => {
      const output = [
        { type: "log", text: "74" },
        { type: "log", text: "true" },
        { type: "log", text: "false" },
      ];
      const res = validateM2L6Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("isTargetTotal equality check mismatch");
      expect(res.message).toContain("finalTotal === 74");
    });

    it("handles SyntaxError, ReferenceError, and timeout cleanly", () => {
      const synErr = {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      };
      const resSyn = validateM2L6Exercise([], synErr);
      expect(resSyn.passed).toBe(false);
      expect(resSyn.message).toContain("Syntax Error");

      const refErr = {
        status: "error",
        error: { name: "ReferenceError", message: "discountAmt is not defined" },
      };
      const resRef = validateM2L6Exercise([], refErr);
      expect(resRef.passed).toBe(false);
      expect(resRef.message).toContain("Reference Error");

      const timeoutRes = validateM2L6Exercise([], { status: "terminated" });
      expect(timeoutRes.passed).toBe(false);
      expect(timeoutRes.message).toContain("Execution timed out");
    });
  });
});
