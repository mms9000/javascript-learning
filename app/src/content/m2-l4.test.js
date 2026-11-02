/**
 * content/m2-l4.test.js — Unit tests for Module 2, Lesson 4.
 */

import { describe, it, expect } from "vitest";
import { lessonM2L4, validateM2L4Exercise } from "./m2-l4.js";

describe("Module 2, Lesson 4 Content", () => {
  it("defines the required lesson structure complying with curriculum-spec.md", () => {
    expect(lessonM2L4.lessonId).toBe("m2-l4");
    expect(lessonM2L4.moduleId).toBe("m2");
    expect(lessonM2L4.title).toBe("Operators and Expressions");
    expect(lessonM2L4.estimatedMinutes).toBe(20);
    expect(lessonM2L4.prerequisites).toEqual(["m2-l3"]);
    expect(lessonM2L4.objectives.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L4.sections.length).toBeGreaterThanOrEqual(5);
    expect(lessonM2L4.summary.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L4.exercise).toBeDefined();
    expect(lessonM2L4.exercise.id).toBe("m2-l4-ex1");
  });

  describe("validateM2L4Exercise()", () => {
    const successResult = { status: "success", error: null };

    it("passes when output has exact expected 2 lines: '50' and 'Total: $50'", () => {
      const output = [
        { type: "log", text: "50" },
        { type: "log", text: "Total: $50" },
      ];
      const res = validateM2L4Exercise(output, successResult);
      expect(res.passed).toBe(true);
      expect(res.status).toBe("success");
      expect(res.message).toContain("Success!");
    });

    it("passes with trailing newlines", () => {
      const output = [
        { type: "log", text: "50\n" },
        { type: "log", text: "Total: $50\r\n" },
      ];
      const res = validateM2L4Exercise(output, successResult);
      expect(res.passed).toBe(true);
    });

    it("rejects when no output is produced", () => {
      const res = validateM2L4Exercise([], successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("No output was printed");
    });

    it("provides specific guidance when learner logs only the subtotal 45", () => {
      const output = [{ type: "log", text: "45" }];
      const res = validateM2L4Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Total is 45 (subtotal only)");
      expect(res.message).toContain("total += shipping;");
    });

    it("provides specific guidance when shipping was omitted from both lines", () => {
      const output = [
        { type: "log", text: "45" },
        { type: "log", text: "Total: $45" },
      ];
      const res = validateM2L4Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Shipping was not added to total");
    });

    it("rejects capitalization mismatch on template literal", () => {
      const output = [
        { type: "log", text: "50" },
        { type: "log", text: "total: $50" },
      ];
      const res = validateM2L4Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Capitalization mismatch");
    });

    it("rejects inverted line order", () => {
      const output = [
        { type: "log", text: "Total: $50" },
        { type: "log", text: "50" },
      ];
      const res = validateM2L4Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Line order inverted");
    });

    it("handles SyntaxError, ReferenceError, and timeout cleanly", () => {
      const synErr = {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      };
      const resSyn = validateM2L4Exercise([], synErr);
      expect(resSyn.passed).toBe(false);
      expect(resSyn.message).toContain("Syntax Error");

      const refErr = {
        status: "error",
        error: { name: "ReferenceError", message: "shippingCost is not defined" },
      };
      const resRef = validateM2L4Exercise([], refErr);
      expect(resRef.passed).toBe(false);
      expect(resRef.message).toContain("Reference Error");

      const timeoutRes = validateM2L4Exercise([], { status: "terminated" });
      expect(timeoutRes.passed).toBe(false);
      expect(timeoutRes.message).toContain("Execution timed out");
    });
  });
});
