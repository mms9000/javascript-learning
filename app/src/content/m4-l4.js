/**
 * content/m4-l4.js — Lesson content for Module 4, Lesson 4.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM4L4Output(entries) {
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.length === 1 && actual[0] === "learner: JavaScript") {
    return {
      passed: true,
      status: "success",
      message: "Success! The function used its local binding and read the enclosing courseName binding.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected one line, "learner: JavaScript", but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Return the local audience together with courseName from the enclosing scope.`,
  };
}

export const validateM4L4Exercise = createBaseValidator(checkM4L4Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the function braces and return expression.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and scope of audience and courseName.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that makeMessage returns a string value.`,
});

export const lessonM4L4 = {
  lessonId: "m4-l4",
  moduleId: "m4",
  moduleTitle: "Module 4: Functions",
  title: "Scope and Lexical Scope",
  estimatedMinutes: 20,
  prerequisites: ["m4-l3"],
  objectives: [
    "Identify a function-local binding.",
    "Explain access to a binding in an enclosing lexical scope.",
    "Distinguish lexical lookup from the order in which functions are called.",
  ],
  starterCode: `// Module 4, Lesson 4 — Exercise: Read from an Enclosing Scope
const courseName = "JavaScript";

function makeMessage() {
  const audience = "learner";
  // Return audience, followed by ": ", followed by courseName.
}

console.log(makeMessage());
`,
  sections: [
    {
      id: "local-scope",
      heading: "1. A Function Has Local Bindings",
      content: `
        <p>A variable declared inside a function is local to that function. Code outside
        the function cannot use that local name.</p>
        <pre><code>function makeMessage() {
  const audience = "learner";
  return audience;
}</code></pre>
      `,
    },
    {
      id: "lexical-scope",
      heading: "2. Read from an Enclosing Scope",
      content: `
        <p>A function can also read bindings from the surrounding scope where it was
        written. JavaScript looks outward through these nested lexical scopes.</p>
        <pre><code>const courseName = "JavaScript";

function makeMessage() {
  const audience = "learner";
  return audience + ": " + courseName;
}</code></pre>
      `,
    },
    {
      id: "where-functions-are-written",
      heading: "3. Scope Follows Where Code Is Written",
      content: `
        <p>Lexical scope is determined by where a function is defined in the code.
        Lexical lookup follows where it was written, not which function happened to call
        it. If a name is not in the function's local
        or enclosing scopes, that function cannot read it.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Which Names Are Available?",
      content: `
        <div class="concept-card">
          <h4>Trace the bindings</h4>
          <ul>
            <li><code>audience</code> is local to <code>makeMessage</code>.</li>
            <li><code>courseName</code> is in an enclosing scope and can be read inside.</li>
            <li><code>audience</code> cannot be read after <code>makeMessage</code> ends.</li>
            <li>Lexical lookup follows where the function is written.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "A function-local binding is available inside that function, not outside it.",
    "A function can read bindings in its enclosing lexical scopes.",
    "Lexical scope follows where code is written, not the order of function calls.",
  ],
  exercise: {
    id: "m4-l4-ex1",
    title: "Exercise: Read from an Enclosing Scope",
    prompt:
      'Complete makeMessage so it returns exactly "learner: JavaScript" using both the local audience and enclosing courseName.',
    expectedOutput: "learner: JavaScript",
    starterCode: `// Module 4, Lesson 4 — Exercise: Read from an Enclosing Scope
const courseName = "JavaScript";

function makeMessage() {
  const audience = "learner";
  // Return audience, followed by ": ", followed by courseName.
}

console.log(makeMessage());
`,
    hints: [
      "audience is local to makeMessage. courseName is outside it in an enclosing scope, so the function can read both names.",
      'Return audience + ": " + courseName; from makeMessage.',
    ],
    validate: validateM4L4Exercise,
  },
};
