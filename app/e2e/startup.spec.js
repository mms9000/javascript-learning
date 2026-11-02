import { expect, test } from "@playwright/test";

test("production preview mounts the application and renders the initial lesson", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Learn JavaScript" })).toBeVisible();
  await expect(page.getByTestId("lesson-title")).toHaveText("What JavaScript Is and Where It Runs");
  await expect(page.getByTestId("progress-count")).toHaveText("0/64");
  expect(pageErrors).toEqual([]);
});
