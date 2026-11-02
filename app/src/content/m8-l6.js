import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM8L6Output(entries) {
  const expected = ["Luna makes a sound. Woof!", "true"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed =
    actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);

  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. The subclass used super.speak() to include the parent behavior and then added its own sound."
      : "Implement the Dog override so it calls super.speak() and then adds the subclass-specific bark. Check the output order and the final instanceof result.",
  };
}

export const validateM8L6Exercise = createBaseValidator(checkM8L6Output, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the class extension and the super call.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Confirm the parent method name and the child class name.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Ensure the subclass override returns a string.`,
});

export const lessonM8L6 = {
  lessonId: "m8-l6",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "Inheritance Using extends and super",
  estimatedMinutes: 25,
  prerequisites: ["m8-l5"],
  objectives: [
    "Use extends to create a child class from a parent class.",
    "Call super() to initialize the parent constructor.",
    "Explain how subclasses reuse behavior from a parent class.",
  ],
  sections: [
    {
      id: "extends",
      heading: "1. A Subclass Extends a Parent Class",
      content: `
        <p><code>extends</code> creates a child class that inherits from a parent class. It modelled a specialized version of the same concept.</p>
      `,
    },
    {
      id: "super",
      heading: "2. super Calls the Parent Behavior",
      content: `
        <p><code>super()</code> runs the parent constructor, while <code>super.methodName()</code> calls a method defined on the parent class.</p>
      `,
    },
    {
      id: "inheritance-idea",
      heading: "3. Inheritance Shares Common Behavior",
      content: `
        <p>Inheritance works well when different classes share the same kind of behavior but have a few special differences.</p>
      `,
    },
    {
      id: "super-purpose",
      heading: "4. Why super matters",
      content: `
        <p><code>super</code> gives a subclass access to the parent class's constructor and methods. In a subclass override, <code>super.speak()</code> gives the parent behavior and then the child can add its own specialization. This keeps shared behavior in one place instead of rewriting it.</p>
      `,
    },
  ],
  summary: [
    "A subclass can inherit from a parent class.",
    "super() initializes the parent constructor.",
    "Inheritance helps model shared behavior across related classes.",
  ],
  exercise: {
    id: "m8-l6-ex1",
    executionMode: "worker",
    title: "Override behavior with super",
    prompt: "Complete the Dog subclass so it uses the parent speak() result and adds a dog-specific sound while preserving the Animal relationship.",
    expectedOutput: "Luna makes a sound. Woof!\ntrue",
    starterCode: `class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return this.name + " makes a sound.";
  }
}

class Dog extends Animal {
  speak() {
    // TODO: call super.speak() and add the dog-specific sound.
  }
}

const luna = new Dog("Luna");
console.log(luna.speak());
console.log(luna instanceof Animal);
`,
    hints: [
      "Use super.speak() to start with the parent behavior.",
      "Append the dog-specific phrase, such as ' Woof!'.",
      "The final line should print true because Dog is a subclass of Animal.",
    ],
    successMessage: "Correct. The subclass reuses the parent behavior with super and then adds its own unique behavior.",
    validate: validateM8L6Exercise,
  },
  comprehensionCheck: {
    id: "m8-l6-comprehension",
    title: "Check your understanding of super",
    prompt: "Why does Dog.speak() call super.speak() before adding its own sound?",
    hints: [
      "The parent class already defines behavior shared by related animals.",
      "The subclass can reuse that result and then specialize it.",
    ],
    successMessage: "Correct. super.speak() reuses the parent's behavior so the subclass can extend it.",
    failureMessage: "Review how an override can reuse parent behavior before adding its specialization.",
    questions: [{
      prompt: "What is the purpose of super.speak() in this override?",
      correctOptionId: "reuse-parent",
      options: [
        { id: "reuse-parent", label: "Call the parent method so Dog can extend its behavior without rewriting the shared part." },
        { id: "make-static", label: "Make speak() a static method that belongs only to the Dog class." },
        { id: "skip-parent", label: "Skip the parent method and create a separate prototype chain." },
      ],
    }],
  },
};
