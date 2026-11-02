/**
 * content/m5-l5.js — Lesson content for Module 5, Lesson 5.
 */

import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM5L5Output(entries) {
  const expected = ["5", "5"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((value, index) => value === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Success! The direct method call used this to update and return the owning object's value.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: `Expected the returned and stored values to be 5, but received ${
      actual.length ? actual.map((value) => `"${value}"`).join(", ") : "no output"
    }. In counter.increase(amount), update and return this.value.`,
  };
}

export const validateM5L5Exercise = createBaseValidator(checkM5L5Output, {
  syntaxErrorMessage: (message) =>
    `Syntax Error: ${message}. Check the method braces, parameter, and return statement.`,
  referenceErrorMessage: (message) =>
    `Reference Error: ${message}. Check the spelling and capitalization of counter, amount, and value.`,
  typeErrorMessage: (message) =>
    `Type Error: ${message}. Check the object method call and the value used by the method.`,
});

export const lessonM5L5 = {
  lessonId: "m5-l5",
  moduleId: "m5",
  moduleTitle: "Module 5: Arrays and Objects",
  title: "Methods and the this Keyword",
  estimatedMinutes: 25,
  prerequisites: ["m5-l4"],
  objectives: [
    "Define a method on an object and call it through that object.",
    "Use this in a directly called method to read and update the object's properties.",
    "Return a value computed from the updated property.",
  ],
  starterCode: `// Module 5, Lesson 5 — Exercise: Increase an Object's Counter
const counter = {
  label: "Count",
  value: 2,
  increase(amount) {
    // Update this.value and return the new value.
  },
};
console.log(counter.increase(3));
console.log(counter.value);
`,
  sections: [
    {
      id: "object-methods",
      heading: "1. Define a Method on an Object",
      content: `
        <p>A method is a function stored as an object property. Method shorthand keeps
        the function next to the data it works with.</p>
        <pre><code>const counter = {
  value: 2,
  increase(amount) {
    this.value = this.value + amount;
    return this.value;
  },
};</code></pre>
      `,
    },
    {
      id: "direct-method-call",
      heading: "2. Call the Method Through Its Object",
      content: `
        <p>When you call <code>counter.increase(3)</code>, the object before the dot
        is the method's receiver. In this direct call, <code>this</code> refers to
        <code>counter</code>.</p>
        <pre><code>console.log(counter.increase(3)); // 5
console.log(counter.value);       // 5</code></pre>
        <p>Keep this lesson to direct calls through the object; moving a method to a
        separate variable can change its receiver.</p>
      `,
    },
    {
      id: "this-property-update",
      heading: "3. Read, Update, and Return a Property",
      content: `
        <p><code>this.value</code> reads the receiver's property. Assigning to it
        updates that property. Returning <code>this.value</code> sends the new value
        back to the caller.</p>
        <p><code>this.value</code> is not the same as a local variable named
        <code>value</code>.</p>
      `,
    },
    {
      id: "comprehension-check",
      heading: "4. Comprehension Check: Trace the Receiver",
      content: `
        <div class="concept-card">
          <h4>Trace <code>counter.increase(3)</code></h4>
          <ul>
            <li>The receiver is <code>counter</code>, so <code>this.value</code> begins at 2.</li>
            <li>The argument <code>3</code> is added to that property.</li>
            <li>The method returns 5 and the stored property is also 5.</li>
          </ul>
        </div>
      `,
    },
  ],
  summary: [
    "An object method is a function stored as a property.",
    "In a direct call such as object.method(), this refers to the receiver object.",
    "Updating this.value changes the receiver's property; return the new value to the caller.",
  ],
  exercise: {
    id: "m5-l5-ex1",
    title: "Exercise: Increase an Object's Counter",
    prompt:
      "Complete increase so the direct call counter.increase(3) updates counter.value from 2 to 5 and returns that new value. Print the return value and the stored property.",
    expectedOutput: "5\n5",
    starterCode: `// Module 5, Lesson 5 — Exercise: Increase an Object's Counter
const counter = {
  label: "Count",
  value: 2,
  increase(amount) {
    // Update this.value and return the new value.
  },
};
console.log(counter.increase(3));
console.log(counter.value);
`,
    hints: [
      "Because the method is called directly through counter, this refers to that object. The existing value is available as this.value.",
      "Add amount to this.value, then return this.value.",
    ],
    validate: validateM5L5Exercise,
  },
};
