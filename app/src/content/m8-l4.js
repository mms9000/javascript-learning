import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM8L4Output(entries) {
  const expected = ["Pride and Prejudice by Jane Austen", "true"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed =
    actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);

  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. Each object gets its own constructor state and the method reads those instance values."
      : "Complete the constructor so each instance has its own title and author. Then confirm the instance method reads those values and returns the formatted info string.",
  };
}

export const validateM8L4Exercise = createBaseValidator(checkM8L4Output, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the class, constructor, and method syntax.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the property names in the constructor and instance method.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Ensure the constructor assigns instance data before the method reads it.`,
});

export const lessonM8L4 = {
  lessonId: "m8-l4",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "Classes and Constructors",
  estimatedMinutes: 25,
  prerequisites: ["m8-l3"],
  objectives: [
    "Write a class declaration for a reusable object shape.",
    "Use the constructor to initialize each instance.",
    "Compare classes to constructor functions and prototypes.",
  ],
  sections: [
    {
      id: "class-syntax",
      heading: "1. Classes Provide Cleaner Syntax",
      content: `
        <p>Classes are a cleaner syntax for creating constructor-based objects. They still rely on JavaScript's prototype mechanism under the hood.</p>
        <pre><code>class Book {
  constructor(title) {
    this.title = title;
  }
}</code></pre>
      `,
    },
    {
      id: "constructor-init",
      heading: "2. The Constructor Initializes State",
      content: `
        <p>Each instance gets a new object and receives its own property values from the constructor.</p>
      `,
    },
    {
      id: "prototype-under-hood",
      heading: "3. Classes Still Use the Prototype Model",
      content: `
        <p>Classes are not a separate object system; they are a modern syntax built on the same prototype-based rules.</p>
      `,
    },
  ],
  summary: [
    "Classes provide readable syntax for object templates.",
    "The constructor assigns per-instance data.",
    "Classes still use prototypes under the hood.",
  ],
  exercise: {
    id: "m8-l4-ex1",
    executionMode: "worker",
    title: "Create a class with instance state",
    prompt: "Complete the Book class so each instance stores its own title and author, and its info() method returns the expected string.",
    expectedOutput: "Pride and Prejudice by Jane Austen\ntrue",
    starterCode: `class Book {
  constructor(title, author) {
    // TODO: assign the instance title and author.
  }

  info() {
    return \`\${this.title} by \${this.author}\`;
  }
}

const classic = new Book("Pride and Prejudice", "Jane Austen");
const sciFi = new Book("Frankenstein", "Mary Shelley");

console.log(classic.info());
console.log(classic.info === sciFi.info);
`,
    hints: [
      "Set this.title and this.author inside the constructor.",
      "The instance method should return a formatted string using those properties.",
      "The final line should print true because both objects share the same class method.",
    ],
    successMessage: "Correct. The constructor initializes per-instance values while the shared method reads them at runtime.",
    validate: validateM8L4Exercise,
  },
};
