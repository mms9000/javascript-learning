export const lessonM7L1 = {
  lessonId: "m7-l1",
  moduleId: "m7",
  moduleTitle: "Module 7: Asynchronous JavaScript",
  title: "Synchronous Execution and the Event Loop",
  estimatedMinutes: 25,
  prerequisites: ["m6-l7"],
  objectives: [
    "Trace synchronous JavaScript statements in order.",
    "Distinguish the call stack, Promise microtasks, and timer tasks.",
    "Predict the ordering of synchronous logs, Promise reactions, and timer callbacks.",
  ],
  sections: [
    {
      id: "run-to-completion",
      heading: "1. The Current Call Stack Runs First",
      content: `
        <p>JavaScript runs the current stack of synchronous statements to completion.
        A function call does not pause the remaining statements just because it
        schedules work for later.</p>
        <pre><code>console.log("sync");
setTimeout(() =&gt; console.log("timer task"), 0);
console.log("end");</code></pre>
        <p>The timer callback is scheduled. It does not interrupt the current
        statements, and a zero delay does not mean “run immediately.”</p>
      `,
    },
    {
      id: "microtasks-and-tasks",
      heading: "2. Promise Reactions and Timer Tasks",
      content: `
        <p>After the current stack finishes, the JavaScript environment processes
        queued Promise reactions as microtasks before it moves on to a later timer
        task. For the example below, the output is <code>sync</code>,
        <code>end</code>, <code>microtask</code>, then <code>timer task</code>.</p>
        <pre><code>console.log("sync");
Promise.resolve().then(() =&gt; console.log("microtask"));
setTimeout(() =&gt; console.log("timer task"), 0);
console.log("end");</code></pre>
        <p>This describes the ordering in this example; it does not promise that
        timer callbacks run at an exact time or define ordering among unrelated tasks.</p>
      `,
    },
    {
      id: "event-loop-limits",
      heading: "3. Async Work Is Not a Second JavaScript Thread",
      content: `
        <p>Promises and timers schedule when callbacks can run; they do not make
        ordinary JavaScript callbacks execute in parallel. In this lesson's
        playground, synchronous work still runs to completion in a separate Worker.</p>
      `,
    },
  ],
  summary: [
    "Synchronous statements run to completion before scheduled callbacks.",
    "Promise reactions run as microtasks after the current stack and before a later timer task in the demonstrated example.",
    "A timer delay is a minimum scheduling delay, not an exact deadline.",
  ],
  exercise: {
    id: "m7-l1-ex1",
    executionMode: "knowledge-check",
    title: "Trace the Event Loop",
    prompt: "Choose the correct order for the four messages and identify when each callback can run.",
    starterCode: "",
    hints: [
      "First follow the statements that run directly, without waiting for a callback.",
      "After the stack finishes, place the Promise reaction before the later timer task.",
    ],
    successMessage: "Correct. The current stack finishes first, then the Promise microtask runs before the timer task.",
    failureMessage: "Trace synchronous statements first, then the Promise microtask, then the timer callback.",
    questions: [
      {
        prompt: "Which messages are logged before either scheduled callback?",
        correctOptionId: "sync-end",
        options: [
          { id: "sync-end", label: "sync, then end" },
          { id: "sync-microtask", label: "sync, then microtask" },
        ],
      },
      {
        prompt: "What runs after the current stack and before the timer task in this example?",
        correctOptionId: "promise-job",
        options: [
          { id: "promise-job", label: "The Promise reaction, as a microtask" },
          { id: "timer-first", label: "The timer callback, because its delay is zero" },
        ],
      },
      {
        prompt: "Which is the complete output order?",
        correctOptionId: "complete-order",
        options: [
          { id: "complete-order", label: "sync, end, microtask, timer task" },
          { id: "wrong-order", label: "sync, microtask, end, timer task" },
        ],
      },
    ],
  },
};
