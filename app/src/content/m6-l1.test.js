import { describe, expect, it } from "vitest";
import { lessonM6L1, validateM6L1Exercise } from "./m6-l1.js";

describe("Module 6, Lesson 1", () => {
  it("defines the canonical lesson and exercise metadata", () => {
    expect(lessonM6L1.lessonId).toBe("m6-l1");
    expect(lessonM6L1.title).toBe("The Relationship Between JavaScript, HTML, and CSS");
    expect(lessonM6L1.estimatedMinutes).toBe(20);
    expect(lessonM6L1.prerequisites).toEqual(["m5-l8"]);
    expect(lessonM6L1.objectives).toHaveLength(2);
    expect(lessonM6L1.exercise.id).toBe("m6-l1-ex1");
    expect(lessonM6L1.exercise.executionMode).toBe("worker");
    expect(lessonM6L1.exercise.hints).toHaveLength(2);
  });

  it("teaches the distinct roles and their cooperation", () => {
    const text = lessonM6L1.sections.map(({ content }) => content).join(" ");
    expect(text).toContain("HTML");
    expect(text).toContain("CSS");
    expect(text).toContain("JavaScript");
    expect(text).toContain("does not replace");
  });

  it("accepts only the three role labels in the expected order", () => {
    const entries = [
      "HTML: structure",
      "CSS: presentation",
      "JavaScript: behavior",
    ].map((text) => ({ type: "log", text }));
    expect(validateM6L1Exercise(entries, { status: "success" }).passed).toBe(true);
    expect(validateM6L1Exercise(entries.slice(0, 2), { status: "success" }).passed).toBe(false);
    expect(
      validateM6L1Exercise(
        [entries[1], entries[0], entries[2]],
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides execution-error and timeout feedback", () => {
    expect(validateM6L1Exercise([], {
      status: "error",
      error: { name: "SyntaxError", message: "Unexpected token" },
    }).message).toContain("Syntax Error");
    expect(validateM6L1Exercise([], { status: "terminated" }).message).toContain("timed out");
  });
});
