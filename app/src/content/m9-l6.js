export const lessonM9L6 = {
  lessonId: "m9-l6",
  moduleId: "m9",
  moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
  title: "Components as a General UI Design Concept",
  estimatedMinutes: 25,
  prerequisites: ["m9-l5"],
  objectives: [
    "Explain the idea of breaking an interface into parts called components.",
    "Describe how reusable UI parts help organize more complex interfaces.",
    "Connect the component idea to framework thinking without requiring a specific framework.",
  ],
  sections: [
    {
      id: "component-concept",
      heading: "1. Components Break the Interface Into Parts",
      content: `
        <p>A component is a reusable building block for a user interface. It might be a button, card, form, or panel. Breaking the interface into parts makes the code easier to reason about.</p>
      `,
    },
    {
      id: "reusability",
      heading: "2. Reusable Units Track Their Own Behavior",
      content: `
        <p>Each component can encapsulate its own data and behavior, which helps keep patterns consistent as a UI grows in size.</p>
      `,
    },
    {
      id: "framework-neutral",
      heading: "3. The Concept Is Framework-Agnostic",
      content: `
        <p>A component is a design idea, not a framework-specific rule. Many frameworks use the concept, but the underlying principle is broadly useful in UI design.</p>
      `,
    },
  ],
  summary: [
    "A component is a reusable unit of the UI.",
    "Components help organize interfaces into predictable, testable pieces.",
    "The concept is framework-agnostic even though frameworks implement it in their own way.",
  ],
  exercise: {
    id: "m9-l6-ex1",
    executionMode: "knowledge-check",
    title: "Understand the component model",
    prompt: "In a task board app, a task card shows a title, status, and checkbox. Which description best matches the component model from this lesson?",
    starterCode: "",
    hints: [
      "A component is a reusable UI unit.",
      "The concept is about organization and reuse, not a specific framework.",
    ],
    successMessage: "Correct. Components are reusable UI pieces with defined responsibilities, which makes larger interfaces easier to organize and reason about.",
    failureMessage: "The idea is not 'one framework only'—it is the general concept of breaking UI into reusable pieces with clear responsibilities.",
    questions: [
      {
        prompt: "What is the task card in this example?",
        correctOptionId: "reusable-ui-part",
        options: [
          { id: "reusable-ui-part", label: "A reusable UI component that owns the task title, status, and checkbox behavior." },
          { id: "single-word", label: "A single variable name used everywhere in the app." },
        ],
      },
      {
        prompt: "Why would a task card be a good component?",
        correctOptionId: "organization",
        options: [
          { id: "organization", label: "It keeps the interface organized by grouping related presentation and behavior in one place." },
          { id: "complexity", label: "It intentionally folds unrelated logic into one confusing unit." },
        ],
      },
      {
        prompt: "Is the idea of a task card tied to one framework?",
        correctOptionId: "framework-neutral",
        options: [
          { id: "framework-neutral", label: "No. The idea is general and appears in many UI systems, libraries, and frameworks." },
          { id: "framework-only", label: "Yes. It only exists in one framework and never appears in plain JavaScript interfaces." },
        ],
      },
    ],
  },
};
