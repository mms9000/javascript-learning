import { describe, expect, it, vi } from "vitest";
import { lessonM6L5 } from "./m6-l5.js";
import { createKnowledgeCheck } from "../components/knowledge-check.js";

describe("Module 6, Lesson 5", () => {
  it("defines the canonical no-execution module assessment", () => {
    expect(lessonM6L5.lessonId).toBe("m6-l5");
    expect(lessonM6L5.title).toBe("Modules and Imports/Exports");
    expect(lessonM6L5.estimatedMinutes).toBe(20);
    expect(lessonM6L5.prerequisites).toEqual(["m6-l4"]);
    expect(lessonM6L5.objectives).toHaveLength(3);
    expect(lessonM6L5.exercise.executionMode).toBe("knowledge-check");
    expect(lessonM6L5.exercise.questions).toHaveLength(2);
  });

  it("explains named exports, import paths, prediction, and the execution limit", () => {
    const text = lessonM6L5.sections.map(({ content }) => content).join(" ");
    expect(text).toContain("named export");
    expect(text).toContain("./helpers.js");
    expect(text).toContain("does not execute static");
    expect(text).toContain("does not claim");
  });

  it("provides accessible retry feedback and reports success only for both correct answers", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const onResult = vi.fn();
    const check = createKnowledgeCheck(container, lessonM6L5.exercise, { onResult });
    const radios = container.querySelectorAll('input[type="radio"]');
    radios[1].checked = true;
    radios[1].dispatchEvent(new Event("change", { bubbles: true }));
    radios[2].checked = true;
    radios[2].dispatchEvent(new Event("change", { bubbles: true }));
    container.querySelector("form").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    expect(container.querySelector('[role="status"]').textContent).toContain("Not quite");

    radios[0].checked = true;
    radios[0].dispatchEvent(new Event("change", { bubbles: true }));
    container.querySelector("form").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({ passed: true }),
      ["named-import", "eight"]
    );
    check.destroy();
    container.remove();
  });
});
