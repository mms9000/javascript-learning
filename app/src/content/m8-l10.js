export const lessonM8L10 = {
  lessonId: "m8-l10",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "When OOP Is Useful and When It Is Unnecessary",
  estimatedMinutes: 15,
  prerequisites: ["m8-l9"],
  objectives: [
    "Recognize when OOP adds clarity to a problem.",
    "Identify situations where simple functions or data structures are enough.",
    "Choose a design that matches the problem's size and complexity.",
  ],
  sections: [
    {
      id: "when-use-oop",
      heading: "1. Use OOP for Real Models",
      content: `
        <p>Object-oriented design is most useful when the problem involves real entities or behaviors that need to be modeled, such as accounts, orders, game entities, or UI components.</p>
      `,
    },
    {
      id: "when-simple-is-better",
      heading: "2. Simple Problems Need Simple Code",
      content: `
        <p>For small scripts and one-off transformations, plain objects, arrays, and functions may be easier to read than a full class hierarchy.</p>
      `,
    },
    {
      id: "design-check",
      heading: "3. Match the Design to the Complexity",
      content: `
        <p>Good software design balances clarity and flexibility. Over-engineering is not helpful if a simpler structure solves the problem.</p>
      `,
    },
  ],
  summary: [
    "OOP is most valuable when you need to model real entities and shared behavior.",
    "Simple problems may be clearer with plain functions and data.",
    "The best design is the one that stays understandable and maintainable.",
  ],
  exercise: {
    id: "m8-l10-ex1",
    executionMode: "knowledge-check",
    title: "Decide whether OOP is the right tool",
    prompt: "Choose the statement that best matches when OOP is useful.",
    starterCode: "",
    hints: [
      "OOP helps model state and behavior for real-world entities.",
      "For small, direct logic, a simpler approach may be clearer.",
    ],
    successMessage: "Correct. OOP is powerful when the program models real entities and shared behavior, but simpler tools are often better for small scripts.",
    failureMessage: "Do not reach for classes just because they are available. Choose the structure that matches the clarity and maintainability of the task.",
    questions: [
      {
        prompt: "When is OOP especially useful?",
        correctOptionId: "real-models",
        options: [
          { id: "real-models", label: "When you need to model real entities with state and behavior." },
          { id: "single-line", label: "When the script only prints a single string." },
        ],
      },
      {
        prompt: "What is a sign that a simpler design may be better?",
        correctOptionId: "small-simple",
        options: [
          { id: "small-simple", label: "The task is small, direct, and easy to understand with functions and data." },
          { id: "many-classes", label: "There are many unrelated classes and a large inheritance tree." },
        ],
      },
      {
        prompt: "What is the goal of good OOP design?",
        correctOptionId: "clarity",
        options: [
          { id: "clarity", label: "To make the code clearer and easier to maintain, not to force a class hierarchy unnecessarily." },
          { id: "complexity", label: "To maximize complexity even when a simple solution works." },
        ],
      },
    ],
  },
};
