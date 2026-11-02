/**
 * content/m2-l3.js — Lesson content for Module 2, Lesson 3.
 *
 * Title: "Reassignment and Value Mutability"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 2, Lesson 3.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM2L3Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message:
        "No output was printed. Change 'const score = 10;' to 'let score = 10;' so the program runs cleanly.",
    };
  }

  if (entries.length === 1) {
    return {
      passed: false,
      status: "mismatch",
      message: `Only 1 line of output detected ("${stripTrailingNewlines(entries[0].text)}"). The exercise expects 2 lines: "10" followed by "25".`,
    };
  }

  if (entries.length > 2) {
    return {
      passed: false,
      status: "mismatch",
      message: `Multiple extra output lines detected (${entries.length} lines). The exercise expects exactly two lines: "10" on line 1 and "25" on line 2.`,
    };
  }

  const line1 = stripTrailingNewlines(entries[0].text);
  const line2 = stripTrailingNewlines(entries[1].text);

  const expectedLine1 = "10";
  const expectedLine2 = "25";

  if (line1 === expectedLine1 && line2 === expectedLine2) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You changed const to let, allowing the variable to be reassigned to 25 and printed without error.",
    };
  }

  if (line1 === expectedLine2 && line2 === expectedLine1) {
    return {
      passed: false,
      status: "mismatch",
      message: "Line order inverted: Print initial score (10) first, then the updated score (25).",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected line 1 = "10" and line 2 = "25", but received "${line1}" and "${line2}".`,
  };
}

/**
 * Automated validator for Module 2, Lesson 3 interactive exercise.
 * Evaluates runner status and discriminates const reassignment TypeErrors reliably.
 */
export const validateM2L3Exercise = createBaseValidator(checkM2L3Output, {
  typeErrorMessage: (errMsg) => {
    // Reliably identifies V8 ("Assignment to constant variable.") and SpiderMonkey ("invalid assignment to const 'score'")
    const isConstReassignment = /assignment to const/i.test(errMsg);

    if (isConstReassignment) {
      return (
        "TypeError: You cannot reassign a variable declared with const. " +
        "Change 'const score' to 'let score' so the variable's value can be updated."
      );
    }

    // Ambiguous Safari messages ("Attempted to assign to readonly property.") and unrelated TypeErrors route to generic fallback
    return `Type Error: ${errMsg}. Check that variables and functions are used with compatible types.`;
  },
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check that you did not accidentally re-declare score using 'let score = 25;' when reassigning.`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. Check the spelling and capitalization of score and console.log.`,
});

export const lessonM2L3 = {
  lessonId: "m2-l3",
  moduleId: "m2",
  moduleTitle: "Module 2: Values and Variables",
  title: "Reassignment and Value Mutability",
  estimatedMinutes: 15,
  prerequisites: ["m2-l2"],
  objectives: [
    "Distinguish between variable declaration and variable reassignment.",
    "Explain that primitive values in JavaScript are strictly immutable.",
    "Recognize and diagnose a TypeError when reassigning a const variable.",
    "Understand that const binds the variable name and does not freeze object contents.",
  ],
  starterCode: `// Module 2, Lesson 3 — Exercise: Reassignment and Value Mutability
// Fix the error by changing const to let so score can be updated.
const score = 10;
console.log(score);

score = 25;
console.log(score);
`,
  sections: [
    {
      id: "reassignment-syntax",
      heading: "1. Variable Reassignment Syntax",
      title: "1. Variable Reassignment Syntax",
      content: `
        <p>
          Once a variable has been declared with <code>let</code>, you can give it a new value at any time.
          This is called <strong>reassignment</strong>.
        </p>
        <p>
          Notice how reassignment is written:
        </p>
        <div class="example-box">
          <pre><code>let score = 10; // 1. Declaration with let
score = 25;     // 2. Reassignment (no let or const keyword!)
console.log(score); // 25</code></pre>
          <p class="example-explanation">
            <strong>Common Mistake:</strong> You only write <code>let</code> once when the variable is first created.
            Do not write <code>let score = 25;</code> on line 2; writing <code>let</code> again attempts to
            <em>re-declare</em> an existing identifier and causes a <em>SyntaxError: Identifier 'score' has already been declared</em>.
          </p>
        </div>
      `,
    },
    {
      id: "const-type-error",
      heading: "2. The TypeError of Reassigning const",
      title: "2. The TypeError of Reassigning const",
      content: `
        <p>
          If you declare a variable using <code>const</code>, the JavaScript engine permanently protects that binding.
          Attempting to reassign a <code>const</code> variable halts program execution and throws a <strong>TypeError</strong>:
        </p>
        <div class="example-box">
          <pre><code>const maxScore = 100;
maxScore = 200; // TypeError: Assignment to constant variable.</code></pre>
          <p class="example-explanation">
            The engine is telling you: "You promised this name was a constant, but your code is attempting to point it to something else."
            To allow reassignment, change the declaration keyword from <code>const</code> to <code>let</code>.
          </p>
        </div>
      `,
    },
    {
      id: "binding-vs-value-mutability",
      heading: "3. Binding Mutability vs. Value Mutability",
      title: "3. Binding Mutability vs. Value Mutability",
      content: `
        <p>
          A vital concept in computer science is the difference between:
        </p>
        <ol>
          <li><strong>The Binding (Variable Name):</strong> The label pointing to a location in memory.</li>
          <li><strong>The Value:</strong> The actual data stored in memory.</li>
        </ol>
        <p>
          In JavaScript, <strong>all primitive values are completely immutable</strong>.
          You cannot alter the number <code>10</code> or modify the string <code>"hello"</code> in memory.
          When you execute:
        </p>
        <div class="example-box">
          <pre><code>let count = 10;
count = 25;</code></pre>
          <p class="example-explanation">
            The number <code>10</code> does not mutate into <code>25</code>.
            Instead, the engine creates the number <code>25</code> in memory and points the binding <code>count</code> to it.
            Declaring with <code>let</code> means the <em>binding</em> is mutable (it can point to different values).
          </p>
        </div>
      `,
    },
    {
      id: "const-and-objects-preview",
      heading: "4. const Binds Identifiers, Not Object Contents",
      title: "4. const Binds Identifiers, Not Object Contents",
      content: `
        <p>
          Later in Module 5, you will learn about complex data structures called <strong>objects</strong> and <strong>arrays</strong>.
        </p>
        <p>
          It is helpful to know right now: <code>const</code> prevents <em>reassigning</em> the variable identifier to a different object.
          However, <code>const</code> does <em>not</em> automatically freeze an object's internal properties.
          We will explore object mutation in depth when we reach Module 5; for primitive numbers, strings, and booleans,
          <code>const</code> prevents any change whatsoever.
        </p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "5. Comprehension Check: Reassignment & Immutability",
      title: "5. Comprehension Check: Reassignment & Immutability",
      content: `
        <div class="concept-card">
          <h4>Concept Check: Predict the Outcome</h4>
          <p>What happens when each code snippet runs?</p>
          <ul>
            <li>
              <code>const speed = 50; speed = 60;</code> &rarr;
              <strong>Fails with TypeError</strong> (attempting to reassign a const binding).
            </li>
            <li>
              <code>let city = "Rome"; city = "Paris";</code> &rarr;
              <strong>Succeeds</strong> (let permits the binding to be reassigned to the primitive "Paris").
            </li>
            <li>
              <code>let age = 20; let age = 21;</code> &rarr;
              <strong>Fails with SyntaxError</strong> (cannot re-declare identifier 'age' in the same scope).
            </li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Reassignment points an existing variable binding to a new value without using let or const.",
    "Attempting to reassign a const variable throws a runtime TypeError: Assignment to constant variable.",
    "All primitive values in JavaScript are strictly immutable; reassignment re-binds the variable name to a new value.",
    "const locks the variable binding itself, preventing reassignment to another value or object.",
  ],
  exercise: {
    id: "m2-l3-ex1",
    title: "Exercise: Fixing the Constant Reassignment",
    prompt:
      "The starter code attempts to update a game score, but it throws a TypeError because score was declared with const. Fix the error by changing const to let on line 3 so the program runs cleanly and prints 10 followed by 25.",
    expectedOutput: "10\n25",
    starterCode: `// Module 2, Lesson 3 — Exercise: Reassignment and Value Mutability
// Fix the error by changing const to let so score can be updated.
const score = 10;
console.log(score);

score = 25;
console.log(score);
`,
    hints: [
      "Change the declaration keyword 'const' on line 3 to 'let'. Leave the reassignment 'score = 25;' on line 6 unchanged.",
      'Your corrected code should begin with:\nlet score = 10;\nconsole.log(score);\nscore = 25;\nconsole.log(score);',
    ],
    validate: validateM2L3Exercise,
  },
};
