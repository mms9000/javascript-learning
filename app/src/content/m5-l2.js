/**
 * content/m5-l2.js — Lesson content for Module 5, Lesson 2.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM5L2Output(entries) {
  const expected = ["4", "8", "2", "3", "true"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! You visited each reading, collected its doubled value, and checked array membership.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected ${expected.map((value) => `"${value}"`).join(", ")}, but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Visit each reading, push reading * 2 into doubled, then check includes(8).`,
  };
}

export const validateM5L2Exercise = createBaseValidator(checkM5L2Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the for...of loop braces and method parentheses.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of readings, reading, and doubled.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that doubled is an array before using push or includes.`,
});

export const lessonM5L2 = {
  lessonId: "m5-l2",
  moduleId: "m5",
  moduleTitle: "Module 5: Arrays and Objects",
  title: "Iteration and Array Methods",
  estimatedMinutes: 20,
  prerequisites: ["m5-l1"],
  objectives: [
    "Visit each array item using a for...of loop.",
    "Build a result array with push.",
    "Check for an item using includes.",
  ],
  starterCode: `// Module 5, Lesson 2 — Exercise: Collect Doubled Readings
const readings = [2, 4, 1];
const doubled = [];
for (const reading of readings) {
  // Add twice the current reading to doubled.
}
console.log(doubled[0]);
console.log(doubled[1]);
console.log(doubled[2]);
console.log(doubled.length);
console.log(doubled.includes(8));
`,
  sections: [
    {
      id: "for-of",
      heading: "1. Visit Each Array Item",
      content: `
        <p>A <code>for...of</code> loop gives the body one array value at a time, in
        order. The loop variable contains the current value, not its index.</p>
        <pre><code>for (const reading of readings) {
  console.log(reading);
}</code></pre>
      `,
    },
    {
      id: "push",
      heading: "2. Build Another Array with push",
      content: `
        <p>Start with an empty array, then call <code>push</code> to append a value.
        It changes the array by adding an item at the end.</p>
        <pre><code>const doubled = [];
for (const reading of readings) {
  doubled.push(reading * 2);
}</code></pre>
        <p>Use a separate result array so the input remains available during the loop.</p>
      `,
    },
    {
      id: "includes",
      heading: "3. Check Membership with includes",
      content: `
        <p><code>includes(value)</code> returns <code>true</code> if the array contains
        that value and <code>false</code> otherwise.</p>
        <pre><code>console.log(doubled.includes(8));</code></pre>
        <p>A loop repeats its body; an array method such as <code>includes</code>
        returns a value you can use in another expression.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Trace the Result",
      content: `
        <div class="concept-card">
          <h4>Trace <code>[2, 4, 1]</code></h4>
          <ul>
            <li>The loop sees 2, then 4, then 1.</li>
            <li>Pushing each doubled value produces <code>[4, 8, 2]</code>.</li>
            <li>The result length is 3, and <code>includes(8)</code> returns true.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "A for...of loop visits the values of an array in order.",
    "push appends a value to an array; it does not replace the array.",
    "includes returns a boolean indicating whether the array contains a value.",
  ],
  exercise: {
    id: "m5-l2-ex1",
    title: "Exercise: Collect Doubled Readings",
    prompt:
      "Use the loop to add twice each reading to doubled. Print every result, the result count, and whether doubled includes 8.",
    expectedOutput: "4\n8\n2\n3\ntrue",
    starterCode: `// Module 5, Lesson 2 — Exercise: Collect Doubled Readings
const readings = [2, 4, 1];
const doubled = [];
for (const reading of readings) {
  // Add twice the current reading to doubled.
}
console.log(doubled[0]);
console.log(doubled[1]);
console.log(doubled[2]);
console.log(doubled.length);
console.log(doubled.includes(8));
`,
    hints: [
      "The loop variable reading is one input value on each pass through the loop.",
      "Inside the loop, call doubled.push(reading * 2).",
    ],
    validate: validateM5L2Exercise,
  },
};
