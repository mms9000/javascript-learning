export const lessonM9L5 = {
  lessonId: "m9-l5",
  moduleId: "m9",
  moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
  title: "Event-Driven Programming",
  estimatedMinutes: 25,
  prerequisites: ["m9-l4"],
  objectives: [
    "Describe how user events trigger logic in an app.",
    "Connect an event listener to an action such as a button click.",
    "Explain why event-driven behavior is central to web apps and frameworks.",
  ],
  sections: [
    {
      id: "event-flow",
      heading: "1. User Actions Trigger Events",
      content: `
        <p>An event is a signal that something happened, such as a click, input change, key press, or form submit. Event-driven programming responds to those signals.</p>
      `,
    },
    {
      id: "listeners",
      heading: "2. Listeners React to Events",
      content: `
        <p>A listener is a function that runs when a matching event occurs. This pattern is how buttons, forms, and other controls respond to user actions.</p>
      `,
    },
    {
      id: "framework-pattern",
      heading: "3. Event Logic is Foundation for Frameworks",
      content: `
        <p>Frameworks simplify event handling, but the same basic idea is in every UI framework: state changes in response to user actions.</p>
      `,
    },
  ],
  summary: [
    "Events are signals from the browser or user.",
    "Listeners handle those events with logic.",
    "Most UI frameworks build on this event-driven model.",
  ],
  exercise: {
    id: "m9-l5-ex1",
    executionMode: "knowledge-check",
    title: "Decode event-driven behavior",
    prompt: "A 'Create task' button is clicked after a user types a task name. Which sequence best matches event-driven UI logic?",
    starterCode: "",
    hints: [
      "Events happen because a user or browser action occurred.",
      "Listeners are the code that reacts to the event and update state.",
    ],
    successMessage: "Correct. Event-driven programming listens for user and browser events, then updates state and re-renders the UI in response.",
    failureMessage: "Think about the action: a click or input event triggers handler code, which then changes state and updates the visible interface.",
    questions: [
      {
        prompt: "What is the click event in this example?",
        correctOptionId: "signal",
        options: [
          { id: "signal", label: "A signal that the user attempted to create a task by clicking the button." },
          { id: "error", label: "A syntax mistake in the code that prevents the app from running." },
        ],
      },
      {
        prompt: "What should the event listener do after the click?",
        correctOptionId: "react",
        options: [
          { id: "react", label: "Read the form input, add the task to state, and update the rendered list." },
          { id: "load-file", label: "Reload the whole page without modifying the current task list." },
        ],
      },
      {
        prompt: "Why is this important for frameworks?",
        correctOptionId: "framework-basis",
        options: [
          { id: "framework-basis", label: "Because many frameworks are built around state updates triggered by user events." },
          { id: "never-use", label: "Because frameworks avoid user interaction and event handlers." },
        ],
      },
    ],
  },
};
