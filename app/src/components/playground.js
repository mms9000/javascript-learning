/**
 * components/playground.js — Interactive JavaScript Playground component.
 *
 * Implements the playground UI complying with feature-spec-playground.md:
 * - CodeMirror editor integration with accessible labeling
 * - Real, isolated JavaScript execution via Web Worker runner (runner.js)
 * - Accessible Run & Reset controls
 * - Execution state management (ready, running, completed, failed, terminated, unavailable)
 * - Safe console output panel rendering learner text exclusively as text nodes (no innerHTML)
 * - Watchdog timeout and hard termination
 * - Keyboard shortcuts (Mod-Enter to run)
 */

import { createEditor } from "./editor.js";
import { createRunner } from "../runner.js";
import { createAsyncRunner } from "../async-runner.js";
import { createDomRunner } from "../dom-runner.js";
import { createDomPreview } from "./dom-preview.js";
import { createKnowledgeCheck } from "./knowledge-check.js";

/**
 * Playground execution states conforming to feature-spec-playground.md §5.
 * @readonly
 * @enum {string}
 */
export const PlaygroundState = {
  READY: "ready",
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
  TERMINATED: "terminated",
  UNAVAILABLE: "unavailable",
};

/**
 * Mounts the interactive playground into the target container.
 *
 * @param {HTMLElement} container - The DOM element to render into.
 * @param {Object} [options={}]
 * @param {string} [options.starterCode] - Initial starter code.
 * @param {Function} [options.onRun] - Optional custom execution handler override.
 * @param {Function} [options.onReset] - Optional callback after reset.
 * @param {Object} [options.runner] - Optional custom runner instance.
 * @param {number} [options.timeoutMs=5000] - Execution timeout in ms.
 * @returns {Object} Playground API handle.
 */
export function createPlayground(container, options = {}) {
  if (!container) {
    throw new Error("createPlayground: container element is required");
  }

  let currentStarterCode = options.starterCode ?? '// Click "Run" to test your code\nconsole.log("Hello, world!");\n';
  let currentNextLesson = options.nextLesson ?? null;
  let currentExercise = options.exercise ?? null;
  let currentComprehensionCheck = options.comprehensionCheck ?? null;
  let currentState = PlaygroundState.READY;
  let outputEntries = [];
  let currentErrorMessage = null;
  let lastValidationResult = null;
  let hintsExpanded = false;
  let hintTier = 0;
  let knowledgeCheck = null;
  let supplementalKnowledgeCheck = null;
  let exercisePassed = false;
  let comprehensionPassed = false;
  let completionNotified = false;

  container.innerHTML = `
    <div class="playground-wrapper" data-testid="playground">
      <div class="playground-header">
        <div class="playground-title-group">
          <h3 class="playground-heading" id="playground-heading">Interactive Playground</h3>
          <span
            class="status-badge status-ready"
            data-testid="status-badge"
            role="status"
            aria-live="polite"
          >Ready</span>
          <span class="execution-mode" data-testid="execution-mode" role="note"></span>
        </div>
        <div class="playground-toolbar" role="toolbar" aria-label="Playground Actions">
          <button
            type="button"
            class="btn btn-primary btn-run"
            data-testid="run-btn"
            aria-label="Run code (Ctrl+Enter)"
            title="Run code (Ctrl+Enter)"
          >
            <span class="btn-icon" aria-hidden="true">&#9658;</span>
            <span class="btn-text">Run</span>
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-reset"
            data-testid="reset-btn"
            aria-label="Reset code to starter example"
            title="Reset code to starter example"
          >
            <span class="btn-icon" aria-hidden="true">&#8635;</span>
            <span class="btn-text">Reset</span>
          </button>
        </div>
      </div>

      <div class="exercise-panel-mount" data-testid="exercise-panel-mount"></div>

      <div
        class="editor-container"
        data-testid="editor-container"
        role="region"
        aria-labelledby="playground-heading"
      ></div>

      <section
        class="dom-preview-panel"
        data-testid="dom-preview-panel"
        aria-label="Controlled DOM preview"
        hidden
      >
        <h4>Controlled DOM preview</h4>
        <p>This is a bounded simulation, not your browser page or the platform interface.</p>
        <div class="dom-preview-content" data-testid="dom-preview-content"></div>
      </section>

      <div
        class="output-panel"
        data-testid="output-panel"
        role="region"
        aria-label="Console Output"
      >
        <div class="output-header">
          <span class="output-title">Console Output</span>
          <button
            type="button"
            class="btn-clear"
            data-testid="clear-output-btn"
            aria-label="Clear console output"
            title="Clear console output"
          >Clear</button>
        </div>
        <div
          class="output-body"
          data-testid="output-body"
          role="log"
          aria-live="polite"
          aria-atomic="false"
        ></div>
      </div>
    </div>
  `;

  const statusBadge = container.querySelector('[data-testid="status-badge"]');
  const runBtn = container.querySelector('[data-testid="run-btn"]');
  const resetBtn = container.querySelector('[data-testid="reset-btn"]');
  const clearBtn = container.querySelector('[data-testid="clear-output-btn"]');
  const editorContainer = container.querySelector('[data-testid="editor-container"]');
  const domPreviewPanel = container.querySelector('[data-testid="dom-preview-panel"]');
  const domPreviewContent = container.querySelector('[data-testid="dom-preview-content"]');
  const outputBody = container.querySelector('[data-testid="output-body"]');
  const exercisePanelMount = container.querySelector('[data-testid="exercise-panel-mount"]');
  const outputPanel = container.querySelector('[data-testid="output-panel"]');
  const executionModeIndicator = container.querySelector('[data-testid="execution-mode"]');
  const domPreview = createDomPreview(domPreviewContent, (event) => {
    domRunner?.interact(event);
  });

  const asyncRunner = options.asyncRunner || createAsyncRunner({
    timeoutMs: options.timeoutMs ?? 5000,
    onOutput: (entry) => {
      entry.args.forEach((arg) => {
        outputEntries.push({ type: entry.kind || "log", text: arg });
      });
      renderOutput();
    },
    onDone: (res) => {
      if (res.status === "success") {
        setState(PlaygroundState.COMPLETED);
      } else if (res.status === "terminated") {
        setState(PlaygroundState.TERMINATED, res.error?.message || "Execution exceeded time limit.");
      } else {
        setState(PlaygroundState.FAILED, res.error ? `${res.error.name}: ${res.error.message}` : "Execution failed.");
      }
      executeValidation(res);
    },
    onTerminated: (info) => {
      setState(PlaygroundState.TERMINATED, info.message);
    },
  });

  function getExecutionMode() {
    return currentExercise?.executionMode || "worker";
  }

  function updateExecutionMode() {
    const mode = getExecutionMode();
    const isKnowledgeCheck = mode === "knowledge-check";
    editorContainer.hidden = isKnowledgeCheck;
    runBtn.hidden = isKnowledgeCheck;
    resetBtn.hidden = isKnowledgeCheck;
    outputPanel.hidden = isKnowledgeCheck;
    domPreviewPanel.hidden = mode !== "dom";
    executionModeIndicator.textContent = mode === "dom"
      ? "Worker-backed controlled DOM simulation"
      : mode === "knowledge-check"
        ? "Knowledge check — no code executes"
        : mode === "async-worker"
          ? "Async JavaScript Worker — bounded timers and approved API"
        : "JavaScript Worker";
  }

  // Initialize CodeMirror editor
  const initialEditorCode = currentExercise?.starterCode ?? currentStarterCode;
  const editor = createEditor(editorContainer, {
    initialCode: initialEditorCode,
    ariaLabel: "JavaScript code editor for lesson example",
    onRun: () => triggerRun(),
  });

  const domRunner = options.domRunner || createDomRunner({
    timeoutMs: options.timeoutMs,
    onSnapshot: (snapshot) => domPreview.render(snapshot),
    onOutput: (entry) => {
      outputEntries.push({ type: entry.kind || "log", text: entry.text });
      renderOutput();
    },
    onLimit: (message) => {
      outputEntries.push({ type: "warn", text: message });
      renderOutput();
    },
    onDone: (result) => {
      if (result.status === "success") {
        setState(PlaygroundState.COMPLETED);
      } else if (result.status === "terminated") {
        setState(PlaygroundState.TERMINATED, result.error?.message || "Execution exceeded time limit.");
      } else {
        setState(PlaygroundState.FAILED,
          result.error ? `${result.error.name}: ${result.error.message}` : "Execution failed.");
      }
      executeValidation(result);
    },
  });

  // Render exercise panel if an exercise is configured
  renderExercisePanel();

  // Initialize execution runner
  const runner = options.runner || createRunner({
    timeoutMs: options.timeoutMs ?? 5000,
    onOutput: (entry) => {
      entry.args.forEach((arg) => {
        outputEntries.push({ type: entry.kind || "log", text: arg });
      });
      renderOutput();
    },
    onDone: (res) => {
      if (res.status === "success") {
        setState(PlaygroundState.COMPLETED);
      } else if (res.status === "terminated") {
        setState(PlaygroundState.TERMINATED, res.error?.message || "Execution exceeded time limit.");
      } else {
        setState(PlaygroundState.FAILED, res.error ? `${res.error.name}: ${res.error.message}` : "Execution failed.");
      }

      // Automated exercise validation against actual execution results
      executeValidation(res);
    },
    onTerminated: (info) => {
      setState(PlaygroundState.TERMINATED, info.message);
    },
  });

  // Render the initial output view
  renderOutput();

  function renderExercisePanel() {
    knowledgeCheck?.destroy();
    knowledgeCheck = null;
    supplementalKnowledgeCheck?.destroy();
    supplementalKnowledgeCheck = null;
    exercisePassed = false;
    comprehensionPassed = false;
    completionNotified = false;
    updateExecutionMode();
    if (!currentExercise) {
      exercisePanelMount.replaceChildren();
      return;
    }

    hintsExpanded = false;
    hintTier = 0;
    const hints = Array.isArray(currentExercise.hints) ? currentExercise.hints : [];

    exercisePanelMount.innerHTML = `
      <div class="exercise-panel" data-testid="exercise-panel" role="region" aria-label="Interactive Exercise">
        <div class="exercise-header">
          <span class="exercise-badge">Exercise</span>
          <h4 class="exercise-title" data-testid="exercise-title">${currentExercise.title || "Lesson Exercise"}</h4>
        </div>
        <p class="exercise-prompt" data-testid="exercise-prompt">${currentExercise.prompt || ""}</p>
        ${getExecutionMode() === "knowledge-check"
          ? '<div class="knowledge-check-mount" data-testid="knowledge-check-mount"></div>'
          : `<div class="exercise-target">
              <span class="target-label">Expected Output:</span>
              <code class="target-code" data-testid="expected-output">${currentExercise.expectedOutput || ""}</code>
            </div>`}
        ${currentComprehensionCheck ? `
          <section class="comprehension-check-panel" aria-labelledby="comprehension-check-title">
            <h4 id="comprehension-check-title" data-testid="comprehension-check-title">
              ${currentComprehensionCheck.title || "Comprehension Check"}
            </h4>
            <p>${currentComprehensionCheck.prompt || ""}</p>
            <div class="comprehension-check-mount" data-testid="comprehension-check-mount"></div>
          </section>
          <p
            class="assessment-completion-status"
            data-testid="assessment-completion-status"
            role="status"
            aria-live="polite"
          >Complete both the coding exercise and comprehension check to finish this lesson.</p>
        ` : ""}
        ${hints.length > 0 ? `
          <div class="exercise-hints-wrapper">
            <button
              type="button"
              class="btn-hint-toggle"
              data-testid="hint-toggle-btn"
              aria-expanded="false"
              aria-controls="exercise-hints-content"
            >
              <span class="hint-icon" aria-hidden="true">&#128161;</span>
              <span class="hint-toggle-text" data-testid="hint-toggle-text">Need a hint? (1/${hints.length})</span>
            </button>
            <div
              id="exercise-hints-content"
              class="exercise-hints-content"
              data-testid="exercise-hints-content"
              hidden
            >
              <div class="hints-list" data-testid="hints-list"></div>
              <div class="hints-actions">
                <button type="button" class="btn-hint-action btn-next-hint" data-testid="next-hint-btn">Next Hint</button>
                <button type="button" class="btn-hint-action btn-collapse-hint" data-testid="collapse-hint-btn">Hide Hints</button>
              </div>
            </div>
          </div>
        ` : ""}
        <div
          class="exercise-feedback feedback-neutral"
          data-testid="exercise-feedback"
          role="status"
          aria-live="polite"
        >
          <span class="feedback-icon" aria-hidden="true">&#9432;</span>
          <span class="feedback-text">Modify the code and click Run to test your solution.</span>
        </div>
      </div>
    `;

    bindExerciseEventListeners();
    if (getExecutionMode() === "knowledge-check") {
      const knowledgeMount = exercisePanelMount.querySelector('[data-testid="knowledge-check-mount"]');
      knowledgeCheck = createKnowledgeCheck(knowledgeMount, currentExercise, {
        onResult: (result) => {
          lastValidationResult = result;
          updateExerciseFeedback(result);
          recordAssessmentResult("exercise", result);
        },
      });
    }

    if (currentComprehensionCheck) {
      const comprehensionMount = exercisePanelMount.querySelector(
        '[data-testid="comprehension-check-mount"]'
      );
      supplementalKnowledgeCheck = createKnowledgeCheck(comprehensionMount, currentComprehensionCheck, {
        onResult: (result) => recordAssessmentResult("comprehension", result),
      });
    }
  }

  function recordAssessmentResult(assessment, result) {
    if (!result?.passed) return;
    if (assessment === "comprehension") {
      comprehensionPassed = true;
    } else {
      exercisePassed = true;
    }

    const bothPassed = currentComprehensionCheck
      ? exercisePassed && comprehensionPassed
      : exercisePassed;
    const status = exercisePanelMount.querySelector('[data-testid="assessment-completion-status"]');
    if (status) {
      if (bothPassed) {
        status.textContent = "Both assessments passed. Lesson complete.";
      } else {
        status.textContent = assessment === "comprehension"
          ? "Comprehension check passed. Complete the coding exercise to finish this lesson."
          : "Coding exercise passed. Complete the comprehension check to finish this lesson.";
      }
    }

    if (bothPassed && !completionNotified) {
      completionNotified = true;
      options.onExerciseSuccess?.(currentExercise, result);
    }
  }

  function bindExerciseEventListeners() {
    const hintToggleBtn = exercisePanelMount.querySelector('[data-testid="hint-toggle-btn"]');
    const hintsContent = exercisePanelMount.querySelector('[data-testid="exercise-hints-content"]');
    const hintsList = exercisePanelMount.querySelector('[data-testid="hints-list"]');
    const nextHintBtn = exercisePanelMount.querySelector('[data-testid="next-hint-btn"]');
    const collapseHintBtn = exercisePanelMount.querySelector('[data-testid="collapse-hint-btn"]');

    if (!hintToggleBtn || !hintsContent) return;

    const hints = currentExercise?.hints || [];

    function updateHintsUI() {
      hintToggleBtn.setAttribute("aria-expanded", String(hintsExpanded));
      const toggleText = hintToggleBtn.querySelector('[data-testid="hint-toggle-text"]');

      if (hintsExpanded) {
        hintsContent.removeAttribute("hidden");
        if (toggleText) toggleText.textContent = "Hide hints";

        hintsList.replaceChildren();
        for (let i = 0; i < hintTier; i++) {
          const card = document.createElement("div");
          card.className = "hint-card";
          card.setAttribute("data-testid", `hint-card-${i + 1}`);

          const badge = document.createElement("span");
          badge.className = "hint-badge";
          badge.textContent = `Hint ${i + 1} of ${hints.length}:`;

          const body = document.createElement("span");
          body.className = "hint-body";
          body.textContent = hints[i];

          card.appendChild(badge);
          card.appendChild(document.createTextNode(" "));
          card.appendChild(body);
          hintsList.appendChild(card);
        }

        if (nextHintBtn) {
          if (hintTier < hints.length) {
            nextHintBtn.hidden = false;
            nextHintBtn.textContent = `Next Hint (${hintTier + 1}/${hints.length})`;
          } else {
            nextHintBtn.hidden = true;
          }
        }
      } else {
        hintsContent.setAttribute("hidden", "");
        if (toggleText) {
          if (hintTier === 0) {
            toggleText.textContent = `Need a hint? (1/${hints.length})`;
          } else {
            toggleText.textContent = `Show hints (${hintTier}/${hints.length})`;
          }
        }
      }
    }

    hintToggleBtn.addEventListener("click", () => {
      hintsExpanded = !hintsExpanded;
      if (hintsExpanded && hintTier === 0) {
        hintTier = 1;
      }
      updateHintsUI();
    });

    if (nextHintBtn) {
      nextHintBtn.addEventListener("click", () => {
        if (hintTier < hints.length) {
          hintTier++;
          updateHintsUI();
        }
      });
    }

    if (collapseHintBtn) {
      collapseHintBtn.addEventListener("click", () => {
        hintsExpanded = false;
        updateHintsUI();
      });
    }
  }

  function updateExerciseFeedback(validation) {
    const feedbackEl = exercisePanelMount.querySelector('[data-testid="exercise-feedback"]');
    if (!feedbackEl || !validation) return;

    feedbackEl.className = "exercise-feedback";
    feedbackEl.replaceChildren();

    const icon = document.createElement("span");
    icon.className = "feedback-icon";
    icon.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.className = "feedback-text";
    text.textContent = validation.message;

    if (validation.passed) {
      feedbackEl.classList.add("feedback-success");
      icon.innerHTML = "&#10004;";

      const celebration = document.createElement("span");
      celebration.className = "celebration-badge";
      celebration.setAttribute("data-testid", "celebration-badge");
      celebration.textContent = currentComprehensionCheck
        ? "Coding exercise complete."
        : "Exercise Complete! \u{1F389}";

      feedbackEl.appendChild(icon);
      feedbackEl.appendChild(text);

      const actions = document.createElement("div");
      actions.className = "exercise-feedback-actions";
      actions.appendChild(celebration);

      if (currentNextLesson && typeof options.onNextLesson === "function") {
        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "btn-next-lesson-link";
        nextBtn.setAttribute("data-testid", "exercise-next-lesson-btn");
        nextBtn.setAttribute("aria-label", `Proceed to next lesson: ${currentNextLesson.title}`);
        nextBtn.textContent = `Next Lesson: ${currentNextLesson.title} \u2192`;
        nextBtn.addEventListener("click", () => {
          options.onNextLesson(currentNextLesson.lessonId);
        });
        actions.appendChild(nextBtn);
      }

      feedbackEl.appendChild(actions);
    } else {
      feedbackEl.classList.add("feedback-fail");
      icon.innerHTML = "&#9888;";

      feedbackEl.appendChild(icon);
      feedbackEl.appendChild(text);
    }
  }

  function resetExerciseUI() {
    hintsExpanded = false;
    hintTier = 0;
    lastValidationResult = null;

    const hintToggleBtn = exercisePanelMount.querySelector('[data-testid="hint-toggle-btn"]');
    const hintsContent = exercisePanelMount.querySelector('[data-testid="exercise-hints-content"]');
    const hintsList = exercisePanelMount.querySelector('[data-testid="hints-list"]');
    const toggleText = exercisePanelMount.querySelector('[data-testid="hint-toggle-text"]');

    if (hintToggleBtn) hintToggleBtn.setAttribute("aria-expanded", "false");
    if (hintsContent) hintsContent.setAttribute("hidden", "");
    if (hintsList) hintsList.replaceChildren();

    const hints = currentExercise?.hints || [];
    if (toggleText) toggleText.textContent = `Need a hint? (1/${hints.length})`;

    const feedbackEl = exercisePanelMount.querySelector('[data-testid="exercise-feedback"]');
    if (feedbackEl) {
      feedbackEl.className = "exercise-feedback feedback-neutral";
      feedbackEl.replaceChildren();

      const icon = document.createElement("span");
      icon.className = "feedback-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = "&#9432;";

      const text = document.createElement("span");
      text.className = "feedback-text";
      text.textContent = "Modify the code and click Run to test your solution.";

      feedbackEl.appendChild(icon);
      feedbackEl.appendChild(text);
    }
  }

  function executeValidation(runResult) {
    if (!currentExercise || typeof currentExercise.validate !== "function") return null;

    const validation = currentExercise.validate(outputEntries, runResult);
    lastValidationResult = validation;
    updateExerciseFeedback(validation);

    recordAssessmentResult("exercise", validation);

    return validation;
  }

  function updateStatusBadge() {
    statusBadge.className = `status-badge status-${currentState}`;
    switch (currentState) {
      case PlaygroundState.READY:
        statusBadge.textContent = "Ready";
        runBtn.disabled = false;
        break;
      case PlaygroundState.RUNNING:
        statusBadge.textContent = "Running...";
        runBtn.disabled = true;
        break;
      case PlaygroundState.COMPLETED:
        statusBadge.textContent = "Completed";
        runBtn.disabled = false;
        break;
      case PlaygroundState.FAILED:
        statusBadge.textContent = "Error";
        runBtn.disabled = false;
        break;
      case PlaygroundState.TERMINATED:
        statusBadge.textContent = "Terminated";
        runBtn.disabled = false;
        break;
      case PlaygroundState.UNAVAILABLE:
        statusBadge.textContent = "Unavailable";
        runBtn.disabled = true;
        break;
    }
  }

  /**
   * Safely renders the console output body.
   * STRICT SECURITY REQUIREMENT:
   * Learner output MUST be appended as text nodes. innerHTML is strictly forbidden for learner output.
   */
  function renderOutput() {
    outputBody.replaceChildren();

    if (currentState === PlaygroundState.UNAVAILABLE) {
      const notice = document.createElement("div");
      notice.className = "output-notice notice-unavailable";
      notice.textContent = "The code execution environment is currently unavailable. You can still read the lesson and view code examples.";
      outputBody.appendChild(notice);
      return;
    }

    if (currentState === PlaygroundState.RUNNING) {
      const runningNotice = document.createElement("div");
      runningNotice.className = "output-notice notice-running";
      runningNotice.textContent = "Running code...";
      outputBody.appendChild(runningNotice);
      return;
    }

    if (currentState === PlaygroundState.TERMINATED) {
      const termNotice = document.createElement("div");
      termNotice.className = "output-notice notice-terminated";
      termNotice.textContent = currentErrorMessage || "Execution was terminated because it exceeded the time limit.";
      outputBody.appendChild(termNotice);
      return;
    }

    if (currentState === PlaygroundState.FAILED) {
      const errorBox = document.createElement("div");
      errorBox.className = "output-notice notice-error";
      const errorTitle = document.createElement("strong");
      errorTitle.textContent = "Execution Error: ";
      errorBox.appendChild(errorTitle);
      errorBox.appendChild(document.createTextNode(currentErrorMessage || "An error occurred during execution."));
      outputBody.appendChild(errorBox);
    }

    if (outputEntries.length === 0) {
      const emptyNotice = document.createElement("div");
      emptyNotice.className = "output-placeholder";
      if (currentState === PlaygroundState.COMPLETED) {
        emptyNotice.textContent = "Program completed with no output.";
      } else {
        emptyNotice.textContent = 'No output yet. Click "Run" to execute your code.';
      }
      outputBody.appendChild(emptyNotice);
      return;
    }

    // Render output entries safely using document.createTextNode
    const list = document.createElement("div");
    list.className = "output-entries";

    outputEntries.forEach((entry, index) => {
      const row = document.createElement("div");
      row.className = `output-row output-row-${entry.type || "log"}`;

      const lineNo = document.createElement("span");
      lineNo.className = "output-lineno";
      lineNo.textContent = `[${index + 1}]`;

      const content = document.createElement("span");
      content.className = "output-text";
      content.appendChild(document.createTextNode(String(entry.text)));

      row.appendChild(lineNo);
      row.appendChild(content);
      list.appendChild(row);
    });

    outputBody.appendChild(list);
  }

  function triggerRun() {
    if (getExecutionMode() === "knowledge-check") return;
    if (currentState === PlaygroundState.UNAVAILABLE || currentState === PlaygroundState.RUNNING) {
      return;
    }

    if (typeof options.onRun === "function") {
      options.onRun(editor.getValue(), api);
      return;
    }

    setState(PlaygroundState.RUNNING);
    outputEntries = [];
    currentErrorMessage = null;
    renderOutput();

    const code = editor.getValue();
    if (getExecutionMode() === "dom") {
      domPreview.clear();
      domRunner.run(code, currentExercise?.fixtureId);
    } else if (getExecutionMode() === "async-worker") {
      asyncRunner.run(code);
    } else {
      runner.run(code);
    }
  }

  function terminateCurrentExecution(reason = "manual") {
    if (currentState !== PlaygroundState.RUNNING) return;
    if (getExecutionMode() === "dom") {
      domRunner.reset();
    } else if (getExecutionMode() === "async-worker") {
      asyncRunner.terminate(reason);
    } else {
      runner.terminate();
    }
  }

  function setState(newState, message = null) {
    currentState = newState;
    currentErrorMessage = message;
    updateStatusBadge();
    renderOutput();
  }

  function setOutput(entries) {
    outputEntries = Array.isArray(entries) ? entries : [{ type: "log", text: String(entries) }];
    renderOutput();
  }

  function clearOutput() {
    outputEntries = [];
    currentErrorMessage = null;
    renderOutput();
  }

  function resetCode() {
    terminateCurrentExecution();
    domRunner.reset();
    domPreview.clear();
    const initial = currentExercise?.starterCode ?? currentStarterCode;
    editor.reset(initial);
    clearOutput();
    setState(PlaygroundState.READY);
    if (currentExercise) {
      resetExerciseUI();
    }
    knowledgeCheck?.reset();
    supplementalKnowledgeCheck?.reset();
    if (typeof options.onReset === "function") {
      options.onReset();
    }
  }

  // Event Listeners
  runBtn.addEventListener("click", () => triggerRun());
  resetBtn.addEventListener("click", () => resetCode());
  clearBtn.addEventListener("click", () => clearOutput());

  const api = {
    getEditor: () => editor,
    getRunner: () => runner,
    getAsyncRunner: () => asyncRunner,
    getDomRunner: () => domRunner,
    getDomPreview: () => domPreview,
    getState: () => currentState,
    setState,
    getOutput: () => [...outputEntries],
    setOutput,
    clearOutput,
    resetCode,
    run: () => triggerRun(),
    getExercise: () => currentExercise,
    setNextLesson: (nextLesson) => {
      currentNextLesson = nextLesson;
    },
    setExercise: (exercise, fallbackStarter = null, comprehensionCheck = null) => {
      terminateCurrentExecution("lesson-switch");
      currentExercise = exercise;
      currentComprehensionCheck = comprehensionCheck;
      if (fallbackStarter !== null) {
        currentStarterCode = fallbackStarter;
      }
      renderExercisePanel();
      resetCode();
    },
    getExerciseValidation: () => lastValidationResult,
    validateExercise: (res) => executeValidation(res),
    destroy: () => {
      runner.destroy();
      asyncRunner.destroy();
      domRunner.destroy();
      domPreview.destroy();
      knowledgeCheck?.destroy();
      supplementalKnowledgeCheck?.destroy();
      editor.destroy();
      container.replaceChildren();
    },
  };

  return api;
}
