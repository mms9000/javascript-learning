/**
 * content/m2-l4.js — Lesson content for Module 2, Lesson 4.
 *
 * Title: "Operators and Expressions"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 2, Lesson 4.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM2L4Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'No output was printed. Update total with total += shipping;, then print total and `Total: $${total}`.',
    };
  }

  if (entries.length === 1) {
    const val = stripTrailingNewlines(entries[0].text);
    if (val === "45") {
      return {
        passed: false,
        status: "mismatch",
        message:
          "Total is 45 (subtotal only). Remember to add shipping using total += shipping;, then log both total and the template literal.",
      };
    }
    return {
      passed: false,
      status: "mismatch",
      message: `Only 1 line of output detected ("${val}"). The exercise expects 2 lines: the numeric total (50) on line 1 and "Total: $50" on line 2.`,
    };
  }

  if (entries.length > 2) {
    return {
      passed: false,
      status: "mismatch",
      message: `Multiple extra output lines detected (${entries.length} lines). The exercise expects exactly two lines: line 1 = 50 and line 2 = "Total: $50".`,
    };
  }

  const line1 = stripTrailingNewlines(entries[0].text);
  const line2 = stripTrailingNewlines(entries[1].text);

  const expectedLine1 = "50";
  const expectedLine2 = "Total: $50";

  if (line1 === expectedLine1 && line2 === expectedLine2) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You used arithmetic multiplication, compound assignment (+=), and template literal interpolation to calculate and format the order total.",
    };
  }

  if (line1 === "45" && line2.includes("45")) {
    return {
      passed: false,
      status: "mismatch",
      message:
        "Shipping was not added to total! Use total += shipping; before logging the results.",
    };
  }

  if (line1 === expectedLine1 && line2.toLowerCase() === expectedLine2.toLowerCase()) {
    return {
      passed: false,
      status: "mismatch",
      message: `Capitalization mismatch on line 2: Expected "${expectedLine2}", but received "${line2}".`,
    };
  }

  if (line1 === expectedLine2 && line2 === expectedLine1) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'Line order inverted: Print the numeric total (50) on line 1, and the formatted string ("Total: $50") on line 2.',
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected line 1 = "${expectedLine1}" and line 2 = "${expectedLine2}", but received "${line1}" and "${line2}".`,
  };
}

/**
 * Automated validator for Module 2, Lesson 4 interactive exercise.
 */
export const validateM2L4Exercise = createBaseValidator(checkM2L4Output, {
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check your template literal syntax: use backticks \`...\` and \${total} for string interpolation.`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. Check the spelling and capitalization of total, shipping, and console.log.`,
  typeErrorMessage: (msg) =>
    `Type Error: ${msg}. Ensure variables are numbers and console.log is called properly.`,
});

export const lessonM2L4 = {
  lessonId: "m2-l4",
  moduleId: "m2",
  moduleTitle: "Module 2: Values and Variables",
  title: "Operators and Expressions",
  estimatedMinutes: 20,
  prerequisites: ["m2-l3"],
  objectives: [
    "Distinguish between operators (symbols) and expressions (constructs evaluating to values).",
    "Use arithmetic operators (+, -, *, /, %, **) and understand operator precedence.",
    "Apply compound assignment operators (+=, -=, *=, /=).",
    "Construct template literals using backticks and ${expression} interpolation.",
  ],
  starterCode: `// Module 2, Lesson 4 — Exercise: Operators and Expressions
const itemPrice = 15;
const quantity = 3;
const shipping = 5;

// 1. Calculate subtotal (itemPrice multiplied by quantity)
let total = itemPrice * quantity;

// 2. Use compound assignment (+=) to add shipping to total
// (Add your code here)

// 3. Print the numeric total on line 1
console.log(total);

// 4. Print a formatted string on line 2 using a template literal: "Total: $50"
// (Add your code here)
`,
  sections: [
    {
      id: "operators-vs-expressions",
      heading: "1. Operators vs. Expressions",
      title: "1. Operators vs. Expressions",
      content: `
        <p>
          Two foundational terms in programming are <strong>operators</strong> and <strong>expressions</strong>:
        </p>
        <ul>
          <li>
            <strong>Operator:</strong> A built-in symbol that performs an operation on one or more values.
            Examples include <code>+</code> (addition), <code>*</code> (multiplication), and <code>+=</code> (compound assignment).
          </li>
          <li>
            <strong>Expression:</strong> Any unit of code that <em>evaluates to a single value</em>.
            For example, <code>15 * 3</code> is an arithmetic expression that evaluates to <code>45</code>.
            Variables and literals are also simple expressions: <code>itemPrice</code> evaluates to <code>15</code>.
          </li>
        </ul>
      `,
    },
    {
      id: "arithmetic-operators",
      heading: "2. The Six Core Arithmetic Operators",
      title: "2. The Six Core Arithmetic Operators",
      content: `
        <p>
          JavaScript includes six basic arithmetic operators for numeric computation:
        </p>
        <ul>
          <li><code>+</code> — <strong>Addition:</strong> <code>10 + 5</code> &rarr; <code>15</code></li>
          <li><code>-</code> — <strong>Subtraction:</strong> <code>10 - 5</code> &rarr; <code>5</code></li>
          <li><code>*</code> — <strong>Multiplication:</strong> <code>10 * 5</code> &rarr; <code>50</code></li>
          <li><code>/</code> — <strong>Division:</strong> <code>10 / 4</code> &rarr; <code>2.5</code></li>
          <li><code>%</code> — <strong>Remainder (Modulo):</strong> <code>10 % 3</code> &rarr; <code>1</code> (the integer remainder of 10 &divide; 3)</li>
          <li><code>**</code> — <strong>Exponentiation (Power):</strong> <code>2 ** 3</code> &rarr; <code>8</code> (2 raised to the 3rd power)</li>
        </ul>
      `,
    },
    {
      id: "precedence-and-grouping",
      heading: "3. Operator Precedence and Grouping",
      title: "3. Operator Precedence and Grouping",
      content: `
        <p>
          Just like in standard mathematics, JavaScript arithmetic follows rules of <strong>precedence</strong>:
          multiplication and division are evaluated before addition and subtraction.
        </p>
        <div class="example-box">
          <pre><code>console.log(10 + 5 * 2);   // 20 (5 * 2 is evaluated first, then + 10)
console.log((10 + 5) * 2); // 30 (parentheses force addition first!)</code></pre>
          <p class="example-explanation">
            <strong>Best Practice:</strong> Always use grouping parentheses <code>(...)</code> whenever you want to
            clarify the order of calculations. It makes your intention crystal clear to anyone reading your code.
          </p>
        </div>
      `,
    },
    {
      id: "compound-assignment",
      heading: "4. Compound Assignment Operators",
      title: "4. Compound Assignment Operators",
      content: `
        <p>
          Programmers frequently update a variable based on its existing value (such as adding shipping to a subtotal):
        </p>
        <div class="example-box">
          <pre><code>let total = 45;
total = total + 5; // 50</code></pre>
          <p class="example-explanation">
            JavaScript provides <strong>compound assignment operators</strong> as a concise shorthand:
          </p>
          <pre><code>let total = 45;
total += 5; // Exactly equivalent to: total = total + 5;</code></pre>
        </div>
        <p>
          Other compound operators include <code>-=</code>, <code>*=</code>, and <code>/=</code>.
        </p>
      `,
    },
    {
      id: "template-literals",
      heading: "5. Template Literals (String Interpolation)",
      title: "5. Template Literals (String Interpolation)",
      content: `
        <p>
          When you want to display variables and text together in a readable message,
          modern JavaScript uses <strong>template literals</strong>.
        </p>
        <p>
          A template literal is enclosed in <strong>backticks</strong> (<code>\`...\`</code>, located above the Tab key on standard keyboards)
          instead of standard quotes. Inside backticks, you can embed any variable or expression using <code>\${expression}</code>:
        </p>
        <div class="example-box">
          <pre><code>const price = 50;
console.log(\`Total: $\${price}\`); // "Total: $50"</code></pre>
          <p class="example-explanation">
            The JavaScript engine automatically evaluates whatever is inside <code>\${...}</code> and injects the result directly into the string.
          </p>
        </div>
      `,
    },
    {
      id: "comprehension-check",
      heading: "6. Comprehension Check: Operators vs. Expressions",
      title: "6. Comprehension Check: Operators vs. Expressions",
      content: `
        <div class="concept-card">
          <h4>Concept Check: Classify Each Item</h4>
          <ul>
            <li><code>*</code> &rarr; <strong>Operator</strong> (a symbol that defines multiplication).</li>
            <li><code>itemPrice * quantity</code> &rarr; <strong>Expression</strong> (evaluates to a numeric value).</li>
            <li><code>(10 + 5) * 2</code> &rarr; <strong>Expression</strong> (evaluates to 30; grouping parentheses control order).</li>
            <li><code>total += shipping</code> &rarr; <strong>Expression Statement</strong> (compound operator adds and reassigns in one step).</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Operators are syntactic symbols that perform actions (+, -, *, /, %, **, +=).",
    "Expressions are units of code that evaluate to a single value.",
    "Parentheses (...) override standard operator precedence to control calculation order.",
    "Compound assignment operators (+=, -=, *=, /=) modify and reassign a variable in one concise step.",
    "Template literals use backticks `...` and ${expression} to embed calculated values into text cleanly.",
  ],
  exercise: {
    id: "m2-l4-ex1",
    title: "Exercise: Calculating and Formatting an Order Total",
    prompt:
      'Complete the order calculation. Use compound assignment (total += shipping;) to add shipping to the existing subtotal. Print the numeric total (50) on line 1, and print the formatted template literal "Total: $50" on line 2.',
    expectedOutput: "50\nTotal: $50",
    starterCode: `// Module 2, Lesson 4 — Exercise: Operators and Expressions
const itemPrice = 15;
const quantity = 3;
const shipping = 5;

// 1. Calculate subtotal (itemPrice multiplied by quantity)
let total = itemPrice * quantity;

// 2. Use compound assignment (+=) to add shipping to total
// (Add your code here)

// 3. Print the numeric total on line 1
console.log(total);

// 4. Print a formatted string on line 2 using a template literal: "Total: $50"
// (Add your code here)
`,
    hints: [
      'To add shipping using compound assignment, write: total += shipping;',
      'To log the template literal on line 2, write: console.log(`Total: $${total}`); (be sure to use backticks).',
    ],
    validate: validateM2L4Exercise,
  },
};
