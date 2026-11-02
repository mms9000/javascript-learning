/**
 * content/m3-l4.test.js — Tests for Module 3, Lesson 4.
 */

import { describe, it, expect } from "vitest";
import { lessonM3L4, validateM3L4Exercise } from "./m3-l4.js";

describe("Module 3, Lesson 4 Content", () => {
  it("defines loop objectives, lesson structure, and exercise", () => {
    expect(lessonM3L4.lessonId).toBe("m3-l4");
    expect(lessonM3L4.title).toBe("for and while Loops");
    expect(lessonM3L4.estimatedMinutes).toBe(20);
    expect(lessonM3L4.prerequisites).toEqual(["m3-l3"]);
    expect(lessonM3L4.objectives).toHaveLength(3);
    expect(lessonM3L4.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM3L4.exercise.id).toBe("m3-l4-ex1");
    expect(lessonM3L4.exercise.expectedOutput).toBe("10\n10");
    expect(lessonM3L4.exercise.hints).toHaveLength(2);
  });

  it("explains loop initialization, condition, update, and termination", () => {
    const text = lessonM3L4.sections.map(({ content }) => content).join(" ");
    for (const phrase of ["initialization", "condition", "update", "does not finish"]) {
      expect(text).toContain(phrase);
    }
  });

  it("passes exact totals and trailing newlines", () => {
    const entries = [
      { type: "log", text: "10\n" },
      { type: "log", text: "10\r\n" },
    ];
    expect(validateM3L4Exercise(entries, { status: "success" }).passed).toBe(true);
  });

  it("rejects missing, incorrect, or extra totals", () => {
    expect(validateM3L4Exercise([], { status: "success" }).passed).toBe(false);
    expect(
      validateM3L4Exercise(
        [
          { type: "log", text: "10" },
          { type: "log", text: "6" },
        ],
        { status: "success" }
      ).message
    ).toContain("loop start, end condition, and update");
    expect(
      validateM3L4Exercise(
        [
          { type: "log", text: "10" },
          { type: "log", text: "10" },
          { type: "log", text: "extra" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("gives a specific timeout reminder for non-terminating loops", () => {
    expect(validateM3L4Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
