/**
 * content/m5-l8.js — Lesson content and milestone for Module 5, Lesson 8.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM5L8Output(entries) {
  const expected = ["Notebook: 2", "Pen: 3", "Units: 5", "Value: 9"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! You filtered available inventory, mapped item labels, and reduced the collection to its unit and value totals.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected ${expected.map((value) => `"${value}"`).join(", ")}, but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Keep items with quantity above 0, map each to a label, and reduce quantity and price-times-quantity totals from 0.`,
  };
}

export const validateM5L8Exercise = createBaseValidator(checkM5L8Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the callbacks, object properties, and loop braces.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the names inventory, available, labels, units, and value.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that the array callbacks return their results and that reduce starts with a number.`,
});

export const lessonM5L8 = {
  lessonId: "m5-l8",
  moduleId: "m5",
  moduleTitle: "Module 5: Arrays and Objects",
  title: "Transforming Collections of Objects",
  estimatedMinutes: 25,
  prerequisites: ["m5-l7"],
  objectives: [
    "Read object properties while processing an array of records.",
    "Use filter, map, and reduce callbacks to derive a list and aggregate values.",
    "Create a report without mutating the source records.",
  ],
  starterCode: `// Module 5, Lesson 8 — Milestone: Build an Inventory Summary
const inventory = [
  { name: "Notebook", price: 3, quantity: 2 },
  { name: "Pen", price: 1, quantity: 3 },
  { name: "Marker", price: 2, quantity: 0 },
];
const available = inventory.filter((item) => {
  // Keep items with stock.
});
const labels = available.map((item) => {
  // Return "Name: quantity".
});
const units = available.reduce((total, item) => {
  // Add this item's quantity.
}, 0);
const value = available.reduce((total, item) => {
  // Add this item's price times quantity.
}, 0);
for (const label of labels) console.log(label);
console.log(\`Units: \${units}\`);
console.log(\`Value: \${value}\`);
`,
  sections: [
    {
      id: "collection-records",
      heading: "1. Read Records from an Array",
      content: `
        <p>An array can hold objects that share the same property names. Each item is
        one record; a loop or array-method callback receives one record at a time.</p>
        <pre><code>const inventory = [
  { name: "Notebook", price: 3, quantity: 2 },
  { name: "Pen", price: 1, quantity: 3 },
  { name: "Marker", price: 2, quantity: 0 },
];</code></pre>
      `,
    },
    {
      id: "filter-and-map-records",
      heading: "2. Filter Records and Map Labels",
      content: `
        <p>Use <code>filter</code> to derive a new list of records with stock, then
        <code>map</code> to derive a label for each available item.</p>
        <pre><code>const available = inventory.filter((item) => item.quantity > 0);
const labels = available.map((item) => \`\${item.name}: \${item.quantity}\`);</code></pre>
        <p>These methods return new arrays and do not require changing the source records.</p>
      `,
    },
    {
      id: "reduce-records",
      heading: "3. Reduce Records to Totals",
      content: `
        <p>Use <code>reduce</code> with a starting total of zero to add each record's
        quantity or value. A record's value is its price multiplied by its quantity.</p>
        <pre><code>const units = available.reduce((total, item) => total + item.quantity, 0);
const value = available.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);</code></pre>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Predict the Inventory Report",
      content: `
        <div class="concept-card">
          <h4>Trace the available records</h4>
          <ul>
            <li><code>filter</code> keeps Notebook and Pen; Marker has no stock.</li>
            <li><code>map</code> produces <code>"Notebook: 2"</code> and <code>"Pen: 3"</code>.</li>
            <li>The unit total is <code>2 + 3 = 5</code>.</li>
            <li>The value total is <code>3 × 2 + 1 × 3 = 9</code>.</li>
            <li>The source records need not be mutated to produce this report.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Each callback receives an object record and can read its properties.",
    "filter selects records, map derives labels, and reduce computes totals.",
    "Transformations can create a report without modifying source records.",
  ],
  exercise: {
    id: "m5-l8-ex1",
    title: "Module 5 Milestone: Build an Inventory Summary",
    prompt:
      'Complete the callbacks to exclude items with no stock, create "Name: quantity" labels, and total units and value. Print the two labels, then the units and value lines.',
    expectedOutput: "Notebook: 2\nPen: 3\nUnits: 5\nValue: 9",
    starterCode: `// Module 5, Lesson 8 — Milestone: Build an Inventory Summary
const inventory = [
  { name: "Notebook", price: 3, quantity: 2 },
  { name: "Pen", price: 1, quantity: 3 },
  { name: "Marker", price: 2, quantity: 0 },
];
const available = inventory.filter((item) => {
  // Keep items with stock.
});
const labels = available.map((item) => {
  // Return "Name: quantity".
});
const units = available.reduce((total, item) => {
  // Add this item's quantity.
}, 0);
const value = available.reduce((total, item) => {
  // Add this item's price times quantity.
}, 0);
for (const label of labels) console.log(label);
console.log(\`Units: \${units}\`);
console.log(\`Value: \${value}\`);
`,
    hints: [
      "The report can be built from new arrays and numeric totals; no inventory property needs to be changed.",
      "Filter with item.quantity > 0, map to `${item.name}: ${item.quantity}`, then reduce with total + item.quantity and total + item.price * item.quantity, each starting at 0.",
    ],
    validate: validateM5L8Exercise,
  },
};
