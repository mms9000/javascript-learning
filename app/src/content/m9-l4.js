export const lessonM9L4 = {
  lessonId: "m9-l4",
  moduleId: "m9",
  moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
  title: "Data Flow, State, and Derived Values",
  estimatedMinutes: 25,
  prerequisites: ["m9-l3"],
  objectives: [
    "Distinguish between raw state and derived values.",
    "Reason about how data flows through an application.",
    "Explain why derived values are useful in UI logic.",
  ],
  sections: [
    {
      id: "state",
      heading: "1. State is the Input to the UI",
      content: `
        <p>State is the data your application keeps track of. A component or app often derives user-visible values from that state rather than storing everything separately.</p>
      `,
    },
    {
      id: "derived-values",
      heading: "2. Derived Values are Computed from State",
      content: `
        <p>Derived values are computed from existing state. They can be recalculated when relevant data changes, keeping the program simpler and preventing duplicate sources of truth.</p>
      `,
    },
    {
      id: "data-flow",
      heading: "3. One-Way Data Flow",
      content: `
        <p>In a straightforward data-flow model, event handlers update state and the interface re-renders from that state. This mental model is a foundation for many frameworks.</p>
      `,
    },
  ],
  summary: [
    "State is the source data in an application.",
    "Derived values are computed from state rather than duplicated.",
    "A one-way flow from state to rendered output is easy to reason about.",
  ],
  exercise: {
    id: "m9-l4-ex1",
    executionMode: "knowledge-check",
    title: "Understand state and derived value flow",
    prompt: "A task list stores all tasks in state and displays the number of remaining items. Which statement best matches the lesson's model of data flow?",
    starterCode: "",
    hints: [
      "Raw state is the source data.",
      "Derived values come from that state; they are not an independent source of truth.",
    ],
    successMessage: "Correct. State is the upstream data, while derived values are computed from it to keep the app consistent and easier to maintain.",
    failureMessage: "A derived value should be computed from state, not stored as a separate, conflicting source of truth.",
    questions: [
      {
        prompt: "What is the current task list state in this example?",
        correctOptionId: "state-source",
        options: [
          { id: "state-source", label: "The full array of task objects that the app tracks and updates over time." },
          { id: "state-duplicate", label: "A separate copy of the remaining-task count that has no relationship to the task data." },
        ],
      },
      {
        prompt: "What is the remaining-task count in this scenario?",
        correctOptionId: "derived-from-state",
        options: [
          { id: "derived-from-state", label: "A derived value computed from the tasks currently in state, such as filtering for unfinished items." },
          { id: "derived-random", label: "A random value that has no relationship to the task data." },
        ],
      },
      {
        prompt: "Why is one-way state flow important here?",
        correctOptionId: "predictable-flow",
        options: [
          { id: "predictable-flow", label: "It keeps the list of tasks and the derived count aligned, which makes updates easier to reason about." },
          { id: "unpredictable-flow", label: "It intentionally creates multiple sources of truth that drift apart." },
        ],
      },
    ],
  },
};
