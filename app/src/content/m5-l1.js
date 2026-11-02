/**
 * content/m5-l1.js — Lesson content for Module 5, Lesson 1.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM5L1Output(entries) {
  const expected = ["Museum", "Park", "3"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! You read the first and last array values and used length for the item count.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected ${expected.map((value) => `"${value}"`).join(", ")}, but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Array indexes start at 0, and the final index is stops.length - 1.`,
  };
}

export const validateM5L1Exercise = createBaseValidator(checkM5L1Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the array brackets and property access syntax.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of stops, firstStop, and lastStop.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that stops is an array and that each index is valid.`,
});

export const lessonM5L1 = {
  lessonId: "m5-l1",
  moduleId: "m5",
  moduleTitle: "Module 5: Arrays and Objects",
  title: "Creating and Accessing Arrays",
  estimatedMinutes: 20,
  prerequisites: ["m4-l7"],
  objectives: [
    "Create an array literal.",
    "Read values from an array using zero-based indexes.",
    "Use length to find the number of items and the final valid index.",
  ],
  starterCode: `// Module 5, Lesson 1 — Exercise: Read an Array of Stops
const stops = ["Museum", "Library", "Park"];
const firstStop = stops[1];
const lastStop = stops[0];
console.log(firstStop);
console.log(lastStop);
console.log(stops.length);
`,
  sections: [
    {
      id: "array-literals",
      heading: "1. Create an Ordered Array",
      content: `
        <p>An array stores an ordered list of values. Create one with square brackets
        and separate its items with commas.</p>
        <pre><code>const stops = ["Museum", "Library", "Park"];</code></pre>
        <p>The array keeps these values in the order you wrote them.</p>
      `,
    },
    {
      id: "zero-based-indexes",
      heading: "2. Read Values by Index",
      content: `
        <p>Array indexes start at zero. The first value is at index <code>0</code>,
        the second at <code>1</code>, and the third at <code>2</code>.</p>
        <pre><code>console.log(stops[0]); // Museum
console.log(stops[2]); // Park</code></pre>
        <p>An index equal to the array's length is past the end and returns
        <code>undefined</code>.</p>
      `,
    },
    {
      id: "array-length",
      heading: "3. Use length for the Count and Final Index",
      content: `
        <p><code>stops.length</code> is the number of items, not the last index.
        For a non-empty array, the final index is <code>stops.length - 1</code>.</p>
        <pre><code>const lastStop = stops[stops.length - 1];
console.log(stops.length); // 3</code></pre>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Predict the Indexes",
      content: `
        <div class="concept-card">
          <h4>Trace <code>["Museum", "Library", "Park"]</code></h4>
          <ul>
            <li>Index <code>0</code> is <code>"Museum"</code>.</li>
            <li>Index <code>2</code> is <code>"Park"</code>.</li>
            <li>The length is <code>3</code>; the last valid index is <code>2</code>.</li>
            <li>Index <code>3</code> is out of range and produces <code>undefined</code>.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Array literals use square brackets and preserve item order.",
    "Indexes start at 0, so the first item is array[0].",
    "length is the item count; the last valid index is length - 1.",
  ],
  exercise: {
    id: "m5-l1-ex1",
    title: "Exercise: Read an Array of Stops",
    prompt:
      "Use the supplied stops array to read its first and final values, using the array length to find the final index. Print those values and the array's item count.",
    expectedOutput: "Museum\nPark\n3",
    starterCode: `// Module 5, Lesson 1 — Exercise: Read an Array of Stops
const stops = ["Museum", "Library", "Park"];
const firstStop = stops[1];
const lastStop = stops[0];
console.log(firstStop);
console.log(lastStop);
console.log(stops.length);
`,
    hints: [
      "The first item is at index 0. The number of items comes from stops.length.",
      "Use stops[stops.length - 1] to get the final item, even if the array length changes.",
    ],
    validate: validateM5L1Exercise,
  },
};
