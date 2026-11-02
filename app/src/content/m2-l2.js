/**
 * content/m2-l2.js — Lesson content for Module 2, Lesson 2.
 *
 * Title: "Declaring Variables with const and let"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 2, Lesson 2.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM2L2Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'No output was printed. Declare courseName and lessonNumber, then print them using console.log(courseName); and console.log(lessonNumber);.',
    };
  }

  if (entries.length === 1) {
    return {
      passed: false,
      status: "mismatch",
      message: `Only 1 line of output detected ("${stripTrailingNewlines(entries[0].text)}"). The exercise expects 2 lines: "JavaScript Basics" followed by "2".`,
    };
  }

  if (entries.length > 2) {
    return {
      passed: false,
      status: "mismatch",
      message: `Multiple extra output lines detected (${entries.length} lines). The exercise expects exactly two lines: "JavaScript Basics" on line 1 and "2" on line 2.`,
    };
  }

  const line1 = stripTrailingNewlines(entries[0].text);
  const line2 = stripTrailingNewlines(entries[1].text);

  const expectedLine1 = "JavaScript Basics";
  const expectedLine2 = "2";

  if (line1 === expectedLine1 && line2 === expectedLine2) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You declared a constant with const and a variable with let, and logged their values accurately.",
    };
  }

  // Inverted line order
  if (line1 === expectedLine2 && line2 === expectedLine1) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'Line order inverted: Print courseName on line 1 and lessonNumber on line 2.',
    };
  }

  // Capitalization mismatch on string
  if (line1.toLowerCase() === expectedLine1.toLowerCase() && line2 === expectedLine2) {
    return {
      passed: false,
      status: "mismatch",
      message: `Capitalization mismatch: Expected "${expectedLine1}" on line 1, but received "${line1}". Check uppercase and lowercase characters.`,
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected line 1 = "${expectedLine1}" and line 2 = "${expectedLine2}", but received "${line1}" and "${line2}".`,
  };
}

/**
 * Automated validator for Module 2, Lesson 2 interactive exercise.
 */
export const validateM2L2Exercise = createBaseValidator(checkM2L2Output, {
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check that your const and let declarations end with semicolons and have valid variable names.`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. Check the spelling and capitalization of courseName, lessonNumber, and console.log.`,
  typeErrorMessage: (msg) =>
    `Type Error: ${msg}. Ensure console.log is called with valid arguments.`,
});

export const lessonM2L2 = {
  lessonId: "m2-l2",
  moduleId: "m2",
  moduleTitle: "Module 2: Values and Variables",
  title: "Declaring Variables with const and let",
  estimatedMinutes: 15,
  prerequisites: ["m2-l1"],
  objectives: [
    "Explain what a variable is and why named bindings are essential.",
    "Declare variables using const (default) and let (for reassignable bindings).",
    "Explain why modern JavaScript avoids var due to scoping and hoisting issues.",
    "Follow JavaScript identifier naming rules and camelCase conventions.",
  ],
  starterCode: `// Module 2, Lesson 2 — Exercise: Declaring Variables with const and let
// 1. Declare a const named courseName initialized to "JavaScript Basics"
// 2. Declare a let named lessonNumber initialized to 2
// 3. Print both variables on separate lines
`,
  sections: [
    {
      id: "what-is-a-variable",
      heading: "1. What is a Variable?",
      title: "1. What is a Variable?",
      content: `
        <p>
          In programming, a <strong>variable</strong> is a named container that holds a value in memory.
          Instead of repeating raw literals like <code>"JavaScript Basics"</code> throughout your program,
          you give the data a descriptive name that you can refer to repeatedly.
        </p>
        <p>
          Creating a variable is called <strong>declaring</strong> a variable. Modern JavaScript provides two keywords for declaring variables:
          <code>const</code> and <code>let</code>.
        </p>
      `,
    },
    {
      id: "declaring-with-const",
      heading: "2. Declaring Constants with const",
      title: "2. Declaring Constants with const",
      content: `
        <p>
          The <code>const</code> keyword creates a <strong>constant</strong>—a named binding that cannot be reassigned to a different value once declared.
        </p>
        <div class="example-box">
          <pre><code>const appName = "CodeLab";
console.log(appName); // "CodeLab"</code></pre>
          <p class="example-explanation">
            <strong>Important Rule:</strong> A <code>const</code> variable <em>must</em> be given an initial value immediately when declared.
            Writing <code>const appName;</code> without an assignment is an illegal <em>SyntaxError</em>.
          </p>
        </div>
        <p>
          <strong>Best Practice:</strong> Use <code>const</code> by default for all variables.
          Only switch to <code>let</code> when you know the value needs to change later in the program.
        </p>
      `,
    },
    {
      id: "declaring-with-let",
      heading: "3. Declaring Variables with let",
      title: "3. Declaring Variables with let",
      content: `
        <p>
          When you know a variable will need to hold different values over time (such as a counter, an ongoing score, or a changing user state),
          declare it using the <code>let</code> keyword:
        </p>
        <div class="example-box">
          <pre><code>let score = 0;
console.log(score); // 0</code></pre>
          <p class="example-explanation">
            Unlike <code>const</code>, variables declared with <code>let</code> can be reassigned to new values later.
          </p>
        </div>
      `,
    },
    {
      id: "why-avoid-var",
      heading: "4. Why Modern JavaScript Avoids var",
      title: "4. Why Modern JavaScript Avoids var",
      content: `
        <p>
          Before 2015, JavaScript only had one keyword to declare variables: <code>var</code>.
        </p>
        <p>
          Variables declared with <code>var</code> have major flaws: they ignore block scopes (like inside <code>if</code> blocks or loops),
          allow accidental re-declarations of the same name, and exhibit confusing behavior known as <em>hoisting</em>.
          Modern JavaScript introduced <code>const</code> and <code>let</code> to fix these design mistakes.
          In modern codebases, <code>var</code> is considered legacy and should never be used.
        </p>
      `,
    },
    {
      id: "naming-rules",
      heading: "5. Identifier Naming Rules and Conventions",
      title: "5. Identifier Naming Rules and Conventions",
      content: `
        <p>
          In JavaScript, variable names (called <strong>identifiers</strong>) must follow strict syntax rules:
        </p>
        <ul>
          <li>May contain letters, digits, dollar signs (<code>$</code>), and underscores (<code>_</code>).</li>
          <li><strong>Cannot start with a digit:</strong> <code>player1</code> is valid, but <code>1player</code> is a SyntaxError.</li>
          <li>Cannot use reserved keywords like <code>const</code>, <code>let</code>, <code>function</code>, or <code>return</code>.</li>
          <li>Variable names are <strong>case-sensitive:</strong> <code>userScore</code> and <code>userscore</code> are two different variables.</li>
        </ul>
        <p>
          <strong>CamelCase Convention:</strong> By convention, JavaScript developers use <em>lowerCamelCase</em> for variable names:
          start with a lowercase word and capitalize subsequent words (e.g. <code>courseName</code>, <code>lessonNumber</code>, <code>isComplete</code>).
        </p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "6. Comprehension Check: Valid Variables",
      title: "6. Comprehension Check: Valid Variables",
      content: `
        <div class="concept-card">
          <h4>Concept Check: Spot the Legal Identifiers</h4>
          <p>Which of the following variable declarations are valid syntax?</p>
          <ul>
            <li><code>const maxUsers = 100;</code> &rarr; <strong>Valid</strong> (camelCase, initialized immediately).</li>
            <li><code>let 2ndPlayer = "Alex";</code> &rarr; <strong>Invalid</strong> (identifier cannot begin with a digit).</li>
            <li><code>const userCity;</code> &rarr; <strong>Invalid</strong> (const must be initialized with a value).</li>
            <li><code>let $price_total = 49.99;</code> &rarr; <strong>Valid</strong> (may contain $ and _).</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Variables are named memory bindings used to store and reference values.",
    "Use const by default for variables that will not be reassigned; const must be initialized when declared.",
    "Use let for variables whose values will change over time.",
    "Modern JavaScript avoids legacy var due to scope leakage and hoisting issues.",
    "Identifiers can contain letters, digits, $, and _, cannot begin with digits, and follow the lowerCamelCase convention.",
  ],
  exercise: {
    id: "m2-l2-ex1",
    title: "Exercise: Declaring Course Variables",
    prompt:
      'Declare a constant named courseName initialized to "JavaScript Basics". Then declare a variable named lessonNumber using let initialized to 2. Print courseName on the first line and lessonNumber on the second line.',
    expectedOutput: "JavaScript Basics\n2",
    starterCode: `// Module 2, Lesson 2 — Exercise: Declaring Variables with const and let
// 1. Declare a const named courseName initialized to "JavaScript Basics"
// 2. Declare a let named lessonNumber initialized to 2
// 3. Print both variables on separate lines
`,
    hints: [
      'Declare the variables using:\nconst courseName = "JavaScript Basics";\nlet lessonNumber = 2;',
      'Then output each variable using console.log():\nconsole.log(courseName);\nconsole.log(lessonNumber);',
    ],
    validate: validateM2L2Exercise,
  },
};
