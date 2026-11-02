export const lessonM8L1 = {
  lessonId: "m8-l1",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "Objects, Properties, and Methods",
  estimatedMinutes: 20,
  prerequisites: ["m7-l7"],
  objectives: [
    "Create an object and store values in named properties.",
    "Use object methods to encapsulate related behavior.",
    "Read data from objects and call a method on that object.",
  ],
  sections: [
    {
      id: "object-shape",
      heading: "1. Objects Group Related Data",
      content: `
        <p>An object is a collection of properties, each with a name and a value. A property can be a primitive, array, nested object, or function.</p>
        <pre><code>const student = {
  name: "Ava",
  grade: "A",
  greet() {
    return "Hello, Ava!";
  }
};</code></pre>
      `,
    },
    {
      id: "methods",
      heading: "2. Methods Behave Like Object Actions",
      content: `
        <p>When a function is stored on an object, it is called a method. The method can read the object's own properties through <code>this</code>.</p>
      `,
    },
    {
      id: "why-objects",
      heading: "3. Why Objects Matter",
      content: `
        <p>Objects let you model a single concept, such as a user, a product, or a game character, in one place with both data and behavior.</p>
      `,
    },
  ],
  summary: [
    "Objects group related data under one name.",
    "Methods are functions stored inside an object.",
    "A single object can hold both state and behavior.",
  ],
  exercise: {
    id: "m8-l1-ex1",
    executionMode: "knowledge-check",
    title: "Identify the object structure",
    prompt: "Choose the correct description of an object and its method.",
    starterCode: "",
    hints: [
      "An object can hold both data and actions.",
      "A method usually uses the object itself to read or change its data.",
    ],
    successMessage: "Correct. Objects store properties and can also carry methods that act on that data.",
    failureMessage: "Remember: an object groups related values and behavior together, not just one isolated value.",
    questions: [
      {
        prompt: "Which definition best describes an object in JavaScript?",
        correctOptionId: "definition-object",
        options: [
          { id: "definition-object", label: "A collection of named properties and methods that model one thing." },
          { id: "definition-array", label: "A single value that cannot contain structured data." },
        ],
      },
      {
        prompt: "What is a method?",
        correctOptionId: "method-answer",
        options: [
          { id: "method-answer", label: "A function stored on an object that can operate on that object's data." },
          { id: "method-wrong", label: "A keyword used only for loops." },
        ],
      },
      {
        prompt: "What is the most natural way to model a user in JavaScript?",
        correctOptionId: "user-object",
        options: [
          { id: "user-object", label: "An object with properties like name, email, and a greet method." },
          { id: "user-array", label: "A number with no structure." },
        ],
      },
    ],
  },
};
