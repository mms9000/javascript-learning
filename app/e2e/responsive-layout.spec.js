import { expect, test } from "@playwright/test";

const viewportWidths = [320, 360, 375, 768, 1280];

async function expectNoHorizontalOverflow(page, width, state) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.viewport).toBe(width);
  expect(
    dimensions.scroll,
    `Horizontal overflow at ${width}px in ${state}: ${JSON.stringify(dimensions)}`,
  ).toBeLessThanOrEqual(dimensions.client);

  const contentBounds = await page.evaluate(() =>
    [".main-columns", ".lesson-column", ".playground-column"]
      .map((selector) => {
        const element = document.querySelector(selector);
        const bounds = element.getBoundingClientRect();
        return { selector, left: bounds.left, right: bounds.right };
      }),
  );
  for (const bounds of contentBounds) {
    expect(bounds.left, `${bounds.selector} left edge at ${width}px (${state})`).toBeGreaterThanOrEqual(0);
    expect(
      bounds.right,
      `${bounds.selector} right edge at ${width}px (${state})`,
    ).toBeLessThanOrEqual(dimensions.client);
  }
}

test("keeps lessons and playground usable without horizontal page overflow", async ({ page }) => {
  for (const width of viewportWidths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expectNoHorizontalOverflow(page, width, "initial lesson");

    const playground = page.getByTestId("playground-column");
    const editor = page.locator(".cm-scroller");
    await expect(editor).toBeVisible();
    const editorBounds = await editor.boundingBox();
    const playgroundBounds = await playground.boundingBox();
    expect(editorBounds).not.toBeNull();
    expect(playgroundBounds).not.toBeNull();
    expect(editorBounds.width).toBeGreaterThan(0);
    expect(editorBounds.x).toBeGreaterThanOrEqual(playgroundBounds.x);
    expect(editorBounds.x + editorBounds.width).toBeLessThanOrEqual(
      playgroundBounds.x + playgroundBounds.width,
    );

    await page.getByRole("textbox", {
      name: "JavaScript code editor for lesson example",
    }).fill('console.log("Hello, JavaScript!");');
    await page.getByTestId("run-btn").click();
    await expect(page.getByTestId("status-badge")).toHaveText("Completed");
    await expect(page.locator(".output-text")).toHaveText("Hello, JavaScript!");
    await expect(page.getByTestId("celebration-badge")).toBeVisible();
    const successPanel = await page.getByTestId("exercise-feedback").boundingBox();
    const badge = await page.getByTestId("celebration-badge").boundingBox();
    const nextButton = await page.getByTestId("exercise-next-lesson-btn").boundingBox();
    expect(successPanel).not.toBeNull();
    expect(badge).not.toBeNull();
    expect(nextButton).not.toBeNull();
    expect(badge.x).toBeGreaterThanOrEqual(successPanel.x);
    expect(badge.x + badge.width).toBeLessThanOrEqual(successPanel.x + successPanel.width);
    expect(nextButton.x).toBeGreaterThanOrEqual(successPanel.x);
    expect(nextButton.x + nextButton.width).toBeLessThanOrEqual(
      successPanel.x + successPanel.width,
    );
    await expectNoHorizontalOverflow(page, width, "exercise success and console output");

    if (width <= 768) {
      const toggle = page.getByTestId("nav-toggle-btn");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expectNoHorizontalOverflow(page, width, "mobile navigation open");
    }

    await page.getByTestId("nav-lesson-m9-l9").click();
    await expect(page.getByTestId("lesson-title")).toHaveText("Framework-Neutral Capstone Project");
    const titleBounds = await page.getByTestId("lesson-title").boundingBox();
    const lessonBounds = await page.locator(".lesson-article").boundingBox();
    expect(titleBounds).not.toBeNull();
    expect(lessonBounds).not.toBeNull();
    expect(titleBounds.x).toBeGreaterThanOrEqual(lessonBounds.x);
    expect(titleBounds.x + titleBounds.width).toBeLessThanOrEqual(
      lessonBounds.x + lessonBounds.width,
    );
    await expectNoHorizontalOverflow(page, width, "long lesson title and content");
  }
});
