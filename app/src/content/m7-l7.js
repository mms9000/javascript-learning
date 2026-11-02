import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkLoadingAndRetry(entries) {
  const expected = [
    "Loading task...",
    "Could not load task: HTTP 404",
    "Retrying task...",
    "Loaded: delectus aut autem",
  ];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  const passed = actual.length === expected.length &&
    actual.every((line, index) => line === expected[index]);
  return {
    passed,
    status: passed ? "success" : "mismatch",
    message: passed
      ? "Correct. The interface showed loading, handled the HTTP error, retried, and displayed external data."
      : "Show loading first, handle the failed response, then retry and display the returned task.",
  };
}

export const validateM7L7Exercise = createBaseValidator(checkLoadingAndRetry, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the try/catch and async expressions.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the response and task names.`,
  timeoutMessage: "The request or retry exceeded the execution time limit.",
  onError: (name, message) => name === "TimeoutError" || name === "AbortError"
    ? {
      passed: false,
      status: "error",
      message: `The external task request did not complete: ${message}`,
    }
    : null,
});

export const lessonM7L7 = {
  lessonId: "m7-l7",
  moduleId: "m7",
  moduleTitle: "Module 7: Asynchronous JavaScript",
  title: "Loading States and Failed Requests",
  estimatedMinutes: 20,
  prerequisites: ["m7-l6"],
  objectives: [
    "Represent loading, success, and failed-request states in a user-facing flow.",
    "Handle HTTP failure responses separately from network or request errors.",
    "Retry a failed request and display data returned by the external API.",
  ],
  sections: [
    {
      id: "loading-state",
      heading: "1. Make Waiting Visible",
      content: `
        <p>A request takes time. Showing a loading message before awaiting it helps
        people understand that work is in progress. A robust interface also has
        distinct success and error states.</p>
      `,
    },
    {
      id: "http-versus-network",
      heading: "2. Distinguish HTTP Errors from Network Errors",
      content: `
        <p>A 404 is still an HTTP response, so <code>fetch()</code> normally fulfills
        and <code>response.ok</code> is false. A network failure instead rejects
        the fetch Promise. Check <code>response.ok</code> and use
        <code>try/catch</code> for failures that reject.</p>
      `,
    },
    {
      id: "retry-and-milestone",
      heading: "3. Retry and Display External Data",
      content: `
        <p>After showing an error, a user can choose to retry. The course milestone
        combines these ideas: retrieve public external data, check the response,
        and display a field from it. The controlled exercise uses a fixed public
        HTTPS API with bounded host mediation; it does not permit arbitrary URLs.</p>
      `,
    },
  ],
  summary: [
    "Show loading while a request is pending and provide clear success or error feedback.",
    "An HTTP error such as 404 is a response; a network failure rejects the fetch Promise.",
    "A retry is a new request and can succeed after an earlier request failed.",
  ],
  exercise: {
    id: "m7-l7-ex1",
    executionMode: "async-worker",
    title: "Handle Failure and Retry",
    prompt: "Show a loading state, handle the approved 404 response, retry with the valid task endpoint, and display the returned title.",
    expectedOutput: "Loading task...\nCould not load task: HTTP 404\nRetrying task...\nLoaded: delectus aut autem",
    starterCode: `console.log("Loading task...");
try {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/999999999");
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  const task = await response.json();
  console.log(\`Loaded: \${task.title}\`);
} catch (error) {
  console.log(\`Could not load task: \${error.message}\`);
  console.log("Retrying task...");
  const retryResponse = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  if (!retryResponse.ok) throw new Error(\`HTTP \${retryResponse.status}\`);
  const task = await retryResponse.json();
  console.log(\`Loaded: \${task.title}\`);
}
`,
    hints: [
      "Log a loading message before awaiting the first request.",
      "Check response.ok: the approved missing task returns an HTTP 404 response rather than a rejected fetch.",
      "In catch, retry with the approved valid task URL, then parse and display its title.",
    ],
    successMessage: "Module 7 milestone complete: the exercise displayed loading and error states, retried, and showed external API data.",
    validate: validateM7L7Exercise,
  },
};
