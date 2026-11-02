/**
 * content/m2-l2.test.js — Unit tests for Module 2, Lesson 2.
 */

import { describe, it, expect } from "vitest";
import { lessonM2L2, validateM2L2Exercise } from "./m2-l2.js";

describe("Module 2, Lesson 2 Content", () => {
  it("defines the required lesson structure complying with curriculum-spec.md", () => {
    expect(lessonM2L2.lessonId).toBe("m2-l2");
    expect(lessonM2L2.moduleId).toBe("m2");
    expect(lessonM2L2.title).toBe("Declaring Variables with const and let");
    expect(lessonM2L2.estimatedMinutes).toBe(15);
    expect(lessonM2L2.prerequisites).toEqual(["m2-l1"]);
    expect(lessonM2L2.objectives.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L2.sections.length).toBeGreaterThanOrEqual(5);
    expect(lessonM2L2.summary.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L2.exercise).toBeDefined();
    expect(lessonM2L2.exercise.id).toBe("m2-l2-ex1");
  });

  describe("validateM2L2Exercise()", () => {
    const successResult = { status: "success", error: null };

    it("passes when output has exact expected 2 lines: 'JavaScript Basics' and '2'", () => {
      const output = [
        { type: "log", text: "JavaScript Basics" },
        { type: "log", text: "2" },
      ];
      const res = validateM2L2Exercise(output, successResult);
      expect(res.passed).toBe(true);
      expect(res.status).toBe("success");
      expect(res.message).toContain("Success!");
    });

    it("passes when values have trailing newlines", () => {
      const output = [
        { type: "log", text: "JavaScript Basics\n" },
        { type: "log", text: "2\r\n" },
      ];
      const res = validateM2L2Exercise(output, successResult);
      expect(res.passed).toBe(true);
    });

    it("rejects when no output is printed", () => {
      const res = validateM2L2Exercise([], successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("No output was printed");
    });

    it("rejects when only 1 line of output is produced", () => {
      const output = [{ type: "log", text: "JavaScript Basics" }];
      const res = validateM2L2Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Only 1 line of output detected");
    });

    it("rejects when extra output lines are produced", () => {
      const output = [
        { type: "log", text: "JavaScript Basics" },
        { type: "log", text: "2" },
        { type: "log", text: "extra" },
      ];
      const res = validateM2L2Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Multiple extra output lines detected");
    });

    it("rejects inverted line order", () => {
      const output = [
        { type: "log", text: "2" },
        { type: "log", text: "JavaScript Basics" },
      ];
      const res = validateM2L2Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Line order inverted");
    });

    it("rejects capitalization mismatch", () => {
      const output = [
        { type: "log", text: "javascript basics" },
        { type: "log", text: "2" },
      ];
      const res = validateM2L2Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Capitalization mismatch");
    });

    it("handles execution errors with friendly diagnostics", () => {
      const refErr = {
        status: "error",
        error: { name: "ReferenceError", message: "courseName is not defined" },
      };
      const res = validateM2L2Exercise([], refErr);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Reference Error");
      expect(res.message).toContain("courseName");
    });
  });
});
