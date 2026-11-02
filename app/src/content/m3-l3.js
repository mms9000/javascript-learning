/**
 * content/m3-l3.js — Lesson content for Module 3, Lesson 3.
 *
 * Title: "switch and Conditional Expressions"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM3L3Output(entries) {
  const expected = ["Express delivery", "Member price"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message:
        "Success! You selected a matching switch case, prevented fall-through, and used a ternary conditional expression for a two-way choice.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected two lines: "${expected[0]}" and "${expected[1]}". Received ${actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"}. Check the matching case, its break, and both outcomes of the ternary conditional expression.`,
  };
}

export const validateM3L3Exercise = createBaseValidator(checkM3L3Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the switch braces and the question mark and colon in the ternary conditional expression.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check deliveryCode, deliveryLabel, isMember, and console.log for spelling and capitalization.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that the selected case assigns a label and the ternary condition is a Boolean expression.`,
});

export const lessonM3L3 = {
  lessonId: "m3-l3",
  moduleId: "m3",
  moduleTitle: "Module 3: Decisions and Repetition",
  title: "switch and Conditional Expressions",
  estimatedMinutes: 15,
  prerequisites: ["m3-l2"],
  objectives: [
    "Use switch to choose a branch for a fixed value.",
    "Use break to prevent switch fall-through and default for an unmatched value.",
    "Use the ternary conditional operator for a simple two-way value choice.",
  ],
  starterCode: `// Module 3, Lesson 3 — Exercise: Choose a Delivery Option
const deliveryCode = "express";
const isMember = true;
let deliveryLabel;

switch (deliveryCode) {
  case "standard":
    deliveryLabel = "Standard delivery";
    break;
  case "express":
    // Set the express label and prevent fall-through.
    break;
  default:
    deliveryLabel = "Unknown delivery";
}

console.log(deliveryLabel);
console.log(isMember ? "Member price" : "Regular price");
`,
  sections: [
    {
      id: "switch-fixed-choices",
      heading: "1. Use switch for Fixed Choices",
      content: `
        <p>A <code>switch</code> statement compares one value with a list of fixed
        <code>case</code> values. It is useful for choices such as a selected menu
        command or a delivery code. For ranges, an <code>if</code> chain is usually clearer.</p>
        <pre><code>switch (deliveryCode) {
  case "standard":
    console.log("Standard delivery");
    break;
  default:
    console.log("Other delivery");
}</code></pre>
      `,
    },
    {
      id: "break-and-default",
      heading: "2. Stop a Case with break",
      content: `
        <p><code>break</code> exits the current <code>switch</code>. Without it, execution
        continues into the next case, a behavior called <strong>fall-through</strong>.
        The <code>default</code> branch runs when no case matches.</p>
        <pre><code>switch ("express") {
  case "express":
    console.log("Express");
    break;
  default:
    console.log("Other");
}</code></pre>
        <p>Predict what would print if the <code>break</code> were removed, or if the
        switch value were <code>"overnight"</code>.</p>
      `,
    },
    {
      id: "ternary-conditional-operator",
      heading: "3. The Ternary Conditional Operator",
      content: `
        <p>The <strong>ternary conditional operator</strong> is the three-part operator
        written with <code>?</code> and <code>:</code>. It checks a condition and produces
        one of two values: <code>condition ? valueIfTrue : valueIfFalse</code>.</p>
        <pre><code>const priceLabel = isMember ? "Member price" : "Regular price";</code></pre>
        <p>Use a ternary for a simple two-way value choice. Use an <code>if</code> chain
        when there are several branches or the logic needs multiple statements.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Cases and Choices",
      content: `
        <div class="concept-card">
          <h4>Predict and choose</h4>
          <ul>
            <li>An unrecognized switch value reaches <strong>default</strong>.</li>
            <li>Without <code>break</code>, execution can continue into the next case.</li>
            <li>A fixed delivery code fits <strong>switch</strong>; a price label with two outcomes fits a ternary.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Use switch when comparing one value with several fixed cases.",
    "Use break to stop a case; default handles values with no matching case.",
    "Without break, switch execution can fall through to later cases.",
    "The ternary conditional operator (condition ? trueValue : falseValue) produces one of two values.",
  ],
  exercise: {
    id: "m3-l3-ex1",
    title: "Exercise: Choose a Delivery Option",
    prompt:
      'Complete the express switch case and use the provided ternary expression to print exactly "Express delivery" and "Member price", each on its own line.',
    expectedOutput: "Express delivery\nMember price",
    starterCode: `// Module 3, Lesson 3 — Exercise: Choose a Delivery Option
const deliveryCode = "express";
const isMember = true;
let deliveryLabel;

switch (deliveryCode) {
  case "standard":
    deliveryLabel = "Standard delivery";
    break;
  case "express":
    // Set the express label and prevent fall-through.
    break;
  default:
    deliveryLabel = "Unknown delivery";
}

console.log(deliveryLabel);
console.log(isMember ? "Member price" : "Regular price");
`,
    hints: [
      'The value is "express". Set deliveryLabel to "Express delivery" inside that case, then stop the switch.',
      'Use deliveryLabel = "Express delivery"; followed by break;. The ternary is condition ? valueIfTrue : valueIfFalse.',
    ],
    validate: validateM3L3Exercise,
  },
};
