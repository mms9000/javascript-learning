import { describe, expect, it } from "vitest";
import { lessonM7L7, validateM7L7Exercise } from "./m7-l7.js";
import { getLessonContent } from "./index.js";

const expected = [
  "Loading task...",
  "Could not load task: HTTP 404",
  "Retrying task...",
  "Loaded: delectus aut autem",
].map((text) => ({ text }));

describe("Module 7, Lesson 7", () => {
  it("defines the canonical loading/retry milestone lesson", () => {
    expect(lessonM7L7).toMatchObject({
      lessonId: "m7-l7",
      title: "Loading States and Failed Requests",
      estimatedMinutes: 20,
      prerequisites: ["m7-l6"],
    });
    expect(lessonM7L7.exercise.executionMode).toBe("async-worker");
    expect(lessonM7L7.objectives).toHaveLength(3);
    expect(getLessonContent("m7-l7")).toBe(lessonM7L7);
  });

  it("validates the ordered loading, HTTP-error, retry, and external-data states", () => {
    expect(validateM7L7Exercise(expected, { status: "success" }).passed).toBe(true);
    expect(validateM7L7Exercise(expected.slice(0, 3), { status: "success" }).passed).toBe(false);
    expect(validateM7L7Exercise([], {
      status: "error",
      error: { name: "TimeoutError", message: "request timed out" },
    })).toMatchObject({ passed: false, status: "error" });
  });
});
