import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkAsyncAwaitOutput(entries) {
  const expected = ["start", "ready"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed = actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);
  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. The awaited value was available before the async function continued."
      : "Print start before await, then print the fulfilled value after await resumes.",
  };
}

export const validateM7L4Exercise = createBaseValidator(checkAsyncAwaitOutput, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Use await inside the async exercise body.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the Promise and value names.`,
  timeoutMessage: "The async function did not finish before the execution time limit.",
});

export const lessonM7L4 = {
  lessonId: "m7-l4",
  moduleId: "m7",
  moduleTitle: "Module 7: Asynchronous JavaScript",
  title: "async and await",
  estimatedMinutes: 25,
  prerequisites: ["m7-l3"],
  objectives: [
    "Declare an async function and explain that it returns a Promise.",
    "Use await to read a Promise's fulfilled value before continuing.",
    "Explain that await suspends the async function's continuation rather than blocking the Worker.",
  ],
  sections: [
    {
      id: "async-returns-promise",
      heading: "1. async Functions Return Promises",
      content: `
        <p>An <code>async</code> function always returns a Promise. Returning a
        regular value fulfills that Promise with the value; throwing or returning a
        rejected Promise rejects it.</p>
      `,
    },
    {
      id: "await-continuation",
      heading: "2. await Resumes After a Promise Settles",
      content: `
        <pre><code>async function main() {
  console.log("start");
  const value = await Promise.resolve("ready");
  console.log(value);
}
return main();</code></pre>
        <p>The current stack logs <code>start</code>. The async function pauses its
        own continuation, then logs <code>ready</code> after the Promise fulfills.
        The Worker thread is not blocked by this await.</p>
      `,
    },
    {
      id: "async-root",
      heading: "3. Return the Root Promise",
      content: `
        <p>This playground waits for the asynchronous exercise body's returned
        Promise. For work started by a callback, return or await its Promise inside
        the async exercise. An unresolved root Promise remains pending until the
        watchdog terminates the run.</p>
      `,
    },
  ],
  summary: [
    "An async function returns a Promise.",
    "await resumes an async function after the awaited Promise settles; it does not block the Worker.",
    "The runner waits for the root Promise to settle and times out an unresolved root.",
  ],
  exercise: {
    id: "m7-l4-ex1",
    executionMode: "async-worker",
    title: "Await a Promise",
    prompt: "Use top-level await to print the starting message and then the fulfilled value.",
    expectedOutput: "start\nready",
    starterCode: `console.log("start");
const value = await Promise.resolve("ready");
console.log(value);
`,
    hints: [
      "Use await directly in this async exercise body; the runner provides top-level await.",
      "Store the fulfilled value and log it after the await.",
    ],
    successMessage: "Correct. The runner waited for top-level await and the async root to settle.",
    validate: validateM7L4Exercise,
  },
};
