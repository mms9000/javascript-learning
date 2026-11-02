/**
 * components/lesson-view.js — Lesson View component.
 *
 * Renders the lesson explanation, objectives, structured concept cards,
 * and summary conforming to FR-002, curriculum-spec.md, and constitution.md.
 */
import { createLessonAnimation } from "./lesson-animation.js";
import { getLessonAnimationScene } from "../content/lesson-animation-scenes.js";

/**
 * Mounts the lesson view into the container.
 *
 * @param {HTMLElement} container - Element to render into.
 * @param {Object} [lessonContent] - Lesson content object.
 * @param {Object} [initialOptions={}] - Optional configuration including nextLessonMeta and onNextLesson.
 * @returns {Object} Lesson view API handle.
 */
export function createLessonView(container, lessonContent = null, initialOptions = {}) {
  if (!container) {
    throw new Error("createLessonView: container element is required");
  }

  let currentOptions = { ...initialOptions };
  let animationInstances = [];

  function disposeAnimations() {
    animationInstances.forEach((animation) => animation.destroy());
    animationInstances = [];
  }

  function render(content, options = currentOptions) {
    currentOptions = options;
    disposeAnimations();
    container.replaceChildren();

    const article = document.createElement("article");
    article.className = "lesson-article";
    article.setAttribute("data-testid", "lesson-article");

    if (!content) {
      article.innerHTML = `
        <div class="lesson-placeholder">
          <h2>Select a Lesson</h2>
          <p>Choose a lesson from the curriculum navigation to start learning.</p>
        </div>
      `;
      container.appendChild(article);
      return;
    }

    // Header section
    const header = document.createElement("header");
    header.className = "lesson-header";

    const metaRow = document.createElement("div");
    metaRow.className = "lesson-meta-row";

    const moduleBadge = document.createElement("span");
    moduleBadge.className = "lesson-module-badge";
    moduleBadge.textContent = content.moduleTitle || "JavaScript Curriculum";

    const durationBadge = document.createElement("span");
    durationBadge.className = "lesson-duration-badge";
    durationBadge.textContent = content.estimatedMinutes ? `⏱ ${content.estimatedMinutes} min` : "";

    metaRow.appendChild(moduleBadge);
    if (content.estimatedMinutes) {
      metaRow.appendChild(durationBadge);
    }
    header.appendChild(metaRow);

    const title = document.createElement("h2");
    title.className = "lesson-title";
    title.setAttribute("data-testid", "lesson-title");
    title.textContent = content.title;
    header.appendChild(title);

    article.appendChild(header);

    // Learning objectives section
    if (Array.isArray(content.objectives) && content.objectives.length > 0) {
      const objectivesSection = document.createElement("section");
      objectivesSection.className = "lesson-objectives";
      objectivesSection.setAttribute("aria-labelledby", "objectives-heading");

      const objHeading = document.createElement("h3");
      objHeading.id = "objectives-heading";
      objHeading.className = "section-heading";
      objHeading.textContent = "Learning Objectives";
      objectivesSection.appendChild(objHeading);

      const objList = document.createElement("ul");
      objList.className = "objectives-list";

      content.objectives.forEach((objText) => {
        const item = document.createElement("li");
        item.className = "objective-item";
        item.textContent = objText;
        objList.appendChild(item);
      });

      objectivesSection.appendChild(objList);
      article.appendChild(objectivesSection);
    }

    // Lesson content sections
    if (Array.isArray(content.sections)) {
      content.sections.forEach((sec) => {
        const sectionEl = document.createElement("section");
        sectionEl.className = "lesson-section";
        sectionEl.id = sec.id || "";
        sectionEl.setAttribute("aria-labelledby", `sec-heading-${sec.id}`);

        const heading = document.createElement("h3");
        heading.id = `sec-heading-${sec.id}`;
        heading.className = "section-heading";
        heading.textContent = sec.heading || sec.title || "";
        sectionEl.appendChild(heading);

        const body = document.createElement("div");
        body.className = "section-body";
        body.innerHTML = sec.content;
        sectionEl.appendChild(body);

        const scene = getLessonAnimationScene(content.lessonId, sec.id);
        if (scene) {
          animationInstances.push(createLessonAnimation(sectionEl, scene));
        }

        article.appendChild(sectionEl);
      });
    }

    // Summary section
    if (Array.isArray(content.summary) && content.summary.length > 0) {
      const summarySection = document.createElement("section");
      summarySection.className = "lesson-summary-box";
      summarySection.setAttribute("aria-labelledby", "summary-heading");

      const sumHeading = document.createElement("h3");
      sumHeading.id = "summary-heading";
      sumHeading.className = "section-heading";
      sumHeading.textContent = "Key Takeaways";
      summarySection.appendChild(sumHeading);

      const sumList = document.createElement("ul");
      sumList.className = "summary-list";

      content.summary.forEach((itemText) => {
        const item = document.createElement("li");
        item.innerHTML = itemText;
        sumList.appendChild(item);
      });

      summarySection.appendChild(sumList);
      article.appendChild(summarySection);
    }

    // Optional next lesson navigation footer
    const nextLessonMeta = options?.nextLessonMeta ?? content?.nextLessonMeta ?? null;
    if (nextLessonMeta) {
      const footer = document.createElement("footer");
      footer.className = "lesson-footer";
      footer.setAttribute("data-testid", "lesson-footer");

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "btn-next-lesson";
      nextBtn.setAttribute("data-testid", "next-lesson-btn");
      nextBtn.setAttribute("aria-label", `Proceed to next lesson: ${nextLessonMeta.title}`);

      const labelSpan = document.createElement("span");
      labelSpan.className = "next-lesson-label";
      labelSpan.textContent = "Next Lesson";

      const titleSpan = document.createElement("span");
      titleSpan.className = "next-lesson-title";
      titleSpan.textContent = `${nextLessonMeta.title} \u2192`;

      nextBtn.appendChild(labelSpan);
      nextBtn.appendChild(titleSpan);

      nextBtn.addEventListener("click", () => {
        if (typeof options.onNextLesson === "function") {
          options.onNextLesson(nextLessonMeta.lessonId);
        }
      });

      footer.appendChild(nextBtn);
      article.appendChild(footer);
    }

    container.appendChild(article);
  }

  render(lessonContent, initialOptions);

  return {
    setLesson: (content, options = {}) => {
      render(content, { ...currentOptions, ...options });
    },
    destroy: () => {
      disposeAnimations();
      container.replaceChildren();
    },
  };
}
