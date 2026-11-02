import { describe, expect, it } from "vitest";
import { lessonM7L5, validateM7L5Exercise } from "./m7-l5.js";
import { getLessonContent } from "./index.js";

describe("Module 7, Lesson 5", () => {
  it("defines the canonical asynchronous error lesson", () => {
    expect(lessonM7L5).toMatchObject({
      lessonId: "m7-l5",
      title: "Error Handling in Asynchronous Code",
      estimatedMinutes: 20,
      prerequisites: ["m7-l4"],
    });
    expect(lessonM7L5.exercise.executionMode).toBe("async-worker");
    expect(getLessonContent("m7-l5")).toBe(lessonM7L5);
  });

  it("passes handled rejection output and fails rejected execution", () => {
    expect(validateM7L5Exercise([{ text: "Handled: offline" }], {
      status: "success",
    }).passed).toBe(true);
    expect(validateM7L5Exercise([{ text: "Handled: offline" }], {
      status: "error",
      error: { name: "UnhandledRejectionError", message: "offline" },
    })).toMatchObject({ passed: false, status: "error" });
    expect(validateM7L5Exercise([{ text: "offline" }], {
      status: "success",
    })).toMatchObject({ passed: false, status: "mismatch" });
  });
});
