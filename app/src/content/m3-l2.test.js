/**
 * content/m3-l2.test.js — Tests for Module 3, Lesson 2.
 */

import { describe, it, expect } from "vitest";
import { lessonM3L2, validateM3L2Exercise } from "./m3-l2.js";

describe("Module 3, Lesson 2 Content", () => {
  it("defines lesson metadata, objectives, content, and exercise", () => {
    expect(lessonM3L2.lessonId).toBe("m3-l2");
    expect(lessonM3L2.moduleId).toBe("m3");
    expect(lessonM3L2.title).toBe("if, else if, and else");
    expect(lessonM3L2.estimatedMinutes).toBe(20);
    expect(lessonM3L2.prerequisites).toEqual(["m3-l1"]);
    expect(lessonM3L2.objectives).toHaveLength(3);
    expect(lessonM3L2.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM3L2.exercise.id).toBe("m3-l2-ex1");
    expect(lessonM3L2.exercise.hints).toHaveLength(2);
    expect(lessonM3L2.exercise.expectedOutput).toBe("Passing");
  });

  it("explains first-match ordering, boundaries, and fallback behavior", () => {
    const text = lessonM3L2.sections.map(({ content }) => content).join(" ");
    expect(text).toContain("from top to bottom");
    expect(text).toContain("score &gt;= 70");
    expect(text).toContain("score of 70");
  });

  it("passes expected output and trailing newlines", () => {
    expect(
      validateM3L2Exercise([{ type: "log", text: "Passing\r\n" }], { status: "success" })
        .passed
    ).toBe(true);
  });

  it("rejects missing, extra, and incorrect output with useful feedback", () => {
    expect(validateM3L2Exercise([], { status: "success" }).message).toContain("No output");
    expect(
      validateM3L2Exercise(
        [
          { type: "log", text: "Excellent" },
          { type: "log", text: "Passing" },
        ],
        { status: "success" }
      ).message
    ).toContain("order and boundaries");
    expect(
      validateM3L2Exercise([{ type: "log", text: "Keep practicing" }], { status: "success" })
        .passed
    ).toBe(false);
  });

  it("provides shared syntax, reference, and timeout feedback", () => {
    expect(
      validateM3L2Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM3L2Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "scroe is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(validateM3L2Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
