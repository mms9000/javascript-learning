import { describe, expect, it } from "vitest";
import { lessonM7L1 } from "./m7-l1.js";
import { getLessonContent } from "./index.js";

describe("Module 7, Lesson 1", () => {
  it("defines the canonical lesson and event-loop objectives", () => {
    expect(lessonM7L1).toMatchObject({
      lessonId: "m7-l1",
      title: "Synchronous Execution and the Event Loop",
      estimatedMinutes: 25,
      prerequisites: ["m6-l7"],
    });
    expect(lessonM7L1.objectives).toHaveLength(3);
    expect(lessonM7L1.exercise.executionMode).toBe("knowledge-check");
    expect(getLessonContent("m7-l1")).toBe(lessonM7L1);
  });

  it("provides an accessible no-execution assessment with progressive hints", () => {
    expect(lessonM7L1.exercise.questions).toHaveLength(3);
    expect(lessonM7L1.exercise.hints).toHaveLength(2);
    expect(lessonM7L1.exercise.starterCode).toBe("");
  });
});
