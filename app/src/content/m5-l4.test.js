/**
 * content/m5-l4.test.js — Tests for Module 5, Lesson 4.
 */

import { describe, it, expect } from "vitest";
import { lessonM5L4, validateM5L4Exercise } from "./m5-l4.js";

describe("Module 5, Lesson 4 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM5L4.lessonId).toBe("m5-l4");
    expect(lessonM5L4.title).toBe("Creating and Updating Objects");
    expect(lessonM5L4.estimatedMinutes).toBe(20);
    expect(lessonM5L4.prerequisites).toEqual(["m5-l3"]);
    expect(lessonM5L4.objectives).toHaveLength(3);
    expect(lessonM5L4.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM5L4.exercise.id).toBe("m5-l4-ex1");
    expect(lessonM5L4.exercise.expectedOutput).toBe("River\n3\nA3");
    expect(lessonM5L4.exercise.hints).toHaveLength(2);
  });

  it("explains object literals, dot and bracket access, and property updates", () => {
    const text = [...lessonM5L4.sections.map(({ content }) => content), ...lessonM5L4.summary].join(" ");
    expect(text).toMatch(/object\s+literal/);
    expect(text).toContain("book[key]");
    expect(text).toContain("book.key");
    expect(text).toContain("adds it to the object");
  });

  it("accepts the exact object property output", () => {
    expect(
      validateM5L4Exercise(
        ["River", "3", "A3"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(true);
  });

  it("rejects missing, extra, or incorrect output with property guidance", () => {
    expect(validateM5L4Exercise([], { status: "success" }).message).toContain(
      "object literal"
    );
    expect(
      validateM5L4Exercise(
        ["River", "3", "A3", "extra"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM5L4Exercise(
        ["River", "2", "A3"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM5L4Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM5L4Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "bok is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM5L4Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "unknown browser-specific text" },
      }).message
    ).toContain("Type Error");
    expect(validateM5L4Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
