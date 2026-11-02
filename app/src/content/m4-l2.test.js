/**
 * content/m4-l2.test.js — Tests for Module 4, Lesson 2.
 */

import { describe, it, expect } from "vitest";
import { lessonM4L2, validateM4L2Exercise } from "./m4-l2.js";

describe("Module 4, Lesson 2 Content", () => {
  it("defines the canonical lesson metadata and exercise", () => {
    expect(lessonM4L2.lessonId).toBe("m4-l2");
    expect(lessonM4L2.moduleId).toBe("m4");
    expect(lessonM4L2.title).toBe("Parameters, Arguments, and Return Values");
    expect(lessonM4L2.estimatedMinutes).toBe(20);
    expect(lessonM4L2.prerequisites).toEqual(["m4-l1"]);
    expect(lessonM4L2.objectives).toHaveLength(3);
    expect(lessonM4L2.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM4L2.exercise.id).toBe("m4-l2-ex1");
    expect(lessonM4L2.exercise.expectedOutput).toBe("24");
    expect(lessonM4L2.exercise.hints).toHaveLength(2);
  });

  it("explains parameters, arguments, return, and printing", () => {
    const text = [...lessonM4L2.sections.map(({ content }) => content), ...lessonM4L2.summary].join(" ");
    expect(text).toContain("parameter");
    expect(text).toContain("argument");
    expect(text).toContain("return");
    expect(text).toContain("does not send that value back");
  });

  it("accepts the returned total and trailing newlines", () => {
    expect(
      validateM4L2Exercise([{ type: "log", text: "24\n" }], { status: "success" }).passed
    ).toBe(true);
  });

  it("rejects missing, extra, or incorrect output and explains return versus log", () => {
    expect(
      validateM4L2Exercise([], { status: "success" }).message
    ).toContain("Return amount + fee");
    expect(
      validateM4L2Exercise(
        [
          { type: "log", text: "24" },
          { type: "log", text: "undefined" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM4L2Exercise([{ type: "log", text: "25" }], { status: "success" }).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM4L2Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM4L2Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "fee is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM4L2Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "not callable" },
      }).message
    ).toContain("Type Error");
    expect(validateM4L2Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
