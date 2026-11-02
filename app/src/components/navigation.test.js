/**
 * components/navigation.test.js — Unit tests for Curriculum Navigation.
 *
 * Verifies compliance with FR-001, FR-006, and FR-010:
 * - Reflects curriculum map from curriculum-spec.md
 * - Active lesson has aria-current="page"
 * - Completed lessons show completion indicator
 * - Mobile toggle updates aria-expanded
 * - Keyboard and click selection triggers callback
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createNavigation } from "./navigation.js";
import { markLessonComplete, resetProgress } from "../progress.js";

describe("createNavigation()", () => {
  let container;

  beforeEach(() => {
    resetProgress();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("throws when container is missing", () => {
    expect(() => createNavigation(null)).toThrow("createNavigation: container element is required");
  });

  it("renders curriculum tree containing all 9 modules", () => {
    const nav = createNavigation(container, { currentLessonId: "m1-l1" });
    const moduleSections = container.querySelectorAll(".nav-module-section");
    expect(moduleSections.length).toBe(9);

    const firstModuleTitle = container.querySelector("#module-header-m1 .nav-module-title");
    expect(firstModuleTitle.textContent).toContain("Module 1: Getting Started");

    nav.destroy();
  });

  it("marks the initial active lesson with aria-current='page'", () => {
    const nav = createNavigation(container, { currentLessonId: "m1-l1" });
    const activeBtn = container.querySelector('[data-testid="nav-lesson-m1-l1"]');

    expect(activeBtn).not.toBeNull();
    expect(activeBtn.getAttribute("aria-current")).toBe("page");
    expect(activeBtn.classList.contains("is-active")).toBe(true);

    nav.destroy();
  });

  it("displays completion indicators for completed lessons", () => {
    markLessonComplete("m1-l1");
    const nav = createNavigation(container, { currentLessonId: "m1-l2" });

    const l1Btn = container.querySelector('[data-testid="nav-lesson-m1-l1"]');
    expect(l1Btn.classList.contains("is-complete")).toBe(true);
    expect(l1Btn.textContent).toContain("✓");
    expect(l1Btn.textContent).toContain("Completed");

    nav.destroy();
  });

  it("fires onSelectLesson callback and updates active state on click", () => {
    const onSelect = vi.fn();
    const nav = createNavigation(container, {
      currentLessonId: "m1-l1",
      onSelectLesson: onSelect,
    });

    const l2Btn = container.querySelector('[data-testid="nav-lesson-m1-l2"]');
    l2Btn.click();

    expect(onSelect).toHaveBeenCalledWith("m1-l2");
    expect(nav.getActiveLessonId()).toBe("m1-l2");

    const updatedL2Btn = container.querySelector('[data-testid="nav-lesson-m1-l2"]');
    expect(updatedL2Btn.getAttribute("aria-current")).toBe("page");

    nav.destroy();
  });

  it("preserves keyboard focus on the active lesson when the tree is rebuilt", () => {
    const nav = createNavigation(container, { currentLessonId: "m1-l1" });
    const firstButton = container.querySelector('[data-testid="nav-lesson-m1-l1"]');
    firstButton.focus();

    nav.setActiveLesson("m1-l2");

    const activeButton = container.querySelector('[data-testid="nav-lesson-m1-l2"]');
    expect(document.activeElement).toBe(activeButton);

    nav.updateProgress();
    expect(document.activeElement).toBe(container.querySelector('[data-testid="nav-lesson-m1-l2"]'));
    nav.destroy();
  });

  it("returns focus to the mobile menu toggle after selecting a lesson", () => {
    const nav = createNavigation(container, { currentLessonId: "m1-l1" });
    const toggleBtn = container.querySelector('[data-testid="nav-toggle-btn"]');
    nav.toggleNav(true);
    container.querySelector('[data-testid="nav-lesson-m1-l2"]').click();

    expect(toggleBtn.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggleBtn);
    nav.destroy();
  });

  it("toggles responsive navigation drawer and updates aria-expanded", () => {
    const nav = createNavigation(container, {});
    const toggleBtn = container.querySelector('[data-testid="nav-toggle-btn"]');
    const tree = container.querySelector('[data-testid="curriculum-tree"]');

    expect(toggleBtn.getAttribute("aria-expanded")).toBe("false");
    expect(tree.classList.contains("is-open")).toBe(false);

    toggleBtn.click();
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("true");
    expect(tree.classList.contains("is-open")).toBe(true);

    toggleBtn.click();
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("false");
    expect(tree.classList.contains("is-open")).toBe(false);

    nav.destroy();
  });
});
