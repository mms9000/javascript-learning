/**
 * content/m5-l7.js — Lesson content for Module 5, Lesson 7.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM5L7Output(entries) {
  const expected = ["4", "9", "Published", "Published", "My copy", "arrays"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! You distinguished independent primitive bindings, an object alias, and a shallow copy with a shared nested array.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected ${expected.map((value) => `"${value}"`).join(", ")}, but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Reassigning a primitive binding does not change its earlier value; object aliases share properties, while spread copies only the top level.`,
  };
}

export const validateM5L7Exercise = createBaseValidator(checkM5L7Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the object literals, property assignments, and method call.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of points, copiedPoints, original, alias, and copy.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that tags is an array before adding an item to it.`,
});

export const lessonM5L7 = {
  lessonId: "m5-l7",
  moduleId: "m5",
  moduleTitle: "Module 5: Arrays and Objects",
  title: "References, Mutation, and Copying",
  estimatedMinutes: 25,
  prerequisites: ["m5-l6"],
  objectives: [
    "Explain that primitive values copied into a new binding are independent, while object variables can refer to the same object.",
    "Predict how an alias observes object mutation and distinguish mutation from rebinding.",
    "Create a shallow copy and explain which nested references remain shared.",
  ],
  starterCode: `// Module 5, Lesson 7 — Exercise: Trace an Alias and a Shallow Copy
let points = 4;
const copiedPoints = points;
points = 9;
console.log(copiedPoints);
console.log(points);

const original = { title: "Draft", tags: ["js"] };
const alias = original;
const copy = { ...original };
// Change original.title to "Published".
// Add "arrays" to the shared tags array.
// Change copy.title to "My copy".
console.log(alias.title);
console.log(original.title);
console.log(copy.title);
console.log(copy.tags[1]);
`,
  sections: [
    {
      id: "primitive-values",
      heading: "1. Primitive Values Are Independent Values",
      content: `
        <p>When a primitive value is assigned to another variable, that variable gets
        its own value. Reassigning one binding does not change the other.</p>
        <pre><code>let points = 4;
const copiedPoints = points;
points = 9;
console.log(copiedPoints); // 4
console.log(points);       // 9</code></pre>
      `,
    },
    {
      id: "object-references",
      heading: "2. Object Variables Can Share a Reference",
      content: `
        <p>Objects and arrays can be accessed through references. Assigning an object
        variable to another variable does not make another object; both names can refer
        to the same object.</p>
        <pre><code>const original = { title: "Draft" };
const alias = original;
original.title = "Published";
console.log(alias.title); // Published</code></pre>
        <p><code>const</code> prevents rebinding the variable name, but it does not
        freeze an object's properties.</p>
      `,
    },
    {
      id: "shallow-copy",
      heading: "3. Spread Makes a Shallow Copy",
      content: `
        <p>Object spread creates a new top-level object with the source's properties.
        Updating a top-level property on the copy does not update the original.</p>
        <pre><code>const copy = { ...original };
copy.title = "My copy";</code></pre>
        <p>This copy is shallow. If a property contains an array or another object,
        the copied property still refers to the same nested value.</p>
      `,
    },
    {
      id: "shared-nested-reference",
      heading: "4. Comprehension Check: Which Values Are Shared?",
      content: `
        <div class="concept-card">
          <h4>Trace primitive and object updates</h4>
          <ul>
            <li>After <code>points = 9</code>, <code>copiedPoints</code> is still 4.</li>
            <li><code>alias</code> and <code>original</code> refer to the same object, so both see its updated title.</li>
            <li><code>copy.title</code> is independent at the top level.</li>
            <li><code>copy.tags</code> and <code>original.tags</code> still refer to the same nested array.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "A copied primitive value is independent of later reassignment to another binding.",
    "Object variables can refer to the same object; mutation through one reference is visible through the other.",
    "A spread copy has a new top-level object, but nested objects and arrays can remain shared.",
    "const prevents rebinding but does not make object contents immutable.",
  ],
  exercise: {
    id: "m5-l7-ex1",
    title: "Exercise: Trace an Alias and a Shallow Copy",
    prompt:
      'Run the primitive-value example and complete the object updates. Print both primitive bindings, the alias and original titles, the copied title, and the second shared tag.',
    expectedOutput: "4\n9\nPublished\nPublished\nMy copy\narrays",
    starterCode: `// Module 5, Lesson 7 — Exercise: Trace an Alias and a Shallow Copy
let points = 4;
const copiedPoints = points;
points = 9;
console.log(copiedPoints);
console.log(points);

const original = { title: "Draft", tags: ["js"] };
const alias = original;
const copy = { ...original };
// Change original.title to "Published".
// Add "arrays" to the shared tags array.
// Change copy.title to "My copy".
console.log(alias.title);
console.log(original.title);
console.log(copy.title);
console.log(copy.tags[1]);
`,
    hints: [
      "The primitive bindings should print different values after points is reassigned. alias and original, however, refer to one object.",
      'Assign "Published" to original.title, push "arrays" into original.tags, and assign "My copy" to copy.title.',
    ],
    validate: validateM5L7Exercise,
  },
};
