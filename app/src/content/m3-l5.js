/**
 * content/m3-l5.js — Lesson content for Module 3, Lesson 5.
 *
 * Title: "break and continue"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM3L5Output(entries) {
  const expected = ["1", "2", "4", "5"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! continue skipped 3, and break stopped the loop after 5.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected output 1, 2, 4, 5 in order, but received ${actual.length ? actual.join(", ") : "no output"}. Put continue before the log for 3 and break before the log for values greater than 5.`,
  };
}

export const validateM3L5Exercise = createBaseValidator(checkM3L5Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the if-condition parentheses and loop braces.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the loop variable name and console.log spelling.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that the loop comparison uses a number.`,
});

export const lessonM3L5 = {
  lessonId: "m3-l5",
  moduleId: "m3",
  moduleTitle: "Module 3: Decisions and Repetition",
  title: "break and continue",
  estimatedMinutes: 15,
  prerequisites: ["m3-l4"],
  objectives: [
    "Use continue to skip the current loop iteration.",
    "Use break to exit the nearest loop.",
    "Trace which values reach the loop body after skip and stop conditions.",
  ],
  starterCode: `// Module 3, Lesson 5 — Exercise: Skip One, Stop at Five
for (let value = 1; value <= 6; value++) {
  // Skip value 3.
  // Stop before any value greater than 5.
  console.log(value);
}
`,
  sections: [
    {
      id: "continue-skip",
      heading: "1. Skip an Iteration with continue",
      content: `
        <p><code>continue</code> skips the rest of the current loop iteration and moves
        on to the next one. It does not end the loop.</p>
        <pre><code>for (let value = 1; value <= 4; value++) {
  if (value === 2) {
    continue;
  }
  console.log(value);
}</code></pre>
        <p>This prints 1, 3, and 4.</p>
      `,
    },
    {
      id: "break-stop",
      heading: "2. Stop a Loop with break",
      content: `
        <p><code>break</code> exits the nearest enclosing loop. Use it when the task
        should stop early, such as when a search finds its target.</p>
        <pre><code>for (let value = 1; value <= 6; value++) {
  if (value > 3) {
    break;
  }
  console.log(value);
}</code></pre>
        <p>This prints 1, 2, and 3. A break inside nested loops exits only the nearest
        loop, but nested loops are not required for this exercise.</p>
      `,
    },
    {
      id: "ordering-control-statements",
      heading: "3. Place Control Statements Before the Work",
      content: `
        <p>Check whether to skip or stop before running the rest of the loop body. In a
        <code>for</code> loop, <code>continue</code> still proceeds to the update in the
        loop header. In a <code>while</code> loop, placing the counter update after a
        <code>continue</code> can accidentally prevent progress.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Skip or Stop?",
      content: `
        <div class="concept-card">
          <h4>Trace the loop from 1 through 6</h4>
          <ul>
            <li>When the value is 3, <code>continue</code> skips its log and begins the next iteration.</li>
            <li>When the value is 6, <code>break</code> ends the loop before logging it.</li>
            <li>The visible values are <strong>1, 2, 4, 5</strong>.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "continue skips the remaining statements in the current iteration and proceeds to the next one.",
    "break exits the nearest enclosing loop immediately.",
    "Check skip and stop conditions before doing the work that should be bypassed.",
    "A for-loop continue still performs its header update; a while-loop must update its condition state explicitly.",
  ],
  exercise: {
    id: "m3-l5-ex1",
    title: "Exercise: Skip One, Stop at Five",
    prompt:
      "Update the loop so it skips the value 3, stops before logging values greater than 5, and prints each other value.",
    expectedOutput: "1\n2\n4\n5",
    starterCode: `// Module 3, Lesson 5 — Exercise: Skip One, Stop at Five
for (let value = 1; value <= 6; value++) {
  // Skip value 3.
  // Stop before any value greater than 5.
  console.log(value);
}
`,
    hints: [
      "Check the skip condition first. Then check whether the value is beyond the limit before logging.",
      "Use if (value === 3) continue; followed by if (value > 5) break; before console.log(value).",
    ],
    validate: validateM3L5Exercise,
  },
};
