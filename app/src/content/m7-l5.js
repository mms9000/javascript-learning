import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkHandledRejection(entries) {
  const expected = ["Handled: offline"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed = actual.length === expected.length && actual[0] === expected[0];
  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. The rejection from await was handled by the matching catch block."
      : "Put the await inside try and use the caught error's message in the handler.",
  };
}

export const validateM7L5Exercise = createBaseValidator(checkHandledRejection, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the try/catch braces.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Use the error parameter declared by catch.`,
  timeoutMessage: "The rejected Promise was not handled before the time limit.",
});

export const lessonM7L5 = {
  lessonId: "m7-l5",
  moduleId: "m7",
  moduleTitle: "Module 7: Asynchronous JavaScript",
  title: "Error Handling in Asynchronous Code",
  estimatedMinutes: 20,
  prerequisites: ["m7-l4"],
  objectives: [
    "Handle a rejected Promise awaited inside try/catch.",
    "Distinguish a handled rejection from a rejected root Promise.",
    "Explain why a synchronous try/catch does not catch an error thrown later by a timer callback.",
  ],
  sections: [
    {
      id: "await-rejection",
      heading: "1. Catch a Rejection from await",
      content: `
        <p>When an awaited Promise rejects, <code>await</code> throws that rejection
        reason at the await expression. A surrounding <code>try/catch</code> can
        handle it:</p>
        <pre><code>try {
  await Promise.reject(new Error("offline"));
} catch (error) {
  console.log(\`Handled: \${error.message}\`);
}</code></pre>
      `,
    },
    {
      id: "root-rejection",
      heading: "2. Unhandled Rejections Are Failures",
      content: `
        <p>If the root Promise rejects without a handler, the runner reports an
        execution error. An exercise that intentionally catches an error can finish
        successfully; a rejection is not success merely because it was asynchronous.</p>
      `,
    },
    {
      id: "timer-errors",
      heading: "3. Timer Callbacks Have a Later Error Boundary",
      content: `
        <p>A timer callback runs after the surrounding synchronous
        <code>try/catch</code> has finished. That earlier catch cannot catch an
        exception thrown later by the callback. This runner reports timer callback
        exceptions as execution errors.</p>
      `,
    },
  ],
  summary: [
    "An awaited rejection can be handled by a surrounding try/catch.",
    "An unhandled rejection of the root asynchronous operation is an execution error.",
    "A later timer callback runs outside an earlier synchronous try/catch.",
  ],
  exercise: {
    id: "m7-l5-ex1",
    executionMode: "async-worker",
    title: "Handle a Rejected Promise",
    prompt: "Catch the rejected Promise and print its message without failing the exercise.",
    expectedOutput: "Handled: offline",
    starterCode: `try {
  await Promise.reject(new Error("offline"));
} catch (error) {
  console.log(\`Handled: \${error.message}\`);
}
`,
    hints: [
      "The await expression throws when the Promise rejects.",
      "Place the await inside try and read error.message in catch.",
    ],
    successMessage: "Correct. The asynchronous rejection was handled, so the root operation settled successfully.",
    validate: validateM7L5Exercise,
  },
};
