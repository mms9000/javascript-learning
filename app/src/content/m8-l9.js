export const lessonM8L9 = {
  lessonId: "m8-l9",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "Composition Versus Inheritance",
  estimatedMinutes: 20,
  prerequisites: ["m8-l8"],
  objectives: [
    "Compare inheritance and composition as design approaches.",
    "Recognize when behavior should be shared by inheritance and when it should be composed.",
    "Prefer flexible designs that match the problem being modeled.",
  ],
  sections: [
    {
      id: "inheritance",
      heading: "1. Inheritance Models Shared Type Relationships",
      content: `
        <p>Inheritance works when a class is a specialized kind of a parent class. It expresses a clear "is a" relationship.</p>
      `,
    },
    {
      id: "composition",
      heading: "2. Composition Models Shared Capabilities",
      content: `
        <p>Composition builds custom behavior by combining smaller objects or functions. It often fits when a thing "has" certain capabilities rather than being a subtype.</p>
      `,
    },
    {
      id: "choose-wisely",
      heading: "3. Choose the Design That Matches the Problem",
      content: `
        <p>Neither pattern is universally better. Inheritance is useful for related types; composition is flexible when capabilities are assembled from smaller pieces.</p>
      `,
    },
  ],
  summary: [
    "Inheritance models a specific type relationship.",
    "Composition combines smaller pieces of behavior.",
    "The best design depends on the problem and how the system is structured.",
  ],
  exercise: {
    id: "m8-l9-ex1",
    executionMode: "knowledge-check",
    title: "Compare inheritance and composition",
    prompt: "Choose the best design guidance for inheritance versus composition.",
    starterCode: "",
    hints: [
      "Use inheritance for a clear subtype relationship.",
      "Use composition when behavior is assembled from smaller parts.",
    ],
    successMessage: "Correct. Inheritance is a good fit for subtype relationships, while composition is flexible for assembled capabilities.",
    failureMessage: "Ask whether the relationship is 'is a' or 'has a.' That distinction often points to the better design.",
    questions: [
      {
        prompt: "When is inheritance a good choice?",
        correctOptionId: "is-a",
        options: [
          { id: "is-a", label: "When one type is a more specific version of another type." },
          { id: "has-a", label: "When a class should be assembled from multiple independent capabilities." },
        ],
      },
      {
        prompt: "When is composition often better?",
        correctOptionId: "has-a",
        options: [
          { id: "has-a", label: "When an object has independent capabilities that are combined." },
          { id: "single-type", label: "When every class is exactly the same type." },
        ],
      },
      {
        prompt: "What is the main trade-off?",
        correctOptionId: "fit-problem",
        options: [
          { id: "fit-problem", label: "The best choice depends on the real relationship and flexibility needed in the design." },
          { id: "default-inheritance", label: "Inheritance is always the correct approach for any object design." },
        ],
      },
    ],
  },
};
