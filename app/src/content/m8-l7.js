import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM8L7Output(entries) {
  const expected = ["4", "11", "5"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed =
    actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);

  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. The public addOne() method updates the private field while keeping the state encapsulated."
      : "Complete the addOne() method so it updates the private #count field and returns the new value without exposing the field directly.",
  };
}

export const validateM8L7Exercise = createBaseValidator(checkM8L7Output, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the private field declaration and the public method syntax.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Use the private field name within the class, not from outside it.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Make sure addOne() returns the updated numeric count.`,
});

export const lessonM8L7 = {
  lessonId: "m8-l7",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "Encapsulation and Private Class Fields",
  estimatedMinutes: 20,
  prerequisites: ["m8-l6"],
  objectives: [
    "Explain why encapsulation keeps internal data private.",
    "Use private class fields to restrict direct access.",
    "Expose safe methods for reading or updating controlled state.",
  ],
  sections: [
    {
      id: "private-data",
      heading: "1. Private Data Is Hidden",
      content: `
        <p>Encapsulation hides implementation details. A class can keep its internal data private and expose only the methods needed by callers.</p>
      `,
    },
    {
      id: "private-fields",
      heading: "2. Private Class Fields",
      content: `
        <p>Private class fields start with <code>#</code> and cannot be read or written directly from outside the class. This avoids accidental mutation.</p>
      `,
    },
    {
      id: "why-safe",
      heading: "3. Safe Accessors",
      content: `
        <p>Public methods can validate input or control how data changes while keeping the actual data stored privately.</p>
      `,
    },
    {
      id: "private-access-rule",
      heading: "4. Why external access is illegal",
      content: `
        <p>JavaScript private fields are enforced by the parser. An expression such as <code>counter.#count</code> outside the class body is a <strong>SyntaxError</strong> before the program runs, because the language forbids accessing a private field from outside its declaring class. The correct pattern is to call a public method such as <code>counter.addOne()</code> that controls how the private state is read or updated.</p>
      `,
    },
  ],
  summary: [
    "Encapsulation hides internal data behind safe methods.",
    "Private fields prevent unauthorized external mutation.",
    "Public methods can validate and control state changes.",
  ],
  exercise: {
    id: "m8-l7-ex1",
    executionMode: "worker",
    title: "Use a public method to update private state",
    prompt: "Complete the Counter class so the public addOne() method updates the private #count field and returns the new value.",
    expectedOutput: "4\n11\n5",
    starterCode: `class Counter {
  #count;

  constructor(start = 0) {
    this.#count = start;
  }

  addOne() {
    // TODO: increment the private field and return the updated value.
  }
}

const first = new Counter(3);
const second = new Counter(10);

console.log(first.addOne());
console.log(second.addOne());
console.log(first.addOne());
`,
    hints: [
      "Use this.#count inside the class to access the private field.",
      "Increment the value by 1 and return the updated count.",
      "The final result confirms the method updates the private data while keeping it encapsulated.",
    ],
    successMessage: "Correct. The public method updates the private field while the class keeps that state hidden from outside code.",
    validate: validateM8L7Exercise,
  },
  comprehensionCheck: {
    id: "m8-l7-comprehension",
    title: "Check your understanding of private fields",
    prompt: "Why is counter.#count illegal outside the class that declares #count?",
    hints: [
      "Private field access is checked as JavaScript parses the program.",
      "An illegal private name is not an ordinary runtime property lookup.",
    ],
    successMessage: "Correct. The parser rejects external private-field access with a SyntaxError before execution.",
    failureMessage: "Private-field access is a syntax rule, so illegal external access fails before the code runs.",
    questions: [{
      prompt: "What happens when code outside Counter contains counter.#count?",
      correctOptionId: "parse-time",
      options: [
        { id: "parse-time", label: "It is a SyntaxError detected before the program executes." },
        { id: "runtime-type", label: "It runs and throws a TypeError only when that line executes." },
        { id: "undefined", label: "It runs and returns undefined like a missing public property." },
      ],
    }],
  },
};
