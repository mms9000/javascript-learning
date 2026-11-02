/**
 * content/m3-l5.test.js — Tests for Module 3, Lesson 5.
 */

import { describe, it, expect } from "vitest";
import { lessonM3L5, validateM3L5Exercise } from "./m3-l5.js";

describe("Module 3, Lesson 5 Content", () => {
  it("defines break/continue objectives and the expected exercise", () => {
    expect(lessonM3L5.lessonId).toBe("m3-l5");
    expect(lessonM3L5.title).toBe("break and continue");
    expect(lessonM3L5.estimatedMinutes).toBe(15);
    expect(lessonM3L5.prerequisites).toEqual(["m3-l4"]);
    expect(lessonM3L5.objectives).toHaveLength(3);
    expect(lessonM3L5.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM3L5.exercise.id).toBe("m3-l5-ex1");
    expect(lessonM3L5.exercise.expectedOutput).toBe("1\n2\n4\n5");
    expect(lessonM3L5.exercise.hints).toHaveLength(2);
  });

  it("explains distinct continue and break behavior and the while-update pitfall", () => {
    const text = lessonM3L5.sections.map(({ content }) => content).join(" ");
    expect(text).toContain("does not end the loop");
    expect(text).toContain("exits the nearest enclosing loop");
    expect(text).toContain("prevent progress");
  });

  it("validates the exact ordered output", () => {
    const entries = ["1", "2", "4", "5"].map((text) => ({ type: "log", text }));
    expect(validateM3L5Exercise(entries, { status: "success" }).passed).toBe(true);
    entries[3].text = "5\n";
    expect(validateM3L5Exercise(entries, { status: "success" }).passed).toBe(true);
  });

  it("rejects output that fails to skip, stop, or match the sequence", () => {
    const withoutSkip = ["1", "2", "3", "4", "5"].map((text) => ({ type: "log", text }));
    expect(validateM3L5Exercise(withoutSkip, { status: "success" }).message).toContain(
      "continue before the log"
    );
    expect(validateM3L5Exercise([], { status: "success" }).passed).toBe(false);
    expect(
      validateM3L5Exercise(
        [
          { type: "log", text: "1" },
          { type: "log", text: "2" },
          { type: "log", text: "4" },
          { type: "log", text: "5" },
          { type: "log", text: "6" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("returns shared timeout feedback", () => {
    expect(validateM3L5Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
