const STEP_DELAY_MS = 1800;
const SVG_NS = "http://www.w3.org/2000/svg";
let sceneSequence = 0;

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createConnector(className, direction, title) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("lesson-animation-connector", `lesson-animation-connector--${className}`);
  svg.setAttribute("viewBox", direction === "vertical" ? "0 0 32 42" : "0 0 42 32");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", title);
  svg.setAttribute("data-animation-connector", className);

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute(
    "d",
    direction === "vertical"
      ? "M16 3 V35 M9 28 L16 35 L23 28"
      : "M3 16 H35 M28 9 L35 16 L28 23",
  );
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.classList.add("lesson-animation-connector-path");
  svg.appendChild(path);
  return svg;
}

function createNode(name, title, description) {
  const node = createElement("div", "lesson-animation-node");
  node.dataset.animationNode = name;

  const heading = createElement("h5", "lesson-animation-node-title", title);
  const detail = createElement("p", "lesson-animation-node-description", description);
  const status = createElement("span", "lesson-animation-node-status", "Current step");
  status.hidden = true;
  node.append(heading, detail, status);
  return node;
}

function createDiagramItem(item, scene) {
  if (item.type === "connector") {
    return createConnector(item.id, item.direction, item.title);
  }

  if (item.type === "group") {
    const group = createElement("section", `lesson-animation-group lesson-animation-group--${item.layout}`);
    group.dataset.animationGroup = item.id;
    group.setAttribute("aria-label", item.title);
    const title = createElement("h4", "lesson-animation-group-title", item.title);
    const content = createElement("div", "lesson-animation-group-content");
    item.items.forEach((child) => content.appendChild(createDiagramItem(child, scene)));
    group.append(title, content);
    return group;
  }

  const node = createNode(item.id, item.title, item.description);
  node.classList.add(`lesson-animation-node--${item.type}`);

  if (item.type === "code") {
    node.classList.add("lesson-animation-language");
    const sourceLines = scene.code.split(/\r?\n/);
    if (scene.codeLineAnnotations) {
      const codePanel = createElement("div", "lesson-animation-code");
      const codeLines = createElement("ol", "lesson-animation-code-lines");
      codeLines.setAttribute("aria-label", "Source statements in order");
      sourceLines.forEach((source, index) => {
        const codeLine = createElement("li", "lesson-animation-code-line");
        codeLine.dataset.animationCodeLine = "";
        const sourceCode = createElement("code", "lesson-animation-code-source", source);
        sourceCode.dataset.animationCodeSource = "";
        const codeStatus = createElement("span", "sr-only", "Current statement");
        codeStatus.hidden = true;
        codeLine.append(sourceCode, codeStatus);
        if (scene.codeLineAnnotations[index]) {
          const annotation = createElement(
            "span",
            "lesson-animation-value-kind",
            scene.codeLineAnnotations[index],
          );
          codeLine.appendChild(annotation);
        }
        codeLines.appendChild(codeLine);
      });
      codePanel.appendChild(codeLines);
      node.appendChild(codePanel);
    } else {
      const pre = createElement("pre", "lesson-animation-code");
      const code = createElement("code");
      const codeLine = createElement("span", "lesson-animation-code-line", sourceLines[0]);
      codeLine.dataset.animationCodeLine = "";
      const codeStatus = createElement("span", "sr-only", "Current statement");
      codeStatus.hidden = true;
      codeLine.appendChild(codeStatus);
      code.appendChild(codeLine);
      pre.appendChild(code);
      node.appendChild(pre);
    }
  } else if (item.type === "output") {
    node.classList.add("lesson-animation-output");
    const outputPlaceholder = createElement(
      "p",
      "lesson-animation-output-placeholder",
      "No output yet",
    );
    outputPlaceholder.dataset.animationOutputPlaceholder = "";
    if (scene.outputLines) {
      const outputLines = createElement("ol", "lesson-animation-output-lines");
      outputLines.setAttribute("aria-label", "Output lines in execution order");
      scene.outputLines.forEach((line) => {
        const row = createElement("li", "lesson-animation-output-line");
        row.dataset.animationOutputLine = "";
        const kind = createElement(
          "span",
          "lesson-animation-value-kind",
          `${line.kind} · ${line.sourceNotation}`,
        );
        const value = createElement("code", "lesson-animation-output-value", line.text);
        row.append(kind, value);
        outputLines.appendChild(row);
      });
      node.append(outputLines, outputPlaceholder);
    } else {
      const outputValue = createElement("p", "lesson-animation-output-value", scene.output);
      outputValue.dataset.animationOutputValue = "";
      node.append(outputValue, outputPlaceholder);
    }
  }

  return node;
}

/**
 * Creates a static-first, learner-controlled explanation scene.
 * @param {HTMLElement} container
 * @param {object} scene Authored, trusted scene data from the scene registry.
 * @returns {{ destroy: () => void }}
 */
export function createLessonAnimation(container, scene) {
  if (!container) {
    throw new Error("createLessonAnimation: container element is required");
  }

  const sceneId = `lesson-animation-caption-${++sceneSequence}`;
  const figure = createElement("figure", "lesson-animation");
  figure.dataset.testid = "lesson-animation";
  figure.setAttribute("aria-labelledby", sceneId);

  const figcaption = createElement("figcaption", "lesson-animation-caption", scene.title);
  figcaption.id = sceneId;

  const description = createElement(
    "p",
    "lesson-animation-description",
    scene.description,
  );

  const flow = createElement("div", "lesson-animation-flow");
  if (scene.layout) flow.classList.add(`lesson-animation-flow--${scene.layout}`);
  flow.setAttribute("role", "group");
  flow.setAttribute("aria-label", "Relationship between the language and browser host");
  scene.diagram.forEach((item) => flow.appendChild(createDiagramItem(item, scene)));

  const caption = createElement("p", "lesson-animation-step-caption");
  caption.dataset.testid = "lesson-animation-step-caption";
  const controls = createElement("div", "lesson-animation-controls");
  controls.setAttribute("aria-label", "Animation controls");
  const playButton = createElement("button", "lesson-animation-control", "Play");
  playButton.type = "button";
  playButton.setAttribute("aria-label", "Play animation");
  const pauseButton = createElement("button", "lesson-animation-control", "Pause");
  pauseButton.type = "button";
  pauseButton.setAttribute("aria-label", "Pause animation");
  const replayButton = createElement("button", "lesson-animation-control", "Replay");
  replayButton.type = "button";
  replayButton.setAttribute("aria-label", "Replay animation");
  const nextButton = createElement("button", "lesson-animation-control", "Next step");
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Show next animation step");
  const restartButton = createElement("button", "lesson-animation-control", "Start over");
  restartButton.type = "button";
  restartButton.setAttribute("aria-label", "Return to the first animation step");
  controls.append(playButton, pauseButton, replayButton, nextButton, restartButton);

  const status = createElement("p", "sr-only");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const fallbackStatus = createElement(
    "p",
    "lesson-animation-fallback",
    "Animation controls are unavailable. The complete static explanation is shown.",
  );
  fallbackStatus.hidden = true;

  figure.append(figcaption, description, flow, caption, controls, status, fallbackStatus);
  container.appendChild(figure);

  const nodes = [...figure.querySelectorAll("[data-animation-node]")];
  const connectors = [...figure.querySelectorAll("[data-animation-connector]")];
  const codeLines = [...figure.querySelectorAll("[data-animation-code-line]")];
  const outputValue = figure.querySelector("[data-animation-output-value]");
  const outputPlaceholder = figure.querySelector("[data-animation-output-placeholder]");
  const outputLines = [...figure.querySelectorAll("[data-animation-output-line]")];
  let stepIndex = scene.steps.length - 1;
  let timerId = null;
  let isPlaying = false;
  let isReducedMotion = false;
  let disposed = false;
  let mediaQuery = null;
  const removeListeners = [];

  function applyStep(index) {
    stepIndex = index;
    const step = scene.steps[index];
    nodes.forEach((node) => {
      const active = node.dataset.animationNode === step.activeNode;
      node.classList.toggle("is-active", active);
      if (active) node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
      const nodeStatus = node.querySelector(".lesson-animation-node-status");
      nodeStatus.hidden = !active;
    });
    const activeCodeLine = "activeCodeLine" in step ? step.activeCodeLine : 0;
    codeLines.forEach((codeLine, index) => {
      const active = index === activeCodeLine;
      codeLine.dataset.highlighted = String(active);
      if (active) codeLine.setAttribute("aria-current", "step");
      else codeLine.removeAttribute("aria-current");
      codeLine.querySelector(".sr-only").hidden = !active;
    });
    connectors.forEach((connector) => {
      connector.classList.toggle(
        "is-connected",
        step.connections.includes(connector.dataset.animationConnector),
      );
    });
    if (outputLines.length > 0) {
      const visibleOutputCount = step.visibleOutputCount ?? outputLines.length;
      outputLines.forEach((line, index) => {
        line.hidden = index >= visibleOutputCount;
      });
      outputPlaceholder.hidden = visibleOutputCount > 0;
    } else {
      outputValue.hidden = !step.showOutput;
      outputPlaceholder.hidden = step.showOutput;
    }
    caption.textContent = step.caption;
    playButton.disabled = isPlaying || stepIndex === scene.steps.length - 1;
    pauseButton.disabled = !isPlaying;
    nextButton.disabled = stepIndex === scene.steps.length - 1;
  }

  function updateControls() {
    playButton.hidden = isReducedMotion;
    pauseButton.hidden = isReducedMotion;
    replayButton.hidden = isReducedMotion;
    nextButton.hidden = !isReducedMotion;
    restartButton.hidden = !isReducedMotion;
    playButton.disabled = isPlaying || stepIndex === scene.steps.length - 1;
    pauseButton.disabled = !isPlaying;
    nextButton.disabled = stepIndex === scene.steps.length - 1;
  }

  function clearTimer() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  function stopPlayback() {
    clearTimer();
    isPlaying = false;
    updateControls();
  }

  function advancePlayback() {
    if (disposed || !isPlaying) return;
    if (stepIndex < scene.steps.length - 1) {
      applyStep(stepIndex + 1);
    }
    if (stepIndex === scene.steps.length - 1) {
      stopPlayback();
      return;
    }
    timerId = setTimeout(advancePlayback, STEP_DELAY_MS);
  }

  function play() {
    if (disposed || isReducedMotion || isPlaying) return;
    if (stepIndex === scene.steps.length - 1) return;
    isPlaying = true;
    status.textContent = "Animation playing";
    updateControls();
    timerId = setTimeout(advancePlayback, STEP_DELAY_MS);
  }

  function pause() {
    if (!isPlaying) return;
    stopPlayback();
    status.textContent = "Animation paused";
  }

  function replay() {
    if (disposed || isReducedMotion) return;
    stopPlayback();
    applyStep(0);
    status.textContent = "Animation replayed";
    play();
  }

  function nextStep() {
    if (disposed || !isReducedMotion || stepIndex === scene.steps.length - 1) return;
    applyStep(stepIndex + 1);
    status.textContent = scene.steps[stepIndex].caption;
    updateControls();
  }

  function startOver() {
    if (disposed || !isReducedMotion) return;
    applyStep(0);
    status.textContent = "Returned to the first animation step";
    updateControls();
  }

  function onMotionPreferenceChange(event) {
    isReducedMotion = event.matches;
    if (isReducedMotion) stopPlayback();
    figure.classList.toggle("is-reduced-motion", isReducedMotion);
    updateControls();
  }

  function listen(target, eventName, handler) {
    target.addEventListener(eventName, handler);
    removeListeners.push(() => target.removeEventListener(eventName, handler));
  }

  function initializeControls() {
    mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotion = mediaQuery.matches;
    listen(playButton, "click", play);
    listen(pauseButton, "click", pause);
    listen(replayButton, "click", replay);
    listen(nextButton, "click", nextStep);
    listen(restartButton, "click", startOver);
    listen(mediaQuery, "change", onMotionPreferenceChange);
    figure.classList.toggle("is-reduced-motion", isReducedMotion);
    applyStep(0);
    updateControls();
  }

  try {
    initializeControls();
  } catch (error) {
    stopPlayback();
    removeListeners.splice(0).forEach((removeListener) => removeListener());
    controls.remove();
    fallbackStatus.hidden = false;
    applyStep(scene.steps.length - 1);
    console.error("lesson-animation: failed to initialize playback controls", error);
  }

  return {
    destroy() {
      if (disposed) return;
      stopPlayback();
      disposed = true;
      if (stepIndex !== 0) {
        applyStep(0);
      }
      removeListeners.splice(0).forEach((removeListener) => removeListener());
    },
  };
}
