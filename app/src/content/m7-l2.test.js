import { describe, expect, it } from "vitest";
import { lessonM7L2, validateM7L2Exercise } from "./m7-l2.js";
import { getLessonContent } from "./index.js";

function entries(lines) {
  return lines.map((text) => ({ text }));
}

describe("Module 7, Lesson 2", () => {
  it("registers the canonical callback lesson in async Worker mode", () => {
    expect(lessonM7L2).toMatchObject({
      lessonId: "m7-l2",
      title: "Callbacks and Asynchronous Operations",
      estimatedMinutes: 20,
      prerequisites: ["m7-l1"],
    });
    expect(lessonM7L2.exercise.executionMode).toBe("async-worker");
    expect(getLessonContent("m7-l2")).toBe(lessonM7L2);
  });

  it("validates ordered callback output only after successful async completion", () => {
    expect(validateM7L2Exercise(entries(["start", "scheduled", "callback"]), {
      status: "success",
    }).passed).toBe(true);
    expect(validateM7L2Exercise(entries(["start", "callback", "scheduled"]), {
      status: "success",
    })).toMatchObject({ passed: false, status: "mismatch" });
    expect(validateM7L2Exercise(entries(["start", "scheduled", "callback"]), {
      status: "terminated",
    })).toMatchObject({ passed: false, status: "error" });
  });
});
