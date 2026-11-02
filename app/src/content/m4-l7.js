/**
 * content/m4-l7.js — Lesson content and milestone for Module 4, Lesson 7.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM4L7Output(entries) {
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.length === 1 && actual[0] === "Total: 6") {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You combined a bounded recursive calculation, a formatter, and a synchronous callback to complete the Module 4 milestone.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected one line, "Total: 6", but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Check the base case, recursive progress, returned values, and formatter callback.`,
  };
}

export const validateM4L7Exercise = createBaseValidator(checkM4L7Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the function braces and recursive call parentheses.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of sumSteps, formatTotal, createSummary, steps, total, and formatter.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that formatter is a function and is called with the computed total.`,
});

export const lessonM4L7 = {
  lessonId: "m4-l7",
  moduleId: "m4",
  moduleTitle: "Module 4: Functions",
  title: "Recursion and Common Debugging Patterns",
  estimatedMinutes: 20,
  prerequisites: ["m4-l6"],
  objectives: [
    "Identify a recursive function's base case and recursive case.",
    "Trace a bounded recursive call sequence and verify progress toward the base case.",
    "Diagnose a missing base case or a recursive call that does not make progress.",
  ],
  starterCode: `// Module 4, Lesson 7 — Milestone: Build a Reusable Recursive Summary
function sumSteps(steps) {
  // Return 0 when steps reaches 0.
  // Otherwise return steps plus sumSteps(steps - 1).
}

function formatTotal(total) {
  // Return "Total: " followed by total.
}

function createSummary(steps, formatter) {
  // Return formatter(sumSteps(steps)).
}

console.log(createSummary(3, formatTotal));
`,
  sections: [
    {
      id: "base-and-recursive-cases",
      heading: "1. Find the Base and Recursive Cases",
      content: `
        <p>A recursive function calls itself. The <strong>base case</strong> returns
        without another recursive call. The <strong>recursive case</strong> reduces
        the problem and calls the function again.</p>
        <pre><code>function sumSteps(steps) {
  if (steps === 0) {
    return 0;
  }
  return steps + sumSteps(steps - 1);
}</code></pre>
      `,
    },
    {
      id: "make-progress",
      heading: "2. Make Progress Toward the Base Case",
      content: `
        <p>Each recursive call must move toward the base case. Here the argument
        decreases: <code>3</code>, <code>2</code>, <code>1</code>, then
        <code>0</code>. A missing base case or an unchanged argument can keep calling
        until the call stack is exhausted.</p>
        <p>The existing worker timeout is a safety limit, not a replacement for a
        correct stopping condition. Keep recursive examples small and bounded.</p>
      `,
    },
    {
      id: "compose-functions",
      heading: "3. Compose Small Functions",
      content: `
        <p>Reusable functions can each handle one step. <code>sumSteps</code>
        calculates a value, <code>formatTotal</code> turns it into a message, and
        <code>createSummary</code> passes the formatter as a synchronous callback.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Trace the Calls",
      content: `
        <div class="concept-card">
          <h4>Trace <code>sumSteps(3)</code></h4>
          <ul>
            <li>The base case is <code>steps === 0</code>, which returns 0.</li>
            <li>The recursive case adds <code>steps</code> to <code>sumSteps(steps - 1)</code>.</li>
            <li>The arguments move from 3 toward 0, so the calls reach the base case.</li>
            <li>A recursive call with the same argument would not make progress.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "A recursive function needs a base case and a recursive case.",
    "Each recursive call must make progress toward a reachable base case.",
    "Small functions can be composed to calculate, format, and deliver a result.",
    "The Module 4 milestone combines recursion with a synchronous callback.",
  ],
  exercise: {
    id: "m4-l7-ex1",
    title: "Module 4 Milestone: Build a Reusable Recursive Summary",
    prompt:
      'Complete all three functions so createSummary(3, formatTotal) prints exactly "Total: 6".',
    expectedOutput: "Total: 6",
    starterCode: `// Module 4, Lesson 7 — Milestone: Build a Reusable Recursive Summary
function sumSteps(steps) {
  // Return 0 when steps reaches 0.
  // Otherwise return steps plus sumSteps(steps - 1).
}

function formatTotal(total) {
  // Return "Total: " followed by total.
}

function createSummary(steps, formatter) {
  // Return formatter(sumSteps(steps)).
}

console.log(createSummary(3, formatTotal));
`,
    hints: [
      "sumSteps needs a base case at 0 and a recursive case that decreases steps. Each other function must return its result to its caller.",
      'Use if (steps === 0) return 0; then return steps + sumSteps(steps - 1);. Return "Total: " + total from formatTotal, and return formatter(sumSteps(steps)) from createSummary.',
    ],
    validate: validateM4L7Exercise,
  },
};
