export const lessonM9L2 = {
  lessonId: "m9-l2",
  moduleId: "m9",
  moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
  title: "Reusable Functions and Separation of Concerns",
  estimatedMinutes: 20,
  prerequisites: ["m9-l1"],
  objectives: [
    "Separate responsibilities into focused helper functions.",
    "Explain how reusable functions improve clarity and maintainability.",
    "Avoid mixing unrelated logic in one function.",
  ],
  sections: [
    {
      id: "reusable-functions",
      heading: "1. Reusable Functions Reduce Duplication",
      content: `
        <p>Reusable functions let you name a task once and call it from several places. This reduces repeated code and keeps the program easier to maintain.</p>
      `,
    },
    {
      id: "separate-concerns",
      heading: "2. Different Responsibilities Need Different Helpers",
      content: `
        <p>One function should focus on one job: formatting, validation, formatting output, or data lookup. Mixing jobs in one function makes the code harder to reason about.</p>
      `,
    },
    {
      id: "maintainability",
      heading: "3. Clear Separation Helps Teams",
      content: `
        <p>As an app grows, small well-named functions are easier to test and update than large sprawling blocks of logic.</p>
      `,
    },
  ],
  summary: [
    "Reusable functions avoid repeated logic.",
    "Each helper should have a specific job.",
    "Separated responsibilities keep programs easier to test and maintain.",
  ],
  exercise: {
    id: "m9-l2-ex1",
    executionMode: "knowledge-check",
    title: "Choose the strong separation-of-concerns pattern",
    prompt: "Select the statement that best describes reusable functions and separation of concerns.",
    starterCode: "",
    hints: [
      "Name functions according to the task they perform.",
      "A helper should not mix unrelated jobs.",
    ],
    successMessage: "Correct. Good functions are small, named for a clear task, and easy to reuse without mixing unrelated responsibilities.",
    failureMessage: "Look for a helper that does a single job instead of a giant function that handles several unrelated tasks.",
    questions: [
      {
        prompt: "Why is reuse valuable?",
        correctOptionId: "avoid-duplication",
        options: [
          { id: "avoid-duplication", label: "It prevents repeated logic and makes updates easier to manage." },
          { id: "slow-code", label: "It slows programs down intentionally." },
        ],
      },
      {
        prompt: "What does separation of concerns mean?",
        correctOptionId: "single-job",
        options: [
          { id: "single-job", label: "Each function or module handles a distinct part of the problem." },
          { id: "all-one", label: "Everything belongs in one giant function." },
        ],
      },
      {
        prompt: "What is a good helper function?",
        correctOptionId: "named-task",
        options: [
          { id: "named-task", label: "A small function with a clear name and one defined task." },
          { id: "many-jobs", label: "A function that validates, formats, and stores data all at once." },
        ],
      },
    ],
  },
};
