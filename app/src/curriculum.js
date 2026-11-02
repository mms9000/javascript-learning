/**
 * curriculum.js — Curriculum module.
 *
 * Implements the full curriculum map defined in curriculum-spec.md §2.
 * Provides functions to query modules, lessons, prerequisites, and starting point.
 */

/**
 * Returns the complete curriculum map structured into 9 sequential modules.
 *
 * @returns {Array<{moduleId: string, moduleTitle: string, milestone?: string, lessons: Array<{lessonId: string, title: string, estimatedMinutes?: number, prerequisites?: string[], objectives?: string[]}>}>}
 */
export function getCurriculum() {
  return [
    {
      moduleId: "m1",
      moduleTitle: "Module 1: Getting Started",
      milestone: "Run a simple program and explain its output.",
      lessons: [
        {
          lessonId: "m1-l1",
          title: "What JavaScript Is and Where It Runs",
          estimatedMinutes: 15,
          prerequisites: [],
          objectives: [
            "Explain what JavaScript is and describe three environments where it runs.",
            "Identify the role of the JavaScript engine in a web browser.",
            "Distinguish between JavaScript, the browser, and the browser's JavaScript engine.",
            "Run a simple JavaScript program and read its output.",
          ],
        },
        {
          lessonId: "m1-l2",
          title: "Your First Program and console.log()",
          estimatedMinutes: 15,
          prerequisites: ["m1-l1"],
          objectives: [
            "Use console.log() to print text and numbers.",
            "Understand that program statements execute sequentially.",
          ],
        },
        {
          lessonId: "m1-l3",
          title: "Reading Basic Syntax and Comments",
          estimatedMinutes: 10,
          prerequisites: ["m1-l2"],
          objectives: [
            "Identify statements, semicolons, and whitespace in JavaScript.",
            "Write single-line and multi-line comments.",
          ],
        },
        {
          lessonId: "m1-l4",
          title: "Understanding Common Syntax Errors",
          estimatedMinutes: 15,
          prerequisites: ["m1-l3"],
          objectives: [
            "Identify syntax errors and read browser error messages.",
            "Debug common typos and unclosed brackets or quotes.",
          ],
        },
      ],
    },
    {
      moduleId: "m2",
      moduleTitle: "Module 2: Values and Variables",
      milestone: "Build a simple calculator using variables and expressions.",
      lessons: [
        {
          lessonId: "m2-l1",
          title: "Strings, Numbers, Booleans, null, and undefined",
          estimatedMinutes: 20,
          prerequisites: ["m1-l4"],
          objectives: [
            "Identify the five core primitive types in JavaScript: string, number, boolean, null, and undefined.",
            "Use the typeof operator to inspect the data type of an expression.",
            "Explain the difference between undefined (unassigned) and null (intentional absence).",
            "Recognize the historical JavaScript quirk where typeof null === 'object'.",
          ],
        },
        {
          lessonId: "m2-l2",
          title: "Declaring Variables with const and let",
          estimatedMinutes: 15,
          prerequisites: ["m2-l1"],
          objectives: [
            "Explain what a variable is and why named bindings are essential.",
            "Declare variables using const (default) and let (for reassignable bindings).",
            "Explain why modern JavaScript avoids var due to scoping and hoisting issues.",
            "Follow JavaScript identifier naming rules and camelCase conventions.",
          ],
        },
        {
          lessonId: "m2-l3",
          title: "Reassignment and Value Mutability",
          estimatedMinutes: 15,
          prerequisites: ["m2-l2"],
          objectives: [
            "Distinguish between variable declaration and variable reassignment.",
            "Explain that primitive values in JavaScript are strictly immutable.",
            "Recognize and diagnose a TypeError when reassigning a const variable.",
            "Understand that const binds the variable name and does not freeze object contents.",
          ],
        },
        {
          lessonId: "m2-l4",
          title: "Operators and Expressions",
          estimatedMinutes: 20,
          prerequisites: ["m2-l3"],
          objectives: [
            "Distinguish between operators (symbols) and expressions (constructs evaluating to values).",
            "Use arithmetic operators (+, -, *, /, %, **) and understand operator precedence.",
            "Apply compound assignment operators (+=, -=, *=, /=).",
            "Construct template literals using backticks and ${expression} interpolation.",
          ],
        },
        {
          lessonId: "m2-l5",
          title: "Type Conversion and Coercion",
          estimatedMinutes: 20,
          prerequisites: ["m2-l4"],
          objectives: [
            "Distinguish explicit type conversion from implicit type coercion.",
            "Convert types explicitly using Number(), String(), and Boolean().",
            "Identify the dual role of the + operator and resolve implicit string concatenation bugs.",
            "Explain NaN characteristics, typeof NaN === 'number', and Number.isNaN().",
          ],
        },
        {
          lessonId: "m2-l6",
          title: "Equality and Comparisons",
          estimatedMinutes: 15,
          prerequisites: ["m2-l5"],
          objectives: [
            "Compare values using strict equality (===) and strict inequality (!==).",
            "Explain why loose equality (==) produces unexpected bugs due to coercion.",
            "Use relational operators (>, <, >=, <=) evaluating to boolean outcomes.",
            "Build a simple calculator using variables, expressions, and comparisons.",
          ],
        },
      ],
    },
    {
      moduleId: "m3",
      moduleTitle: "Module 3: Decisions and Repetition",
      milestone: "Build a deterministic number-search or rule-based program.",
      lessons: [
        {
          lessonId: "m3-l1",
          title: "Truthy and Falsy Values",
          estimatedMinutes: 15,
          prerequisites: ["m2-l6"],
          objectives: [
            "Identify false, 0, -0, NaN, an empty string, null, and undefined as falsy values.",
            'Explain why non-empty strings such as "0" and "false" are truthy.',
            "Predict Boolean(value) results for the primitive values in this lesson.",
          ],
        },
        {
          lessonId: "m3-l2",
          title: "if, else if, and else",
          estimatedMinutes: 20,
          prerequisites: ["m3-l1"],
          objectives: [
            "Use an if/else if/else chain to select one matching branch.",
            "Use comparison expressions as conditions.",
            "Explain why branch order matters and how else acts as the fallback.",
          ],
        },
        {
          lessonId: "m3-l3",
          title: "switch and Conditional Expressions",
          estimatedMinutes: 15,
          prerequisites: ["m3-l2"],
          objectives: [
            "Use switch to choose a branch for a fixed value.",
            "Use break to prevent switch fall-through and default for an unmatched value.",
            "Use the ternary conditional operator for a simple two-way value choice.",
          ],
        },
        {
          lessonId: "m3-l4",
          title: "for and while Loops",
          estimatedMinutes: 20,
          prerequisites: ["m3-l3"],
          objectives: [
            "Use a for loop for a finite sequence of repeated steps.",
            "Use a while loop and update its state so its condition eventually becomes false.",
            "Identify loop initialization, condition, and update, and avoid off-by-one errors.",
          ],
        },
        {
          lessonId: "m3-l5",
          title: "break and continue",
          estimatedMinutes: 15,
          prerequisites: ["m3-l4"],
          objectives: [
            "Use continue to skip the current loop iteration.",
            "Use break to exit the nearest loop.",
            "Trace which values reach the loop body after skip and stop conditions.",
          ],
        },
        {
          lessonId: "m3-l6",
          title: "Choosing an Appropriate Control Structure",
          estimatedMinutes: 15,
          prerequisites: ["m3-l5"],
          objectives: [
            "Choose a loop for repetition and conditional branches for rules or fixed choices.",
            "Use a ternary conditional operator for a simple two-way value choice.",
            "Combine a finite loop and conditional branches to implement a deterministic rule-based search.",
          ],
        },
      ],
    },
    {
      moduleId: "m4",
      moduleTitle: "Module 4: Functions",
      milestone: "Break a multi-step problem into reusable functions.",
      lessons: [
        {
          lessonId: "m4-l1",
          title: "Function Declarations and Expressions",
          estimatedMinutes: 20,
          prerequisites: ["m3-l6"],
          objectives: [
            "Define and call a function declaration.",
            "Define and call a function expression.",
            "Distinguish defining a function from invoking it.",
          ],
        },
        {
          lessonId: "m4-l2",
          title: "Parameters, Arguments, and Return Values",
          estimatedMinutes: 20,
          prerequisites: ["m4-l1"],
          objectives: [
            "Distinguish a function parameter from an argument supplied at a call.",
            "Return a computed value from a function.",
            "Distinguish returning a value from printing inside a function.",
          ],
        },
        {
          lessonId: "m4-l3",
          title: "Arrow Functions",
          estimatedMinutes: 15,
          prerequisites: ["m4-l2"],
          objectives: [
            "Write and call an arrow function expression.",
            "Return a value from an arrow function using an expression body or explicit block-body return.",
            "Recognize an arrow function as another function-writing form.",
          ],
        },
        {
          lessonId: "m4-l4",
          title: "Scope and Lexical Scope",
          estimatedMinutes: 20,
          prerequisites: ["m4-l3"],
          objectives: [
            "Identify a function-local binding.",
            "Explain access to a binding in an enclosing lexical scope.",
            "Distinguish lexical lookup from the order in which functions are called.",
          ],
        },
        {
          lessonId: "m4-l5",
          title: "Callbacks and Higher-Order Functions",
          estimatedMinutes: 25,
          prerequisites: ["m4-l4"],
          objectives: [
            "Pass a function as an argument without calling it at the call site.",
            "Write a higher-order function that accepts and invokes a callback.",
            "Explain that the callback in this lesson runs synchronously.",
          ],
        },
        {
          lessonId: "m4-l6",
          title: "Closures",
          estimatedMinutes: 25,
          prerequisites: ["m4-l5"],
          objectives: [
            "Explain how an inner function retains access to bindings after the outer function returns.",
            "Create a closure that retains private state.",
            "Distinguish state held by two separately created closures.",
          ],
        },
        {
          lessonId: "m4-l7",
          title: "Recursion and Common Debugging Patterns",
          estimatedMinutes: 20,
          prerequisites: ["m4-l6"],
          objectives: [
            "Identify a recursive function's base case and recursive case.",
            "Trace a bounded recursive call sequence and verify progress toward the base case.",
            "Diagnose a missing base case or a recursive call that does not make progress.",
          ],
        },
      ],
    },
    {
      moduleId: "m5",
      moduleTitle: "Module 5: Arrays and Objects",
      milestone: "Build a small data-processing application.",
      lessons: [
        {
          lessonId: "m5-l1",
          title: "Creating and Accessing Arrays",
          estimatedMinutes: 20,
          prerequisites: ["m4-l7"],
          objectives: [
            "Create an array literal.",
            "Read values from an array using zero-based indexes.",
            "Use length to find the number of items and the final valid index.",
          ],
        },
        {
          lessonId: "m5-l2",
          title: "Iteration and Array Methods",
          estimatedMinutes: 20,
          prerequisites: ["m5-l1"],
          objectives: [
            "Visit each array item using a for...of loop.",
            "Build a result array with push.",
            "Check for an item using includes.",
          ],
        },
        {
          lessonId: "m5-l3",
          title: "map, filter, find, and reduce",
          estimatedMinutes: 30,
          prerequisites: ["m5-l2"],
          objectives: [
            "Explain that array transformation methods call a synchronous callback.",
            "Use map to produce one transformed result for each input item.",
            "Use filter to keep matching items and find to return the first match.",
            "Use reduce with an initial accumulator value to compute a summary.",
          ],
        },
        {
          lessonId: "m5-l4",
          title: "Creating and Updating Objects",
          estimatedMinutes: 20,
          prerequisites: ["m5-l3"],
          objectives: [
            "Create an object literal with named properties.",
            "Read object properties with dot and bracket notation.",
            "Update a property and add a new property.",
          ],
        },
        {
          lessonId: "m5-l5",
          title: "Methods and the this Keyword",
          estimatedMinutes: 25,
          prerequisites: ["m5-l4"],
          objectives: [
            "Define a method on an object and call it through that object.",
            "Use this in a directly called method to read and update the object's properties.",
            "Return a value computed from the updated property.",
          ],
        },
        {
          lessonId: "m5-l6",
          title: "Destructuring, Spread, and Rest Syntax",
          estimatedMinutes: 20,
          prerequisites: ["m5-l5"],
          objectives: [
            "Destructure values from arrays and properties from objects.",
            "Use rest syntax to collect remaining array values, object properties, or function arguments.",
            "Use spread syntax to expand arrays and objects into shallow new collections.",
          ],
        },
        {
          lessonId: "m5-l7",
          title: "References, Mutation, and Copying",
          estimatedMinutes: 25,
          prerequisites: ["m5-l6"],
          objectives: [
            "Explain that primitive values copied into a new binding are independent, while object variables can refer to the same object.",
            "Predict how an alias observes object mutation and distinguish mutation from rebinding.",
            "Create a shallow copy and explain which nested references remain shared.",
          ],
        },
        {
          lessonId: "m5-l8",
          title: "Transforming Collections of Objects",
          estimatedMinutes: 25,
          prerequisites: ["m5-l7"],
          objectives: [
            "Read object properties while processing an array of records.",
            "Use filter, map, and reduce callbacks to derive a list and aggregate values.",
            "Create a report without mutating the source records.",
          ],
        },
      ],
    },
    {
      moduleId: "m6",
      moduleTitle: "Module 6: JavaScript in the Browser",
      milestone: "Build an interactive to-do list or similar application.",
      lessons: [
        {
          lessonId: "m6-l1",
          title: "The Relationship Between JavaScript, HTML, and CSS",
          estimatedMinutes: 20,
          prerequisites: ["m5-l8"],
          objectives: [
            "Explain HTML as page structure, CSS as presentation, and JavaScript as behavior.",
            "Describe how the three technologies cooperate in a browser page.",
          ],
        },
        {
          lessonId: "m6-l2",
          title: "DOM Selection and Manipulation",
          estimatedMinutes: 25,
          prerequisites: ["m6-l1"],
          objectives: [
            "Explain that the DOM represents a document as connected nodes.",
            "Select an element with querySelector and read or update textContent.",
            "Create an element and append it to an existing element.",
          ],
        },
        {
          lessonId: "m6-l3",
          title: "Event Listeners and Event Objects",
          estimatedMinutes: 25,
          prerequisites: ["m6-l2"],
          objectives: [
            "Register a click listener with addEventListener.",
            "Update state in response to a user action.",
            "Use an event object's target to identify the activated control.",
          ],
        },
        {
          lessonId: "m6-l4",
          title: "Form Input and Validation",
          estimatedMinutes: 25,
          prerequisites: ["m6-l3"],
          objectives: [
            "Read a labeled input's value and handle a form submission.",
            "Prevent modeled default submission and validate trimmed input.",
            "Display accessible feedback and update a task list.",
          ],
        },
        {
          lessonId: "m6-l5",
          title: "Modules and Imports/Exports",
          estimatedMinutes: 20,
          prerequisites: ["m6-l4"],
          objectives: [
            "Identify named exports and matching named imports.",
            "Explain how a module path identifies a separate source file.",
            "Predict the result of calling an imported function.",
          ],
        },
        {
          lessonId: "m6-l6",
          title: "Error Handling with try and catch",
          estimatedMinutes: 20,
          prerequisites: ["m6-l5"],
          objectives: [
            "Throw an Error when an input condition is invalid.",
            "Catch a thrown error and read its message.",
            "Distinguish a handled exception from an uncaught runner failure.",
          ],
        },
        {
          lessonId: "m6-l7",
          title: "Browser Debugging Tools",
          estimatedMinutes: 20,
          prerequisites: ["m6-l6"],
          objectives: [
            "Choose an appropriate browser DevTools panel for a debugging task.",
            "Use a breakpoint and inspect a variable to investigate a logic error.",
            "Distinguish a logic error from syntax and runtime errors.",
          ],
        },
      ],
    },
    {
      moduleId: "m7",
      moduleTitle: "Module 7: Asynchronous JavaScript",
      milestone: "Build an interface that retrieves and displays external data.",
      lessons: [
        {
          lessonId: "m7-l1",
          title: "Synchronous Execution and the Event Loop",
          estimatedMinutes: 25,
          prerequisites: ["m6-l7"],
          objectives: [
            "Trace synchronous JavaScript statements in order.",
            "Distinguish the call stack, Promise microtasks, and timer tasks.",
            "Predict the ordering of synchronous logs, Promise reactions, and timer callbacks.",
          ],
        },
        {
          lessonId: "m7-l2",
          title: "Callbacks and Asynchronous Operations",
          estimatedMinutes: 20,
          prerequisites: ["m7-l1"],
          objectives: [
            "Distinguish a callback function from the code that registers it.",
            "Explain why statements after scheduling a callback run before the callback.",
            "Use a timer callback as an example of a later task.",
          ],
        },
        {
          lessonId: "m7-l3",
          title: "Promises and Promise Chaining",
          estimatedMinutes: 25,
          prerequisites: ["m7-l2"],
          objectives: [
            "Identify the pending, fulfilled, and rejected states of a Promise.",
            "Use then(), catch(), and finally() to handle a Promise chain.",
            "Return a value from a then() callback to pass it to the next callback.",
            "Explain that finally() normally preserves the prior fulfillment value or rejection.",
          ],
        },
        {
          lessonId: "m7-l4",
          title: "async and await",
          estimatedMinutes: 25,
          prerequisites: ["m7-l3"],
          objectives: [
            "Declare an async function and explain that it returns a Promise.",
            "Use await to read a Promise's fulfilled value before continuing.",
            "Explain that await suspends the async function's continuation rather than blocking the Worker.",
          ],
        },
        {
          lessonId: "m7-l5",
          title: "Error Handling in Asynchronous Code",
          estimatedMinutes: 20,
          prerequisites: ["m7-l4"],
          objectives: [
            "Handle a rejected Promise awaited inside try/catch.",
            "Distinguish a handled rejection from a rejected root Promise.",
            "Explain why a synchronous try/catch does not catch an error thrown later by a timer callback.",
          ],
        },
        {
          lessonId: "m7-l6",
          title: "Fetching Data from an HTTP API",
          estimatedMinutes: 30,
          prerequisites: ["m7-l5"],
          objectives: [
            "Request data from an approved HTTPS API endpoint using fetch().",
            "Check the HTTP response status and parse the JSON body.",
            "Display fields from external data without assuming the request always succeeds.",
          ],
        },
        {
          lessonId: "m7-l7",
          title: "Loading States and Failed Requests",
          estimatedMinutes: 20,
          prerequisites: ["m7-l6"],
          objectives: [
            "Represent loading, success, and failed-request states in a user-facing flow.",
            "Handle HTTP failure responses separately from network or request errors.",
            "Retry a failed request and display data returned by the external API.",
          ],
        },
      ],
    },
    {
      moduleId: "m8",
      moduleTitle: "Module 8: Object-Oriented Programming",
      milestone: "Model a small system using JavaScript objects and classes (prototype-based object model).",
      lessons: [
        {
          lessonId: "m8-l1",
          title: "Objects, Properties, and Methods",
          estimatedMinutes: 20,
          prerequisites: ["m7-l7"],
          objectives: [
            "Create and inspect plain JavaScript objects.",
            "Differentiate between properties and methods on an object.",
            "Explain how object state is stored and accessed.",
          ],
        },
        {
          lessonId: "m8-l2",
          title: "Constructor Functions and Prototypes",
          estimatedMinutes: 25,
          prerequisites: ["m8-l1"],
          objectives: [
            "Build a constructor function to create many similar objects.",
            "Use the new keyword to create object instances.",
            "Explain how prototype methods are shared across instances.",
          ],
        },
        {
          lessonId: "m8-l3",
          title: "Prototype Chains and Property Lookup",
          estimatedMinutes: 25,
          prerequisites: ["m8-l2"],
          objectives: [
            "Trace how JavaScript looks up properties up a prototype chain.",
            "Distinguish between own properties and inherited properties.",
            "Use prototype lookup to explain shared behavior in object systems.",
          ],
        },
        {
          lessonId: "m8-l4",
          title: "Classes and Constructors",
          estimatedMinutes: 25,
          prerequisites: ["m8-l3"],
          objectives: [
            "Write a class declaration for a reusable object shape.",
            "Use the constructor to initialize each instance.",
            "Compare classes to constructor functions and prototypes.",
          ],
        },
        {
          lessonId: "m8-l5",
          title: "Instance Methods and this",
          estimatedMinutes: 20,
          prerequisites: ["m8-l4"],
          objectives: [
            "Use instance methods to model behavior on an object.",
            "Explain how this changes depending on the call site.",
            "Avoid common mistakes when using methods outside their original object.",
          ],
        },
        {
          lessonId: "m8-l6",
          title: "Inheritance Using extends and super",
          estimatedMinutes: 25,
          prerequisites: ["m8-l5"],
          objectives: [
            "Use extends to create a child class from a parent class.",
            "Call super() to initialize the parent constructor.",
            "Explain how subclasses reuse behavior from a parent class.",
          ],
        },
        {
          lessonId: "m8-l7",
          title: "Encapsulation and Private Class Fields",
          estimatedMinutes: 20,
          prerequisites: ["m8-l6"],
          objectives: [
            "Explain why encapsulation keeps internal data private.",
            "Use private class fields to restrict direct access.",
            "Expose safe methods for reading or updating controlled state.",
          ],
        },
        {
          lessonId: "m8-l8",
          title: "Polymorphism and Shared Object Behavior",
          estimatedMinutes: 20,
          prerequisites: ["m8-l7"],
          objectives: [
            "Explain how objects can share behavior through a common interface.",
            "Describe how polymorphism allows different objects to respond to the same method name.",
            "Distinguish shared behavior from identical implementation details.",
          ],
        },
        {
          lessonId: "m8-l9",
          title: "Composition Versus Inheritance",
          estimatedMinutes: 20,
          prerequisites: ["m8-l8"],
          objectives: [
            "Compare inheritance with composition as two different design strategies.",
            "Describe when one approach is more natural than the other.",
            "Explain how object responsibility can be split across smaller components.",
          ],
        },
        {
          lessonId: "m8-l10",
          title: "When OOP Is Useful and When It Is Unnecessary",
          estimatedMinutes: 15,
          prerequisites: ["m8-l9"],
          objectives: [
            "Evaluate when object-oriented patterns help a problem.",
            "Identify cases where plain functions or data structures are more straightforward.",
            "Choose between OOP and a simpler design based on the problem and responsibilities.",
          ],
        },
      ],
    },
    {
      moduleId: "m9",
      moduleTitle: "Module 9: Modern JavaScript & Framework Readiness",
      milestone: "Build and explain a framework-neutral capstone project and identify transferable concepts.",
      lessons: [
        {
          lessonId: "m9-l1",
          title: "Modules and Code Organization",
          estimatedMinutes: 20,
          prerequisites: ["m8-l10"],
          objectives: [
            "Explain why code is organized into modules and separate files.",
            "Identify how imports and exports structure a program.",
            "Describe the value of clean separation in larger applications.",
          ],
        },
        {
          lessonId: "m9-l2",
          title: "Reusable Functions and Separation of Concerns",
          estimatedMinutes: 20,
          prerequisites: ["m9-l1"],
          objectives: [
            "Turn repeated logic into reusable functions.",
            "Separate responsibilities such as data shaping, display logic, and side effects.",
            "Explain how small functions improve maintenance and testing.",
          ],
        },
        {
          lessonId: "m9-l3",
          title: "Array Transformations and Immutable Update Patterns",
          estimatedMinutes: 25,
          prerequisites: ["m9-l2"],
          objectives: [
            "Use array methods such as map and filter to derive new state.",
            "Explain why immutable updates keep state changes predictable.",
            "Identify pattern differences between mutating and derived update logic.",
          ],
        },
        {
          lessonId: "m9-l4",
          title: "Data Flow, State, and Derived Values",
          estimatedMinutes: 25,
          prerequisites: ["m9-l3"],
          objectives: [
            "Distinguish between raw state and derived values.",
            "Reason about how data flows through an application.",
            "Explain why derived values are useful in UI logic.",
          ],
        },
        {
          lessonId: "m9-l5",
          title: "Event-Driven Programming",
          estimatedMinutes: 25,
          prerequisites: ["m9-l4"],
          objectives: [
            "Describe how user events trigger logic in an app.",
            "Connect an event listener to an action such as a button click.",
            "Explain why event-driven behavior is central to web apps and frameworks.",
          ],
        },
        {
          lessonId: "m9-l6",
          title: "Components as a General UI Design Concept",
          estimatedMinutes: 25,
          prerequisites: ["m9-l5"],
          objectives: [
            "Explain the idea of breaking an interface into parts called components.",
            "Describe how reusable UI parts help organize more complex interfaces.",
            "Connect the component idea to framework thinking without requiring a specific framework.",
          ],
        },
        {
          lessonId: "m9-l7",
          title: "Reading Unfamiliar Code and API Documentation",
          estimatedMinutes: 20,
          prerequisites: ["m9-l6"],
          objectives: [
            "Read unfamiliar JavaScript code by locating responsibility and execution flow.",
            "Use documentation and examples to interpret an API or library contract.",
            "Explain how to isolate unknown behavior before rewriting or integrating it.",
          ],
        },
        {
          lessonId: "m9-l8",
          title: "Understanding What a Framework Adds Beyond JavaScript",
          estimatedMinutes: 25,
          prerequisites: ["m9-l7"],
          objectives: [
            "Explain that frameworks build on JavaScript rather than replace it.",
            "Identify common framework responsibilities such as rendering, reactivity, and routing.",
            "Describe how a strong JavaScript foundation makes framework learning easier.",
          ],
        },
        {
          lessonId: "m9-l9",
          title: "Framework-Neutral Capstone Project",
          estimatedMinutes: 45,
          prerequisites: ["m9-l8"],
          objectives: [
            "Design a small app using plain JavaScript patterns familiar across frameworks.",
            "Apply state, events, reusable logic, and render flow in a coherent project.",
            "Explain how the same design ideas reappear in modern frameworks.",
          ],
        },
      ],
    },
  ];
}

/**
 * Returns the number of lesson entries in the canonical curriculum.
 *
 * @returns {number}
 */
export function getTotalLessonCount() {
  return getCurriculum().reduce((total, module) => total + module.lessons.length, 0);
}

/**
 * Returns the lesson ID of the recommended starting point.
 *
 * @returns {string} The first lesson ID ("m1-l1").
 */
export function getStartingLessonId() {
  return "m1-l1";
}

/**
 * Finds a lesson by its unique ID across all modules.
 *
 * @param {string} lessonId
 * @returns {Object|null}
 */
export function findLessonById(lessonId) {
  const curriculum = getCurriculum();
  for (const mod of curriculum) {
    const lesson = mod.lessons.find((l) => l.lessonId === lessonId);
    if (lesson) {
      return { ...lesson, moduleId: mod.moduleId, moduleTitle: mod.moduleTitle };
    }
  }
  return null;
}

/**
 * Finds a module by its unique ID.
 *
 * @param {string} moduleId
 * @returns {Object|null}
 */
export function findModuleById(moduleId) {
  const curriculum = getCurriculum();
  return curriculum.find((m) => m.moduleId === moduleId) || null;
}

/**
 * Returns the sequential next lesson ID following a given lesson ID, or null if none.
 *
 * @param {string} lessonId
 * @returns {string|null}
 */
export function getNextLessonId(lessonId) {
  const curriculum = getCurriculum();
  const allLessons = curriculum.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.lessonId === lessonId);
  if (idx !== -1 && idx + 1 < allLessons.length) {
    return allLessons[idx + 1].lessonId;
  }
  return null;
}
