export const lessonM9L1 = {
  lessonId: "m9-l1",
  moduleId: "m9",
  moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
  title: "Modules and Code Organization",
  estimatedMinutes: 20,
  prerequisites: ["m8-l10"],
  objectives: [
    "Explain why JavaScript modules organize code into separate files.",
    "Use import and export to connect modules.",
    "Describe the value of separating code by responsibility.",
  ],
  sections: [
    {
      id: "why-modules",
      heading: "1. Modules Keep Code Organized",
      content: `
        <p>As programs grow, storing everything in one file becomes hard to maintain. Modules split code into smaller files with clear responsibilities.</p>
      `,
    },
    {
      id: "import-export",
      heading: "2. import and export Connect Files",
      content: `
        <p><code>export</code> makes values available to other files; <code>import</code> brings them in. This pattern allows reusable code to be shared without copying it everywhere.</p>
      `,
    },
    {
      id: "maintenance",
      heading: "3. Better Organization Makes Maintenance Easier",
      content: `
        <p>Modules help teams find related code faster, reduce accidental coupling, and make the program easier to reason about.</p>
      `,
    },
  ],
  summary: [
    "Modules divide code into smaller, meaningful files.",
    "import and export connect related pieces of code.",
    "Good organization makes large codebases easier to maintain.",
  ],
  exercise: {
    id: "m9-l1-ex1",
    executionMode: "knowledge-check",
    title: "Recognize module boundaries",
    prompt: "Choose the correct description of module-based code organization.",
    starterCode: "",
    hints: [
      "Modules help separate responsibilities.",
      "import and export are how files communicate.",
    ],
    successMessage: "Correct. Modules keep JavaScript code organized, and import/export wires the pieces together without duplication.",
    failureMessage: "Think in terms of responsibilities: modules separate concerns so a file can focus on one part of the program.",
    questions: [
      {
        prompt: "Why use modules?",
        correctOptionId: "organization",
        options: [
          { id: "organization", label: "To split code into smaller files with clear responsibilities." },
          { id: "single-file", label: "To force all code into one giant file." },
        ],
      },
      {
        prompt: "What does export do?",
        correctOptionId: "export-shares",
        options: [
          { id: "export-shares", label: "It makes values available to other modules." },
          { id: "export-creates", label: "It creates a browser event listener." },
        ],
      },
      {
        prompt: "What is the benefit of import/export?",
        correctOptionId: "shared-reuse",
        options: [
          { id: "shared-reuse", label: "It allows code reuse without duplicating functions or data across files." },
          { id: "global-globals", label: "It forces everything to live in one global scope." },
        ],
      },
    ],
  },
};
