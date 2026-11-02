import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLessonAnimation } from "./lesson-animation.js";
import { getLessonAnimationScene } from "../content/lesson-animation-scenes.js";

function createMotionPreference(matches) {
  const listeners = new Set();
  return {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_eventName, listener) => listeners.add(listener),
    removeEventListener: (_eventName, listener) => listeners.delete(listener),
    change(nextMatches) {
      this.matches = nextMatches;
      listeners.forEach((listener) => listener({ matches: nextMatches }));
    },
  };
}

describe("lesson animation scene registry", () => {
  it("registers the approved M1-L1 scene and exact lesson example", () => {
    const scene = getLessonAnimationScene("m1-l1", "the-three-pieces");

    expect(scene).toMatchObject({
      lessonId: "m1-l1",
      sectionId: "the-three-pieces",
      code: 'console.log("Hello, world!");',
      output: "Hello, world!",
    });
    expect(getLessonAnimationScene("m1-l1", "first-program")).toBeUndefined();
    expect(getLessonAnimationScene("m1-l3", "single-line-comments")).toBeUndefined();
  });

  it("registers the exact M1-L2 statements and sequential output order", () => {
    const scene = getLessonAnimationScene("m1-l2", "sequential-execution");

    expect(scene).toMatchObject({
      lessonId: "m1-l2",
      sectionId: "sequential-execution",
      layout: "sequential",
      code: 'console.log("Player Score:");\nconsole.log(100);',
      outputLines: [
        {
          text: "Player Score:",
          kind: "Text string",
          sourceNotation: "Quoted in the source",
        },
        {
          text: "100",
          kind: "Number",
          sourceNotation: "Unquoted in the source",
        },
      ],
    });
    expect(scene.diagram.some((item) => item.title === "Browser host")).toBe(false);
  });
});

describe("createLessonAnimation()", () => {
  let container;
  let scene;
  let animation;
  let originalMatchMedia;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    scene = getLessonAnimationScene("m1-l1", "the-three-pieces");
    originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn(() => createMotionPreference(false));
  });

  afterEach(() => {
    animation?.destroy();
    animation = null;
    container.remove();
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders a useful static scene and does not start playback automatically", async () => {
    vi.useFakeTimers();
    animation = createLessonAnimation(container, scene);

    expect(container.textContent).toContain("JavaScript language");
    expect(container.textContent).toContain("Browser host");
    expect(container.textContent).toContain("JavaScript engine");
    expect(container.textContent).toContain("Console API");
    expect(container.querySelector("code").textContent).toContain(scene.code);
    expect(container.querySelector('[data-animation-node="output"]')).toBeTruthy();
    expect(container.querySelector('[data-animation-code-line]').getAttribute("aria-current")).toBe(
      "step",
    );
    expect(container.querySelector('[data-testid="lesson-animation-step-caption"]').textContent).toBe(
      scene.steps[0].caption,
    );

    await vi.advanceTimersByTimeAsync(5000);
    expect(container.querySelector('[data-animation-node="engine"]').getAttribute("aria-current")).toBe(
      null,
    );
  });

  it("plays, pauses, resumes, replays, and stops on the final state", async () => {
    vi.useFakeTimers();
    animation = createLessonAnimation(container, scene);

    const play = container.querySelector('[aria-label="Play animation"]');
    const pause = container.querySelector('[aria-label="Pause animation"]');
    const replay = container.querySelector('[aria-label="Replay animation"]');
    const caption = container.querySelector('[data-testid="lesson-animation-step-caption"]');

    play.click();
    expect(pause.disabled).toBe(false);
    await vi.advanceTimersByTimeAsync(1800);
    expect(caption.textContent).toBe(scene.steps[1].caption);
    expect(container.querySelector("[data-animation-code-line]").getAttribute("aria-current")).toBe(
      "step",
    );

    pause.click();
    await vi.advanceTimersByTimeAsync(3600);
    expect(caption.textContent).toBe(scene.steps[1].caption);

    play.click();
    await vi.advanceTimersByTimeAsync(1800);
    expect(caption.textContent).toBe(scene.steps[2].caption);
    expect(container.querySelector("[data-animation-code-line]").dataset.highlighted).toBe("true");

    replay.click();
    expect(caption.textContent).toBe(scene.steps[0].caption);
    await vi.advanceTimersByTimeAsync(5400);
    expect(caption.textContent).toBe(scene.steps[3].caption);
    expect(container.querySelector(".lesson-animation-output-value").hidden).toBe(false);
    expect(play.disabled).toBe(true);

    await vi.advanceTimersByTimeAsync(9000);
    expect(caption.textContent).toBe(scene.steps[3].caption);
  });

  it("shows M1-L2 statements and appends their typed output in source order", async () => {
    vi.useFakeTimers();
    const sequentialScene = getLessonAnimationScene("m1-l2", "sequential-execution");
    animation = createLessonAnimation(container, sequentialScene);

    const sourceLines = [...container.querySelectorAll("[data-animation-code-source]")];
    expect(sourceLines.map((line) => line.textContent).join("\n")).toBe(sequentialScene.code);
    expect(container.querySelectorAll('[data-animation-code-line]')).toHaveLength(2);
    expect(container.textContent).toContain("Text string · quoted in the source");
    expect(container.textContent).toContain("Number · unquoted in the source");
    expect(container.querySelector('[data-animation-group="browser"]')).toBeNull();
    expect([...container.querySelectorAll("[data-animation-output-line]")].every((line) => line.hidden))
      .toBe(true);

    const play = container.querySelector('[aria-label="Play animation"]');
    const caption = container.querySelector('[data-testid="lesson-animation-step-caption"]');
    const codeLines = [...container.querySelectorAll("[data-animation-code-line]")];
    const outputLines = [...container.querySelectorAll("[data-animation-output-line]")];

    play.click();
    await vi.advanceTimersByTimeAsync(1800);
    expect(codeLines[0].dataset.highlighted).toBe("true");
    expect(codeLines[1].dataset.highlighted).toBe("false");
    expect(outputLines[0].hidden).toBe(true);

    await vi.advanceTimersByTimeAsync(1800);
    expect(outputLines[0].hidden).toBe(false);
    expect(outputLines[0].textContent).toContain("Player Score:");
    expect(outputLines[1].hidden).toBe(true);

    await vi.advanceTimersByTimeAsync(1800);
    expect(codeLines[0].dataset.highlighted).toBe("false");
    expect(codeLines[1].dataset.highlighted).toBe("true");
    expect(outputLines[0].hidden).toBe(false);

    await vi.advanceTimersByTimeAsync(1800);
    expect([...container.querySelectorAll("[data-animation-output-line] code")].map((line) => line.textContent))
      .toEqual(["Player Score:", "100"]);
    expect(outputLines.every((line) => !line.hidden)).toBe(true);
    expect(caption.textContent).toBe(sequentialScene.steps[4].caption);

    container.querySelector('[aria-label="Replay animation"]').click();
    expect(caption.textContent).toBe(sequentialScene.steps[0].caption);
    expect(outputLines.every((line) => line.hidden)).toBe(true);
    await vi.advanceTimersByTimeAsync(7200);
    expect(outputLines.every((line) => !line.hidden)).toBe(true);
    expect(caption.textContent).toBe(sequentialScene.steps[4].caption);
  });

  it("uses discrete steps under reduced motion and preserves the current step on preference change", async () => {
    vi.useFakeTimers();
    const preference = createMotionPreference(true);
    window.matchMedia = vi.fn(() => preference);
    animation = createLessonAnimation(container, scene);

    const play = container.querySelector('[aria-label="Play animation"]');
    const next = container.querySelector('[aria-label="Show next animation step"]');
    const restart = container.querySelector('[aria-label="Return to the first animation step"]');
    const caption = container.querySelector('[data-testid="lesson-animation-step-caption"]');

    expect(play.hidden).toBe(true);
    next.focus();
    next.click();
    expect(document.activeElement).toBe(next);
    expect(caption.textContent).toBe(scene.steps[1].caption);
    await vi.advanceTimersByTimeAsync(5000);
    expect(caption.textContent).toBe(scene.steps[1].caption);

    preference.change(false);
    expect(play.hidden).toBe(false);
    expect(caption.textContent).toBe(scene.steps[1].caption);
    expect(vi.getTimerCount()).toBe(0);

    preference.change(true);
    restart.click();
    expect(caption.textContent).toBe(scene.steps[0].caption);
  });

  it("cancels pending callbacks when disposed", async () => {
    vi.useFakeTimers();
    animation = createLessonAnimation(container, scene);
    const caption = container.querySelector('[data-testid="lesson-animation-step-caption"]');
    container.querySelector('[aria-label="Play animation"]').click();

    animation.destroy();
    animation = null;
    await vi.advanceTimersByTimeAsync(10000);
    expect(caption.textContent).toBe(scene.steps[0].caption);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("keeps the complete static explanation when playback initialization fails", () => {
    const error = new Error("matchMedia unavailable");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    window.matchMedia = vi.fn(() => {
      throw error;
    });

    animation = createLessonAnimation(container, scene);

    expect(container.querySelector(".lesson-animation-controls")).toBeNull();
    expect(container.querySelector(".lesson-animation-fallback").hidden).toBe(false);
    expect(container.querySelector(".lesson-animation-output-value").hidden).toBe(false);
    expect(container.textContent).toContain(scene.code);
    expect(consoleError).toHaveBeenCalledWith(
      "lesson-animation: failed to initialize playback controls",
      error,
    );
  });
});
