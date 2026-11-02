/**
 * content/m5-l1.test.js — Tests for Module 5, Lesson 1.
 */

import { describe, it, expect } from "vitest";
import { lessonM5L1, validateM5L1Exercise } from "./m5-l1.js";

describe("Module 5, Lesson 1 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM5L1.lessonId).toBe("m5-l1");
    expect(lessonM5L1.title).toBe("Creating and Accessing Arrays");
    expect(lessonM5L1.estimatedMinutes).toBe(20);
    expect(lessonM5L1.prerequisites).toEqual(["m4-l7"]);
    expect(lessonM5L1.objectives).toHaveLength(3);
    expect(lessonM5L1.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM5L1.exercise.id).toBe("m5-l1-ex1");
    expect(lessonM5L1.exercise.expectedOutput).toBe("Museum\nPark\n3");
    expect(lessonM5L1.exercise.hints).toHaveLength(2);
  });

  it("teaches array literals, zero-based indexes, length, and the final index", () => {
    const text = [...lessonM5L1.sections.map(({ content }) => content), ...lessonM5L1.summary].join(" ");
    expect(text).toContain("array stores an ordered list");
    expect(text).toContain("indexes start at zero");
    expect(text).toContain("stops.length - 1");
    expect(text).toContain("undefined");
  });

  it("accepts the exact first, last, and length output", () => {
    const result = validateM5L1Exercise(
      ["Museum", "Park", "3"].map((text) => ({ type: "log", text })),
      { status: "success" }
    );
    expect(result.passed).toBe(true);
  });

  it("rejects missing, extra, and incorrect output with index guidance", () => {
    expect(validateM5L1Exercise([], { status: "success" }).message).toContain(
      "indexes start at 0"
    );
    expect(
      validateM5L1Exercise(
        ["Museum", "Park", "3", "extra"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM5L1Exercise(
        ["Museum", "Library", "3"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM5L1Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM5L1Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "stps is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM5L1Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "unknown browser-specific text" },
      }).message
    ).toContain("Type Error");
    expect(validateM5L1Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
