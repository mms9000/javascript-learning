/**
 * content/m5-l7.test.js — Tests for Module 5, Lesson 7.
 */

import { describe, it, expect } from "vitest";
import { lessonM5L7, validateM5L7Exercise } from "./m5-l7.js";

describe("Module 5, Lesson 7 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM5L7.lessonId).toBe("m5-l7");
    expect(lessonM5L7.title).toBe("References, Mutation, and Copying");
    expect(lessonM5L7.estimatedMinutes).toBe(25);
    expect(lessonM5L7.prerequisites).toEqual(["m5-l6"]);
    expect(lessonM5L7.objectives).toHaveLength(3);
    expect(lessonM5L7.sections.map(({ id }) => id)).toContain("shared-nested-reference");
    expect(lessonM5L7.exercise.id).toBe("m5-l7-ex1");
    expect(lessonM5L7.exercise.expectedOutput).toBe(
      "4\n9\nPublished\nPublished\nMy copy\narrays"
    );
    expect(lessonM5L7.exercise.hints).toHaveLength(2);
  });

  it("contrasts independent primitive values, aliases, and shallow copies", () => {
    const text = [...lessonM5L7.sections.map(({ content }) => content), ...lessonM5L7.summary].join(" ");
    expect(text).toContain("primitive value");
    expect(text).toContain("same object");
    expect(text).toContain("shallow");
    expect(text).toContain("same nested value");
  });

  it("accepts output demonstrating independent primitives and shared nested references", () => {
    const expected = ["4", "9", "Published", "Published", "My copy", "arrays"];
    expect(
      validateM5L7Exercise(
        expected.map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(true);
  });

  it("rejects missing, extra, or incorrect output with reference guidance", () => {
    expect(validateM5L7Exercise([], { status: "success" }).message).toContain(
      "Reassigning a primitive binding"
    );
    expect(
      validateM5L7Exercise(
        ["4", "9", "Published", "Published", "My copy", "arrays", "extra"].map(
          (text) => ({ type: "log", text })
        ),
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM5L7Exercise(
        ["9", "9", "Published", "Published", "My copy", "arrays"].map((text) => ({
          type: "log",
          text,
        })),
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM5L7Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM5L7Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "origianl is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM5L7Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "unknown browser-specific text" },
      }).message
    ).toContain("Type Error");
    expect(validateM5L7Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
