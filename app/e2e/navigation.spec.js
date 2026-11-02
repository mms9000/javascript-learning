import { expect, test } from "@playwright/test";

test("preserves keyboard focus when selecting a lesson and returns focus after mobile navigation", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveCSS("outline-style", "solid");

  const desktopLesson = page.getByTestId("nav-lesson-m1-l2");
  await desktopLesson.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("nav-lesson-m1-l2")).toBeFocused();
  await expect(page.getByTestId("lesson-title")).toHaveText("Your First Program and console.log()");

  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByTestId("nav-toggle-btn");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.getByTestId("nav-lesson-m1-l3").click();
  await expect(page.getByTestId("lesson-title")).toHaveText("Reading Basic Syntax and Comments");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("completes, reloads, and resets the final course lesson", async ({ page }) => {
  const moduleLessonCounts = [4, 6, 6, 7, 8, 7, 7, 10, 9];
  const completedLessons = [];
  moduleLessonCounts.forEach((lessonCount, moduleIndex) => {
    for (let lessonIndex = 1; lessonIndex <= lessonCount; lessonIndex += 1) {
      if (moduleIndex === moduleLessonCounts.length - 1 && lessonIndex === lessonCount) continue;
      completedLessons.push(`m${moduleIndex + 1}-l${lessonIndex}`);
    }
  });

  await page.goto("/");
  await page.evaluate((lessons) => {
    localStorage.setItem("jslearn_progress_v1", JSON.stringify({
      schemaVersion: 1,
      completedLessons: lessons,
      lastUpdated: new Date().toISOString(),
    }));
  }, completedLessons);
  await page.reload();
  await expect(page.getByTestId("progress-count")).toHaveText("63/64");

  await page.getByTestId("nav-lesson-m9-l9").click();
  await expect(page.getByTestId("lesson-title")).toHaveText("Framework-Neutral Capstone Project");
  for (const answerId of [
    "application-state",
    "responsibilities",
    "event-flow",
    "reusable-display",
    "framework-organization",
  ]) {
    await page.locator(`input[value="${answerId}"]`).check();
  }
  await page.getByTestId("knowledge-check-submit").click();

  await expect(page.getByTestId("progress-count")).toHaveText("64/64");
  await expect(page.getByTestId("course-completion")).toHaveText(
    "Course complete! You finished all 64 lessons.",
  );
  await expect(page.getByTestId("course-completion")).toHaveAttribute("role", "status");
  await expect(page.getByTestId("course-completion")).toHaveAttribute("aria-live", "polite");
  await expect(page.getByTestId("knowledge-check-feedback")).toContainText("Correct.");

  await page.reload();
  await expect(page.getByTestId("progress-count")).toHaveText("64/64");
  await expect(page.getByTestId("course-completion")).toBeVisible();
  await page.getByTestId("reset-progress-btn").click();
  await expect(page.getByTestId("progress-count")).toHaveText("0/64");
  await expect(page.getByTestId("course-completion")).toBeHidden();
});
