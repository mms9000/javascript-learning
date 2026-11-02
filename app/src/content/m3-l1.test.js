/**
 * content/m3-l1.test.js — Tests for Module 3, Lesson 1.
 */

import { describe, it, expect } from "vitest";
import { lessonM3L1, validateM3L1Exercise } from "./m3-l1.js";

describe("Module 3, Lesson 1 Content", () => {
  it("defines lesson metadata, objectives, content, and exercise", () => {
    expect(lessonM3L1.lessonId).toBe("m3-l1");
    expect(lessonM3L1.moduleId).toBe("m3");
    expect(lessonM3L1.title).toBe("Truthy and Falsy Values");
    expect(lessonM3L1.estimatedMinutes).toBe(15);
    expect(lessonM3L1.prerequisites).toEqual(["m2-l6"]);
    expect(lessonM3L1.objectives).toHaveLength(3);
    expect(lessonM3L1.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM3L1.exercise.id).toBe("m3-l1-ex1");
    expect(lessonM3L1.exercise.hints).toHaveLength(2);
    expect(lessonM3L1.exercise.expectedOutput).toBe("false\nfalse\ntrue\ntrue");
  });

  it("teaches all falsy primitives and contrastive non-empty strings", () => {
    const text = lessonM3L1.sections.map(({ content }) => content).join(" ");
    for (const value of ["false", "0", "-0", "NaN", '""', "null", "undefined", '"false"']) {
      expect(text).toContain(value);
    }
  });

  it("passes the exact successful output and permits trailing newlines", () => {
    const entries = ["false", "false", "true", "true"].map((text) => ({ type: "log", text }));
    expect(validateM3L1Exercise(entries, { status: "success" }).passed).toBe(true);

    entries[3].text = "true\r\n";
    expect(validateM3L1Exercise(entries, { status: "success" }).passed).toBe(true);
  });

  it("rejects incorrect, missing, and extra output", () => {
    const wrong = ["false", "false", "false", "true"].map((text) => ({ type: "log", text }));
    expect(validateM3L1Exercise(wrong, { status: "success" }).message).toContain("non-empty string");
    expect(validateM3L1Exercise(wrong.slice(0, 3), { status: "success" }).passed).toBe(false);
    expect(
      validateM3L1Exercise([...wrong, { type: "log", text: "extra" }], { status: "success" })
        .passed
    ).toBe(false);
  });

  it("provides shared syntax, reference, and timeout feedback", () => {
    expect(
      validateM3L1Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM3L1Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "emptyText is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(validateM3L1Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
