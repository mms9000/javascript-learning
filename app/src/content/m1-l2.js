/**
 * content/m1-l2.js — Lesson content for Module 1, Lesson 2.
 *
 * Title: "Your First Program and console.log()"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 1, Lesson 2.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM1L2Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message: 'No output was printed. Did you call console.log() twice?',
    };
  }

  if (entries.length === 1) {
    const singleLine = stripTrailingNewlines(entries[0].text);
    if (singleLine === "Player Score:") {
      return {
        passed: false,
        status: "mismatch",
        message: 'Line 1 was printed, but Line 2 is missing. Add a second statement: console.log(100);',
      };
    }
    return {
      passed: false,
      status: "mismatch",
      message: `Only 1 output line was detected ("${singleLine}"). The exercise requires two separate statements.`,
    };
  }

  if (entries.length > 2) {
    return {
      passed: false,
      status: "mismatch",
      message: `Multiple extra output lines detected (${entries.length} lines). The exercise expects exactly two output lines.`,
    };
  }

  // Exactly 2 output lines
  const line1 = stripTrailingNewlines(entries[0].text);
  const line2 = stripTrailingNewlines(entries[1].text);

  // Check for inverted order (reinforcing sequential execution principle)
  if (line1 === "100" && line2 === "Player Score:") {
    return {
      passed: false,
      status: "mismatch",
      message: 'Inverted order: JavaScript runs statements sequentially top-to-bottom. Log "Player Score:" first, then log 100.',
    };
  }

  const expectedLine1 = "Player Score:";
  const expectedLine2 = "100";

  // Check line 1
  if (line1 !== expectedLine1) {
    if (line1.toLowerCase() === expectedLine1.toLowerCase()) {
      return {
        passed: false,
        status: "mismatch",
        message: `Line 1 capitalization mismatch: Expected "${expectedLine1}", but received "${line1}".`,
      };
    }
    return {
      passed: false,
      status: "mismatch",
      message: `Line 1 mismatch: Expected "${expectedLine1}", but received "${line1}".`,
    };
  }

  // Check line 2
  if (line2 !== expectedLine2) {
    return {
      passed: false,
      status: "mismatch",
      message: `Line 2 mismatch: Expected number ${expectedLine2}, but received "${line2}".`,
    };
  }

  return {
    passed: true,
    status: "success",
    message: "Success! You printed both lines in sequential order.",
  };
}

/**
 * Automated validator for Module 1, Lesson 2 interactive exercise.
 *
 * Evaluates the actual runner execution results and output entries.
 * Note on execution boundary:
 * The Web Worker postMessage protocol serializes console arguments to text.
 * This validator verifies that the received output stream matches "Player Score:"
 * followed by "100". It does not claim to verify the in-memory JavaScript type.
 */
export const validateM1L2Exercise = createBaseValidator(checkM1L2Output, {
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check that each statement has matching parentheses and quotation marks.`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. Check the spelling and capitalization of console.log.`,
  typeErrorMessage: (msg) =>
    `Type Error: ${msg}. Ensure console.log is called as a function.`,
});

export const lessonM1L2 = {
  lessonId: "m1-l2",
  moduleId: "m1",
  moduleTitle: "Module 1: Getting Started",
  title: "Your First Program and console.log()",
  estimatedMinutes: 15,
  prerequisites: ["m1-l1"],
  objectives: [
    "Understand that JavaScript statements execute sequentially from top to bottom.",
    "Use console.log() to output text strings and numbers on separate lines.",
    "Distinguish between text string literals in quotation marks and unquoted numeric literals.",
  ],
  starterCode: `// Module 1, Lesson 2: Sequential Output\nconsole.log("Player Score:");\nconsole.log(100);\n`,
  exercise: {
    id: "m1-l2-ex1",
    title: "Exercise: Sequential Output",
    prompt: 'Write a two-line program using console.log(). Line 1 should print "Player Score:" and Line 2 should print the number 100.',
    expectedOutput: "Player Score:\n100",
    starterCode: `// Module 1, Lesson 2 — Exercise: Sequential Output\n// Line 1 is provided below. Add Line 2 to print the number 100.\nconsole.log("Player Score:");\n`,
    hints: [
      "Add a new line below line 1. Call console.log() with the number 100 inside parentheses without quotation marks.",
      'Your code should contain two lines:\nconsole.log("Player Score:");\nconsole.log(100);',
    ],
    validate: validateM1L2Exercise,
  },
  sections: [
    {
      id: "sequential-execution",
      heading: "How Programs Run: Sequential Execution",
      content: `
        <p>
          A computer program is a list of instructions executed by the JavaScript engine.
          By default, JavaScript processes code <strong>sequentially from top to bottom</strong>, one statement at a time.
        </p>
        <p>
          Each time you call <code>console.log()</code>, the message is sent to the console and a new line begins.
          Subsequent calls will appear below prior ones in the exact order they were written.
        </p>
      `,
    },
    {
      id: "multiple-lines",
      heading: "Printing Multiple Statements",
      content: `
        <p>
          To print multiple lines of output, write multiple statements on separate lines:
        </p>
        <div class="example-box">
          <pre><code>console.log("First line");\nconsole.log("Second line");</code></pre>
          <p class="example-explanation">
            When this program runs, the JavaScript engine executes the first line, waits for it to finish, and then proceeds immediately to the second line.
          </p>
        </div>
      `,
    },
    {
      id: "strings-vs-numbers",
      heading: "Text Strings vs. Numbers",
      content: `
        <p>
          In JavaScript, text and numbers are handled differently:
        </p>
        <ul>
          <li><strong>Strings (Text):</strong> Always wrapped in quotation marks, such as <code>"Player Score:"</code> or <code>'Hello'</code>. The quotes tell JavaScript: <em>"Treat this as literal characters, not instructions."</em></li>
          <li><strong>Numbers:</strong> Written directly without quotation marks, such as <code>100</code>, <code>42</code>, or <code>3.14</code>. Because they are mathematical values, no quotes are needed.</li>
        </ul>
        <div class="example-box">
          <pre><code>console.log("Points earned:");\nconsole.log(50);</code></pre>
        </div>
      `,
    },
  ],
  summary: [
    "JavaScript executes code sequentially from top to bottom, one statement after another.",
    "Multiple console.log() calls produce multiple ordered lines of output.",
    "Text strings require quotation marks; numeric values are written without quotation marks.",
  ],
};
