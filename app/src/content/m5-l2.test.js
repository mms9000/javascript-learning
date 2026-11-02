/**
 * content/m5-l2.test.js — Tests for Module 5, Lesson 2.
 */

import { describe, it, expect } from "vitest";
import { lessonM5L2, validateM5L2Exercise } from "./m5-l2.js";

describe("Module 5, Lesson 2 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM5L2.lessonId).toBe("m5-l2");
    expect(lessonM5L2.title).toBe("Iteration and Array Methods");
    expect(lessonM5L2.estimatedMinutes).toBe(20);
    expect(lessonM5L2.prerequisites).toEqual(["m5-l1"]);
    expect(lessonM5L2.objectives).toHaveLength(3);
    expect(lessonM5L2.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM5L2.exercise.id).toBe("m5-l2-ex1");
    expect(lessonM5L2.exercise.expectedOutput).toBe("4\n8\n2\n3\ntrue");
    expect(lessonM5L2.exercise.hints).toHaveLength(2);
  });

  it("explains loop values, push, and includes behavior", () => {
    const text = [...lessonM5L2.sections.map(({ content }) => content), ...lessonM5L2.summary].join(" ");
    expect(text).toContain("one array value at a time");
    expect(text).toContain("push");
    expect(text).toContain("includes");
    expect(text).toContain("returns a value");
  });

  it("accepts the exact collected results and membership check", () => {
    expect(
      validateM5L2Exercise(
        ["4", "8", "2", "3", "true"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(true);
  });

  it("rejects missing, extra, or incorrect output with loop guidance", () => {
    expect(validateM5L2Exercise([], { status: "success" }).message).toContain(
      "Visit each reading"
    );
    expect(
      validateM5L2Exercise(
        ["4", "8", "2", "3", "true", "extra"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM5L2Exercise(
        ["4", "2", "8", "3", "true"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM5L2Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM5L2Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "doubeld is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM5L2Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "unknown browser-specific text" },
      }).message
    ).toContain("Type Error");
    expect(validateM5L2Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
