/**
 * content/m1-l3.js — Lesson content for Module 1, Lesson 3.
 *
 * Title: "Reading Basic Syntax and Comments"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 1, Lesson 3.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM1L3Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'No output was printed. Make sure console.log("Hello from JavaScript!"); is present and not commented out.',
    };
  }

  if (entries.length > 1) {
    return {
      passed: false,
      status: "mismatch",
      message: `Multiple output lines detected (${entries.length} lines). The exercise expects exactly one line. Check that you have not added extra print statements.`,
    };
  }

  const raw = String(entries[0].text ?? "");
  const actual = stripTrailingNewlines(raw);
  const expected = "Hello from JavaScript!";

  if (actual === expected) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You fixed the comment. The commented line was ignored by the JavaScript engine.",
    };
  }

  if (actual.toLowerCase() === expected.toLowerCase()) {
    return {
      passed: false,
      status: "mismatch",
      message: `Capitalization mismatch: Expected "${expected}" — check uppercase letters and the exclamation mark.`,
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected "${expected}", but received "${actual}".`,
  };
}

/**
 * Automated validator for Module 1, Lesson 3 interactive exercise.
 * Evaluates actual runner execution results and output entries.
 */
export const validateM1L3Exercise = createBaseValidator(checkM1L3Output, {
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check that the comment line starts with // and that each statement is properly formatted.`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. The un-commented line is being treated as code. Add // at the start of it.`,
  typeErrorMessage: (msg) =>
    `Type Error: ${msg}. Ensure console.log is called properly.`,
});

export const lessonM1L3 = {
  lessonId: "m1-l3",
  moduleId: "m1",
  moduleTitle: "Module 1: Getting Started",
  title: "Reading Basic Syntax and Comments",
  estimatedMinutes: 10,
  prerequisites: ["m1-l2"],
  objectives: [
    "Identify statements and understand that each statement is a complete instruction ending in a semicolon.",
    "Explain the role of whitespace (spaces, blank lines, indentation) and how it improves code readability.",
    "Write single-line comments using // and understand that they are ignored by the JavaScript engine.",
    "Write multi-line comments using /* ... */ for longer explanations or documentation.",
    "Distinguish executed code from explanatory comments in JavaScript programs.",
  ],
  starterCode: `// Module 1, Lesson 3 — Exercise: Comments
// The line below is meant to be a comment, but it is missing the // prefix.
// Fix it so the program prints only: Hello from JavaScript!
This line is a note to the reader, not code.
console.log("Hello from JavaScript!");
`,
  sections: [
    {
      id: "statements-and-semicolons",
      heading: "1. Statements and Semicolons",
      title: "1. Statements and Semicolons",
      content: `
        <p>A JavaScript program is a list of instructions for the computer to execute. Each complete instruction is called a <strong>statement</strong>.</p>
        <p>In standard JavaScript style, every statement ends with a semicolon (<code>;</code>):</p>
        <div class="example-box">
          <pre><code>console.log("Welcome to JavaScript!");\nconsole.log("Learning syntax step by step.");</code></pre>
        </div>
        <p>While JavaScript includes Automatic Semicolon Insertion (ASI), writing explicit semicolons is recommended practice. It prevents subtle ambiguities and makes code intentions crystal clear.</p>
        <p><strong>Whitespace</strong> — spaces, tabs, and empty lines — is largely ignored by the JavaScript engine. However, clean indentation and intentional spacing make your code readable and maintainable for human developers.</p>
      `,
    },
    {
      id: "single-line-comments",
      heading: "2. Single-Line Comments (//)",
      title: "2. Single-Line Comments (//)",
      content: `
        <p>Comments are notes written directly in your source code for humans to read. The JavaScript engine completely skips and ignores comments during execution.</p>
        <p>A <strong>single-line comment</strong> begins with two forward slashes (<code>//</code>):</p>
        <div class="example-box">
          <pre><code>// This is a full-line comment explaining the next line\nconsole.log("System initializing...");\n\nconsole.log("Ready!"); // You can also put comments at the end of a line</code></pre>
        </div>
        <p>Everything on the line after <code>//</code> is discarded by the engine. You can use single-line comments to:</p>
        <ul>
          <li>Explain <strong>why</strong> code is written a certain way.</li>
          <li>Provide context or warnings for future teammates (or your future self).</li>
          <li>Temporarily disable a line of code during testing without deleting it.</li>
        </ul>
      `,
    },
    {
      id: "multi-line-comments",
      heading: "3. Multi-Line Comments (/* ... */)",
      title: "3. Multi-Line Comments (/* ... */)",
      content: `
        <p>When you need a longer explanation, description header, or want to disable multiple lines at once, use a <strong>multi-line comment</strong>.</p>
        <p>A multi-line comment starts with <code>/*</code> and continues until the closing <code>*/</code>:</p>
        <div class="example-box">
          <pre><code>/*\n  Interactive JavaScript Learning Platform\n  Module 1, Lesson 3: Syntax and Comments\n  Author: Platform Curriculum\n*/\nconsole.log("Comments help document code.");</code></pre>
        </div>
        <p>Multi-line comments can span across any number of lines. Just make sure every opening <code>/*</code> has a matching <code>*/</code> closing delimiter.</p>
      `,
    },
    {
      id: "comments-are-not-output",
      heading: "4. Comments Are Not Output",
      title: "4. Comments Are Not Output",
      content: `
        <p>A critical concept for beginners is that comments do not print to the console and have no effect on program state:</p>
        <div class="example-box">
          <pre><code>// console.log("This will never print!");\nconsole.log("Only this line will print.");</code></pre>
        </div>
        <p>If you remove the <code>//</code> comment markers from an explanatory note that isn't valid JavaScript, the engine attempts to evaluate the words as variable names or commands, causing a runtime error (like <code>ReferenceError</code> or <code>SyntaxError</code>). Comments protect explanatory text from being executed.</p>
      `,
    },
  ],
  summary: [
    "Each JavaScript statement is a complete instruction; semicolons mark the end of statements.",
    "Whitespace (spaces, blank lines, indentation) is ignored by the engine but crucial for readable code.",
    "Single-line comments start with // and are ignored by the JavaScript engine.",
    "Multi-line comments start with /* and end with */.",
    "Comments never produce console output or runtime side effects.",
  ],
  exercise: {
    id: "m1-l3-ex1",
    title: "Exercise: Fix the Comment",
    prompt:
      "The program below contains an explanatory note, but the line is missing the // comment prefix and causes an error. Fix the comment by adding // to the beginning of the line so that only the console.log output is printed.",
    expectedOutput: "Hello from JavaScript!",
    starterCode: `// Module 1, Lesson 3 — Exercise: Comments
// The line below is meant to be a comment, but it is missing the // prefix.
// Fix it so the program prints only: Hello from JavaScript!
This line is a note to the reader, not code.
console.log("Hello from JavaScript!");
`,
    hints: [
      "A single-line comment starts with two forward slashes: //. Find the line that begins with 'This line is a note...' and add // at the very start.",
      "The fixed line should look like:\n// This line is a note to the reader, not code.",
    ],
    validate: validateM1L3Exercise,
  },
};
