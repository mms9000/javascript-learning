/**
 * content/m5-l4.js — Lesson content for Module 5, Lesson 4.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM5L4Output(entries) {
  const expected = ["River", "3", "A3"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! You created and updated an object and read its properties.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected ${expected.map((value) => `"${value}"`).join(", ")}, but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. Check the object literal, the key stored in key, and the properties you update.`,
  };
}

export const validateM5L4Exercise = createBaseValidator(checkM5L4Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the object braces, property separators, and assignment syntax.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of book, key, title, copies, and shelf.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check that book is an object before reading or updating its properties.`,
});

export const lessonM5L4 = {
  lessonId: "m5-l4",
  moduleId: "m5",
  moduleTitle: "Module 5: Arrays and Objects",
  title: "Creating and Updating Objects",
  estimatedMinutes: 20,
  prerequisites: ["m5-l3"],
  objectives: [
    "Create an object literal with named properties.",
    "Read object properties with dot and bracket notation.",
    "Update a property and add a new property.",
  ],
  starterCode: `// Module 5, Lesson 4 — Exercise: Update a Book Record
const book = {};
const key = "copies";
// Add title "River" and copies 2.
// Increase the copies property using key.
// Add a shelf property with the value "A3".
console.log(book.title);
console.log(book.copies);
console.log(book.shelf);
`,
  sections: [
    {
      id: "object-literals",
      heading: "1. Create a Record with an Object Literal",
      content: `
        <p>An object stores related values under named properties. Write an object
        literal with braces and separate each property name and value with a colon.</p>
        <pre><code>const book = { title: "River", copies: 2 };</code></pre>
      `,
    },
    {
      id: "property-access",
      heading: "2. Read Properties with Dot or Bracket Notation",
      content: `
        <p>Use dot notation when the property name is known in the code:
        <code>book.title</code>. Use brackets when the property key is stored in a
        variable:</p>
        <pre><code>const key = "copies";
console.log(book[key]);</code></pre>
        <p><code>book.key</code> means the property literally named
        <code>"key"</code>; it is different from <code>book[key]</code>.</p>
      `,
    },
    {
      id: "update-properties",
      heading: "3. Update or Add a Property",
      content: `
        <p>Assigning to a property updates its value. Assigning a new property name
        adds it to the object.</p>
        <pre><code>book[key] = book[key] + 1;
book.shelf = "A3";</code></pre>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Which Property?",
      content: `
        <div class="concept-card">
          <h4>Trace the update</h4>
          <ul>
            <li><code>key</code> contains the string <code>"copies"</code>.</li>
            <li><code>book[key]</code> reads and updates the copies property.</li>
            <li><code>book.shelf = "A3"</code> adds a shelf property.</li>
            <li>After the update, copies is 3.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "Object literals group related values under property names.",
    "Dot notation uses a property name written in the code; bracket notation evaluates a key expression.",
    "Assignment can update an existing property or add a new one.",
  ],
  exercise: {
    id: "m5-l4-ex1",
    title: "Exercise: Update a Book Record",
    prompt:
      'Create a book object with title "River" and copies 2. Use the key variable to increase copies, add shelf "A3", and print the three property values.',
    expectedOutput: "River\n3\nA3",
    starterCode: `// Module 5, Lesson 4 — Exercise: Update a Book Record
const book = {};
const key = "copies";
// Add title "River" and copies 2.
// Increase the copies property using key.
// Add a shelf property with the value "A3".
console.log(book.title);
console.log(book.copies);
console.log(book.shelf);
`,
    hints: [
      "Create the title and copies properties in the object literal. The key variable contains the name of the property to update.",
      'Set book[key] to book[key] + 1, then add book.shelf = "A3".',
    ],
    validate: validateM5L4Exercise,
  },
};
