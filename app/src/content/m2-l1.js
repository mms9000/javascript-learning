/**
 * content/m2-l1.js — Lesson content for Module 2, Lesson 1.
 *
 * Title: "Strings, Numbers, Booleans, null, and undefined"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 2, Lesson 1.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM2L1Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'No output was printed. Use console.log(typeof "Code");, console.log(typeof 42);, and console.log(typeof true);.',
    };
  }

  if (entries.length < 3) {
    return {
      passed: false,
      status: "mismatch",
      message: `Expected 3 lines of output, but only received ${entries.length}. Make sure to print the typeof "Code", typeof 42, and typeof true on separate lines.`,
    };
  }

  if (entries.length > 3) {
    return {
      passed: false,
      status: "mismatch",
      message: `Expected exactly 3 lines of output, but received ${entries.length}. Remove any extra console.log() statements.`,
    };
  }

  const actuals = entries.map((e) => stripTrailingNewlines(e.text));
  const expected = ["string", "number", "boolean"];

  // Check exact sequential match
  if (actuals[0] === expected[0] && actuals[1] === expected[1] && actuals[2] === expected[2]) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You used the typeof operator to inspect and output the runtime types of a string, number, and boolean.",
    };
  }

  // Check case mismatch
  if (
    actuals[0].toLowerCase() === expected[0] &&
    actuals[1].toLowerCase() === expected[1] &&
    actuals[2].toLowerCase() === expected[2]
  ) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'Capitalization mismatch: The typeof operator returns lowercase strings ("string", "number", "boolean").',
    };
  }

  // Check inverted order or missing specific types
  if (actuals.includes("string") && actuals.includes("number") && actuals.includes("boolean")) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'Line order mismatch: Print typeof "Code" on line 1, typeof 42 on line 2, and typeof true on line 3.',
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected "string", "number", and "boolean" on separate lines, but received: ${actuals.map((s) => `"${s}"`).join(", ")}.`,
  };
}

/**
 * Automated validator for Module 2, Lesson 1 interactive exercise.
 */
export const validateM2L1Exercise = createBaseValidator(checkM2L1Output, {
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check that your typeof expressions and console.log calls have matching quotes and parentheses.`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. Check the spelling and capitalization of console.log and typeof.`,
  typeErrorMessage: (msg) =>
    `Type Error: ${msg}. Ensure console.log is called as a function with parentheses.`,
});

export const lessonM2L1 = {
  lessonId: "m2-l1",
  moduleId: "m2",
  moduleTitle: "Module 2: Values and Variables",
  title: "Strings, Numbers, Booleans, null, and undefined",
  estimatedMinutes: 20,
  prerequisites: ["m1-l4"],
  objectives: [
    "Identify the five core primitive types in JavaScript: string, number, boolean, null, and undefined.",
    "Use the typeof operator to inspect the data type of an expression.",
    "Explain the difference between undefined (unassigned) and null (intentional absence).",
    "Recognize the historical JavaScript quirk where typeof null === 'object'.",
  ],
  starterCode: `// Module 2, Lesson 1 — Exercise: Inspecting Primitive Types
// Print the typeof "Code", typeof 42, and typeof true on separate lines.
console.log(typeof "Code");
`,
  sections: [
    {
      id: "values-and-primitives",
      heading: "1. Values and Primitive Types",
      title: "1. Values and Primitive Types",
      content: `
        <p>
          Every piece of data processed by a JavaScript program has a <strong>type</strong>.
          In JavaScript, data is divided into two broad categories: <strong>primitive types</strong> and <strong>objects</strong>.
        </p>
        <p>
          A <strong>primitive value</strong> is a fundamental, atomic building block of data.
          Primitive values are immutable (they cannot be changed in-place in memory).
          JavaScript defines seven primitive types in total:
        </p>
        <ul>
          <li><strong>string</strong> — Text sequences enclosed in quotes.</li>
          <li><strong>number</strong> — Numeric values (both integers and decimals).</li>
          <li><strong>boolean</strong> — Logical values: <code>true</code> or <code>false</code>.</li>
          <li><strong>null</strong> — An intentional, explicit absence of any value or object.</li>
          <li><strong>undefined</strong> — The default value of a variable that has been declared but not assigned.</li>
          <li><strong>bigint</strong> — Specialized arbitrary-precision integers (advanced).</li>
          <li><strong>symbol</strong> — Specialized unique tokens used for object property keys (advanced).</li>
        </ul>
        <div class="example-box">
          <p><strong>Note on Advanced Primitives:</strong></p>
          <p class="example-explanation">
            While <code>bigint</code> and <code>symbol</code> are valid primitives, the first five—<code>string</code>,
            <code>number</code>, <code>boolean</code>, <code>null</code>, and <code>undefined</code>—are the core
            primitives you will use every day. Mastering these five gives you everything needed to build robust programs.
          </p>
        </div>
      `,
    },
    {
      id: "strings-numbers-booleans",
      heading: "2. Strings, Numbers, and Booleans",
      title: "2. Strings, Numbers, and Booleans",
      content: `
        <p>
          Let's examine the three most active primitives:
        </p>
        <ul>
          <li>
            <strong>Strings:</strong> Represent textual data. Strings can be enclosed in double quotes <code>"hello"</code>
            or single quotes <code>'hello'</code>.
          </li>
          <li>
            <strong>Numbers:</strong> In JavaScript, all numbers share a single type: <code>number</code>.
            Unlike some languages with separate types for integers and decimals (like <code>int</code> and <code>float</code>),
            JavaScript numbers are 64-bit floating-point numbers. Both <code>42</code> and <code>3.14</code> have type <code>number</code>.
          </li>
          <li>
            <strong>Booleans:</strong> Represent logical truth with exactly two possible values: <code>true</code> or <code>false</code>.
            Notice that booleans are written without quotes: <code>true</code> is a boolean, but <code>"true"</code> is a string!
          </li>
        </ul>
      `,
    },
    {
      id: "undefined-and-null",
      heading: "3. undefined vs. null: Representing Emptiness",
      title: "3. undefined vs. null: Representing Emptiness",
      content: `
        <p>
          Beginners are often confused because JavaScript has two ways to represent "no value":
        </p>
        <ul>
          <li>
            <strong>undefined:</strong> Means a value has not been given yet.
            If you declare a variable without setting a value, the JavaScript engine assigns it <code>undefined</code> by default.
          </li>
          <li>
            <strong>null:</strong> An intentional, explicit placeholder.
            Programmers assign <code>null</code> to indicate "this value is deliberately empty or unknown."
          </li>
        </ul>
      `,
    },
    {
      id: "typeof-operator",
      heading: "4. Inspecting Types with the typeof Operator",
      title: "4. Inspecting Types with the typeof Operator",
      content: `
        <p>
          You can inspect the type of any value or variable using the built-in <code>typeof</code> operator:
        </p>
        <div class="example-box">
          <pre><code>console.log(typeof "Hello");  // "string"
console.log(typeof 100);      // "number"
console.log(typeof false);    // "boolean"
console.log(typeof undefined);// "undefined"
console.log(typeof null);     // "object" (historic quirk!)</code></pre>
          <p class="example-explanation">
            <strong>The typeof null Bug:</strong> In the first version of JavaScript in 1995, values were stored with type tags.
            Due to an implementation detail in how objects and <code>null</code> were encoded, <code>typeof null</code> returned <code>"object"</code>.
            Fixing this bug today would break millions of older websites, so it remains a permanent, famous quirk of the language.
            Remember: <code>null</code> is a primitive type, even though <code>typeof null</code> reports <code>"object"</code>!
          </p>
        </div>
      `,
    },
    {
      id: "comprehension-check",
      heading: "5. Comprehension Check: Daily Primitives",
      title: "5. Comprehension Check: Daily Primitives",
      content: `
        <div class="concept-card">
          <h4>Quick Concept Check: What are the types?</h4>
          <p>Consider the following expressions. What does each <code>typeof</code> call evaluate to?</p>
          <ul>
            <li><code>typeof "42"</code> &rarr; <em>string</em> (enclosed in quotes)</li>
            <li><code>typeof 42</code> &rarr; <em>number</em> (numeric literal)</li>
            <li><code>typeof (5 > 3)</code> &rarr; <em>boolean</em> (comparison yields true)</li>
            <li><code>typeof null</code> &rarr; <em>object</em> (historic JavaScript quirk)</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "JavaScript features seven primitive types; the five daily primitives are string, number, boolean, null, and undefined.",
    "bigint and symbol are specialized primitives reserved for advanced applications.",
    "Numbers in JavaScript are 64-bit floating point; integers and decimals share the number type.",
    "Booleans have only two values: true and false (written without quotes).",
    "undefined represents unassigned values; null represents an intentional empty value.",
    "The typeof operator returns a lowercase string naming the type, with the historic exception of typeof null === 'object'.",
  ],
  exercise: {
    id: "m2-l1-ex1",
    title: "Exercise: Inspecting Primitive Types",
    prompt:
      'Use console.log() and the typeof operator to print the data types of three different values: the string "Code", the number 42, and the boolean true, each on its own line.',
    expectedOutput: "string\nnumber\nboolean",
    starterCode: `// Module 2, Lesson 1 — Exercise: Inspecting Primitive Types
// Print the typeof "Code", typeof 42, and typeof true on separate lines.
console.log(typeof "Code");
`,
    hints: [
      'Add two more console.log() statements below the first one. Use typeof 42 for line 2 and typeof true for line 3.',
      'Your corrected code should be:\nconsole.log(typeof "Code");\nconsole.log(typeof 42);\nconsole.log(typeof true);',
    ],
    validate: validateM2L1Exercise,
  },
};
