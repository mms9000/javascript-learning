/**
 * content/m3-l6.js — Lesson content for Module 3, Lesson 6.
 *
 * Title: "Choosing an Appropriate Control Structure"
 * Module 3 Milestone: "Build a deterministic number-search or rule-based program."
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM3L6Output(entries) {
  const expected = ["1: too low", "2: too low", "4: too low", "Found 5"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You completed the Module 3 milestone with a bounded search that combines a loop, conditional branches, continue, and break.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected the search output ${expected.map((value) => `"${value}"`).join(", ")}, but received ${actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"}. Check the skipped guess, comparisons, messages, and stop when the target is found.`,
  };
}

export const validateM3L6Exercise = createBaseValidator(checkM3L6Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the loop and if/else if block braces and parentheses.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check targetNumber, guess, and console.log for spelling and capitalization.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that the guess and target are compared as numbers.`,
});

export const lessonM3L6 = {
  lessonId: "m3-l6",
  moduleId: "m3",
  moduleTitle: "Module 3: Decisions and Repetition",
  title: "Choosing an Appropriate Control Structure",
  estimatedMinutes: 15,
  prerequisites: ["m3-l5"],
  objectives: [
    "Choose a loop for repetition and conditional branches for rules or fixed choices.",
    "Use a ternary conditional operator for a simple two-way value choice.",
    "Combine a finite loop and conditional branches to implement a deterministic rule-based search.",
  ],
  starterCode: `// Module 3, Lesson 6 — Milestone: Rule-Based Number Search
const targetNumber = 5;

for (let guess = 1; guess <= 6; guess++) {
  // Skip guess 3.
  // Report guesses below the target.
  // Report the target and stop searching when it is found.
}
`,
  sections: [
    {
      id: "choose-a-structure",
      heading: "1. Match the Structure to the Task",
      content: `
        <p>Choose the control structure that makes the task clear:</p>
        <ul>
          <li>Use a loop when an action must repeat.</li>
          <li>Use an <code>if</code> chain for ranges or ordered rules.</li>
          <li>Use <code>switch</code> for a fixed set of exact choices.</li>
          <li>Use the ternary conditional operator for one simple two-way value.</li>
        </ul>
        <p>A program can combine these structures when the problem calls for it.</p>
      `,
    },
    {
      id: "trace-a-rule",
      heading: "2. Trace the Rules Before Coding",
      content: `
        <p>For a number search, consider each guess in order. A guess can be skipped,
        compared with the target, or reported as a match. Write the rules in an order
        that handles the special skip and stops immediately after finding the target.</p>
        <p>A small, fixed range makes this practice deterministic: the same program
        produces the same result every time.</p>
      `,
    },
    {
      id: "deterministic-simulation",
      heading: "3. A Bounded Search Simulation",
      content: `
        <p>This lesson simulates guesses with a loop rather than asking a person to type
        input. The loop has a fixed upper bound, skips 3, reports guesses below 5, and
        stops at 5. It does not use randomness or an input API.</p>
        <pre><code>const targetNumber = 5;
for (let guess = 1; guess <= 6; guess++) {
  // Apply the search rules here.
}</code></pre>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Choose and Predict",
      content: `
        <div class="concept-card">
          <h4>Which structure fits?</h4>
          <ul>
            <li>Repeat a search through guesses: <strong>loop</strong>.</li>
            <li>Classify a value as below or equal to a target: <strong>if/else if</strong>.</li>
            <li>Select an exact command: <strong>switch</strong>.</li>
            <li>Choose one of two labels: <strong>ternary conditional operator</strong>.</li>
          </ul>
          <p>In the milestone, 3 is skipped and the search stops as soon as 5 is found.</p>
        </div>
      `,
    },
  ],
  summary: [
    "Choose control flow based on whether the task repeats, checks ordered rules, selects fixed cases, or chooses between two values.",
    "A loop can combine with conditional branches to model a search.",
    "continue skips the selected guess; break stops the search when the target is found.",
    "The milestone is a deterministic bounded simulation; it does not request input or generate random numbers.",
  ],
  exercise: {
    id: "m3-l6-ex1",
    title: "Module 3 Milestone: Rule-Based Number Search",
    prompt:
      "Complete the bounded search from 1 through 6: skip 3, report each guess below 5, report when 5 is found, and stop at the match.",
    expectedOutput: "1: too low\n2: too low\n4: too low\nFound 5",
    starterCode: `// Module 3, Lesson 6 — Milestone: Rule-Based Number Search
const targetNumber = 5;

for (let guess = 1; guess <= 6; guess++) {
  // Skip guess 3.
  // Report guesses below the target.
  // Report the target and stop searching when it is found.
}
`,
    hints: [
      "Inside the loop, first skip guess 3. Then compare guess with targetNumber: report a lower guess, or report a match and stop.",
      'Use if (guess === 3) continue;. Then use if (guess < targetNumber) to log `${guess}: too low`; otherwise if (guess === targetNumber), log `Found ${guess}` and break.',
    ],
    validate: validateM3L6Exercise,
  },
};
