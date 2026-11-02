export const lessonM8L3 = {
  lessonId: "m8-l3",
  moduleId: "m8",
  moduleTitle: "Module 8: Object-Oriented Programming",
  title: "Prototype Chains and Property Lookup",
  estimatedMinutes: 25,
  prerequisites: ["m8-l2"],
  objectives: [
    "Trace property lookup through the prototype chain.",
    "Explain how JavaScript finds a property on an object or its prototype.",
    "Differentiate own properties from inherited properties.",
  ],
  sections: [
    {
      id: "look-up",
      heading: "1. Property Lookup Walks the Chain",
      content: `
        <p>When a property is read, JavaScript checks the object itself first. If it does not find the property there, it keeps looking up the prototype chain.</p>
      `,
    },
    {
      id: "own-vs-inherited",
      heading: "2. Own versus Inherited Properties",
      content: `
        <p>An own property belongs directly to the instance. An inherited property is found on a parent prototype and can still be used by the instance.</p>
      `,
    },
    {
      id: "why-it-matters",
      heading: "3. Why the Chain Matters",
      content: `
        <p>Prototype chains let many objects share common behavior while still keeping unique values on each instance.</p>
      `,
    },
  ],
  summary: [
    "JavaScript searches for a property on the object first.",
    "If it is missing, it walks the prototype chain.",
    "Shared behavior can live on prototypes while instance state stays local.",
  ],
  exercise: {
    id: "m8-l3-ex1",
    executionMode: "knowledge-check",
    title: "Trace the prototype lookup",
    prompt: "Choose the correct order of property lookup in a prototype chain.",
    starterCode: "",
    hints: [
      "Look at the object first.",
      "Then walk upward through the prototype chain until the property is found or absent.",
    ],
    successMessage: "Correct. JavaScript looks on the object, then its prototype, then the next prototype, and so on.",
    failureMessage: "A property is not found immediately on the instance, then the engine checks the prototype chain.",
    questions: [
      {
        prompt: "When reading a method, what is the first place JavaScript checks?",
        correctOptionId: "instance-first",
        options: [
          { id: "instance-first", label: "The object itself." },
          { id: "window-first", label: "The browser window object." },
        ],
      },
      {
        prompt: "What happens if the property is not found on the object?",
        correctOptionId: "walk-prototype",
        options: [
          { id: "walk-prototype", label: "JavaScript continues to the prototype chain." },
          { id: "stop-immediately", label: "It stops and throws an error immediately." },
        ],
      },
      {
        prompt: "What is an own property?",
        correctOptionId: "own-property",
        options: [
          { id: "own-property", label: "A property directly attached to the instance." },
          { id: "inherited-property", label: "A property attached only to the global object." },
        ],
      },
    ],
  },
};
