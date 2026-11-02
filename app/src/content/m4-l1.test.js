/**
 * content/m4-l1.test.js — Tests for Module 4, Lesson 1.
 */

import { describe, it, expect } from "vitest";
import { lessonM4L1, validateM4L1Exercise } from "./m4-l1.js";

describe("Module 4, Lesson 1 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM4L1.lessonId).toBe("m4-l1");
    expect(lessonM4L1.moduleId).toBe("m4");
    expect(lessonM4L1.title).toBe("Function Declarations and Expressions");
    expect(lessonM4L1.estimatedMinutes).toBe(20);
    expect(lessonM4L1.prerequisites).toEqual(["m3-l6"]);
    expect(lessonM4L1.objectives).toHaveLength(3);
    expect(lessonM4L1.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM4L1.exercise.id).toBe("m4-l1-ex1");
    expect(lessonM4L1.exercise.expectedOutput).toBe("Welcome\nPractice functions");
    expect(lessonM4L1.exercise.hints).toHaveLength(2);
  });

  it("explains definition versus invocation", () => {
    const text = [...lessonM4L1.sections.map(({ content }) => content), ...lessonM4L1.summary].join(" ");
    expect(text).toContain("does not run until the function is called");
    expect(text).toContain("function expression");
    expect(text).toContain("call");
  });

  it("accepts exact ordered output and trailing newlines", () => {
    const entries = [
      { type: "log", text: "Welcome" },
      { type: "log", text: "Practice functions\n" },
    ];
    expect(validateM4L1Exercise(entries, { status: "success" }).passed).toBe(true);
  });

  it("rejects missing, extra, and reordered output with actionable guidance", () => {
    expect(validateM4L1Exercise([], { status: "success" }).message).toContain("call each function");
    expect(
      validateM4L1Exercise(
        [
          { type: "log", text: "Welcome" },
          { type: "log", text: "Practice functions" },
          { type: "log", text: "Again" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM4L1Exercise(
        [
          { type: "log", text: "Practice functions" },
          { type: "log", text: "Welcome" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM4L1Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM4L1Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "showWelcom is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM4L1Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "not callable" },
      }).message
    ).toContain("Type Error");
    expect(validateM4L1Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
