/**
 * content/m4-l5.js — Lesson content for Module 4, Lesson 5.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM4L5Output(entries) {
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.length === 1 && actual[0] === "15") {
    return {
      passed: true,
      status: "success",
      message: "Success! You passed a function value and the higher-order function called it synchronously.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected one output line, "15", but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Pass addBonus as a function value, then return callback(score) from applyToScore.`,
  };
}

export const validateM4L5Exercise = createBaseValidator(checkM4L5Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the function definitions, parentheses, and return statement.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the names score, callback, addBonus, and applyToScore.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Make sure callback is a function value and is called with score.`,
});

export const lessonM4L5 = {
  lessonId: "m4-l5",
  moduleId: "m4",
  moduleTitle: "Module 4: Functions",
  title: "Callbacks and Higher-Order Functions",
  estimatedMinutes: 25,
  prerequisites: ["m4-l4"],
  objectives: [
    "Pass a function as an argument without calling it at the call site.",
    "Write a higher-order function that accepts and invokes a callback.",
    "Explain that the callback in this lesson runs synchronously.",
  ],
  starterCode: `// Module 4, Lesson 5 — Exercise: Apply a Score Callback
function addBonus(score) {
  return score + 5;
}

function applyToScore(score, callback) {
  // Return the result of calling callback with score.
}

console.log(applyToScore(10, addBonus));
`,
  sections: [
    {
      id: "function-values",
      heading: "1. Pass a Function as a Value",
      content: `
        <p>Functions are values. You can pass a function to another function by using
        its name without parentheses.</p>
        <pre><code>applyToScore(10, addBonus);</code></pre>
        <p>This passes the function <code>addBonus</code>. Writing
        <code>addBonus(10)</code> would call it immediately and pass its result instead.</p>
      `,
    },
    {
      id: "higher-order-callback",
      heading: "2. Accept and Call a Callback",
      content: `
        <p>A function that accepts another function as an input is a
        <strong>higher-order function</strong>. The supplied function is called a
        <strong>callback</strong> when the receiving function invokes it.</p>
        <pre><code>function applyToScore(score, callback) {
  return callback(score);
}</code></pre>
      `,
    },
    {
      id: "synchronous-callback",
      heading: "3. This Callback Runs Synchronously",
      content: `
        <p>In this example, <code>applyToScore</code> calls <code>callback</code>
        immediately, before it returns. This is a synchronous callback; it does not use
        timers, events, or promises.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Pass or Call?",
      content: `
        <div class="concept-card">
          <h4>Trace the function value</h4>
          <ul>
            <li><code>addBonus</code> passes the function itself.</li>
            <li><code>addBonus(10)</code> calls it before <code>applyToScore</code> begins.</li>
            <li><code>callback(score)</code> invokes the function inside the higher-order function.</li>
            <li>The callback runs synchronously in this example.</li>
          </ul>
          <p>Predict the value returned by <code>applyToScore(10, addBonus)</code>.</p>
        </div>
      `,
    },
  ],
  summary: [
    "A function can be passed as a value by using its name without calling it.",
    "A higher-order function can accept and invoke another function.",
    "A callback is the supplied function when the receiving function calls it.",
    "This lesson's callback runs synchronously.",
  ],
  exercise: {
    id: "m4-l5-ex1",
    title: "Exercise: Apply a Score Callback",
    prompt:
      "Complete applyToScore so it calls the supplied callback with the score and returns the result. The program must print exactly 15.",
    expectedOutput: "15",
    starterCode: `// Module 4, Lesson 5 — Exercise: Apply a Score Callback
function addBonus(score) {
  return score + 5;
}

function applyToScore(score, callback) {
  // Return the result of calling callback with score.
}

console.log(applyToScore(10, addBonus));
`,
    hints: [
      "The call already passes the function value addBonus. Inside applyToScore, callback refers to that function and score is 10.",
      "Return callback(score); from inside applyToScore.",
    ],
    validate: validateM4L5Exercise,
  },
};
