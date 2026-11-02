export const lessonM9L7 = {
  lessonId: "m9-l7",
  moduleId: "m9",
  moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
  title: "Reading Unfamiliar Code and API Documentation",
  estimatedMinutes: 20,
  prerequisites: ["m9-l6"],
  objectives: [
    "Identify the purpose of a function or module from its code structure.",
    "Read API documentation with a beginner-friendly strategy.",
    "Explain how framework concepts become easier to understand once the language is solid.",
  ],
  sections: [
    {
      id: "code-reading",
      heading: "1. Start with the Shape of the Code",
      content: `
        <p>When reading unfamiliar code, begin by looking at function names, variables, imports, and the overall structure. This helps answer what the code is trying to do before diving into details.</p>
      `,
    },
    {
      id: "api-docs",
      heading: "2. Read Documentation in Layers",
      content: `
        <p>Good API documentation explains what the function or module does, what inputs it expects, and what it returns. You do not need to memorize every detail before trying a small example.</p>
      `,
    },
    {
      id: "transferable-skill",
      heading: "3. Reading Code Is a Transferable Skill",
      content: `
        <p>The same habits help in any framework or library: read the function names, inspect the data it uses, and map the shape of the API to the problem at hand.</p>
      `,
    },
  ],
  summary: [
    "Read code by looking for structure before details.",
    "Use documentation to understand inputs, outputs, and intent.",
    "The ability to read unfamiliar APIs transfers across frameworks and libraries.",
  ],
  exercise: {
    id: "m9-l7-ex1",
    executionMode: "knowledge-check",
    title: "Choose a practical reading strategy",
    prompt: "Select the best approach for reading unfamiliar code and API docs.",
    starterCode: "",
    hints: [
      "Start with structure and names, then inspect the details.",
      "Documentation tells you intent, input types, and return values.",
    ],
    successMessage: "Correct. A practical strategy is to inspect structure first, then read the docs for expected inputs and outputs before experimenting.",
    failureMessage: "Do not start by memorizing every detail. First infer intent from the code structure, then read the relevant docs.",
    questions: [
      {
        prompt: "What is the best first step when reading unfamiliar code?",
        correctOptionId: "structure-first",
        options: [
          { id: "structure-first", label: "Look at function names, imports, and overall structure to understand the intent." },
          { id: "skip-together", label: "Skip the code and read only the CSS." },
        ],
      },
      {
        prompt: "Why read API docs?",
        correctOptionId: "api-intent",
        options: [
          { id: "api-intent", label: "To understand what a function or module does, what arguments it expects, and what it returns." },
          { id: "no-docs", label: "Because docs are never useful for beginner work." },
        ],
      },
      {
        prompt: "What makes this skill transferable?",
        correctOptionId: "framework-transfer",
        options: [
          { id: "framework-transfer", label: "The same code-reading habits apply across JavaScript, frameworks, and libraries." },
          { id: "one-library", label: "It only helps in one specific framework." },
        ],
      },
    ],
  },
};
