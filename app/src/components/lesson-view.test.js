/**
 * components/lesson-view.test.js — Unit tests for Lesson View component.
 *
 * Verifies compliance with FR-002, curriculum-spec.md, and constitution.md:
 * - Lesson title and metadata rendering
 * - Learning objectives display
 * - Articulation of the distinction between JavaScript, Browser, and JS Engine
 * - Heading hierarchy (h2 for lesson title, h3 for sections)
 * - Summary box rendering
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createLessonView } from "./lesson-view.js";
import { lessonM1L1 } from "../content/m1-l1.js";
import { lessonM1L2 } from "../content/m1-l2.js";

describe("createLessonView()", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("throws when container is missing", () => {
    expect(() => createLessonView(null)).toThrow("createLessonView: container element is required");
  });

  it("renders lesson title, module badge, and duration", () => {
    const view = createLessonView(container, lessonM1L1);

    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title).not.toBeNull();
    expect(title.tagName.toLowerCase()).toBe("h2");
    expect(title.textContent).toBe("What JavaScript Is and Where It Runs");

    const badge = container.querySelector(".lesson-module-badge");
    expect(badge.textContent).toBe("Module 1: Getting Started");

    const duration = container.querySelector(".lesson-duration-badge");
    expect(duration.textContent).toContain("15 min");

    view.destroy();
  });

  it("renders learning objectives with accessible heading", () => {
    const view = createLessonView(container, lessonM1L1);

    const objHeading = container.querySelector("#objectives-heading");
    expect(objHeading).not.toBeNull();
    expect(objHeading.textContent).toBe("Learning Objectives");

    const items = container.querySelectorAll(".objective-item");
    expect(items.length).toBeGreaterThanOrEqual(3);
    expect(container.textContent).toContain("JavaScript engine");

    view.destroy();
  });

  it("clearly articulates the distinction between JavaScript, Browser, and JS Engine", () => {
    const view = createLessonView(container, lessonM1L1);

    const distinctionSection = container.querySelector("#the-three-pieces");
    expect(distinctionSection).not.toBeNull();
    expect(distinctionSection.textContent).toContain("JavaScript (The Language)");
    expect(distinctionSection.textContent).toContain("The Browser (The Host)");
    expect(distinctionSection.textContent).toContain("The JavaScript Engine (The Translator)");

    view.destroy();
  });

  it("places the M1-L1 scene after its concept cards and does not add one to other lessons", () => {
    const view = createLessonView(container, lessonM1L1);
    const section = container.querySelector("#the-three-pieces");
    const scene = section.querySelector('[data-testid="lesson-animation"]');

    expect(scene).not.toBeNull();
    expect(section.querySelector(".section-body").nextElementSibling).toBe(scene);

    view.setLesson({ ...lessonM1L1, lessonId: "unregistered-lesson" });
    expect(container.querySelector('[data-testid="lesson-animation"]')).toBeNull();
    view.destroy();
  });

  it("places the M1-L2 sequence scene after the sequential-execution explanation", () => {
    const view = createLessonView(container, lessonM1L2);
    const section = container.querySelector("#sequential-execution");
    const scene = section.querySelector('[data-testid="lesson-animation"]');

    expect(scene).not.toBeNull();
    expect(section.querySelector(".section-body").nextElementSibling).toBe(scene);
    expect(scene.querySelectorAll("[data-animation-code-line]")).toHaveLength(2);
    expect(scene.querySelector('[data-animation-group="browser"]')).toBeNull();
    view.destroy();
  });

  it("disposes scene playback when changing lessons and creates one fresh scene on return", async () => {
    vi.useFakeTimers();
    const view = createLessonView(container, lessonM1L1);
    const oldScene = container.querySelector('[data-testid="lesson-animation"]');
    const oldCaption = oldScene.querySelector('[data-testid="lesson-animation-step-caption"]');
    oldScene.querySelector('[aria-label="Play animation"]').click();

    await vi.advanceTimersByTimeAsync(1800);
    expect(oldCaption.textContent).toContain("browser contains a JavaScript engine");

    view.setLesson({ ...lessonM1L1, lessonId: "unregistered-lesson" });
    const disposedCaption = oldCaption.textContent;
    await vi.advanceTimersByTimeAsync(10000);
    expect(oldCaption.textContent).toBe(disposedCaption);

    view.setLesson(lessonM1L1);
    expect(container.querySelectorAll('[data-testid="lesson-animation"]')).toHaveLength(1);
    expect(
      container.querySelector('[data-testid="lesson-animation-step-caption"]').textContent,
    ).toContain("JavaScript is the language");
    view.destroy();
    vi.useRealTimers();
  });

  it("disposes M1-L2 playback on navigation and restores its initial state on return", async () => {
    vi.useFakeTimers();
    const view = createLessonView(container, lessonM1L2);
    const scene = container.querySelector('[data-testid="lesson-animation"]');
    const caption = scene.querySelector('[data-testid="lesson-animation-step-caption"]');
    scene.querySelector('[aria-label="Play animation"]').click();

    await vi.advanceTimersByTimeAsync(1800);
    expect(caption.textContent).toContain("first statement runs first");

    view.setLesson(lessonM1L1);
    const disposedCaption = caption.textContent;
    await vi.advanceTimersByTimeAsync(10000);
    expect(caption.textContent).toBe(disposedCaption);

    view.setLesson(lessonM1L2);
    expect(container.querySelectorAll('[data-testid="lesson-animation"]')).toHaveLength(1);
    expect(
      container.querySelector('[data-testid="lesson-animation-step-caption"]').textContent,
    ).toContain("Both statements are shown");
    view.destroy();
    vi.useRealTimers();
  });

  it("renders key takeaways summary box", () => {
    const view = createLessonView(container, lessonM1L1);

    const summarySection = container.querySelector(".lesson-summary-box");
    expect(summarySection).not.toBeNull();
    expect(summarySection.textContent).toContain("Key Takeaways");
    expect(summarySection.textContent).toContain("console.log()");

    view.destroy();
  });

  it("handles null lesson content with placeholder", () => {
    const view = createLessonView(container, null);
    expect(container.textContent).toContain("Select a Lesson");
    view.destroy();
  });

  it("renders next lesson footer when nextLessonMeta is provided and triggers onNextLesson", () => {
    let selectedLesson = null;
    const nextMeta = { lessonId: "m1-l2", title: "Your First Program and console.log()" };

    const view = createLessonView(container, lessonM1L1, {
      nextLessonMeta: nextMeta,
      onNextLesson: (id) => {
        selectedLesson = id;
      },
    });

    const footer = container.querySelector('[data-testid="lesson-footer"]');
    expect(footer).not.toBeNull();

    const nextBtn = container.querySelector('[data-testid="next-lesson-btn"]');
    expect(nextBtn).not.toBeNull();
    expect(nextBtn.textContent).toContain("Your First Program and console.log()");

    nextBtn.click();
    expect(selectedLesson).toBe("m1-l2");

    view.destroy();
  });

  it("updates next lesson footer dynamically via setLesson()", () => {
    let nextCalled = false;
    const view = createLessonView(container, lessonM1L1);
    expect(container.querySelector('[data-testid="lesson-footer"]')).toBeNull();

    view.setLesson(lessonM1L1, {
      nextLessonMeta: { lessonId: "m1-l2", title: "Next Lesson Title" },
      onNextLesson: () => {
        nextCalled = true;
      },
    });

    const nextBtn = container.querySelector('[data-testid="next-lesson-btn"]');
    expect(nextBtn).not.toBeNull();
    nextBtn.click();
    expect(nextCalled).toBe(true);

    view.destroy();
  });
});
