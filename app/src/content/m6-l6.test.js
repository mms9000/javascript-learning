import { describe, expect, it } from "vitest";
import { lessonM6L6, validateM6L6Exercise } from "./m6-l6.js";

describe("Module 6, Lesson 6", () => {
  it("defines the canonical synchronous Worker exercise", () => {
    expect(lessonM6L6.lessonId).toBe("m6-l6");
    expect(lessonM6L6.title).toBe("Error Handling with try and catch");
    expect(lessonM6L6.estimatedMinutes).toBe(20);
    expect(lessonM6L6.prerequisites).toEqual(["m6-l5"]);
    expect(lessonM6L6.objectives).toHaveLength(3);
    expect(lessonM6L6.exercise.executionMode).toBe("worker");
    expect(lessonM6L6.exercise.expectedOutput).toBe("Handled: Name is required");
  });

  it("teaches throw, catch, error.message, and uncaught failures", () => {
    const text = lessonM6L6.sections.map(({ content }) => content).join(" ");
    expect(text).toContain("throw");
    expect(text).toContain("catch");
    expect(text).toContain("message");
    expect(text).toContain("uncaught runtime error");
    expect(text).toContain("does not introduce asynchronous");
  });

  it("accepts only the handled error output", () => {
    expect(validateM6L6Exercise(
      [{ type: "log", text: "Handled: Name is required" }],
      { status: "success" }
    ).passed).toBe(true);
    expect(validateM6L6Exercise(
      [{ type: "log", text: "Name is required" }],
      { status: "success" }
    ).passed).toBe(false);
    expect(validateM6L6Exercise([], {
      status: "error",
      error: { name: "Error", message: "Name is required" },
    }).passed).toBe(false);
  });

  it("provides syntax and timeout feedback", () => {
    expect(validateM6L6Exercise([], {
      status: "error",
      error: { name: "SyntaxError", message: "Unexpected token" },
    }).message).toContain("Syntax Error");
    expect(validateM6L6Exercise([], { status: "terminated" }).message).toContain("timed out");
  });
});
