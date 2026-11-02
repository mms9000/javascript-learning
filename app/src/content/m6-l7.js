export const lessonM6L7 = {
  lessonId: "m6-l7",
  moduleId: "m6",
  moduleTitle: "Module 6: JavaScript in the Browser",
  title: "Browser Debugging Tools",
  estimatedMinutes: 20,
  prerequisites: ["m6-l6"],
  objectives: [
    "Choose an appropriate browser DevTools panel for a debugging task.",
    "Use a breakpoint and inspect a variable to investigate a logic error.",
    "Distinguish a logic error from syntax and runtime errors.",
  ],
  sections: [
    {
      id: "devtools-panels",
      heading: "1. Choose a Useful DevTools Panel",
      content: `
        <p>Browser Developer Tools (DevTools) provide panels for investigating a page.
        The <strong>Console</strong> displays messages and errors, the
        <strong>Sources</strong> panel lets you pause at breakpoints and step through
        code, and the <strong>Elements</strong> panel helps inspect a page's markup
        and styles.</p>
        <p>Choose the panel that helps answer the question you have; not every problem
        is an error that will appear in the console.</p>
      `,
    },
    {
      id: "breakpoints-and-watch",
      heading: "2. Pause and Inspect Values",
      content: `
        <p>A breakpoint pauses execution at a chosen line. While paused, step through
        statements and inspect variables. A Watch expression such as
        <code>readings[index]</code> can reveal which array value the loop is using.</p>
        <p>For a loop, watching <code>index</code>, <code>readings[index]</code>,
        and <code>total</code> can show when a calculation first becomes incorrect.</p>
      `,
    },
    {
      id: "debugging-sum",
      heading: "3. Diagnose a Logic Error",
      content: `
        <pre><code>const readings = [3, 5, 2];
let total = 0;
for (let index = 0; index &lt;= readings.length; index += 1) {
  total += readings[index];
}
console.log(total); // NaN</code></pre>
        <p>The code is syntactically valid and the loop runs, but the inclusive bound
        eventually reads <code>readings[readings.length]</code>, which is
        <code>undefined</code>. Adding that value makes <code>total</code>
        <code>NaN</code>. This is a <strong>logic error</strong>: the program runs,
        but its result is wrong. The condition should use
        <code>index &lt; readings.length</code>.</p>
      `,
    },
    {
      id: "devtools-scope",
      heading: "4. What This Lesson Can and Cannot Debug",
      content: `
        <p>This lesson checks your understanding of DevTools concepts. It does not
        provide an integrated browser debugger for the platform's editor or its
        Worker, and it does not open or control browser DevTools. The example is
        analyzed through an output-prediction knowledge check; no code executes.</p>
      `,
    },
  ],
  summary: [
    "Use the Console for messages, Sources for breakpoints and stepping, and Elements to inspect markup and styles.",
    "Breakpoints and Watch expressions help trace how a value changes.",
    "A logic error can run without a syntax or runtime error and still produce a wrong result.",
    "The lesson assesses DevTools concepts without providing an integrated debugger.",
  ],
  exercise: {
    id: "m6-l7-ex1",
    executionMode: "knowledge-check",
    title: "Choose a Debugging Step",
    prompt: "Trace the array-sum example, identify its logic error, and choose a useful breakpoint and Watch values.",
    starterCode: "",
    hints: [
      "The final valid array index is readings.length - 1. Watch what happens when index equals readings.length.",
      "Pause inside the loop and watch index, readings[index], and total. The code runs, but the inclusive bound causes a logic error.",
    ],
    successMessage: "Correct. The inclusive bound reads past the final array item; a breakpoint and Watch values expose the logic error.",
    failureMessage: "Review the final valid array index and choose a breakpoint and watched values that expose the out-of-range read.",
    questions: [
      {
        prompt: "Which part causes the incorrect total?",
        correctOptionId: "inclusive-bound",
        options: [
          { id: "inclusive-bound", label: "The condition uses index <= readings.length instead of index < readings.length." },
          { id: "total-start", label: "The total starts at 0." },
        ],
      },
      {
        prompt: "Which debugging step best reveals the out-of-range read?",
        correctOptionId: "watch-index",
        options: [
          { id: "watch-index", label: "Set a breakpoint inside the loop and watch index, readings[index], and total." },
          { id: "reload-page", label: "Reload the page and inspect only the button's CSS." },
        ],
      },
      {
        prompt: "The program runs but prints NaN. What kind of defect is this?",
        correctOptionId: "logic-error",
        options: [
          { id: "logic-error", label: "A logic error: valid code produced an incorrect result." },
          { id: "syntax-error", label: "A syntax error: the JavaScript could not be parsed." },
        ],
      },
    ],
  },
};
