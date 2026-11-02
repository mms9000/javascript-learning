/**
 * content/m4-l1.js — Lesson content for Module 4, Lesson 1.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM4L1Output(entries) {
  const expected = ["Welcome", "Practice functions"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! You defined and called both a function declaration and a function expression.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected two lines, "Welcome" and "Practice functions", but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Defining a function stores its instructions; call each function by name with parentheses.`,
  };
}

export const validateM4L1Exercise = createBaseValidator(checkM4L1Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the function braces and the parentheses in each call.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of showWelcome and showReminder.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that both function names refer to callable functions.`,
});

export const lessonM4L1 = {
  lessonId: "m4-l1",
  moduleId: "m4",
  moduleTitle: "Module 4: Functions",
  title: "Function Declarations and Expressions",
  estimatedMinutes: 20,
  prerequisites: ["m3-l6"],
  objectives: [
    "Define and call a function declaration.",
    "Define and call a function expression.",
    "Distinguish defining a function from invoking it.",
  ],
  starterCode: `// Module 4, Lesson 1 — Exercise: Two Ways to Define a Function
function showWelcome() {
  console.log("Welcome");
}

const showReminder = function () {
  console.log("Practice functions");
};

// Call both functions.
`,
  sections: [
    {
      id: "function-declarations",
      heading: "1. Define a Function Declaration",
      content: `
        <p>A function groups instructions under a name so you can run those
        instructions when needed. A function declaration starts with the
        <code>function</code> keyword.</p>
        <pre><code>function showWelcome() {
  console.log("Welcome");
}</code></pre>
        <p>This defines the function. Its body does not run until the function is called.</p>
      `,
    },
    {
      id: "function-expressions",
      heading: "2. Store a Function Expression",
      content: `
        <p>A function expression creates a function value and assigns it to a variable.</p>
        <pre><code>const showReminder = function () {
  console.log("Practice functions");
};</code></pre>
        <p>Here, <code>showReminder</code> names the variable that refers to the function.</p>
      `,
    },
    {
      id: "call-a-function",
      heading: "3. Call the Functions",
      content: `
        <p>Use a function name followed by parentheses to call it. The call runs the
        function body.</p>
        <pre><code>showWelcome();
showReminder();</code></pre>
        <p>Defining a function is not the same as calling it.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Define or Call?",
      content: `
        <div class="concept-card">
          <h4>Trace the statements</h4>
          <ul>
            <li><code>function greet() { ... }</code> defines a function.</li>
            <li><code>greet();</code> calls it and runs its body.</li>
            <li>Two calls run the body twice, in call order.</li>
          </ul>
          <p>Predict the two lines printed by <code>showWelcome(); showReminder();</code>.</p>
        </div>
      `,
    },
  ],
  summary: [
    "A function definition groups instructions under a callable function.",
    "A declaration uses the function keyword; an expression can be stored in a variable.",
    "A function body runs when the function is called, not merely when it is defined.",
  ],
  exercise: {
    id: "m4-l1-ex1",
    title: "Exercise: Two Ways to Define a Function",
    prompt:
      'Call both supplied functions so the output is exactly "Welcome" followed by "Practice functions", each on its own line.',
    expectedOutput: "Welcome\nPractice functions",
    starterCode: `// Module 4, Lesson 1 — Exercise: Two Ways to Define a Function
function showWelcome() {
  console.log("Welcome");
}

const showReminder = function () {
  console.log("Practice functions");
};

// Call both functions.
`,
    hints: [
      "The function bodies are already defined. Look for each function's name, then call them in the order you want their messages printed.",
      "Add showWelcome(); and then showReminder(); after the definitions.",
    ],
    validate: validateM4L1Exercise,
  },
};
