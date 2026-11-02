import { describe, expect, it } from "vitest";
import { lessonM6L2, validateM6L2Exercise } from "./m6-l2.js";

function snapshot({ statusText = "JavaScript updated", itemText = "Practice DOM", itemCount = 2 } = {}) {
  return {
    roots: [
      { tag: "h2", attributes: { id: "status" }, text: statusText, children: [] },
      {
        tag: "ul",
        attributes: { id: "items" },
        text: "",
        children: [
          { tag: "li", attributes: {}, text: "Read guide", children: [] },
          ...Array.from({ length: itemCount - 1 }, (_, index) => ({
            tag: "li",
            attributes: {},
            text: index === itemCount - 2 ? itemText : "Other",
            children: [],
          })),
        ],
      },
    ],
  };
}

describe("Module 6, Lesson 2", () => {
  it("defines the canonical lesson and controlled DOM exercise", () => {
    expect(lessonM6L2.lessonId).toBe("m6-l2");
    expect(lessonM6L2.title).toBe("DOM Selection and Manipulation");
    expect(lessonM6L2.estimatedMinutes).toBe(25);
    expect(lessonM6L2.prerequisites).toEqual(["m6-l1"]);
    expect(lessonM6L2.objectives).toHaveLength(3);
    expect(lessonM6L2.exercise.id).toBe("m6-l2-ex1");
    expect(lessonM6L2.exercise.executionMode).toBe("dom");
    expect(lessonM6L2.exercise.fixtureId).toBe("m6-l2");
    expect(lessonM6L2.exercise.hints).toHaveLength(2);
  });

  it("explains selection, text updates, creation, and the simulation boundary", () => {
    const content = lessonM6L2.sections.map(({ content }) => content).join(" ");
    expect(content).toContain("querySelector");
    expect(content).toContain("textContent");
    expect(content).toContain("createElement");
    expect(content).toContain("bounded Worker-backed DOM");
  });

  it("requires the expected logs and the appended preview item", () => {
    const entries = ["JavaScript updated", "2"].map((text) => ({ type: "log", text }));
    expect(validateM6L2Exercise(entries, {
      status: "success",
      snapshot: snapshot(),
    }).passed).toBe(true);
    expect(validateM6L2Exercise(entries, {
      status: "success",
      snapshot: snapshot({ itemText: "Wrong text" }),
    }).passed).toBe(false);
    expect(validateM6L2Exercise(entries, {
      status: "success",
      snapshot: snapshot({ itemCount: 1 }),
    }).passed).toBe(false);
  });

  it("provides useful feedback for incomplete and failed attempts", () => {
    expect(validateM6L2Exercise([], {
      status: "success",
      snapshot: snapshot({ statusText: "Ready", itemCount: 1 }),
    }).message).toContain("append");
    expect(validateM6L2Exercise([], {
      status: "error",
      error: { name: "TypeError", message: "unsupported" },
    }).message).toContain("Type Error");
    expect(validateM6L2Exercise([], { status: "terminated" }).message).toContain("timed out");
  });
});
