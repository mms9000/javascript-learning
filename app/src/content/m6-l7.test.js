import { describe, expect, it, vi } from "vitest";
import { lessonM6L7 } from "./m6-l7.js";
import { createKnowledgeCheck } from "../components/knowledge-check.js";

describe("Module 6, Lesson 7", () => {
  it("defines the canonical final lesson as a no-execution assessment", () => {
    expect(lessonM6L7.lessonId).toBe("m6-l7");
    expect(lessonM6L7.title).toBe("Browser Debugging Tools");
    expect(lessonM6L7.estimatedMinutes).toBe(20);
    expect(lessonM6L7.prerequisites).toEqual(["m6-l6"]);
    expect(lessonM6L7.objectives).toHaveLength(3);
    expect(lessonM6L7.exercise.executionMode).toBe("knowledge-check");
    expect(lessonM6L7.exercise.questions).toHaveLength(3);
  });

  it("teaches DevTools concepts without claiming integrated debugging", () => {
    const text = lessonM6L7.sections.map(({ content }) => content).join(" ");
    expect(text).toContain("Sources");
    expect(text).toContain("Watch");
    expect(text).toContain("logic error");
    expect(text).toContain("integrated browser debugger");
  });

  it("requires the loop diagnosis, useful breakpoint, and logic-error classification", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const onResult = vi.fn();
    const check = createKnowledgeCheck(container, lessonM6L7.exercise, { onResult });
    const correctIds = ["inclusive-bound", "watch-index", "logic-error"];
    for (const id of correctIds) {
      const radio = container.querySelector(`input[value="${id}"]`);
      radio.checked = true;
      radio.dispatchEvent(new Event("change", { bubbles: true }));
    }
    container.querySelector("form").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({ passed: true }),
      correctIds
    );
    check.destroy();
    container.remove();
  });
});
