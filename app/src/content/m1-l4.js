/**
 * content/m1-l4.js — Lesson content for Module 1, Lesson 4.
 *
 * Title: "Understanding Common Syntax Errors"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 1, Lesson 4.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM1L4Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'No output was printed. Make sure console.log("Syntax errors are normal!"); is present and executed.',
    };
  }

  if (entries.length > 1) {
    return {
      passed: false,
      status: "mismatch",
      message: `Multiple output lines detected (${entries.length} lines). The exercise expects exactly one line: "Syntax errors are normal!".`,
    };
  }

  const raw = String(entries[0].text ?? "");
  const actual = stripTrailingNewlines(raw);
  const expected = "Syntax errors are normal!";

  if (actual === expected) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You fixed the syntax error. The opening and closing parentheses now match, allowing the code to execute cleanly.",
    };
  }

  if (actual.toLowerCase() === expected.toLowerCase()) {
    return {
      passed: false,
      status: "mismatch",
      message: `Capitalization mismatch: Expected "${expected}" — check uppercase and lowercase characters.`,
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected "${expected}", but received "${actual}".`,
  };
}

/**
 * Automated validator for Module 1, Lesson 4 interactive exercise.
 * Evaluates actual runner execution results and output entries.
 */
export const validateM1L4Exercise = createBaseValidator(checkM1L4Output, {
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check that every opening parenthesis '(' has a matching closing parenthesis ')' before the semicolon.`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. Check the spelling and capitalization of console.log.`,
  typeErrorMessage: (msg) =>
    `Type Error: ${msg}. Ensure console.log is called properly.`,
});

export const lessonM1L4 = {
  lessonId: "m1-l4",
  moduleId: "m1",
  moduleTitle: "Module 1: Getting Started",
  title: "Understanding Common Syntax Errors",
  estimatedMinutes: 15,
  prerequisites: ["m1-l3"],
  objectives: [
    "Explain what a syntax error is and why errors are a normal, inevitable part of coding.",
    "Recognize common beginner syntax errors, including unclosed quotation marks (concept example) and missing closing parentheses.",
    "Inspect a SyntaxError report to identify what kind of mistake occurred without relying on line numbers.",
    "Locate and resolve a missing closing parenthesis in a statement by checking delimiter pairs.",
    "Reflect on achieving the Module 1 milestone: 'Run a simple program and explain its output'.",
  ],
  starterCode: `// Module 1, Lesson 4 — Exercise: Fixing Syntax Errors
// The statement below is missing its closing parenthesis.
// Fix the error so the program prints: Syntax errors are normal!
console.log("Syntax errors are normal!";
`,
  sections: [
    {
      id: "syntax-errors-normal",
      heading: "1. Syntax Errors Are Normal Feedback",
      title: "1. Syntax Errors Are Normal Feedback",
      content: `
        <p>
          JavaScript is a formal language governed by strict grammatical rules called <strong>syntax</strong>.
          When the JavaScript engine reads your code and encounters something that violates these rules, it stops parsing and reports a <strong>SyntaxError</strong>.
        </p>
        <p>
          Every programmer—from complete beginners to senior engineers—encounters syntax errors daily.
          An error is not a failure; it is simply the computer providing precise feedback that a character, quote, or parenthesis is missing or out of place.
        </p>
      `,
    },
    {
      id: "unclosed-quotes",
      heading: "2. Unclosed Quotation Marks",
      title: "2. Unclosed Quotation Marks",
      content: `
        <p>
          In JavaScript, text strings must begin and end with matching quotation marks (either double quotes <code>"</code> or single quotes <code>'</code>).
          If you forget the closing quote, the engine cannot tell where the text ends and where program instructions resume.
        </p>
        <div class="example-box">
          <p><strong>Broken Example (Missing Closing Quote):</strong></p>
          <pre><code>console.log("Welcome to JavaScript);</code></pre>
          <p class="example-explanation">
            The opening quotation mark is never closed before the end of the line, triggering a <em>SyntaxError</em> (such as "Invalid or unexpected token" or "unterminated string literal").
          </p>
        </div>
        <div class="example-box">
          <p><strong>Fixed Example (Matching Quotes):</strong></p>
          <pre><code>console.log("Welcome to JavaScript");</code></pre>
        </div>
      `,
    },
    {
      id: "missing-parentheses",
      heading: "3. Missing or Mismatched Parentheses",
      title: "3. Missing or Mismatched Parentheses",
      content: `
        <p>
          Parentheses <code>(...)</code> are used to pass information to functions like <code>console.log()</code>.
          Every opening parenthesis <code>(</code> must have a corresponding closing parenthesis <code>)</code>.
        </p>
        <div class="example-box">
          <p><strong>Broken Example (Missing Closing Parenthesis):</strong></p>
          <pre><code>console.log("Learning syntax";</code></pre>
          <p class="example-explanation">
            Here, the engine sees the semicolon <code>;</code> before the argument list has been closed, triggering a <em>SyntaxError</em>.
          </p>
        </div>
        <div class="example-box">
          <p><strong>Fixed Example (Balanced Parentheses):</strong></p>
          <pre><code>console.log("Learning syntax");</code></pre>
        </div>
      `,
    },
    {
      id: "reading-error-messages",
      heading: "4. How to Read an Error Message Calmly",
      title: "4. How to Read an Error Message Calmly",
      content: `
        <p>
          When code fails to run, the console displays an error report with two essential pieces of information:
        </p>
        <ul>
          <li><strong>Error Type:</strong> Indicates what kind of problem occurred (for example, <code>SyntaxError</code>, <code>ReferenceError</code>, or <code>TypeError</code>).</li>
          <li><strong>Error Description:</strong> Explains what the engine expected vs. what it encountered (such as "Unexpected token" or "missing ) after argument list").</li>
        </ul>
        <p>
          Because execution environments can evaluate code in different wrappers, line numbers are not always exact.
          The best debugging habit is to inspect your statements for balanced pairs: make sure every <code>"</code> has a closing <code>"</code>, and every <code>(</code> has a closing <code>)</code>.
        </p>
      `,
    },
  ],
  summary: [
    "Syntax errors occur when code violates JavaScript's grammatical rules.",
    "Errors are normal diagnostic feedback that guide you toward what to fix.",
    "Every opening quotation mark must be closed on the same line.",
    "Every opening parenthesis must be closed before the statement ends with a semicolon.",
    "Congratulations! Completing this lesson earns the Module 1 Milestone: 'Run a simple program and explain its output.'",
  ],
  exercise: {
    id: "m1-l4-ex1",
    title: "Exercise: Fix the Syntax Error",
    prompt:
      "The statement below contains a syntax error because it is missing its closing parenthesis. Fix the error so that the program runs cleanly and prints: Syntax errors are normal!",
    expectedOutput: "Syntax errors are normal!",
    starterCode: `// Module 1, Lesson 4 — Exercise: Fixing Syntax Errors
// The statement below is missing its closing parenthesis.
// Fix the error so the program prints: Syntax errors are normal!
console.log("Syntax errors are normal!";
`,
    hints: [
      "Look at the end of the console.log line before the semicolon. A statement opened with '(' must be closed with ')' before the semicolon ';' ends the statement.",
      'Your corrected statement should be:\nconsole.log("Syntax errors are normal!");',
    ],
    validate: validateM1L4Exercise,
  },
};
