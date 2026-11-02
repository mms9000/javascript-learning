/**
 * content/m3-l3.test.js — Tests for Module 3, Lesson 3.
 */

import { describe, it, expect } from "vitest";
import { lessonM3L3, validateM3L3Exercise } from "./m3-l3.js";

describe("Module 3, Lesson 3 Content", () => {
  it("defines the lesson, exercise, prerequisites, and two progressive hints", () => {
    expect(lessonM3L3.lessonId).toBe("m3-l3");
    expect(lessonM3L3.title).toBe("switch and Conditional Expressions");
    expect(lessonM3L3.estimatedMinutes).toBe(15);
    expect(lessonM3L3.prerequisites).toEqual(["m3-l2"]);
    expect(lessonM3L3.objectives).toHaveLength(3);
    expect(lessonM3L3.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM3L3.exercise.id).toBe("m3-l3-ex1");
    expect(lessonM3L3.exercise.expectedOutput).toBe("Express delivery\nMember price");
    expect(lessonM3L3.exercise.hints).toHaveLength(2);
  });

  it("clearly defines ternary syntax as the conditional operator", () => {
    const section = lessonM3L3.sections.find(({ id }) => id === "ternary-conditional-operator");
    expect(section.heading).toContain("Ternary");
    expect(section.content).toContain("ternary conditional operator");
    expect(section.content).toContain("condition ? valueIfTrue : valueIfFalse");
  });

  it("validates exact expected output and trailing newlines", () => {
    const entries = [
      { type: "log", text: "Express delivery" },
      { type: "log", text: "Member price\n" },
    ];
    expect(validateM3L3Exercise(entries, { status: "success" }).passed).toBe(true);
  });

  it("rejects incorrect, missing, and extra output", () => {
    expect(
      validateM3L3Exercise([{ type: "log", text: "Express delivery" }], { status: "success" })
        .message
    ).toContain("Expected two lines");
    expect(
      validateM3L3Exercise(
        [
          { type: "log", text: "Express delivery" },
          { type: "log", text: "Member price" },
          { type: "log", text: "extra" },
        ],
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(validateM3L3Exercise([], { status: "success" }).passed).toBe(false);
  });

  it("reports syntax errors and timeouts with beginner-friendly guidance", () => {
    expect(
      validateM3L3Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("ternary conditional expression");
    expect(validateM3L3Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
