import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createKnowledgeCheck } from "./knowledge-check.js";

const exercise = {
  id: "m6-l5-ex1",
  title: "Match a Named Export",
  questions: [
    {
      prompt: "Which import matches the named export?",
      correctOptionId: "named-import",
      options: [
        { id: "named-import", label: 'import { double } from "./helpers.js";' },
        { id: "default-import", label: 'import double from "./helpers.js";' },
      ],
    },
    {
      prompt: "What does double(4) return?",
      correctOptionId: "eight",
      options: [
        { id: "eight", label: "8" },
        { id: "four", label: "4" },
      ],
    },
  ],
};

describe("createKnowledgeCheck()", () => {
  let container;
  let check;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    check?.destroy();
    check = null;
    container.remove();
  });

  it("renders labeled, keyboard-operable radio choices and requires every answer", () => {
    check = createKnowledgeCheck(container, exercise);
    const form = container.querySelector('[data-testid="knowledge-check-form"]');
    const submit = container.querySelector('[data-testid="knowledge-check-submit"]');

    expect(form.getAttribute("aria-label")).toBe("Match a Named Export answers");
    expect(container.querySelectorAll("fieldset")).toHaveLength(2);
    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(4);
    expect(submit.disabled).toBe(true);

    const options = container.querySelectorAll('input[type="radio"]');
    options[0].checked = true;
    options[0].dispatchEvent(new Event("change", { bubbles: true }));
    expect(submit.disabled).toBe(true);

    options[2].checked = true;
    options[2].dispatchEvent(new Event("change", { bubbles: true }));
    expect(submit.disabled).toBe(false);
  });

  it("supports incorrect feedback and retry without running learner code", () => {
    const onResult = vi.fn();
    check = createKnowledgeCheck(container, exercise, { onResult });
    const radios = container.querySelectorAll('input[type="radio"]');
    radios[1].checked = true;
    radios[1].dispatchEvent(new Event("change", { bubbles: true }));
    radios[2].checked = true;
    radios[2].dispatchEvent(new Event("change", { bubbles: true }));
    container.querySelector('[data-testid="knowledge-check-form"]')
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(container.querySelector('[data-testid="knowledge-check-feedback"]').textContent)
      .toContain("Not quite");
    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({ passed: false }),
      ["default-import", "eight"]
    );

    radios[0].checked = true;
    radios[0].dispatchEvent(new Event("change", { bubbles: true }));
    container.querySelector('[data-testid="knowledge-check-form"]')
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(container.querySelector('[data-testid="knowledge-check-feedback"]').textContent)
      .toContain("Correct");
    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({ passed: true }),
      ["named-import", "eight"]
    );
  });

  it("calls success only once for repeated correct submissions and resets answers", () => {
    const onResult = vi.fn();
    check = createKnowledgeCheck(container, exercise, { onResult });
    const radios = container.querySelectorAll('input[type="radio"]');
    radios[0].checked = true;
    radios[0].dispatchEvent(new Event("change", { bubbles: true }));
    radios[2].checked = true;
    radios[2].dispatchEvent(new Event("change", { bubbles: true }));
    const form = container.querySelector('[data-testid="knowledge-check-form"]');
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(onResult).toHaveBeenCalledTimes(1);
    check.reset();
    expect(form.querySelectorAll("input:checked")).toHaveLength(0);
    expect(container.querySelector('[data-testid="knowledge-check-submit"]').disabled).toBe(true);
  });
});
