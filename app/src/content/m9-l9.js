export const lessonM9L9 = {
  lessonId: "m9-l9",
  moduleId: "m9",
  moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
  title: "Framework-Neutral Capstone Project",
  estimatedMinutes: 45,
  prerequisites: ["m9-l8"],
  objectives: [
    "Design a small app using plain JavaScript patterns familiar across frameworks.",
    "Apply modules, state, events, and reusable logic in a coherent project.",
    "Explain how the same design ideas reappear in modern frameworks.",
  ],
  sections: [
    {
      id: "capstone-goal",
      heading: "1. Analyze a Framework-Neutral Task Board",
      content: `
        <p>Use a Task Board scenario to reason about state, responsibilities, reusable display logic, and event-driven updates. This is a design assessment; the lesson does not build or execute a functioning task manager.</p>
      `,
    },
    {
      id: "why-it-matters",
      heading: "2. The Same Ideas Reappear in Frameworks",
      content: `
        <p>A small app written in plain JavaScript reveals the same design principles that frameworks treat as first-class APIs: organizing logic, keeping state predictable, and reacting to user actions.</p>
      `,
    },
    {
      id: "final-reflection",
      heading: "3. Final Reflection",
      content: `
        <p>This last lesson is a reflection on how JavaScript fundamentals translate into modern application development. It makes the bridge from basic language learning to framework-ready thinking explicit.</p>
      `,
    },
  ],
  summary: [
    "The Task Board scenario assesses core JavaScript design patterns without a specific framework.",
    "The same concepts appear again in modern framework development.",
    "This lesson completes the transition from beginner JavaScript to framework-ready thinking.",
  ],
  exercise: {
    id: "m9-l9-ex1",
    executionMode: "knowledge-check",
    title: "Analyze the Task Board design",
    prompt: "For each question, choose the design decision that keeps a Task Board understandable and framework-neutral. This is a scenario assessment, not a coding project.",
    starterCode: "",
    hints: [
      "The project is framework-neutral and uses core JavaScript patterns.",
      "Frameworks reuse the same ideas under different syntax.",
    ],
    successMessage: "Correct. You identified the Task Board's state, responsibilities, update flow, reusable logic, and framework-neutral organization.",
    failureMessage: "Review how task data flows from a user action through state and reusable display logic to the rendered interface.",
    questions: [
      {
        prompt: "Which items belong in application-level state rather than only in rendered UI?",
        correctOptionId: "application-state",
        options: [
          { id: "application-state", label: "The task records and the selected filter; the visible rows are derived from them." },
          { id: "rendered-state", label: "Only the DOM elements currently visible on screen; task records are not state." },
        ],
      },
      {
        prompt: "Which responsibility assignment separates task logic, rendering, and event handling?",
        correctOptionId: "responsibilities",
        options: [
          { id: "responsibilities", label: "Task logic updates data, rendering maps data to UI, and event handlers translate user actions into task actions." },
          { id: "one-big-handler", label: "Each event handler directly edits several unrelated UI elements and duplicates task rules." },
        ],
      },
      {
        prompt: "A learner checks a task checkbox. Which sequence correctly describes event-to-state-to-render flow?",
        correctOptionId: "event-flow",
        options: [
          { id: "event-flow", label: "The handler identifies the task action, task logic updates state, then rendering derives and displays the updated view." },
          { id: "direct-dom", label: "The handler changes the checkbox appearance only; task state can remain unchanged." },
        ],
      },
      {
        prompt: "Which display responsibility is the best candidate for reuse across the board's views?",
        correctOptionId: "reusable-display",
        options: [
          { id: "reusable-display", label: "A task-row description that accepts a task and returns consistent display data for each view." },
          { id: "duplicated-display", label: "Copying slightly different task-label formatting into every event handler." },
        ],
      },
      {
        prompt: "How could a future framework organize these same responsibilities without changing their meaning?",
        correctOptionId: "framework-organization",
        options: [
          { id: "framework-organization", label: "Map task rows and lists to components, state to the framework's state mechanism, and actions to event handlers while following that framework's conventions." },
          { id: "framework-organization-magic", label: "Assume the framework replaces JavaScript and automatically decides all task rules and data flow." },
        ],
      },
    ],
  },
};
