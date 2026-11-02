import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkPromiseChain(entries) {
  const expected = ["3", "4", "cleanup"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed = actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);
  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. The returned value flows to the next then(), and finally() runs after settlement."
      : "Check the value returned from the first then() and keep cleanup in finally().",
  };
}

export const validateM7L3Exercise = createBaseValidator(checkPromiseChain, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the Promise callbacks and braces.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the value names used in the chain.`,
  timeoutMessage: "The Promise exercise did not settle before the time limit.",
});

export const lessonM7L3 = {
  lessonId: "m7-l3",
  moduleId: "m7",
  moduleTitle: "Module 7: Asynchronous JavaScript",
  title: "Promises and Promise Chaining",
  estimatedMinutes: 25,
  prerequisites: ["m7-l2"],
  objectives: [
    "Identify the pending, fulfilled, and rejected states of a Promise.",
    "Use then(), catch(), and finally() to handle a Promise chain.",
    "Return a value from a then() callback to pass it to the next callback.",
    "Explain that finally() normally preserves the prior fulfillment value or rejection.",
  ],
  sections: [
    {
      id: "promise-states",
      heading: "1. A Promise Represents a Future Result",
      content: `
        <p>A Promise starts pending and later becomes fulfilled with a value or
        rejected with a reason. Calling <code>then()</code> registers a reaction;
        that callback runs as a microtask after the current stack, not inline.</p>
      `,
    },
    {
      id: "promise-chain",
      heading: "2. Pass Values Through a Chain",
      content: `
        <pre><code>Promise.resolve(2)
  .then(value =&gt; {
    console.log(value + 1);
    return value * 2;
  })
  .then(console.log)
  .finally(() =&gt; console.log("cleanup"));</code></pre>
        <p>The first callback prints <code>3</code> and returns <code>4</code>, so
        the next callback receives <code>4</code>. <code>finally()</code> runs
        after settlement and normally preserves the earlier value or rejection.</p>
      `,
    },
    {
      id: "promise-errors",
      heading: "3. Rejections Continue Through the Chain",
      content: `
        <p>A rejection skips fulfillment handlers until a rejection handler such as
        <code>catch()</code> handles it. If the root Promise rejects without a
        handler, this playground reports an execution error rather than success.</p>
      `,
    },
  ],
  summary: [
    "Promises represent work that may fulfill or reject later.",
    "A value returned by then() becomes the input to the next then().",
    "finally() is for cleanup and normally does not replace the settled value.",
  ],
  exercise: {
    id: "m7-l3-ex1",
    executionMode: "async-worker",
    title: "Follow a Promise Chain",
    prompt: "Complete the chain so it prints the transformed values and then performs cleanup.",
    expectedOutput: "3\n4\ncleanup",
    starterCode: `Promise.resolve(2)
  .then(value => {
    console.log(value + 1);
    return value * 2;
  })
  .then(console.log)
  .finally(() => console.log("cleanup"));
`,
    hints: [
      "The first handler must return its transformed value, not just print it.",
      "The next then() receives the value returned by the previous handler.",
      "Use finally() for the cleanup message after the chain settles.",
    ],
    successMessage: "Correct. The Promise chain passed 4 to the next handler and then ran cleanup.",
    validate: validateM7L3Exercise,
  },
};
