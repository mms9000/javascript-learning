/**
 * content/m3-l6.test.js — Tests for Module 3, Lesson 6 milestone.
 */

import { describe, it, expect } from "vitest";
import { lessonM3L6, validateM3L6Exercise } from "./m3-l6.js";

describe("Module 3, Lesson 6 Content", () => {
  it("defines the milestone, objectives, next-module prerequisite, and exercise", () => {
    expect(lessonM3L6.lessonId).toBe("m3-l6");
    expect(lessonM3L6.title).toBe("Choosing an Appropriate Control Structure");
    expect(lessonM3L6.estimatedMinutes).toBe(15);
    expect(lessonM3L6.prerequisites).toEqual(["m3-l5"]);
    expect(lessonM3L6.objectives).toHaveLength(3);
    expect(lessonM3L6.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM3L6.exercise.id).toBe("m3-l6-ex1");
    expect(lessonM3L6.exercise.hints).toHaveLength(2);
    expect(lessonM3L6.exercise.expectedOutput).toBe(
      "1: too low\n2: too low\n4: too low\nFound 5"
    );
  });

  it("describes a deterministic bounded simulation without input or randomness", () => {
    const text = [
      ...lessonM3L6.sections.map(({ content }) => content),
      ...lessonM3L6.summary,
    ].join(" ");
    expect(text).toContain("fixed upper bound");
    expect(text).toContain("does not use randomness");
    expect(text).toContain("does not request input");
  });

  it("validates the exact milestone output and trailing newlines", () => {
    const entries = ["1: too low", "2: too low", "4: too low", "Found 5"].map((text) => ({
      type: "log",
      text,
    }));
    expect(validateM3L6Exercise(entries, { status: "success" }).passed).toBe(true);
    entries[3].text = "Found 5\n";
    expect(validateM3L6Exercise(entries, { status: "success" }).passed).toBe(true);
  });

  it("rejects missing, extra, and incorrect search output", () => {
    expect(validateM3L6Exercise([], { status: "success" }).passed).toBe(false);
    expect(
      validateM3L6Exercise(
        [
          { type: "log", text: "1: too low" },
          { type: "log", text: "3: too low" },
          { type: "log", text: "4: too low" },
          { type: "log", text: "Found 5" },
        ],
        { status: "success" }
      ).message
    ).toContain("skip");
    expect(
      validateM3L6Exercise(
        [
          { type: "log", text: "1: too low" },
          { type: "log", text: "2: too low" },
          { type: "log", text: "4: too low" },
          { type: "log", text: "Found 5" },
          { type: "log", text: "6: too high" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides shared syntax, reference, and timeout feedback", () => {
    expect(
      validateM3L6Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM3L6Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "targetNumer is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(validateM3L6Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
