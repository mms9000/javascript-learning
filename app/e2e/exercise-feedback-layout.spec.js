import { expect, test } from "@playwright/test";

test("keeps successful exercise feedback readable and contained at responsive widths", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");

  const editor = page.getByRole("textbox", {
    name: "JavaScript code editor for lesson example",
  });
  const panel = page.getByTestId("exercise-feedback");
  const message = panel.locator(".feedback-text");
  const actions = panel.locator(".exercise-feedback-actions");
  const badge = page.getByTestId("celebration-badge");
  const nextButton = page.getByTestId("exercise-next-lesson-btn");

  for (const [index, width] of [320, 375, 768, 1280].entries()) {
    await page.setViewportSize({ width, height: 900 });
    if (index > 0) await page.getByTestId("reset-btn").click();

    await editor.fill('console.log("Hello, JavaScript!");');
    const baselineScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    await page.getByTestId("run-btn").click();

    await expect(panel).toHaveClass(/feedback-success/);
    await expect(message).toContainText("You printed 'Hello, JavaScript!'");
    await expect(badge).toHaveText(/Exercise Complete!/);
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeEnabled();
    await expect(nextButton).toHaveCSS("white-space", "normal");

    const panelBox = await panel.boundingBox();
    const messageBox = await message.boundingBox();
    const actionsBox = await actions.boundingBox();
    const badgeBox = await badge.boundingBox();
    const buttonBox = await nextButton.boundingBox();

    expect(panelBox).not.toBeNull();
    expect(messageBox).not.toBeNull();
    expect(actionsBox).not.toBeNull();
    expect(badgeBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();
    expect(messageBox.width).toBeGreaterThan(100);
    expect(actionsBox.y).toBeGreaterThanOrEqual(messageBox.y + messageBox.height - 1);
    expect(badgeBox.y).toBeGreaterThanOrEqual(panelBox.y);
    expect(badgeBox.y + badgeBox.height).toBeLessThanOrEqual(panelBox.y + panelBox.height);
    expect(badgeBox.x).toBeGreaterThanOrEqual(panelBox.x);
    expect(badgeBox.x + badgeBox.width).toBeLessThanOrEqual(panelBox.x + panelBox.width);
    expect(buttonBox.y).toBeGreaterThanOrEqual(panelBox.y);
    expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(panelBox.y + panelBox.height);
    expect(buttonBox.x).toBeGreaterThanOrEqual(panelBox.x);
    expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(panelBox.x + panelBox.width);
    expect(await panel.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    const documentWidth = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(
      documentWidth.scrollWidth,
      `The success panel increased document overflow at ${width}px`,
    ).toBeLessThanOrEqual(baselineScrollWidth);
  }

  await nextButton.click();
  await expect(page.getByTestId("lesson-title")).toHaveText(
    "Your First Program and console.log()",
  );
});
