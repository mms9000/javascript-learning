/**
 * app.test.js — Integration tests for Application Shell and layout.
 *
 * Verifies that the application mounts the full Phase 2 lesson interface:
 * - Shell and header with skip link and progress indicator
 * - Curriculum navigation sidebar
 * - Lesson view displaying Module 1, Lesson 1
 * - CodeMirror playground integration
 * - Lesson switching
 * - Reset progress control
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createApp } from "./app.js";
import { markLessonComplete, resetProgress, isLessonComplete } from "./progress.js";
import { getCurriculum } from "./curriculum.js";

describe("createApp()", () => {
  let container;

  beforeEach(() => {
    resetProgress();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("mounts the application shell into the container", () => {
    const app = createApp(container);
    const shell = container.querySelector("[data-testid='app-shell']");
    expect(shell).not.toBeNull();
    app.destroy();
  });

  it("renders the main content area with accessible skip link", () => {
    const app = createApp(container);
    const main = container.querySelector("[data-testid='app-main']");
    expect(main).not.toBeNull();
    expect(main.getAttribute("id")).toBe("main-content");

    const skipLink = container.querySelector(".skip-link");
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute("href")).toBe("#main-content");
    app.destroy();
  });

  it("renders a visible heading", () => {
    const app = createApp(container);
    const heading = container.querySelector("h1");
    expect(heading).not.toBeNull();
    expect(heading.textContent).toContain("Learn JavaScript");
    app.destroy();
  });

  it("returns an object with container and component handles", () => {
    const app = createApp(container);
    expect(app).toHaveProperty("container");
    expect(app).toHaveProperty("navigation");
    expect(app).toHaveProperty("lessonView");
    expect(app).toHaveProperty("playground");
    expect(app.container).toBe(container);
    app.destroy();
  });

  it("throws when no container is provided", () => {
    expect(() => createApp(null)).toThrow("createApp: container element not found");
  });

  it("throws when an undefined container is provided", () => {
    expect(() => createApp(undefined)).toThrow("createApp: container element not found");
  });

  it("renders Module 1 Lesson 1 by default", () => {
    const app = createApp(container);
    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe("What JavaScript Is and Where It Runs");
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("0/64");

    const editorValue = app.playground.getEditor().getValue();
    expect(editorValue).toContain("Hello, world!");
    app.destroy();
  });

  it("switches lesson when loadLesson() is called", () => {
    const app = createApp(container);
    app.loadLesson("m1-l2");

    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title.textContent).toContain("Your First Program");
    app.destroy();
  });

  it("resets progress when Reset Progress button is clicked", () => {
    markLessonComplete("m1-l1");
    const app = createApp(container);

    const progressCount = container.querySelector('[data-testid="progress-count"]');
    expect(progressCount.textContent).toBe("1/64");

    const resetBtn = container.querySelector('[data-testid="reset-progress-btn"]');
    resetBtn.click();

    expect(progressCount.textContent).toBe("0/64");
    app.destroy();
  });

  it("Phase 4 integration: completing exercise marks lesson complete and updates progress counter without inflating on repeats or resets", async () => {
    const app = createApp(container);

    const progressCount = container.querySelector('[data-testid="progress-count"]');
    expect(progressCount.textContent).toBe("0/64");
    expect(isLessonComplete("m1-l1")).toBe(false);

    // Verify exercise UI rendered
    const exercisePanel = container.querySelector('[data-testid="exercise-panel"]');
    expect(exercisePanel).not.toBeNull();
    const prompt = container.querySelector('[data-testid="exercise-prompt"]');
    expect(prompt.textContent).toContain("Hello, JavaScript!");

    // Enter correct code in playground
    app.playground.getEditor().setValue('console.log("Hello, JavaScript!");');

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l1")).toBe(true);
    });

    // Header counter updated
    expect(progressCount.textContent).toBe("1/64");

    // Celebration badge visible
    const celebration = container.querySelector('[data-testid="celebration-badge"]');
    expect(celebration).not.toBeNull();
    expect(celebration.textContent).toContain("Exercise Complete!");

    // Re-running correct code does not inflate progress (remains 1/)
    runBtn.click();
    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l1")).toBe(true);
    });
    expect(progressCount.textContent).toBe("1/64");

    // Resetting editor code does not remove earned completion
    const resetEditorBtn = container.querySelector('[data-testid="reset-btn"]');
    resetEditorBtn.click();
    expect(isLessonComplete("m1-l1")).toBe(true);
    expect(progressCount.textContent).toBe("1/64");

    app.destroy();
  });

  // ─── Phase 5: Lesson 2 Integration Tests ────────────────────────────────────

  it("Phase 5: loads Lesson 2 content, starter code, and exercise when navigating via sidebar", () => {
    const app = createApp(container);

    const navL2 = container.querySelector('[data-testid="nav-lesson-m1-l2"]');
    expect(navL2).not.toBeNull();
    navL2.click();

    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title.textContent).toBe("Your First Program and console.log()");

    const exercisePanel = container.querySelector('[data-testid="exercise-panel"]');
    expect(exercisePanel).not.toBeNull();

    const prompt = container.querySelector('[data-testid="exercise-prompt"]');
    expect(prompt.textContent).toContain("Player Score:");

    const editorValue = app.playground.getEditor().getValue();
    expect(editorValue).toContain("Player Score:");

    app.destroy();
  });

  it("Phase 5: renders next lesson button in lesson view footer when on Lesson 1", () => {
    const app = createApp(container);

    const footer = container.querySelector('[data-testid="lesson-footer"]');
    expect(footer).not.toBeNull();

    const nextBtn = container.querySelector('[data-testid="next-lesson-btn"]');
    expect(nextBtn).not.toBeNull();
    expect(nextBtn.textContent).toContain("Your First Program and console.log()");

    app.destroy();
  });

  it("Phase 5: next lesson footer button navigates to Lesson 2", () => {
    const app = createApp(container);

    const nextBtn = container.querySelector('[data-testid="next-lesson-btn"]');
    nextBtn.click();

    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title.textContent).toBe("Your First Program and console.log()");

    app.destroy();
  });

  it("Phase 5: completing Lesson 2 exercise marks m1-l2 complete and updates progress to 2/64", async () => {
    // Pre-complete Lesson 1
    markLessonComplete("m1-l1");

    const app = createApp(container);
    app.loadLesson("m1-l2");

    const progressCount = container.querySelector('[data-testid="progress-count"]');
    expect(progressCount.textContent).toBe("1/64");
    expect(isLessonComplete("m1-l2")).toBe(false);

    // Submit correct sequential output
    app.playground.getEditor().setValue(
      'console.log("Player Score:");\nconsole.log(100);\n'
    );

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l2")).toBe(true);
    });

    expect(progressCount.textContent).toBe("2/64");

    const celebration = container.querySelector('[data-testid="celebration-badge"]');
    expect(celebration).not.toBeNull();
    expect(celebration.textContent).toContain("Exercise Complete!");

    app.destroy();
  });

  it("Phase 5: resetting Lesson 2 editor preserves earned completion and does not inflate progress on repeated runs", async () => {
    const app = createApp(container);
    app.loadLesson("m1-l2");

    const progressCount = container.querySelector('[data-testid="progress-count"]');
    app.playground.getEditor().setValue(
      'console.log("Player Score:");\nconsole.log(100);\n'
    );

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l2")).toBe(true);
    });

    expect(progressCount.textContent).toBe("1/64");
    const completedCount = progressCount.textContent;

    // Reset editor — completion must survive
    const resetBtn = container.querySelector('[data-testid="reset-btn"]');
    resetBtn.click();
    expect(isLessonComplete("m1-l2")).toBe(true);
    expect(progressCount.textContent).toBe(completedCount);

    // Run correct code again — must not inflate counter
    runBtn.click();
    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l2")).toBe(true);
    });
    expect(progressCount.textContent).toBe(completedCount);

    app.destroy();
  });

  it("Phase 5: switching back to Lesson 1 after Lesson 2 shows Lesson 1 title and content", () => {
    const app = createApp(container);

    app.loadLesson("m1-l2");
    const titleAfterL2 = container.querySelector('[data-testid="lesson-title"]');
    expect(titleAfterL2.textContent).toBe("Your First Program and console.log()");

    app.loadLesson("m1-l1");
    const titleAfterL1 = container.querySelector('[data-testid="lesson-title"]');
    expect(titleAfterL1.textContent).toBe("What JavaScript Is and Where It Runs");

    const editorValue = app.playground.getEditor().getValue();
    expect(editorValue).toContain("Hello, world!");

    app.destroy();
  });

  it("Phase 5: switching lessons clears console output and exercise feedback from the prior lesson", async () => {
    const app = createApp(container);

    // Run Lesson 1's exercise
    app.playground.getEditor().setValue('console.log("Hello, JavaScript!");');
    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      const outputBody = container.querySelector('[data-testid="output-body"]');
      expect(outputBody.textContent).toContain("Hello, JavaScript!");
    });

    // Switch to Lesson 2
    app.loadLesson("m1-l2");

    const outputBody = container.querySelector('[data-testid="output-body"]');
    expect(outputBody.textContent).not.toContain("Hello, JavaScript!");

    const feedback = container.querySelector('[data-testid="exercise-feedback"]');
    expect(feedback.classList.contains("feedback-neutral")).toBe(true);

    app.destroy();
  });

  // ─── Phase 6: Lesson 3 Integration Tests ────────────────────────────────────

  it("Phase 6: loads Lesson 3 content, starter code, and exercise when navigating via sidebar", () => {
    const app = createApp(container);

    const navL3 = container.querySelector('[data-testid="nav-lesson-m1-l3"]');
    expect(navL3).not.toBeNull();
    navL3.click();

    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title.textContent).toBe("Reading Basic Syntax and Comments");

    const exercisePanel = container.querySelector('[data-testid="exercise-panel"]');
    expect(exercisePanel).not.toBeNull();

    const prompt = container.querySelector('[data-testid="exercise-prompt"]');
    expect(prompt.textContent).toContain("Fix the comment");

    const editorValue = app.playground.getEditor().getValue();
    expect(editorValue).toContain("This line is a note to the reader, not code.");

    app.destroy();
  });

  it("Phase 6: renders next lesson button in Lesson 2 footer linking to Lesson 3", () => {
    const app = createApp(container);
    app.loadLesson("m1-l2");

    const nextBtn = container.querySelector('[data-testid="next-lesson-btn"]');
    expect(nextBtn).not.toBeNull();
    expect(nextBtn.textContent).toContain("Reading Basic Syntax and Comments");

    nextBtn.click();
    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title.textContent).toBe("Reading Basic Syntax and Comments");

    app.destroy();
  });

  it("Phase 6: renders next lesson button in Lesson 3 footer linking to Lesson 4", () => {
    const app = createApp(container);
    app.loadLesson("m1-l3");

    const nextBtn = container.querySelector('[data-testid="next-lesson-btn"]');
    expect(nextBtn).not.toBeNull();
    expect(nextBtn.textContent).toContain("Understanding Common Syntax Errors");

    app.destroy();
  });

  it("Phase 6: running Lesson 3 starter code produces SyntaxError feedback with comment guidance", async () => {
    const app = createApp(container);
    app.loadLesson("m1-l3");

    // Click run without modifying starter code (broken comment with unexpected identifiers)
    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      const feedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(feedback.textContent).toContain("Syntax Error");
      expect(feedback.textContent).toContain("Check that the comment line starts with //");
    });

    expect(isLessonComplete("m1-l3")).toBe(false);

    app.destroy();
  });

  it("Phase 6: completing Lesson 3 exercise marks m1-l3 complete and updates progress to 3/64", async () => {
    markLessonComplete("m1-l1");
    markLessonComplete("m1-l2");

    const app = createApp(container);
    app.loadLesson("m1-l3");

    const progressCount = container.querySelector('[data-testid="progress-count"]');
    expect(progressCount.textContent).toBe("2/64");
    expect(isLessonComplete("m1-l3")).toBe(false);

    // Fix the comment by prefixing with //
    app.playground.getEditor().setValue(
      '// This line is a note to the reader, not code.\nconsole.log("Hello from JavaScript!");\n'
    );

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l3")).toBe(true);
    });

    expect(progressCount.textContent).toBe("3/64");

    const celebration = container.querySelector('[data-testid="celebration-badge"]');
    expect(celebration).not.toBeNull();
    expect(celebration.textContent).toContain("Exercise Complete!");

    app.destroy();
  });

  it("Phase 6: resetting Lesson 3 editor preserves earned progress and repeated runs do not inflate counter", async () => {
    const app = createApp(container);
    app.loadLesson("m1-l3");

    const progressCount = container.querySelector('[data-testid="progress-count"]');
    app.playground.getEditor().setValue(
      '// This line is a note to the reader, not code.\nconsole.log("Hello from JavaScript!");\n'
    );

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l3")).toBe(true);
    });

    expect(progressCount.textContent).toBe("1/64");
    const completedText = progressCount.textContent;

    // Reset button preserves completion
    const resetBtn = container.querySelector('[data-testid="reset-btn"]');
    resetBtn.click();
    expect(isLessonComplete("m1-l3")).toBe(true);
    expect(progressCount.textContent).toBe(completedText);

    // Repeated runs do not inflate counter
    runBtn.click();
    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l3")).toBe(true);
    });
    expect(progressCount.textContent).toBe(completedText);

    app.destroy();
  });

  it("Phase 6: switching from Lesson 3 to Lesson 2 clears transient UI and restores Lesson 2 starter code", () => {
    const app = createApp(container);
    app.loadLesson("m1-l3");

    // Modify Lesson 3 editor
    app.playground.getEditor().setValue('console.log("Modified in Lesson 3");');

    // Switch to Lesson 2
    app.loadLesson("m1-l2");

    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title.textContent).toBe("Your First Program and console.log()");

    const editorValue = app.playground.getEditor().getValue();
    expect(editorValue).toContain("Player Score:");
    expect(editorValue).not.toContain("Modified in Lesson 3");

    // Switch back to Lesson 3: restores Lesson 3 initial starter code
    app.loadLesson("m1-l3");
    const editorValueL3 = app.playground.getEditor().getValue();
    expect(editorValueL3).toContain("This line is a note to the reader, not code.");

    app.destroy();
  });

  // ─── Phase 7: Lesson 3 Heading Regression Tests ─────────────────────────────

  it("Phase 7 regression: Lesson 3 renders all 4 section headings with visible text in DOM", () => {
    const app = createApp(container);
    app.loadLesson("m1-l3");

    const expectedHeadings = [
      { id: "sec-heading-statements-and-semicolons", text: "1. Statements and Semicolons" },
      { id: "sec-heading-single-line-comments", text: "2. Single-Line Comments (//)" },
      { id: "sec-heading-multi-line-comments", text: "3. Multi-Line Comments (/* ... */)" },
      { id: "sec-heading-comments-are-not-output", text: "4. Comments Are Not Output" },
    ];

    expectedHeadings.forEach(({ id, text }) => {
      const headingEl = container.querySelector(`#${id}`);
      expect(headingEl).not.toBeNull();
      expect(headingEl.textContent.trim()).toBe(text);
    });

    // Content should contain HTML elements, not raw markdown backticks
    const body = container.querySelector("#statements-and-semicolons .section-body");
    expect(body).not.toBeNull();
    expect(body.querySelector("pre code")).not.toBeNull();
    expect(body.textContent).not.toContain("```javascript");

    app.destroy();
  });

  // ─── Phase 7: Lesson 4 Integration Tests ────────────────────────────────────

  it("Phase 7: loads Lesson 4 content, starter code, and exercise when navigating via sidebar", () => {
    const app = createApp(container);

    const navL4 = container.querySelector('[data-testid="nav-lesson-m1-l4"]');
    expect(navL4).not.toBeNull();
    navL4.click();

    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title.textContent).toBe("Understanding Common Syntax Errors");

    const exercisePanel = container.querySelector('[data-testid="exercise-panel"]');
    expect(exercisePanel).not.toBeNull();

    const prompt = container.querySelector('[data-testid="exercise-prompt"]');
    expect(prompt.textContent).toContain("Fix the error");

    const editorValue = app.playground.getEditor().getValue();
    expect(editorValue).toContain('console.log("Syntax errors are normal!";');

    app.destroy();
  });

  it("Phase 7: renders next lesson button in Lesson 3 footer linking to Lesson 4", () => {
    const app = createApp(container);
    app.loadLesson("m1-l3");

    const nextBtn = container.querySelector('[data-testid="next-lesson-btn"]');
    expect(nextBtn).not.toBeNull();
    expect(nextBtn.textContent).toContain("Understanding Common Syntax Errors");

    nextBtn.click();
    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title.textContent).toBe("Understanding Common Syntax Errors");

    app.destroy();
  });

  it("Phase 7: renders next lesson button in Lesson 4 footer linking to Module 2 Lesson 1", () => {
    const app = createApp(container);
    app.loadLesson("m1-l4");

    const nextBtn = container.querySelector('[data-testid="next-lesson-btn"]');
    expect(nextBtn).not.toBeNull();
    expect(nextBtn.textContent).toContain("Strings, Numbers, Booleans, null, and undefined");

    // Clicking it navigates to m2-l1 real content
    nextBtn.click();
    const title = container.querySelector('[data-testid="lesson-title"]');
    expect(title.textContent).toBe("Strings, Numbers, Booleans, null, and undefined");

    const section = container.querySelector(".lesson-section");
    expect(section.textContent).toContain("Values and Primitive Types");

    app.destroy();
  });

  it("Phase 7: running Lesson 4 starter code produces SyntaxError feedback with parenthesis guidance", async () => {
    const app = createApp(container);
    app.loadLesson("m1-l4");

    // Click run without modifying starter code (missing closing parenthesis)
    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      const feedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(feedback.textContent).toContain("Syntax Error");
      expect(feedback.textContent).toContain("matching closing parenthesis ')'");
    });

    expect(isLessonComplete("m1-l4")).toBe(false);

    app.destroy();
  });

  it("Phase 7: completing Lesson 4 exercise marks m1-l4 complete and updates progress to 4/64", async () => {
    markLessonComplete("m1-l1");
    markLessonComplete("m1-l2");
    markLessonComplete("m1-l3");

    const app = createApp(container);
    app.loadLesson("m1-l4");

    const progressCount = container.querySelector('[data-testid="progress-count"]');
    expect(progressCount.textContent).toBe("3/64");
    expect(isLessonComplete("m1-l4")).toBe(false);

    // Fix the missing closing parenthesis
    app.playground.getEditor().setValue('console.log("Syntax errors are normal!");\n');

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l4")).toBe(true);
    });

    expect(progressCount.textContent).toBe("4/64");

    const celebration = container.querySelector('[data-testid="celebration-badge"]');
    expect(celebration).not.toBeNull();
    expect(celebration.textContent).toContain("Exercise Complete!");

    // Next lesson link in exercise panel points to m2-l1
    const nextLessonBtn = container.querySelector('[data-testid="exercise-next-lesson-btn"]');
    expect(nextLessonBtn).not.toBeNull();
    expect(nextLessonBtn.textContent).toContain("Strings, Numbers, Booleans");

    app.destroy();
  });

  it("Phase 7: resetting Lesson 4 editor preserves earned progress and repeated runs do not inflate counter", async () => {
    const app = createApp(container);
    app.loadLesson("m1-l4");

    const progressCount = container.querySelector('[data-testid="progress-count"]');
    app.playground.getEditor().setValue('console.log("Syntax errors are normal!");\n');

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l4")).toBe(true);
    });

    expect(progressCount.textContent).toBe("1/64");
    const completedText = progressCount.textContent;

    // Reset button preserves completion
    const resetBtn = container.querySelector('[data-testid="reset-btn"]');
    resetBtn.click();
    expect(isLessonComplete("m1-l4")).toBe(true);
    expect(progressCount.textContent).toBe(completedText);

    // Repeated runs do not inflate counter
    runBtn.click();
    await vi.waitFor(() => {
      expect(isLessonComplete("m1-l4")).toBe(true);
    });
    expect(progressCount.textContent).toBe(completedText);

    app.destroy();
  });

  it("Phase 7: resetting all progress clears completion across all 4 lessons and resets counter to 0/64", () => {
    markLessonComplete("m1-l1");
    markLessonComplete("m1-l2");
    markLessonComplete("m1-l3");
    markLessonComplete("m1-l4");

    const app = createApp(container);
    const progressCount = container.querySelector('[data-testid="progress-count"]');
    expect(progressCount.textContent).toBe("4/64");

    const resetProgressBtn = container.querySelector('[data-testid="reset-progress-btn"]');
    expect(resetProgressBtn).not.toBeNull();
    resetProgressBtn.click();

    expect(isLessonComplete("m1-l1")).toBe(false);
    expect(isLessonComplete("m1-l2")).toBe(false);
    expect(isLessonComplete("m1-l3")).toBe(false);
    expect(isLessonComplete("m1-l4")).toBe(false);
    expect(progressCount.textContent).toBe("0/64");

    app.destroy();
  });

  it("Phase 8: navigates through all Module 2 lessons with accessible progressive hints", () => {
    const app = createApp(container);
    const lessons = [
      ["m2-l1", "Strings, Numbers, Booleans, null, and undefined"],
      ["m2-l2", "Declaring Variables with const and let"],
      ["m2-l3", "Reassignment and Value Mutability"],
      ["m2-l4", "Operators and Expressions"],
      ["m2-l5", "Type Conversion and Coercion"],
      ["m2-l6", "Equality and Comparisons"],
    ];

    for (const [lessonId, title] of lessons) {
      const navButton = container.querySelector(`[data-testid="nav-lesson-${lessonId}"]`);
      expect(navButton).not.toBeNull();
      navButton.click();

      expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(title);
      expect(container.querySelector(".lesson-objectives").textContent.trim()).not.toBe("");
      expect(app.playground.getExercise().id).toBe(`${lessonId}-ex1`);

      const hintToggle = container.querySelector('[data-testid="hint-toggle-btn"]');
      const hintContent = container.querySelector('[data-testid="exercise-hints-content"]');
      expect(hintToggle.getAttribute("aria-expanded")).toBe("false");
      expect(hintToggle.getAttribute("aria-controls")).toBe(hintContent.id);
      expect(hintContent.hidden).toBe(true);

      hintToggle.click();
      expect(hintToggle.getAttribute("aria-expanded")).toBe("true");
      expect(hintContent.hidden).toBe(false);
      expect(container.querySelector('[data-testid="hint-card-1"]')).not.toBeNull();

      container.querySelector('[data-testid="next-hint-btn"]').click();
      expect(container.querySelector('[data-testid="hint-card-2"]')).not.toBeNull();

      container.querySelector('[data-testid="collapse-hint-btn"]').click();
      expect(hintToggle.getAttribute("aria-expanded")).toBe("false");
      expect(hintContent.hidden).toBe(true);
    }

    app.destroy();
  });

  it("Phase 8: shows exercise error feedback for each unmodified Module 2 starter", async () => {
    const app = createApp(container);
    const lessonIds = ["m2-l1", "m2-l2", "m2-l3", "m2-l4", "m2-l5", "m2-l6"];
    const runBtn = container.querySelector('[data-testid="run-btn"]');

    for (const lessonId of lessonIds) {
      app.loadLesson(lessonId);
      runBtn.click();

      await vi.waitFor(() => {
        expect(app.playground.getExerciseValidation()).not.toBeNull();
      });

      const validation = app.playground.getExerciseValidation();
      const feedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(validation.passed).toBe(false);
      expect(feedback.classList.contains("feedback-fail")).toBe(true);
      expect(feedback.getAttribute("role")).toBe("status");
      expect(feedback.getAttribute("aria-live")).toBe("polite");
      expect(feedback.textContent.trim()).not.toBe("");

      if (lessonId === "m2-l3") {
        expect(validation.message).toContain("Change 'const score' to 'let score'");
      }
    }

    app.destroy();
  });

  it("Phase 8: completes all Module 2 lessons from 4/64 to 10/64 and persists progress idempotently", async () => {
    for (const lessonId of ["m1-l1", "m1-l2", "m1-l3", "m1-l4"]) {
      markLessonComplete(lessonId);
    }

    const app = createApp(container);
    const progressCount = container.querySelector('[data-testid="progress-count"]');
    expect(progressCount.textContent).toBe("4/64");

    app.loadLesson("m1-l4");
    container.querySelector('[data-testid="next-lesson-btn"]').click();
    expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
      "Strings, Numbers, Booleans, null, and undefined"
    );

    const solutions = {
      "m2-l1": `console.log(typeof "Code");\nconsole.log(typeof 42);\nconsole.log(typeof true);`,
      "m2-l2": `const courseName = "JavaScript Basics";\nlet lessonNumber = 2;\nconsole.log(courseName);\nconsole.log(lessonNumber);`,
      "m2-l3": `let score = 10;\nconsole.log(score);\nscore = 25;\nconsole.log(score);`,
      "m2-l4": `const itemPrice = 15;\nconst quantity = 3;\nconst shipping = 5;\nlet total = itemPrice * quantity;\ntotal += shipping;\nconsole.log(total);\nconsole.log(\`Total: $\${total}\`);`,
      "m2-l5": `const input1 = "40";\nconst input2 = "60";\nconst sum = Number(input1) + Number(input2);\nconsole.log(sum);`,
      "m2-l6": `const price = 80;\nconst taxRate = 0.05;\nlet discount = 10;\nconst finalTotal = (price + (price * taxRate)) - discount;\nconst isUnderBudget = finalTotal <= 75;\nconst isTargetTotal = finalTotal === 74;\nconsole.log(finalTotal);\nconsole.log(isUnderBudget);\nconsole.log(isTargetTotal);`,
    };
    const lessonIds = Object.keys(solutions);
    const runBtn = container.querySelector('[data-testid="run-btn"]');

    for (const [index, lessonId] of lessonIds.entries()) {
      expect(app.playground.getExercise().id).toBe(`${lessonId}-ex1`);
      app.playground.getEditor().setValue(solutions[lessonId]);
      runBtn.click();

      await vi.waitFor(() => {
        expect(isLessonComplete(lessonId)).toBe(true);
        expect(app.playground.getExerciseValidation()?.passed).toBe(true);
      });
      expect(progressCount.textContent).toBe(`${5 + index}/64`);

      if (lessonId === "m2-l6") {
        expect(app.playground.getExerciseValidation().message).toContain("Module 2 Milestone");

        const completedCount = progressCount.textContent;
        container.querySelector('[data-testid="reset-btn"]').click();
        expect(isLessonComplete(lessonId)).toBe(true);
        expect(progressCount.textContent).toBe(completedCount);

        app.playground.getEditor().setValue(solutions[lessonId]);
        runBtn.click();
        await vi.waitFor(() => {
          expect(app.playground.getExerciseValidation()?.passed).toBe(true);
        });
        expect(progressCount.textContent).toBe(completedCount);
      }

      const nextLessonBtn = container.querySelector('[data-testid="exercise-next-lesson-btn"]');
      expect(nextLessonBtn).not.toBeNull();
      nextLessonBtn.click();
    }

    expect(progressCount.textContent).toBe("10/64");
    expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
      "Truthy and Falsy Values"
    );

    app.destroy();

    const restoredApp = createApp(container);
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("10/64");
    for (const lessonId of lessonIds) {
      expect(isLessonComplete(lessonId)).toBe(true);
    }
    restoredApp.destroy();
  });

  it("Phase 10: Module 4 Lesson 1 renders its implemented content", () => {
    const app = createApp(container);
    app.loadLesson("m4-l1");

    expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
      "Function Declarations and Expressions"
    );
    expect(app.playground.getExercise().id).toBe("m4-l1-ex1");

    app.destroy();
  });

  it("Phase 9: navigates across Module 3 with accessible progressive hints", () => {
    const app = createApp(container);
    const lessons = [
      ["m3-l1", "Truthy and Falsy Values"],
      ["m3-l2", "if, else if, and else"],
      ["m3-l3", "switch and Conditional Expressions"],
      ["m3-l4", "for and while Loops"],
      ["m3-l5", "break and continue"],
      ["m3-l6", "Choosing an Appropriate Control Structure"],
    ];

    for (const [lessonId, title] of lessons) {
      container.querySelector(`[data-testid="nav-lesson-${lessonId}"]`).click();
      expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(title);
      expect(container.querySelector(".lesson-objectives").textContent.trim()).not.toBe("");
      expect(app.playground.getExercise().id).toBe(`${lessonId}-ex1`);

      const toggle = container.querySelector('[data-testid="hint-toggle-btn"]');
      const panel = container.querySelector('[data-testid="exercise-hints-content"]');
      expect(toggle.tagName).toBe("BUTTON");
      expect(toggle.tabIndex).toBe(0);
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
      expect(toggle.getAttribute("aria-controls")).toBe(panel.id);
      expect(panel.hidden).toBe(true);

      toggle.focus();
      toggle.click();
      expect(toggle.getAttribute("aria-expanded")).toBe("true");
      expect(panel.hidden).toBe(false);
      expect(container.querySelector('[data-testid="hint-card-1"]')).not.toBeNull();
      container.querySelector('[data-testid="next-hint-btn"]').click();
      expect(container.querySelector('[data-testid="hint-card-2"]')).not.toBeNull();
      container.querySelector('[data-testid="collapse-hint-btn"]').click();
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
      expect(panel.hidden).toBe(true);
    }

    app.destroy();
  });

  it("Phase 9: completes the six Module 3 exercises from 10/64 to 16/64 and persists idempotently", async () => {
    for (const lessonId of [
      "m1-l1",
      "m1-l2",
      "m1-l3",
      "m1-l4",
      "m2-l1",
      "m2-l2",
      "m2-l3",
      "m2-l4",
      "m2-l5",
      "m2-l6",
    ]) {
      markLessonComplete(lessonId);
    }

    const app = createApp(container);
    const count = container.querySelector('[data-testid="progress-count"]');
    expect(count.textContent).toBe("10/64");

    const solutions = {
      "m3-l1": `const emptyCount = 0;\nconst emptyText = "";\nconst zeroLabel = "0";\nconst readyMessage = "Ready";\nconsole.log(Boolean(emptyCount));\nconsole.log(Boolean(emptyText));\nconsole.log(Boolean(zeroLabel));\nconsole.log(Boolean(readyMessage));`,
      "m3-l2": `const score = 82;\nif (score >= 90) {\n  console.log("Excellent");\n} else if (score >= 70) {\n  console.log("Passing");\n} else {\n  console.log("Keep practicing");\n}`,
      "m3-l3": `const deliveryCode = "express";\nconst isMember = true;\nlet deliveryLabel;\nswitch (deliveryCode) {\n  case "standard":\n    deliveryLabel = "Standard delivery";\n    break;\n  case "express":\n    deliveryLabel = "Express delivery";\n    break;\n  default:\n    deliveryLabel = "Unknown delivery";\n}\nconsole.log(deliveryLabel);\nconsole.log(isMember ? "Member price" : "Regular price");`,
      "m3-l4": `let forTotal = 0;\nfor (let value = 1; value <= 4; value++) {\n  forTotal += value;\n}\nlet whileTotal = 0;\nlet nextValue = 1;\nwhile (nextValue <= 4) {\n  whileTotal += nextValue;\n  nextValue++;\n}\nconsole.log(forTotal);\nconsole.log(whileTotal);`,
      "m3-l5": `for (let value = 1; value <= 6; value++) {\n  if (value === 3) continue;\n  if (value > 5) break;\n  console.log(value);\n}`,
      "m3-l6": `const targetNumber = 5;\nfor (let guess = 1; guess <= 6; guess++) {\n  if (guess === 3) continue;\n  if (guess < targetNumber) {\n    console.log(\`\${guess}: too low\`);\n  } else if (guess === targetNumber) {\n    console.log(\`Found \${guess}\`);\n    break;\n  } else {\n    console.log(\`\${guess}: too high\`);\n  }\n}`,
    };
    const expectedTitles = [
      "Truthy and Falsy Values",
      "if, else if, and else",
      "switch and Conditional Expressions",
      "for and while Loops",
      "break and continue",
      "Choosing an Appropriate Control Structure",
    ];
    const lessonIds = Object.keys(solutions);
    const runBtn = container.querySelector('[data-testid="run-btn"]');

    for (const [index, lessonId] of lessonIds.entries()) {
      const navButton = container.querySelector(`[data-testid="nav-lesson-${lessonId}"]`);
      navButton.click();
      expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
        expectedTitles[index]
      );

      runBtn.click();
      await vi.waitFor(() => {
        expect(app.playground.getExerciseValidation()).not.toBeNull();
      });
      expect(app.playground.getExerciseValidation().passed).toBe(false);
      expect(isLessonComplete(lessonId)).toBe(false);
      const feedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(feedback.classList.contains("feedback-fail")).toBe(true);
      expect(feedback.getAttribute("role")).toBe("status");
      expect(feedback.getAttribute("aria-live")).toBe("polite");

      app.playground.getEditor().setValue(solutions[lessonId]);
      runBtn.click();
      await vi.waitFor(() => {
        expect(isLessonComplete(lessonId)).toBe(true);
        expect(app.playground.getExerciseValidation()?.passed).toBe(true);
      });
      expect(count.textContent).toBe(`${11 + index}/64`);

      if (lessonId === "m3-l6") {
        expect(app.playground.getExerciseValidation().message).toContain("Module 3 milestone");

        const milestoneCount = count.textContent;
        container.querySelector('[data-testid="reset-btn"]').click();
        expect(isLessonComplete(lessonId)).toBe(true);
        expect(count.textContent).toBe(milestoneCount);

        app.playground.getEditor().setValue(solutions[lessonId]);
        runBtn.click();
        await vi.waitFor(() => {
          expect(app.playground.getExerciseValidation()?.passed).toBe(true);
        });
        expect(count.textContent).toBe(milestoneCount);

        const nextButton = container.querySelector('[data-testid="exercise-next-lesson-btn"]');
        expect(nextButton.textContent).toContain("Function Declarations and Expressions");
        nextButton.click();
        expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
          "Function Declarations and Expressions"
        );
        expect(app.playground.getExercise().id).toBe("m4-l1-ex1");
      } else {
        const nextButton = container.querySelector('[data-testid="exercise-next-lesson-btn"]');
        expect(nextButton).not.toBeNull();
        nextButton.click();
        expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
          expectedTitles[index + 1]
        );
      }
    }

    expect(count.textContent).toBe("16/64");
    app.loadLesson("m3-l6");
    container.querySelector('[data-testid="next-lesson-btn"]').click();
    expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
      "Function Declarations and Expressions"
    );
    app.destroy();

    const restoredApp = createApp(container);
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("16/64");
    for (const lessonId of lessonIds) {
      expect(isLessonComplete(lessonId)).toBe(true);
    }
    restoredApp.destroy();
  });

  it("Phase 10: navigates across all seven Module 4 lessons with accessible progressive hints", () => {
    const app = createApp(container);
    const lessons = [
      ["m4-l1", "Function Declarations and Expressions"],
      ["m4-l2", "Parameters, Arguments, and Return Values"],
      ["m4-l3", "Arrow Functions"],
      ["m4-l4", "Scope and Lexical Scope"],
      ["m4-l5", "Callbacks and Higher-Order Functions"],
      ["m4-l6", "Closures"],
      ["m4-l7", "Recursion and Common Debugging Patterns"],
    ];

    for (const [lessonId, title] of lessons) {
      container.querySelector(`[data-testid="nav-lesson-${lessonId}"]`).click();
      expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(title);
      expect(container.querySelector(".lesson-objectives").textContent.trim()).not.toBe("");
      expect(app.playground.getExercise().id).toBe(`${lessonId}-ex1`);

      const toggle = container.querySelector('[data-testid="hint-toggle-btn"]');
      const panel = container.querySelector('[data-testid="exercise-hints-content"]');
      expect(toggle.tagName).toBe("BUTTON");
      expect(toggle.tabIndex).toBe(0);
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
      expect(toggle.getAttribute("aria-controls")).toBe(panel.id);
      expect(panel.hidden).toBe(true);

      toggle.focus();
      toggle.click();
      expect(toggle.getAttribute("aria-expanded")).toBe("true");
      expect(panel.hidden).toBe(false);
      expect(container.querySelector('[data-testid="hint-card-1"]')).not.toBeNull();
      container.querySelector('[data-testid="next-hint-btn"]').click();
      expect(container.querySelector('[data-testid="hint-card-2"]')).not.toBeNull();
      container.querySelector('[data-testid="collapse-hint-btn"]').click();
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
      expect(panel.hidden).toBe(true);
    }

    app.destroy();
  });

  it("Phase 10: completes Module 4 from 16/64 to 23/64, persists idempotently, and navigates to Module 5", async () => {
    const earlierLessonIds = [
      "m1-l1", "m1-l2", "m1-l3", "m1-l4",
      "m2-l1", "m2-l2", "m2-l3", "m2-l4", "m2-l5", "m2-l6",
      "m3-l1", "m3-l2", "m3-l3", "m3-l4", "m3-l5", "m3-l6",
    ];
    earlierLessonIds.forEach(markLessonComplete);

    const app = createApp(container);
    const count = container.querySelector('[data-testid="progress-count"]');
    expect(count.textContent).toBe("16/64");

    const solutions = {
      "m4-l1": `function showWelcome() {\n  console.log("Welcome");\n}\nconst showReminder = function () {\n  console.log("Practice functions");\n};\nshowWelcome();\nshowReminder();`,
      "m4-l2": `function addTax(price, tax) {\n  return price + tax;\n}\nconst total = addTax(20, 4);\nconsole.log(total);`,
      "m4-l3": `const makeGreeting = (name) => {\n  return "Hello, " + name;\n};\nconsole.log(makeGreeting("Sam"));`,
      "m4-l4": `const courseName = "JavaScript";\nfunction makeMessage() {\n  const audience = "learner";\n  return audience + ": " + courseName;\n}\nconsole.log(makeMessage());`,
      "m4-l5": `function addBonus(score) {\n  return score + 5;\n}\nfunction applyToScore(score, callback) {\n  return callback(score);\n}\nconsole.log(applyToScore(10, addBonus));`,
      "m4-l6": `function createCounter() {\n  let count = 0;\n  return function () {\n    count++;\n    return count;\n  };\n}\nconst firstCounter = createCounter();\nconsole.log(firstCounter());\nconsole.log(firstCounter());\nconst secondCounter = createCounter();\nconsole.log(secondCounter());`,
      "m4-l7": `function sumSteps(steps) {\n  if (steps === 0) {\n    return 0;\n  }\n  return steps + sumSteps(steps - 1);\n}\nfunction formatTotal(total) {\n  return "Total: " + total;\n}\nfunction createSummary(steps, formatter) {\n  return formatter(sumSteps(steps));\n}\nconsole.log(createSummary(3, formatTotal));`,
    };
    const lessonIds = Object.keys(solutions);
    const expectedTitles = [
      "Function Declarations and Expressions",
      "Parameters, Arguments, and Return Values",
      "Arrow Functions",
      "Scope and Lexical Scope",
      "Callbacks and Higher-Order Functions",
      "Closures",
      "Recursion and Common Debugging Patterns",
    ];
    const runBtn = container.querySelector('[data-testid="run-btn"]');

    for (const [index, lessonId] of lessonIds.entries()) {
      container.querySelector(`[data-testid="nav-lesson-${lessonId}"]`).click();
      expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
        expectedTitles[index]
      );

      runBtn.click();
      await vi.waitFor(() => {
        expect(app.playground.getExerciseValidation()).not.toBeNull();
      });
      expect(app.playground.getExerciseValidation().passed).toBe(false);
      expect(isLessonComplete(lessonId)).toBe(false);
      const feedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(feedback.classList.contains("feedback-fail")).toBe(true);
      expect(feedback.getAttribute("role")).toBe("status");
      expect(feedback.getAttribute("aria-live")).toBe("polite");

      app.playground.getEditor().setValue(solutions[lessonId]);
      runBtn.click();
      await vi.waitFor(() => {
        expect(isLessonComplete(lessonId), `completion for ${lessonId}`).toBe(true);
        expect(
          app.playground.getExerciseValidation()?.passed,
          `validation for ${lessonId}: ${app.playground.getExerciseValidation()?.message}`
        ).toBe(true);
      });
      expect(count.textContent).toBe(`${17 + index}/64`);

      const completedCount = count.textContent;
      app.playground.getEditor().setValue(solutions[lessonId]);
      runBtn.click();
      await vi.waitFor(() => {
        expect(app.playground.getExerciseValidation()?.passed).toBe(true);
      });
      expect(count.textContent).toBe(completedCount);

      if (lessonId === "m4-l7") {
        expect(app.playground.getExerciseValidation().message).toContain("Module 4 milestone");
        const nextButton = container.querySelector('[data-testid="exercise-next-lesson-btn"]');
        expect(nextButton).not.toBeNull();
        nextButton.click();
        expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
          "Creating and Accessing Arrays"
        );
      } else {
        const nextButton = container.querySelector('[data-testid="exercise-next-lesson-btn"]');
        expect(nextButton).not.toBeNull();
        nextButton.click();
        expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
          expectedTitles[index + 1]
        );
      }
    }

    expect(count.textContent).toBe("23/64");
    app.loadLesson("m4-l7");
    container.querySelector('[data-testid="next-lesson-btn"]').click();
    expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
      "Creating and Accessing Arrays"
    );
    app.destroy();

    const restoredApp = createApp(container);
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("23/64");
    for (const lessonId of [...earlierLessonIds, ...lessonIds]) {
      expect(isLessonComplete(lessonId)).toBe(true);
    }
    container.querySelector('[data-testid="reset-progress-btn"]').click();
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("0/64");
    restoredApp.destroy();
  });

  it("Phase 11: navigates across all eight Module 5 lessons with accessible progressive hints", () => {
    const app = createApp(container);
    const lessons = [
      ["m5-l1", "Creating and Accessing Arrays"],
      ["m5-l2", "Iteration and Array Methods"],
      ["m5-l3", "map, filter, find, and reduce"],
      ["m5-l4", "Creating and Updating Objects"],
      ["m5-l5", "Methods and the this Keyword"],
      ["m5-l6", "Destructuring, Spread, and Rest Syntax"],
      ["m5-l7", "References, Mutation, and Copying"],
      ["m5-l8", "Transforming Collections of Objects"],
    ];

    for (const [lessonId, title] of lessons) {
      container.querySelector(`[data-testid="nav-lesson-${lessonId}"]`).click();
      expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(title);
      expect(container.querySelector(".lesson-objectives").textContent.trim()).not.toBe("");
      expect(app.playground.getExercise().id).toBe(`${lessonId}-ex1`);

      const toggle = container.querySelector('[data-testid="hint-toggle-btn"]');
      const panel = container.querySelector('[data-testid="exercise-hints-content"]');
      expect(toggle.tagName).toBe("BUTTON");
      expect(toggle.tabIndex).toBe(0);
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
      expect(toggle.getAttribute("aria-controls")).toBe(panel.id);
      expect(panel.hidden).toBe(true);

      toggle.focus();
      toggle.click();
      expect(toggle.getAttribute("aria-expanded")).toBe("true");
      expect(panel.hidden).toBe(false);
      expect(container.querySelector('[data-testid="hint-card-1"]')).not.toBeNull();
      container.querySelector('[data-testid="next-hint-btn"]').click();
      expect(container.querySelector('[data-testid="hint-card-2"]')).not.toBeNull();
      container.querySelector('[data-testid="collapse-hint-btn"]').click();
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
      expect(panel.hidden).toBe(true);
    }

    app.destroy();
  });

  it("Phase 11: completes Module 5 from 23/64 to 31/64 and verifies persistence, idempotency, reset, and Module 6 navigation", async () => {
    const earlierLessonIds = [
      "m1-l1", "m1-l2", "m1-l3", "m1-l4",
      "m2-l1", "m2-l2", "m2-l3", "m2-l4", "m2-l5", "m2-l6",
      "m3-l1", "m3-l2", "m3-l3", "m3-l4", "m3-l5", "m3-l6",
      "m4-l1", "m4-l2", "m4-l3", "m4-l4", "m4-l5", "m4-l6", "m4-l7",
    ];
    earlierLessonIds.forEach(markLessonComplete);

    const app = createApp(container);
    const count = container.querySelector('[data-testid="progress-count"]');
    expect(count.textContent).toBe("23/64");

    app.loadLesson("m4-l7");
    container.querySelector('[data-testid="next-lesson-btn"]').click();
    expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
      "Creating and Accessing Arrays"
    );

    const solutions = {
      "m5-l1": `const stops = ["Museum", "Library", "Park"];\nconst firstStop = stops[0];\nconst lastStop = stops[stops.length - 1];\nconsole.log(firstStop);\nconsole.log(lastStop);\nconsole.log(stops.length);`,
      "m5-l2": `const readings = [2, 4, 1];\nconst doubled = [];\nfor (const reading of readings) {\n  doubled.push(reading * 2);\n}\nconsole.log(doubled[0]);\nconsole.log(doubled[1]);\nconsole.log(doubled[2]);\nconsole.log(doubled.length);\nconsole.log(doubled.includes(8));`,
      "m5-l3": `const scores = [3, 7, 5, 9];\nconst doubled = scores.map((score) => score * 2);\nconst passing = scores.filter((score) => score >= 6);\nconst firstPassing = scores.find((score) => score >= 6);\nconst total = scores.reduce((sum, score) => sum + score, 0);\nfor (const score of doubled) console.log(score);\nconsole.log(\`Passing: \${passing.length}\`);\nconsole.log(\`First: \${firstPassing}\`);\nconsole.log(\`Total: \${total}\`);`,
      "m5-l4": `const book = { title: "River", copies: 2 };\nconst key = "copies";\nbook[key] = book[key] + 1;\nbook.shelf = "A3";\nconsole.log(book.title);\nconsole.log(book.copies);\nconsole.log(book.shelf);`,
      "m5-l5": `const counter = {\n  label: "Count",\n  value: 2,\n  increase(amount) {\n    this.value = this.value + amount;\n    return this.value;\n  },\n};\nconsole.log(counter.increase(3));\nconsole.log(counter.value);`,
      "m5-l6": `const dimensions = [4, 7, 9];\nlet width = 0;\nlet remaining = [];\n[width, ...remaining] = dimensions;\nconst resized = [...remaining, 12];\nconst player = { name: "Mira", level: 2 };\nlet name = "";\nlet stats = {};\n({ name, ...stats } = player);\nconst upgraded = { ...player, level: 3 };\nfunction countItems(first, ...others) {\n  return 1 + others.length;\n}\nconsole.log(width);\nconsole.log(resized[2]);\nconsole.log(name);\nconsole.log(stats.level);\nconsole.log(upgraded.level);\nconsole.log(countItems("pen", "book", "lamp"));`,
      "m5-l7": `let points = 4;\nconst copiedPoints = points;\npoints = 9;\nconsole.log(copiedPoints);\nconsole.log(points);\nconst original = { title: "Draft", tags: ["js"] };\nconst alias = original;\nconst copy = { ...original };\noriginal.title = "Published";\noriginal.tags.push("arrays");\ncopy.title = "My copy";\nconsole.log(alias.title);\nconsole.log(original.title);\nconsole.log(copy.title);\nconsole.log(copy.tags[1]);`,
      "m5-l8": `const inventory = [\n  { name: "Notebook", price: 3, quantity: 2 },\n  { name: "Pen", price: 1, quantity: 3 },\n  { name: "Marker", price: 2, quantity: 0 },\n];\nconst available = inventory.filter((item) => item.quantity > 0);\nconst labels = available.map((item) => \`\${item.name}: \${item.quantity}\`);\nconst units = available.reduce((total, item) => total + item.quantity, 0);\nconst value = available.reduce((total, item) => total + item.price * item.quantity, 0);\nfor (const label of labels) console.log(label);\nconsole.log(\`Units: \${units}\`);\nconsole.log(\`Value: \${value}\`);`,
    };
    const expectedTitles = [
      "Creating and Accessing Arrays",
      "Iteration and Array Methods",
      "map, filter, find, and reduce",
      "Creating and Updating Objects",
      "Methods and the this Keyword",
      "Destructuring, Spread, and Rest Syntax",
      "References, Mutation, and Copying",
      "Transforming Collections of Objects",
    ];
    const lessonIds = Object.keys(solutions);
    const runBtn = container.querySelector('[data-testid="run-btn"]');

    for (const [index, lessonId] of lessonIds.entries()) {
      container.querySelector(`[data-testid="nav-lesson-${lessonId}"]`).click();
      expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
        expectedTitles[index]
      );

      runBtn.click();
      await vi.waitFor(() => {
        expect(app.playground.getExerciseValidation()).not.toBeNull();
      });
      expect(app.playground.getExerciseValidation().passed).toBe(false);
      expect(isLessonComplete(lessonId)).toBe(false);
      const failureFeedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(failureFeedback.classList.contains("feedback-fail")).toBe(true);
      expect(failureFeedback.getAttribute("role")).toBe("status");
      expect(failureFeedback.getAttribute("aria-live")).toBe("polite");

      app.playground.getEditor().setValue(solutions[lessonId]);
      runBtn.click();
      await vi.waitFor(() => {
        expect(isLessonComplete(lessonId), `completion for ${lessonId}`).toBe(true);
        expect(
          app.playground.getExerciseValidation()?.passed,
          `validation for ${lessonId}: ${app.playground.getExerciseValidation()?.message}`
        ).toBe(true);
      });
      expect(count.textContent).toBe(`${24 + index}/64`);

      const completedCount = count.textContent;
      app.playground.getEditor().setValue(solutions[lessonId]);
      runBtn.click();
      await vi.waitFor(() => {
        expect(app.playground.getOutput().map(({ text }) => text)).toEqual(
          app.playground.getExercise().expectedOutput.split("\n")
        );
      });
      expect(count.textContent).toBe(completedCount);

      if (lessonId === "m5-l8") {
        expect(app.playground.getExerciseValidation().message).toContain(
          "filtered available inventory"
        );
        const nextButton = container.querySelector('[data-testid="exercise-next-lesson-btn"]');
        expect(nextButton).not.toBeNull();
        nextButton.click();
        expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
          "The Relationship Between JavaScript, HTML, and CSS"
        );
        expect(container.querySelector(".lesson-section").textContent).toContain(
          "JavaScript describes behavior"
        );
      } else {
        const nextButton = container.querySelector('[data-testid="exercise-next-lesson-btn"]');
        expect(nextButton).not.toBeNull();
        nextButton.click();
        expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
          expectedTitles[index + 1]
        );
      }
    }

    expect(count.textContent).toBe("31/64");
    app.loadLesson("m5-l8");
    container.querySelector('[data-testid="next-lesson-btn"]').click();
    expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(
      "The Relationship Between JavaScript, HTML, and CSS"
    );
    app.destroy();

    const restoredApp = createApp(container);
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("31/64");
    for (const lessonId of [...earlierLessonIds, ...lessonIds]) {
      expect(isLessonComplete(lessonId)).toBe(true);
    }
    container.querySelector('[data-testid="reset-progress-btn"]').click();
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("0/64");
    restoredApp.destroy();
  });

  it("navigates through all Module 6 lessons and into the implemented Module 7", () => {
    const app = createApp(container);
    const lessons = [
      ["m6-l1", "The Relationship Between JavaScript, HTML, and CSS", "JavaScript Worker"],
      ["m6-l2", "DOM Selection and Manipulation", "Worker-backed controlled DOM simulation"],
      ["m6-l3", "Event Listeners and Event Objects", "Worker-backed controlled DOM simulation"],
      ["m6-l4", "Form Input and Validation", "Worker-backed controlled DOM simulation"],
      ["m6-l5", "Modules and Imports/Exports", "Knowledge check — no code executes"],
      ["m6-l6", "Error Handling with try and catch", "JavaScript Worker"],
      ["m6-l7", "Browser Debugging Tools", "Knowledge check — no code executes"],
    ];

    for (const [lessonId, title, mode] of lessons) {
      app.loadLesson(lessonId);
      expect(container.querySelector('[data-testid="lesson-title"]').textContent).toBe(title);
      expect(container.querySelector('[data-testid="execution-mode"]').textContent).toBe(mode);
      expect(container.querySelector('[data-testid="next-lesson-btn"]')).not.toBeNull();
    }

    app.loadLesson("m7-l1");
    expect(container.querySelector('[data-testid="lesson-title"]').textContent)
      .toBe("Synchronous Execution and the Event Loop");
    expect(container.querySelector('[data-testid="execution-mode"]').textContent)
      .toBe("Knowledge check — no code executes");
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("0/64");
    app.loadLesson("m7-l7");
    expect(container.querySelector('[data-testid="lesson-title"]').textContent)
      .toBe("Loading States and Failed Requests");
    expect(container.querySelector('[data-testid="execution-mode"]').textContent)
      .toBe("Async JavaScript Worker — bounded timers and approved API");
    app.loadLesson("m8-l1");
    expect(container.querySelector('[data-testid="lesson-title"]').textContent)
      .toBe("Objects, Properties, and Methods");
    app.destroy();
  });

  it("completes Module 7 idempotently from 38/64 to 45/64 and preserves/reset progress", () => {
    getCurriculum().flatMap(({ lessons }) => lessons).slice(0, 38)
      .forEach(({ lessonId }) => markLessonComplete(lessonId));
    const app = createApp(container);
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("38/64");

    app.loadLesson("m7-l1");
    const radios = container.querySelectorAll('[data-testid="knowledge-check-mount"] input[type="radio"]');
    [0, 2, 4].forEach((index) => {
      radios[index].checked = true;
      radios[index].dispatchEvent(new Event("change", { bubbles: true }));
    });
    const form = container.querySelector('[data-testid="knowledge-check-form"]');
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("39/64");
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("39/64");

    const expectedOutputs = {
      "m7-l2": ["start", "scheduled", "callback"],
      "m7-l3": ["3", "4", "cleanup"],
      "m7-l4": ["start", "ready"],
      "m7-l5": ["Handled: offline"],
      "m7-l6": ["Task: delectus aut autem", "Status: open"],
      "m7-l7": [
        "Loading task...",
        "Could not load task: HTTP 404",
        "Retrying task...",
        "Loaded: delectus aut autem",
      ],
    };
    for (const [lessonId, output] of Object.entries(expectedOutputs)) {
      app.loadLesson(lessonId);
      app.playground.setOutput(output.map((text) => ({ type: "log", text })));
      expect(app.playground.validateExercise({ status: "success" }).passed).toBe(true);
    }

    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("45/64");
    app.destroy();

    const restoredApp = createApp(container);
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("45/64");
    container.querySelector('[data-testid="reset-progress-btn"]').click();
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("0/64");
    restoredApp.destroy();
  });

  it("terminates the active DOM Worker and clears its run when changing lessons", () => {
    const workers = [];
    class TrackingWorker {
      constructor() {
        this.terminated = false;
        this.postMessage = vi.fn();
        this.terminate = vi.fn(() => {
          this.terminated = true;
        });
        workers.push(this);
      }
    }

    vi.stubGlobal("Worker", TrackingWorker);
    const app = createApp(container);

    try {
      app.loadLesson("m6-l2");
      const domRunner = app.playground.getDomRunner();
      const existingWorkerCount = workers.length;
      domRunner.run("", "m6-l2");
      expect(workers).toHaveLength(existingWorkerCount + 1);
      const domWorker = workers.at(-1);
      expect(domRunner._getState().runId).not.toBeNull();

      app.loadLesson("m6-l5");

      expect(domWorker.terminate).toHaveBeenCalledOnce();
      expect(domRunner._getState().runId).toBeNull();
      expect(container.querySelector('[data-testid="dom-preview-panel"]').hidden).toBe(true);
    } finally {
      app.destroy();
      vi.unstubAllGlobals();
    }
  });

  it("completes Module 6 from 31/64 to 38/64 idempotently and preserves or resets progress", () => {
    for (const module of getCurriculum().slice(0, 5)) {
      for (const lesson of module.lessons) markLessonComplete(lesson.lessonId);
    }
    const app = createApp(container);
    const count = container.querySelector('[data-testid="progress-count"]');
    expect(count.textContent).toBe("31/64");

    app.loadLesson("m6-l1");
    app.playground.setOutput([
      "HTML: structure",
      "CSS: presentation",
      "JavaScript: behavior",
    ].map((text) => ({ type: "log", text })));
    expect(app.playground.validateExercise({ status: "success" }).passed).toBe(true);
    app.playground.validateExercise({ status: "success" });
    expect(count.textContent).toBe("32/64");

    app.loadLesson("m6-l2");
    app.playground.setOutput([
      { type: "log", text: "JavaScript updated" },
      { type: "log", text: "2" },
    ]);
    expect(app.playground.validateExercise({
      status: "success",
      snapshot: {
        roots: [
          { tag: "h2", attributes: { id: "status" }, text: "JavaScript updated", children: [] },
          {
            tag: "ul",
            attributes: { id: "items" },
            children: [
              { tag: "li", text: "Read guide", children: [] },
              { tag: "li", text: "Practice DOM", children: [] },
            ],
          },
        ],
      },
    }).passed).toBe(true);

    app.loadLesson("m6-l3");
    app.playground.setOutput([
      "Clicked: Add one",
      "Count: 1",
      "Clicked: Add one",
      "Count: 2",
    ].map((text) => ({ type: "log", text })));
    expect(app.playground.validateExercise({
      status: "success",
      snapshot: {
        roots: [{
          tag: "p",
          text: "Count: ",
          children: [{ tag: "output", attributes: { id: "count" }, text: "2", children: [] }],
        }],
      },
      interactions: [{ type: "click" }, { type: "click" }],
    }).passed).toBe(true);

    app.loadLesson("m6-l4");
    app.playground.setOutput([]);
    expect(app.playground.validateExercise({
      status: "success",
      snapshot: {
        roots: [
          { tag: "form", attributes: { id: "task-form" }, children: [
            { tag: "input", attributes: { id: "task-input" }, value: "", children: [] },
          ] },
          { tag: "p", attributes: { id: "task-status" }, text: "Added: Review DOM.", children: [] },
          { tag: "p", attributes: { id: "task-count" }, text: "1 of 3 completed", children: [] },
          { tag: "ul", attributes: { id: "task-list" }, children: [
            { tag: "li", children: [{ tag: "input", attributes: { type: "checkbox" }, checked: false, children: [] }] },
            { tag: "li", children: [{ tag: "input", attributes: { type: "checkbox" }, checked: false, children: [] }] },
            { tag: "li", children: [{ tag: "label", text: "Review DOM", children: [
              { tag: "input", attributes: { type: "checkbox" }, checked: true, children: [] },
            ] }] },
          ] },
        ],
      },
      interactions: [
        { type: "submit", formValues: { "task-input": "  " } },
        { type: "submit", formValues: { "task-input": "Review DOM" } },
        { type: "change", checked: true },
      ],
    }).passed).toBe(true);

    app.loadLesson("m6-l5");
    for (const value of ["named-import", "eight"]) {
      const option = container.querySelector(`input[value="${value}"]`);
      option.checked = true;
      option.dispatchEvent(new Event("change", { bubbles: true }));
    }
    container.querySelector('[data-testid="knowledge-check-form"]').dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    expect(count.textContent).toBe("36/64");

    app.loadLesson("m6-l6");
    app.playground.setOutput([{ type: "log", text: "Handled: Name is required" }]);
    expect(app.playground.validateExercise({ status: "success" }).passed).toBe(true);

    app.loadLesson("m6-l7");
    for (const value of ["inclusive-bound", "watch-index", "logic-error"]) {
      const option = container.querySelector(`input[value="${value}"]`);
      option.checked = true;
      option.dispatchEvent(new Event("change", { bubbles: true }));
    }
    const finalForm = container.querySelector('[data-testid="knowledge-check-form"]');
    finalForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(count.textContent).toBe("38/64");
    finalForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(count.textContent).toBe("38/64");

    app.destroy();
    const restoredApp = createApp(container);
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("38/64");
    container.querySelector('[data-testid="reset-progress-btn"]').click();
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("0/64");
    restoredApp.destroy();
  });

  it("completes the final lesson at 64/64, restores completion, and resets the course journey", () => {
    const app = createApp(container);
    const count = container.querySelector('[data-testid="progress-count"]');
    const courseCompletion = container.querySelector('[data-testid="course-completion"]');
    const moduleCheckpoints = [4, 10, 16, 23, 31, 38, 45, 55];

    expect(count.textContent).toBe("0/64");
    expect(courseCompletion.hidden).toBe(true);

    for (const [moduleIndex, module] of getCurriculum().entries()) {
      for (const lesson of module.lessons) {
        if (lesson.lessonId !== "m9-l9") markLessonComplete(lesson.lessonId);
      }

      if (moduleIndex < moduleCheckpoints.length) {
        app.updateProgressCounter();
        expect(count.textContent).toBe(`${moduleCheckpoints[moduleIndex]}/64`);
      }
    }

    app.updateProgressCounter();
    expect(count.textContent).toBe("63/64");
    expect(courseCompletion.hidden).toBe(true);

    app.loadLesson("m9-l9");
    for (const answerId of [
      "application-state",
      "responsibilities",
      "event-flow",
      "reusable-display",
      "framework-organization",
    ]) {
      const option = container.querySelector(`input[value="${answerId}"]`);
      option.checked = true;
      option.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const finalCheck = container.querySelector('[data-testid="knowledge-check-form"]');
    finalCheck.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(count.textContent).toBe("64/64");
    expect(courseCompletion.hidden).toBe(false);
    expect(courseCompletion.textContent).toContain("Course complete");

    finalCheck.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(count.textContent).toBe("64/64");
    app.destroy();

    const restoredApp = createApp(container);
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("64/64");
    expect(container.querySelector('[data-testid="course-completion"]').hidden).toBe(false);
    container.querySelector('[data-testid="reset-progress-btn"]').click();
    expect(container.querySelector('[data-testid="progress-count"]').textContent).toBe("0/64");
    expect(container.querySelector('[data-testid="course-completion"]').hidden).toBe(true);
    restoredApp.destroy();
  });
});
