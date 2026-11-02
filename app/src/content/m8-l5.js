import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM8L5Output(entries) {
  const expected = ["8", "6", "8"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed =
    actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);

  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. The method uses this.total to update each instance's own state." 
      : "Complete the add method so it updates this.total and returns the new value for each instance.",
  };
}

export const validateM8L5Exercise = createBaseValidator(checkM8L5Output, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the class syntax and the assignment to this.total.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Make sure the method reads this.total from the current instance.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Ensure the method returns the updated numeric total.`,
});

export const lessonM8L5 = {
  lessonId: "m8-l5",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "Instance Methods and this",
  estimatedMinutes: 20,
  prerequisites: ["m8-l4"],
  objectives: [
    "Use instance methods to model behavior on an object.",
    "Explain how this changes depending on the call site.",
    "Avoid common mistakes when using methods outside their original object.",
  ],
  sections: [
    {
      id: "this-basic",
      heading: "1. this Refers to the Current Object",
      content: `
        <p>Inside a method, <code>this</code> usually refers to the object that called the method. This is why methods can access the object's own properties.</p>
      `,
    },
    {
      id: "call-site",
      heading: "2. The Call Site Matters",
      content: `
        <p>The value of <code>this</code> depends on how a function is invoked. A method called as <code>obj.method()</code> behaves differently from a standalone function reference.</p>
      `,
    },
    {
      id: "common-bug",
      heading: "3. Common Beginner Mistake",
      content: `
        <p>If a method is detached from its object, <code>this</code> may lose the object context. Using arrow functions or binding can help in some patterns.</p>
      `,
    },
  ],
  summary: [
    "Methods usually use this to refer to the current object.",
    "The value of this depends on the call site.",
    "Detached methods can lose the object context.",
  ],
  exercise: {
    id: "m8-l5-ex1",
    executionMode: "worker",
    title: "Update instance state with this",
    prompt: "Complete the Counter class so each instance updates its own total using this.total and returns the new value.",
    expectedOutput: "8\n6\n8",
    starterCode: `class Counter {
  constructor(start = 0) {
    this.total = start;
  }

  add(value) {
    // TODO: Update this.total with value and return the new total.
  }
}

const first = new Counter(5);
const second = new Counter(2);

console.log(first.add(3));
console.log(second.add(4));
console.log(first.total);
`,
    hints: [
      "Use this.total to access the current instance state.",
      "Return the updated total after adding the value.",
      "The last line confirms the first instance kept its own total after the second instance was updated.",
    ],
    successMessage: "Correct. The method updates the instance's own total using this.total and returns the new value.",
    validate: validateM8L5Exercise,
  },
};
