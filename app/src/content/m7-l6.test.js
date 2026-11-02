import { describe, expect, it } from "vitest";
import { lessonM7L6, validateM7L6Exercise } from "./m7-l6.js";
import { ASYNC_API_ENDPOINTS } from "../async-fetch.js";
import { getLessonContent } from "./index.js";

const output = ["Task: delectus aut autem", "Status: open"].map((text) => ({ text }));

describe("Module 7, Lesson 6", () => {
  it("documents the verified public endpoint and canonical API lesson", () => {
    expect(lessonM7L6).toMatchObject({
      lessonId: "m7-l6",
      title: "Fetching Data from an HTTP API",
      estimatedMinutes: 30,
      prerequisites: ["m7-l5"],
    });
    expect(lessonM7L6.sections.map(({ content }) => content).join(" ")).toContain(ASYNC_API_ENDPOINTS.todo);
    expect(lessonM7L6.exercise.executionMode).toBe("async-worker");
    expect(getLessonContent("m7-l6")).toBe(lessonM7L6);
  });

  it("requires the actual task fields and successful completion", () => {
    expect(validateM7L6Exercise(output, { status: "success" }).passed).toBe(true);
    expect(validateM7L6Exercise([{ text: "Task: another task" }, { text: "Status: open" }], {
      status: "success",
    }).passed).toBe(false);
    expect(validateM7L6Exercise([], {
      status: "error",
      error: { name: "TypeError", message: "Network unavailable" },
    }).passed).toBe(false);
  });
});
