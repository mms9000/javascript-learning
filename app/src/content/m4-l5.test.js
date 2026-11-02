/**
 * content/m4-l5.test.js — Tests for Module 4, Lesson 5.
 */

import { describe, it, expect } from "vitest";
import { lessonM4L5, validateM4L5Exercise } from "./m4-l5.js";

describe("Module 4, Lesson 5 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM4L5.lessonId).toBe("m4-l5");
    expect(lessonM4L5.title).toBe("Callbacks and Higher-Order Functions");
    expect(lessonM4L5.estimatedMinutes).toBe(25);
    expect(lessonM4L5.prerequisites).toEqual(["m4-l4"]);
    expect(lessonM4L5.objectives).toHaveLength(3);
    expect(lessonM4L5.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM4L5.exercise.id).toBe("m4-l5-ex1");
    expect(lessonM4L5.exercise.expectedOutput).toBe("15");
    expect(lessonM4L5.exercise.hints).toHaveLength(2);
  });

  it("teaches function values, callback invocation, and synchronous execution", () => {
    const text = [...lessonM4L5.sections.map(({ content }) => content), ...lessonM4L5.summary].join(" ");
    expect(text).toContain("without parentheses");
    expect(text).toContain("higher-order function");
    expect(text).toContain("synchronous callback");
  });

  it("accepts the callback result", () => {
    expect(
      validateM4L5Exercise([{ type: "log", text: "15\n" }], { status: "success" }).passed
    ).toBe(true);
  });

  it("rejects missing, extra, and incorrect output with callback guidance", () => {
    expect(
      validateM4L5Exercise([], { status: "success" }).message
    ).toContain("Pass addBonus as a function value");
    expect(
      validateM4L5Exercise(
        [
          { type: "log", text: "15" },
          { type: "log", text: "15" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM4L5Exercise([{ type: "log", text: "10" }], { status: "success" }).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM4L5Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM4L5Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "callbak is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM4L5Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "callback is not a function" },
      }).message
    ).toContain("Type Error");
    expect(validateM4L5Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
