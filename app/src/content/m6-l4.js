import { createBaseValidator } from "./validators.js";

function findNodes(nodes, predicate, matches = []) {
  if (!Array.isArray(nodes)) return matches;
  for (const node of nodes) {
    if (predicate(node)) matches.push(node);
    findNodes(node.children, predicate, matches);
  }
  return matches;
}

function findById(nodes, id) {
  return findNodes(nodes, (node) => node.attributes?.id === id)[0] || null;
}

const validateM6L4Execution = createBaseValidator(() => ({
  passed: true,
  status: "success",
  message: "Checking the form and task-list behavior...",
}), {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the form listener and function braces.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the form, input, status, count, and list selectors.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Use the supported form, input, checkbox, and list operations.`,
});

export function validateM6L4Exercise(entries, runResult) {
  const executionResult = validateM6L4Execution(entries, runResult);
  if (!executionResult.passed) return executionResult;

  const interactions = runResult.interactions || [];
  const submissions = interactions.filter((event) => event.type === "submit");
  const blankSubmissionIndex = submissions.findIndex(
    (event) => String(event.formValues?.["task-input"] ?? "").trim() === ""
  );
  const validSubmissionIndex = submissions.findIndex(
    (event, index) => index > blankSubmissionIndex &&
      event.formValues?.["task-input"] === "Review DOM"
  );
  const completedCheckbox = interactions.some(
    (event) => event.type === "change" && event.checked === true
  );
  const snapshot = runResult.snapshot;
  const status = snapshot && findById(snapshot.roots, "task-status");
  const count = snapshot && findById(snapshot.roots, "task-count");
  const list = snapshot && findById(snapshot.roots, "task-list");
  const input = snapshot && findById(snapshot.roots, "task-input");
  const checkboxes = snapshot && findNodes(snapshot.roots, (node) =>
    node.tag === "input" && node.attributes?.type === "checkbox"
  );

  if (
    blankSubmissionIndex >= 0 &&
    validSubmissionIndex >= 0 &&
    completedCheckbox &&
    status?.text === "Added: Review DOM." &&
    count?.text === "1 of 3 completed" &&
    list?.children.length === 3 &&
    input?.value === "" &&
    checkboxes?.filter((checkbox) => checkbox.checked).length === 1 &&
    findNodes([list.children[2]], (node) =>
      typeof node.text === "string" && node.text.includes("Review DOM")
    ).length > 0
  ) {
    return {
      passed: true,
      status: "success",
      message: "DOM milestone complete. The model validates input, adds one task, and updates its accessible completion count.",
    };
  }

  return {
    passed: false,
    status: "mismatch",
    message: "First submit blank input to show Enter a task., then add Review DOM and toggle one task checkbox. Verify the list, live status, and completion count.",
  };
}

export const lessonM6L4 = {
  lessonId: "m6-l4",
  moduleId: "m6",
  moduleTitle: "Module 6: JavaScript in the Browser",
  title: "Form Input and Validation",
  estimatedMinutes: 25,
  prerequisites: ["m6-l3"],
  objectives: [
    "Read a labeled input's value and handle a form submission.",
    "Prevent modeled default submission and validate trimmed input.",
    "Display accessible feedback and update a task list.",
  ],
  sections: [
    {
      id: "forms-and-labels",
      heading: "1. Read Labeled Form Input",
      content: `
        <p>A form groups controls that collect information. A visible label explains
        what an input is for; a placeholder is not a replacement for a label.
        Reading an input's <code>value</code> gives the text entered by the learner.</p>
        <p>The controlled fixture uses an actual host-rendered label and input, but
        its submission behavior is modeled and is not a complete native form API.</p>
      `,
    },
    {
      id: "validate-input",
      heading: "2. Prevent Default and Validate",
      content: `
        <p>A submit event can be handled with <code>addEventListener</code>. Calling
        the modeled <code>preventDefault()</code> keeps the preview from navigating.
        Use <code>trim()</code> to check whether the input contains more than
        whitespace.</p>
        <pre><code>form.addEventListener("submit", (event) =&gt; {
  event.preventDefault();
  const task = input.value.trim();
  if (task === "") {
    status.textContent = "Enter a task.";
    return;
  }
});</code></pre>
      `,
    },
    {
      id: "update-list-accessibly",
      heading: "3. Update the List and Announce Feedback",
      content: `
        <p>For a valid task, create a labeled list item and checkbox, append it to the
        list, clear and focus the input, then update the polite status message.
        Register a change listener for each checkbox so toggling it recalculates
        the completion count.</p>
        <p>The controlled preview models these direct event handlers; it does not
        implement native event bubbling or every browser form behavior.</p>
      `,
    },
    {
      id: "todo-milestone",
      heading: "4. DOM Milestone: Accessible Mini To-Do List",
      content: `
        <p>This is the Module 6 DOM milestone, not completion of the full module.
        Start with two tasks. Blank input should announce <strong>Enter a task.</strong>
        A valid <strong>Review DOM</strong> submission adds one task, clears and
        refocuses the input, and announces <strong>Added: Review DOM.</strong>
        Toggling one checkbox updates the live completion count.</p>
      `,
    },
  ],
  summary: [
    "Use a label to identify a form control and value to read its input.",
    "Prevent modeled default submission and validate the trimmed value before changing the list.",
    "Use live feedback, focus, and checkbox change handlers to support an accessible interaction.",
    "The controlled DOM milestone is not native DOM execution and does not complete Module 6 by itself.",
  ],
  exercise: {
    id: "m6-l4-ex1",
    executionMode: "dom",
    fixtureId: "m6-l4",
    title: "DOM Milestone: Build an Accessible To-Do List",
    prompt: "Reject blank input, add Review DOM, and update the count when a task checkbox changes.",
    expectedOutput: "Enter a task. → Added: Review DOM. → 1 of 3 completed",
    starterCode: `const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const status = document.querySelector("#task-status");
const count = document.querySelector("#task-count");
const list = document.querySelector("#task-list");

function updateCount() {
  const completed = list.querySelectorAll("input:checked").length;
  count.textContent = \`\${completed} of \${list.children.length} completed\`;
}

function watchCheckbox(checkbox) {
  checkbox.addEventListener("change", updateCount);
}
for (const checkbox of list.querySelectorAll("input")) watchCheckbox(checkbox);

form.addEventListener("submit", (event) => {
  // Prevent submission, trim and validate the input, then create and append one task.
  // Clear/refocus the input and announce success or the validation message.
});
`,
    hints: [
      "Start the submit callback with event.preventDefault() and input.value.trim(). If it is empty, set status.textContent to Enter a task. and return.",
      "For valid text, create an li, label, and checkbox; register watchCheckbox for it; append it to list, clear and focus input, updateCount(), then set the success status.",
    ],
    validate: validateM6L4Exercise,
  },
};
