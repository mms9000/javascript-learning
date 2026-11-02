/**
 * content/m5-l5.test.js — Tests for Module 5, Lesson 5.
 */

import { describe, it, expect } from "vitest";
import { lessonM5L5, validateM5L5Exercise } from "./m5-l5.js";

describe("Module 5, Lesson 5 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM5L5.lessonId).toBe("m5-l5");
    expect(lessonM5L5.title).toBe("Methods and the this Keyword");
    expect(lessonM5L5.estimatedMinutes).toBe(25);
    expect(lessonM5L5.prerequisites).toEqual(["m5-l4"]);
    expect(lessonM5L5.objectives).toHaveLength(3);
    expect(lessonM5L5.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM5L5.exercise.id).toBe("m5-l5-ex1");
    expect(lessonM5L5.exercise.expectedOutput).toBe("5\n5");
    expect(lessonM5L5.exercise.hints).toHaveLength(2);
  });

  it("teaches direct receiver calls and updating and returning this.value", () => {
    const text = [...lessonM5L5.sections.map(({ content }) => content), ...lessonM5L5.summary].join(" ");
    expect(text).toContain("counter.increase(3)");
    expect(text).toContain("this</code> refers to");
    expect(text).toContain("this.value");
    expect(text).toContain("not the same as a local variable");
  });

  it("accepts the updated value returned and stored by the method", () => {
    expect(
      validateM5L5Exercise(
        ["5", "5"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(true);
  });

  it("rejects missing, extra, or incorrect output with receiver guidance", () => {
    expect(validateM5L5Exercise([], { status: "success" }).message).toContain(
      "counter.increase(amount)"
    );
    expect(
      validateM5L5Exercise(
        ["5", "5", "extra"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM5L5Exercise(
        ["5", "2"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM5L5Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM5L5Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "couter is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM5L5Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "unknown browser-specific text" },
      }).message
    ).toContain("Type Error");
    expect(validateM5L5Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
