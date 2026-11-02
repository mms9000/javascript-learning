import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM8L2Output(entries) {
  const expected = ["Hello, Alice!", "true"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed =
    actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);

  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. Each instance keeps its own name while the shared greet method is found on the prototype."
      : "Check the constructor, the shared prototype method, and the output order. The method should greet the instance name and then confirm that instances share the same prototype method.",
  };
}

export const validateM8L2Exercise = createBaseValidator(checkM8L2Output, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the constructor, prototype method, and the new keyword syntax.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the names of the Person constructor and its greet method.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Make sure the greeting uses the instance's own name and returns a string.`,
});

export const lessonM8L2 = {
  lessonId: "m8-l2",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "Constructor Functions and Prototypes",
  estimatedMinutes: 25,
  prerequisites: ["m8-l1"],
  objectives: [
    "Build a constructor function to create many similar objects.",
    "Use the new keyword to create object instances.",
    "Explain how prototype methods are shared across instances.",
  ],
  sections: [
    {
      id: "constructor",
      heading: "1. Constructor Functions Create Similar Objects",
      content: `
        <p>A constructor function is a template for creating many objects that share the same structure. It uses <code>this</code> to assign values to each new instance.</p>
        <pre><code>function Person(name, age) {
  this.name = name;
  this.age = age;
}</code></pre>
      `,
    },
    {
      id: "prototype",
      heading: "2. Prototype Methods Are Shared",
      content: `
        <p>Methods such as <code>greet</code> are often added to the constructor's prototype. Every instance can use the same function without duplicating it in every object.</p>
      `,
    },
    {
      id: "new-keyword",
      heading: "3. The new Keyword Creates an Instance",
      content: `
        <p>The <code>new</code> keyword calls the constructor, creates a new object, and connects that object to the constructor's prototype.</p>
      `,
    },
  ],
  summary: [
    "Constructors create multiple similar objects.",
    "The new keyword creates a fresh instance.",
    "Prototype methods are shared by all instances.",
  ],
  exercise: {
    id: "m8-l2-ex1",
    executionMode: "worker",
    title: "Build a shared greeting method",
    prompt: "Complete the Person constructor and the shared prototype method so two instances can both greet correctly and share the same method reference.",
    expectedOutput: "Hello, Alice!\ntrue",
    starterCode: `function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  // TODO: Return a greeting string using this.name.
};

const alice = new Person("Alice");
const bob = new Person("Bob");

console.log(alice.greet());
console.log(alice.greet === bob.greet);
`,
    hints: [
      "Use the instance's own name in the greeting string.",
      "The prototype method should return a single greeting like 'Hello, Alice!'.",
      "The final comparison should print true because both instances share the same prototype function.",
    ],
    successMessage: "Correct. Each instance stores its own name, while the shared greet method is looked up on the prototype.",
    validate: validateM8L2Exercise,
  },
};
