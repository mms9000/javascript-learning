export const lessonM9L8 = {
  lessonId: "m9-l8",
  moduleId: "m9",
  moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
  title: "Understanding What a Framework Adds Beyond JavaScript",
  estimatedMinutes: 25,
  prerequisites: ["m9-l7"],
  objectives: [
    "Explain that frameworks build on JavaScript rather than replace it.",
    "Identify common framework responsibilities such as rendering, reactivity, and routing.",
    "Describe how a strong JavaScript foundation makes framework learning easier.",
  ],
  sections: [
    {
      id: "framework-builds",
      heading: "1. Frameworks Build on JavaScript",
      content: `
        <p>Frameworks do not replace JavaScript. They add structure, patterns, and tooling around the language so apps can be built more efficiently at scale.</p>
      `,
    },
    {
      id: "common-responsibilities",
      heading: "2. Common Responsibilities",
      content: `
        <p>Frameworks often handle rendering, reactive state updates, component composition, and routing. These are patterns that make sense once you understand JavaScript fundamentals.</p>
      `,
    },
    {
      id: "foundation-matter",
      heading: "3. A Strong Foundation Matters",
      content: `
        <p>Once you understand variables, functions, objects, events, and async behavior, a framework's abstractions become clearer because you can see what they are doing beneath the syntax.</p>
      `,
    },
  ],
  summary: [
    "Frameworks build on JavaScript, not instead of it.",
    "They add structure and common patterns for larger apps.",
    "A strong JavaScript foundation makes framework concepts easier to understand.",
  ],
  exercise: {
    id: "m9-l8-ex1",
    executionMode: "knowledge-check",
    title: "Compare JavaScript with framework abstractions",
    prompt: "A team builds a task tracker with a framework. Which statement best describes what the framework adds beyond JavaScript itself?",
    starterCode: "",
    hints: [
      "Frameworks add structure, not a new JavaScript language.",
      "The fundamentals still matter when reading framework code.",
    ],
    successMessage: "Correct. Frameworks add abstractions and tooling on top of JavaScript, but the core language concepts still underpin the entire system.",
    failureMessage: "Frameworks are built with JavaScript and borrow its fundamentals. They add structure and patterns, but do not replace the language itself.",
    questions: [
      {
        prompt: "What is the relationship between JavaScript and frameworks in this example?",
        correctOptionId: "on-top-of",
        options: [
          { id: "on-top-of", label: "The framework organizes rendering, state, and component logic on top of JavaScript fundamentals." },
          { id: "replace-js", label: "The framework removes the need to understand JavaScript at all." },
        ],
      },
      {
        prompt: "Which responsibilities are often handled by a framework?",
        correctOptionId: "rendering-state",
        options: [
          { id: "rendering-state", label: "Rendering, state updates, and reusable UI composition built around core JavaScript patterns." },
          { id: "only-strings", label: "Only variable declarations and string concatenation without any event or state logic." },
        ],
      },
      {
        prompt: "Why do JavaScript fundamentals still matter?",
        correctOptionId: "foundation",
        options: [
          { id: "foundation", label: "Because a solid JavaScript foundation makes framework features and abstractions easier to understand and debug." },
          { id: "not-needed", label: "Because frameworks do not depend on JavaScript at all once they are used." },
        ],
      },
    ],
  },
};
