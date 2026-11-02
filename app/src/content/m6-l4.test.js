import { describe, expect, it } from "vitest";
import { lessonM6L4, validateM6L4Exercise } from "./m6-l4.js";

function completedSnapshot() {
  return {
    roots: [
      { tag: "form", attributes: { id: "task-form" }, text: "", children: [] },
      { tag: "p", attributes: { id: "task-status" }, text: "Added: Review DOM.", children: [] },
      { tag: "p", attributes: { id: "task-count" }, text: "1 of 3 completed", children: [] },
      {
        tag: "ul",
        attributes: { id: "task-list" },
        text: "",
        children: [
          { tag: "li", attributes: {}, text: "Read guide", children: [
            { tag: "input", attributes: { type: "checkbox" }, text: "", checked: false, children: [] },
          ] },
          { tag: "li", attributes: {}, text: "Practice events", children: [
            { tag: "input", attributes: { type: "checkbox" }, text: "", checked: false, children: [] },
          ] },
          { tag: "li", attributes: {}, text: "", children: [
            { tag: "label", attributes: {}, text: "Review DOM ", children: [
              { tag: "input", attributes: { type: "checkbox" }, text: "", checked: true, children: [] },
            ] },
          ] },
        ],
      },
      { tag: "input", attributes: { id: "task-input" }, value: "", children: [] },
    ],
  };
}

function successfulInteractions() {
  return [
    { type: "submit", formValues: { "task-input": "  " } },
    { type: "submit", formValues: { "task-input": "Review DOM" } },
    { type: "change", checked: true },
  ];
}

describe("Module 6, Lesson 4", () => {
  it("defines the canonical DOM milestone metadata", () => {
    expect(lessonM6L4.lessonId).toBe("m6-l4");
    expect(lessonM6L4.title).toBe("Form Input and Validation");
    expect(lessonM6L4.estimatedMinutes).toBe(25);
    expect(lessonM6L4.prerequisites).toEqual(["m6-l3"]);
    expect(lessonM6L4.objectives).toHaveLength(3);
    expect(lessonM6L4.exercise.id).toBe("m6-l4-ex1");
    expect(lessonM6L4.exercise.executionMode).toBe("dom");
    expect(lessonM6L4.exercise.fixtureId).toBe("m6-l4");
  });

  it("teaches labels, validation, feedback, and the controlled milestone", () => {
    const text = lessonM6L4.sections.map(({ content }) => content).join(" ");
    expect(text).toContain("placeholder is not a replacement for a label");
    expect(text).toContain("preventDefault");
    expect(text).toContain("Module 6 DOM milestone");
  });

  it("requires blank-input feedback, one valid task, and a checkbox count update", () => {
    expect(validateM6L4Exercise([], {
      status: "success",
      snapshot: completedSnapshot(),
      interactions: successfulInteractions(),
    }).passed).toBe(true);
    expect(validateM6L4Exercise([], {
      status: "success",
      snapshot: completedSnapshot(),
      interactions: successfulInteractions().slice(1),
    }).passed).toBe(false);
    expect(validateM6L4Exercise([], {
      status: "success",
      snapshot: completedSnapshot(),
      interactions: successfulInteractions().slice(0, 2),
    }).passed).toBe(false);
  });

  it("distinguishes syntax failures and timeouts", () => {
    expect(validateM6L4Exercise([], {
      status: "error",
      error: { name: "SyntaxError", message: "Unexpected token" },
    }).message).toContain("Syntax Error");
    expect(validateM6L4Exercise([], { status: "terminated" }).message).toContain("timed out");
  });
});
