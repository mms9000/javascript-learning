/**
 * content/m4-l7.test.js — Tests for Module 4, Lesson 7 milestone.
 */

import { describe, it, expect } from "vitest";
import { lessonM4L7, validateM4L7Exercise } from "./m4-l7.js";

describe("Module 4, Lesson 7 Content", () => {
  it("defines the canonical milestone metadata and exercise", () => {
    expect(lessonM4L7.lessonId).toBe("m4-l7");
    expect(lessonM4L7.title).toBe("Recursion and Common Debugging Patterns");
    expect(lessonM4L7.estimatedMinutes).toBe(20);
    expect(lessonM4L7.prerequisites).toEqual(["m4-l6"]);
    expect(lessonM4L7.objectives).toHaveLength(3);
    expect(lessonM4L7.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM4L7.exercise.id).toBe("m4-l7-ex1");
    expect(lessonM4L7.exercise.expectedOutput).toBe("Total: 6");
    expect(lessonM4L7.exercise.hints).toHaveLength(2);
  });

  it("teaches base cases, progress, and bounded recursive composition", () => {
    const text = [...lessonM4L7.sections.map(({ content }) => content), ...lessonM4L7.summary].join(" ");
    expect(text).toContain("base case");
    expect(text).toContain("move toward the base case");
    expect(text).toContain("bounded");
    expect(text).toContain("synchronous callback");
  });

  it("accepts the milestone output", () => {
    expect(
      validateM4L7Exercise([{ type: "log", text: "Total: 6\n" }], { status: "success" }).passed
    ).toBe(true);
  });

  it("rejects missing, extra, and incorrect output with recursive guidance", () => {
    expect(
      validateM4L7Exercise([], { status: "success" }).message
    ).toContain("base case, recursive progress");
    expect(
      validateM4L7Exercise(
        [
          { type: "log", text: "Total: 6" },
          { type: "log", text: "Done" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM4L7Exercise([{ type: "log", text: "Total: 5" }], { status: "success" }).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM4L7Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM4L7Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "sumStep is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM4L7Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "formatter is not a function" },
      }).message
    ).toContain("Type Error");
    expect(validateM4L7Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
