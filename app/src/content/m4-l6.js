/**
 * content/m4-l6.js — Lesson content for Module 4, Lesson 6.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM4L6Output(entries) {
  const expected = ["1", "2", "1"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! Each returned function retained its own private count after createCounter returned.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected the counter sequence ${expected.join(", ")}, but received ${
      actual.length ? actual.join(", ") : "no output"
    }. Increment and return the captured count; each call to createCounter needs its own count.`,
  };
}

export const validateM4L6Exercise = createBaseValidator(checkM4L6Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the nested function braces and return statements.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of count and createCounter.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that createCounter returns a function before it is called.`,
});

export const lessonM4L6 = {
  lessonId: "m4-l6",
  moduleId: "m4",
  moduleTitle: "Module 4: Functions",
  title: "Closures",
  estimatedMinutes: 25,
  prerequisites: ["m4-l5"],
  objectives: [
    "Explain how an inner function retains access to bindings after the outer function returns.",
    "Create a closure that retains private state.",
    "Distinguish state held by two separately created closures.",
  ],
  starterCode: `// Module 4, Lesson 6 — Exercise: Create Independent Counters
function createCounter() {
  let count = 0;
  return function () {
    // Increase count and return it.
  };
}

const firstCounter = createCounter();
console.log(firstCounter());
console.log(firstCounter());

const secondCounter = createCounter();
console.log(secondCounter());
`,
  sections: [
    {
      id: "closure-retains-binding",
      heading: "1. A Returned Function Remembers Its Scope",
      content: `
        <p>A closure is a function together with access to bindings from its lexical
        environment. An inner function can keep using a binding even after the outer
        function has returned.</p>
        <pre><code>function createCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}</code></pre>
      `,
    },
    {
      id: "private-state",
      heading: "2. Keep State Private",
      content: `
        <p>The <code>count</code> binding is local to <code>createCounter</code>. Code
        outside cannot access that name directly, but the returned inner function can
        update and return it.</p>
        <pre><code>const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2</code></pre>
      `,
    },
    {
      id: "independent-closures",
      heading: "3. Create Independent Closure State",
      content: `
        <p>Each call to <code>createCounter()</code> creates a new local
        <code>count</code>. The returned functions retain different bindings.</p>
        <pre><code>const firstCounter = createCounter();
const secondCounter = createCounter();
console.log(firstCounter());  // 1
console.log(secondCounter()); // 1</code></pre>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Predict the Counters",
      content: `
        <div class="concept-card">
          <h4>Trace each retained binding</h4>
          <ul>
            <li>The first call to <code>firstCounter()</code> returns 1.</li>
            <li>The next call to <code>firstCounter()</code> returns 2.</li>
            <li>A newly created <code>secondCounter()</code> starts with its own count at 0, so its first call returns 1.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "A closure retains access to lexical bindings used by its function.",
    "A returned inner function can preserve and update private state after its outer function returns.",
    "Each call that creates a closure can give it independent state.",
  ],
  exercise: {
    id: "m4-l6-ex1",
    title: "Exercise: Create Independent Counters",
    prompt:
      "Complete the returned function so the first counter prints 1 then 2, and a separately created second counter prints 1.",
    expectedOutput: "1\n2\n1",
    starterCode: `// Module 4, Lesson 6 — Exercise: Create Independent Counters
function createCounter() {
  let count = 0;
  return function () {
    // Increase count and return it.
  };
}

const firstCounter = createCounter();
console.log(firstCounter());
console.log(firstCounter());

const secondCounter = createCounter();
console.log(secondCounter());
`,
    hints: [
      "The inner function can still access count after createCounter returns. Increase that saved count on every call.",
      "Inside the returned function, write count++; and then return count;.",
    ],
    validate: validateM4L6Exercise,
  },
};
