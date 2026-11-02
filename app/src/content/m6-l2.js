import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function findNode(nodes, id) {
  if (!Array.isArray(nodes)) return null;
  for (const node of nodes) {
    if (node.attributes?.id === id) return node;
    const child = findNode(node.children, id);
    if (child) return child;
  }
  return null;
}

function checkM6L2Output(entries) {
  const expected = ["JavaScript updated", "2"];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((line, index) => line === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "The output is correct. Checking the controlled preview state...",
    };
  }
  return {
    passed: false,
    status: "mismatch",
    message: "Expected the updated status and a list count of 2. Check the selector, textContent, and append operation.",
  };
}

const validateM6L2Execution = createBaseValidator(checkM6L2Output, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the selector strings and method calls.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the status, items, and item variable names.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Use the supported createElement and append operations.`,
});

export function validateM6L2Exercise(entries, runResult) {
  const outputResult = validateM6L2Execution(entries, runResult);
  if (!outputResult.passed) return outputResult;

  const snapshot = runResult.snapshot;
  const status = snapshot && findNode(snapshot.roots, "status");
  const items = snapshot && findNode(snapshot.roots, "items");
  const appendedItem = items?.children.at(-1);
  if (
    status?.text === "JavaScript updated" &&
    items?.children.length === 2 &&
    appendedItem?.tag === "li" &&
    appendedItem.text === "Practice DOM"
  ) {
    return {
      passed: true,
      status: "success",
      message: "Success. You selected elements, changed text, created a list item, and appended it to the controlled preview.",
    };
  }
  return {
    passed: false,
    status: "mismatch",
    message: "Update #status, append a new li containing Practice DOM to #items, and verify the resulting text and item count. The preview is a controlled DOM simulation.",
  };
}

export const lessonM6L2 = {
  lessonId: "m6-l2",
  moduleId: "m6",
  moduleTitle: "Module 6: JavaScript in the Browser",
  title: "DOM Selection and Manipulation",
  estimatedMinutes: 25,
  prerequisites: ["m6-l1"],
  objectives: [
    "Explain that the DOM represents a document as connected nodes.",
    "Select an element with querySelector and read or update textContent.",
    "Create an element and append it to an existing element.",
  ],
  sections: [
    {
      id: "document-tree",
      heading: "1. A Document Is Represented as Nodes",
      content: `
        <p>The browser represents a page as a <strong>Document Object Model (DOM)</strong>:
        a tree of nodes that describe elements and their content. JavaScript can select
        a node and ask for a supported change.</p>
        <pre><code>&lt;h2 id="status"&gt;Ready&lt;/h2&gt;
&lt;ul id="items"&gt;&lt;li&gt;Read guide&lt;/li&gt;&lt;/ul&gt;</code></pre>
        <p>In this lesson, the preview is a deliberately small, bounded Worker-backed DOM
        simulation. It is not the platform's document and does not provide every
        native browser DOM feature.</p>
      `,
    },
    {
      id: "select-and-update",
      heading: "2. Select an Element and Update Its Text",
      content: `
        <p><code>querySelector</code> returns the first matching element, or
        <code>null</code> when there is no match. A <code>#</code> selector matches
        an element's id. Assigning <code>textContent</code> changes the modeled text
        without treating it as HTML.</p>
        <pre><code>const status = document.querySelector("#status");
status.textContent = "JavaScript updated";</code></pre>
      `,
    },
    {
      id: "create-and-append",
      heading: "3. Create and Append an Element",
      content: `
        <p><code>createElement</code> makes a new element in the controlled model.
        Set its text, then append it to the list. Updating a JavaScript variable alone
        does not add a node to the document.</p>
        <pre><code>const item = document.createElement("li");
item.textContent = "Practice DOM";
items.append(item);</code></pre>
        <p>The preview supports only the selectors and operations listed for this
        exercise; it does not model layout, CSS, or the full native DOM.</p>
      `,
    },
    {
      id: "dom-prediction",
      heading: "4. Comprehension Check: Predict the Updated List",
      content: `
        <p>The list starts with one item. If the program appends one new
        <code>li</code>, it should contain two items. Predict both the updated status
        text and the number of list items before running the exercise.</p>
      `,
    },
  ],
  summary: [
    "The DOM represents a document as nodes organized in a tree.",
    "querySelector selects a matching element, and textContent reads or updates its text.",
    "createElement and append add a new node; this lesson's preview is a bounded simulation rather than native DOM access.",
  ],
  exercise: {
    id: "m6-l2-ex1",
    executionMode: "dom",
    fixtureId: "m6-l2",
    title: "Update a Document Preview",
    prompt: "Update the status, append the new list item, and print the updated status and number of items.",
    expectedOutput: "JavaScript updated\n2",
    starterCode: `const status = document.querySelector("#status");
const items = document.querySelector("#items");
status.textContent = "JavaScript updated";
const item = document.createElement("li");
item.textContent = "Practice DOM";
// Append the new item and inspect the resulting state.
console.log(status.textContent);
console.log(items.children.length);
`,
    hints: [
      'The list is selected in the items variable. Create an "li" and set its text to "Practice DOM".',
      "Append the item to items with items.append(item), then run the code to check the status and list length.",
    ],
    validate: validateM6L2Exercise,
  },
};
