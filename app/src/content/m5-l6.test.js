/**
 * content/m5-l6.test.js — Tests for Module 5, Lesson 6.
 */

import { describe, it, expect } from "vitest";
import { lessonM5L6, validateM5L6Exercise } from "./m5-l6.js";

describe("Module 5, Lesson 6 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM5L6.lessonId).toBe("m5-l6");
    expect(lessonM5L6.title).toBe("Destructuring, Spread, and Rest Syntax");
    expect(lessonM5L6.estimatedMinutes).toBe(20);
    expect(lessonM5L6.prerequisites).toEqual(["m5-l5"]);
    expect(lessonM5L6.objectives).toHaveLength(3);
    expect(lessonM5L6.sections.map(({ id }) => id)).toContain("rest-versus-spread");
    expect(lessonM5L6.exercise.id).toBe("m5-l6-ex1");
    expect(lessonM5L6.exercise.expectedOutput).toBe("4\n12\nMira\n2\n3\n3");
    expect(lessonM5L6.exercise.hints).toHaveLength(2);
  });

  it("distinguishes array and object destructuring, rest collection, and spread expansion", () => {
    const text = [...lessonM5L6.sections.map(({ content }) => content), ...lessonM5L6.summary].join(" ");
    expect(text).toContain("Array destructuring");
    expect(text).toContain("Object destructuring");
    expect(text).toContain("Rest syntax collects");
    expect(text).toContain("Spread syntax expands");
    expect(text).toContain("shallow copy");
  });

  it("accepts the exact destructuring and spread output", () => {
    expect(
      validateM5L6Exercise(
        ["4", "12", "Mira", "2", "3", "3"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(true);
  });

  it("rejects missing, extra, or incorrect output with rest/spread guidance", () => {
    expect(validateM5L6Exercise([], { status: "success" }).message).toContain(
      "rest) and which expands"
    );
    expect(
      validateM5L6Exercise(
        ["4", "12", "Mira", "2", "3", "3", "extra"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM5L6Exercise(
        ["4", "9", "Mira", "2", "3", "3"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM5L6Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM5L6Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "playerData is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM5L6Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "unknown browser-specific text" },
      }).message
    ).toContain("Type Error");
    expect(validateM5L6Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
