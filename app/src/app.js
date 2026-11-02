/**
 * app.js — Main application factory for Phase 2.
 *
 * Assembles:
 * - Accessible skip-link for keyboard navigation
 * - Header with course title, progress counter, and reset progress control
 * - Curriculum navigation sidebar
 * - Lesson view displaying Module 1, Lesson 1 content
 * - Interactive CodeMirror playground with Run, Reset, and console output
 */

import { createNavigation } from "./components/navigation.js";
import { createLessonView } from "./components/lesson-view.js";
import { createPlayground } from "./components/playground.js";
import { getLessonContent } from "./content/index.js";
import {
  getStartingLessonId,
  findLessonById,
  getNextLessonId,
  getTotalLessonCount,
} from "./curriculum.js";
import { loadProgress, resetProgress, markLessonComplete } from "./progress.js";

const totalLessons = getTotalLessonCount();

/**
 * Mounts the complete lesson interface into the target container.
 *
 * @param {HTMLElement} container - DOM element to mount the application into.
 * @returns {Object} Application instance handle.
 */
export function createApp(container) {
  if (!container) {
    throw new Error("createApp: container element not found");
  }

  container.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="app-shell" data-testid="app-shell">
      <header class="app-header">
        <div class="header-brand">
          <h1 class="app-title">Learn JavaScript</h1>
          <p class="app-tagline">From first principles to object-oriented mastery.</p>
        </div>
        <div class="header-actions">
          <div class="progress-indicator" data-testid="progress-indicator">
            <span class="progress-label">Progress:</span>
            <span class="progress-count" data-testid="progress-count">0/${totalLessons}</span>
          </div>
          <p
            class="course-completion-status"
            data-testid="course-completion"
            role="status"
            aria-live="polite"
            hidden
          ></p>
          <button
            type="button"
            class="btn-reset-progress"
            data-testid="reset-progress-btn"
            aria-label="Reset saved learning progress"
            title="Reset saved learning progress"
          >Reset Progress</button>
        </div>
      </header>

      <div class="app-body">
        <aside class="app-sidebar" aria-label="Course curriculum" data-testid="app-sidebar">
          <div class="nav-mount-point" data-testid="nav-mount-point"></div>
        </aside>

        <main id="main-content" class="app-main" data-testid="app-main" tabindex="-1">
          <div class="main-columns">
            <section class="lesson-column" aria-label="Lesson Content" data-testid="lesson-column">
              <div class="lesson-mount-point" data-testid="lesson-mount-point"></div>
            </section>
            <section class="playground-column" aria-label="Interactive Code Playground" data-testid="playground-column">
              <div class="playground-mount-point" data-testid="playground-mount-point"></div>
            </section>
          </div>
        </main>
      </div>
    </div>
  `;

  const navMount = container.querySelector('[data-testid="nav-mount-point"]');
  const lessonMount = container.querySelector('[data-testid="lesson-mount-point"]');
  const playgroundMount = container.querySelector('[data-testid="playground-mount-point"]');
  const progressCount = container.querySelector('[data-testid="progress-count"]');
  const courseCompletionStatus = container.querySelector('[data-testid="course-completion"]');
  const resetProgressBtn = container.querySelector('[data-testid="reset-progress-btn"]');

  let currentLessonId = getStartingLessonId();

  function getNextLessonMeta(lessonId) {
    const nextId = getNextLessonId(lessonId);
    return nextId ? findLessonById(nextId) : null;
  }

  function updateProgressCounter() {
    const prog = loadProgress();
    const count = prog.completedLessons.length;
    progressCount.textContent = `${count}/${totalLessons}`;
    const isCourseComplete = count === totalLessons;
    courseCompletionStatus.hidden = !isCourseComplete;
    courseCompletionStatus.textContent = isCourseComplete
      ? `Course complete! You finished all ${totalLessons} lessons.`
      : "";
  }

  // Initialize Lesson View with initial lesson
  const initialContent = getLessonContent(currentLessonId);
  const initialNextMeta = getNextLessonMeta(currentLessonId);

  const lessonView = createLessonView(lessonMount, initialContent, {
    nextLessonMeta: initialNextMeta,
    onNextLesson: (nextId) => loadLesson(nextId),
  });

  // Initialize Playground with exercise
  const initialStarter =
    initialContent?.exercise?.starterCode ??
    initialContent?.starterCode ??
    'console.log("Hello, world!");\n';
  const playground = createPlayground(playgroundMount, {
    starterCode: initialStarter,
    exercise: initialContent?.exercise ?? null,
    comprehensionCheck: initialContent?.comprehensionCheck ?? null,
    nextLesson: initialNextMeta,
    onExerciseSuccess: () => {
      markLessonComplete(currentLessonId);
      updateProgressCounter();
      nav.updateProgress();
    },
    onNextLesson: (nextId) => {
      if (nextId) {
        loadLesson(nextId);
      } else {
        const next = getNextLessonId(currentLessonId);
        if (next) loadLesson(next);
      }
    },
  });

  // Function to load and switch lessons
  function loadLesson(lessonId) {
    currentLessonId = lessonId;
    const content = getLessonContent(lessonId);
    const nextMeta = getNextLessonMeta(lessonId);

    playground.setNextLesson(nextMeta);

    if (content) {
      lessonView.setLesson(content, {
        nextLessonMeta: nextMeta,
        onNextLesson: (nextId) => loadLesson(nextId),
      });
      const fallback = content.starterCode ?? "";
      playground.setExercise(content.exercise ?? null, fallback, content.comprehensionCheck ?? null);
    } else {
      playground.setExercise(null, "// Select a lesson to view its code\n", null);
      const meta = findLessonById(lessonId);
      lessonView.setLesson(
        {
          title: meta?.title || "Upcoming Lesson",
          moduleTitle: meta?.moduleTitle || "Curriculum",
          estimatedMinutes: meta?.estimatedMinutes || 15,
          objectives: meta?.objectives || ["Coming soon in the next curriculum phase."],
          sections: [
            {
              id: "upcoming",
              heading: "Lesson Under Construction",
              content: `
                <p>This lesson is scheduled for an upcoming implementation phase.</p>
                <p>Currently available: <strong>Modules 1–9 (Lessons 1–64)</strong>.</p>
              `,
            },
          ],
          summary: ["Check back soon as subsequent lessons are introduced per implementation-plan.md."],
        },
        {
          nextLessonMeta: nextMeta,
          onNextLesson: (nextId) => loadLesson(nextId),
        }
      );
    }

    nav.setActiveLesson(lessonId);
  }

  // Initialize Navigation
  const nav = createNavigation(navMount, {
    currentLessonId,
    onSelectLesson: (lessonId) => {
      loadLesson(lessonId);
    },
  });

  // Handle Reset Progress
  resetProgressBtn.addEventListener("click", () => {
    resetProgress();
    updateProgressCounter();
    nav.updateProgress();
  });

  updateProgressCounter();

  return {
    container,
    navigation: nav,
    lessonView,
    playground,
    loadLesson,
    updateProgressCounter,
    destroy() {
      nav.destroy();
      lessonView.destroy();
      playground.destroy();
      container.replaceChildren();
    },
  };
}
