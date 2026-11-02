/**
 * components/navigation.js — Curriculum Navigation component.
 *
 * Implements curriculum navigation satisfying FR-001, FR-006, and FR-010:
 * - Course structure tree from curriculum-spec.md
 * - Active lesson indicator (aria-current="page")
 * - Completion badges from Progress module
 * - Responsive mobile drawer toggle with aria-expanded
 * - Keyboard navigable interactive elements
 */

import { getCurriculum } from "../curriculum.js";
import { isLessonComplete } from "../progress.js";

/**
 * Mounts the curriculum navigation into the container.
 *
 * @param {HTMLElement} container - Element to render navigation into.
 * @param {Object} options
 * @param {string} options.currentLessonId - Currently active lesson ID.
 * @param {Function} options.onSelectLesson - Callback when a lesson is selected.
 * @returns {Object} Navigation API handle.
 */
export function createNavigation(container, options = {}) {
  if (!container) {
    throw new Error("createNavigation: container element is required");
  }

  let activeLessonId = options.currentLessonId ?? "m1-l1";
  let isNavOpen = false;
  const curriculum = getCurriculum();

  container.innerHTML = `
    <nav class="curriculum-nav" id="curriculum-nav" aria-label="Curriculum Navigation" data-testid="curriculum-nav">
      <div class="nav-header">
        <h2 class="nav-title">Course Curriculum</h2>
        <button
          type="button"
          class="nav-toggle-btn"
          data-testid="nav-toggle-btn"
          aria-expanded="false"
          aria-controls="curriculum-tree"
          aria-label="Toggle curriculum navigation menu"
        >
          <span class="nav-toggle-icon" aria-hidden="true">&#9776;</span>
          <span class="nav-toggle-text">Menu</span>
        </button>
      </div>

      <div class="curriculum-tree" id="curriculum-tree" data-testid="curriculum-tree">
        <!-- Rendered modules and lessons -->
      </div>
    </nav>
  `;

  const treeContainer = container.querySelector('[data-testid="curriculum-tree"]');
  const toggleBtn = container.querySelector('[data-testid="nav-toggle-btn"]');

  function renderTree() {
    const shouldRestoreFocus = treeContainer.contains(document.activeElement);
    treeContainer.replaceChildren();

    curriculum.forEach((mod) => {
      const moduleSection = document.createElement("section");
      moduleSection.className = "nav-module-section";
      moduleSection.setAttribute("aria-labelledby", `module-header-${mod.moduleId}`);

      const header = document.createElement("div");
      header.className = "nav-module-header";
      header.id = `module-header-${mod.moduleId}`;

      const title = document.createElement("h3");
      title.className = "nav-module-title";
      title.textContent = mod.moduleTitle;
      header.appendChild(title);

      if (mod.milestone) {
        const milestone = document.createElement("span");
        milestone.className = "nav-module-milestone";
        milestone.textContent = mod.milestone;
        header.appendChild(milestone);
      }

      moduleSection.appendChild(header);

      const list = document.createElement("ul");
      list.className = "nav-lesson-list";
      list.setAttribute("role", "list");

      mod.lessons.forEach((lesson) => {
        const item = document.createElement("li");
        item.className = "nav-lesson-item";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "nav-lesson-link";
        btn.setAttribute("data-lesson-id", lesson.lessonId);
        btn.setAttribute("data-testid", `nav-lesson-${lesson.lessonId}`);

        const isActive = lesson.lessonId === activeLessonId;
        if (isActive) {
          btn.classList.add("is-active");
          btn.setAttribute("aria-current", "page");
        }

        const isComplete = isLessonComplete(lesson.lessonId);
        if (isComplete) {
          btn.classList.add("is-complete");
        }

        // Completion indicator
        const badge = document.createElement("span");
        badge.className = "lesson-status-icon";
        badge.setAttribute("aria-hidden", "true");
        badge.textContent = isComplete ? "✓" : "○";

        // Lesson title
        const nameSpan = document.createElement("span");
        nameSpan.className = "lesson-title-text";
        nameSpan.textContent = lesson.title;

        // Accessible completion label for screen readers
        const srStatus = document.createElement("span");
        srStatus.className = "sr-only";
        srStatus.textContent = isComplete ? " (Completed)" : "";

        // Duration badge
        const durationSpan = document.createElement("span");
        durationSpan.className = "lesson-duration";
        durationSpan.textContent = lesson.estimatedMinutes ? `${lesson.estimatedMinutes}m` : "";

        btn.appendChild(badge);
        btn.appendChild(nameSpan);
        btn.appendChild(srStatus);
        if (lesson.estimatedMinutes) {
          btn.appendChild(durationSpan);
        }

        btn.addEventListener("click", () => {
          selectLesson(lesson.lessonId);
        });

        item.appendChild(btn);
        list.appendChild(item);
      });

      moduleSection.appendChild(list);
      treeContainer.appendChild(moduleSection);
    });

    if (shouldRestoreFocus) {
      const activeButton = [...treeContainer.querySelectorAll(".nav-lesson-link")]
        .find((button) => button.dataset.lessonId === activeLessonId);
      activeButton?.focus({ preventScroll: true });
    }
  }

  function selectLesson(lessonId) {
    const closeMobileNavigation = isNavOpen;
    activeLessonId = lessonId;
    renderTree();
    // Close mobile drawer on selection
    if (closeMobileNavigation) {
      toggleNav(false);
      toggleBtn.focus();
    }
    if (typeof options.onSelectLesson === "function") {
      options.onSelectLesson(lessonId);
    }
  }

  function toggleNav(forcedState = null) {
    isNavOpen = forcedState !== null ? forcedState : !isNavOpen;
    toggleBtn.setAttribute("aria-expanded", String(isNavOpen));
    treeContainer.classList.toggle("is-open", isNavOpen);
  }

  toggleBtn.addEventListener("click", () => {
    toggleNav();
  });

  renderTree();

  return {
    getActiveLessonId: () => activeLessonId,
    setActiveLesson: (id) => {
      activeLessonId = id;
      renderTree();
    },
    updateProgress: () => {
      renderTree();
    },
    toggleNav,
    destroy: () => {
      container.replaceChildren();
    },
  };
}
