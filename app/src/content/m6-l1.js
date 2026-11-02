import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

function checkM6L1Output(entries) {
  const expected = [
    "HTML: structure",
    "CSS: presentation",
    "JavaScript: behavior",
  ];
  const actual = entries.map((entry) => stripTrailingNewlines(entry.text));

  if (actual.length === expected.length && actual.every((line, index) => line === expected[index])) {
    return {
      passed: true,
      status: "success",
      message: "Correct. HTML provides structure, CSS presentation, and JavaScript behavior.",
    };
  }
  return {
    passed: false,
    status: "mismatch",
    message: `Expected three role labels in order: ${expected.join("; ")}. Check the value assigned to each technology.`,
  };
}

export const validateM6L1Exercise = createBaseValidator(checkM6L1Output, {
  syntaxErrorMessage: (message) => `Syntax Error: ${message}. Check the object and template literal syntax.`,
  referenceErrorMessage: (message) => `Reference Error: ${message}. Check the spelling of the roles object and its properties.`,
  typeErrorMessage: (message) => `Type Error: ${message}. Check that each role is a string.`,
});

export const lessonM6L1 = {
  lessonId: "m6-l1",
  moduleId: "m6",
  moduleTitle: "Module 6: JavaScript in the Browser",
  title: "The Relationship Between JavaScript, HTML, and CSS",
  estimatedMinutes: 20,
  prerequisites: ["m5-l8"],
  objectives: [
    "Explain HTML as page structure, CSS as presentation, and JavaScript as behavior.",
    "Describe how the three technologies cooperate in a browser page.",
  ],
  sections: [
    {
      id: "page-parts",
      heading: "1. Three Technologies, Three Jobs",
      content: `
        <p>A browser page commonly combines three technologies. <strong>HTML</strong>
        describes the content and its structure, <strong>CSS</strong> controls how that
        content looks, and <strong>JavaScript</strong> describes behavior and responds to
        changes such as a button click.</p>
        <div class="concept-card">
          <ul>
            <li>HTML: a heading, paragraph, form, or button exists.</li>
            <li>CSS: those elements have color, spacing, and layout.</li>
            <li>JavaScript: a button responds and page content can be updated.</li>
          </ul>
        </div>
      `,
    },
    {
      id: "working-together",
      heading: "2. How They Work Together",
      content: `
        <p>The browser reads HTML to build a document, applies CSS to present it,
        and runs JavaScript to add behavior. JavaScript does not replace HTML or CSS:
        each has a different responsibility.</p>
        <pre><code>&lt;button&gt;Show message&lt;/button&gt;  &lt;!-- HTML: structure --&gt;
button { color: purple; }       /* CSS: presentation */
button.addEventListener("click", showMessage); // JavaScript: behavior</code></pre>
        <p>The example illustrates the jobs of each technology. The lesson playground
        runs JavaScript code only; it does not execute this HTML or CSS snippet.</p>
      `,
    },
    {
      id: "page-role-prediction",
      heading: "3. Comprehension Check: Predict the Roles",
      content: `
        <p>If a page needs a title, a blue background, and a response to a button click,
        predict which technology is responsible for each: HTML provides the title's
        structure, CSS provides the background's appearance, and JavaScript responds
        to the click.</p>
      `,
    },
  ],
  summary: [
    "HTML describes page content and structure.",
    "CSS controls presentation such as color and spacing.",
    "JavaScript provides behavior; the technologies work together rather than replacing one another.",
  ],
  exercise: {
    id: "m6-l1-ex1",
    executionMode: "worker",
    title: "Label the Page Roles",
    prompt: "Complete the JavaScript role, then run the program to print all three technology roles in order.",
    expectedOutput: "HTML: structure\nCSS: presentation\nJavaScript: behavior",
    starterCode: `const roles = {
  html: "structure",
  css: "presentation",
  javascript: "",
};
console.log(\`HTML: \${roles.html}\`);
console.log(\`CSS: \${roles.css}\`);
console.log(\`JavaScript: \${roles.javascript}\`);
`,
    hints: [
      "HTML describes structure, CSS describes presentation, and JavaScript describes what the page does.",
      'Set the javascript property to the string "behavior".',
    ],
    validate: validateM6L1Exercise,
  },
};
