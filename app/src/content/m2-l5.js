/**
 * content/m2-l5.js — Lesson content for Module 2, Lesson 5.
 *
 * Title: "Type Conversion and Coercion"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

/**
 * Output checker for Module 2, Lesson 5.
 *
 * @param {Array<{type: string, text: string}>} entries
 * @returns {{ passed: boolean, message: string, status: string }}
 */
function checkM2L5Output(entries) {
  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message:
        'No output was printed. Use Number() to convert the string variables to numbers before adding them, then log the result.',
    };
  }

  if (entries.length > 1) {
    return {
      passed: false,
      status: "mismatch",
      message: `Multiple output lines detected (${entries.length} lines). The exercise expects exactly one line: 100.`,
    };
  }

  const raw = stripTrailingNewlines(entries[0].text);

  if (raw === "4060") {
    return {
      passed: false,
      status: "mismatch",
      message:
        "You got '4060' because the + operator concatenated the strings instead of adding numbers! Convert each variable using Number(input1) + Number(input2).",
    };
  }

  if (raw === "100") {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You used Number() to explicitly convert string inputs to numbers, producing the correct numeric addition 100.",
    };
  }

  if (raw.toLowerCase() === "nan") {
    return {
      passed: false,
      status: "mismatch",
      message:
        "Result is NaN (Not-a-Number). Make sure you are converting input1 and input2, not unquoted words or invalid expressions.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Output mismatch: Expected 100, but received "${raw}".`,
  };
}

/**
 * Automated validator for Module 2, Lesson 5 interactive exercise.
 */
export const validateM2L5Exercise = createBaseValidator(checkM2L5Output, {
  syntaxErrorMessage: (msg) =>
    `Syntax Error: ${msg}. Check that Number() is written with matching parentheses around the variables: Number(input1) + Number(input2).`,
  referenceErrorMessage: (msg) =>
    `Reference Error: ${msg}. Check the spelling and capitalization of Number, input1, input2, and console.log.`,
  typeErrorMessage: (msg) =>
    `Type Error: ${msg}. Ensure Number is called as a function: Number(value).`,
});

export const lessonM2L5 = {
  lessonId: "m2-l5",
  moduleId: "m2",
  moduleTitle: "Module 2: Values and Variables",
  title: "Type Conversion and Coercion",
  estimatedMinutes: 20,
  prerequisites: ["m2-l4"],
  objectives: [
    "Distinguish explicit type conversion from implicit type coercion.",
    "Convert types explicitly using Number(), String(), and Boolean().",
    "Identify the dual role of the + operator and resolve implicit string concatenation bugs.",
    "Explain NaN characteristics, typeof NaN === 'number', and Number.isNaN().",
  ],
  starterCode: `// Module 2, Lesson 5 — Exercise: Type Conversion and Coercion
// Fix the code so that it performs numeric addition instead of string concatenation.
const input1 = "40";
const input2 = "60";

const sum = input1 + input2;
console.log(sum);
`,
  sections: [
    {
      id: "explicit-vs-implicit",
      heading: "1. Explicit Conversion vs. Implicit Coercion",
      title: "1. Explicit Conversion vs. Implicit Coercion",
      content: `
        <p>
          In JavaScript, changing a value from one data type to another happens in two ways:
        </p>
        <ul>
          <li>
            <strong>Explicit Type Conversion (Type Casting):</strong> The developer explicitly calls a conversion function
            (such as <code>Number("42")</code>) to convert a value intentionally.
          </li>
          <li>
            <strong>Implicit Type Coercion:</strong> The JavaScript engine automatically converts a value behind the scenes
            when an operator is used with mismatched types (such as subtracting a string from a number).
          </li>
        </ul>
        <p>
          Relying on implicit coercion is one of the most common sources of beginner bugs.
          Writing clean JavaScript means making your conversions explicit and predictable.
        </p>
      `,
    },
    {
      id: "string-concatenation-trap",
      heading: "2. The Plus (+) Operator Trap",
      title: "2. The Plus (+) Operator Trap",
      content: `
        <p>
          The <code>+</code> operator has two completely different jobs in JavaScript:
        </p>
        <ol>
          <li><strong>Numeric Addition:</strong> If both operands are numbers: <code>40 + 60</code> &rarr; <code>100</code>.</li>
          <li><strong>String Concatenation:</strong> If <em>either</em> operand is a string, JavaScript converts both sides to strings and glues them together!</li>
        </ol>
        <div class="example-box">
          <pre><code>console.log(40 + 60);     // 100 (numeric addition)
console.log("40" + "60"); // "4060" (concatenation!)
console.log("40" + 60);   // "4060" (60 is coerced to string)</code></pre>
          <p class="example-explanation">
            This trap commonly occurs when reading values from web forms or user inputs, which always arrive as strings.
            If you try to add them without converting, <code>"40" + "60"</code> gives you <code>"4060"</code>!
          </p>
        </div>
      `,
    },
    {
      id: "numeric-coercion",
      heading: "3. Numeric Coercion with -, *, and /",
      title: "3. Numeric Coercion with -, *, and /",
      content: `
        <p>
          Unlike <code>+</code>, the other arithmetic operators (<code>-</code>, <code>*</code>, <code>/</code>, <code>%</code>)
          only exist for numbers. When used on numeric strings, JavaScript coerces the strings to numbers:
        </p>
        <div class="example-box">
          <pre><code>console.log("50" - "10"); // 40
console.log("6" * "7");   // 42
console.log("100" / "4"); // 25</code></pre>
          <p class="example-explanation">
            Even though this works, relying on implicit coercion is risky.
            If a string contains non-numeric characters (like <code>"50px" - 10</code>), the calculation produces <code>NaN</code>.
          </p>
        </div>
      `,
    },
    {
      id: "explicit-conversion-functions",
      heading: "4. Explicit Conversion: Number(), String(), and Boolean()",
      title: "4. Explicit Conversion: Number(), String(), and Boolean()",
      content: `
        <p>
          JavaScript provides three primary global functions to convert values explicitly:
        </p>
        <ul>
          <li>
            <strong>Number(val):</strong> Converts strings and booleans to numbers.
            <code>Number("42")</code> &rarr; <code>42</code>, <code>Number(true)</code> &rarr; <code>1</code>, <code>Number(false)</code> &rarr; <code>0</code>.
          </li>
          <li>
            <strong>String(val):</strong> Converts numbers and booleans to text.
            <code>String(100)</code> &rarr; <code>"100"</code>, <code>String(true)</code> &rarr; <code>"true"</code>.
          </li>
          <li>
            <strong>Boolean(val):</strong> Converts values to <code>true</code> or <code>false</code>.
            Falsy values like <code>0</code>, <code>""</code>, <code>null</code>, and <code>undefined</code> become <code>false</code>;
            numbers and non-empty strings become <code>true</code>.
          </li>
        </ul>
      `,
    },
    {
      id: "understanding-nan",
      heading: "5. Understanding NaN (Not-a-Number)",
      title: "5. Understanding NaN (Not-a-Number)",
      content: `
        <p>
          When you attempt to convert an invalid text string into a number, JavaScript cannot create a valid value.
          Instead, it returns a special numeric sentinel called <strong>NaN</strong> ("Not-a-Number"):
        </p>
        <div class="example-box">
          <pre><code>console.log(Number("apple")); // NaN
console.log(typeof NaN);      // "number" (NaN is a special number value!)</code></pre>
          <p class="example-explanation">
            <strong>The NaN Equality Rule:</strong> In JavaScript, <code>NaN</code> is never equal to anything—including itself!
            Writing <code>NaN === NaN</code> evaluates to <code>false</code>.
            To check if a value is <code>NaN</code>, always use the standard function <code>Number.isNaN(value)</code>:
          </p>
          <pre><code>console.log(Number.isNaN(NaN)); // true</code></pre>
        </div>
      `,
    },
    {
      id: "comprehension-check",
      heading: "6. Comprehension Check: Conversions and NaN",
      title: "6. Comprehension Check: Conversions and NaN",
      content: `
        <div class="concept-card">
          <h4>Concept Check: Predict the Results</h4>
          <ul>
            <li><code>String(123) + " items"</code> &rarr; <strong>"123 items"</strong> (explicit string conversion and concatenation).</li>
            <li><code>Number("hello")</code> &rarr; <strong>NaN</strong> (non-numeric text cannot be converted to a number).</li>
            <li><code>Number.isNaN(Number("hello"))</code> &rarr; <strong>true</strong> (proper way to test for NaN).</li>
            <li><code>Boolean(0)</code> vs <code>Boolean("0")</code> &rarr; <strong>false</strong> for 0, but <strong>true</strong> for "0" (non-empty string is truthy!).</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Explicit conversion is programmer-directed; implicit coercion is automatic engine behavior.",
    "The + operator concatenates strings if either operand is a string, which can cause '40' + '60' === '4060'.",
    "Use Number(val) to safely convert string inputs into numbers before addition.",
    "Use String(val) and Boolean(val) for explicit string and logical conversions.",
    "NaN indicates an invalid numeric operation; its type is 'number', and it must be checked using Number.isNaN(val).",
  ],
  exercise: {
    id: "m2-l5-ex1",
    title: "Exercise: Fixing the String Addition Bug",
    prompt:
      'The starter code receives two numeric values stored as strings ("40" and "60"). Because they are strings, input1 + input2 concatenates them into "4060". Fix the code using Number() to explicitly convert both values before adding them, so the program logs the numeric sum 100.',
    expectedOutput: "100",
    starterCode: `// Module 2, Lesson 5 — Exercise: Type Conversion and Coercion
// Fix the code so that it performs numeric addition instead of string concatenation.
const input1 = "40";
const input2 = "60";

const sum = input1 + input2;
console.log(sum);
`,
    hints: [
      "Wrap input1 and input2 with Number(): Number(input1) + Number(input2);",
      'Change line 6 to:\nconst sum = Number(input1) + Number(input2);',
    ],
    validate: validateM2L5Exercise,
  },
};
