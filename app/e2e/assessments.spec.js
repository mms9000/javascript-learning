import { expect, test } from "@playwright/test";

async function submitKnowledgeCheck(page, answerId) {
  await page.locator(`input[value="${answerId}"]`).check();
  await page.getByTestId("knowledge-check-submit").click();
  await expect(page.getByTestId("knowledge-check-feedback")).toContainText("Correct.");
}

test("requires both M8-L6 assessments and clears transient completion on lesson switching", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("nav-lesson-m8-l6").click();

  await expect(page.getByTestId("comprehension-check-title")).toHaveText("Check your understanding of super");
  await submitKnowledgeCheck(page, "reuse-parent");
  await expect(page.getByTestId("assessment-completion-status")).toContainText(
    "Complete the coding exercise",
  );
  await expect(page.getByTestId("progress-count")).toHaveText("0/64");

  await page.getByTestId("nav-lesson-m8-l7").click();
  await page.getByTestId("nav-lesson-m8-l6").click();
  await expect(page.getByTestId("knowledge-check-feedback")).toBeEmpty();
  await expect(page.getByTestId("assessment-completion-status")).toContainText(
    "Complete both the coding exercise",
  );

  const editor = page.getByRole("textbox", {
    name: "JavaScript code editor for lesson example",
  });
  await editor.fill(`
    class Animal {
      constructor(name) { this.name = name; }
      speak() { return this.name + " makes a sound."; }
    }
    class Dog extends Animal {
      speak() { return super.speak() + " Woof!"; }
    }
    const luna = new Dog("Luna");
    console.log(luna.speak());
    console.log(luna instanceof Animal);
  `);
  await page.getByTestId("run-btn").click();
  await expect(page.getByTestId("status-badge")).toHaveText("Completed");
  await expect(page.getByTestId("exercise-feedback")).toContainText("Correct.");
  await expect(page.getByTestId("exercise-feedback")).toHaveAttribute("role", "status");
  await expect(page.getByTestId("exercise-feedback")).toHaveAttribute("aria-live", "polite");
  await expect(page.getByTestId("assessment-completion-status")).toContainText(
    "Complete the comprehension check",
  );
  await expect(page.getByTestId("progress-count")).toHaveText("0/64");

  await submitKnowledgeCheck(page, "reuse-parent");
  await expect(page.getByTestId("progress-count")).toHaveText("1/64");
  await expect(page.getByTestId("assessment-completion-status")).toHaveText(
    "Both assessments passed. Lesson complete.",
  );
  await expect(page.getByTestId("assessment-completion-status")).toHaveAttribute("role", "status");
});

test("requires both M8-L7 assessments when the coding exercise is completed first", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("nav-lesson-m8-l7").click();
  await expect(page.getByTestId("comprehension-check-title")).toHaveText(
    "Check your understanding of private fields",
  );

  const editor = page.getByRole("textbox", {
    name: "JavaScript code editor for lesson example",
  });
  await editor.fill(`
    class Counter {
      #count;
      constructor(start = 0) { this.#count = start; }
      addOne() { this.#count += 1; return this.#count; }
    }
    const first = new Counter(3);
    const second = new Counter(10);
    console.log(first.addOne());
    console.log(second.addOne());
    console.log(first.addOne());
  `);
  await page.getByTestId("run-btn").click();
  await expect(page.getByTestId("status-badge")).toHaveText("Completed");
  await expect(page.getByTestId("exercise-feedback")).toContainText("Correct.");
  await expect(page.getByTestId("progress-count")).toHaveText("0/64");

  await submitKnowledgeCheck(page, "parse-time");
  await expect(page.getByTestId("progress-count")).toHaveText("1/64");
  await expect(page.getByTestId("assessment-completion-status")).toHaveText(
    "Both assessments passed. Lesson complete.",
  );
});
