import { expect, test } from "@playwright/test";

test("exercise hints start hidden and reveal progressively through accessible controls", async ({ page }) => {
  await page.goto("/");

  const toggle = page.getByTestId("hint-toggle-btn");
  const content = page.getByTestId("exercise-hints-content");
  const nextHint = page.getByTestId("next-hint-btn");
  const hideHints = page.getByTestId("collapse-hint-btn");

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(content).toBeHidden();

  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(content).toBeVisible();
  await expect(page.getByTestId("hint-card-1")).toBeVisible();
  await expect(page.getByTestId("hint-card-2")).toHaveCount(0);

  await nextHint.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("hint-card-2")).toBeVisible();
  await expect(nextHint).toBeHidden();

  await hideHints.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(content).toBeHidden();

  await toggle.click();
  await expect(page.getByTestId("hint-card-1")).toBeVisible();
  await expect(page.getByTestId("hint-card-2")).toBeVisible();
});
