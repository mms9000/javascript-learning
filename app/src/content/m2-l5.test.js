/**
 * content/m2-l5.test.js — Unit tests for Module 2, Lesson 5.
 */

import { describe, it, expect } from "vitest";
import { lessonM2L5, validateM2L5Exercise } from "./m2-l5.js";

describe("Module 2, Lesson 5 Content", () => {
  it("defines the required lesson structure complying with curriculum-spec.md", () => {
    expect(lessonM2L5.lessonId).toBe("m2-l5");
    expect(lessonM2L5.moduleId).toBe("m2");
    expect(lessonM2L5.title).toBe("Type Conversion and Coercion");
    expect(lessonM2L5.estimatedMinutes).toBe(20);
    expect(lessonM2L5.prerequisites).toEqual(["m2-l4"]);
    expect(lessonM2L5.objectives.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L5.sections.length).toBeGreaterThanOrEqual(5);
    expect(lessonM2L5.summary.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L5.exercise).toBeDefined();
    expect(lessonM2L5.exercise.id).toBe("m2-l5-ex1");
  });

  describe("validateM2L5Exercise()", () => {
    const successResult = { status: "success", error: null };

    it("passes when output has exact expected line '100'", () => {
      const output = [{ type: "log", text: "100" }];
      const res = validateM2L5Exercise(output, successResult);
      expect(res.passed).toBe(true);
      expect(res.status).toBe("success");
      expect(res.message).toContain("Success!");
    });

    it("passes with trailing newlines", () => {
      const output = [{ type: "log", text: "100\n" }];
      const res = validateM2L5Exercise(output, successResult);
      expect(res.passed).toBe(true);
    });

    it("rejects when no output is produced", () => {
      const res = validateM2L5Exercise([], successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("No output was printed");
    });

    it("provides specific diagnostic when string concatenation produced '4060'", () => {
      const output = [{ type: "log", text: "4060" }];
      const res = validateM2L5Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("You got '4060' because the + operator concatenated");
      expect(res.message).toContain("Number(input1) + Number(input2)");
    });

    it("provides specific diagnostic when result is NaN", () => {
      const output = [{ type: "log", text: "NaN" }];
      const res = validateM2L5Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Result is NaN");
    });

    it("rejects multiple output lines", () => {
      const output = [
        { type: "log", text: "100" },
        { type: "log", text: "extra" },
      ];
      const res = validateM2L5Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Multiple output lines detected");
    });

    it("handles SyntaxError, ReferenceError, and timeout cleanly", () => {
      const synErr = {
        status: "error",
        error: { name: "SyntaxError", message: "missing ) after argument list" },
      };
      const resSyn = validateM2L5Exercise([], synErr);
      expect(resSyn.passed).toBe(false);
      expect(resSyn.message).toContain("Syntax Error");

      const refErr = {
        status: "error",
        error: { name: "ReferenceError", message: "input3 is not defined" },
      };
      const resRef = validateM2L5Exercise([], refErr);
      expect(resRef.passed).toBe(false);
      expect(resRef.message).toContain("Reference Error");

      const timeoutRes = validateM2L5Exercise([], { status: "terminated" });
      expect(timeoutRes.passed).toBe(false);
      expect(timeoutRes.message).toContain("Execution timed out");
    });
  });
});
