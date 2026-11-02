/**
 * content/m3-l2.js — Lesson content for Module 3, Lesson 2.
 *
 * Title: "if, else if, and else"
 * Conforms to curriculum-spec.md, constitution.md, and feature-spec-playground.md.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM3L2Output(entries) {
  if (entries.length === 1 && stripTrailingNewlines(entries[0].text) === "Passing") {
    return {
      passed: true,
      status: "success",
      message:
        "Success! The first condition was false, so the else if branch correctly classified the score as passing.",
    };
  }

  if (entries.length === 0) {
    return {
      passed: false,
      status: "mismatch",
      message: 'No output was printed. The score 82 reaches the score >= 70 branch; print "Passing".',
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected exactly one line, "Passing", but received ${entries.map((entry) => `"${stripTrailingNewlines(entry.text)}"`).join(", ")}. Check the order and boundaries of the if and else if conditions.`,
  };
}

export const validateM3L2Exercise = createBaseValidator(checkM3L2Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the condition parentheses, braces, and if/else if/else order.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of score and console.log.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that the comparison and console.log calls use valid values.`,
});

export const lessonM3L2 = {
  lessonId: "m3-l2",
  moduleId: "m3",
  moduleTitle: "Module 3: Decisions and Repetition",
  title: "if, else if, and else",
  estimatedMinutes: 20,
  prerequisites: ["m3-l1"],
  objectives: [
    "Use an if/else if/else chain to select one matching branch.",
    "Use comparison expressions as conditions.",
    "Explain why branch order matters and how else acts as the fallback.",
  ],
  starterCode: `// Module 3, Lesson 2 — Exercise: Classify a Score
const score = 82;

if (score >= 90) {
  console.log("Excellent");
} else if (score >= 70) {
  // Print "Passing".
} else {
  console.log("Keep practicing");
}
`,
  sections: [
    {
      id: "if-conditions",
      heading: "1. Make a Decision with if",
      content: `
        <p>An <code>if</code> statement runs its block only when its condition is truthy.
        The comparison operators you learned in Module 2 produce boolean results.</p>
        <pre><code>const temperature = 30;
if (temperature > 25) {
  console.log("It is warm");
}</code></pre>
      `,
    },
    {
      id: "else-fallback",
      heading: "2. Add an else Fallback",
      content: `
        <p>Use <code>else</code> for the alternative when the <code>if</code> condition
        is false. Exactly one of these two blocks runs.</p>
        <pre><code>if (temperature > 25) {
  console.log("Warm");
} else {
  console.log("Cool or equal to 25");
}</code></pre>
      `,
    },
    {
      id: "else-if-order",
      heading: "3. Check More Than One Case",
      content: `
        <p>An <code>else if</code> adds another condition. JavaScript checks the chain
        from top to bottom and runs the first matching block. Put specific or higher
        thresholds before broader ones so later cases remain reachable.</p>
        <pre><code>if (score >= 90) {
  console.log("Excellent");
} else if (score >= 70) {
  console.log("Passing");
} else {
  console.log("Keep practicing");
}</code></pre>
        <p>If <code>score</code> is 82, the first check is false and the second is true.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Trace the Branch",
      content: `
        <div class="concept-card">
          <h4>Predict the selected message</h4>
          <ul>
            <li>A score of 95 prints <strong>Excellent</strong>.</li>
            <li>A score of 70 prints <strong>Passing</strong>.</li>
            <li>A score of 69 prints <strong>Keep practicing</strong>.</li>
            <li>Placing <code>score &gt;= 70</code> first makes the 90-point branch unreachable.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "An if block runs only when its condition is truthy.",
    "else provides a fallback, and else if adds another condition to the chain.",
    "The first matching branch runs; branch order matters when conditions overlap.",
    "Comparison expressions such as score >= 70 produce Boolean conditions.",
  ],
  exercise: {
    id: "m3-l2-ex1",
    title: "Exercise: Classify a Score",
    prompt:
      'Complete the score chain so that score 82 prints exactly "Passing". Preserve the supplied thresholds and branch order.',
    expectedOutput: "Passing",
    starterCode: `// Module 3, Lesson 2 — Exercise: Classify a Score
const score = 82;

if (score >= 90) {
  console.log("Excellent");
} else if (score >= 70) {
  // Print "Passing".
} else {
  console.log("Keep practicing");
}
`,
    hints: [
      "The first condition is false for 82. The next condition, score >= 70, is true.",
      'Add console.log("Passing"); inside the else if block.',
    ],
    validate: validateM3L2Exercise,
  },
};
