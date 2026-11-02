export const lessonM6L5 = {
  lessonId: "m6-l5",
  moduleId: "m6",
  moduleTitle: "Module 6: JavaScript in the Browser",
  title: "Modules and Imports/Exports",
  estimatedMinutes: 20,
  prerequisites: ["m6-l4"],
  objectives: [
    "Identify named exports and matching named imports.",
    "Explain how a module path identifies a separate source file.",
    "Predict the result of calling an imported function.",
  ],
  sections: [
    {
      id: "export-a-function",
      heading: "1. Export a Function from a File",
      content: `
        <p>As a program grows, related code can be organized into separate files called
        modules. An <code>export</code> makes a chosen value available to another
        module.</p>
        <pre><code>// helpers.js
export function double(value) {
  return value * 2;
}</code></pre>
        <p>This function is a <strong>named export</strong> because its exported name is
        <code>double</code>.</p>
      `,
    },
    {
      id: "import-by-name",
      heading: "2. Import by Name and File Path",
      content: `
        <p>A named import uses braces and must match the exported name. The quoted
        relative path identifies the file that provides the export.</p>
        <pre><code>// app.js
import { double } from "./helpers.js";
console.log(double(4)); // 8</code></pre>
        <p>Importing makes the function available; it does not call the function.
        The call <code>double(4)</code> produces 8 because the function multiplies
        its argument by 2.</p>
      `,
    },
    {
      id: "module-execution-limits",
      heading: "3. What This Exercise Demonstrates",
      content: `
        <p>This platform's single-source Worker runner does not execute static
        <code>import</code> or <code>export</code> declarations as a multi-file
        project. This lesson uses a no-execution knowledge check: it assesses syntax
        recognition, name/path matching, and output prediction. It does not claim
        that modules are loaded or executed by the exercise.</p>
      `,
    },
    {
      id: "named-import-prediction",
      heading: "4. Comprehension Check: Predict the Import",
      content: `
        <p>Given <code>export function double(value)</code> in
        <code>helpers.js</code>, choose the named import that requests
        <code>double</code> from <code>./helpers.js</code>, then predict the value of
        <code>double(4)</code>.</p>
      `,
    },
  ],
  summary: [
    "A named export makes a value available under its exported name.",
    "A named import uses braces and matches the exported binding name.",
    "An import path identifies a file; importing does not call the imported function.",
    "The lesson check evaluates recognition and prediction only, not multi-file execution.",
  ],
  exercise: {
    id: "m6-l5-ex1",
    executionMode: "knowledge-check",
    title: "Match a Named Export",
    prompt: "Read the two-file example, choose the matching named import, and predict its output.",
    starterCode: "",
    hints: [
      "A named export called double is imported using braces around double.",
      "The relative path is ./helpers.js, and calling double(4) multiplies 4 by 2.",
    ],
    successMessage: "Correct. The named import matches the export and double(4) returns 8.",
    failureMessage: "Not quite. Match the imported name and file path to the export, then trace the function call.",
    questions: [
      {
        prompt: 'Which line imports the named export from "helpers.js"?',
        correctOptionId: "named-import",
        options: [
          { id: "named-import", label: 'import { double } from "./helpers.js";' },
          { id: "default-import", label: 'import double from "./helpers.js";' },
        ],
      },
      {
        prompt: "What value does double(4) return?",
        correctOptionId: "eight",
        options: [
          { id: "eight", label: "8" },
          { id: "four", label: "4" },
        ],
      },
    ],
  },
};
