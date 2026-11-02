import { expect, test } from "@playwright/test";

test("M1-L1 scene remains readable and inside the lesson at supported viewport widths", async ({ page }) => {
  await page.goto("/");

  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const scene = page.getByTestId("lesson-animation");
    await expect(scene).toBeVisible();
    await expect(scene.locator("code")).toContainText('console.log("Hello, world!");');
    await expect(scene.getByText("JavaScript language")).toBeVisible();
    await expect(scene.getByRole("heading", { name: "Browser host" })).toBeVisible();
    await expect(scene.getByRole("heading", { name: "JavaScript engine" })).toBeVisible();
    await expect(scene.getByRole("heading", { name: "Console API" })).toBeVisible();

    const layout = await page.evaluate(() => {
      const animation = document.querySelector('[data-testid="lesson-animation"]');
      const article = document.querySelector('[data-testid="lesson-article"]');
      return {
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
        sceneLeft: animation.getBoundingClientRect().left,
        sceneRight: animation.getBoundingClientRect().right,
        articleLeft: article.getBoundingClientRect().left,
        articleRight: article.getBoundingClientRect().right,
      };
    });
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.sceneLeft).toBeGreaterThanOrEqual(layout.articleLeft);
    expect(layout.sceneRight).toBeLessThanOrEqual(layout.articleRight);
    await expect(scene.getByRole("button", { name: "Play animation", exact: true })).toBeVisible();
  }
});

test("scene playback and lesson navigation clean up the previous instance", async ({ page }) => {
  await page.goto("/");
  await page.clock.install();
  const scene = page.getByTestId("lesson-animation");
  const oldCaption = scene.getByTestId("lesson-animation-step-caption");

  const play = scene.getByRole("button", { name: "Play animation", exact: true });
  const pause = scene.getByRole("button", { name: "Pause animation", exact: true });
  const replay = scene.getByRole("button", { name: "Replay animation", exact: true });
  await play.focus();
  await page.keyboard.press("Enter");
  await expect(pause).toBeVisible();
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(oldCaption).toContainText("JavaScript is the language");
  await page.clock.runFor(2000);
  await expect(oldCaption).toContainText("JavaScript is the language");

  await play.focus();
  await page.keyboard.press("Enter");
  await page.clock.runFor(1800);
  await expect(oldCaption).toContainText("browser contains a JavaScript engine");
  await replay.click();
  await page.clock.runFor(5400);
  await expect(scene.locator(".lesson-animation-output-value")).toHaveText("Hello, world!");
  await expect(play).toBeDisabled();

  await replay.click();
  const detachedScene = await scene.elementHandle();
  const detachedCaption = await detachedScene.$('[data-testid="lesson-animation-step-caption"]');
  await page.getByTestId("nav-lesson-m1-l3").click();
  await expect(page.getByTestId("lesson-title")).toHaveText("Reading Basic Syntax and Comments");
  await expect(page.getByTestId("lesson-animation")).toHaveCount(0);
  await page.clock.runFor(2000);
  expect(await detachedScene.evaluate((element) => element.isConnected)).toBe(false);
  expect(await detachedCaption.evaluate((element) => element.textContent)).toContain(
    "JavaScript is the language",
  );

  await page.getByTestId("nav-lesson-m1-l1").click();
  await expect(page.getByTestId("lesson-animation")).toHaveCount(1);
  await expect(page.getByTestId("lesson-animation-step-caption")).toContainText(
    "JavaScript is the language",
  );
});

test("M1-L2 scene synchronizes source-order output at responsive widths", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("nav-lesson-m1-l2").click();

  const scene = page.getByTestId("lesson-animation");
  const sourceLines = scene.locator("[data-animation-code-source]");
  await expect(sourceLines).toHaveCount(2);
  await expect(sourceLines.nth(0)).toHaveText('console.log("Player Score:");');
  await expect(sourceLines.nth(1)).toHaveText("console.log(100);");
  await expect(
    scene.getByText("Text string · quoted in the source", { exact: true }),
  ).toBeVisible();
  await expect(
    scene.getByText("Number · unquoted in the source", { exact: true }),
  ).toBeVisible();
  await expect(scene.locator('[data-animation-group="browser"]')).toHaveCount(0);

  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      scene: document.querySelector('[data-testid="lesson-animation"]').getBoundingClientRect(),
      article: document.querySelector('[data-testid="lesson-article"]').getBoundingClientRect(),
    }));
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.scene.left).toBeGreaterThanOrEqual(layout.article.left);
    expect(layout.scene.right).toBeLessThanOrEqual(layout.article.right);
    await expect(scene.getByRole("button", { name: "Play animation", exact: true })).toBeVisible();
  }

  await page.clock.install();
  const play = scene.getByRole("button", { name: "Play animation", exact: true });
  const pause = scene.getByRole("button", { name: "Pause animation", exact: true });
  const replay = scene.getByRole("button", { name: "Replay animation", exact: true });
  const caption = scene.getByTestId("lesson-animation-step-caption");
  await play.focus();
  await page.keyboard.press("Enter");

  await page.clock.runFor(1800);
  await expect(scene.locator("[data-animation-code-line]").nth(0)).toHaveAttribute(
    "data-highlighted",
    "true",
  );
  await expect(scene.locator("[data-animation-code-line]").nth(1)).toHaveAttribute(
    "data-highlighted",
    "false",
  );
  await page.clock.runFor(1800);
  await expect(scene.locator("[data-animation-output-line]").nth(0)).toBeVisible();
  await expect(scene.locator("[data-animation-output-line]").nth(0)).toContainText("Player Score:");
  await expect(scene.locator("[data-animation-output-line]").nth(1)).toBeHidden();
  await page.clock.runFor(1800);
  await expect(scene.locator("[data-animation-code-line]").nth(1)).toHaveAttribute(
    "aria-current",
    "step",
  );
  await page.clock.runFor(1800);
  await expect(scene.locator("[data-animation-output-line] code")).toHaveText([
    "Player Score:",
    "100",
  ]);
  await expect(caption).toContainText("unquoted number 100");
  await expect(play).toBeDisabled();

  await replay.click();
  await expect(caption).toContainText("Both statements are shown");
  await pause.click();
  await page.clock.runFor(2000);
  await expect(caption).toContainText("Both statements are shown");
  await play.click();
  await page.clock.runFor(1800);
  await expect(caption).toContainText("first statement runs first");

  const activeScene = await scene.elementHandle();
  const activeCaption = await activeScene.$('[data-testid="lesson-animation-step-caption"]');
  await page.getByTestId("nav-lesson-m1-l3").click();
  await expect(page.getByTestId("lesson-animation")).toHaveCount(0);
  const captionAfterNavigation = await activeCaption.evaluate((element) => element.textContent);
  await page.clock.runFor(2000);
  expect(await activeCaption.evaluate((element) => element.textContent)).toBe(captionAfterNavigation);

  await page.getByTestId("nav-lesson-m1-l2").click();
  await expect(page.getByTestId("lesson-animation")).toHaveCount(1);
  await expect(page.getByTestId("lesson-animation-step-caption")).toContainText(
    "Both statements are shown",
  );
});

test("reduced motion exposes discrete keyboard-operable scene steps", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const scene = page.getByTestId("lesson-animation");
  await expect(scene.getByRole("button", { name: "Play animation", exact: true })).toBeHidden();
  const next = scene.getByRole("button", { name: "Show next animation step" });
  await expect(next).toBeVisible();
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(next).toBeFocused();
  await expect(scene.getByTestId("lesson-animation-step-caption")).toContainText(
    "browser contains a JavaScript engine",
  );
  await page.waitForTimeout(2000);
  await expect(scene.getByTestId("lesson-animation-step-caption")).toContainText(
    "browser contains a JavaScript engine",
  );
});

test("M1-L2 reduced-motion playback advances only through learner-operated steps", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByTestId("nav-lesson-m1-l2").click();

  const scene = page.getByTestId("lesson-animation");
  await expect(scene.getByRole("button", { name: "Play animation" })).toBeHidden();
  const next = scene.getByRole("button", { name: "Show next animation step" });
  const caption = scene.getByTestId("lesson-animation-step-caption");
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(next).toBeFocused();
  await expect(caption).toContainText("first statement runs first");
  await page.keyboard.press("Enter");
  await expect(caption).toContainText("quoted text string");
  await expect(scene.locator("[data-animation-output-line]").nth(0)).toBeVisible();
  await page.waitForTimeout(2000);
  await expect(caption).toContainText("quoted text string");
  await expect(scene.locator("[data-animation-output-line]").nth(1)).toBeHidden();
});
