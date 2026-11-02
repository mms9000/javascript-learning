import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkCallbackOrder(entries) {
  const expected = ["start", "scheduled", "callback"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed = actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);
  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. The timer callback runs as a later task after the current statements finish."
      : "Trace the two immediate logs first. The callback should run afterward as a timer task.",
  };
}

export const validateM7L2Exercise = createBaseValidator(checkCallbackOrder, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the callback function and parentheses.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the spelling of console and setTimeout.`,
  timeoutMessage: "The callback exercise exceeded its time limit. Check for an infinite loop.",
});

export const lessonM7L2 = {
  lessonId: "m7-l2",
  moduleId: "m7",
  moduleTitle: "Module 7: Asynchronous JavaScript",
  title: "Callbacks and Asynchronous Operations",
  estimatedMinutes: 20,
  prerequisites: ["m7-l1"],
  objectives: [
    "Distinguish a callback function from the code that registers it.",
    "Explain why statements after scheduling a callback run before the callback.",
    "Use a timer callback as an example of a later task.",
  ],
  sections: [
    {
      id: "callback-roles",
      heading: "1. Registering a Callback",
      content: `
        <p>A callback is a function passed to other code so that it can be called
        later. In <code>setTimeout(showMessage, 500)</code>, JavaScript receives the
        function value <code>showMessage</code>; writing
        <code>showMessage()</code> would call it immediately instead.</p>
      `,
    },
    {
      id: "timer-task",
      heading: "2. A Timer Schedules a Later Task",
      content: `
        <pre><code>console.log("start");
setTimeout(() =&gt; console.log("callback"), 0);
console.log("scheduled");</code></pre>
        <p>The first and third statements run on the current stack. The callback is
        queued for a later task, so the order is <code>start</code>,
        <code>scheduled</code>, <code>callback</code>. The delay is not an exact
        clock and does not guarantee a precise run time.</p>
      `,
    },
    {
      id: "callback-contract",
      heading: "3. Completion in This Playground",
      content: `
        <p>This playground tracks the timer callbacks you schedule. It waits for the
        current asynchronous operation and its tracked timers to settle before it
        reports success. A timer that never finishes is stopped by the execution
        watchdog.</p>
      `,
    },
  ],
  summary: [
    "Pass a callback function when you want other code to call it later.",
    "Scheduling a timer does not pause the current statements.",
    "Timer callbacks run as later tasks and their delay is not exact.",
  ],
  exercise: {
    id: "m7-l2-ex1",
    executionMode: "async-worker",
    title: "Schedule a Callback",
    prompt: "Run the example and observe which messages run now and which run later.",
    expectedOutput: "start\nscheduled\ncallback",
    starterCode: `console.log("start");
setTimeout(() => console.log("callback"), 0);
console.log("scheduled");
`,
    hints: [
      "The call to setTimeout schedules the function; it does not run that function inline.",
      "Keep both current-stack logs before the callback's output.",
    ],
    successMessage: "Correct. The registered callback ran in a later timer task.",
    validate: validateM7L2Exercise,
  },
};
