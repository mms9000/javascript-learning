import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM6L6Output(entries) {
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const expected = ["Handled: Name is required"];
  if (actual.length === 1 && actual[0] === expected[0]) {
    return {
      passed: true,
      status: "success",
      message: "Success. The function threw an Error, and the catch block displayed its message.",
    };
  }
  return {
    passed: false,
    status: "mismatch",
    message: 'Expected "Handled: Name is required". Check that the invalid case throws an Error and that catch reads error.message.',
  };
}

export const validateM6L6Exercise = createBaseValidator(checkM6L6Output, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the try/catch braces and template literal.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the function name and error variable.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Throw an Error object and read its message property.`,
});

export const lessonM6L6 = {
  lessonId: "m6-l6",
  moduleId: "m6",
  moduleTitle: "Module 6: JavaScript in the Browser",
  title: "Error Handling with try and catch",
  estimatedMinutes: 20,
  prerequisites: ["m6-l5"],
  objectives: [
    "Throw an Error when an input condition is invalid.",
    "Catch a thrown error and read its message.",
    "Distinguish a handled exception from an uncaught runner failure.",
  ],
  sections: [
    {
      id: "throw-error",
      heading: "1. Throw an Error for an Invalid Condition",
      content: `
        <p>Use <code>throw</code> when a function cannot continue with the provided
        value. An <code>Error</code> object can carry a clear message explaining
        what went wrong.</p>
        <pre><code>if (name.trim() === "") {
  throw new Error("Name is required");
}</code></pre>
        <p>Throwing stops the current path through the function unless a surrounding
        <code>try</code> block handles the error.</p>
      `,
    },
    {
      id: "catch-error",
      heading: "2. Handle the Error with try and catch",
      content: `
        <p>Put code that may throw inside <code>try</code>. If that code throws,
        execution continues in the associated <code>catch</code> block. The caught
        error's <code>message</code> property explains the problem.</p>
        <pre><code>try {
  console.log(getGreeting(" "));
} catch (error) {
  console.log(\`Handled: \${error.message}\`);
}</code></pre>
      `,
    },
    {
      id: "handled-versus-uncaught",
      heading: "3. Handled and Uncaught Errors",
      content: `
        <p>A handled exception lets the program display useful feedback and continue
        after the <code>catch</code> block. An error that escapes all matching
        <code>try</code>/<code>catch</code> blocks is an uncaught runtime error and
        is reported by the execution environment. This example is synchronous and
        does not introduce asynchronous error handling.</p>
      `,
    },
    {
      id: "error-prediction",
      heading: "4. Comprehension Check: Predict the Handled Message",
      content: `
        <p>Calling <code>getGreeting(" ")</code> has a blank name after trimming.
        Predict which Error message the function throws and what the catch block
        prints with its <code>Handled:</code> prefix.</p>
      `,
    },
  ],
  summary: [
    "Throw an Error when a function receives an invalid value.",
    "A catch block handles an error thrown from its associated try block.",
    "Read error.message to give a learner useful information about a handled failure.",
    "Uncaught errors are still reported as execution failures.",
  ],
  exercise: {
    id: "m6-l6-ex1",
    executionMode: "worker",
    title: "Handle an Invalid Name",
    prompt: "Throw an Error for a blank name, then catch it and print its message.",
    expectedOutput: "Handled: Name is required",
    starterCode: `function getGreeting(name) {
  if (name.trim() === "") {
    // Throw an Error with the message "Name is required".
  }
  return \`Hello, \${name}\`;
}

try {
  console.log(getGreeting(" "));
} catch (error) {
  console.log(\`Handled: \${error.message}\`);
}
`,
    hints: [
      'Inside the blank-name condition, throw new Error("Name is required").',
      "The catch block receives the thrown Error. Use error.message in the output, and keep the function call inside try.",
    ],
    validate: validateM6L6Exercise,
  },
};
