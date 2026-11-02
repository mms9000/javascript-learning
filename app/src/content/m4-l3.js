/**
 * content/m4-l3.js — Lesson content for Module 4, Lesson 3.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM4L3Output(entries) {
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.length === 1 && actual[0] === "Hello, Sam") {
    return {
      passed: true,
      status: "success",
      message: "Success! Your arrow function returned the greeting to its caller.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected one line, "Hello, Sam", but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Return the greeting string from the arrow function; a block body needs an explicit return.`,
  };
}

export const validateM4L3Exercise = createBaseValidator(checkM4L3Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the arrow (=>), braces, and string quotes.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of makeGreeting and name.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that the function is called with a name value.`,
});

export const lessonM4L3 = {
  lessonId: "m4-l3",
  moduleId: "m4",
  moduleTitle: "Module 4: Functions",
  title: "Arrow Functions",
  estimatedMinutes: 15,
  prerequisites: ["m4-l2"],
  objectives: [
    "Write and call an arrow function expression.",
    "Return a value from an arrow function using an expression body or explicit block-body return.",
    "Recognize an arrow function as another function-writing form.",
  ],
  starterCode: `// Module 4, Lesson 3 — Exercise: Make a Greeting
const makeGreeting = (name) => {
  // Return "Hello, " followed by name.
};

console.log(makeGreeting("Sam"));
`,
  sections: [
    {
      id: "arrow-function-form",
      heading: "1. Write an Arrow Function",
      content: `
        <p>An arrow function is another way to write a function expression. It uses
        an arrow, <code>=&gt;</code>, between its parameters and body.</p>
        <pre><code>const double = (number) => {
  return number * 2;
};</code></pre>
      `,
    },
    {
      id: "return-from-arrow",
      heading: "2. Return a Value",
      content: `
        <p>A block-bodied arrow function uses <code>return</code> to send a result to
        its caller.</p>
        <pre><code>const makeGreeting = (name) => {
  return "Hello, " + name;
};</code></pre>
        <p>A short expression body can return its expression without writing
        <code>return</code>: <code>const double = number =&gt; number * 2;</code>.</p>
      `,
    },
    {
      id: "call-arrow-function",
      heading: "3. Call the Arrow Function",
      content: `
        <p>Like other functions, an arrow function runs when it is called. The returned
        value can be passed to another function such as <code>console.log()</code>.</p>
        <pre><code>console.log(makeGreeting("Sam"));</code></pre>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Predict the Return",
      content: `
        <div class="concept-card">
          <h4>Trace the greeting</h4>
          <ul>
            <li><code>name</code> receives the argument <code>"Sam"</code>.</li>
            <li>The block body returns <code>"Hello, " + name</code>.</li>
            <li>The caller prints <strong>Hello, Sam</strong>.</li>
          </ul>
          <p>Compare a block body with an expression body. Both can return a value.</p>
        </div>
      `,
    },
  ],
  summary: [
    "An arrow function is another way to write a function expression.",
    "An expression body returns its expression; a block body needs an explicit return.",
    "The function must still be called to run and produce a value.",
  ],
  exercise: {
    id: "m4-l3-ex1",
    title: "Exercise: Make a Greeting",
    prompt:
      'Complete the arrow function so calling makeGreeting("Sam") prints exactly "Hello, Sam".',
    expectedOutput: "Hello, Sam",
    starterCode: `// Module 4, Lesson 3 — Exercise: Make a Greeting
const makeGreeting = (name) => {
  // Return "Hello, " followed by name.
};

console.log(makeGreeting("Sam"));
`,
    hints: [
      "The block body must send a string back to the caller. Include the name parameter after the greeting text.",
      'Write return "Hello, " + name; inside the arrow function body.',
    ],
    validate: validateM4L3Exercise,
  },
};
