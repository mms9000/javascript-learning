/**
 * content/m3-l4.js — Lesson content for Module 3, Lesson 4.
 *
 * Title: "for and while Loops"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM3L4Output(entries) {
  const expected = ["10", "10"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! Both finite loops added the integers 1 through 4 and produced the same total.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected two totals of 10, but received ${actual.length ? actual.join(", ") : "no output"}. Check the loop start, end condition, and update so every loop terminates.`,
  };
}

export const validateM3L4Exercise = createBaseValidator(checkM3L4Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the for-loop semicolons and loop braces.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check forTotal, whileTotal, nextValue, and console.log for spelling and capitalization.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that the loop counters and totals are numbers.`,
});

export const lessonM3L4 = {
  lessonId: "m3-l4",
  moduleId: "m3",
  moduleTitle: "Module 3: Decisions and Repetition",
  title: "for and while Loops",
  estimatedMinutes: 20,
  prerequisites: ["m3-l3"],
  objectives: [
    "Use a for loop for a finite sequence of repeated steps.",
    "Use a while loop and update its state so its condition eventually becomes false.",
    "Identify loop initialization, condition, and update, and avoid off-by-one errors.",
  ],
  starterCode: `// Module 3, Lesson 4 — Exercise: Add with Two Loops
let forTotal = 0;
// Use for to add the integers 1 through 4.

let whileTotal = 0;
let nextValue = 1;
// Use while to add the integers 1 through 4 and update nextValue.

console.log(forTotal);
console.log(whileTotal);
`,
  sections: [
    {
      id: "why-repeat",
      heading: "1. Repeat Work with Loops",
      content: `
        <p>A loop repeats a block of code. Use loops when the same kind of work must
        happen more than once, such as adding a short sequence of numbers.</p>
        <p>Every loop needs a clear stopping condition. A loop that never reaches its
        stopping condition continues until the playground's execution limit ends it.</p>
      `,
    },
    {
      id: "for-loop",
      heading: "2. Count with a for Loop",
      content: `
        <p>A <code>for</code> loop groups its initialization, condition, and update in
        its header. The condition is checked before each iteration.</p>
        <pre><code>for (let value = 1; value <= 4; value++) {
  console.log(value);
}</code></pre>
        <p>This prints 1, 2, 3, and 4. The condition <code>value &lt;= 4</code> includes
        the final value.</p>
      `,
    },
    {
      id: "while-loop",
      heading: "3. Repeat While a Condition Is True",
      content: `
        <p>A <code>while</code> loop checks its condition before each iteration. Update
        the state used by the condition inside the loop so that it eventually becomes
        false.</p>
        <pre><code>let value = 1;
while (value <= 4) {
  console.log(value);
  value++;
}</code></pre>
        <p>If <code>value++</code> is missing, the condition remains true and the loop
        does not finish. The runner timeout is a safeguard, not a substitute for a
        correct stopping condition.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Trace the Loop",
      content: `
        <div class="concept-card">
          <h4>Trace each loop before running it</h4>
          <ul>
            <li>Initialization sets the starting value to <strong>1</strong>.</li>
            <li>The condition <code>value &lt;= 4</code> includes 4, then stops at 5.</li>
            <li>Adding 1 + 2 + 3 + 4 gives <strong>10</strong>.</li>
            <li>A while loop needs an update that moves its condition toward false.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Loops repeat a block of code while a condition permits another iteration.",
    "A for loop places initialization, condition, and update in its header.",
    "A while loop checks its condition before running the body.",
    "Update a while loop's condition state so the loop finishes; check boundaries to avoid off-by-one errors.",
  ],
  exercise: {
    id: "m3-l4-ex1",
    title: "Exercise: Add with Two Loops",
    prompt:
      "Use a for loop and a while loop to separately add the integers 1 through 4. Print each total on its own line; both should equal 10.",
    expectedOutput: "10\n10",
    starterCode: `// Module 3, Lesson 4 — Exercise: Add with Two Loops
let forTotal = 0;
// Use for to add the integers 1 through 4.

let whileTotal = 0;
let nextValue = 1;
// Use while to add the integers 1 through 4 and update nextValue.

console.log(forTotal);
console.log(whileTotal);
`,
    hints: [
      "For the counted loop, begin at 1, continue while the value is at most 4, and increase it after each pass. In the while loop, add nextValue and advance it each pass.",
      "Use for (let value = 1; value <= 4; value++) for forTotal. Then use while (nextValue <= 4) { whileTotal += nextValue; nextValue++; }.",
    ],
    validate: validateM3L4Exercise,
  },
};
