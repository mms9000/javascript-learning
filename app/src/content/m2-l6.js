/**
 * content/m2-l6.js — Lesson content for Module 2, Lesson 6.
 *
 * Title: "Equality and Comparisons"
 * Module 2 Milestone: "Build a simple calculator using variables and expressions."
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 2, Lesson 6.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM2L6Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message:
        "No output was printed. Calculate finalTotal, isUnderBudget, and isTargetTotal, then log all three values.",
    };
  }

  if (entries.length < 3) {
    return {
      passed: false,
      status: "mismatch",
      message: `Expected 3 lines of output, but only received ${entries.length}. Log finalTotal, isUnderBudget, and isTargetTotal on separate lines.`,
    };
  }

  if (entries.length > 3) {
    return {
      passed: false,
      status: "mismatch",
      message: `Multiple extra output lines detected (${entries.length} lines). The exercise expects exactly 3 lines: finalTotal, isUnderBudget, and isTargetTotal.`,
    };
  }

  const line1 = stripTrailingNewlines(entries[0].text);
  const line2 = stripTrailingNewlines(entries[1].text);
  const line3 = stripTrailingNewlines(entries[2].text);

  const expectedLine1 = "74";
  const expectedLine2 = "true";
  const expectedLine3 = "true";

  if (line1 === expectedLine1 && line2 === expectedLine2 && line3 === expectedLine3) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You completed the Module 2 Milestone: building a simple calculator with variables, arithmetic expressions, relational comparisons, and strict equality.",
    };
  }

  // Diagnostic for wrong finalTotal calculation
  if (line1 !== expectedLine1) {
    return {
      passed: false,
      status: "mismatch",
      message: `finalTotal calculation mismatch: Expected "${expectedLine1}", but received "${line1}". Formula: (price + (price * taxRate)) - discount. (80 + 4 - 10 = 74).`,
    };
  }

  // Diagnostic for wrong isUnderBudget comparison
  if (line2 !== expectedLine2) {
    return {
      passed: false,
      status: "mismatch",
      message: `isUnderBudget comparison mismatch: Expected "true", but received "${line2}". Check your relational comparison: finalTotal <= 75.`,
    };
  }

  // Diagnostic for wrong isTargetTotal comparison
  if (line3 !== expectedLine3) {
    return {
      passed: false,
      status: "mismatch",
      message: `isTargetTotal equality check mismatch: Expected "true", but received "${line3}". Use strict equality: finalTotal === 74.`,
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected lines: "${expectedLine1}", "${expectedLine2}", "${expectedLine3}". Received: "${line1}", "${line2}", "${line3}".`,
  };
}

/**
 * Automated validator for Module 2, Lesson 6 interactive exercise.
 */
export const validateM2L6Exercise = createBaseValidator(checkM2L6Output, {
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check parentheses and operators: (price + (price * taxRate)) - discount, finalTotal <= 75, and finalTotal === 74.`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. Check the spelling and capitalization of price, taxRate, discount, finalTotal, isUnderBudget, isTargetTotal, and console.log.`,
  typeErrorMessage: (msg) =>
    `Type Error: ${msg}. Ensure variables are numbers and comparison operators are used properly.`,
});

export const lessonM2L6 = {
  lessonId: "m2-l6",
  moduleId: "m2",
  moduleTitle: "Module 2: Values and Variables",
  title: "Equality and Comparisons",
  estimatedMinutes: 15,
  prerequisites: ["m2-l5"],
  objectives: [
    "Compare values using strict equality (===) and strict inequality (!==).",
    "Explain why loose equality (==) produces unexpected bugs due to coercion.",
    "Use relational operators (>, <, >=, <=) evaluating to boolean outcomes.",
    "Build a simple calculator using variables, expressions, and comparisons.",
  ],
  starterCode: `// Module 2, Lesson 6 — Milestone Exercise: Simple Calculator
// Build a calculator that computes a final total and evaluates comparisons.
const price = 80;
const taxRate = 0.05;
let discount = 10;

// 1. Calculate finalTotal: (price + (price * taxRate)) - discount
const finalTotal = 0; // Replace with formula

// 2. Check if finalTotal is less than or equal to 75
const isUnderBudget = false; // Replace with comparison

// 3. Check if finalTotal is strictly equal to 74
const isTargetTotal = false; // Replace with strict equality check

console.log(finalTotal);
console.log(isUnderBudget);
console.log(isTargetTotal);
`,
  sections: [
    {
      id: "strict-vs-loose-equality",
      heading: "1. Strict Equality (===) vs. Loose Equality (==)",
      title: "1. Strict Equality (===) vs. Loose Equality (==)",
      content: `
        <p>
          In JavaScript, there are two distinct equality operators:
        </p>
        <ul>
          <li>
            <strong>Strict Equality (===):</strong> Compares both the <em>value</em> and the <em>type</em> without coercion.
            If the types differ, it returns <code>false</code> immediately.
            <code>5 === 5</code> is <code>true</code>, but <code>5 === "5"</code> is <code>false</code>.
          </li>
          <li>
            <strong>Loose Equality (==):</strong> Attempts to coerce the operands into a common type before comparing.
            This leads to notoriously surprising behavior: <code>0 == ""</code> is <code>true</code>,
            and <code>false == "0"</code> is <code>true</code>!
          </li>
        </ul>
        <div class="example-box">
          <p><strong>Universal Best Practice:</strong></p>
          <p class="example-explanation">
            Always use <strong>strict equality (===)</strong>. Never use loose equality (==).
            Strict equality ensures your comparisons are explicit, predictable, and free of accidental coercion bugs.
          </p>
        </div>
      `,
    },
    {
      id: "inequality-operators",
      heading: "2. Inequality Operators (!== vs. !=)",
      title: "2. Inequality Operators (!== vs. !=)",
      content: `
        <p>
          Similarly, inequality has two forms:
        </p>
        <ul>
          <li><strong>Strict Inequality (!==):</strong> Returns <code>true</code> if values or types are different.
          <code>5 !== "5"</code> is <code>true</code> (different types!).</li>
          <li><strong>Loose Inequality (!=):</strong> Coerces types before checking inequality (avoid!).</li>
        </ul>
        <p>
          Just like strict equality, always use <strong>strict inequality (!==)</strong>.
        </p>
      `,
    },
    {
      id: "relational-comparisons",
      heading: "3. Relational Comparison Operators",
      title: "3. Relational Comparison Operators",
      content: `
        <p>
          Relational operators compare numbers or numeric expressions:
        </p>
        <ul>
          <li><code>&gt;</code> — Greater than: <code>10 &gt; 5</code> &rarr; <code>true</code></li>
          <li><code>&lt;</code> — Less than: <code>5 &lt; 10</code> &rarr; <code>true</code></li>
          <li><code>&gt;=</code> — Greater than or equal to: <code>10 &gt;= 10</code> &rarr; <code>true</code></li>
          <li><code>&lt;=</code> — Less than or equal to: <code>74 &lt;= 75</code> &rarr; <code>true</code></li>
        </ul>
        <p>
          Notice that every comparison evaluates to a <strong>boolean</strong> value: either <code>true</code> or <code>false</code>.
        </p>
      `,
    },
    {
      id: "milestone-summary",
      heading: "4. Milestone: Building a Simple Calculator",
      title: "4. Milestone: Building a Simple Calculator",
      content: `
        <p>
          Congratulations on reaching the final lesson of Module 2!
          In this milestone exercise, you bring together everything you have learned:
        </p>
        <ol>
          <li><strong>Variable declarations:</strong> <code>const</code> for unchanging inputs and <code>let</code> for discounts.</li>
          <li><strong>Arithmetic expressions:</strong> Multiplication, addition, and subtraction with grouping parentheses.</li>
          <li><strong>Relational comparison:</strong> Checking if a computed total satisfies a budget threshold (<code>&lt;=</code>).</li>
          <li><strong>Strict equality:</strong> Verifying exact numeric totals with <code>===</code>.</li>
        </ol>
      `,
    },
    {
      id: "comprehension-check",
      heading: "5. Comprehension Check: Strict vs. Loose Comparisons",
      title: "5. Comprehension Check: Strict vs. Loose Comparisons",
      content: `
        <div class="concept-card">
          <h4>Concept Check: Predict the Comparison Results</h4>
          <ul>
            <li><code>10 === "10"</code> &rarr; <strong>false</strong> (strict equality checks types; number vs string).</li>
            <li><code>10 == "10"</code> &rarr; <strong>true</strong> (loose equality coerces the string to number).</li>
            <li><code>null === undefined</code> &rarr; <strong>false</strong> (different primitive types).</li>
            <li><code>74 <= 75</code> &rarr; <strong>true</strong> (74 is less than 75).</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Always use strict equality (===) and strict inequality (!==) to prevent unexpected type coercion bugs.",
    "Loose equality (==) coerces operands and can produce counterintuitive true results (e.g. 0 == '').",
    "Relational comparison operators (>, <, >=, <=) compare values and always evaluate to boolean true or false.",
    "Congratulations! Completing this lesson earns the Module 2 Milestone: 'Build a simple calculator using variables and expressions.'",
  ],
  exercise: {
    id: "m2-l6-ex1",
    title: "Milestone Exercise: Simple Calculator",
    prompt:
      'Build a simple calculator program. Calculate finalTotal using (price + (price * taxRate)) - discount. Then check if finalTotal <= 75 and store in isUnderBudget. Check if finalTotal === 74 and store in isTargetTotal. Log all three values.',
    expectedOutput: "74\ntrue\ntrue",
    starterCode: `// Module 2, Lesson 6 — Milestone Exercise: Simple Calculator
// Build a calculator that computes a final total and evaluates comparisons.
const price = 80;
const taxRate = 0.05;
let discount = 10;

// 1. Calculate finalTotal: (price + (price * taxRate)) - discount
const finalTotal = 0; // Replace with formula

// 2. Check if finalTotal is less than or equal to 75
const isUnderBudget = false; // Replace with comparison

// 3. Check if finalTotal is strictly equal to 74
const isTargetTotal = false; // Replace with strict equality check

console.log(finalTotal);
console.log(isUnderBudget);
console.log(isTargetTotal);
`,
    hints: [
      'For finalTotal, write:\nconst finalTotal = (price + (price * taxRate)) - discount;\n(80 * 0.05 is 4, 80 + 4 is 84, 84 - 10 is 74).',
      'For the comparisons, write:\nconst isUnderBudget = finalTotal <= 75;\nconst isTargetTotal = finalTotal === 74;',
    ],
    validate: validateM2L6Exercise,
  },
};
