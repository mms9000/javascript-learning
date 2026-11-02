/**
 * content/m4-l4.test.js — Tests for Module 4, Lesson 4.
 */

import { describe, it, expect } from "vitest";
import { lessonM4L4, validateM4L4Exercise } from "./m4-l4.js";

describe("Module 4, Lesson 4 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM4L4.lessonId).toBe("m4-l4");
    expect(lessonM4L4.title).toBe("Scope and Lexical Scope");
    expect(lessonM4L4.estimatedMinutes).toBe(20);
    expect(lessonM4L4.prerequisites).toEqual(["m4-l3"]);
    expect(lessonM4L4.objectives).toHaveLength(3);
    expect(lessonM4L4.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM4L4.exercise.id).toBe("m4-l4-ex1");
    expect(lessonM4L4.exercise.expectedOutput).toBe("learner: JavaScript");
    expect(lessonM4L4.exercise.hints).toHaveLength(2);
  });

  it("explains local bindings and lexical lookup", () => {
    const text = [...lessonM4L4.sections.map(({ content }) => content), ...lessonM4L4.summary].join(" ");
    expect(text).toContain("local to that function");
    expect(text).toContain("surrounding scope");
    expect(text).toContain("where it was written");
  });

  it("accepts the expected message", () => {
    expect(
      validateM4L4Exercise(
        [{ type: "log", text: "learner: JavaScript\n" }],
        { status: "success" }
      ).passed
    ).toBe(true);
  });

  it("rejects missing, extra, and incorrect output with scope guidance", () => {
    expect(
      validateM4L4Exercise([], { status: "success" }).message
    ).toContain("enclosing scope");
    expect(
      validateM4L4Exercise(
        [
          { type: "log", text: "learner" },
          { type: "log", text: "JavaScript" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM4L4Exercise(
        [{ type: "log", text: "learner: Java" }],
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM4L4Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM4L4Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "courseNme is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM4L4Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "not callable" },
      }).message
    ).toContain("Type Error");
    expect(validateM4L4Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
