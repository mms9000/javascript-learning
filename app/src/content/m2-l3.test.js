/**
 * content/m2-l3.test.js — Unit tests for Module 2, Lesson 3.
 */

import { describe, it, expect } from "vitest";
import { lessonM2L3, validateM2L3Exercise } from "./m2-l3.js";

describe("Module 2, Lesson 3 Content", () => {
  it("defines the required lesson structure complying with curriculum-spec.md", () => {
    expect(lessonM2L3.lessonId).toBe("m2-l3");
    expect(lessonM2L3.moduleId).toBe("m2");
    expect(lessonM2L3.title).toBe("Reassignment and Value Mutability");
    expect(lessonM2L3.estimatedMinutes).toBe(15);
    expect(lessonM2L3.prerequisites).toEqual(["m2-l2"]);
    expect(lessonM2L3.objectives.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L3.sections.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L3.summary.length).toBeGreaterThanOrEqual(4);
    expect(lessonM2L3.exercise).toBeDefined();
    expect(lessonM2L3.exercise.id).toBe("m2-l3-ex1");
  });

  describe("validateM2L3Exercise()", () => {
    const successResult = { status: "success", error: null };

    it("passes when output has exact expected 2 lines: 10 and 25", () => {
      const output = [
        { type: "log", text: "10" },
        { type: "log", text: "25" },
      ];
      const res = validateM2L3Exercise(output, successResult);
      expect(res.passed).toBe(true);
      expect(res.status).toBe("success");
      expect(res.message).toContain("Success!");
    });

    it("passes with trailing newlines", () => {
      const output = [
        { type: "log", text: "10\n" },
        { type: "log", text: "25\r\n" },
      ];
      const res = validateM2L3Exercise(output, successResult);
      expect(res.passed).toBe(true);
    });

    it("rejects when no output is produced", () => {
      const res = validateM2L3Exercise([], successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("No output was printed");
    });

    it("rejects when only 1 line of output is produced", () => {
      const output = [{ type: "log", text: "10" }];
      const res = validateM2L3Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Only 1 line of output detected");
    });

    it("rejects when extra output lines are produced", () => {
      const output = [
        { type: "log", text: "10" },
        { type: "log", text: "25" },
        { type: "log", text: "30" },
      ];
      const res = validateM2L3Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Multiple extra output lines detected");
    });

    it("rejects inverted line order", () => {
      const output = [
        { type: "log", text: "25" },
        { type: "log", text: "10" },
      ];
      const res = validateM2L3Exercise(output, successResult);
      expect(res.passed).toBe(false);
      expect(res.message).toContain("Line order inverted");
    });

    describe("TypeError discrimination and safety", () => {
      it("provides targeted const reassignment guidance for V8 error message", () => {
        const v8Error = {
          status: "error",
          error: { name: "TypeError", message: "Assignment to constant variable." },
        };
        const res = validateM2L3Exercise([], v8Error);
        expect(res.passed).toBe(false);
        expect(res.message).toContain("You cannot reassign a variable declared with const");
        expect(res.message).toContain("Change 'const score' to 'let score'");
      });

      it("provides targeted const reassignment guidance for SpiderMonkey error message", () => {
        const spiderMonkeyError = {
          status: "error",
          error: { name: "TypeError", message: "invalid assignment to const 'score'" },
        };
        const res = validateM2L3Exercise([], spiderMonkeyError);
        expect(res.passed).toBe(false);
        expect(res.message).toContain("You cannot reassign a variable declared with const");
        expect(res.message).toContain("Change 'const score' to 'let score'");
      });

      it("routes ambiguous Safari message 'Attempted to assign to readonly property.' to generic TypeError fallback", () => {
        const safariError = {
          status: "error",
          error: { name: "TypeError", message: "Attempted to assign to readonly property." },
        };
        const res = validateM2L3Exercise([], safariError);
        expect(res.passed).toBe(false);
        // Must NOT falsely claim const reassignment when message is ambiguous
        expect(res.message).not.toContain("Change 'const score' to 'let score'");
        expect(res.message).toContain("Type Error: Attempted to assign to readonly property.");
        expect(res.message).toContain("Check that variables and functions are used with compatible types");
      });

      it("routes unrelated TypeErrors to generic TypeError fallback", () => {
        const unrelatedError = {
          status: "error",
          error: { name: "TypeError", message: "score is not a function" },
        };
        const res = validateM2L3Exercise([], unrelatedError);
        expect(res.passed).toBe(false);
        expect(res.message).toContain("Type Error: score is not a function.");
      });
    });

    it("handles SyntaxError and ReferenceError cleanly", () => {
      const synErr = {
        status: "error",
        error: { name: "SyntaxError", message: "Identifier 'score' has already been declared" },
      };
      const resSyn = validateM2L3Exercise([], synErr);
      expect(resSyn.passed).toBe(false);
      expect(resSyn.message).toContain("Syntax Error");

      const refErr = {
        status: "error",
        error: { name: "ReferenceError", message: "scrore is not defined" },
      };
      const resRef = validateM2L3Exercise([], refErr);
      expect(resRef.passed).toBe(false);
      expect(resRef.message).toContain("Reference Error");
    });
  });
});
