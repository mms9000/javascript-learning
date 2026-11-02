/**
 * content/m4-l2.js — Lesson content for Module 4, Lesson 2.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM4L2Output(entries) {
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.length === 1 && actual[0] === "24") {
    return {
      passed: true,
      status: "success",
      message: "Success! The function returned a value that the caller stored and printed.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected one output line, "24", but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Return amount + fee from the function; console.log inside the function does not return the result to its caller.`,
  };
}

export const validateM4L2Exercise = createBaseValidator(checkM4L2Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the function body and return statement.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of amount, fee, addServiceFee, and total.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that amount and fee are numbers and that the function call is valid.`,
});

export const lessonM4L2 = {
  lessonId: "m4-l2",
  moduleId: "m4",
  moduleTitle: "Module 4: Functions",
  title: "Parameters, Arguments, and Return Values",
  estimatedMinutes: 20,
  prerequisites: ["m4-l1"],
  objectives: [
    "Distinguish a function parameter from an argument supplied at a call.",
    "Return a computed value from a function.",
    "Distinguish returning a value from printing inside a function.",
  ],
  starterCode: `// Module 4, Lesson 2 — Exercise: Return a Total
function addServiceFee(amount, fee) {
  // Return the amount plus the fee.
}

const total = addServiceFee(20, 4);
console.log(total);
`,
  sections: [
    {
      id: "parameters-and-arguments",
      heading: "1. Parameters and Arguments",
      content: `
        <p>A <strong>parameter</strong> is a named input in the function definition.
        An <strong>argument</strong> is the value supplied when the function is called.</p>
        <pre><code>function addServiceFee(amount, fee) {
  return amount + fee;
}

addServiceFee(20, 4);</code></pre>
        <p><code>amount</code> and <code>fee</code> are parameters; <code>20</code> and
        <code>4</code> are arguments.</p>
      `,
    },
    {
      id: "return-a-value",
      heading: "2. Return a Computed Value",
      content: `
        <p>The <code>return</code> statement sends a value from the function back to
        the code that called it.</p>
        <pre><code>function addServiceFee(amount, fee) {
  return amount + fee;
}</code></pre>
        <p>The returned result can be saved, used in another expression, or printed by
        the caller.</p>
      `,
    },
    {
      id: "return-versus-log",
      heading: "3. Returning Is Different from Printing",
      content: `
        <p><code>console.log()</code> displays a value; it does not send that value back
        to the caller. A function that only logs has no computed return value for its caller.</p>
        <pre><code>const total = addServiceFee(20, 4);
console.log(total);</code></pre>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Follow the Value",
      content: `
        <div class="concept-card">
          <h4>Trace the call</h4>
          <ul>
            <li><code>amount</code> and <code>fee</code> are parameters.</li>
            <li><code>20</code> and <code>4</code> are arguments.</li>
            <li>The function returns <strong>24</strong>, which the caller prints.</li>
            <li>Logging 24 inside the function does not assign 24 to <code>total</code>.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Parameters name function inputs; arguments are the values passed in a call.",
    "return sends a value back to the caller.",
    "console.log displays a value but does not replace return.",
  ],
  exercise: {
    id: "m4-l2-ex1",
    title: "Exercise: Return a Total",
    prompt:
      "Complete addServiceFee so the caller receives the sum of 20 and 4 and prints exactly 24.",
    expectedOutput: "24",
    starterCode: `// Module 4, Lesson 2 — Exercise: Return a Total
function addServiceFee(amount, fee) {
  // Return the amount plus the fee.
}

const total = addServiceFee(20, 4);
console.log(total);
`,
    hints: [
      "amount and fee are parameters. The arguments 20 and 4 are added when addServiceFee is called.",
      "Inside the function, write return amount + fee; so the caller can store the result in total.",
    ],
    validate: validateM4L2Exercise,
  },
};
