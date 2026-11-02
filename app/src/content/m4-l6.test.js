/**
 * content/m4-l6.test.js — Tests for Module 4, Lesson 6.
 */

import { describe, it, expect } from "vitest";
import { lessonM4L6, validateM4L6Exercise } from "./m4-l6.js";

describe("Module 4, Lesson 6 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM4L6.lessonId).toBe("m4-l6");
    expect(lessonM4L6.title).toBe("Closures");
    expect(lessonM4L6.estimatedMinutes).toBe(25);
    expect(lessonM4L6.prerequisites).toEqual(["m4-l5"]);
    expect(lessonM4L6.objectives).toHaveLength(3);
    expect(lessonM4L6.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM4L6.exercise.id).toBe("m4-l6-ex1");
    expect(lessonM4L6.exercise.expectedOutput).toBe("1\n2\n1");
    expect(lessonM4L6.exercise.hints).toHaveLength(2);
  });

  it("explains retained lexical bindings and independent private state", () => {
    const text = [...lessonM4L6.sections.map(({ content }) => content), ...lessonM4L6.summary].join(" ");
    expect(text).toContain("after the outer");
    expect(text).toContain("private");
    expect(text).toContain("different bindings");
  });

  it("accepts the independent counter sequence", () => {
    expect(
      validateM4L6Exercise(
        ["1", "2", "1"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(true);
  });

  it("rejects missing, extra, or shared-state output with closure guidance", () => {
    expect(
      validateM4L6Exercise([], { status: "success" }).message
    ).toContain("each call to createCounter needs its own count");
    expect(
      validateM4L6Exercise(
        ["1", "2", "3"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM4L6Exercise(
        ["1", "2"].map((text) => ({ type: "log", text })),
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM4L6Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM4L6Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "createCountr is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM4L6Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "not callable" },
      }).message
    ).toContain("Type Error");
    expect(validateM4L6Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
