/**
 * content/m5-l3.test.js — Tests for Module 5, Lesson 3.
 */

import { describe, it, expect } from "vitest";
import { lessonM5L3, validateM5L3Exercise } from "./m5-l3.js";

describe("Module 5, Lesson 3 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM5L3.lessonId).toBe("m5-l3");
    expect(lessonM5L3.title).toBe("map, filter, find, and reduce");
    expect(lessonM5L3.estimatedMinutes).toBe(30);
    expect(lessonM5L3.prerequisites).toEqual(["m5-l2"]);
    expect(lessonM5L3.objectives).toHaveLength(4);
    expect(lessonM5L3.sections.map(({ id }) => id)).toContain("callback-return-values");
    expect(lessonM5L3.exercise.id).toBe("m5-l3-ex1");
    expect(lessonM5L3.exercise.expectedOutput).toBe(
      "6\n14\n10\n18\nPassing: 2\nFirst: 7\nTotal: 24"
    );
    expect(lessonM5L3.exercise.hints).toHaveLength(2);
  });

  it("distinguishes each method's callback and return value", () => {
    const text = [...lessonM5L3.sections.map(({ content }) => content), ...lessonM5L3.summary].join(" ");
    expect(text).toContain("returns a new");
    expect(text).toContain("first matching item");
    expect(text).toContain("running accumulator");
    expect(text).toContain("initial value");
    expect(text).toContain("run synchronously");
  });

  it("accepts the exact transformed, filtered, found, and reduced output", () => {
    const expected = ["6", "14", "10", "18", "Passing: 2", "First: 7", "Total: 24"];
    expect(
      validateM5L3Exercise(
        expected.map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(true);
  });

  it("rejects missing, extra, or incorrect output with method guidance", () => {
    expect(validateM5L3Exercise([], { status: "success" }).message).toContain(
      "map transforms each score"
    );
    expect(
      validateM5L3Exercise(
        ["6", "14", "10", "18", "Passing: 2", "First: 7", "Total: 24", "extra"].map(
          (text) => ({ type: "log", text })
        ),
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM5L3Exercise(
        ["6", "14", "10", "18", "Passing: 3", "First: 7", "Total: 24"].map(
          (text) => ({ type: "log", text })
        ),
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM5L3Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM5L3Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "socre is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM5L3Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "unknown browser-specific text" },
      }).message
    ).toContain("Type Error");
    expect(validateM5L3Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
