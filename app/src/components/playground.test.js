/**
 * components/playground.test.js — Unit tests for Playground component.
 *
 * Verifies compliance with feature-spec-playground.md:
 * - Starter code initialization
 * - Reset button restores starter code
 * - Accessible controls and labels (WCAG / FR-010)
 * - State management: ready, running, completed, failed, terminated, unavailable
 * - Output security: learner text rendered as text nodes, never HTML (FR-011 / §7)
 * - Clear output functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createPlayground, PlaygroundState } from "./playground.js";

describe("createPlayground()", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("throws when container is missing", () => {
    expect(() => createPlayground(null)).toThrow("createPlayground: container element is required");
  });

  it("renders editor with starter code and ready status badge", () => {
    const starter = 'console.log("Hello, world!");';
    const playground = createPlayground(container, { starterCode: starter });

    expect(playground.getState()).toBe(PlaygroundState.READY);
    expect(playground.getEditor().getValue()).toBe(starter);

    const badge = container.querySelector('[data-testid="status-badge"]');
    expect(badge.textContent).toBe("Ready");

    playground.destroy();
  });

  it("renders accessible Run and Reset buttons with proper ARIA attributes", () => {
    const playground = createPlayground(container, {});

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    const resetBtn = container.querySelector('[data-testid="reset-btn"]');

    expect(runBtn).not.toBeNull();
    expect(runBtn.getAttribute("aria-label")).toContain("Run code");

    expect(resetBtn).not.toBeNull();
    expect(resetBtn.getAttribute("aria-label")).toContain("Reset code");

    const outputRegion = container.querySelector('[data-testid="output-panel"]');
    expect(outputRegion.getAttribute("role")).toBe("region");
    expect(outputRegion.getAttribute("aria-label")).toBe("Console Output");

    playground.destroy();
  });

  it("restores starter code when Reset button is clicked", () => {
    const starter = 'console.log("Initial code");';
    const playground = createPlayground(container, { starterCode: starter });

    playground.getEditor().setValue('console.log("Changed code");');
    expect(playground.getEditor().getValue()).toBe('console.log("Changed code");');

    const resetBtn = container.querySelector('[data-testid="reset-btn"]');
    resetBtn.click();

    expect(playground.getEditor().getValue()).toBe(starter);
    expect(playground.getState()).toBe(PlaygroundState.READY);

    playground.destroy();
  });

  it("updates status badge and controls according to state transitions", () => {
    const playground = createPlayground(container, {});
    const badge = container.querySelector('[data-testid="status-badge"]');
    const runBtn = container.querySelector('[data-testid="run-btn"]');

    playground.setState(PlaygroundState.RUNNING);
    expect(badge.textContent).toBe("Running...");
    expect(runBtn.disabled).toBe(true);

    playground.setState(PlaygroundState.COMPLETED);
    expect(badge.textContent).toBe("Completed");
    expect(runBtn.disabled).toBe(false);

    playground.setState(PlaygroundState.FAILED, "SyntaxError: Unexpected token");
    expect(badge.textContent).toBe("Error");
    expect(container.textContent).toContain("SyntaxError: Unexpected token");

    playground.setState(PlaygroundState.UNAVAILABLE);
    expect(badge.textContent).toBe("Unavailable");
    expect(runBtn.disabled).toBe(true);
    expect(container.textContent).toContain("unavailable");

    playground.destroy();
  });

  it("renders output safely as text nodes and does not interpret HTML tags", () => {
    const playground = createPlayground(container, {});

    const maliciousOutput = "<script>alert('xss')</script><b>Bold Text</b>";
    playground.setOutput([{ type: "log", text: maliciousOutput }]);

    const outputBody = container.querySelector('[data-testid="output-body"]');
    expect(outputBody.innerHTML).not.toContain("<script>");
    expect(outputBody.querySelector("script")).toBeNull();
    expect(outputBody.querySelector("b")).toBeNull();
    expect(outputBody.textContent).toContain("<script>alert('xss')</script><b>Bold Text</b>");

    playground.destroy();
  });

  it("displays empty output message when completed with no output (Scenario C)", () => {
    const playground = createPlayground(container, {});
    playground.setState(PlaygroundState.COMPLETED);

    const outputBody = container.querySelector('[data-testid="output-body"]');
    expect(outputBody.textContent).toContain("Program completed with no output.");

    playground.destroy();
  });

  it("clears output when Clear button is clicked", () => {
    const playground = createPlayground(container, {});
    playground.setOutput([{ type: "log", text: "Line 1" }, { type: "log", text: "Line 2" }]);

    expect(container.textContent).toContain("Line 1");
    const clearBtn = container.querySelector('[data-testid="clear-output-btn"]');
    clearBtn.click();

    expect(container.textContent).not.toContain("Line 1");
    expect(playground.getOutput()).toEqual([]);

    playground.destroy();
  });

  it("calls custom onRun handler when provided and Run button is clicked", () => {
    const onRun = vi.fn();
    const playground = createPlayground(container, {
      starterCode: 'console.log("Run test");',
      onRun,
    });

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    expect(onRun).toHaveBeenCalledWith('console.log("Run test");', playground);

    playground.destroy();
  });

  it("executes code in isolated runner and displays live output", async () => {
    const starter = 'console.log("Hello, world!");';
    const playground = createPlayground(container, { starterCode: starter });

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    const badge = container.querySelector('[data-testid="status-badge"]');
    expect(badge.textContent).toBe("Running...");

    await vi.waitFor(() => {
      expect(playground.getState()).toBe(PlaygroundState.COMPLETED);
    });

    const outputBody = container.querySelector('[data-testid="output-body"]');
    expect(outputBody.textContent).toContain("Hello, world!");
    expect(badge.textContent).toBe("Completed");

    // Modify code and verify modified code executes
    playground.getEditor().setValue("console.log(7 * 6);");
    runBtn.click();

    await vi.waitFor(() => {
      expect(playground.getState()).toBe(PlaygroundState.COMPLETED);
    });

    expect(outputBody.textContent).toContain("42");

    // Reset restores starter code
    const resetBtn = container.querySelector('[data-testid="reset-btn"]');
    resetBtn.click();

    expect(playground.getEditor().getValue()).toBe(starter);
    expect(playground.getState()).toBe(PlaygroundState.READY);

    playground.destroy();
  });

  it("handles execution errors cleanly in the playground UI", async () => {
    const playground = createPlayground(container, { starterCode: "null.property;" });

    const runBtn = container.querySelector('[data-testid="run-btn"]');
    runBtn.click();

    await vi.waitFor(() => {
      expect(playground.getState()).toBe(PlaygroundState.FAILED);
    });

    const badge = container.querySelector('[data-testid="status-badge"]');
    expect(badge.textContent).toBe("Error");

    const outputBody = container.querySelector('[data-testid="output-body"]');
    expect(outputBody.textContent).toContain("TypeError");

    playground.destroy();
  });

  describe("Interactive Exercise Integration", () => {
    const mockExercise = {
      id: "test-ex1",
      title: "Exercise: Your First Output",
      prompt: 'Modify the code to print "Hello, JavaScript!" to the console.',
      expectedOutput: "Hello, JavaScript!",
      starterCode: 'console.log("Hello, world!");\n',
      hints: [
        'Hint 1: Replace "Hello, world!" with "Hello, JavaScript!".',
        'Hint 2: console.log("Hello, JavaScript!");',
      ],
      validate: (outputs, result) => {
        if (result?.status !== "success") {
          return { passed: false, status: "error", message: "Execution error" };
        }
        if (!outputs || outputs.length === 0) {
          return { passed: false, status: "mismatch", message: "No output" };
        }
        if (outputs.length > 1) {
          return { passed: false, status: "mismatch", message: "Multiple lines" };
        }
        const text = outputs[0].text.replace(/[\r\n]+$/, "");
        if (text === "Hello, JavaScript!") {
          return { passed: true, status: "success", message: "Success!" };
        }
        return { passed: false, status: "mismatch", message: `Output mismatch: got ${text}` };
      },
    };

    it("renders exercise panel with title, prompt, expected output, and hint toggle", () => {
      const playground = createPlayground(container, { exercise: mockExercise });

      const panel = container.querySelector('[data-testid="exercise-panel"]');
      expect(panel).not.toBeNull();

      const title = container.querySelector('[data-testid="exercise-title"]');
      expect(title.textContent).toBe(mockExercise.title);

      const prompt = container.querySelector('[data-testid="exercise-prompt"]');
      expect(prompt.textContent).toBe(mockExercise.prompt);

      const expected = container.querySelector('[data-testid="expected-output"]');
      expect(expected.textContent).toBe("Hello, JavaScript!");

      const hintToggleBtn = container.querySelector('[data-testid="hint-toggle-btn"]');
      expect(hintToggleBtn).not.toBeNull();
      expect(hintToggleBtn.getAttribute("aria-expanded")).toBe("false");

      const feedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(feedback.textContent).toContain("Modify the code and click Run");

      playground.destroy();
    });

    it("progressively expands and collapses hints via accessible keyboard-operable controls", () => {
      const playground = createPlayground(container, { exercise: mockExercise });

      const hintToggleBtn = container.querySelector('[data-testid="hint-toggle-btn"]');
      const hintsContent = container.querySelector('[data-testid="exercise-hints-content"]');

      expect(hintsContent.hasAttribute("hidden")).toBe(true);
      expect(hintToggleBtn.getAttribute("aria-expanded")).toBe("false");

      // Click 1: Expand to show Hint 1
      hintToggleBtn.click();
      expect(hintToggleBtn.getAttribute("aria-expanded")).toBe("true");
      expect(hintsContent.hasAttribute("hidden")).toBe(false);

      const hint1 = container.querySelector('[data-testid="hint-card-1"]');
      expect(hint1).not.toBeNull();
      expect(hint1.textContent).toContain("Hint 1");

      const nextHintBtn = container.querySelector('[data-testid="next-hint-btn"]');
      expect(nextHintBtn).not.toBeNull();
      expect(nextHintBtn.hidden).toBe(false);

      // Click 2: Click Next Hint to show Hint 2
      nextHintBtn.click();
      const hint2 = container.querySelector('[data-testid="hint-card-2"]');
      expect(hint2).not.toBeNull();
      expect(hint2.textContent).toContain("Hint 2");
      // All hints now shown -> nextHintBtn is hidden
      expect(nextHintBtn.hidden).toBe(true);

      // Click 3: Click Hide Hints button
      const collapseBtn = container.querySelector('[data-testid="collapse-hint-btn"]');
      collapseBtn.click();
      expect(hintsContent.hasAttribute("hidden")).toBe(true);
      expect(hintToggleBtn.getAttribute("aria-expanded")).toBe("false");

      // Click 4: Toggle again to re-open
      hintToggleBtn.click();
      expect(hintToggleBtn.getAttribute("aria-expanded")).toBe("true");
      expect(hintsContent.hasAttribute("hidden")).toBe(false);

      // Click 5: Toggle again to collapse
      hintToggleBtn.click();
      expect(hintsContent.hasAttribute("hidden")).toBe(true);
      expect(hintToggleBtn.getAttribute("aria-expanded")).toBe("false");

      playground.destroy();
    });

    it("evaluates execution output, displays celebration badge, and fires onExerciseSuccess", async () => {
      let successFired = false;
      let passedExercise = null;

      const playground = createPlayground(container, {
        exercise: mockExercise,
        onExerciseSuccess: (ex) => {
          successFired = true;
          passedExercise = ex;
        },
      });

      // Type correct code
      playground.getEditor().setValue('console.log("Hello, JavaScript!");');

      const runBtn = container.querySelector('[data-testid="run-btn"]');
      runBtn.click();

      await vi.waitFor(() => {
        expect(playground.getState()).toBe(PlaygroundState.COMPLETED);
      });

      const feedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(feedback.classList.contains("feedback-success")).toBe(true);
      expect(feedback.textContent).toContain("Success!");

      const celebration = container.querySelector('[data-testid="celebration-badge"]');
      expect(celebration).not.toBeNull();
      expect(celebration.textContent).toContain("Exercise Complete!");

      expect(successFired).toBe(true);
      expect(passedExercise.id).toBe("test-ex1");

      playground.destroy();
    });

    it("displays error feedback when code produces incorrect output", async () => {
      let successFired = false;

      const playground = createPlayground(container, {
        exercise: mockExercise,
        onExerciseSuccess: () => {
          successFired = true;
        },
      });

      // Starter code outputs "Hello, world!" which is incorrect
      const runBtn = container.querySelector('[data-testid="run-btn"]');
      runBtn.click();

      await vi.waitFor(() => {
        expect(playground.getState()).toBe(PlaygroundState.COMPLETED);
      });

      const feedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(feedback.classList.contains("feedback-fail")).toBe(true);
      expect(feedback.textContent).toContain("Output mismatch: got Hello, world!");

      expect(successFired).toBe(false);

      playground.destroy();
    });

    it("resets editor code, hints, and feedback without clearing persistent progress", async () => {
      const playground = createPlayground(container, {
        exercise: mockExercise,
      });

      // Expand hints and change editor text
      const hintToggleBtn = container.querySelector('[data-testid="hint-toggle-btn"]');
      hintToggleBtn.click();
      expect(hintToggleBtn.getAttribute("aria-expanded")).toBe("true");

      playground.getEditor().setValue('console.log("modified");');

      // Click Reset
      const resetBtn = container.querySelector('[data-testid="reset-btn"]');
      resetBtn.click();

      // Editor restored to exercise starter code
      expect(playground.getEditor().getValue()).toBe(mockExercise.starterCode);

      // Hints collapsed
      expect(hintToggleBtn.getAttribute("aria-expanded")).toBe("false");
      const hintsContent = container.querySelector('[data-testid="exercise-hints-content"]');
      expect(hintsContent.hasAttribute("hidden")).toBe(true);

      // Feedback reset to neutral
      const feedback = container.querySelector('[data-testid="exercise-feedback"]');
      expect(feedback.classList.contains("feedback-neutral")).toBe(true);

      playground.destroy();
    });

    it("renders celebration next lesson button when exercise passes and nextLesson is configured", async () => {
      let nextLessonNavigated = null;
      const nextLesson = { lessonId: "m1-l2", title: "Your First Program and console.log()" };

      const playground = createPlayground(container, {
        exercise: mockExercise,
        nextLesson,
        onNextLesson: (id) => {
          nextLessonNavigated = id;
        },
      });

      playground.getEditor().setValue('console.log("Hello, JavaScript!");');

      const runBtn = container.querySelector('[data-testid="run-btn"]');
      runBtn.click();

      await vi.waitFor(() => {
        expect(playground.getState()).toBe(PlaygroundState.COMPLETED);
      });

      const nextBtn = container.querySelector('[data-testid="exercise-next-lesson-btn"]');
      expect(nextBtn).not.toBeNull();
      expect(nextBtn.textContent).toContain("Your First Program and console.log()");

      nextBtn.click();
      expect(nextLessonNavigated).toBe("m1-l2");

      playground.destroy();
    });

    it("updates next lesson and switches exercise cleanly via setNextLesson and setExercise", () => {
      const playground = createPlayground(container, { exercise: mockExercise });
      expect(playground.getExercise().id).toBe("test-ex1");

      const newExercise = {
        id: "test-ex2",
        title: "Exercise 2",
        prompt: "Prompt 2",
        expectedOutput: "Output 2",
        starterCode: "// Exercise 2 starter\n",
        hints: ["Hint for Ex 2"],
        validate: () => ({ passed: true, status: "success", message: "Ex 2 passed" }),
      };

      playground.setNextLesson({ lessonId: "m1-l3", title: "Lesson 3" });
      playground.setExercise(newExercise);

      expect(playground.getExercise().id).toBe("test-ex2");
      expect(playground.getEditor().getValue()).toBe(newExercise.starterCode);

      const title = container.querySelector('[data-testid="exercise-title"]');
      expect(title.textContent).toBe("Exercise 2");

      playground.destroy();
    });
  });

  it("uses an accessible no-execution knowledge check without invoking either runner", () => {
    const runner = {
      run: vi.fn(),
      terminate: vi.fn(),
      destroy: vi.fn(),
    };
    const onExerciseSuccess = vi.fn();
    const exercise = {
      id: "m6-l5-ex1",
      title: "Match a Named Export",
      prompt: "Choose the matching import.",
      executionMode: "knowledge-check",
      starterCode: "",
      hints: ["Match the exported name."],
      questions: [{
        prompt: "Which import matches?",
        correctOptionId: "named",
        options: [
          { id: "named", label: 'import { double } from "./helpers.js";' },
          { id: "default", label: 'import double from "./helpers.js";' },
        ],
      }],
    };
    const playground = createPlayground(container, {
      exercise,
      runner,
      onExerciseSuccess,
    });

    expect(container.querySelector('[data-testid="execution-mode"]').textContent)
      .toContain("no code executes");
    expect(container.querySelector('[data-testid="editor-container"]').hidden).toBe(true);
    expect(container.querySelector('[data-testid="run-btn"]').hidden).toBe(true);
    expect(container.querySelector('[data-testid="output-panel"]').hidden).toBe(true);

    playground.run();
    expect(runner.run).not.toHaveBeenCalled();
    const answer = container.querySelector('input[value="named"]');
    answer.checked = true;
    answer.dispatchEvent(new Event("change", { bubbles: true }));
    container.querySelector('[data-testid="knowledge-check-form"]')
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(onExerciseSuccess).toHaveBeenCalledTimes(1);

    playground.resetCode();
    expect(container.querySelector('input:checked')).toBeNull();
    playground.destroy();
  });

  it("uses and cancels the async Worker for async exercises", () => {
    let playground;
    const runner = {
      run: vi.fn(),
      terminate: vi.fn(),
      destroy: vi.fn(),
    };
    const asyncRunner = {
      run: vi.fn(),
      terminate: vi.fn((reason) => playground.setState(PlaygroundState.TERMINATED, reason)),
      destroy: vi.fn(),
    };
    playground = createPlayground(container, {
      runner,
      asyncRunner,
      exercise: {
        id: "m7-l2-ex1",
        executionMode: "async-worker",
        starterCode: "await Promise.resolve();",
        validate: () => ({ passed: false, status: "mismatch", message: "Try again." }),
      },
    });

    expect(container.querySelector('[data-testid="execution-mode"]').textContent)
      .toContain("Async JavaScript Worker");
    playground.run();
    expect(asyncRunner.run).toHaveBeenCalledWith("await Promise.resolve();");
    expect(runner.run).not.toHaveBeenCalled();
    expect(playground.getState()).toBe(PlaygroundState.RUNNING);

    playground.resetCode();
    expect(asyncRunner.terminate).toHaveBeenCalledWith("manual");
    expect(playground.getState()).toBe(PlaygroundState.READY);

    playground.run();
    playground.setExercise({
      id: "m6-l5-ex1",
      executionMode: "knowledge-check",
      starterCode: "",
      questions: [
        {
          prompt: "Which import matches?",
          correctOptionId: "opt-1",
          options: [{ id: "opt-1", label: "Option 1" }],
        },
      ],
    });
    expect(asyncRunner.terminate).toHaveBeenLastCalledWith("lesson-switch");
    expect(playground.getState()).toBe(PlaygroundState.READY);

    playground.destroy();
    expect(asyncRunner.destroy).toHaveBeenCalledOnce();
  });

  it("identifies DOM exercises as a controlled simulation and keeps the editor available", () => {
    const playground = createPlayground(container, {
      exercise: {
        id: "m6-l2-ex1",
        executionMode: "dom",
        fixtureId: "m6-l2",
        starterCode: "",
        validate: () => ({ passed: false, status: "mismatch", message: "Try again." }),
      },
    });

    expect(container.querySelector('[data-testid="execution-mode"]').textContent)
      .toContain("controlled DOM simulation");
    expect(container.querySelector('[data-testid="editor-container"]').hidden).toBe(false);
    expect(container.querySelector('[data-testid="dom-preview-panel"]').hidden).toBe(false);
    expect(container.querySelector('[data-testid="run-btn"]').hidden).toBe(false);
    expect(container.querySelector('[data-testid="dom-preview-panel"]').textContent)
      .toContain("not your browser page");
    playground.destroy();
  });
});
