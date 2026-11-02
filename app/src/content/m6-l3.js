import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

const expectedClicks = [
  "Clicked: Add one",
  "Count: 1",
  "Clicked: Add one",
  "Count: 2",
];

function findNode(nodes, id) {
  if (!Array.isArray(nodes)) return null;
  for (const node of nodes) {
    if (node.attributes?.id === id) return node;
    const child = findNode(node.children, id);
    if (child) return child;
  }
  return null;
}

const validateM6L3Output = createBaseValidator((entries) => {
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));
  if (actual.length === expectedClicks.length &&
    actual.every((line, index) => line === expectedClicks[index])) {
    return {
      passed: true,
      status: "success",
      message: "The click output is correct. Checking the updated preview state...",
    };
  }
  return {
    passed: false,
    status: "mismatch",
    message: "Activate Add one twice. Register a click listener that updates the count and reports the event target.",
  };
}, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the listener function and its braces.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the button, countOutput, and count names.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Register a function with addEventListener("click", ...).`,
});

export function validateM6L3Exercise(entries, runResult) {
  const outputResult = validateM6L3Output(entries, runResult);
  if (!outputResult.passed) return outputResult;

  const clickEvents = runResult.interactions?.filter((event) => event.type === "click") || [];
  const count = runResult.snapshot && findNode(runResult.snapshot.roots, "count");
  if (clickEvents.length === 2 && count?.text === "2") {
    return {
      passed: true,
      status: "success",
      message: "Success. The listener ran for both user clicks, read event.target, and updated the controlled preview count.",
    };
  }
  return {
    passed: false,
    status: "mismatch",
    message: "The count must reach 2 after two actual preview clicks. Register the callback instead of calling it immediately.",
  };
}

export const lessonM6L3 = {
  lessonId: "m6-l3",
  moduleId: "m6",
  moduleTitle: "Module 6: JavaScript in the Browser",
  title: "Event Listeners and Event Objects",
  estimatedMinutes: 25,
  prerequisites: ["m6-l2"],
  objectives: [
    "Register a click listener with addEventListener.",
    "Update state in response to a user action.",
    "Use an event object's target to identify the activated control.",
  ],
  sections: [
    {
      id: "register-listeners",
      heading: "1. Register a Listener for Later",
      content: `
        <p><code>addEventListener</code> registers a function to run when an event
        occurs. Registering the function does not call it immediately. The callback
        waits for a matching user action.</p>
        <pre><code>button.addEventListener("click", () =&gt; {
  console.log("The button was activated");
});</code></pre>
        <p>This exercise forwards clicks from a host-rendered preview to the controlled
        model. The event subset is intentionally small and does not reproduce full
        browser event propagation.</p>
      `,
    },
    {
      id: "event-target-state",
      heading: "2. Use the Event and Update State",
      content: `
        <p>The browser passes an event object to a listener. Its <code>target</code>
        identifies the control that produced the event. A callback can use that
        information and update a value displayed in the page.</p>
        <pre><code>let count = 0;
button.addEventListener("click", (event) =&gt; {
  count += 1;
  countOutput.textContent = String(count);
  console.log(event.target.textContent);
});</code></pre>
        <p>The callback runs once per matching click; it is not invoked during
        registration.</p>
      `,
    },
    {
      id: "event-prediction",
      heading: "3. Comprehension Check: Predict Two Clicks",
      content: `
        <p>If <code>count</code> starts at zero and the listener adds one per click,
        predict the value after two activations. Each event should observe the updated
        count in order: first 1, then 2.</p>
      `,
    },
  ],
  summary: [
    "addEventListener registers a callback that runs when its event occurs.",
    "The event object can identify the activated control through target.",
    "User actions can update program state and the controlled preview.",
  ],
  exercise: {
    id: "m6-l3-ex1",
    executionMode: "dom",
    fixtureId: "m6-l3",
    title: "Count Button Activations",
    prompt: "Complete the listener so two preview clicks update and report the count.",
    expectedOutput: expectedClicks.join("\n"),
    starterCode: `const button = document.querySelector("#increment");
const countOutput = document.querySelector("#count");
let count = 0;
button.addEventListener("click", (event) => {
  // Increment count and update countOutput.
  console.log(\`Clicked: \${event.target.textContent}\`);
  console.log(\`Count: \${count}\`);
});
`,
    hints: [
      "The listener callback runs when the host-rendered Add one button is clicked. Add one to count inside the callback.",
      "Set countOutput.textContent to String(count), then click the preview button twice and compare each output line.",
    ],
    validate: validateM6L3Exercise,
  },
};
