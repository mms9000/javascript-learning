import { describe, expect, it } from "vitest";
import { lessonM6L3, validateM6L3Exercise } from "./m6-l3.js";

const expected = [
  "Clicked: Add one",
  "Count: 1",
  "Clicked: Add one",
  "Count: 2",
].map((text) => ({ type: "log", text }));

function snapshot(countText) {
  return {
    roots: [
      { tag: "button", attributes: { id: "increment" }, text: "Add one", children: [] },
      {
        tag: "p",
        attributes: {},
        text: "Count: ",
        children: [{ tag: "output", attributes: { id: "count" }, text: countText, children: [] }],
      },
    ],
  };
}

describe("Module 6, Lesson 3", () => {
  it("defines the canonical event lesson and DOM exercise", () => {
    expect(lessonM6L3.lessonId).toBe("m6-l3");
    expect(lessonM6L3.title).toBe("Event Listeners and Event Objects");
    expect(lessonM6L3.estimatedMinutes).toBe(25);
    expect(lessonM6L3.prerequisites).toEqual(["m6-l2"]);
    expect(lessonM6L3.objectives).toHaveLength(3);
    expect(lessonM6L3.exercise.executionMode).toBe("dom");
    expect(lessonM6L3.exercise.fixtureId).toBe("m6-l3");
  });

  it("teaches registration, callback timing, event.target, and count updates", () => {
    const text = lessonM6L3.sections.map(({ content }) => content).join(" ");
    expect(text).toContain("does not call it immediately");
    expect(text).toContain("event object");
    expect(text).toContain("target");
  });

  it("requires two user clicks, exact event output, and a final count of 2", () => {
    expect(validateM6L3Exercise(expected, {
      status: "success",
      snapshot: snapshot("2"),
      interactions: [
        { type: "click", nodeId: "button" },
        { type: "click", nodeId: "button" },
      ],
    }).passed).toBe(true);
    expect(validateM6L3Exercise(expected.slice(0, 2), {
      status: "success",
      snapshot: snapshot("1"),
      interactions: [{ type: "click", nodeId: "button" }],
    }).passed).toBe(false);
    expect(validateM6L3Exercise(expected, {
      status: "success",
      snapshot: snapshot("1"),
      interactions: [
        { type: "click", nodeId: "button" },
        { type: "click", nodeId: "button" },
      ],
    }).passed).toBe(false);
  });

  it("provides syntax and timeout guidance", () => {
    expect(validateM6L3Exercise([], {
      status: "error",
      error: { name: "SyntaxError", message: "Unexpected token" },
    }).message).toContain("Syntax Error");
    expect(validateM6L3Exercise([], { status: "terminated" }).message).toContain("timed out");
  });
});
