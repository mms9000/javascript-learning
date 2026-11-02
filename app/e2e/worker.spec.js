import { expect, test } from "@playwright/test";

async function enterCode(page, code) {
  const editor = page.getByRole("textbox", {
    name: "JavaScript code editor for lesson example",
  });
  await editor.fill(code);
  await page.getByTestId("run-btn").click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("rejects direct and nested dynamic imports while preserving normal code", async ({ page }) => {
  for (const code of [
    'import("https://example.invalid/module.js");',
    'const load = () => import("./module.js"); load();',
    "if (true {",
  ]) {
    await enterCode(page, code);
    await expect(page.getByTestId("status-badge")).toHaveText("Error");
    await expect(page.locator(".notice-error")).toBeVisible();
  }

  await enterCode(page, "console.log(6 * 7);");
  await expect(page.getByTestId("status-badge")).toHaveText("Completed");
  await expect(page.locator(".output-text")).toHaveText("42");
});

test("blocks indirect code generation and protects Worker completion messaging", async ({ page }) => {
  await enterCode(page, `
    const attempts = [
      () => Function("return 'generated'")(),
      () => Object.constructor("return 'generated'")(),
      () => ({}).constructor.constructor("return 'generated'")(),
      () => (async () => {}).constructor("return 'generated'")(),
      () => (function* () {}).constructor("return 'generated'")(),
      () => (async function* () {}).constructor("return 'generated'")(),
      () => eval("console.log('generated')"),
    ];
    attempts.forEach((attempt, index) => {
      try {
        console.log(index + ": " + attempt());
      } catch {
        console.log(index + ": blocked");
      }
    });
    console.log(typeof self.postMessage);
    console.log(6 * 7);
  `);

  await expect(page.getByTestId("status-badge")).toHaveText("Completed");
  await expect(page.locator(".output-text")).toHaveText([
    "0: blocked",
    "1: blocked",
    "2: blocked",
    "3: blocked",
    "4: blocked",
    "5: blocked",
    "6: blocked",
    "undefined",
    "42",
  ]);
});

test("terminates post-completion timers and recovers after an actual timeout", async ({ page }) => {
  await enterCode(page, `
    setTimeout(() => console.log("late output"), 150);
    console.log("finished");
  `);
  await expect(page.getByTestId("status-badge")).toHaveText("Completed");
  await expect(page.locator(".output-text")).toHaveText("finished");
  await page.waitForTimeout(250);
  await expect(page.locator(".output-text")).toHaveText("finished");

  await enterCode(page, "while (true) {}");
  await expect(page.getByTestId("status-badge")).toHaveText("Terminated", {
    timeout: 10_000,
  });
  await enterCode(page, "console.log('recovered');");
  await expect(page.getByTestId("status-badge")).toHaveText("Completed");
  await expect(page.locator(".output-text")).toHaveText("recovered");
});

test("bounds output arguments and serializes cyclic, oversized, and malformed values", async ({ page }) => {
  await enterCode(page, `
    const cyclic = {};
    cyclic.self = cyclic;
    console.log(cyclic);
    console.log("A".repeat(3000));
    console.log(new Proxy({}, { ownKeys() { throw new Error("cannot enumerate"); } }));
    console.log(...Array.from({ length: 40 }, (_, index) => index));
  `);

  await expect(page.getByTestId("status-badge")).toHaveText("Completed");
  const rows = page.locator(".output-text");
  await expect(rows).toHaveCount(23);
  await expect(rows.nth(0)).toContainText("[Circular]");
  await expect(rows.nth(1)).toContainText("[truncated]");
  await expect(rows.nth(2)).toHaveText("[Unserializable]");
  await expect(rows.nth(22)).toContainText("more arguments");

  await enterCode(page, "for (let index = 0; index < 130; index += 1) console.log(index);");
  await expect(page.getByTestId("status-badge")).toHaveText("Completed");
  await expect(page.locator(".output-text")).toHaveCount(101);
  await expect(page.locator(".output-text").nth(100)).toContainText("maximum 100");
});
