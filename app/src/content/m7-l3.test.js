import { describe, expect, it } from "vitest";
import { lessonM7L3, validateM7L3Exercise } from "./m7-l3.js";
import { getLessonContent } from "./index.js";

const output = (values) => values.map((text) => ({ text }));

describe("Module 7, Lesson 3", () => {
  it("defines the canonical Promise lesson and execution mode", () => {
    expect(lessonM7L3).toMatchObject({
      lessonId: "m7-l3",
      title: "Promises and Promise Chaining",
      estimatedMinutes: 25,
      prerequisites: ["m7-l2"],
    });
    expect(lessonM7L3.exercise.executionMode).toBe("async-worker");
    expect(lessonM7L3.objectives).toHaveLength(4);
    expect(getLessonContent("m7-l3")).toBe(lessonM7L3);
  });

  it("requires the expected chain output and successful settlement", () => {
    expect(validateM7L3Exercise(output(["3", "4", "cleanup"]), { status: "success" }).passed).toBe(true);
    expect(validateM7L3Exercise(output(["3", "2", "cleanup"]), { status: "success" }).passed).toBe(false);
    expect(validateM7L3Exercise(output(["3", "4", "cleanup"]), {
      status: "error",
      error: { name: "UnhandledRejectionError", message: "rejected" },
    }).passed).toBe(false);
  });
});
