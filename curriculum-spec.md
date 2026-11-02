# Curriculum Specification — Interactive JavaScript Learning Platform

**Version:** 1.0  
**Status:** Proposed curriculum baseline  
**Parent:** `constitution.md`, `requirements.md`

## 1. Learning philosophy

The curriculum MUST move from explanation to demonstration, experimentation, practice, and independent problem-solving. Lessons should be short enough to practise one or a few related concepts at a time. Difficulty SHOULD increase gradually, and new material MUST identify its prerequisites.

## 2. Curriculum map

### Module 1 — Getting started
1. What JavaScript is and where it runs.
   - **Exercise `m1-l1-ex1` — Your First Output: Hello, JavaScript!**
     - **Objective:** Use `console.log()` to output an exact string literal to the console.
     - **Starter Code:** `console.log("Hello, world!");`
     - **Expected Output:** Exactly one line: `Hello, JavaScript!` (trailing newlines ignored).
     - **Evaluation:** Evaluates actual execution result (status `success` and exactly 1 output line matching target string). Rejects extraneous lines, case mismatch, runtime errors, syntax errors, and timeouts.
     - **Progressive Hints:** Tier 1 guidance pointing to text between quotes; Tier 2 syntax reference showing `console.log("Hello, JavaScript!");`. Hints are collapsible.
     - **Completion Rule:** Passing validation automatically marks `m1-l1` complete.
2. Your first program and `console.log()`.
   - **Exercise `m1-l2-ex1` — Sequential Output: Player Score**
     - **Objective:** Understand sequential top-to-bottom statement execution and output text and numbers on distinct lines.
     - **Starter Code:** `console.log("Player Score:");`
     - **Expected Output:** Exactly two lines: line 1 = `Player Score:`, line 2 = `100` (trailing newlines ignored).
     - **Evaluation:** Evaluates runner status (`success`) and sequential output lines. Rejects missing lines, extra lines, inverted order, and casing mismatches.
     - **Known Limitation:** The Web Worker communication boundary serializes console arguments to text over `postMessage`. The validator verifies the serialized output stream matches `"100"` as expected, but does not claim that output validation proves the value's underlying runtime JavaScript type.
     - **Progressive Hints:** Tier 1 guidance pointing to adding a second `console.log()` statement with number 100 without quotes; Tier 2 code syntax reference.
     - **Completion Rule:** Passing validation marks `m1-l2` complete.
3. Reading basic syntax and comments.
   - **Exercise `m1-l3-ex1` — Explain the Code: Fix the Comment**
     - **Objective:** Demonstrate that a `//` comment is not executed by fixing a broken program in which a comment line is missing its `//` prefix (causing a `ReferenceError`), and verifying that after the fix only the intended `console.log` output is produced.
     - **Starter Code:** A four-line program containing one correctly commented line, one line that is *meant* to be a comment but is missing its `//` prefix, and one `console.log("Hello from JavaScript!");` call.
     - **Expected Output:** Exactly one line: `Hello from JavaScript!` (trailing newlines ignored).
     - **Evaluation:** Evaluates actual runner status and output. Starter code produces a `ReferenceError`; corrected code must produce one matching output line. Rejects zero output, extra output, case mismatches, syntax errors, and timeouts. `ReferenceError` feedback specifically guides the learner to add `//`.
     - **Progressive Hints:** Tier 1 — explain that `//` makes a line a comment; Tier 2 — show the corrected line.
     - **Completion Rule:** Passing validation marks `m1-l3` complete.
4. Understanding common syntax errors.
   - **Instructional Focus:** Introduces syntax errors as normal grammatical feedback from the JavaScript engine. Covers unclosed quotation marks as an illustrative instructional concept (not separately assessed in this lesson's exercise) and focuses hands-on debugging on missing closing parentheses. Teaches learners to inspect `SyntaxError` reports and locate malformed statements by checking delimiter pairs without promising engine-specific line numbers.
   - **Exercise `m1-l4-ex1` — Debugging: The Missing Parenthesis**
     - **Objective:** Read a syntax error message, identify the missing closing parenthesis in a statement by checking delimiter pairs, and fix the syntax error so that the program executes cleanly.
     - **Starter Code:**
       ```javascript
       // Module 1, Lesson 4 — Exercise: Fixing Syntax Errors
       // The statement below is missing its closing parenthesis.
       // Fix the error so the program prints: Syntax errors are normal!
       console.log("Syntax errors are normal!";
       ```
     - **Expected Output:** Exactly one line: `Syntax errors are normal!` (trailing newlines ignored).
     - **Evaluation:** Evaluates actual runner status and output. Unmodified starter code fails execution with `SyntaxError`; validator inspects `err.name === "SyntaxError"` (independent of engine-specific message text) and provides friendly, specific debugging guidance explaining the missing closing parenthesis. Corrected code must run with status `success` and produce exactly `Syntax errors are normal!`. Rejects missing output, extra output, capitalization mismatches, runtime errors, and timeouts.
     - **Progressive Hints:** Tier 1 advises matching opening and closing parentheses; Tier 2 provides the exact syntax correction.
     - **Completion Rule:** Passing validation marks `m1-l4` complete, bringing Module 1 progress to 4/4 lessons.

**Milestone: Run a simple program and explain its output.**
- **Criteria for Module 1 Mastery:**
  1. Produce text and numeric output using `console.log()`.
  2. Explain sequential top-to-bottom statement execution.
  3. Write and distinguish explanatory comments from executed code.
  4. Diagnose and resolve common syntax errors (missing parentheses, unclosed quotes).

### Module 2 — Values and variables

1. Strings, numbers, booleans, `null`, and `undefined`.
   - **Instructional Focus:** Introduces the concept of data types and primitive values. Emphasizes the five primary primitive types used in everyday programming: `string`, `number`, `boolean`, `null`, and `undefined`. Notes that JavaScript also includes two specialized primitives, `bigint` (arbitrary-precision integers) and `symbol` (unique tokens), while keeping detailed instruction of them reserved for advanced topics. Covers the `typeof` operator and documents the historic quirk where `typeof null === "object"`.
   - **Comprehension Check:** Quick prediction check identifying primitive vs non-primitive and `typeof` results.
   - **Exercise `m2-l1-ex1` — Inspecting Primitive Types**
     - **Objective:** Use `console.log()` and the `typeof` operator to inspect and output the runtime types of a string, number, and boolean.
     - **Starter Code:**
       ```javascript
       // Module 2, Lesson 1 — Exercise: Inspecting Primitive Types
       // Print the typeof "Code", typeof 42, and typeof true on separate lines.
       console.log(typeof "Code");
       ```
     - **Expected Output:** Exactly three lines: line 1 = `string`, line 2 = `number`, line 3 = `boolean` (trailing newlines ignored).
     - **Evaluation:** Evaluates runner status (`success`) and sequential output. Rejects missing lines, extra lines, inverted order, and casing mismatches.
     - **Progressive Hints:** Tier 1 suggests adding two more `console.log()` calls with `typeof 42` and `typeof true`; Tier 2 provides the exact syntax correction.
     - **Completion Rule:** Passing validation marks `m2-l1` complete.

2. Declaring variables with `const` and `let`.
   - **Instructional Focus:** Introduces variables as named bindings in memory. Teaches the default use of `const` for identifiers that will not be rebound, and `let` for variables whose bindings will change. Explains why modern JavaScript avoids `var` (function scope leakage and hoisting confusion). Covers valid identifier naming rules (letters, digits, `$`, `_`, no leading digits) and camelCase conventions. Clarifies that `const` prevents reassigning the binding itself.
   - **Comprehension Check:** Identify valid vs invalid variable declarations and names.
   - **Exercise `m2-l2-ex1` — Declaring Course Variables**
     - **Objective:** Declare a constant using `const` and a mutable variable using `let`, assign them appropriate primitive values, and print their values.
     - **Starter Code:**
       ```javascript
       // Module 2, Lesson 2 — Exercise: Declaring Variables with const and let
       // 1. Declare a const named courseName initialized to "JavaScript Basics"
       // 2. Declare a let named lessonNumber initialized to 2
       // 3. Print both variables on separate lines
       ```
     - **Expected Output:** Exactly two lines: line 1 = `JavaScript Basics`, line 2 = `2`.
     - **Evaluation:** Evaluates runner status (`success`) and output values. `ReferenceError` diagnostics provide targeted guidance if variable names are misspelled.
     - **Progressive Hints:** Tier 1 outlines declaring `const courseName` and `let lessonNumber`; Tier 2 provides the complete solution.
     - **Completion Rule:** Passing validation marks `m2-l2` complete.

3. Reassignment and the distinction between binding and value mutability.
   - **Instructional Focus:** Teaches reassignment syntax (`variable = newValue;` without `let`/`const`). Clarifies three fundamental concepts: (1) a `const` binding cannot be reassigned; (2) primitive values in JavaScript are strictly immutable (changing a variable's value re-binds it to a new primitive value); (3) declaring an object with `const` does not make the object's internal properties immutable (detailed object mutation reserved for Module 5). Teaches how `TypeError` occurs when attempting to reassign a `const` variable.
   - **Comprehension Check:** Predict whether code modifies a value or reassigns a binding, and whether a `const` reassignment fails.
   - **Exercise `m2-l3-ex1` — Fixing the Constant Reassignment**
     - **Objective:** Identify a `TypeError` caused by attempting to reassign a `const` variable, change the declaration keyword to `let`, and observe successful variable reassignment.
     - **Starter Code:**
       ```javascript
       // Module 2, Lesson 3 — Exercise: Reassignment and Value Mutability
       // Fix the error by changing const to let so score can be updated.
       const score = 10;
       console.log(score);

       score = 25;
       console.log(score);
       ```
     - **Expected Output:** Exactly two lines: line 1 = `10`, line 2 = `25`.
     - **Evaluation:** Unmodified starter code fails with `TypeError`. Validator checks whether the error message reliably identifies a const reassignment via `/assignment to const/i` (e.g. V8's `"Assignment to constant variable."` or SpiderMonkey's `"invalid assignment to const 'score'"`). If matched, it provides targeted guidance to change `const` to `let`. Ambiguous messages such as Safari's `"Attempted to assign to readonly property."` (which can also occur on unrelated read-only or getter-only property assignments) are not treated as proof of const reassignment and route to the generic `TypeError` fallback (`"Type Error: ${errMsg}. Check that variables and functions are used with compatible types."`). Unrelated TypeErrors (e.g. non-function invocations) also route to the generic fallback. Corrected code must run with status `success` and produce `10` and `25`.
     - **Progressive Hints:** Tier 1 advises changing `const` to `let` on line 3 while leaving line 6 unchanged; Tier 2 provides the exact solution.
     - **Completion Rule:** Passing validation marks `m2-l3` complete.

4. Operators and expressions.
   - **Instructional Focus:** Distinguishes between operators (symbols that perform operations) and expressions (combinations of values, variables, and operators that evaluate to a single result). Covers arithmetic operators (`+`, `-`, `*`, `/`, `%`, `**`), operator precedence and grouping parentheses `(...)`, compound assignment operators (`+=`, `-=`, `*=`, `/=`), and template literals (string interpolation with backticks and `${expression}`).
   - **Comprehension Check:** (1) Distinguish operators from expressions: classify syntax symbols (`+`, `*`, `+=`) as operators and evaluation constructs (`itemPrice * quantity`, `(10 + 5) * 2`) as expressions that resolve to a value. (2) Predict evaluation order and result of `(10 + 5) * 2` versus `10 + 5 * 2`, and remainder `%` operations.
   - **Exercise `m2-l4-ex1` — Calculating and Formatting an Order Total**
     - **Objective:** Combine arithmetic expressions, operator precedence, compound assignment (`+=`), and template literal formatting.
     - **Starter Code:**
       ```javascript
       // Module 2, Lesson 4 — Exercise: Operators and Expressions
       const itemPrice = 15;
       const quantity = 3;
       const shipping = 5;

       // 1. Calculate subtotal (itemPrice multiplied by quantity)
       let total = itemPrice * quantity;

       // 2. Use compound assignment (+=) to add shipping to total
       // (Add your code here)

       // 3. Print the numeric total on line 1
       console.log(total);

       // 4. Print a formatted string on line 2 using a template literal: "Total: $50"
       // (Add your code here)
       ```
     - **Expected Output:** Exactly two lines: line 1 = `50`, line 2 = `Total: $50`.
     - **Evaluation:** Evaluates runner status (`success`) and sequential lines. Assesses both numeric arithmetic with compound assignment and template literal string formatting.
     - **Progressive Hints:** Tier 1 guides using `total += shipping;` and `console.log(\`Total: $\${total}\`);`; Tier 2 provides the full code solution.
     - **Completion Rule:** Passing validation marks `m2-l4` complete.

5. Type conversion and coercion.
   - **Instructional Focus:** Distinguishes explicit conversion (programmer-directed) from implicit coercion (engine-directed). Covers explicit conversion functions `Number()`, `String()`, and `Boolean()`. Details the dual role of `+` (concatenation if either operand is string vs numeric addition), numeric coercion with `-`, `*`, `/`, and `NaN` (Not-a-Number) characteristics including `typeof NaN === "number"` and `Number.isNaN()`.
   - **Comprehension Check:** Quick predictions for `String(100)`, `Boolean(0)` / `Boolean("hello")`, `Number("abc")`, and `Number.isNaN(NaN)`.
   - **Exercise `m2-l5-ex1` — Fixing the String Addition Bug**
     - **Objective:** Identify implicit string concatenation resulting from adding string variables, and fix the bug using explicit `Number()` conversions to produce numeric addition.
     - **Starter Code:**
       ```javascript
       // Module 2, Lesson 5 — Exercise: Type Conversion and Coercion
       // Fix the code so that it performs numeric addition instead of string concatenation.
       const input1 = "40";
       const input2 = "60";

       const sum = input1 + input2;
       console.log(sum);
       ```
     - **Expected Output:** Exactly one line: `100`.
     - **Evaluation:** Evaluates runner status (`success`) and output. Unmodified code produces `"4060"`; validator provides targeted diagnostic: *"You got '4060' because the + operator concatenated strings! Convert the values with Number(input1) + Number(input2)."* Corrected code must produce `100`.
     - **Progressive Hints:** Tier 1 explains wrapping variables in `Number()`; Tier 2 shows the corrected assignment statement.
     - **Completion Rule:** Passing validation marks `m2-l5` complete.

6. Equality and comparisons.
   - **Instructional Focus:** Teaches strict equality (`===`) and strict inequality (`!==`) versus loose equality (`==`) and loose inequality (`!=`). Explains why loose equality produces surprising coercion bugs and why strict equality is industry standard. Covers relational comparisons (`>`, `<`, `>=`, `<=`) and emphasizes that comparisons evaluate to a boolean value (`true` or `false`).
   - **Comprehension Check:** Predict strict vs loose comparisons (e.g. `5 === "5"` vs `5 == "5"`, `null === undefined` vs `null == undefined`).
   - **Exercise `m2-l6-ex1` — Milestone: Simple Calculator with Comparisons**
     - **Objective:** Integrate variable declarations, arithmetic expressions, relational comparisons, and strict equality into a complete simple calculator program, achieving the Module 2 milestone.
     - **Starter Code:**
       ```javascript
       // Module 2, Lesson 6 — Milestone Exercise: Simple Calculator
       // Build a calculator that computes a final total and evaluates comparisons.
       const price = 80;
       const taxRate = 0.05;
       let discount = 10;

       // 1. Calculate finalTotal: (price + (price * taxRate)) - discount
       const finalTotal = 0; // Replace with formula

       // 2. Check if finalTotal is less than or equal to 75
       const isUnderBudget = false; // Replace with comparison

       // 3. Check if finalTotal is strictly equal to 74
       const isTargetTotal = false; // Replace with strict equality check

       console.log(finalTotal);
       console.log(isUnderBudget);
       console.log(isTargetTotal);
       ```
     - **Expected Output:** Exactly three lines: line 1 = `74`, line 2 = `true`, line 3 = `true`.
     - **Evaluation:** Evaluates runner status (`success`) and sequential lines. Verifies arithmetic calculation (`(80 + 4) - 10 = 74`), relational comparison (`74 <= 75` -> `true`), and strict equality check (`74 === 74` -> `true`).
     - **Progressive Hints:** Tier 1 guides calculation `(price + (price * taxRate)) - discount`, `finalTotal <= 75`, and `finalTotal === 74`; Tier 2 provides the full code solution.
     - **Completion Rule:** Passing validation marks `m2-l6` complete, bringing course-wide progress to 10/64 lessons under the canonical-curriculum denominator and achieving the Module 2 Milestone.

**Milestone: Build a simple calculator using variables and expressions.**
- **Criteria for Module 2 Mastery:**
  1. Distinguish JavaScript primitive types and inspect them with `typeof`.
  2. Declare variables appropriately with `const` and `let` using valid identifier names.
  3. Reassign mutable bindings without re-declaring them, and explain the immutability of primitive values.
  4. Write expressions using arithmetic operators, precedence parentheses, compound assignments, and template literals.
  5. Distinguish explicit type conversion from implicit coercion, and handle `NaN` safely.
  6. Use strict equality and relational comparisons to evaluate boolean conditions in expressions.

### Module 3 — Decisions and repetition
1. **Truthy and Falsy Values** (15 min, prereq: `m2-l6`)
   - **Objectives:** Identify the falsy values `false`, `0`, `-0`, `NaN`, `""`, `null`, and `undefined`; distinguish truthy non-empty strings (including `"0"` and `"false"`) from falsy values; predict `Boolean(value)` results.
   - **Instructional focus:** Build on Module 2's `Boolean()` conversion and primitive values. Explain that truthiness is how values behave in conditions, without implying that `"0"` or `"false"` strings are falsy. Do not depend on arrays or objects, which are taught in Module 5.
   - **Comprehension check:** Predict the Boolean results for `Boolean(0)`, `Boolean("")`, `Boolean("0")`, `Boolean("false")`, and `Boolean(NaN)`.
   - **Exercise `m3-l1-ex1` — Spot the Truthy Values:**
     ```javascript
     const emptyCount = 0;
     const emptyText = "";
     const zeroLabel = "0";
     const readyMessage = "Ready";

     console.log(Boolean(emptyCount));
     // Add the remaining Boolean checks.
     ```
     - **Expected output:** Exactly four lines: `false`, `false`, `true`, `true`.
     - **Evaluation:** Require successful execution and the exact ordered output; reject missing, extra, or mismatched lines.
     - **Progressive hints:** Tier 1 asks the learner to compare the values with the empty string and zero; Tier 2 shows the three remaining `console.log(Boolean(...))` calls.
     - **Completion rule:** Passing `m3-l1-ex1` marks `m3-l1` complete.

2. **if, else if, and else** (20 min, prereq: `m3-l1`)
   - **Objectives:** Execute one branch from an ordered conditional chain; use comparison expressions as conditions; explain why branch order matters and why `else` is the fallback.
   - **Instructional focus:** Use blocks and braces, inclusive/exclusive boundaries, and reachable branch ordering. Show a condition before its general fallback. Avoid nested conditions and logical operators as new required concepts.
   - **Comprehension check:** Predict the selected branch for scores at and around the example thresholds; identify why moving a broad condition earlier can make a later branch unreachable.
   - **Exercise `m3-l2-ex1` — Classify a Score:**
     ```javascript
     const score = 82;

     if (score >= 90) {
       console.log("Excellent");
     } else if (score >= 70) {
       // Print "Passing".
     } else {
       console.log("Keep practicing");
     }
     ```
     - **Expected output:** Exactly one line: `Passing`.
     - **Evaluation:** Require successful execution and exactly the expected line; failure feedback points to the threshold order or missing branch output without matching engine-specific error text.
     - **Progressive hints:** Tier 1 directs the learner to test the `score >= 70` condition after the first condition fails; Tier 2 supplies the branch body.
     - **Completion rule:** Passing `m3-l2-ex1` marks `m3-l2` complete.

3. **switch and Conditional Expressions** (15 min, prereq: `m3-l2`)
   - **Objectives:** Select among fixed cases with `switch`; use `break` to prevent fall-through and `default` for unmatched values; use a ternary expression for a simple two-way value choice.
   - **Instructional focus:** Contrast exact case selection with range-based `if` chains. Show `case`, `break`, and `default`; explain that omitting `break` falls through. Explain the `condition ? valueIfTrue : valueIfFalse` expression without treating it as a replacement for every multi-branch decision.
   - **Comprehension check:** Predict a matching and default `switch` result, identify fall-through when `break` is omitted, and choose between a ternary and a multi-branch statement for a simple two-way decision.
   - **Exercise `m3-l3-ex1` — Choose a Delivery Option:**
     ```javascript
     const deliveryCode = "express";
     const isMember = true;
     let deliveryLabel;

     switch (deliveryCode) {
       case "standard":
         deliveryLabel = "Standard delivery";
         break;
       case "express":
         // Set the express label and prevent fall-through.
         break;
       default:
         deliveryLabel = "Unknown delivery";
     }

     console.log(deliveryLabel);
     console.log(isMember ? "Member price" : "Regular price");
     ```
     - **Expected output:** Exactly two lines: `Express delivery`, `Member price`.
     - **Evaluation:** Require successful execution and exact ordered output. The comprehension check covers `default` and fall-through prediction; validator unit tests cover successful expected output and actionable feedback for incorrect, missing, or extra output. Do not inspect editor source text.
     - **Progressive hints:** Tier 1 points to the matching case and `break`; Tier 2 provides the assignment and explains the ternary's two outcomes.
     - **Completion rule:** Passing `m3-l3-ex1` marks `m3-l3` complete.

4. **for and while Loops** (20 min, prereq: `m3-l3`)
   - **Objectives:** Repeat a finite task with a `for` loop; repeat with a `while` loop and update its condition state; identify initialization, condition, and update; avoid off-by-one and non-terminating loops.
   - **Instructional focus:** Use small counting examples and make termination visible. Compare counted repetition with condition-controlled repetition. Remind learners that a missing `while` update can prevent termination; the playground timeout remains the safety net, not the teaching strategy.
   - **Comprehension check:** Trace initialization, condition, body, and update for a short loop; predict the final iteration and accumulated total.
   - **Exercise `m3-l4-ex1` — Add with Two Loops:**
     ```javascript
     let forTotal = 0;
     // Use for to add the integers 1 through 4.

     let whileTotal = 0;
     let nextValue = 1;
     // Use while to add the integers 1 through 4 and update nextValue.

     console.log(forTotal);
     console.log(whileTotal);
     ```
     - **Expected output:** Exactly two lines: `10`, `10`.
     - **Evaluation:** Require successful execution and both expected totals in order; reject missing/extra output and execution timeout.
     - **Progressive hints:** Tier 1 gives the loop boundaries and reminds the learner to advance `nextValue`; Tier 2 provides the `for` and `while` skeletons.
     - **Completion rule:** Passing `m3-l4-ex1` marks `m3-l4` complete.

5. **break and continue** (15 min, prereq: `m3-l4`)
   - **Objectives:** Use `continue` to skip the current iteration; use `break` to exit the nearest loop; predict which loop values reach the body after these statements.
   - **Instructional focus:** Put the skip and stop conditions inside a finite `for` loop. Explain that `continue` does not terminate a loop and that `break` exits only its nearest loop. Warn against placing a `while` loop's update after a `continue`.
   - **Comprehension check:** Trace a loop containing a skip condition and stop condition; identify the next executed iteration after `continue` and the effect of `break`.
   - **Exercise `m3-l5-ex1` — Skip One, Stop at Five:**
     ```javascript
     for (let value = 1; value <= 6; value++) {
       // Skip value 3.
       // Stop before any value greater than 5.
       console.log(value);
     }
     ```
     - **Expected output:** Exactly four lines: `1`, `2`, `4`, `5`.
     - **Evaluation:** Require successful execution and exact ordered output; feedback distinguishes an unskipped value, an incorrect stop boundary, and line-count/order mismatches.
     - **Progressive hints:** Tier 1 suggests checking the skip condition before logging and the stop condition before logging; Tier 2 supplies `continue` and `break` placements.
     - **Completion rule:** Passing `m3-l5-ex1` marks `m3-l5` complete.

6. **Choosing an Appropriate Control Structure** (15 min, prereq: `m3-l5`)
   - **Objectives:** Choose a loop when work repeats; choose `if`/`else` for range or ordered rules; recognize `switch` as appropriate for fixed choices and a ternary for a simple two-way value; combine a loop and conditional branches to apply a rule.
   - **Instructional focus:** Compare the structures taught in Module 3 and distinguish their use cases. Keep the final program deterministic and self-contained; interactive keyboard input and arrays are outside the current runner/course prerequisites.
   - **Comprehension check:** Select a fitting structure for a range rule, a fixed command choice, a simple two-way value, and repeated processing; predict the output of one short mixed-control-flow example.
   - **Milestone exercise `m3-l6-ex1` — Rule-Based Number Search:**
     ```javascript
     const targetNumber = 5;

     for (let guess = 1; guess <= 6; guess++) {
       // Skip guess 3.
       // Report guesses below the target.
       // Report the target and stop searching when it is found.
     }
     ```
     - **Expected output:** Exactly four lines: `1: too low`, `2: too low`, `4: too low`, `Found 5`.
     - **Evaluation:** Require successful execution and exact ordered output. This deterministic simulation demonstrates a repeated search with a skip rule, ordered comparisons, and early termination; it does not claim to implement user input or a randomized game.
     - **Progressive hints:** Tier 1 identifies the loop, skip condition, ordered `if`/`else if` cases, and stopping point; Tier 2 supplies the complete solution.
     - **Completion rule:** Passing `m3-l6-ex1` marks `m3-l6` complete and achieves the Module 3 milestone.

**Milestone: Build a deterministic number-search or rule-based program using conditions and repetition.**
- **Criteria for Module 3 mastery:**
  1. Predict truthy/falsy behavior for the taught primitive values, including non-empty strings that look false.
  2. Write an ordered `if`/`else if`/`else` chain with reachable branches.
  3. Use `switch` cases, `break`, and `default`, and select a ternary only for a simple two-way value.
  4. Trace and write finite `for` and `while` loops.
  5. Apply `continue` and `break` to skip and stop loop iterations.
  6. Choose and combine control structures to implement a deterministic rule-based task.

### Module 4 — Functions
1. **Function Declarations and Expressions** (20 min, prereq: `m3-l6`)
   - **Objectives:** Define and call a function declaration; define and call a function expression; distinguish defining a function from invoking it.
   - **Instructional focus:** Compare the two declaration forms while keeping examples synchronous and small. Explain that a function body runs when called, not when it is defined. Avoid hoisting details beyond the distinction necessary for the examples.
   - **Common mistake:** Defining a function does not call it; learners may omit the call expression or confuse the function name with a call.
   - **Comprehension check:** Identify which lines define versus call a function and predict the order of two calls.
   - **Exercise `m4-l1-ex1` — Two Ways to Define a Function:**
     ```javascript
     function showWelcome() {
       console.log("Welcome");
     }

     const showReminder = function () {
       console.log("Practice functions");
     };

     // Call both functions.
     ```
     - **Expected output:** Exactly two lines: `Welcome`, `Practice functions`.
     - **Evaluation:** Require successful execution and exact ordered output; explain missing calls or output mismatches without relying on engine-specific errors.
     - **Progressive hints:** Tier 1 points to the function names after each definition; Tier 2 shows the two call expressions.
     - **Completion rule:** Passing `m4-l1-ex1` marks `m4-l1` complete.

2. **Parameters, Arguments, and Return Values** (20 min, prereq: `m4-l1`)
   - **Objectives:** Distinguish a parameter in a function definition from an argument supplied at a call; return a computed value; distinguish returning a value from printing it.
   - **Instructional focus:** Use one input and one returned result before showing multiple parameters. The caller decides what to do with a return value. Do not treat `console.log()` as a substitute for `return`.
   - **Common mistake:** Logging inside the function instead of returning a value leaves the caller without the computed result.
   - **Comprehension check:** Predict the returned value for supplied arguments and identify which names are parameters versus arguments.
   - **Exercise `m4-l2-ex1` — Return a Total:**
     ```javascript
     function addServiceFee(amount, fee) {
       // Return the amount plus the fee.
     }

     const total = addServiceFee(20, 4);
     console.log(total);
     ```
     - **Expected output:** Exactly one line: `24`.
     - **Evaluation:** Require successful execution and the expected value to be returned and printed by the caller. A function that only logs internally must not pass.
     - **Progressive hints:** Tier 1 identifies `amount` and `fee` as parameters and `20` and `4` as arguments; Tier 2 shows `return amount + fee;`.
     - **Completion rule:** Passing `m4-l2-ex1` marks `m4-l2` complete.

3. **Arrow Functions** (15 min, prereq: `m4-l2`)
   - **Objectives:** Write an arrow function expression; pass an argument to it; return a value using an expression body and recognize a block body with an explicit `return`.
   - **Instructional focus:** Present arrow functions as another way to write functions, not as a new kind of execution or a required replacement for declarations. Limit examples to ordinary parameters and return values; defer `this` behavior.
   - **Common mistake:** A block-bodied arrow function does not implicitly return its final expression; it needs an explicit `return`.
   - **Comprehension check:** Match a short function expression to its arrow form and predict its returned value.
   - **Exercise `m4-l3-ex1` — Make a Greeting:**
     ```javascript
     const makeGreeting = (name) => {
       // Return "Hello, " followed by name.
     };

     console.log(makeGreeting("Sam"));
     ```
     - **Expected output:** Exactly one line: `Hello, Sam`.
     - **Evaluation:** Require successful execution and exact output. Feedback distinguishes a missing return from an incorrect greeting.
     - **Progressive hints:** Tier 1 points to the returned string expression; Tier 2 shows `return "Hello, " + name;`.
     - **Completion rule:** Passing `m4-l3-ex1` marks `m4-l3` complete.

4. **Scope and Lexical Scope** (20 min, prereq: `m4-l3`)
   - **Objectives:** Identify a function-local binding; explain that an inner function can access a binding in its enclosing lexical scope; distinguish a variable's scope from the order in which functions are called.
   - **Instructional focus:** Use a small outer binding and a function-local binding. Explain lexical lookup using where functions are written. Avoid `this`, modules, block-scope edge cases, and closure state as a main topic; closures follow in `m4-l6`.
   - **Common mistake:** A function-local name is not available outside its function, and lexical lookup follows where code is written rather than where it is called.
   - **Comprehension check:** Trace which identifiers are available inside a function and identify why an unrelated local name is not available outside its function.
   - **Exercise `m4-l4-ex1` — Read from an Enclosing Scope:**
     ```javascript
     const courseName = "JavaScript";

     function makeMessage() {
       const audience = "learner";
       // Return audience, followed by ": ", followed by courseName.
     }

     console.log(makeMessage());
     ```
     - **Expected output:** Exactly one line: `learner: JavaScript`.
     - **Evaluation:** Require successful execution and exact output, demonstrating access to both the local binding and the lexically enclosing binding.
     - **Progressive hints:** Tier 1 asks which name is local and which is in the enclosing scope; Tier 2 shows the return expression.
     - **Completion rule:** Passing `m4-l4-ex1` marks `m4-l4` complete.

5. **Callbacks and Higher-Order Functions** (25 min, prereq: `m4-l4`)
   - **Objectives:** Pass a function as an argument without calling it at the call site; write a higher-order function that accepts and invokes a callback; explain that this lesson's callback is synchronous.
   - **Instructional focus:** Introduce the minimal first-class-function idea needed here: a function can be passed as a value. Use the term callback for a function supplied to another function and called by it. Do not introduce arrays, array methods, timers, events, promises, or asynchronous callbacks; those belong to later modules.
   - **Common mistake:** Passing `addBonus(score)` calls the function immediately; the callback parameter needs the function value `addBonus`.
   - **Comprehension check:** Trace when the callback runs and distinguish passing `addBonus` from passing the result of `addBonus(...)`.
   - **Exercise `m4-l5-ex1` — Apply a Score Callback:**
     ```javascript
     function addBonus(score) {
       return score + 5;
     }

     function applyToScore(score, callback) {
       // Return the result of calling callback with score.
     }

     console.log(applyToScore(10, addBonus));
     ```
     - **Expected output:** Exactly one line: `15`.
     - **Evaluation:** Require successful execution and exact output; feedback points to passing the function itself and invoking the callback inside `applyToScore`.
     - **Progressive hints:** Tier 1 traces `score` and `callback` through the call; Tier 2 shows `return callback(score);`.
     - **Completion rule:** Passing `m4-l5-ex1` marks `m4-l5` complete.

6. **Closures** (25 min, prereq: `m4-l5`)
   - **Objectives:** Explain that an inner function retains access to bindings from its lexical environment after the outer function returns; create a closure with private state; distinguish state held by two separately created closures.
   - **Instructional focus:** Build on lexical scope and callbacks, but introduce closure state with a single local counter. Clarify that the returned inner function keeps access to `count`; avoid object-based APIs and the `this` keyword.
   - **Common mistake:** The outer function returning does not erase the captured binding, while separately created closures do not share their local counter.
   - **Comprehension check:** Predict successive calls to one returned function and the first call to a separately created function.
   - **Exercise `m4-l6-ex1` — Create Independent Counters:**
     ```javascript
     function createCounter() {
       let count = 0;
       return function () {
         // Increase count and return it.
       };
     }

     const firstCounter = createCounter();
     console.log(firstCounter());
     console.log(firstCounter());

     const secondCounter = createCounter();
     console.log(secondCounter());
     ```
     - **Expected output:** Exactly three lines: `1`, `2`, `1`.
     - **Evaluation:** Require successful execution and exact ordered output, demonstrating retained state and independent closure instances.
     - **Progressive hints:** Tier 1 identifies the captured binding that must persist; Tier 2 shows `count++;` and `return count;`.
     - **Completion rule:** Passing `m4-l6-ex1` marks `m4-l6` complete.

7. **Recursion and Common Debugging Patterns** (20 min, prereq: `m4-l6`)
   - **Objectives:** Identify a recursive function's base case and recursive case; trace a small call sequence; make progress toward the base case; diagnose missing base cases and non-progressing recursive calls.
   - **Instructional focus:** Use only a small, bounded numeric example. Explain that each call uses the existing call stack and that missing or unreachable base cases can exhaust it. The Worker timeout is a safeguard, not a substitute for a correct base case. Do not teach recursive data structures or use arrays/objects.
   - **Common mistake:** A recursive call must move toward a reachable base case; omitting the base case or repeating the same argument prevents normal completion.
   - **Comprehension check:** Trace the base case and successive arguments in a recursive total; identify which change makes a recursive call approach its stopping condition.
   - **Milestone exercise `m4-l7-ex1` — Build a Reusable Recursive Summary:**
     ```javascript
     function sumSteps(steps) {
       // Return 0 when steps reaches 0.
       // Otherwise return steps plus sumSteps(steps - 1).
     }

     function formatTotal(total) {
       // Return "Total: " followed by total.
     }

     function createSummary(steps, formatter) {
       // Return formatter(sumSteps(steps)).
     }

     console.log(createSummary(3, formatTotal));
     ```
     - **Expected output:** Exactly one line: `Total: 6`.
     - **Evaluation:** Require successful execution and exact output; the exercise combines a bounded recursive calculation with reusable functions and a synchronous callback. The validator checks observable behavior and does not claim to prove which syntax produced it.
     - **Progressive hints:** Tier 1 identifies the base case, decreasing recursive argument, formatter return, and callback call; Tier 2 supplies the three return expressions.
     - **Completion rule:** Passing `m4-l7-ex1` marks `m4-l7` complete and achieves the Module 4 milestone.

**Milestone: Break a multi-step problem into reusable functions.**
- **Criteria for Module 4 mastery:**
  1. Define and invoke declarations and expressions; distinguish definition from invocation.
  2. Use parameters, arguments, and return values to compose a small computation.
  3. Write an arrow function and identify its returned value.
  4. Explain local and lexical scope.
  5. Pass and invoke a synchronous callback.
  6. Explain and use a closure to retain independent state.
  7. Trace a bounded recursive function with a base case and progressing recursive case.

**Phase 10 planning decision — course-wide progress:** The course-wide progress indicator uses the canonical curriculum total: **64 lessons**, including future lessons whose content is not yet implemented. The denominator is derived from the curriculum data, not maintained as a separate constant. Preserve the existing localStorage representation of completed lesson IDs. For Module 4, progress is `16/64` before the module and `23/64` after all seven lessons are completed; do not invent an eighth lesson for the remaining slot in the former `/24` target. Navigation continues from `m3-l6` into `m4-l1`, then from `m4-l7` to the existing `m5-l1` placeholder. Earlier phases recorded `/24` behavior; this decision supersedes that display denominator going forward without changing those historical test reports.

### Module 5 — Arrays and objects

**Implementation status:** Implemented in Phase 11 using the eight canonical lesson IDs, titles, order, durations, and prerequisites in `app/src/curriculum.js`.

The module builds from indexed arrays through iteration and transformation, then introduces objects, methods, copying, and collections of objects. It uses only synchronous pure JavaScript in the existing Web Worker. It does not introduce browser APIs, asynchronous behavior, or classes.

1. **Creating and Accessing Arrays** (`m5-l1`, 20 min; prereq: `m4-l7`)
   - **Objectives:** Create an array literal; read values by zero-based index; use `length` to find the final valid index and array size.
   - **Prerequisites and sequence:** Variables, strings, numbers, and functions from Modules 1–4. Establishes arrays as ordered collections before iteration.
   - **Instruction and worked example:** Array literals with `[]`; indexes begin at zero; `items[0]`, `items[items.length - 1]`, and `items.length`. Contrast a valid last index with the out-of-range value `undefined`.
   - **Comprehension check:** For `["Museum", "Library", "Park"]`, predict index `0`, index `2`, and `length`.
   - **Exercise `m5-l1-ex1` — Read an Array of Stops:**
     ```javascript
     const stops = []; // Add "Museum", "Library", and "Park" in order.
     const firstStop = stops[/* first index */];
     const lastStop = stops[/* final index */];
     console.log(firstStop);
     console.log(lastStop);
     console.log(stops.length);
     ```
     **Expected output:** `Museum`, `Park`, `3` on separate lines.
   - **Validation and feedback:** Require runner status `success` and exactly those ordered lines. On mismatch, remind the learner that indexes start at zero and the last index is `length - 1`; syntax/reference/type errors use the shared validator's applicable guidance, and ambiguous TypeErrors use its generic fallback.
   - **Progressive hints:** (1) First create the array with the three stop names in order; the first element is at index zero; (2) use `stops[stops.length - 1]` for the final element.
   - **Common misconception:** `length` is a count, not the last index; an index equal to `length` is out of range.
   - **Assessment tests:** Metadata/prerequisite, example and check coverage, exact success output, missing/extra/reordered output, runner errors, and timeout feedback.

2. **Iteration and Array Methods** (`m5-l2`, 20 min; prereq: `m5-l1`)
   - **Objectives:** Visit every item with `for...of`; build a result array with `push`; query membership with `includes`.
   - **Prerequisites and sequence:** Array literals, indexed reads, `length`, and Module 3 loops. Prepares learners to apply the callback-based transformation methods in `m5-l3`.
   - **Instruction and worked example:** Trace each value in a `for...of` loop; append values to a separate array using `push`; test membership with `includes`. Explicitly distinguish a loop's repeated body from a method's return value.
   - **Comprehension check:** Trace the result array after pushing twice and predict `includes(8)`.
   - **Exercise `m5-l2-ex1` — Collect Doubled Readings:**
     ```javascript
     const readings = [2, 4, 1];
     const doubled = [];
     for (const reading of readings) {
       // Add twice the current reading to doubled.
     }
     console.log(doubled[0]);
     console.log(doubled[1]);
     console.log(doubled[2]);
     console.log(doubled.length);
     console.log(doubled.includes(8));
     ```
     **Expected output:** `4`, `8`, `2`, `3`, `true` on separate lines.
   - **Validation and feedback:** Require successful execution and the exact ordered output. Mismatch feedback points to visiting each input once and pushing the computed value; do not claim output-only validation proves `for...of` or a particular method was used.
   - **Progressive hints:** (1) The loop variable is one reading at a time; (2) push `reading * 2` into `doubled`.
   - **Common misconception:** `push` appends to the array; it does not replace the array with the pushed value. Do not remove items from the array being traversed.
   - **Assessment tests:** Exercise metadata, all three concepts in the instructional sections, ordered output, empty/missing/extra results, and execution failures/timeouts.

3. **`map`, `filter`, `find`, and `reduce`** (`m5-l3`, 30 min; prereq: `m5-l2`)
   - **Objectives:** Explain that each method calls a synchronous callback; use `map` to produce one result per input, `filter` to keep matching values, `find` to return the first match, and `reduce` with an initial accumulator to compute a summary.
   - **Prerequisites and sequence:** Arrays, `for...of`, functions, parameters/returns, and synchronous callbacks. The four methods prepare learners to transform object collections in `m5-l8`.
   - **Instruction and worked example:** Contrast the return behavior of all four methods using a small score list. Trace callback inputs; show `find` returning `undefined` if nothing matches; include an explicit initial value in `reduce`.
   - **Comprehension check:** Given `[3, 7, 5, 9]`, predict the mapped values for doubling, the filtered passing values, the first match at least 6, and the total.
   - **Exercise `m5-l3-ex1` — Transform and Summarize Scores:**
     ```javascript
     const scores = [3, 7, 5, 9];
     const doubled = scores.map((score) => {
       // Return twice this score.
     });
     const passing = scores.filter((score) => {
       // Keep scores at least 6.
     });
     const firstPassing = scores.find((score) => {
       // Find the first score at least 6.
     });
     const total = scores.reduce((sum, score) => {
       // Return the updated total.
     }, 0);
     for (const score of doubled) console.log(score);
     console.log(`Passing: ${passing.length}`);
     console.log(`First: ${firstPassing}`);
     console.log(`Total: ${total}`);
     ```
     **Expected output:** `6`, `14`, `10`, `18`, `Passing: 2`, `First: 7`, `Total: 24`, each on its own line.
   - **Validation and feedback:** Require successful execution and all seven exact ordered lines. Actionable mismatch feedback names the distinction between transform, keep, first match, and accumulation. Output validation does not assert the source uses all four methods; comprehension checks assess method selection.
   - **Progressive hints:** (1) Each callback receives one score; think about whether its method needs a transformed value, a true/false decision, a first matching value, or a running total; (2) use `score => score * 2`, `score => score >= 6`, and `score => score >= 6`, then add `score` to `sum` in `reduce`.
   - **Common misconceptions:** `map` should return from its callback; `filter` keeps items based on truthiness; `find` stops at the first match; `reduce` carries an accumulator and benefits from an explicit starting value.
   - **Assessment tests:** Assert each method's example/check and exact combined output, plus missing/extra/wrong output and error/timeout feedback. Avoid asserting engine-specific TypeError strings.

4. **Creating and Updating Objects** (`m5-l4`, 20 min; prereq: `m5-l3`)
   - **Objectives:** Create an object literal with named properties; read properties with dot and bracket notation; update or add a property.
   - **Prerequisites and sequence:** Arrays, callbacks, variables, and expressions. Introduces key/value records before object methods and collections of objects.
   - **Instruction and worked example:** Object literals; property names and values; dot notation for known names and brackets for a key stored in a variable; assignment updates a property.
   - **Comprehension check:** Predict the value after updating `book.copies`, and choose bracket notation when the property key is stored in `key`.
   - **Exercise `m5-l4-ex1` — Update a Book Record:**
     ```javascript
     const book = {}; // Add title "River" and copies 2.
     const key = "copies";
     // Increase the copies property using key.
     // Add a shelf property with the value "A3".
     console.log(book.title);
     console.log(book.copies);
     console.log(book.shelf);
     ```
     **Expected output:** `River`, `3`, `A3` on separate lines.
   - **Validation and feedback:** Require successful execution and the exact ordered output; mismatches point to the property key/value and assignment. Do not claim output proves the learner chose bracket rather than dot notation.
   - **Progressive hints:** (1) `key` contains the property name as a string; (2) assign `book[key] = book[key] + 1`, then assign `book.shelf = "A3"`.
   - **Common misconception:** Bracket notation uses an evaluated key; `book.key` is a different property from `book[key]`.
   - **Assessment tests:** Object content and examples, exact output, missing/extra/wrong output, and runner failures.

5. **Methods and the `this` Keyword** (`m5-l5`, 25 min; prereq: `m5-l4`)
   - **Objectives:** Define a method on an object; use `this` in a method to read and update that object's properties; call the method through its object.
   - **Prerequisites and sequence:** Object properties, functions, parameters, and returns. Prepares learners to use methods in structured records; limit examples to direct method calls on their owning object.
   - **Instruction and worked example:** Method shorthand, `this.property`, and how `this` refers to the receiver in `object.method()`. Avoid detached methods, constructors, classes, and prototype details.
   - **Comprehension check:** Trace `counter.increase(3)` when `counter.value` starts at 2; predict both the returned value and updated property.
   - **Exercise `m5-l5-ex1` — Increase an Object's Counter:**
     ```javascript
     const counter = {
       label: "Count",
       value: 2,
       increase(amount) {
         // Update this.value and return the new value.
       },
     };
     console.log(counter.increase(3));
     console.log(counter.value);
     ```
     **Expected output:** `5`, `5` on separate lines.
   - **Validation and feedback:** Require successful execution and exact ordered output. Feedback points to `this.value`, the `amount` argument, and returning the updated value; generic TypeError guidance remains the fallback for ambiguous browser errors.
   - **Progressive hints:** (1) Inside this direct method call, `this` refers to `counter`; (2) add `amount` to `this.value`, then `return this.value`.
   - **Common misconception:** `this.value` is a property on the receiver, not a local variable named `value`; calling the method through the object supplies the intended receiver.
   - **Assessment tests:** Verify metadata, direct-call example/check, returned and stored values, wrong/missing/extra output, errors, and timeout.

6. **Destructuring, Spread, and Rest Syntax** (`m5-l6`, 20 min; prereq: `m5-l5`)
   - **Objectives:** Destructure array and object properties into bindings; use rest to collect remaining array elements, object properties, or function arguments; use array/object spread to create a shallow combined copy or override selected properties.
   - **Prerequisites and sequence:** Arrays, objects, functions, and `this` method syntax. Prepares learners to reason about aliasing and shallow copies in `m5-l7`.
   - **Instruction and worked example:** Array and object destructuring; rest uses `...` to collect the remaining values; spread uses `...` to expand values. Contrast array rest, object rest, and rest parameters with spread in arrays/objects.
   - **Comprehension check:** Predict the first item and rest array from `[4, 7, 9]`, and the result of `{ ...player, level: 3 }`.
   - **Exercise `m5-l6-ex1` — Unpack and Extend Data:**
     ```javascript
     const dimensions = [4, 7, 9];
     let width = 0;
     let remaining = [];
     // Destructure dimensions into width and remaining.
     const resized = [remaining, 12];
     const player = { name: "Mira", level: 2 };
     let name = "";
     let stats = {};
     // Destructure player into name and stats.
     const upgraded = { ...player, level: 2 };
     function countItems(first, others = []) {
       return 1 + others.length;
     }
     console.log(width);
     console.log(resized[2]);
     console.log(name);
     console.log(stats.level);
     console.log(upgraded.level);
     console.log(countItems("pen", "book", "lamp"));
     ```
     **Expected output:** `4`, `12`, `Mira`, `2`, `3`, `3` on separate lines.
   - **Validation and feedback:** Require successful execution and exactly the six ordered values; feedback clarifies destructuring/rest collection versus spread expansion. The starter leaves array/object destructuring and array spread incomplete and uses an ordinary second parameter; learners edit these forms to produce the result. Output-only validation still does not prove which syntax was used.
   - **Progressive hints:** (1) Rest collects the values/properties not named earlier; spread expands an existing array/object into a new one; (2) assign `[width, ...remaining]` and `({ name, ...stats })`, expand with `[...remaining, 12]`, set the updated level to 3, and change the function parameter to `...others`.
   - **Common misconception:** Rest and spread share syntax but differ by context; object/array spread creates only a shallow copy.
   - **Assessment tests:** Verify lesson sections distinguish all syntax forms and test the exact outputs, runner failures, and timeout feedback.

7. **References, Mutation, and Copying** (`m5-l7`, 25 min; prereq: `m5-l6`)
   - **Objectives:** Explain that primitive values copied into a new binding are independent, while object/array variables can share references; predict how aliases observe mutation; distinguish mutation from rebinding; make a shallow copy and explain which nested references remain shared.
   - **Prerequisites and sequence:** Arrays, object properties, `const`/`let`, spread, and Module 2's binding/value distinction. Prepares learners to transform object records without accidental source mutation in `m5-l8`.
   - **Instruction and worked example:** Assigning one object reference to another variable; mutating a shared object; creating a shallow top-level copy with spread; nested arrays/objects remain shared references. Clarify that `const` prevents rebinding, not mutation.
   - **Comprehension check:** Predict which top-level names change for an alias and a spread copy, and whether both copies still reference the same nested `tags` array.
   - **Exercise `m5-l7-ex1` — Trace an Alias and a Shallow Copy:**
     ```javascript
     let points = 4;
     const copiedPoints = points;
     points = 9;
     console.log(copiedPoints);
     console.log(points);
     const original = { title: "Draft", tags: ["js"] };
     const alias = original;
     const copy = { ...original };
     // Change original.title to "Published".
     // Add "arrays" to the shared tags array.
     // Change copy.title to "My copy".
     console.log(alias.title);
     console.log(original.title);
     console.log(copy.title);
     console.log(copy.tags[1]);
     ```
     **Expected output:** `4`, `9`, `Published`, `Published`, `My copy`, `arrays` on separate lines.
   - **Validation and feedback:** Require successful execution and exact output. Mismatch feedback focuses on independent primitive bindings, aliasing versus top-level copying, and the shared nested reference.
   - **Progressive hints:** (1) Reassigning `points` does not change `copiedPoints`; `alias` and `original` refer to the same object; (2) the `tags` array itself is still shared, so the `push` is visible through `copy.tags`.
   - **Common misconception:** `{ ...original }` is a shallow copy, not a recursive deep copy; `const` does not freeze properties or nested arrays.
   - **Assessment tests:** Assert the exact alias/copy/nested-mutation output, feedback on mismatch, and generic handling of runtime errors/timeouts.

8. **Transforming Collections of Objects** (`m5-l8`, 25 min; prereq: `m5-l7`)
   - **Objectives:** Read fields from objects in an array; use `filter`, `map`, and `reduce` callbacks to derive a new list and aggregate values; produce a deterministic report without mutating the source records.
   - **Prerequisites and sequence:** All prior Module 5 lessons, especially object properties, array transformations, and reference/copy behavior. The final exercise is the module milestone and prepares for later browser and application modules.
   - **Instruction and worked example:** A small inventory of object records; filter out unavailable records; map available records to labels; reduce records to unit/value totals; iterate over labels to print a report. Show that derived results need not mutate source data.
   - **Comprehension check:** Trace the in-stock records and calculate unit and value totals; identify the callback input and result of each transformation.
   - **Milestone exercise `m5-l8-ex1` — Build an Inventory Summary:**
     ```javascript
     const inventory = [
       { name: "Notebook", price: 3, quantity: 2 },
       { name: "Pen", price: 1, quantity: 3 },
       { name: "Marker", price: 2, quantity: 0 },
     ];
     const available = inventory.filter((item) => {
       // Keep items with stock.
     });
     const labels = available.map((item) => {
       // Return "Name: quantity".
     });
     const units = available.reduce((total, item) => {
       // Add this item's quantity.
     }, 0);
     const value = available.reduce((total, item) => {
       // Add this item's price times quantity.
     }, 0);
     for (const label of labels) console.log(label);
     console.log(`Units: ${units}`);
     console.log(`Value: ${value}`);
     ```
     **Expected output:** `Notebook: 2`, `Pen: 3`, `Units: 5`, `Value: 9` on separate lines.
   - **Validation and feedback:** Require successful execution and exactly the four ordered lines. Mismatch feedback guides learners to filter, map, accumulate quantity/value, and omit the zero-stock item. Do not claim output checks enforce method choice or non-mutation; the comprehension check and demonstrated code review cover those concepts.
   - **Progressive hints:** (1) Filter records by `quantity > 0`, then map each retained record to its label; (2) use two `reduce` calls with initial `0`, adding `quantity` and `price * quantity`; loop over labels to print each one.
   - **Common misconception:** A callback receives one object at a time; `filter` returns records while `map` returns labels; `reduce` needs a running total; changing records in place is unnecessary for this report.
   - **Assessment tests:** Verify the milestone's deterministic exact output, errors/timeouts, expected success/failure feedback, and correct next-lesson metadata.

**Milestone:** Build a small data-processing application by reporting available inventory from a fixed array of object records. `m5-l8-ex1` filters records with stock, maps them to labels, reduces them to total units and value, and prints `Notebook: 2`, `Pen: 3`, `Units: 5`, `Value: 9`. The inputs and execution are fixed and bounded; no input prompt, randomness, DOM, network, or asynchronous operation is required.

**Module-wide constraints:** Implement exactly these eight canonical lessons. Keep `map`/`filter`/`find`/`reduce` callbacks synchronous and pure-JavaScript; use the existing Worker boundary. Do not add classes, DOM APIs, asynchronous APIs, or concepts assigned to later modules. Automated output validators test observable behavior and cannot prove a particular implementation strategy.

**Phase 11 planning note — progress and navigation:** The existing denominator remains derived from all 64 canonical lessons. With all 23 lessons in Modules 1–4 complete, Module 5 begins at `23/64` and completing its eight lessons yields `31/64`. Preserve completed lesson IDs and storage format. Navigation follows the curriculum from `m4-l7` to `m5-l1` and from `m5-l8` to the `m6-l1` placeholder. Update the placeholder copy to **Modules 1–5 (Lessons 1–31)** when implementation is approved.

### Module 6 — JavaScript in the browser
**Phase 12 implementation status:** The canonical titles, IDs, estimated durations, and prerequisites below are implemented in `app/src/curriculum.js`. Module 6 objective metadata, exercises, and assessments follow the approved curriculum. DOM lessons use the approved bounded Worker-backed model, not native DOM execution; the ADR is approved and implemented as documented in `architecture-spec.md` §5.8.

The module contains seven lessons (155 minutes total). Preserve the canonical sequence and prerequisites.

| Lesson | Objectives and assessment | Exercise, expected result, feedback, and hints | Environment and progression |
|---|---|---|---|
| `m6-l1` The Relationship Between JavaScript, HTML, and CSS (20 min; `m5-l8`) | Explain HTML as structure, CSS as presentation, and JavaScript as behavior; identify how the three cooperate in a browser page. Predict the labels for a small page scenario. | `m6-l1-ex1`, **Label the Page Roles**: complete a supplied object mapping `html`, `css`, and `javascript` to `structure`, `presentation`, and `behavior`; print `HTML: structure`, `CSS: presentation`, `JavaScript: behavior`. Validator requires successful Worker execution and the three ordered lines. Feedback distinguishes the three responsibilities. Hints first point to page structure/style/behavior, then give the three mapping values. Misconception: JavaScript does not replace HTML or CSS. | Existing Web Worker; this exercise does not access DOM globals. Prepares learners to inspect a real document in `m6-l2`. |
| `m6-l2` DOM Selection and Manipulation (25 min; `m6-l1`) | Explain that the DOM represents a document as nodes; select an element with `querySelector`; read/update `textContent`; create and append an element. | `m6-l2-ex1`, **Update a Document Preview**: use a fixed controlled-model fixture containing `#status` and a list `#items` with one item. Set status to `JavaScript updated`, append an `li` with `Practice DOM`, and log `JavaScript updated` and `2`. Validator checks successful DOM-mode completion and logs; real-browser integration inspects the host-rendered preview state. Feedback names the selector, `textContent`, and append operation. Hints identify the selectors, then show `createElement("li")` and `append`. Misconception: changing a JavaScript variable alone does not change a node in the modeled document. | Separate DOM-mode Worker with the bounded facade and trusted host renderer; it does not expose native DOM nodes. Prepares the selected button and event target used in `m6-l3`. |
| `m6-l3` Event Listeners and Event Objects (25 min; `m6-l2`) | Register a click listener with `addEventListener`; update page state in response to user action; use an event object's `target` to identify the activated control. | `m6-l3-ex1`, **Count Button Activations**: the controlled fixture has an accessible host-rendered button and count. Register a listener that increments the count and logs the target label. After two real clicks on the preview control, expected observations are `Clicked: Add one` twice and `Count: 2`; browser integration verifies event exchange and rendered model state, not merely output. Feedback distinguishes registering a callback from calling it immediately. Hints explain the event parameter, then the increment/update sequence. Misconception: an event listener callback runs when the event occurs, not when it is registered. | Separate DOM-mode Worker and validated host event bridge. This models a small event subset, not native bubbling/propagation. Prepares form submit events in `m6-l4`. |
| `m6-l4` Form Input and Validation (25 min; `m6-l3`) | Read a labeled input's value; handle form submission and prevent modeled default submission; trim/validate empty input; display accessible feedback. | `m6-l4-ex1`, **Build an Accessible To-Do List** (the DOM milestone/capstone, not completion of Module 6): submit blank input to show `Enter a task.`; submit `Review DOM` to append one task, clear/refocus input, and announce `Added: Review DOM.`; toggle a task by keyboard and update the completion count. Browser integration checks host-rendered keyboard/mouse submission, error/success feedback, focus, checkbox state, and model state. Hints point to modeled `preventDefault()`/`.value.trim()`, then creation and append. Misconception: a placeholder is not a label; this controlled model's submit behavior is not a complete native form implementation. | Separate DOM-mode Worker and host-rendered accessible preview; prepares separate-file concepts in `m6-l5`. Module completion remains after `m6-l7`. |
| `m6-l5` Modules and Imports/Exports (20 min; `m6-l4`) | Identify named exports and imports; match imported names to their exported binding; explain that module paths identify a separate source file. Do not introduce promises or asynchronous loading. | `m6-l5-ex1`, **Match a Named Export**: accessible no-execution knowledge check presents `helpers.js` with `export function double(value) { return value * 2; }` and a consumer file. Learner selects the matching `import { double } from "./helpers.js";` and predicts `8` for `double(4)`. Completion requires the correct answer; retry is allowed. Feedback explains braces/name matching and relative paths. Hints distinguish the exported name from the file path. Misconception: importing a function does not call it, and named imports must match the exported name. | No learner-code execution. The check demonstrates syntax recognition, export/import name matching, path recognition, and output prediction only; it does not demonstrate actual multi-file execution or module loading. Uses a new keyboard-accessible knowledge-check exercise type because the current single-source `new Function()` runner cannot parse static `import`/`export`. |
| `m6-l6` Error Handling with `try` and `catch` (20 min; `m6-l5`) | Throw an `Error` for an invalid condition; catch a thrown error; read `error.message`; distinguish handled exceptions from uncaught runner failures. | `m6-l6-ex1`, **Handle an Invalid Name**: complete a synchronous function that throws `new Error("Name is required")` for blank input and call it in `try`/`catch`; expected output `Handled: Name is required`. Validator requires Worker success and the exact line; syntax/runtime feedback is actionable and does not depend on engine-specific wording. Hints first locate the throwing condition and catch block, then show reading `error.message`. Misconception: `catch` handles only errors thrown in its associated `try` execution. | Existing Web Worker; no DOM or asynchronous code. Prepares defensive browser code and debugging in `m6-l7`. |
| `m6-l7` Browser Debugging Tools (20 min; `m6-l6`) | Select an appropriate browser DevTools panel; use a breakpoint/step and inspect a variable; distinguish a syntax/runtime error from a logic error. | `m6-l7-ex1`, **Choose a Debugging Step**: no-execution knowledge check shows a bounded array-sum loop with an off-by-one condition and a `NaN` result; learner chooses the loop condition as the bug and identifies a breakpoint/Watch value that would expose it. Correct choices complete the exercise; feedback links the symptom to the index and array length. Misconception: a successful run is not proof of correct logic, and the platform console is not an interactive DevTools debugger. | No learner-code execution. This assesses conceptual DevTools knowledge only; it does not debug learner code inside the Worker or expose the browser's DevTools to the lesson. Uses the same accessible knowledge-check component as `m6-l5`; completion of this lesson completes Module 6. |

#### Implemented fixtures and exercise source

The DOM fixture is a bounded virtual tree owned by the dedicated DOM Worker. The host renders validated state with trusted DOM APIs; no iframe or learner-provided markup is used. The learner editor contains JavaScript, and comments identify the learner's task.

**`m6-l1-ex1` (Worker):**

```javascript
const roles = {
  html: "structure",
  css: "presentation",
  javascript: "",
};
console.log(`HTML: ${roles.html}`);
console.log(`CSS: ${roles.css}`);
console.log(`JavaScript: ${roles.javascript}`);
```

Complete `javascript` with `"behavior"`. Expected output is exactly `HTML: structure`, `CSS: presentation`, `JavaScript: behavior`, one per line.

**`m6-l2-ex1` controlled DOM-model fixture and starter (DOM-mode Worker):**

```html
<h2 id="status">Ready</h2>
<ul id="items"><li>Read guide</li></ul>
```

```javascript
const status = document.querySelector("#status");
const items = document.querySelector("#items");
status.textContent = "JavaScript updated";
const item = document.createElement("li");
item.textContent = "Practice DOM";
// Append the new item and inspect the resulting state.
console.log(status.textContent);
console.log(items.children.length);
```

Complete the append. Expected console lines are `JavaScript updated` and `2`; browser assertions also require the second list item's text to be `Practice DOM`.

**`m6-l3-ex1` controlled DOM-model fixture and starter (DOM-mode Worker):**

```html
<button id="increment" type="button">Add one</button>
<p>Count: <output id="count" aria-live="polite">0</output></p>
```

```javascript
const button = document.querySelector("#increment");
const countOutput = document.querySelector("#count");
let count = 0;
button.addEventListener("click", (event) => {
  // Increment count and update countOutput.
  console.log(`Clicked: ${event.target.textContent}`);
  console.log(`Count: ${count}`);
});
```

After two real clicks, expected output order is `Clicked: Add one`, `Count: 1`, `Clicked: Add one`, `Count: 2`, and the output element contains `2`. The listener is not invoked during registration.

**`m6-l4-ex1` controlled DOM-model fixture and starter (DOM-mode Worker, DOM milestone):**

```html
<form id="task-form">
  <label for="task-input">New task</label>
  <input id="task-input" name="task" type="text">
  <button type="submit">Add task</button>
</form>
<p id="task-status" role="status" aria-live="polite"></p>
<p id="task-count" aria-live="polite">0 of 2 completed</p>
<ul id="task-list">
  <li><label><input type="checkbox"> Read guide</label></li>
  <li><label><input type="checkbox"> Practice events</label></li>
</ul>
```

```javascript
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const status = document.querySelector("#task-status");
const count = document.querySelector("#task-count");
const list = document.querySelector("#task-list");

function updateCount() {
  const completed = list.querySelectorAll("input:checked").length;
  count.textContent = `${completed} of ${list.children.length} completed`;
}

form.addEventListener("submit", (event) => {
  // Prevent navigation, trim and validate the value, then append one labeled checkbox task.
  // Clear/refocus the input and announce success or the validation message.
});
```

Browser tests assert the milestone state criteria below. Hints sequence from preventing the default submit and validating `.value.trim()` to creating a labeled checkbox and appending an `li`; a checkbox `change` listener calls `updateCount()`.

**`m6-l5-ex1` no-execution knowledge check:**

```javascript
// helpers.js
export function double(value) {
  return value * 2;
}

// app.js
import { double } from "./helpers.js";
console.log(double(4));
```

Learner selects the matching named import and predicts `8`. Both choices must be correct to complete; feedback covers export/import name matching and that importing does not itself call the function.

**`m6-l6-ex1` (Worker):**

```javascript
function getGreeting(name) {
  if (name.trim() === "") {
    // Throw an Error with the message "Name is required".
  }
  return `Hello, ${name}`;
}

try {
  console.log(getGreeting(" "));
} catch (error) {
  console.log(`Handled: ${error.message}`);
}
```

Expected output is exactly `Handled: Name is required`. The validator requires successful Worker completion; an uncaught error does not pass.

**`m6-l7-ex1` no-execution debugging check:**

```javascript
const readings = [3, 5, 2];
let total = 0;
for (let index = 0; index <= readings.length; index += 1) {
  total += readings[index];
}
console.log(total); // NaN
```

Learner selects the inclusive loop bound as the defect, identifies a breakpoint inside the loop, and predicts that `index` reaches `readings.length` while `readings[index]` is `undefined`. Correct response identifies `< readings.length` as the fix and suggests watching `index` and `total`. No code executes in the app or sandbox for this exercise.

### Module 6 milestone — Accessible mini to-do list

The `m6-l4` exercise is the **DOM milestone/capstone**, not completion of the seven-lesson module: create a small interactive to-do list in the controlled preview. A trusted fixture supplies accessible host-rendered controls, task list, and polite status/count region; learner code wires the documented virtual DOM operations and event handlers. This demonstrates an explicitly bounded model of DOM concepts, not unrestricted or native DOM access.

Acceptance observations in a real browser:

1. Initial fixture contains two deterministic tasks and reports `0 of 2 completed`.
2. Submitting blank/whitespace input leaves the list unchanged and announces `Enter a task.`
3. Submitting `Review DOM` with Enter appends exactly one labeled task, clears and returns focus to the input, and announces `Added: Review DOM.`
4. Activating a task checkbox by keyboard updates its completed state and the count (for example `1 of 3 completed`) without removing or duplicating tasks.
5. All interactive controls have programmatic labels, visible focus, and keyboard operation; updates are perceivable through the live region.
6. Changing lesson, rerunning, resetting, or destroying the app terminates the DOM Worker and clears the model, preview, event bindings, and transient output. No learner task data is persisted.

The milestone is deterministic and synchronous. It uses no network, storage, randomness, framework, or asynchronous concepts. The learner code has no access to the platform DOM. The host preview uses native controls but the learner-facing model does not reproduce all browser DOM behavior. Verify rendered state and keyboard behavior with real-browser automation; console output alone is insufficient evidence of model effects.

### Phase 12 progress, navigation, and test decisions

- Module 6 has exactly seven lessons. Starting after Module 5 yields **31/64**; completing `m6-l1` through `m6-l7` yields **38/64**. Preserve the canonical 64 denominator, completed-lesson-ID representation, and progress semantics. Repeated successful attempts do not inflate progress; reload restores completion; reset displays `0/64`.
- Navigation follows canonical order from `m5-l8` through all seven Module 6 lessons, then to the `m7-l1` placeholder. The placeholder copy identifies **Modules 1–6 (Lessons 1–38)**.
- Objective metadata for all seven lessons is implemented without changing the canonical IDs, titles, durations, or prerequisites.
- Unit tests cover lesson metadata/schema, expected content and examples, exercise type, success/failure feedback, hint tiers, and timeout/error handling for Worker exercises.
- DOM exercises have real-browser verification for host-rendered model state, form interaction, keyboard behavior, Worker termination, cleanup, and blocked capabilities. Verification used integrated Chromium/Electron only; jsdom is supplemental and cannot establish browser isolation, real Worker behavior, or assistive technology behavior.
- Knowledge-check tests cover accessible names, keyboard-only selection/submission, correct/incorrect responses, retry, and idempotent completion; no learner code is executed.
- Regression tests cover Modules 1–5, worker messaging and termination, progress persistence/idempotency/reset, navigation, and the unchanged `/64` denominator.

**Known instructional/execution constraints:** The existing ordinary Worker cannot access DOM, and its single-source runner does not execute static multi-file module declarations. The DOM mode uses a distinct constrained virtual tree and protocol; it is not native DOM access and does not broaden the existing Worker contract. The Worker disables tested global network/storage/host capabilities, but uses `Function` and is not a complete sandbox; dynamic `import()` is not explicitly filtered and remains subject to CSP. Worker termination addresses CPU runaway but provides no hard memory quota or complete security guarantee. Browser tests are evidence only for their tested versions.

**Implementation verification:** The complete automated suite passed with 421 tests across 52 files; ESLint, production build, and `git diff --check` passed. Progress integration tests verify `31/64` to `38/64`, idempotency, persistence, reset, and navigation to the `m7-l1` placeholder. Browser verification used Chrome 150.0.7871.250 in Electron 43.8.3; see the Phase 12 implementation record in `implementation-plan.md` for exact scenarios and the untested browser/deployment risks.

### Module 7 — Asynchronous JavaScript
1. Synchronous execution and the event loop.
2. Callbacks and asynchronous operations.
3. Promises and promise chaining.
4. `async` and `await`.
5. Error handling in asynchronous code.
6. Fetching data from an HTTP API.
7. Loading states and failed requests.

**Milestone:** Build an interface that retrieves and displays external data.

### Module 8 — Object-oriented programming
1. Objects, properties, and methods.
2. Constructor functions and prototypes.
3. Prototype chains and property lookup.
4. Classes and constructors.
5. Instance methods and `this`.
6. Inheritance using `extends` and `super`.
7. Encapsulation and private class fields.
8. Polymorphism and shared object behavior.
9. Composition versus inheritance.
10. When OOP is useful and when it is unnecessary.

**Milestone:** Model a small system, such as a library or inventory, using JavaScript objects and classes. Lessons MUST explain that JavaScript classes use the prototype-based object model.

### Module 9 — Modern JavaScript and framework readiness
1. Modules and code organization.
2. Reusable functions and separation of concerns.
3. Array transformations and immutable update patterns.
4. Data flow, state, and derived values.
5. Event-driven programming.
6. Components as a general UI design concept.
7. Reading unfamiliar code and API documentation.
8. Understanding what a framework adds beyond JavaScript.
9. A framework-neutral capstone project.

**Milestone:** Build and explain a small application, identify the concepts transferable to a new framework, and describe what must be learned from that framework's own documentation.

## 9. Phase 13 — Master Completion Plan for Modules 7–9 (APPROVED; MODULE 7 IMPLEMENTED)

### 9.1 Verified scope and source of truth

`app/src/curriculum.js` is the canonical curriculum source. It contains 64 entries: Modules 1–6 account for 38 lessons; the remaining 26 are seven Module 7 lessons, ten Module 8 lessons, and nine Module 9 lessons. The titles, durations, order, and prerequisites below reproduce the canonical map exactly. Module 7's seven lessons, objectives, assessments, and tests are implemented and registered. Modules 8–9 remain planned; their entries do not yet have lesson content or objective arrays.

The canonical dependency chain is linear from `m6-l7` through `m9-l9`; prerequisites are not to be weakened or silently supplemented. The course denominator remains 64 and the target transition is `38/64` → `45/64` after Module 7 → `55/64` after Module 8 → `64/64` after Module 9. Module milestones are assessed at `m7-l7`, `m8-l10`, and `m9-l9`, respectively. The Module 9 capstone is the final curriculum-completion milestone.

| Module | Canonical title | Lesson count | Canonical duration | Prerequisite boundary | Canonical milestone |
|---|---|---:|---:|---|---|
| 7 | Asynchronous JavaScript | 7 | 165 min | `m6-l7` → `m7-l1` | Build an interface that retrieves and displays external data. |
| 8 | Object-Oriented Programming | 10 | 215 min | `m7-l7` → `m8-l1` | Model a small system using JavaScript objects and classes while explaining the prototype-based model. |
| 9 | Modern JavaScript & Framework Readiness | 9 | 230 min | `m8-l10` → `m9-l1` | Build and explain a framework-neutral capstone and identify transferable concepts. |

**Approved Module 7 milestone decision:** Module 7 retrieves data from the public cross-origin HTTPS endpoint `https://jsonplaceholder.typicode.com/todos/1` and handles the approved missing-task endpoint `https://jsonplaceholder.typicode.com/todos/999999999` through the host-mediated GET bridge. The application's localhost-origin CORS behavior was verified in integrated Chromium. The endpoint requires no API key or authentication. The response is a single task object (`userId`, `id`, `title`, `completed`); the missing-task endpoint returns HTTP 404 with `{}`. This is external data, not a local fixture. External service availability remains outside the application's control.

### 9.2 Module 7 — Asynchronous JavaScript

**Progression:** accurately predict scheduling first; then use callbacks, promises, `async`/`await`, and asynchronous error handling; only after those foundations introduce the tightly allowlisted external HTTP API and loading/error states. Do not equate a Promise with a timer or say that all asynchronous work is a macrotask.

#### m7-l1 — Synchronous Execution and the Event Loop (25 min; prerequisite `m6-l7`)

- **Objectives:** trace synchronous statements; distinguish the current call stack, Promise-job microtasks, and timer tasks; predict one microtask-versus-timer example without claiming fixed ordering among unrelated timer tasks.
- **Sections/example:** call stack and run-to-completion; microtask checkpoint; timer task; annotate `console.log("sync"); Promise.resolve().then(() => console.log("microtask")); setTimeout(() => console.log("timer task"), 0); console.log("end");`. Correct order for this one example: `sync`, `end`, `microtask`, `timer task`.
- **Exercise/starter → expected:** no-execution trace check over that exact snippet; answer `sync → end → microtask → timer task`.
- **Validation/feedback:** all four positions must be correct; targeted correction identifies the first misplaced item and whether it is synchronous, a Promise job, or a later timer task.
- **Hints:** identify calls that run immediately; place the Promise reaction after the current stack and before the timer callback. **Misconception:** “async means parallel” or “a timer runs exactly after its delay.”
- **Comprehension/tests:** predict a second snippet with two synchronous logs and one Promise reaction; unit-test answer keys, retry, keyboard interaction, and no runner invocation.

#### m7-l2 — Callbacks and Asynchronous Operations (20 min; prerequisite `m7-l1`)

- **Objectives:** distinguish a callback from the function that registers it; explain why later statements run before a timer callback; understand that a timer callback is a later task.
- **Sections/example:** callback parameters; callback registration vs invocation; timer tasks. Worked example: `console.log("start"); setTimeout(() => console.log("callback"), 0); console.log("scheduled");`.
- **Exercise/starter → expected:** `console.log("start"); setTimeout(() => console.log("callback"), 0); console.log("scheduled");` → `start`, `scheduled`, `callback`.
- **Validation/feedback:** validate complete ordered output and successful async completion; distinguish “callback never registered” from order mistakes.
- **Hints:** do not call the callback while registering it; trace the two immediate logs before the timer callback. **Misconception:** assuming callbacks are always asynchronous or timers are precise clocks.
- **Comprehension/tests:** predict callback argument/closure values; test real timer callback ordering, timer caps, cancel/reset, timeout, and no late output after completion.

#### m7-l3 — Promises and Promise Chaining (25 min; prerequisite `m7-l2`)

- **Objectives:** recognize pending/fulfilled/rejected states; use `then`, `catch`, and `finally`; return a value to pass it to the next `then`; explain that `finally` normally preserves the prior result.
- **Sections/example:** Promise state; chaining and value transformation; rejection propagation and cleanup. Example starts from `Promise.resolve(2)`, logs `3`, returns `4`, then logs `4`, finally logs `cleanup`.
- **Exercise/starter → expected:** `return Promise.resolve(2).then(value => { console.log(value + 1); return value * 2; }).then(console.log).finally(() => console.log("cleanup"));` → `3`, `4`, `cleanup`.
- **Validation/feedback:** validate output order and final Promise settlement; targeted feedback distinguishes a missing `return` from a wrong transformation.
- **Hints:** return the transformed value from the first handler; let the next handler receive that returned value; keep cleanup in `finally`. **Misconception:** `then` runs synchronously or `finally` replaces the value.
- **Comprehension/tests:** predict the value reaching the second handler and the behavior after rejection; unit-test chain adoption, `catch` recovery, `finally`, output ordering, and rejection completion.

#### m7-l4 — async and await (25 min; prerequisite `m7-l3`)

- **Objectives:** declare an `async` function; explain that it returns a Promise; await a Promise before using its value; preserve sequential-looking code without claiming the thread blocks.
- **Sections/example:** `async` return values; `await` continuation; concurrent vs sequential awaits at a conceptual level. Example logs `start`, awaits `Promise.resolve("ready")`, then logs `ready`.
- **Exercise/starter → expected:** `async function main() { console.log("start"); const value = await Promise.resolve("ready"); console.log(value); } return main();` → `start`, `ready`.
- **Validation/feedback:** success requires the returned `main()` Promise to settle and both lines to appear in order; an unreturned async call is not considered completed.
- **Hints:** mark the function `async`; await the Promise inside it; return the `main()` Promise from the exercise. **Misconception:** `await` blocks the Worker or makes an arbitrary Promise resolve.
- **Comprehension/tests:** predict code before/after `await`; test fulfilled, rejected, and never-settling Promises, outer Promise adoption, timeout, rerun recovery, and output arriving before terminal completion.

#### m7-l5 — Error Handling in Asynchronous Code (20 min; prerequisite `m7-l4`)

- **Objectives:** catch a rejected awaited Promise with `try/catch`; distinguish a handled rejection from a returned unhandled rejection; explain why a synchronous `try/catch` around a later timer callback does not catch that callback's error.
- **Sections/example:** Promise rejection; `await` rejection; callback error boundary. Worked example catches `Promise.reject(new Error("offline"))` and logs `Handled: offline`.
- **Exercise/starter → expected:** `async function main() { try { await Promise.reject(new Error("offline")); } catch (error) { console.log(\`Handled: \${error.message}\`); } } return main();` → `Handled: offline`.
- **Validation/feedback:** require successful settlement after the expected handled output; an uncaught rejection must surface as an execution error, not success.
- **Hints:** put the `await` inside the `try`; read `error.message`; return the async function's Promise. **Misconception:** a parent synchronous `try/catch` catches future asynchronous work.
- **Comprehension/tests:** classify handled/unhandled callback and Promise errors; test thrown and rejected errors, unhandled rejection reporting, stale errors, timeout, and clear recovery.

#### m7-l6 — Fetching Data from an HTTP API (30 min; prerequisite `m7-l5`)

- **Objectives:** issue an allowlisted GET request; inspect `response.ok`/`status`; parse JSON asynchronously; transform returned records for display; distinguish HTTP failure responses from network rejection.
- **Sections/example:** request/response lifecycle; response status before JSON parsing; JSON data as an external input. Example loads `https://jsonplaceholder.typicode.com/todos/1`, checks `ok`, parses the task object, and prints its title and completion state.
- **Exercise/starter → expected:** `const response = await fetch("https://jsonplaceholder.typicode.com/todos/1"); if (!response.ok) throw new Error(\`HTTP \${response.status}\`); const task = await response.json(); console.log(\`Task: \${task.title}\`); console.log(\`Status: \${task.completed ? "done" : "open"}\`);` → `Task: delectus aut autem`, `Status: open`.
- **Validation/feedback:** assert HTTP request route, response status/shape, asynchronous completion, and ordered title output. Explain that 404 normally resolves to a response and must be checked; network failure rejects.
- **Hints:** check `response.ok` before parsing; return `response.json()` from the first handler; return/await the resulting chain. **Misconception:** every non-2xx response rejects `fetch`, or JSON parsing is synchronous.
- **Comprehension/tests:** predict output for 404, malformed JSON, and network error; test the exact allowlisted URL, response schema and size bounds, abort/timeout, stale request IDs, no direct Worker networking, and omission of credentials.

#### m7-l7 — Loading States and Failed Requests (20 min; prerequisite `m7-l6`)

- **Objectives:** model loading/success/error states; show data only after parsing; provide a useful failure message and retry path; prevent stale requests from replacing newer state.
- **Sections/example:** state transition `idle → loading → success|error`; preserve error/status separately from data; loading indicator and retry. Worked example requests the approved missing-task URL, handles HTTP 404, then retries the valid task URL.
- **Exercise/starter → expected:** use `https://jsonplaceholder.typicode.com/todos/999999999` for the first GET, check `response.ok`, report `HTTP 404`, then retry with `https://jsonplaceholder.typicode.com/todos/1` and display the task title → `Loading task...`, `Could not load task: HTTP 404`, `Retrying task...`, `Loaded: delectus aut autem`.
- **Validation/feedback:** run success and failure cases; assert loading precedes terminal state, error clears/does not masquerade as success, and retry can produce the successful two-task state.
- **Hints:** emit loading before the request; check `ok`; handle both rejected requests and HTTP failure; replace—not append to—old result state on retry. **Misconception:** empty data means loading, or a failed request is a successful empty response.
- **Comprehension/tests:** label transitions for success, 404, network error, timeout, retry, and stale completion; integration-test accessible live status/results and Worker cleanup.
- **Module 7 milestone:** the final exercise displays external API data after a visible loading state and handles a controlled HTTP failure with retry. It uses only the two approved external URLs through the host-mediated request bridge; learner code cannot request arbitrary destinations. Completion yields `45/64`.

### 9.3 Module 8 — Object-Oriented Programming

**Progression:** `m5-l1`–`m5-l5` already introduced object literals, properties, and direct object methods. `m8-l1` is an application/diagnostic bridge, not a second introductory unit. Teach constructor functions and prototypes before class syntax, then explicitly connect class syntax to prototype behavior. No framework terminology is needed.

#### m8-l1 — Objects, Properties, and Methods (20 min; prerequisite `m7-l7`)

- **Objectives:** retrieve prior knowledge about object literals; choose a cohesive object model; explain the difference between related state and behavior without re-teaching object syntax.
- **Sections/example:** short retrieval recap of properties/methods; identify responsibilities of a `Book` record; decide what belongs on an instance. Example: `{ title: "Dune", available: true }`.
- **Exercise/starter → expected:** `const book = { title: "Dune", available: true, label() { return this.available ? \`\${this.title}: available\` : \`\${this.title}: checked out\`; } }; console.log(book.label());` → `Dune: available`.
- **Validation/feedback:** output and both state branches; direct feedback explains missing receiver/property logic.
- **Hints:** derive the label from both properties; use the existing direct-call `this` rule from Module 5. **Misconception:** objects/classes are always preferable to plain data.
- **Comprehension/tests:** classify fields vs behavior; content tests assert explicit retrieval/no repeated beginner exposition; unit-test availability branches and Module 5 regression.

#### m8-l2 — Constructor Functions and Prototypes (25 min; prerequisite `m8-l1`)

- **Objectives:** call a constructor with `new`; initialize per-instance properties with `this`; attach a shared method to `Constructor.prototype`; explain instance/prototype distinction.
- **Sections/example:** constructor invocation; `new` creates/links/returns an instance; shared prototype method. Example `function Book(title) { this.title = title; }` and `Book.prototype.describe = function () { return this.title; };`.
- **Exercise/starter → expected:** `function Book(title) { /* TODO: initialize */ } Book.prototype.describe = function () { /* TODO: return title */ }; const first = new Book("Dune"); const second = new Book("Arrival"); console.log(first.describe()); console.log(second.describe());` → `Dune`, `Arrival`.
- **Validation/feedback:** instance state and method outputs for both instances; targeted guidance points to `new` or `Book.prototype`.
- **Hints:** assign `title` through `this`; define `describe` once on the prototype; instantiate each with `new`. **Misconception:** the prototype is a copy of each instance.
- **Comprehension/tests:** distinguish own property from shared method; test multiple instances, prototype identity and correct `new` behavior.

#### m8-l3 — Prototype Chains and Property Lookup (25 min; prerequisite `m8-l2`)

- **Objectives:** trace own-property lookup then prototype lookup; distinguish shadowing from mutation of a prototype; inspect an object's prototype and own-property status.
- **Sections/example:** lookup chain; inherited method; own-property shadowing. Example `Object.hasOwn(book, "describe")` is false while `book.describe()` resolves from `Book.prototype`.
- **Exercise/starter → expected:** `function Book(title) { this.title = title; } Book.prototype.describe = function () { return this.title; }; const book = new Book("Dune"); console.log(book.describe()); console.log(Object.hasOwn(book, "describe"));` → `Dune`, `false`.
- **Validation/feedback:** check method output, own/inherited status and a shadowing case; explain lookup rather than saying the property is “copied.”
- **Hints:** inspect the instance before its prototype; use `Object.hasOwn`; lookup continues when the property is absent. **Misconception:** modifying a shared prototype affects only one instance.
- **Comprehension/tests:** predict shadowing and prototype-chain results; test lookup, own property, and safe use of `Object.getPrototypeOf`.

#### m8-l4 — Classes and Constructors (25 min; prerequisite `m8-l3`)

- **Objectives:** declare a class and constructor; create instances with `new`; connect class methods to prototype methods; recognize class syntax as another interface to JavaScript's prototype model.
- **Sections/example:** class declaration; constructor initialization; compare class prototype method with constructor-function pattern from L2.
- **Exercise/starter → expected:** `class Book { constructor(title) { /* TODO: store title */ } describe() { /* TODO: return title */ } } const book = new Book("Dune"); console.log(book.describe()); console.log(Object.hasOwn(Book.prototype, "describe"));` → `Dune`, `true`.
- **Validation/feedback:** instance result plus comparison check that `Book.prototype.describe` exists and the instance owns `title`; clarify a misplaced `this` or method.
- **Hints:** constructor stores instance data; place `describe` in the class body, not inside the constructor. **Misconception:** classes replace prototypes or each instance gets a separate method copy.
- **Comprehension/tests:** compare equivalent constructor/prototype and class examples; test class metadata, instance state, and prototype method sharing.

#### m8-l5 — Instance Methods and this (20 min; prerequisite `m8-l4`)

- **Objectives:** use `this` in a class instance method; call the method through its instance; distinguish an instance method from an unbound/detached function.
- **Sections/example:** method receiver; updating instance state; direct-call scope. Example `counter.increase(2)` updates and returns `this.value`.
- **Exercise/starter → expected:** `class Counter { constructor() { this.value = 3; } increase(amount) { /* TODO */ } } const counter = new Counter(); console.log(counter.increase(2)); console.log(counter.value);` → `5`, `5`.
- **Validation/feedback:** both returned and stored values; explain receiver binding and avoid browser-specific detached-`this` details beyond scope.
- **Hints:** read/update `this.value`; return it; invoke through `counter`. **Misconception:** `this` is lexically fixed like a closure variable.
- **Comprehension/tests:** identify receiver in two direct calls; test repeated instance calls and no state sharing.

#### m8-l6 — Inheritance Using extends and super (25 min; prerequisite `m8-l5`)

- **Objectives:** extend a base class; call `super(...)` before using `this` in a derived constructor; use `super.method()` to reuse base behavior; describe the resulting prototype relationship.
- **Sections/example:** “is-a” modeling; base initialization; method override and `super`. Example `class Ebook extends Book` adds `fileType` and augments `describe()`.
- **Exercise/starter → expected:** `class Book { constructor(title) { this.title = title; } describe() { return this.title; } } class Ebook extends Book { constructor(title, format) { /* TODO */ } describe() { /* TODO */ } } console.log(new Ebook("Dune", "EPUB").describe());` → `Dune (EPUB)`.
- **Validation/feedback:** verify inherited title, derived file type, and overridden method output; target missing `super()` or incorrect override.
- **Hints:** call `super(title)` first; initialize the derived field; call `super.describe()` when extending behavior. **Misconception:** inheritance is only code reuse or allows arbitrary multiple inheritance.
- **Comprehension/tests:** predict method lookup for override vs inherited method; test constructor order and prototype chain.

#### m8-l7 — Encapsulation and Private Class Fields (20 min; prerequisite `m8-l6`)

- **Objectives:** use `#privateField`; expose a small public method that preserves an invariant; distinguish privacy from underscore naming; handle invalid operations.
- **Sections/example:** private fields; validation at method boundary; public API. Example `#copies` can never become negative.
- **Exercise/starter → expected:** `class InventoryItem { #copies = 1; checkout() { /* TODO: reject at zero, otherwise decrement */ } copies() { return this.#copies; } } const item = new InventoryItem(); item.checkout(); console.log(item.copies()); console.log(item.checkout()); console.log(item.copies());` → `0`, `false`, `0`.
- **Validation/feedback:** assert outputs and invariant-preserving behavior; inaccessible private-field syntax must be explained without leaking code via stack traces.
- **Hints:** declare `#copies` in the class body; change it only inside methods; reject checkout at zero. **Misconception:** a leading underscore provides language-enforced privacy.
- **Comprehension/tests:** choose legal access; test boundaries, private-field syntax error, and state isolation.

#### m8-l8 — Polymorphism and Shared Object Behavior (20 min; prerequisite `m8-l7`)

- **Objectives:** invoke the same method across different instances; explain that each type can provide its own implementation; avoid unnecessary type checks.
- **Sections/example:** shared method contract; override implementations; caller depends on behavior. Example `items.map(item => item.describe())`.
- **Exercise/starter → expected:** `const items = [{ kind: "Book", title: "Dune", describe() { /* TODO */ } }, { kind: "Video", title: "Arrival", describe() { /* TODO */ } }]; items.forEach(item => console.log(item.describe()));` → `Book: Dune`, `Video: Arrival` (implement the same method contract for both values).
- **Validation/feedback:** require both concrete outputs from the same call pattern; distinguish missing override from wrong input.
- **Hints:** give both types a `describe()` method; iterate and call the method without branching by class name. **Misconception:** polymorphism means inheritance is required for every shared behavior.
- **Comprehension/tests:** predict which override executes; tests cover both object types, common operation and an unknown/invalid item case.

#### m8-l9 — Composition Versus Inheritance (20 min; prerequisite `m8-l8`)

- **Objectives:** distinguish “has-a” from “is-a”; compose behavior from a helper object/function; explain when composition avoids a brittle hierarchy.
- **Sections/example:** relationship choice; injected behavior; compare an `Order` with a `discount` policy vs subclassing every discount kind.
- **Exercise/starter → expected:** `const tenPercentOff = { apply(total) { /* TODO */ } }; class Order { constructor(total, discount) { this.total = total; this.discount = discount; } finalTotal() { /* TODO: delegate */ } } console.log(new Order(100, tenPercentOff).finalTotal());` → `90`.
- **Validation/feedback:** assert computed total and that the order delegates; targeted feedback clarifies the relationship model.
- **Hints:** keep order data in `Order`; pass a discount policy; call the policy for the adjustment. **Misconception:** composition means copying object fields.
- **Comprehension/tests:** classify “has-a/is-a” cases; test two policies and unchanged base calculation.

#### m8-l10 — When OOP Is Useful and When It Is Unnecessary (15 min; prerequisite `m8-l9`)

- **Objectives:** compare plain data/functions, composition, and class hierarchies; justify a fit-for-purpose design; identify added complexity.
- **Sections/example:** choose based on state/invariants/behavior; compare a one-off formatter, a reusable inventory item, and a subtype requirement.
- **Exercise/starter → expected:** no-execution design decision with three scenarios and short rationale; expected answer accepts a small set of justified designs, not one “always use classes” answer.
- **Validation/feedback:** rubric checks concept fit and one trade-off per scenario; feedback corrects overengineering or unjustified inheritance.
- **Hints:** ask whether related state/behavior and invariants exist; ask whether behavior is shared or varied; prefer the simplest working model. **Misconception:** OOP is mandatory for professional JavaScript.
- **Comprehension/tests:** accessible multi-select/short rationale; test keyboard use, accepted alternatives and idempotent retry.
- **Module 8 milestone:** model a small library/inventory using a class, private invariant, one meaningful subtype/override, and a composed policy; explain where the prototype methods live and why composition is used. Completion yields `55/64`.

### 9.4 Module 9 — Modern JavaScript & Framework Readiness

**Progression:** revisit the existing Module 6 module assessment without repeating its syntax lesson; apply Modules 5/7/8 concepts to reusable application logic, immutable transformations, state/data flow and event-driven UI models. Frameworks remain conceptual comparisons only; do not add a framework dependency.

#### m9-l1 — Modules and Code Organization (20 min; prerequisite `m8-l10`)

- **Objectives:** divide code by responsibility; identify named exports/imports and dependency direction; distinguish a module's public API from its implementation; extend rather than repeat Module 6 syntax/path recognition.
- **Sections/example:** file boundaries; small public API; acyclic dependency direction. Example file map `tasks.js` exports `addTask`, `task-view.js` imports it, `main.js` connects both.
- **Exercise/starter → expected:** no-execution file-placement/import-matching assessment; expected mapping has state/update logic in `tasks.js`, view-model formatting in `task-view.js`, and wiring in `main.js`.
- **Validation/feedback:** grade responsibility and matching symbol/path; do not imply multi-file execution is supported. Feedback addresses circular or UI-coupled business logic.
- **Hints:** identify who owns data changes vs formatting vs wiring; follow the exported name to its source. **Misconception:** a file is a component or every function needs its own file.
- **Comprehension/tests:** dependency graph and export-prediction check; test keyboard assessment and no runner call.

#### m9-l2 — Reusable Functions and Separation of Concerns (20 min; prerequisite `m9-l1`)

- **Objectives:** extract a function with explicit inputs/outputs; separate transformation from side effects; reuse a helper without shared hidden state.
- **Sections/example:** responsibility boundaries; pure helper; caller orchestration. Example `formatTask(task)` independent of console/UI.
- **Exercise/starter → expected:** `function formatTask(task) { /* TODO: return a label without logging */ } console.log(formatTask({ title: "Read", completed: false })); console.log(formatTask({ title: "Write", completed: true }));` → `Read — open`, `Write — done`.
- **Validation/feedback:** test multiple inputs and no mutation; target incorrect concatenation or hidden dependency.
- **Hints:** pass the record as an argument; return a string instead of logging inside the helper. **Misconception:** reusability means a generic abstraction with many options.
- **Comprehension/tests:** identify side effects and inputs; unit-test edge cases, reused helper and deterministic outputs.

#### m9-l3 — Array Transformations and Immutable Update Patterns (25 min; prerequisite `m9-l2`)

- **Objectives:** apply `map`/`filter` to application data; create updated records/arrays instead of mutating the original; explain shallow-copy limits already introduced in Module 5.
- **Sections/example:** filter then map; object spread update; referential difference. Example mark one task done by `map` and preserve other records.
- **Exercise/starter → expected:** `function toggleTask(tasks, id) { /* TODO: return an immutable update */ } const tasks = [{ id: 1, title: "Read", completed: false }, { id: 2, title: "Write", completed: true }]; const updated = toggleTask(tasks, 1); console.log(updated.map(task => task.completed)); console.log(tasks.map(task => task.completed));` → `[true, true]`, `[false, true]`.
- **Validation/feedback:** assert transformed values and original unchanged; guidance distinguishes filter from map and identifies accidental mutation.
- **Hints:** map every record; return a new object for the matching ID; leave nonmatching objects unchanged. **Misconception:** `const` makes an array/object immutable or spread is a deep clone.
- **Comprehension/tests:** predict array and identity changes; tests cover missing ID, no mutation and unchanged neighbors.

#### m9-l4 — Data Flow, State, and Derived Values (25 min; prerequisite `m9-l3`)

- **Objectives:** identify source-of-truth state; calculate derived counts instead of storing duplicate state; pass data through a predictable transformation.
- **Sections/example:** state → transformation → derived view values; avoid synchronization bugs. Example `completedCount = tasks.filter(task => task.completed).length`.
- **Exercise/starter → expected:** `function summarize(tasks) { /* TODO: derive all counts */ } const tasks = [{ completed: true }, { completed: false }]; console.log(JSON.stringify(summarize(tasks)));` → `{"total":2,"completed":1,"open":1}`.
- **Validation/feedback:** verify all derived outputs after a state update; targeted feedback identifies stale duplicated state.
- **Hints:** derive counts from the current array; update the array first; recompute summary from new state. **Misconception:** every displayed value needs its own mutable variable.
- **Comprehension/tests:** trace a toggle through state and derived values; test empty arrays and consecutive updates.

#### m9-l5 — Event-Driven Programming (25 min; prerequisite `m9-l4`)

- **Objectives:** separate event source, handler, state transition and output; model a handler as a function receiving an event/action; connect to Module 6 listener mechanics without repeating DOM APIs.
- **Sections/example:** event flow; action payload; state transition. Example `nextState = reduce(state, {type:"toggle", id:1})`.
- **Exercise/starter → expected:** `function update(state, action) { /* TODO: return next state */ } let state = { count: 0 }; state = update(state, { type: "increment" }); state = update(state, { type: "increment" }); console.log(\`Count: \${state.count}\`);` → `Count: 2`.
- **Validation/feedback:** assert ordered state transitions and unknown action is safe; feedback separates event creation from handler execution.
- **Hints:** pass an action object; return a new state; derive display from that state. **Misconception:** event-driven means asynchronous or a framework is required.
- **Comprehension/tests:** trace two actions and a no-op; tests include repeat, unknown action and immutable state.

#### m9-l6 — Components as a General UI Design Concept (25 min; prerequisite `m9-l5`)

- **Objectives:** describe a component as a cohesive, reusable UI responsibility; pass explicit data into a view function; compose small view descriptions; distinguish the concept from framework-specific syntax.
- **Sections/example:** inputs and outputs; component composition; data flow into view models. Example `TaskRow(task)` returns a serializable descriptor; `TaskList(tasks)` composes rows.
- **Exercise/starter → expected:** `function TaskRow(task) { /* TODO: return a serializable row descriptor */ } function TaskList(tasks) { /* TODO: compose rows */ } const view = TaskList([{ title: "Read" }, { title: "Write" }]); view.forEach(row => console.log(row.text));` → `Task: Read`, `Task: Write`.
- **Validation/feedback:** validate descriptors, ordering and repeatability; feedback identifies hidden global state or component doing unrelated work.
- **Hints:** make row accept one task; make list map over tasks; return data, do not access the platform DOM. **Misconception:** a component requires React/Vue or is necessarily a class.
- **Comprehension/tests:** identify component input/output and boundaries; test empty list, multiple items, safe data, and no framework/DOM dependency.

#### m9-l7 — Reading Unfamiliar Code and API Documentation (20 min; prerequisite `m9-l6`)

- **Objectives:** locate entry points and imports; trace a value through helper/state/view functions; use a supplied API excerpt to identify inputs, outputs, errors, and version assumptions.
- **Sections/example:** skim file structure; follow call/data flow; read reference headings/examples/caveats. Use a short curated fictional project and API excerpt, not an external framework.
- **Exercise/starter → expected:** no-execution code-reading assessment; choose the source of a displayed count and the documented failure case; provide cited snippet/line labels in the supplied materials.
- **Validation/feedback:** answers tie to evidence in the excerpt; feedback points to missed call sites or caveats.
- **Hints:** find the entry point; search for the output/state name; confirm the method contract and error section. **Misconception:** infer an API from its name or copy examples without version/context checks.
- **Comprehension/tests:** keyboard quiz plus trace exercise; test all answer paths and that the supplied source/reference remains internally consistent.

#### m9-l8 — Understanding What a Framework Adds Beyond JavaScript (25 min; prerequisite `m9-l7`)

- **Objectives:** separate language features from framework conventions/runtime; map components, state, events, rendering, and data flow to prior lessons; identify what framework-specific documentation must still be learned.
- **Sections/example:** plain JavaScript vs framework responsibilities; render/update lifecycle; conventions/tooling. No framework is installed or required.
- **Exercise/starter → expected:** no-execution classification and transfer plan; correctly sort language, browser, and framework responsibilities and name one documentation question for each.
- **Validation/feedback:** accept multiple framework-neutral explanations; correct claims that a framework replaces JavaScript or that all frameworks behave identically.
- **Hints:** classify based on who defines the behavior; connect each term to earlier lessons; check framework docs for lifecycle/API details. **Misconception:** framework knowledge is transferable without learning its conventions.
- **Comprehension/tests:** accessible classification plus short response; test alternatives and no hidden framework assumptions.

#### m9-l9 — Framework-Neutral Capstone Project (45 min; prerequisite `m9-l8`)

- **Objectives:** organize responsibilities; transform state immutably; process actions; derive display data; compose framework-neutral view descriptions; explain transfer and limits.
- **Sections/example:** requirements/data model; pure transformations; state/action flow; composed view model; test/explain trade-offs.
- **Exercise/starter → expected:** starter skeleton: `function addTask(tasks, task) { /* TODO */ } function toggleTask(tasks, id) { /* TODO */ } function selectVisibleTasks(tasks, filter) { /* TODO */ } function summarize(tasks) { /* TODO */ } function TaskRow(task) { /* TODO */ } function TaskList(tasks) { /* TODO */ } function update(tasks, action) { /* TODO: delegate by action type */ }` plus `[{ id: 1, title: "Read", completed: false }]`. Dispatch add-Write then toggle id 2; filter `completed`; print the one row, summary, and original record → `Task: Write (done)`, `2 total; 1 done; 1 open`, `Read — open`.
- **Validation/feedback:** integration validator checks deterministic output and state transitions for empty/duplicate/missing IDs, immutability, filter changes and reset. Success feedback asks learner to explain one boundary; do not claim output-only grading proves implementation technique.
- **Hints:** implement pure updates first; derive summary; route actions through one handler; compose row/list from supplied data. **Misconception:** framework readiness means building a framework or duplicating UI state.
- **Comprehension/tests:** rubric ties each objective to a capstone assertion and short rationale; unit tests for each helper, integration tests for action sequence, keyboard navigation, feedback, retry, persistence, idempotency, reset and 64/64 completion.
- **Final curriculum milestone:** learner can produce a tested framework-neutral application model and explain what is JavaScript, what is browser behavior, and what must be learned from a selected framework's documentation. Completion yields `64/64`.

### 9.5 Objective-to-assessment coverage

Every objective above is paired with observable code output/state, a deterministic prediction/reading check, or a capstone rubric. In summary:

| Objective group | Assessments |
|---|---|
| Event-loop order, callbacks, microtasks and timer tasks (`m7-l1`–`m7-l2`) | Exact trace prediction; real Worker timer ordering and completion tests. |
| Promise states/chaining, `async`/`await`, rejection and asynchronous errors (`m7-l3`–`m7-l5`) | Ordered output, returned Promise settlement, handled/unhandled rejection, and timeout/recovery tests. |
| HTTP response/JSON and loading/error states (`m7-l6`–`m7-l7`) | Allowlisted external API requests, status/body assertions, accessible loading/success/error states, retry and stale-execution response rejection. |
| Prototype construction, lookup, class equivalence, `this`, inheritance, encapsulation, polymorphism and composition (`m8-l1`–`m8-l9`) | Behavior across multiple instances/types, own-vs-inherited assertions, state invariants, override dispatch, and composed-policy outcomes. |
| OOP trade-offs (`m8-l10`) | Scenario rubric accepting justified alternatives and penalizing blanket “always use OOP” claims. |
| Modules, reusable logic, immutable transforms, state/data flow and events (`m9-l1`–`m9-l5`) | Architecture mapping plus deterministic helper/action tests; no false claim of executing multi-file imports. |
| Components, code/documentation reading and framework transfer (`m9-l6`–`m9-l8`) | Serializable view-model tests and evidence-based, accessible comprehension checks. |
| Integrated application design (`m9-l9`) | End-to-end state/action/view assertions, regression cases, explanation rubric, and final progress integration. |

### 9.6 Cross-module misconceptions and sequencing controls

- Module 5 already teaches object literals, properties, methods, direct-call `this`, arrays and transformations. Module 8 applies these to prototype/class modeling rather than repeating introductory explanations.
- Module 6 teaches module syntax and browser event listeners. Module 9 extends file responsibility and event-driven state flow; it does not claim that multi-file imports execute or re-teach native DOM event syntax.
- Teach Promise jobs vs timer tasks before Promises/chains; teach rejection before `async`/`await` error handling; teach response status and JSON parsing before loading-state recovery.
- Do not teach timers as exact deadlines, Promises as parallel threads, `await` as blocking, or HTTP errors as automatically rejected fetches.
- Do not introduce React/Vue/Angular syntax, async framework lifecycle, build tooling, or actual project imports. Static module execution remains unavailable unless separately specified and approved.
- Coding validators can assess observable behavior but cannot prove the learner used a particular internal technique. Scaffold functions, test immutable inputs/state, include prediction/explanation checks, and document this limitation.

## 3. Lesson template

Every lesson MUST define:

1. Stable lesson ID, title, and estimated duration.
2. Learning objectives.
3. Prerequisite lesson IDs.
4. Plain-language explanation.
5. Worked example with expected behavior.
6. Interactive experiment.
7. Guided exercise.
8. Independent challenge when appropriate.
9. Feedback and hints.
10. Summary and knowledge check.
11. Links to prerequisite and next lessons.
12. Completion rule and assessment criteria.

## 4. Exercise types

The platform SHOULD support:

- Predicting program output.
- Multiple-choice concept checks.
- Filling in missing code.
- Writing short programs.
- Finding and correcting bugs.
- Explaining why a solution works.

Each exercise MUST have a stable ID, instructions, defined evaluation criteria, test cases or answer rules, and relevant feedback.

## 5. Difficulty progression

Major concepts SHOULD progress through:

- **Level 1 — Recognize and understand:** explain or identify the concept.
- **Level 2 — Modify an example:** make a small, purposeful change.
- **Level 3 — Solve a guided problem:** apply the concept with hints or scaffolding.
- **Level 4 — Solve independently:** use the concept in a new problem.

Not every lesson must use all four levels, but the sequence SHOULD build toward independent application.

## 6. Assessment policy

A learner MUST demonstrate the lesson's stated outcome before the lesson is marked complete. A suggested initial rule is to pass all required checks, including at least one practical exercise for coding lessons. Retry attempts SHOULD be unlimited in the MVP.

A single quiz score MUST NOT be represented as proof of long-term mastery. Where assessment can be automated, evaluation MUST test meaningful behavior rather than exact formatting unless formatting is explicitly part of the learning objective.

## 7. Technical accuracy

Lessons MUST distinguish core language features from browser APIs and framework conventions. Published examples MUST be executed or otherwise verified against their documented outcomes. Common misconceptions SHOULD be addressed explicitly when relevant.

## 8. Curriculum delivery strategy

The curriculum MUST be developed incrementally. The first implementation cycle SHOULD contain the first lesson and its complete learning loop. Subsequent modules SHOULD be added after the learning and execution infrastructure has been validated.
