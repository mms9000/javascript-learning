export const lessonM8L8 = {
  lessonId: "m8-l8",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "Polymorphism and Shared Object Behavior",
  estimatedMinutes: 20,
  prerequisites: ["m8-l7"],
  objectives: [
    "Explain polymorphism as different objects responding to the same method name.",
    "Use shared interfaces or method names in related objects.",
    "Recognize how polymorphism reduces conditional branching.",
  ],
  sections: [
    {
      id: "same-message",
      heading: "1. Different Objects, Same Message",
      content: `
        <p>Polymorphism means different objects can respond to the same method name in their own way. The same interface can be used for different classes.</p>
      `,
    },
    {
      id: "shared-behavior",
      heading: "2. Shared Behaviors Across Different Types",
      content: `
        <p>Polymorphism helps when many objects share a concept such as <code>draw()</code> or <code>move()</code> but each class implements it differently.</p>
      `,
    },
    {
      id: "benefit",
      heading: "3. Why It Helps",
      content: `
        <p>Instead of writing a different branch for every object type, the program can call the same method name and trust each object to behave appropriately.</p>
      `,
    },
  ],
  summary: [
    "Polymorphism uses the same method name across different object types.",
    "Each object can implement the behavior in a way that fits its type.",
    "This reduces brittle branching logic.",
  ],
  exercise: {
    id: "m8-l8-ex1",
    executionMode: "knowledge-check",
    title: "Explain polymorphism",
    prompt: "Choose the best explanation of polymorphism.",
    starterCode: "",
    hints: [
      "The method name is shared, but the implementation can differ.",
      "A common interface helps many different objects behave consistently.",
    ],
    successMessage: "Correct. Polymorphism lets different objects respond to the same method name with their own behavior.",
    failureMessage: "Think of a common method name like move or draw that each kind of object implements differently.",
    questions: [
      {
        prompt: "What is polymorphism?",
        correctOptionId: "same-method",
        options: [
          { id: "same-method", label: "Different object types can respond to the same method name in different ways." },
          { id: "same-value", label: "Using the same value for every property in an object." },
        ],
      },
      {
        prompt: "Why is polymorphism useful?",
        correctOptionId: "less-branching",
        options: [
          { id: "less-branching", label: "It lets code call the same method name without writing a big conditional for every object." },
          { id: "harder-debug", label: "It makes code harder to understand and maintain." },
        ],
      },
      {
        prompt: "Which is a good polymorphic pattern?",
        correctOptionId: "draw-method",
        options: [
          { id: "draw-method", label: "Different shape objects each implement draw() in their own way." },
          { id: "single-branch", label: "One giant if statement with special-case code for every object." },
        ],
      },
    ],
  },
};
