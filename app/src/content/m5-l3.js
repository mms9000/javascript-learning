/**
 * content/m5-l3.js — Lesson content for Module 5, Lesson 3.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM5L3Output(entries) {
  const expected = ["6", "14", "10", "18", "Passing: 2", "First: 7", "Total: 24"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! You transformed, selected, found, and reduced the scores using each method's returned value.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected ${expected.map((value) => `"${value}"`).join(", ")}, but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. map transforms each score, filter keeps matches, find returns the first match, and reduce updates a running total.`,
  };
}

export const validateM5L3Exercise = createBaseValidator(checkM5L3Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check each callback's braces, arrow, and return statement.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the names scores, doubled, passing, firstPassing, and total.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that each array method is called on scores and each callback returns its result.`,
});

export const lessonM5L3 = {
  lessonId: "m5-l3",
  moduleId: "m5",
  moduleTitle: "Module 5: Arrays and Objects",
  title: "map, filter, find, and reduce",
  estimatedMinutes: 30,
  prerequisites: ["m5-l2"],
  objectives: [
    "Explain that array transformation methods call a synchronous callback.",
    "Use map to produce one transformed result for each input item.",
    "Use filter to keep matching items and find to return the first match.",
    "Use reduce with an initial accumulator value to compute a summary.",
  ],
  starterCode: `// Module 5, Lesson 3 — Exercise: Transform and Summarize Scores
const scores = [3, 7, 5, 9];
const doubled = scores.map((score) => {
  // Return twice this score.
});
const passing = scores.filter((score) => {
  // Keep scores at least 6.
});
const firstPassing = scores.find((score) => {
  // Find the first score at least 6.
});
const total = scores.reduce((sum, score) => {
  // Return the updated total.
}, 0);
for (const score of doubled) console.log(score);
console.log(\`Passing: \${passing.length}\`);
console.log(\`First: \${firstPassing}\`);
console.log(\`Total: \${total}\`);
`,
  sections: [
    {
      id: "map",
      heading: "1. Transform Each Item with map",
      content: `
        <p><code>map</code> calls a callback once for each item and returns a new
        array containing the callback's returned values. Return the transformed value
        from the callback.</p>
        <pre><code>const doubled = scores.map((score) => score * 2);</code></pre>
        <p>For <code>[3, 7, 5, 9]</code>, the result is
        <code>[6, 14, 10, 18]</code>.</p>
      `,
    },
    {
      id: "filter-and-find",
      heading: "2. Keep Items or Find the First Match",
      content: `
        <p><code>filter</code> calls a callback for every item and returns a new array
        containing the items whose callback result is truthy.</p>
        <pre><code>const passing = scores.filter((score) => score >= 6);</code></pre>
        <p><code>find</code> uses a similar yes/no test, but returns only the first
        matching item. It returns <code>undefined</code> if no item matches.</p>
        <pre><code>const firstPassing = scores.find((score) => score >= 6);</code></pre>
      `,
    },
    {
      id: "reduce",
      heading: "3. Build a Summary with reduce",
      content: `
        <p><code>reduce</code> calls a callback with a running accumulator and the next
        item. The callback returns the updated accumulator. Supplying an initial value
        such as <code>0</code> makes the starting state explicit.</p>
        <pre><code>const total = scores.reduce((sum, score) => sum + score, 0);</code></pre>
      `,
    },
    {
      id: "callback-return-values",
      heading: "4. Comprehension Check: Predict Each Return",
      content: `
        <div class="concept-card">
          <h4>Trace <code>[3, 7, 5, 9]</code></h4>
          <ul>
            <li><code>map</code> produces <code>[6, 14, 10, 18]</code> when its callback doubles each score.</li>
            <li><code>filter</code> keeps <code>[7, 9]</code> for the condition score at least 6.</li>
            <li><code>find</code> returns <code>7</code>, the first matching value.</li>
            <li><code>reduce</code> returns <code>24</code> when its sum starts at 0.</li>
          </ul>
          <p>All four callbacks run synchronously and return a value to their array method.</p>
        </div>
      `,
    },
  ],
  summary: [
    "map returns a new array of callback results.",
    "filter returns a new array containing items whose callback result is truthy.",
    "find returns the first matching item, or undefined when none matches.",
    "reduce returns the final accumulator; provide an initial value when appropriate.",
  ],
  exercise: {
    id: "m5-l3-ex1",
    title: "Exercise: Transform and Summarize Scores",
    prompt:
      "Complete the callbacks to double every score, keep scores at least 6, find the first score at least 6, and calculate the total starting from 0. Print all results in order.",
    expectedOutput: "6\n14\n10\n18\nPassing: 2\nFirst: 7\nTotal: 24",
    starterCode: `// Module 5, Lesson 3 — Exercise: Transform and Summarize Scores
const scores = [3, 7, 5, 9];
const doubled = scores.map((score) => {
  // Return twice this score.
});
const passing = scores.filter((score) => {
  // Keep scores at least 6.
});
const firstPassing = scores.find((score) => {
  // Find the first score at least 6.
});
const total = scores.reduce((sum, score) => {
  // Return the updated total.
}, 0);
for (const score of doubled) console.log(score);
console.log(\`Passing: \${passing.length}\`);
console.log(\`First: \${firstPassing}\`);
console.log(\`Total: \${total}\`);
`,
    hints: [
      "Each callback receives one score. Decide whether it should return a changed value, a yes/no test, the first match, or an updated running total.",
      "Return score * 2 in map, score >= 6 in filter and find, and sum + score in reduce.",
    ],
    validate: validateM5L3Exercise,
  },
};
