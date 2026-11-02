/**
 * content/m4-l3.test.js — Tests for Module 4, Lesson 3.
 */

import { describe, it, expect } from "vitest";
import { lessonM4L3, validateM4L3Exercise } from "./m4-l3.js";

describe("Module 4, Lesson 3 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM4L3.lessonId).toBe("m4-l3");
    expect(lessonM4L3.title).toBe("Arrow Functions");
    expect(lessonM4L3.estimatedMinutes).toBe(15);
    expect(lessonM4L3.prerequisites).toEqual(["m4-l2"]);
    expect(lessonM4L3.objectives).toHaveLength(3);
    expect(lessonM4L3.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM4L3.exercise.id).toBe("m4-l3-ex1");
    expect(lessonM4L3.exercise.expectedOutput).toBe("Hello, Sam");
    expect(lessonM4L3.exercise.hints).toHaveLength(2);
  });

  it("teaches expression bodies and explicit block-body returns", () => {
    const text = [...lessonM4L3.sections.map(({ content }) => content), ...lessonM4L3.summary].join(" ");
    expect(text).toContain("expression body");
    expect(text).toContain("explicit return");
    expect(text).toContain("=>");
  });

  it("accepts the exact greeting output", () => {
    expect(
      validateM4L3Exercise([{ type: "log", text: "Hello, Sam\n" }], { status: "success" }).passed
    ).toBe(true);
  });

  it("rejects missing and incorrect output with return guidance", () => {
    expect(
      validateM4L3Exercise([], { status: "success" }).message
    ).toContain("explicit return");
    expect(
      validateM4L3Exercise([{ type: "log", text: "Hi, Sam" }], { status: "success" }).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM4L3Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM4L3Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "makeGreet is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM4L3Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "not callable" },
      }).message
    ).toContain("Type Error");
    expect(validateM4L3Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
