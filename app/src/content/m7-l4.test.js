import { describe, expect, it } from "vitest";
import { lessonM7L4, validateM7L4Exercise } from "./m7-l4.js";
import { getLessonContent } from "./index.js";

const output = (values) => values.map((text) => ({ text }));

describe("Module 7, Lesson 4", () => {
  it("defines the canonical async/await lesson", () => {
    expect(lessonM7L4).toMatchObject({
      lessonId: "m7-l4",
      title: "async and await",
      estimatedMinutes: 25,
      prerequisites: ["m7-l3"],
    });
    expect(lessonM7L4.exercise.executionMode).toBe("async-worker");
    expect(getLessonContent("m7-l4")).toBe(lessonM7L4);
  });

  it("requires ordered output from the settled async root", () => {
    expect(validateM7L4Exercise(output(["start", "ready"]), { status: "success" }).passed).toBe(true);
    expect(validateM7L4Exercise(output(["ready", "start"]), { status: "success" }).passed).toBe(false);
    expect(validateM7L4Exercise(output(["start", "ready"]), {
      status: "terminated",
      error: { name: "TimeoutError", message: "pending" },
    }).passed).toBe(false);
  });
});
