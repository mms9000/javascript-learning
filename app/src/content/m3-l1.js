/**
 * content/m3-l1.js — Lesson content for Module 3, Lesson 1.
 *
 * Title: "Truthy and Falsy Values"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM3L1Output(entries) {
  const expected = ["false", "false", "true", "true"];
  if (entries.length !== expected.length) {
    return {
      passed: false,
      status: "mismatch",
      message: `Expected exactly 4 output lines (false, false, true, true), but received ${entries.length}. Log each Boolean result on its own line.`,
    };
  }

  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message:
        'Success! You recognized that 0 and an empty string are falsy, while the non-empty strings "0" and "Ready" are truthy.',
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected ${expected.join(", ")} in order, but received ${actual.join(", ")}. Remember that every non-empty string is truthy.`,
  };
}

export const validateM3L1Exercise = createBaseValidator(checkM3L1Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check that each Boolean(...) call has matching parentheses.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of emptyCount, emptyText, zeroLabel, and readyMessage.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that Boolean is called with parentheses around the value.`,
});

export const lessonM3L1 = {
  lessonId: "m3-l1",
  moduleId: "m3",
  moduleTitle: "Module 3: Decisions and Repetition",
  title: "Truthy and Falsy Values",
  estimatedMinutes: 15,
  prerequisites: ["m2-l6"],
  objectives: [
    "Identify false, 0, -0, NaN, an empty string, null, and undefined as falsy values.",
    'Explain why non-empty strings such as "0" and "false" are truthy.',
    "Predict Boolean(value) results for the primitive values in this lesson.",
  ],
  starterCode: `// Module 3, Lesson 1 — Exercise: Spot the Truthy Values
const emptyCount = 0;
const emptyText = "";
const zeroLabel = "0";
const readyMessage = "Ready";

console.log(Boolean(emptyCount));
// Add the remaining Boolean checks.
`,
  sections: [
    {
      id: "truthy-and-falsy",
      heading: "1. Truthy and Falsy Values",
      content: `
        <p>
          JavaScript can use any value where a condition is expected. The language
          treats that value as either <strong>truthy</strong> or <strong>falsy</strong>.
          This behavior is called truthiness; it does not change the original value's type.
        </p>
        <pre><code>if ("Ready") {
  console.log("This message appears");
}</code></pre>
        <p>The non-empty string is truthy, so the code inside the block runs.</p>
      `,
    },
    {
      id: "falsy-values",
      heading: "2. The Falsy Primitive Values",
      content: `
        <p>These primitive values are falsy: <code>false</code>, <code>0</code>,
        <code>-0</code>, <code>NaN</code>, <code>""</code>, <code>null</code>, and
        <code>undefined</code>.</p>
        <pre><code>if (0) {
  console.log("This does not run");
}</code></pre>
        <p>There are few falsy values. Most other values are truthy.</p>
      `,
    },
    {
      id: "strings-and-truthiness",
      heading: "3. Non-empty Strings Are Truthy",
      content: `
        <p>A string is falsy only when it is empty. A string containing characters is
        truthy—even when those characters look like a boolean or number.</p>
        <pre><code>Boolean("")      // false
Boolean("0")     // true
Boolean("false") // true</code></pre>
        <p>The text <code>"false"</code> is still a non-empty string, not the boolean
        value <code>false</code>.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Predict Truthiness",
      content: `
        <div class="concept-card">
          <h4>Predict each Boolean result</h4>
          <ul>
            <li><code>Boolean(0)</code> → <strong>false</strong></li>
            <li><code>Boolean("")</code> → <strong>false</strong></li>
            <li><code>Boolean("0")</code> → <strong>true</strong></li>
            <li><code>Boolean("false")</code> → <strong>true</strong></li>
            <li><code>Boolean(NaN)</code> → <strong>false</strong></li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Truthy and falsy describe how JavaScript treats a value in a condition; they do not change its type.",
    "The falsy values include false, 0, -0, NaN, the empty string, null, and undefined.",
    'Every non-empty string is truthy, including "0" and "false".',
    "Use Boolean(value) to explicitly see the truthiness result.",
  ],
  exercise: {
    id: "m3-l1-ex1",
    title: "Exercise: Spot the Truthy Values",
    prompt:
      'Print Boolean(emptyCount), Boolean(emptyText), Boolean(zeroLabel), and Boolean(readyMessage), each on its own line and in that order.',
    expectedOutput: "false\nfalse\ntrue\ntrue",
    starterCode: `// Module 3, Lesson 1 — Exercise: Spot the Truthy Values
const emptyCount = 0;
const emptyText = "";
const zeroLabel = "0";
const readyMessage = "Ready";

console.log(Boolean(emptyCount));
// Add the remaining Boolean checks.
`,
    hints: [
      'Compare each value with 0 and the empty string. A string containing "0" or "Ready" is not empty.',
      "Add console.log(Boolean(emptyText));, console.log(Boolean(zeroLabel));, and console.log(Boolean(readyMessage));.",
    ],
    validate: validateM3L1Exercise,
  },
};
