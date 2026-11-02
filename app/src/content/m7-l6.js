import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkFetchedTask(entries) {
  const expected = ["Task: delectus aut autem", "Status: open"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed = actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);
  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. The approved cross-origin API returned task data that the interface displayed."
      : "Check the response status, parse its JSON body, and display the task title and completion state.",
  };
}

export const validateM7L6Exercise = createBaseValidator(checkFetchedTask, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the fetch and await expressions.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the response and task variable names.`,
  timeoutMessage: "The API request or async operation did not finish before the time limit.",
  onError: (name, message) => name === "TimeoutError" || name === "AbortError"
    ? {
      passed: false,
      status: "error",
      message: `The approved task API did not complete: ${message}`,
    }
    : null,
});

export const lessonM7L6 = {
  lessonId: "m7-l6",
  moduleId: "m7",
  moduleTitle: "Module 7: Asynchronous JavaScript",
  title: "Fetching Data from an HTTP API",
  estimatedMinutes: 30,
  prerequisites: ["m7-l5"],
  objectives: [
    "Request data from an approved HTTPS API endpoint using fetch().",
    "Check the HTTP response status and parse the JSON body.",
    "Display fields from external data without assuming the request always succeeds.",
  ],
  sections: [
    {
      id: "http-request",
      heading: "1. Request Data with fetch()",
      content: `
        <p><code>fetch()</code> returns a Promise that fulfills with a response
        object. This course uses the public
        <code>https://jsonplaceholder.typicode.com/todos/1</code> endpoint. It
        requires no account, API key, or learner credential, and its CORS response
        was verified from the application origin.</p>
      `,
    },
    {
      id: "check-and-parse",
      heading: "2. Check Status and Parse JSON",
      content: `
        <p>Fetch normally fulfills for HTTP statuses such as 404; check
        <code>response.ok</code> before parsing. Then call
        <code>response.json()</code> and await its Promise:</p>
        <pre><code>const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
const task = await response.json();
console.log(task.title);</code></pre>
      `,
    },
    {
      id: "approved-api-boundary",
      heading: "3. A Narrow Learning API",
      content: `
        <p>The async Worker does not receive unrestricted network access. The host
        independently allows only two fixed GET URLs, omits credentials, rejects
        redirects, validates the response, and limits response size and duration.
        This is a controlled learning endpoint, not permission to request arbitrary
        URLs or add headers.</p>
      `,
    },
  ],
  summary: [
    "fetch() returns a Promise; await it to receive a response.",
    "Check response.ok and response.status because HTTP errors do not automatically reject fetch.",
    "Parse JSON separately, then display the fields the exercise needs.",
    "This playground permits only the explicitly allowlisted public API requests.",
  ],
  exercise: {
    id: "m7-l6-ex1",
    executionMode: "async-worker",
    title: "Display an API Task",
    prompt: "Fetch the approved task, handle a non-success status, parse the JSON, and display its title and state.",
    expectedOutput: "Task: delectus aut autem\nStatus: open",
    starterCode: `const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
const task = await response.json();
console.log(\`Task: \${task.title}\`);
console.log(\`Status: \${task.completed ? "done" : "open"}\`);
`,
    hints: [
      "Await fetch() and inspect response.ok before reading the response body.",
      "Await response.json() to get the task object.",
      "The API returns a title and a completed boolean; translate that boolean into the displayed state.",
    ],
    successMessage: "Correct. The exercise requested, checked, parsed, and displayed the external task data.",
    validate: validateM7L6Exercise,
  },
};
