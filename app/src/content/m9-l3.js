export const lessonM9L3 = {
  lessonId: "m9-l3",
  moduleId: "m9",
  moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
  title: "Array Transformations and Immutable Update Patterns",
  estimatedMinutes: 25,
  prerequisites: ["m9-l2"],
  objectives: [
    "Use array methods to transform collections of data.",
    "Understand why immutable updates avoid mutating shared data.",
    "Reason about derived values in a framework-like data flow.",
  ],
  sections: [
    {
      id: "transformations",
      heading: "1. Arrays are Transformed, Not Mutated by Accident",
      content: `
        <p>Modern JavaScript often uses methods such as <code>map</code>, <code>filter</code>, and <code>reduce</code> to derive new arrays instead of mutating the original one.</p>
      `,
    },
    {
      id: "immutability",
      heading: "2. Immutable Update Patterns",
      content: `
        <p>When state is updated, a new value is created rather than mutating the previous one. This makes the program easier to reason about and safer for UI updates.</p>
      `,
    },
    {
      id: "framework-mental-model",
      heading: "3. Framework Thinking Starts Here",
      content: `
        <p>Frameworks often re-render based on data changes, so understanding derived values and immutable updates is a transferable skill.</p>
      `,
    },
  ],
  summary: [
    "map, filter, and reduce create new values from data.",
    "Immutable updates avoid mutating shared state.",
    "Framework-style data flow depends on clear, predictable updates.",
  ],
  exercise: {
    id: "m9-l3-ex1",
    executionMode: "knowledge-check",
    title: "Choose the correct data flow pattern",
    prompt: "A task list app needs to mark the first incomplete task as done without mutating the prior array. Which approach matches the lesson's data-flow guidance?",
    starterCode: "",
    hints: [
      "Array methods typically return a new array instead of mutating the original.",
      "The new array should represent the updated state while preserving the old one for comparison or undo logic.",
    ],
    successMessage: "Correct. The app should derive a new state value from the old one, keeping updates predictable and avoiding accidental mutation.",
    failureMessage: "Think in terms of a new task list state: update the list by producing a new array from the existing one rather than changing the original in place.",
    questions: [
      {
        prompt: "A task list holds completed and unfinished tasks. What is the safest update pattern?",
        correctOptionId: "new-array",
        options: [
          { id: "new-array", label: "Create a new array that reflects the changed task status and keep the old array unchanged." },
          { id: "mutate-array", label: "Change the original array directly in place and rely on side effects." },
        ],
      },
      {
        prompt: "Why does using map() or filter() matter here?",
        correctOptionId: "derive-new-state",
        options: [
          { id: "derive-new-state", label: "Because they derive the next state from the current one without mutating the original collection unexpectedly." },
          { id: "mutate-collection", label: "Because they intentionally change the original list in place for the next step." },
        ],
      },
      {
        prompt: "How does this help framework-style UI updates?",
        correctOptionId: "predictable-render",
        options: [
          { id: "predictable-render", label: "It keeps state transitions predictable, making re-renders easier to reason about and debug." },
          { id: "unpredictable-render", label: "It adds hidden side effects that make every render unpredictable." },
        ],
      },
    ],
  },
};
