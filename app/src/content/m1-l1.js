/**
 * content/m1-l1.js — Lesson content for Module 1, Lesson 1.
 *
 * Title: "What JavaScript Is and Where It Runs"
 * Conforms to curriculum-spec.md and constitution.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 1, Lesson 1.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM1L1Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message: 'No output was printed. Did you call console.log("Hello, JavaScript!");?',
    };
  }

  if (entries.length > 1) {
    return {
      passed: false,
      status: "mismatch",
      message: `Multiple output lines detected (${entries.length} lines). The exercise expects exactly one output line: "Hello, JavaScript!".`,
    };
  }

  const raw = String(entries[0].text ?? "");
  const actual = stripTrailingNewlines(raw);
  const expected = "Hello, JavaScript!";

  if (actual === expected) {
    return {
      passed: true,
      status: "success",
      message: "Success! You printed 'Hello, JavaScript!' to the console.",
    };
  }

  if (actual === "Hello, world!") {
    return {
      passed: false,
      status: "mismatch",
      message: 'Almost there! Your code printed "Hello, world!", but the exercise asks for "Hello, JavaScript!".',
    };
  }

  if (actual.toLowerCase() === expected.toLowerCase()) {
    return {
      passed: false,
      status: "mismatch",
      message: `Close! JavaScript is case-sensitive. Expected "${expected}", but received "${actual}".`,
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected "${expected}", but received "${actual}".`,
  };
}

/**
 * Automated validator for Module 1, Lesson 1 interactive exercise.
 * Evaluates actual runner execution results and output entries.
 */
export const validateM1L1Exercise = createBaseValidator(checkM1L1Output, {
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check that your text is enclosed in matching quotes and parentheses.`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. Check the spelling and capitalization of console.log.`,
  typeErrorMessage: (msg) =>
    `Type Error: ${msg}. Ensure console.log is called as a function with parentheses.`,
});

export const lessonM1L1 = {
  lessonId: "m1-l1",
  moduleId: "m1",
  moduleTitle: "Module 1: Getting Started",
  title: "What JavaScript Is and Where It Runs",
  estimatedMinutes: 15,
  prerequisites: [],
  objectives: [
    "Explain what JavaScript is and identify environments where it runs.",
    "Distinguish clearly between JavaScript (the language), the browser (the host), and the JavaScript engine (the translator).",
    "Run your first simple JavaScript program and observe its output.",
  ],
  starterCode: `// Module 1, Lesson 1: Your First JavaScript Program\nconsole.log("Hello, world!");\n`,
  exercise: {
    id: "m1-l1-ex1",
    title: "Exercise: Your First Output",
    prompt: 'Modify the code to print the exact message "Hello, JavaScript!" to the console.',
    expectedOutput: "Hello, JavaScript!",
    starterCode: `// Module 1, Lesson 1 — Exercise: Your First Program\n// Modify the message inside quotes to print "Hello, JavaScript!"\nconsole.log("Hello, world!");\n`,
    hints: [
      'Look at the text between quotation marks inside console.log(...). Replace "Hello, world!" with "Hello, JavaScript!".',
      'Your line should look like this: console.log("Hello, JavaScript!"); — keep both quotation marks and the parentheses intact.',
    ],
    validate: validateM1L1Exercise,
  },
  sections: [
    {
      id: "what-is-js",
      heading: "What Is JavaScript?",
      content: `
        <p>
          <strong>JavaScript</strong> is one of the foundational programming languages of the web.
          While <strong>HTML</strong> provides the structure of a webpage and <strong>CSS</strong> defines its appearance,
          JavaScript brings pages to life by making them dynamic, interactive, and responsive to user actions.
        </p>
        <p>
          JavaScript was created in 1995 to run inside web browsers. Today, it has grown into a versatile, general-purpose
          language used to build web applications, backend services, mobile apps, and interactive games.
        </p>
      `,
    },
    {
      id: "where-it-runs",
      heading: "Where Does JavaScript Run?",
      content: `
        <p>JavaScript does not run on raw hardware directly. Instead, it runs inside a <strong>host environment</strong>. Common environments include:</p>
        <ul>
          <li><strong>Web Browsers:</strong> Chrome, Firefox, Safari, Edge, and others run JavaScript to respond to user clicks, submit forms, and update content in real time.</li>
          <li><strong>Servers &amp; Backends:</strong> Environments like Node.js and Deno let developers run JavaScript on servers to handle databases, authentication, and network APIs.</li>
          <li><strong>Desktop &amp; Mobile Applications:</strong> Tools like Electron and React Native use JavaScript to build standalone apps for computers and mobile phones.</li>
        </ul>
      `,
    },
    {
      id: "the-three-pieces",
      heading: "Crucial Concept: Language vs. Browser vs. Engine",
      content: `
        <p>One of the most common beginner confusions is mixing up the language itself with the software running it. It is essential to distinguish between these three distinct parts:</p>
        <div class="concept-grid">
          <div class="concept-card">
            <h4>1. JavaScript (The Language)</h4>
            <p>
              The set of grammatical rules, keywords, and syntax standardized as <strong>ECMAScript</strong>.
              It defines how variables, functions, loops, and math behave—no matter where the code is executed.
            </p>
          </div>
          <div class="concept-card">
            <h4>2. The Browser (The Host)</h4>
            <p>
              The application (like Chrome or Firefox) displaying the page. The browser provides the document,
              renders visuals on screen, listens for mouse clicks, and supplies Web APIs like <code>window</code> and <code>document</code>.
            </p>
          </div>
          <div class="concept-card">
            <h4>3. The JavaScript Engine (The Translator)</h4>
            <p>
              A specialized engine inside the host (such as <strong>V8</strong> in Chrome, <strong>SpiderMonkey</strong> in Firefox, or <strong>JavaScriptCore</strong> in Safari).
              The engine reads JavaScript text, translates it into fast machine code, and executes it.
            </p>
          </div>
        </div>
      `,
    },
    {
      id: "first-program",
      heading: "Your First Program: console.log()",
      content: `
        <p>
          In JavaScript, <code>console.log()</code> is a built-in instruction used to print messages and inspect values.
          It is the primary tool programmers use to see what their code is doing.
        </p>
        <div class="example-box">
          <pre><code>console.log("Hello, world!");</code></pre>
          <p class="example-explanation">
            Notice three key details:
          </p>
          <ol>
            <li><strong>console.log</strong> is the name of the function that outputs messages.</li>
            <li>Parentheses <code>(...)</code> enclose the data you want to send to the console.</li>
            <li>Quotation marks <code>"Hello, world!"</code> tell JavaScript that this is a <em>text string</em> rather than code instructions.</li>
          </ol>
        </div>
      `,
    },
  ],
  summary: [
    "JavaScript is a dynamic programming language used for web pages, backends, and standalone apps.",
    "JavaScript runs in host environments like web browsers and Node.js.",
    "The language (ECMAScript rules), the host browser (environment & Web APIs), and the JavaScript engine (translator) are three distinct components.",
    "<code>console.log()</code> displays information and messages in the output console.",
  ],
};
