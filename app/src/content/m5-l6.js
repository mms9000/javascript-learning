/**
 * content/m5-l6.js — Lesson content for Module 5, Lesson 6.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM5L6Output(entries) {
  const expected = ["4", "12", "Mira", "2", "3", "3"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! You unpacked values, collected the remaining values, and expanded data with spread.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected ${expected.map((value) => `"${value}"`).join(", ")}, but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Check which ... syntax collects the remaining values (rest) and which expands a collection (spread).`,
  };
}

export const validateM5L6Exercise = createBaseValidator(checkM5L6Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the destructuring brackets/braces and each ... position.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the names dimensions, remaining, player, stats, and countItems.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that the values you destructure or spread are arrays or objects as expected.`,
});

export const lessonM5L6 = {
  lessonId: "m5-l6",
  moduleId: "m5",
  moduleTitle: "Module 5: Arrays and Objects",
  title: "Destructuring, Spread, and Rest Syntax",
  estimatedMinutes: 20,
  prerequisites: ["m5-l5"],
  objectives: [
    "Destructure values from arrays and properties from objects.",
    "Use rest syntax to collect remaining array values, object properties, or function arguments.",
    "Use spread syntax to expand arrays and objects into shallow new collections.",
  ],
  starterCode: `// Module 5, Lesson 6 — Exercise: Unpack and Extend Data
const dimensions = [4, 7, 9];
let width = 0;
let remaining = [];
// Destructure dimensions into width and remaining.
const resized = [remaining, 12];
const player = { name: "Mira", level: 2 };
let name = "";
let stats = {};
// Destructure player into name and stats.
const upgraded = { ...player, level: 2 };
function countItems(first, ...others) {
  return 1 + others.length;
}
console.log(width);
console.log(resized[2]);
console.log(name);
console.log(stats.level);
console.log(upgraded.level);
console.log(countItems("pen", "book", "lamp"));
`,
  sections: [
    {
      id: "array-destructuring",
      heading: "1. Destructure Array Values",
      content: `
        <p>Array destructuring assigns items from an array to variables by position.</p>
        <pre><code>const dimensions = [4, 7, 9];
const [width, height] = dimensions;</code></pre>
        <p><code>width</code> receives the item at index 0 and
        <code>height</code> receives the item at index 1.</p>
      `,
    },
    {
      id: "object-destructuring-and-rest",
      heading: "2. Destructure Objects and Collect the Rest",
      content: `
        <p>Object destructuring matches property names. A rest element written with
        <code>...</code> collects the remaining array items or object properties into
        a new array or object.</p>
        <pre><code>const player = { name: "Mira", level: 2 };
const { name, ...stats } = player;</code></pre>
        <p>Here <code>name</code> is <code>"Mira"</code> and
        <code>stats</code> is <code>{ level: 2 }</code>. In a function parameter,
        <code>...others</code> collects the remaining arguments into an array.</p>
      `,
    },
    {
      id: "spread-arrays-and-objects",
      heading: "3. Use Spread to Expand Collections",
      content: `
        <p>Spread also uses <code>...</code>, but it expands values where a collection's
        contents are wanted. An array spread copies items into a new array; an object
        spread copies enumerable properties into a new object.</p>
        <pre><code>const resized = [...remaining, 12];
const upgraded = { ...player, level: 3 };</code></pre>
        <p>Spread copies only one level. A nested object or array remains a shared
        reference unless you copy it separately.</p>
      `,
    },
    {
      id: "rest-versus-spread",
      heading: "4. Comprehension Check: Collect or Expand?",
      content: `
        <div class="concept-card">
          <h4>The same dots, different roles</h4>
          <ul>
            <li><code>[width, ...remaining] = dimensions</code> collects the leftover values into <code>remaining</code>.</li>
            <li><code>({ name, ...stats } = player)</code> collects other properties into <code>stats</code>.</li>
            <li><code>[...remaining, 12]</code> expands array items into a new array.</li>
            <li><code>{ ...player, level: 3 }</code> expands properties into a shallow object copy.</li>
            <li><code>function countItems(first, ...others)</code> collects later arguments into an array.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Array destructuring assigns values by position; object destructuring matches property names.",
    "Rest syntax collects remaining values or properties into a new array or object.",
    "Spread syntax expands collection contents into a new array or object.",
    "Spread makes a shallow copy; nested values can still be shared references.",
  ],
  exercise: {
    id: "m5-l6-ex1",
    title: "Exercise: Unpack and Extend Data",
    prompt:
      "Complete the array and object destructuring, use spread to build the new values, and change countItems to collect all remaining arguments with a rest parameter. Predict and print each resulting value.",
    expectedOutput: "4\n12\nMira\n2\n3\n3",
    starterCode: `// Module 5, Lesson 6 — Exercise: Unpack and Extend Data
const dimensions = [4, 7, 9];
let width = 0;
let remaining = [];
// Destructure dimensions into width and remaining.
const resized = [remaining, 12];
const player = { name: "Mira", level: 2 };
let name = "";
let stats = {};
// Destructure player into name and stats.
const upgraded = { ...player, level: 2 };
function countItems(first, ...others) {
  return 1 + others.length;
}
console.log(width);
console.log(resized[2]);
console.log(name);
console.log(stats.level);
console.log(upgraded.level);
console.log(countItems("pen", "book", "lamp"));
`,
    hints: [
      "Destructure the array into width and the remaining items, then destructure the object into name and its remaining properties. Rest collects; spread expands.",
      "Use [width, ...remaining] = dimensions; and ({ name, ...stats } = player);. Build resized with [...remaining, 12], set upgraded.level to 3, and declare countItems(first, ...others).",
    ],
    validate: validateM5L6Exercise,
  },
};
