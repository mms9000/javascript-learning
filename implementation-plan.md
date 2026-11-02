# Implementation Plan — Interactive JavaScript Learning Platform

**Version:** 1.4
**Status:** Phases 8–12 implementation complete; production-hosting and browser-matrix risks remain
**Methodology:** Spec-Driven Development (SDD)

## 1. Objective

Implement the first complete learning loop for Module 1 Lesson 1 — "What JavaScript Is and Where It Runs" — verify it against requirements, and use the validated foundation to expand the course incrementally. The first vertical slice will use `console.log("Hello, world!")` as its runnable example and include editing, running, output display, a simple exercise, feedback, and local progress recording.

## 2. Rules of execution

- Read the constitution and relevant specifications before modifying code.
- Implement small, independently verifiable tasks.
- Update specifications and tests when approved behavior changes.
- Do not claim a feature is complete unless it has been implemented and verified.
- Report blockers, ambiguity, and security concerns instead of silently guessing.
- Keep the curriculum independent of the website's implementation framework.

## 3. Phase 0 — Confirm the baseline ✅ COMPLETE

### Tasks
- Review `constitution.md` and `requirements.md`. ✅
- Confirm the MVP scope and acceptance criteria. ✅
- Review `curriculum-spec.md` and choose the initial lesson content. ✅
- Confirm the technology choices in `architecture-spec.md`. ✅
- Document open decisions, especially the code runner's threat model and capabilities. ✅ (see `architecture-spec.md` §5)

### Confirmed decisions

| Concern | Decision |
|---------|----------|
| First lesson | Module 1 Lesson 1 — "What JavaScript Is and Where It Runs" |
| Build tool | Vite |
| App language | JavaScript (TypeScript optional, not required by learners) |
| Code editor | CodeMirror |
| Code execution | Dedicated Web Worker with watchdog, message protocol, and execution IDs |
| Unit testing | Vitest |
| Linting | ESLint |
| Progress storage | localStorage (versioned, malformed-data safe) |
| Hosting | Static HTTPS |

### Exit criteria
- Required decisions for the first slice are recorded. ✅
- No unresolved ambiguity blocks safe implementation. ✅

## 4. Phase 1 — Initialize the project

### Tasks
- Create the application repository and package configuration.
- Configure the development server and reproducible build.
- Establish linting and formatting conventions if the chosen toolchain supports them.
- Add the initial test runner.
- Create the minimum application shell and a basic automated smoke test.

### Exit criteria
- The project can be installed and started using documented commands.
- The test command runs successfully.
- The production build completes.

## 5. Phase 2 — Build the lesson interface ✅ COMPLETE

### Tasks
- Create the curriculum/lesson navigation for the first lesson. ✅
- Add the lesson title, learning objectives, explanation, and example. ✅
- Add accessible editor, Run, Reset, and output controls. ✅
- Add clear running, success, error, and unavailable states. ✅
- Verify responsive behavior and keyboard interaction. ✅

### Exit criteria
- The lesson content renders correctly and remains available independently of execution. ✅
- Core controls have accessible names and visible focus. ✅

## 6. Phase 3 — Implement the code execution boundary (COMPLETED)

### Tasks
- Document the threat model, CPU resource isolation, and intended execution capabilities. ✅ (see `architecture-spec.md` §5.1)
- Implement the Web Worker isolated runner (`runner.js`) with neutered globals (no DOM, no storage, no network). ✅
- Implement message protocol, UUID nonces, schema validation, and stale-message rejection. ✅
- Implement execution watchdog timer (5000ms), hard termination on infinite loops, and environment recreation. ✅
- Implement output truncation (max 100 entries, 2000 chars per entry) and safe text node rendering. ✅
- Wire the secure runner into `playground.js`. ✅
- Write and run automated unit, integration, and security tests (66/66 passing). ✅
- Perform live browser testing with browser subagent to verify infinite loop termination and security boundaries. ✅

### Exit criteria
- Required playground scenarios (Scenarios A through J) pass automated tests. ✅
- Infinite loops can be terminated by watchdog without freezing the application UI. ✅
- The execution boundary has been security-reviewed and remaining risks documented. ✅
- If a safe implementation cannot be demonstrated, code execution MUST remain disabled until the issue is resolved. ✅ (Safe Web Worker implementation verified)

## 7. Phase 4 — Add an exercise and feedback (COMPLETED)

### Tasks
- Define Module 1 Lesson 1 exercise (`m1-l1-ex1`: "Your First Output: Hello, JavaScript!") with starter code, target output, and progressive hints. ✅
- Implement evaluation based strictly on actual runner execution results and status, requiring exactly one output line matching "Hello, JavaScript!" (trailing newlines ignored). ✅
- Distinguish syntax errors, runtime errors, timeouts, case mismatches, and extra output lines with beginner-friendly feedback. ✅
- Implement accessible progressive hints with keyboard-operable toggle, `aria-expanded`, and collapse capability. ✅
- Integrate exercise completion with persistent progress system (`markLessonComplete("m1-l1")`), ensuring editor reset does not erase completion and repeated successful runs are idempotent. ✅
- Add comprehensive unit, component, and integration tests across exercise validation, feedback states, hint toggling, and progress propagation (93/93 tests passing). ✅

### Exit criteria
- Evaluation behavior matches the approved exercise specification. ✅
- Feedback is understandable, hints are accessible, and a learner can retry without reloading. ✅
- All tests pass, lint passes with zero warnings, and production build succeeds. ✅

## 8. Phase 5 — Multi-Lesson Expansion: Module 1 Lesson 2 (COMPLETED)

### Tasks
- Implement Module 1, Lesson 2 content (`m1-l2.js`) covering sequential top-to-bottom execution, multiple `console.log()` calls, and text strings vs. unquoted numbers. ✅
- Implement interactive exercise `m1-l2-ex1` ("Sequential Output: Player Score") with two-tier progressive hints. ✅
- Implement `validateM1L2Exercise` to validate sequential multi-line output, exact line count, and order. Document the serialized text stream limitation over the Web Worker boundary. ✅
- Implement inter-lesson navigation: "Next Lesson" footer button in lesson view and "Next Lesson →" button in celebration banner after exercise completion. ✅
- Ensure synchronization of lesson navigation, editor content, exercise configuration, hints, output, and feedback upon lesson switching while preserving earned progress. ✅
- Add unit tests in `m1-l2.test.js` (16 tests) and integration tests in `app.test.js` (7 Phase 5 tests). ✅
- Add next-lesson footer tests in `lesson-view.test.js` and next-lesson celebration button tests in `playground.test.js`. ✅

### Exit criteria
- Lesson 2 loads correct content, starter code, and exercise. ✅
- Correct sequential output passes validation and marks lesson 2 complete (`2/24`). ✅
- Missing, extra, inverted, and incorrect output produce appropriate diagnostic feedback. ✅
- Syntax, runtime, and timeout errors are handled safely. ✅
- Lesson switching and editor reset preserve completed progress. ✅
- Existing tests continue to pass, lint is clean, and production build succeeds. ✅ (122/122 tests passing, 0 lint errors/warnings, clean build)

## 9. Phase 6 — Module 1 Lesson 3: Reading Basic Syntax and Comments (COMPLETED)

### Lesson
- `m1-l3`: "Reading Basic Syntax and Comments" (10 min, prerequisite: m1-l2)

### Architecture improvement (included in this phase)
- Extract shared validator guard logic into `app/src/content/validators.js` (`createBaseValidator` factory). ✅
- Refactor `validateM1L1Exercise` and `validateM1L2Exercise` to use the shared base; all pre-existing tests pass unchanged. ✅
- Add lightweight `assertLessonShape` and key mismatch checks in `content/index.js` (DEV/test-only guard). ✅

### Tasks
- Add `m1-l3-ex1` specification to `curriculum-spec.md`. ✅
- Create `app/src/content/validators.js` and `validators.test.js`. ✅
- Refactor `m1-l1.js` and `m1-l2.js` validators to use `createBaseValidator`. ✅
- Create `app/src/content/m1-l3.js` with lesson content and `validateM1L3Exercise`. ✅
- Create `app/src/content/m1-l3.test.js` with full unit test coverage. ✅
- Register `lessonM1L3` in `content/index.js`. ✅
- Add Phase 6 integration tests to `app.test.js`. ✅

### Exercise: `m1-l3-ex1` — "Explain the Code: Fix the Comment"
- **Starter code:** A program with a missing `//` prefix on a comment line (causes `SyntaxError` on multi-token lines).
- **Expected output:** Exactly one line: `Hello from JavaScript!` (trailing newlines ignored).
- **Key validation path:** Starter code produces targeted syntax/reference diagnostic reminding learner to add `//`; corrected code passes.

### Exit criteria
- Navigating to `m1-l3` loads correct title, content, exercise, and starter code. ✅
- Running unmodified starter produces targeted feedback with `//`-fix guidance. ✅
- Corrected code passes validation and marks `m1-l3` complete (progress shows 3/24). ✅
- Lesson switching, reset, and repeated-run idempotency behave identically to Lessons 1 and 2. ✅
- `createBaseValidator` refactor passes all pre-existing tests with no test modifications. ✅
- All tests pass, lint is clean, production build succeeds. ✅ (166/166 tests passing across 13 test files, 0 lint errors/warnings, clean build)

## 10. Phase 7 — Module 1 Completion & Verification (COMPLETED)

### Objective
Complete and verify the entire Module 1 learning experience as a cohesive, accessible, beginner-friendly sequence (Lessons 1–4) achieving the Module 1 milestone: *"Run a simple program and explain its output."*

### Scope & Tasks
1. **Module 1 Lesson 4 (`m1-l4`): "Understanding Common Syntax Errors"**
   - Implement `app/src/content/m1-l4.js` with structured content covering:
     - What syntax errors are and why they are normal in programming. ✅
     - Unclosed quotation marks and string literals (instructional concept). ✅
     - Missing or mismatched parentheses. ✅
     - How to read browser and engine error messages calmly without relying on line numbers. ✅
     - Key takeaways and Module 1 milestone achievement. ✅
   - Implement interactive exercise `m1-l4-ex1` ("The Missing Parenthesis") with `validateM1L4Exercise` built on `createBaseValidator`. ✅
   - Implement unit tests in `app/src/content/m1-l4.test.js`. ✅
   - Register `lessonM1L4` in `app/src/content/index.js`. ✅
2. **Quality & Consistency Fixes Across Module 1**
   - Fix `m1-l3.js` section keys (`heading` vs. `title`) and HTML formatting for consistency with `m1-l1` and `m1-l2`. ✅
   - Support `sec.heading || sec.title` in `lesson-view.js` defensively. ✅
   - Update `app.js` upcoming-lesson placeholder text to accurately reflect Module 1 completion (Lessons 1–4). ✅
3. **Module-Wide Regression & End-to-End Verification**
   - Add integration tests in `app.test.js` verifying the full 4-lesson flow, completion progression (`0/24` to `4/24`), DOM heading rendering, and seamless navigation. ✅
   - Verify keyboard accessibility, focus visibility, error diagnostics, and reset behavior. ✅
   - Confirm 0 ESLint errors/warnings and clean production build. ✅

### Exit criteria
- Navigating to `m1-l4` renders title, objectives, sections, summary, and starter code. ✅
- Exercise `m1-l4-ex1` starter code generates targeted `SyntaxError` feedback; corrected code passes validation and marks `m1-l4` complete (`4/24`). ✅
- All 4 lessons of Module 1 can be navigated sequentially or via sidebar without state leakage. ✅
- Module 1 milestone criteria are satisfied. ✅
- Pre-existing tests continue to pass without regression. ✅
- ESLint reports 0 errors and 0 warnings, and `npm run build` succeeds cleanly. ✅ (190/190 tests passing across 14 test files, 0 lint errors/warnings, clean build)

## 11. Phase 8 — Module 2: Values and Variables (IMPLEMENTATION COMPLETE)

### Objective
Implement and verify the complete Module 2 learning experience across all 6 lessons (`m2-l1` through `m2-l6`), advancing learner progress from `4/24` to `10/24` and achieving the Module 2 milestone: *"Build a simple calculator using variables and expressions."*

### Curriculum & Lesson Breakdown
1. **`m2-l1`: Strings, Numbers, Booleans, null, and undefined** (20 min, prereq: `m1-l4`)
   - Emphasizes the five daily primitive types (`string`, `number`, `boolean`, `null`, `undefined`) while noting that JavaScript also includes two specialized primitives (`bigint` and `symbol`) reserved for advanced topics.
   - Teaches the `typeof` operator and documents the historic quirk `typeof null === "object"`.
   - Exercise `m2-l1-ex1`: Inspect runtime types using `typeof` for string, number, and boolean.
2. **`m2-l2`: Declaring Variables with const and let** (15 min, prereq: `m2-l1`)
   - Introduces variable declarations as named bindings in memory.
   - Explains default use of `const` vs mutable `let`, why modern JS avoids `var`, valid identifier naming rules, and camelCase.
   - Clarifies that `const` prevents reassigning the binding itself.
   - Exercise `m2-l2-ex1`: Declare `const courseName` and `let lessonNumber` and output values.
3. **`m2-l3`: Reassignment and Value Mutability** (15 min, prereq: `m2-l2`)
   - Distinguishes variable binding from value mutability: primitive values are strictly immutable; reassigning re-binds the variable to a different primitive.
   - Clarifies that `const` does not make objects or arrays immutable (detailed mutation reserved for Module 5).
   - Reassignment syntax (`score = 25;` without `let`/`const`).
   - Exercise `m2-l3-ex1`: Diagnose `TypeError` on const reassignment and fix by changing `const` to `let`.
   - Robust `TypeError` diagnosis: inspects error message with `/assignment to const/i` (matching V8's `"Assignment to constant variable."` and SpiderMonkey's `"invalid assignment to const 'score'"`). Ambiguous messages such as Safari's `"Attempted to assign to readonly property."` (which also occurs on unrelated read-only or getter-only property assignments) are not treated as proof of const reassignment and route to the generic `TypeError` fallback. Unrelated TypeErrors also route to the generic fallback.
4. **`m2-l4`: Operators and Expressions** (20 min, prereq: `m2-l3`)
   - Distinguishes operators (symbols) from expressions (constructs evaluating to values) assessed directly through an in-lesson comprehension check.
   - Covers arithmetic operators (`+`, `-`, `*`, `/`, `%`, `**`), operator precedence, grouping parentheses `(...)`, compound assignment operators (`+=`, `-=`, `*=`, `/=`), and template literals (`` `Total: ${total}` ``).
   - Exercise `m2-l4-ex1`: Combines arithmetic, compound assignment (`total += shipping`), numeric logging, and template literal formatted output (`Total: $50`).
5. **`m2-l5`: Type Conversion and Coercion** (20 min, prereq: `m2-l4`)
   - Explicit conversion via `Number()`, `String()`, `Boolean()`.
   - Implicit coercion mechanics: string concatenation trap with `+` vs numeric coercion with `-`, `*`, `/`.
   - `NaN` characteristics: `typeof NaN === "number"` and `Number.isNaN()`.
   - Exercise `m2-l5-ex1`: Diagnose string concatenation bug (`"40" + "60" = "4060"`) and fix with explicit `Number()` conversion.
6. **`m2-l6`: Equality and Comparisons (Milestone Capstone)** (15 min, prereq: `m2-l5`)
   - Strict equality (`===`) and inequality (`!==`) vs loose equality (`==`) and inequality (`!=`).
   - Relational comparisons (`>`, `<`, `>=`, `<=`) evaluating to booleans (`true` or `false`).
   - Milestone Exercise `m2-l6-ex1`: Build simple calculator computing `finalTotal`, checking budget (`finalTotal <= 75`), and evaluating strict equality (`finalTotal === 74`).

### Planned File Changes
- **New Content Files (6):** `app/src/content/m2-l1.js` through `m2-l6.js`.
- **New Unit Test Files (6):** `app/src/content/m2-l1.test.js` through `m2-l6.test.js`.
- **Existing Files to Update (6):**
  1. `app/src/curriculum.js` (add full `objectives` arrays to Module 2 lessons).
  2. `app/src/curriculum.test.js` (assert Module 2 objectives).
  3. `app/src/content/index.js` (register `lessonM2L1`–`lessonM2L6`).
  4. `app/src/content/index.test.js` (verify Module 2 registrations).
  5. `app/src/app.js` (update upcoming lesson placeholder).
  6. `app/src/app.test.js` (integration tests covering Module 2 flow and milestone).

### Module 2 Exit Criteria
- Navigating to any Module 2 lesson loads correct title, metadata, structured sections, comprehension checks, starter code, and hints.
- Unmodified starter code produces expected output or targeted beginner-friendly diagnostic guidance.
- Corrected code passes validation and marks lesson complete.
- Progress counter increments from `4/24` up to `10/24` (100% of Module 2).
- Editor reset preserves earned completions and repeated runs do not inflate progress.
- Sequential navigation links all 6 lessons smoothly with footer and celebration buttons.
- All pre-existing and new tests pass, ESLint reports 0 errors/warnings, and production build succeeds.
- **Verified outcome:** 252 tests passed across 20 test files; lint passed with zero warnings; production build succeeded with the known large JavaScript chunk advisory. The progress target remains 24, as specified by this phase's acceptance criteria.

## 12. Traceability

Maintain a requirement-to-specification-to-test mapping. Every MVP requirement MUST have test evidence or a documented manual verification step before release.

## 13. Definition of completion

The implementation plan is not complete merely because tasks have been attempted. Each phase must satisfy its exit criteria, actual results must be recorded, and known limitations must be reported honestly.

## 14. Phase 9 — Module 3: Decisions and Repetition (IMPLEMENTATION COMPLETE)

### Objective
Implement the six canonical Module 3 lessons (`m3-l1` through `m3-l6`) from `curriculum-spec.md`, building from Module 2 values, comparisons, and expressions toward deliberate conditional logic and finite repetition. The module milestone is a deterministic number-search/rule-based program.

### Scope and lesson assessment matrix

The canonical curriculum map defines Module 3's title, six lesson titles, and prerequisite chain. The finalized detailed content and exercise specifications are in `curriculum-spec.md` §2. The matrix below maps each lesson's observable outcomes to its checks and gated coding exercise.

| Lesson | Measurable learning outcomes | Comprehension check | Coding exercise and completion evidence |
|---|---|---|---|
| `m3-l1` Truthy and Falsy Values (15 min; prereq `m2-l6`) | Classify the taught primitive values as truthy/falsy; explain why non-empty strings `"0"` and `"false"` are truthy; predict `Boolean(value)`. | Predict Boolean results for zero, empty/non-empty strings, and `NaN`. | `m3-l1-ex1`: log four conversions; exact output `false`, `false`, `true`, `true`. |
| `m3-l2` if, else if, and else (20 min; prereq `m3-l1`) | Write an ordered conditional chain; use comparisons in conditions; explain first-match behavior and fallback `else`. | Trace scores at, below, and above boundaries; identify unreachable branches caused by ordering. | `m3-l2-ex1`: classify score 82 using supplied thresholds; exact output `Passing`. |
| `m3-l3` switch and Conditional Expressions (15 min; prereq `m3-l2`) | Select fixed choices with `switch`; use `break`/`default`; use a ternary for a simple two-way value. | Predict matching/default/fall-through outcomes and select a suitable construct for simple examples. | `m3-l3-ex1`: complete a delivery-code `switch` and a membership ternary; exact output `Express delivery`, `Member price`. |
| `m3-l4` for and while Loops (20 min; prereq `m3-l3`) | Write finite `for` and `while` loops; identify initialization/condition/update; avoid off-by-one and non-terminating loops. | Trace loop state and iteration bounds; predict accumulated totals. | `m3-l4-ex1`: calculate 1+2+3+4 with both loop forms; exact output `10`, `10`. |
| `m3-l5` break and continue (15 min; prereq `m3-l4`) | Skip the current iteration with `continue`; exit the nearest loop with `break`; trace subsequent iterations. | Predict output and control flow for a skip condition and stop condition. | `m3-l5-ex1`: count 1–6, skip 3, stop before values above 5; exact output `1`, `2`, `4`, `5`. |
| `m3-l6` Choosing an Appropriate Control Structure (15 min; prereq `m3-l5`) | Choose loops for repetition, `if` chains for ordered/range rules, `switch` for fixed choices, and ternary for a simple two-way value; combine a loop and branches. | Match short scenarios to a suitable construct and predict mixed-flow output. | Milestone `m3-l6-ex1`: deterministic search for 5 from 1–6, skip 3, report lower guesses, stop on match; exact output `1: too low`, `2: too low`, `4: too low`, `Found 5`. |

### Milestone and acceptance criteria

**Milestone:** Build a deterministic number-search/rule-based program using conditions and repetition. It is a bounded simulation, not an interactive or randomized guessing game: the approved playground runner does not provide user input, and randomness is unnecessary to assess the learning outcomes.

- All six lessons render canonical titles, objectives, ordered sections, examples, comprehension checks, exercise IDs, starter code, expected output, and two progressive hint tiers.
- Each exercise's successful runner status and required ordered output are validated with shared validators; failures, missing/extra output, incorrect output, and timeouts receive beginner-friendly feedback.
- Lesson completion is awarded only on passing validation, is persisted, survives editor reset/reload, and is idempotent on repeated successful runs.
- Sidebar, lesson footer, and exercise success navigation traverse `m3-l1` to `m3-l6` without stale editor/output/hint state.
- `m3-l6` points to the existing next curriculum entry `m4-l1`; it must render using the established upcoming-lesson placeholder, not a missing-content error.
- Keyboard operation, hint disclosure state (`aria-expanded`/`aria-controls`), and live feedback (`role="status"`, `aria-live`) are covered.
- Phase 9's then-approved progress acceptance began at `10/24` and ended at `16/24`; Module 1/2 completion and Module 2's `/assignment to const/i` targeted TypeError behavior, Safari readonly-property generic fallback, and unrelated-TypeError fallback remained unchanged.
- Full test suite, lint with no warnings, and production build pass; retain the known large-chunk advisory as a documented issue, not a Phase 9 optimization task.

### Historical Phase 9 progress decision and navigation

For Phase 9, the approved acceptance criteria preserved the then-existing `/24` display target, and implementation verification recorded Module 3 progress from `10/24` to `16/24`. This was a phase-specific decision and historical result; Phase 10's approved planning decision below supersedes `/24` for the course-wide progress indicator.

At the time, the remaining eight places in the 24-lesson target were not assigned by the Module 3 plan. The canonical curriculum remains the source of lesson navigation and contains future lesson entries without content.

`getNextLessonId()` flattens the canonical curriculum, so the final Module 3 lesson's next lesson is `m4-l1`. Preserve this convention and verify that both the lesson-footer button and success-panel next button open the Module 4 placeholder. Update the placeholder copy to say Modules 1–3 are implemented.

### File inventory

**New**
- `app/src/content/m3-l1.js` through `app/src/content/m3-l6.js`
- `app/src/content/m3-l1.test.js` through `app/src/content/m3-l6.test.js`

**Modified**
- `curriculum-spec.md` — detailed Module 3 scope, lesson outcomes, exercises, milestone, and completion rules.
- `implementation-plan.md` — the approved Phase 9 plan, acceptance criteria, and verified results.
- `app/src/curriculum.js` — add Module 3 objective arrays to its existing lesson metadata; preserve current IDs, order, titles, durations, and prerequisites.
- `app/src/curriculum.test.js` — assert Module 3 metadata, objectives, prerequisites, milestone, and stable canonical lesson count/sequence.
- `app/src/content/index.js` — register and development-validate the six Module 3 lessons.
- `app/src/content/index.test.js` — assert all six Module 3 entries resolve correctly.
- `app/src/app.js` — update upcoming-content copy to include Module 3; preserve the 24 progress denominator and current lesson flow.
- `app/src/app.test.js` — Module 3 end-to-end navigation, exercise, milestone, progress, persistence, reset/idempotency, and placeholder tests.

The existing navigation and progress mechanisms were reused. No changes were made to `runner.js`, the Web Worker message contract, `progress.js`, `navigation.js`, `feature-spec-playground.md`, or dependencies.

### Test and regression strategy

1. **Lesson unit tests:** For each lesson, assert metadata/schema, objective-to-content coverage, prerequisite, exercise ID, starter code, expected output, progressive hints, and comprehension-check content.
2. **Validator unit tests:** Cover successful ordered output; missing/extra/inverted/mismatched output; trailing-newline handling; execution failure; and timeout. Test targeted, reliable errors only where the exercise produces them; use generic TypeError guidance for ambiguous or unrelated messages and never depend on browser-specific wording.
3. **Registry/curriculum tests:** Verify unique registration, all Module 3 lesson metadata/objectives, six-lesson ordering, predecessor chain from `m2-l6`, and successor `m4-l1`.
4. **Application integration tests:** Verify sidebar/footer navigation through all six lessons, correct editor/exercise replacement, failure then corrected success for each exercise, and the final milestone's success message/next-lesson link to the placeholder.
5. **Accessibility tests:** Verify keyboard-operable hint toggles, accurate disclosure relationships/state, focusable controls, and politely announced exercise feedback for each lesson.
6. **Progress tests:** Starting from ten already-completed Module 1/2 lessons, assert `10/24` → `16/24`; repeated success does not increment twice; editor reset preserves completion; reload recreates the same count and lesson completion state; reset-all still clears it.
7. **Regression/security tests:** Run all existing tests, especially Module 1 flows and Module 2 const-reassignment diagnostic tests, plus playground and runner boundary tests. Do not execute learner programs in the privileged test/application context or alter worker isolation.
8. **Release checks:** `npm test`, `npm run lint`, and `npm run build` in `app/`; record exact results. The known minified-bundle-size advisory remains tracked and out of scope unless it blocks a check.

### Risks, assumptions, and unresolved questions

- **Truthiness misconceptions:** Learners may treat `"0"` or `"false"` as falsy. Address directly with contrastive examples and tests.
- **Conditional ordering:** Overlapping `if` branches can make later cases unreachable. Use carefully chosen boundary examples and output-specific feedback.
- **`switch` fall-through:** Omitting `break` is a common bug. Explain it and test the exercise's actual output without inspecting source.
- **Infinite loops:** A missing update can hang. Keep exercises bounded, explain termination state, and rely on the existing 5-second worker watchdog as recovery rather than a normal workflow.
- **Fixed-output validation:** Validators prove the observed output stream, not the exact control-flow construct or runtime value types. State this limitation; do not claim source-code enforcement. Use comprehension checks for construct-selection reasoning and exercises for observable behavior.
- **No interactive input:** The milestone is explicitly a deterministic simulation; adding prompt/input support would be an architecture change and is not proposed.
- **Progress scope:** Preserve the accepted `/24` target for this implementation, although the full canonical map has 64 entries. The definition of the remaining eight target lessons is unresolved for future planning; do not silently change the denominator in Phase 9.
- **Build size:** Keep the existing >500 kB chunk advisory on the known-issues list; do not couple module delivery to code splitting.
- **Baseline:** Before Module 3 implementation, 252 tests passed across 20 files; lint and the production build passed with the known chunk advisory.

### Verified implementation outcome

- `npm.cmd test`: **286 tests passed across 26 test files**.
- `npm.cmd run lint`: passed with zero warnings.
- `npm.cmd run build`: succeeded; the existing advisory remains for the 658.37 kB minified JavaScript chunk (208.29 kB gzip).
- `git diff --check`: passed.
- Historical Phase 9 verification covered all six exercises, progressive hints, accessible hint controls, failure and success feedback, lesson navigation, the `m4-l1` placeholder, persistence, idempotency, and progress from `10/24` to `16/24`.
- Module 1 and Module 2 regression tests passed, including Module 2's targeted const-reassignment diagnostic and generic fallbacks.
- The expected Module 2 score-branch wording assertion was aligned with the validator's actionable feedback during implementation; no test failures remain.
- The approved `/24` denominator, Worker execution boundary, messaging contract, progress storage, and dependencies were not changed. The outstanding eight-slot curriculum question remains unresolved as directed.
- **Changed files:** 12 new Module 3 lesson and unit-test files; 8 modified application, test, curriculum, and planning files. No unrelated files were changed by this phase; pre-existing staged repository files were preserved.

## 15. Phase 10 — Module 4: Functions (IMPLEMENTED)

### Verified repository findings at Phase 10 start

- The Phase 10 pre-implementation baseline was **286 passing tests across 26 files**; `npm.cmd run lint` passed; `npm.cmd run build` succeeded with the existing large-chunk advisory (658.37 kB minified, 208.29 kB gzip).
- `app/src/curriculum.js` contains nine modules and **64 lesson slots**. Module 4 is titled **Module 4: Functions**, contains seven lessons (`m4-l1` through `m4-l7`), and has the canonical sequence, duration estimates, and prerequisite chain shown below. `m4-l1` follows `m3-l6`; `m5-l1` follows `m4-l7`.
- At Phase 10 start, curriculum metadata gave Module 4 lesson titles, durations, and prerequisites, but no per-lesson objective arrays. `curriculum-spec.md` listed the seven canonical topics and milestone. The proposed measurable objectives, checks, and exercises were recorded in the Module 4 section of that specification.
- Module 4's canonical milestone is **“Break a multi-step problem into reusable functions.”** The constitution also requires functions, parameters, return values, scope, callbacks, and closures. The curriculum explicitly includes closures in `m4-l6` and recursion in `m4-l7`.
- At Phase 10 start, Module 4 lesson content was not registered; missing content used the generic placeholder. The navigation itself was already generated from all curriculum entries.
- At Phase 10 start, the progress display used a literal 24 denominator in `app/src/app.js`; it was not dynamically derived. Phase 10 replaced it with `getTotalLessonCount()` from the canonical curriculum. `progress.js` continues to persist completed lesson IDs without defining or enforcing a denominator.
- The canonical module counts are 4 + 6 + 6 + 7 + 8 + 7 + 7 + 10 + 9 = **64**. Module 4 has seven lessons; the former eight remaining slots after Phase 9's `16/24` therefore included the seven Module 4 lessons and one unassigned slot. Under the approved Phase 10 course-wide denominator, Module 4 starts at `16/64` and completes at `23/64`; the unassigned slot does not imply a new lesson.
- The Phase 9 implementation and its source/test changes were already present at the start of Phase 10 planning. The planning-only revision itself edited only `curriculum-spec.md` and `implementation-plan.md`; implementation followed the later explicit approval.

### Canonical sequence and objectives-to-assessment matrix

The sequence below preserves the canonical IDs, titles, durations, and prerequisites in `app/src/curriculum.js`. The lesson specification defines each objective, its comprehension check, and one practical exercise. Exercise validators must evaluate successful runner status and observed output, not inspect learner source text.

| Lesson | Objectives assessed | Comprehension check | Coding exercise / evidence | Common mistake addressed |
|---|---|---|---|---|
| `m4-l1` Function Declarations and Expressions (20 min; prereq `m3-l6`) | Define and call a declaration and a function expression; distinguish defining a function from invoking it. | Classify definition/call lines and predict call order. | `m4-l1-ex1`: call both supplied functions; output `Welcome`, then `Practice functions`. | Defining a function does not execute its body; learners may omit a call. |
| `m4-l2` Parameters, Arguments, and Return Values (20 min; prereq `m4-l1`) | Distinguish parameters from arguments; return a computed value; distinguish `return` from printing inside the function. | Trace values through a call and identify parameters versus arguments. | `m4-l2-ex1`: return and print amount + fee; output `24`; internal logging alone must not pass. | Logging is not a substitute for returning a value to the caller. |
| `m4-l3` Arrow Functions (15 min; prereq `m4-l2`) | Write and call an arrow function; return a value with an explicit block-body return and recognize expression-body form. | Convert a simple function expression to arrow form and predict its value. | `m4-l3-ex1`: complete a greeting arrow function; output `Hello, Sam`. | A block body requires an explicit `return`. |
| `m4-l4` Scope and Lexical Scope (20 min; prereq `m4-l3`) | Identify function-local and enclosing bindings; explain lexical lookup based on where code is written. | Trace visible identifiers inside and outside a function. | `m4-l4-ex1`: return a local audience and enclosing course name; output `learner: JavaScript`. | Local names do not escape their function; lookup is lexical, not based on the call site. |
| `m4-l5` Callbacks and Higher-Order Functions (25 min; prereq `m4-l4`) | Pass a function as a value; write a higher-order function that invokes a synchronous callback. | Trace callback invocation and distinguish a function value from calling it too early. | `m4-l5-ex1`: pass a score callback; output `15`. | Passing `addBonus(score)` invokes it immediately instead of passing the function value. |
| `m4-l6` Closures (25 min; prereq `m4-l5`) | Explain retained lexical bindings; use a closure for private state and distinguish independent instances. | Predict consecutive calls and a second closure's initial value. | `m4-l6-ex1`: create independent counters; output `1`, `2`, `1`. | The returned function retains its binding; separately created closures keep separate counters. |
| `m4-l7` Recursion and Common Debugging Patterns (20 min; prereq `m4-l6`) | Identify base and recursive cases; trace a bounded recursive call sequence; debug missing base cases or calls that do not progress. | Trace a small recursive total and identify the argument's progress toward its base case. | Milestone `m4-l7-ex1`: compose a recursive sum, formatter, and callback; output `Total: 6`. | Recursive calls must progress toward a reachable base case. |

Total planned seat time is **145 minutes**.

### Milestone and module acceptance criteria

**Milestone:** Break a multi-step problem into reusable functions. The `m4-l7-ex1` exercise realizes this as a small recursive summary composed from `sumSteps`, `formatTotal`, and `createSummary`, producing `Total: 6`. Earlier lesson exercises individually assess declarations/expressions, arguments/returns, arrows, lexical scope, callbacks, and closure state; the milestone need not artificially combine every topic.

- Implement exactly the seven canonical lessons, with lesson IDs, titles, durations, prerequisite chain, objectives, ordered instructional sections, worked examples, comprehension checks, summaries, exercise IDs, expected outputs, two progressive hints, and actionable feedback.
- Use one exercise per lesson following the existing content schema; each is a practical assessment tied to that lesson's objectives. Require runner success and meaningful observable output. Do not claim output validation proves a specific syntax choice.
- Teach first-class functions only as the minimal concept needed to pass callbacks. Do not create a separate first-class-functions lesson. Closures are explicitly in Module 4; recursion is explicitly in `m4-l7`.
- Keep callbacks synchronous. Do not introduce arrays/array methods, objects, `this`, DOM APIs, asynchronous callbacks, promises, or recursive data structures; those concepts are assigned to later curriculum.
- Phase 10 acceptance required `m3-l6` → implemented `m4-l1`, `m4-l7` → the then-existing `m5-l1` placeholder, and placeholder copy **Modules 1–4 (Lessons 1–23)**. Phase 11 implements Module 5 and extends that copy to **Modules 1–5 (Lessons 1–31)**.
- Course-wide progress uses the canonical total of 64 lessons, including future lessons without content. The denominator is derived from the canonical curriculum and is not maintained as a separate application constant. Progress advances from `16/64` before Module 4 to `23/64` after completing its seven lessons.
- Repeated successful runs do not increase the completed count; editor reset preserves earned completion; reload restores completed lessons and displays the same denominator; reset-all restores `0/64`. Preserve the existing localStorage representation of completed lesson IDs. Footer and success navigation follow the canonical sequence.
- Hint disclosures remain keyboard operable with correct `aria-expanded`/`aria-controls`; exercise feedback remains a polite live status. Failure must not mark a lesson complete.
- Preserve the Worker boundary, message protocol, `progress.js`, navigation architecture, and dependencies. Keep the known bundle advisory out of scope.
- Full suite, lint, and production build must pass; regression coverage must retain all M1–M3 behavior, particularly Module 2's const-reassignment diagnostic and generic TypeError fallbacks.

### Approved Phase 10 progress-denominator decision

The approved course-wide progress denominator is **64**, the number of lesson entries in the canonical curriculum (Modules 1–9), including lessons whose content is not implemented. Module 4's progress is `16/64` before implementation and `23/64` after its seven lessons are completed. Do not add a synthetic lesson to fill the former 24-slot target's unexplained eighth slot.

The current app uses a literal `TOTAL_LESSONS = 24`; it does not dynamically derive the denominator. The smallest planned change is to add an exported `getTotalLessonCount()` helper in `app/src/curriculum.js`, summing the lesson entries returned by `getCurriculum()`, and use that helper in `app/src/app.js`. Add focused curriculum coverage proving the helper reflects the canonical map (currently 64) and app integration coverage for the displayed values. Do not change `progress.js` or the stored completion-ID representation.

### Completed implementation batches and file inventory

1. **Batch 1 — `m4-l1` and `m4-l2`:** Add lesson content and focused unit tests; add their curriculum objectives and registry entries; run both lesson tests plus curriculum/registry tests.
2. **Batch 2 — `m4-l3` and `m4-l4`:** Add content and tests for arrows and lexical scope; run the focused tests and all preceding Module 4 lesson tests.
3. **Batch 3 — `m4-l5` and `m4-l6`:** Add callback and closure content/tests; verify exact outputs, isolation of closure instances, and synchronous-only scope.
4. **Batch 4 — `m4-l7` and integration:** Add recursion/milestone content and tests; finish curriculum/registry metadata; update the upcoming placeholder and add navigation, hints, feedback, completion, `/64` progress, persistence, reset, and idempotency integration tests. Run focused integration/regression tests before final checks.
5. **Release verification:** Run the full test suite, lint, production build, and diff review. Do not optimize the JavaScript chunk as part of this phase.

No optional feature improvements are proposed; keep the work limited to the seven canonical lessons, their milestone, and the required curriculum/navigation integration.

**New**
- `app/src/content/m4-l1.js` through `app/src/content/m4-l7.js`
- `app/src/content/m4-l1.test.js` through `app/src/content/m4-l7.test.js`

**Modified**
- `curriculum-spec.md` — detailed Module 4 lesson, exercise, milestone, and assessment specifications.
- `implementation-plan.md` — this Phase 10 proposal, findings, acceptance criteria, test plan, and approved progress decision.
- `requirements.md` — define the course-wide progress numerator and canonical-curriculum denominator.
- `architecture-spec.md` — specify deriving the denominator from canonical curriculum data without changing progress storage.
- `app/src/curriculum.js` and `app/src/curriculum.test.js` — add Module 4 objective metadata, the shared total-lesson-count helper, and assertions that it reflects all canonical lesson entries.
- `app/src/content/index.js` and `app/src/content/index.test.js` — register and verify the seven lessons.
- `app/src/app.js` and `app/src/app.test.js` — replace the literal denominator with the curriculum helper; update placeholder copy; verify Module 4 flows and course-wide progress.

No changes are planned to `app/src/runner.js`, the Worker message contract, `app/src/progress.js`, `app/src/components/navigation.js`, dependencies, or the bundle configuration. The denominator change affects only the curriculum-derived display; it does not redesign storage or execution.

### Test strategy, risks, and out-of-scope work

- **Unit tests:** Per lesson, verify schema, canonical metadata, objective coverage, examples, comprehension checks, exercise IDs, starter code, expected output, progressive hints, success/failure feedback, wrong/missing/extra output, runner errors, and timeout feedback. Use the shared validator utilities.
- **Curriculum/registry tests:** Verify unique registered content, canonical IDs/order/titles/durations/prerequisites, Module 4 metadata, sequence from `m3-l6` through `m4-l7` to `m5-l1`, and that `getTotalLessonCount()` derives 64 from the canonical curriculum entries.
- **Integration tests:** Verify lesson switching clears stale output/hints; failure does not complete; corrected success does; hint disclosure accessibility; footer and success navigation; milestone completion; progress `16/64` → `23/64`; repeated success does not increment; reload retains completed IDs and displays the denominator; reset preserves completion; and reset-all displays `0/64`.
- **Exact denominator-related tests to update:**
  - `app/src/app.test.js` — **“renders Module 1 Lesson 1 by default”**: initial `0/24` becomes `0/64`.
  - **“resets progress when Reset Progress button is clicked”**: replace its `1/` and `0/` prefix assertions with exact `1/64` and `0/64`.
  - **“Phase 4 integration: completing exercise marks lesson complete and updates progress counter without inflating on repeats or resets”**: assert exact `0/64` before completion and `1/64` after completion, repeat, and editor reset.
  - **“Phase 5: completing Lesson 2 exercise marks m1-l2 complete and updates progress to 2/64”**: assert `1/64` before and `2/64` after completion.
  - **“Phase 6: completing Lesson 3 exercise marks m1-l3 complete and updates progress to 3/64”**: assert `2/64` before and `3/64` after completion.
  - **“Phase 7: completing Lesson 4 exercise marks m1-l4 complete and updates progress to 4/64”**: assert `3/64` before and `4/64` after completion while retaining the Module 1 milestone assertion.
  - **“Phase 7: resetting all progress clears completion across all 4 lessons and resets counter to 0/64”**: assert `4/64` before reset and `0/64` after.
  - **“Phase 8: completes all Module 2 lessons from 4/64 to 10/64 and persists progress idempotently”**: assert the initial, every intermediate (`5/64` through `10/64`), final, repeated-run, and restored-app values.
  - **“Phase 9: completes the six Module 3 exercises from 10/64 to 16/64 and persists idempotently”**: assert the initial, every intermediate (`11/64` through `16/64`), final, repeated-run, and restored-app values.
  - In the Module 1 progress integrations **“Phase 5: resetting Lesson 2 editor preserves earned completion and does not inflate progress on repeated runs,” “Phase 6: resetting Lesson 3 editor preserves earned progress and repeated runs do not inflate counter,”** and **“Phase 7: resetting Lesson 4 editor preserves earned progress and repeated runs do not inflate counter,”** assert exact `1/64`, `1/64`, and `1/64` after completion/reset/repeat respectively, retaining the equality checks.
  - `app/src/curriculum.test.js` — add a test for `getTotalLessonCount()` that verifies it sums canonical curriculum lesson entries, including future lessons, and currently returns 64.
  - `app/src/app.test.js` — add/extend an app-level check that the denominator is `64` before and after lesson completion, remains `64` after app recreation, and resets to `0/64`.
- **Regression tests:** Run all existing M1–M3 lesson, validator, application, navigation, progress, playground, and runner tests. Confirm Worker isolation and message protocol tests continue to pass.
- **Build/lint/review:** `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check`; report the large-chunk advisory without expanding scope.
- **Risks:** Recursion can exhaust the call stack if its base case or progress is wrong; keep recursion inputs small and feedback focused on base case/progress, with existing Worker termination as a safety net. Closures and callbacks can be difficult to visualize; use small traces and precise names. Fixed-output validation can be satisfied by hardcoded output; state that limitation and assess reasoning through comprehension checks rather than source inspection.
- **Out of scope:** Any change to runner or Worker architecture, dependencies, progress storage representation, navigation architecture, arrays/objects/`this`, async callbacks, later-module content, and bundle splitting.
- **Implementation status:** Phase 10 was explicitly approved and implemented. The seven canonical Functions lessons and exercises are registered; course progress derives its denominator from the 64 lesson entries in the canonical curriculum. Application code and tests were changed only within the approved Module 4/progress scope.

### Verified Phase 10 implementation outcome

- Implemented all seven Functions lessons (`m4-l1`–`m4-l7`) with exercise validators, progressive hints, actionable feedback, and lesson-specific unit tests; registered the content and completed Module 4 objective metadata.
- Added `getTotalLessonCount()` to derive the total from `getCurriculum()` and replaced the live progress display's hardcoded 24 denominator. The stored completed-lesson IDs and Worker boundary/message contract are unchanged.
- Updated Module 1–3 progress assertions to `/64` and added Module 4 navigation, accessible-hint, failure/success feedback, milestone, persistence, idempotency, reset, and `16/64` → `23/64` integration coverage.
- `npm.cmd test`: **325 tests passed across 33 files**.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: succeeded. The existing large-chunk advisory remains (688.91 kB minified; 214.54 kB gzip) and is out of scope.
- `git diff --check`: passed.
- No dependencies or files outside the approved lesson, curriculum, registration, integration-test, and progress-display scope were changed by Phase 10.

## 16. Phase 11 — Module 5: Arrays and Objects (IMPLEMENTED)

### Verified repository findings

- **Pre-implementation baseline:** 325 tests across 33 files; lint and production build passed; `git diff --check` passed. The existing bundle advisory was 688.91 kB minified (214.54 kB gzip).
- The worktree contained pre-existing staged and unstaged work from earlier phases; that work was preserved.
- `app/src/curriculum.js` defines nine canonical modules and 64 lesson entries. Module 5, **Module 5: Arrays and Objects**, contains exactly eight lessons and retains its canonical IDs, titles, durations, and prerequisite chain. Objective metadata is now present for each lesson.
- The canonical sequence is `m5-l1` through `m5-l8`; `m5-l1` follows `m4-l7`, and `m5-l8` is followed by `m6-l1`.
- All eight Module 5 lessons are registered in `app/src/content/index.js`; the generic placeholder now identifies the available scope as **Modules 1–5 (Lessons 1–31)**.
- The app obtains the course denominator from `getTotalLessonCount()` in `curriculum.js`; this helper counts all canonical lesson entries, including future lessons. `progress.js` persists the current completed-lesson-ID list and is not to be changed.
- The architecture explicitly runs pure JavaScript for Modules 1–5 in the existing isolated Web Worker. Module 5's arrays, objects, and synchronous callbacks fit that contract; no execution-boundary or message-protocol change is needed.
- `curriculum-spec.md` records the implemented lesson outcomes, exercises, assessments, milestone, and progress/navigation decisions.

### Canonical lesson sequence and objective-to-assessment matrix

The eight lessons, titles, durations, and prerequisites below are fixed by the canonical curriculum. The implemented objectives, exercises, exact output, misconceptions, and hints are detailed in the Module 5 section of `curriculum-spec.md`. Total seat time is **185 minutes**.

| Lesson | Objectives assessed | Exercise evidence and expected output | Progression / common misconception |
|---|---|---|---|
| `m5-l1` Creating and Accessing Arrays (20 min; `m4-l7`) | Create array literals; access zero-based indexes; use `length` and `length - 1`. | `m5-l1-ex1`: read first/last stop and count; `Museum`, `Park`, `3`. | Sets up iteration; `length` is a count, not the last index. |
| `m5-l2` Iteration and Array Methods (20 min; `m5-l1`) | Iterate with `for...of`; build arrays with `push`; query membership with `includes`. | `m5-l2-ex1`: double readings into a new array; `4`, `8`, `2`, `3`, `true`. | Prepares for transforming methods; `push` appends and does not replace an array. |
| `m5-l3` `map`, `filter`, `find`, and `reduce` (30 min; `m5-l2`) | Use synchronous callbacks to transform, select, find the first match, and accumulate with an initial value. | `m5-l3-ex1`: transform scores; `6`, `14`, `10`, `18`, `Passing: 2`, `First: 7`, `Total: 24`. | Prepares transformations of object records; distinguish each method's returned value. |
| `m5-l4` Creating and Updating Objects (20 min; `m5-l3`) | Create object literals; read dot/bracket properties; update/add properties. | `m5-l4-ex1`: update book data; `River`, `3`, `A3`. | Establishes records before methods; `book.key` differs from `book[key]`. |
| `m5-l5` Methods and the `this` Keyword (25 min; `m5-l4`) | Define/call a method; use direct receiver `this` to update and return an object property. | `m5-l5-ex1`: increase an object's counter; `5`, `5`. | Prepares object behavior; `this.value` is not a local variable. |
| `m5-l6` Destructuring, Spread, and Rest Syntax (20 min; `m5-l5`) | Destructure arrays/objects; use rest to collect remaining data; use spread to expand shallow arrays/objects and arguments. | `m5-l6-ex1`: unpack and extend; `4`, `12`, `Mira`, `2`, `3`, `3`. | Prepares learners to reason about copies; rest and spread share syntax but differ by context. |
| `m5-l7` References, Mutation, and Copying (25 min; `m5-l6`) | Distinguish independent primitive bindings, object aliases, mutation, and shallow copies with shared nested references. | `m5-l7-ex1`: trace primitive/object values; `4`, `9`, `Published`, `Published`, `My copy`, `arrays`. | Prepares safer transformations; spread does not deep-copy nested arrays, and `const` does not freeze contents. |
| `m5-l8` Transforming Collections of Objects (25 min; `m5-l7`) | Read object fields in arrays; filter/map/reduce records; create derived reports without mutating source records. | Milestone `m5-l8-ex1`: fixed inventory report; `Notebook: 2`, `Pen: 3`, `Units: 5`, `Value: 9`. | Completes the data-processing milestone and prepares for browser/application work. |

### Milestone, progress, and navigation decisions

- **Milestone:** Build a deterministic inventory summary from three fixed object records. Filter out zero-stock items, map the remaining records to item labels, reduce them to unit/value totals, and print the four expected lines specified in `curriculum-spec.md`. Use no input prompts, random values, DOM, network, asynchronous behavior, or unbounded work.
- The final lesson exercise is the milestone; do not add a ninth lesson or an extra completion slot.
- Keep the canonical total fixed at **64**, derived from the curriculum. Starting with Modules 1–4 complete, progress is **23/64**. Completing all eight Module 5 lessons yields **31/64**. Repeated successful runs remain idempotent; reload retains completed IDs and the `/64` denominator; resetting all progress displays **0/64**. Preserve the existing localStorage format and `progress.js`.
- Verified canonical sequential navigation: `m4-l7` → implemented `m5-l1`; each Module 5 lesson navigates to its next lesson; `m5-l8` → the existing `m6-l1` placeholder. The generic placeholder copy is **Modules 1–5 (Lessons 1–31)**.

### Acceptance criteria and test strategy

- Implemented the eight canonical lessons with matching IDs, titles, durations, prerequisites, objective metadata, instructional sections, worked examples, comprehension checks, summaries, one exercise each, two progressive hints, actionable feedback, and completion behavior.
- Unit tests for each lesson cover metadata, objective-specific content, comprehension checks, exercise IDs and expected output, progressive hints, exact success output, incorrect/missing/extra output, applicable error feedback, and timeout handling. Ambiguous TypeErrors retain the shared generic fallback.
- Validators remain behavior-based using runner status and expected output; they do not inspect learner source or claim that output proves which construct was used. Assessment instructions and comprehension checks make the intended objective explicit.
- Curriculum tests verify all eight Module 5 objective arrays, order, titles, durations, the prerequisite chain beginning at `m4-l7`, successor `m6-l1`, and canonical count 64.
- Registry tests verify every `m5-l1`–`m5-l8` entry resolves and is shape-validated.
- App integration verifies navigation from `m4-l7` through all eight lessons to the `m6-l1` placeholder; accessible hints; failure-then-success feedback; and no completion on failure.
- Progress integration verifies `23/64` → `31/64`, idempotent repeated successes, persistence across app recreation, and reset to `0/64`. The progress storage format and `progress.js` were unchanged.
- Modules 1–4 regression tests, including Module 2 diagnostic/fallback behavior, plus validator, playground, navigation, progress, and Worker boundary/protocol tests, remain part of the full suite.
- Focused tests ran after each of the four implementation batches. Final full-suite, lint, production build, and diff-check results are recorded below.

### Completed implementation batches

1. **Arrays foundation:** Implemented `m5-l1` and `m5-l2`, their unit tests, curriculum objectives, and registry entries; focused lesson and curriculum/registry tests passed.
2. **Array transformations and object records:** Implemented `m5-l3` and `m5-l4`, tests, metadata, and registration; focused Module 5 tests passed.
3. **Object behavior and data syntax:** Implemented `m5-l5` and `m5-l6`, tests, metadata, and registration; focused lesson tests passed.
4. **References and milestone integration:** Implemented `m5-l7` and `m5-l8`, completed metadata/registration and placeholder copy, and added navigation, feedback, accessibility, progress, reload, idempotency, reset, and milestone integration coverage; focused integration and Module 1–4 regression tests passed.
Final verification follows the four implementation batches. No Worker boundary, dependency, storage-format, or bundle-splitting changes were made.

### Phase 11 file inventory

**Created**
- `app/src/content/m5-l1.js` through `app/src/content/m5-l8.js`
- `app/src/content/m5-l1.test.js` through `app/src/content/m5-l8.test.js`

**Modified**
- `app/src/curriculum.js` and `app/src/curriculum.test.js` — add and verify the eight objective lists while preserving canonical lesson metadata and count.
- `app/src/content/index.js` and `app/src/content/index.test.js` — register and verify the eight lesson contents.
- `app/src/app.js` and `app/src/app.test.js` — update placeholder copy and verify Module 5 navigation and `23/64` → `31/64` progress behavior.
- `curriculum-spec.md` — records the implemented Module 5 outcomes, exercises, assessments, milestone, and constraints.
- `implementation-plan.md` — records the Phase 11 implementation, inventory, batches, acceptance criteria, and verification.

No Phase 11 changes were made to `requirements.md`, `architecture-spec.md`, `feature-spec-playground.md`, `app/src/progress.js`, `app/src/runner.js`, the Worker messaging contract, dependencies, or the canonical denominator.

### Risks, assumptions, and out-of-scope work

- Array indexes and `length` can be confused; lessons use explicit index-zero and last-index traces.
- Learners may conflate `map`, `filter`, `find`, and `reduce`; lessons use one small dataset and contrast each callback's purpose and return value.
- `this` behavior can be ambiguous outside a method call; the lesson is scoped to direct `object.method()` calls and defers detached methods/classes/prototypes.
- Spread/rest have shared syntax but different contexts; examples and checks contrast collection with expansion.
- Shallow copying can be mistaken for deep copying; the lessons demonstrate both top-level independence and a shared nested array.
- Output-only grading can be passed by hardcoding. The existing validator architecture cannot prove source-level technique; use scaffolded callback exercises, objective-specific comprehension checks, and honest limitation statements rather than adding source inspection.
- Keep the Worker execution boundary, message contract, and security model unchanged. Avoid DOM, async APIs, classes, network, or future-module content.
- Bundle splitting remains a separate backlog item.
- **Unresolved decisions:** None.
- **Implementation confirmation:** Application source and test files were modified for the approved Phase 11 scope. New lesson content and tests were added only for `m5-l1` through `m5-l8`; no implementation is pending approval.
- **Final verification:** `npm.cmd test -- --reporter=dot` passed with **368 tests across 41 files**; `npm.cmd run lint` passed; `npm.cmd run build` succeeded; and `git diff --check` passed. The build reports the known large-chunk advisory: **729.80 kB** minified (**223.30 kB** gzip). It remains out of scope.

## 17. Phase 12 — Module 6: JavaScript in the Browser (IMPLEMENTED)

> The repository and acceptance statements below preserve the planning baseline and are superseded by the implementation record at the end of this section.

### Planning baseline (historical)

- Verified in this planning phase: `npm.cmd test -- --reporter=dot` passed with **368 tests across 41 files**; `npm.cmd run lint` passed; `npm.cmd run build` succeeded; `git diff --check` passed. The production build reports the known **729.80 kB** minified (**223.30 kB** gzip) chunk advisory; optimization remains out of scope.
- The worktree contains staged and unstaged files from prior phases. Preserve them. This Phase 12 planning update edits specifications only.
- `app/src/curriculum.js` is the canonical source. Module 6 is **Module 6: JavaScript in the Browser**, with milestone **“Build an interactive to-do list or similar application.”** It has exactly seven lessons, 155 minutes total. The canonical titles, durations, and prerequisites are reproduced in the Phase 12 section of `curriculum-spec.md`; `m6-l1` follows `m5-l8`, and `m6-l7` is followed by `m7-l1`.
- The existing canonical entries have no Module 6 objective arrays; the detailed objectives and assessment mapping in `curriculum-spec.md` are proposals, not existing canonical metadata.
- Content is registered through `m5-l8`; selecting `m6-l1` currently renders the generic upcoming-lesson placeholder. The active copy says **Modules 1–5 (Lessons 1–31)**.
- `getTotalLessonCount()` derives the denominator from all 64 canonical lesson entries. The progress store continues to record completed lesson IDs; Module 6 therefore advances from `31/64` to `38/64`.
- `app/src/runner.js` executes one code string using `new Function()` in its dedicated Worker, neutralizes network/storage APIs, and applies the existing watchdog/termination and output limits. Workers have no `document` or `window`; the protocol has no DOM/event lifecycle. Do not modify this runner or its contract for this phase.
- `app/index.html` contains a CSP meta policy (`default-src 'self'`, `script-src 'self' 'unsafe-eval'`, `worker-src 'self' blob:`, and development `connect-src 'self' ws: http:` among other directives). Architecture deployment guidance separately calls for production HTTP headers. There is no separate DOM-mode Worker, facade, or host-specific deployment-header configuration.
- The prior high-level iframe direction is superseded by the Phase 12 ADR in `architecture-spec.md` §5.8. No DOM execution mode currently exists. The proposed alternative is a bounded Worker-backed DOM-like model and trusted host renderer; implementation requires explicit approval.
- Existing tests run in Vitest/jsdom via `app/vite.config.js`. `app/package.json` has no Playwright/browser-test script or direct Playwright dependency. Real-browser security and accessibility checks are required; the browser-test mechanism and dependency decision must be resolved before implementation.
- Existing completed content follows a lesson/exercise/validator/hints structure. `app.js` currently wires a single Worker-backed playground and no knowledge-check mode. Module 6 proposes existing Worker mode, a separate DOM-mode Worker, and no-execution checks; Modules 1–5 behavior and the existing Worker protocol must remain unchanged.

### Canonical sequence and assessment matrix

The full proposed lesson-level outcomes, starter examples, expected results, hints, feedback, misconceptions, and environment are in `curriculum-spec.md` §Module 6. Summary:

| Lesson | Objectives assessed | Exercise evidence | Environment |
|---|---|---|---|
| `m6-l1` The Relationship Between JavaScript, HTML, and CSS (20 min; `m5-l8`) | Distinguish structure, presentation, and behavior; explain how the technologies cooperate. | `m6-l1-ex1`: map the three technologies to their roles; exact three-line output. | Existing Worker; no DOM needed. |
| `m6-l2` DOM Selection and Manipulation (25 min; `m6-l1`) | Select nodes, read/update text, create and append an element. | `m6-l2-ex1`: update status and append a list item; logs plus host-rendered model-state assertions. | Separate DOM-mode Worker with controlled facade; not native DOM. |
| `m6-l3` Event Listeners and Event Objects (25 min; `m6-l2`) | Register click handling, update state in response to user action, inspect `event.target`. | `m6-l3-ex1`: two user clicks produce two event observations and count 2; browser tests assert preview model state. | Separate DOM-mode Worker and validated host event bridge. |
| `m6-l4` Form Input and Validation (25 min; `m6-l3`) | Read labeled input, prevent modeled default submission, trim/validate, report accessibly. | `m6-l4-ex1`: blank submission reports an error; `Review DOM` appends one task with success, focus, and count behavior. | Separate DOM-mode Worker; hosts the DOM milestone, not full module completion. |
| `m6-l5` Modules and Imports/Exports (20 min; `m6-l4`) | Identify named exports/imports, binding-name match, and relative file path. | `m6-l5-ex1`: accessible no-execution quiz selects the matching named import and predicts its call result. | No learner-code execution; demonstrates syntax/path recognition and prediction, not multi-file execution. |
| `m6-l6` Error Handling with `try` and `catch` (20 min; `m6-l5`) | Throw and catch an `Error`, inspect `error.message`, distinguish handled/uncaught errors. | `m6-l6-ex1`: synchronous invalid-name example prints `Handled: Name is required`. | Existing Worker; no DOM or async code. |
| `m6-l7` Browser Debugging Tools (20 min; `m6-l6`) | Select DevTools tool, choose a breakpoint/step, inspect a variable, distinguish logic errors from runtime errors. | `m6-l7-ex1`: accessible no-execution quiz traces an off-by-one sum bug and selects a diagnostic breakpoint/Watch value. | No learner-code execution; conceptual DevTools knowledge only, not practical debugging within the app. Completes Module 6. |

### Execution architecture decision

The Phase 12 ADR in `architecture-spec.md` §5.8 compares direct sandboxed iframe execution (A), a controlled DOM interface backed by the existing Worker model (B), and a DOM simulation (C). **B is recommended conditionally**, with explicit educational limitations: learner code operates on a bounded virtual tree, not native DOM nodes; the trusted host renders validated state with safe DOM APIs. This maintains Worker watchdog termination for synchronous runaway code while avoiding a reference to the platform DOM. C is suitable for conceptual checks but not the interactive DOM milestone. A is rejected as the default because a renderer-blocking loop cannot be reliably terminated by a parent timer; iframe removal is not a demonstrated hard kill.

The existing pure-JavaScript Worker protocol remains unchanged. DOM mode requires a distinct versioned protocol and Worker/facade, validation of schema, source, run identity, node/event IDs, operation types and quotas, and cleanup on timeout/rerun/reset/lesson switch/destruction. Proposed limits: 200 nodes, depth 20, 50 listeners, 100 combined protocol/output entries, 2,000 characters per string, and at most 5,000ms for learner initialization and each individual event callback. The watchdog is inactive while awaiting user interaction and restarts for each dispatched event; user events are rate-limited under the 100-entry cap. No hard memory quota or complete sandbox security is claimed.

**Threat model and required cases:** Treat source and every message/output as untrusted. Deny platform `document`/`window`, application/progress state, storage, network, location/navigation, and privileged host commands. Test `while (true) {}`, deep/non-terminating recursion, long computation, event/node/depth/message/output floods, malformed/repeated/stale messages, unexpected IDs/types, oversized strings, and forbidden globals/capability access. Confirm the Worker watchdog preserves parent responsiveness in the agreed browser matrix; a passing test applies only to tested environments, and browser engine/process failures or memory exhaustion remain possible.

### Milestone, progress, and navigation

- **DOM milestone/capstone:** `m6-l4-ex1` implements an accessible mini to-do list in the controlled preview, using a fixed initial two-task fixture. Blank submission is rejected without changing the list; Enter submits `Review DOM`, appends one task, clears/refocuses input, and announces the addition; keyboard activation of a checkbox updates completion state/count. No network, storage, random data, or asynchronous concept is introduced. This is not completion of the seven-lesson module; Module 6 completes after `m6-l7`.
- Browser automation must verify host-rendered model changes, live-region text, labels, focus, keyboard interaction, Worker watchdog responsiveness, and cleanup when rerunning, resetting, changing lesson, or destroying the app.
- Preserve `31/64` → `38/64`, idempotent completion, reload persistence, reset to `0/64`, existing completed-ID storage, and the canonical denominator.
- Verify navigation `m5-l8` → implemented `m6-l1`, sequentially through `m6-l7`, then to the existing `m7-l1` placeholder. Update placeholder copy to **Modules 1–6 (Lessons 1–38)**.

### Proposed file inventory

**New**
- `app/src/content/m6-l1.js` through `app/src/content/m6-l7.js` and matching seven unit-test files.
- `app/src/components/dom-playground.js` and tests for the separate DOM Worker lifecycle, bounded virtual tree, trusted renderer integration, protocol validation, and cleanup.
- A DOM-mode Worker module, e.g. `app/src/dom-runner.js`, with a versioned protocol kept separate from `runner.js`, plus focused tests.
- `app/src/components/knowledge-check.js` and tests for accessible no-execution `m6-l5`/`m6-l7` assessments.
- Real-browser tests for rendered DOM-model interactions, accessibility, watchdog responsiveness, protocol boundaries, and teardown; exact test path/tool depends on approved browser harness.

**Modified**
- `app/src/curriculum.js` / `.test.js`: add approved Module 6 objectives and verify canonical metadata, order, prerequisite chain, successor, and total 64.
- `app/src/content/index.js` / `.test.js`: register and structurally validate Module 6 content and exercise kinds.
- `app/src/app.js` / `.test.js`: select existing Worker/DOM Worker/knowledge-check mode, cleanup previous DOM state on lesson transitions, update placeholder copy, and test Module 6 navigation/progress.
- `app/index.html`: only if needed for DOM Worker mode or test harness; retain existing Worker directives and do not weaken CSP.
- `app/src/style.css`: controlled preview sizing, focus visibility, responsive layout, and accessible status styles if required.
- `app/package.json`, lockfile, and test configuration only if an approved repeatable browser harness requires an additional dependency.
- `curriculum-spec.md`, `implementation-plan.md`, `architecture-spec.md`, `requirements.md`, and `feature-spec-playground.md`: record this proposal and its approval gates.
- A deployment response-header configuration file is **not** presently present; its path and changes depend on selecting/confirming the hosting platform. Do not guess a host-specific config.

**Unchanged by design:** `app/src/runner.js`, the Web Worker message contract, existing progress storage, Modules 1–5 content/validators, and dependencies unless a separate browser-test dependency is approved.

**Instructional versus architectural scope:**

- **Instructional/content work:** the seven lesson files, approved curriculum objective metadata, examples, comprehension checks, exercise specifications, validators for Worker exercises, and lesson-specific unit tests.
- **Approved architecture/security work:** the controlled DOM facade/API and quota policy, separate DOM Worker protocol, host renderer/event bridge and cleanup, DOM exercise assessment, no-execution knowledge-check UI/completion route, and browser verification. These items were implemented only after the explicit approval recorded in Phase 12.

### Approved implementation batches (completed)

0. **Architecture approval/spike (completed before implementation):** ADR §5.8, controlled API, caps, and threat model were explicitly approved. Browser testing demonstrated Worker watchdog termination and renderer/event round-trips; the ordinary Worker contract was not modified.
1. **Browser foundation:** Add Module 6 metadata, `m6-l1` Worker lesson, `m6-l2` DOM-model lesson, DOM-mode Worker/facade and host renderer; focused content, registry, protocol, and browser tests.
2. **DOM interaction and milestone:** Add `m6-l3` events and `m6-l4` forms/to-do DOM milestone; test host-rendered control interactions, Enter submission, validation, live announcements, focus, rerun/reset/lesson cleanup, quotas, and stale-message rejection in real browsers.
3. **Non-DOM lesson modes:** Add `m6-l5` knowledge check, `m6-l6` Worker error-handling lesson, and `m6-l7` DevTools knowledge check; test quiz accessibility/retry/completion and Worker feedback independently.
4. **Integration and release:** Complete navigation, progress, persistence, idempotency, reset, Module 1–5 regression, security-boundary and browser matrix checks; run full Vitest, lint, production build, and diff review.

### Acceptance and test strategy

- Verify exact canonical Module 6 title, seven IDs/titles/durations/prerequisites, approved objective arrays, 155-minute total, and `m6-l7` → `m7-l1`.
- Each lesson gets its own test file. Cover metadata, learning sections/worked example, comprehension check, exercise type/starter/expected result, two-tier hints or quiz feedback, success/failure/retry, and appropriate output/error behavior.
- `m6-l1` and `m6-l6` use existing Worker validators; explicitly test no DOM access and preserve worker termination/protocol regression tests.
- DOM exercises run in actual supported browsers. Verify learner code has no platform `document`/`window`, application state, storage, network, or navigation capability; malformed, stale, oversized, unknown, and duplicate protocol operations are rejected; output is safely rendered; and teardown terminates the Worker and clears listeners/state.
- Exercise the runaway-code gate with a short outer test deadline. Assert `while (true) {}`, recursion, and long computation trigger Worker termination while parent controls/navigation remain responsive. Cover node/listener/depth/output quotas and continue with rerun after timeout. If the agreed matrix fails, do not proceed with DOM mode.
- Test Module 6 knowledge checks with keyboard-only interaction, accessible labels/focus, correct and incorrect selection, useful feedback, retries, and idempotent completion; verify these checks do not invoke either code runner.
- App integration verifies `31/64` → `38/64`, each lesson completion once, app recreation persistence, reset to `0/64`, navigation from `m5-l8` through `m6-l7` to `m7-l1`, and disposal of DOM sandbox state at every transition.
- Run all Module 1–5 regressions, full Vitest, ESLint, production build, and `git diff --check`. Report the large-chunk advisory separately.

### Hosting and browser-test requirements

- Target browser baseline: current and previous major stable desktop releases of Chrome, Edge, Firefox, and Safari. Only Chromium/Electron was tested; this is not full browser certification.
- Development uses Vite localhost. Production is assumed HTTPS with documented response headers and a reviewed CSP compatible with the existing Worker. No production host/configuration is identified, so do not invent host-specific deployment files. The controlled DOM model does not require an isolated iframe origin.
- Continue Vitest/jsdom for lesson schemas, validators, protocol handling, and UI state. Real-browser tests are required for host-rendered controls, keyboard/focus/live-region behavior, Worker watchdog responsiveness, and teardown. Repository inspection found no Playwright setup or direct dependency; confirm available tooling and CI lifecycle first, and do not add dependencies during planning.
- Browser test processes must have explicit deadlines, own and close their browser/context in `finally`, and terminate only a specifically identified test-owned process after timeout. No uncontrolled browser process may be left running.

### Risks and unresolved decisions after implementation

- **Worker resource risk:** Watchdog termination protects the application event loop from synchronous CPU loops but is not a hard memory quota or complete sandbox security. Only Chromium/Electron was browser-tested; no universal guarantee is made.
- **Hosting unresolved:** No production deployment platform/header configuration is present. Confirm HTTPS hosting, security headers, and Worker compatibility before deployment.
- **Browser matrix unresolved:** The target Chrome/Edge/Firefox/Safari matrix is not fully tested. The project still has no in-repository browser automation or CI browser suite.
- **Module lesson execution:** `m6-l5` assesses import/export recognition and output prediction without executing a multi-file project. `m6-l7` assesses DevTools concepts and does not provide an integrated debugger.
- Keep asynchronous JavaScript, fetching, frameworks, and bundle optimization out of scope.
- **Implementation confirmation:** Module 6 is implemented and registered. The four approved batches are complete; the ordinary Worker protocol and canonical 64-lesson progress denominator are preserved.

### Phase 12 implementation record

- Implemented all seven canonical lessons, objective metadata, exercises, validators, hints/knowledge checks, navigation, progress integration, and the `m6-l4` DOM milestone. Module completion remains after `m6-l7`.
- Added a separate DOM model/Worker/runner/protocol, host-rendered preview, and accessible no-execution knowledge checks. The ordinary JavaScript Worker protocol was not changed. The host preview renders validated text and controls; no host document or application state is passed to the Worker.
- Worker capabilities including fetch, XHR, WebSocket, WebSocketStream, WebTransport, storage, location, Worker constructors, timers, and EventTarget methods are disabled on the Worker global and inherited prototypes. Acorn AST inspection rejects dynamic `import()` before evaluation, and function-constructor access is disabled to prevent indirect source generation. The Worker still uses `Function` for learner code; this is a constrained execution environment, not a complete VM sandbox. There is no hard memory quota.
- Browser verification used the integrated browser: Chrome 150.0.7871.250 / Electron 43.8.3. Verified DOM preview, form validation, focus restoration, checkbox/live-count behavior, keyboard-only knowledge checks, prototype/global capability blocking, listener/node/output caps, stack overflow handling, synchronous and post-result runaway termination, main-page responsiveness, rerun after timeout, lesson-switch cleanup, progress persistence/reset, and navigation to the `m7-l1` placeholder. Development and Vite production-like preview verified bundled Worker startup and timeout; a direct learner `import()` attempt was rejected. No Firefox, Edge, or Safari results are available.
- Automated verification: `npm.cmd test -- --reporter=dot` passed with **421 tests across 52 files**; `npm.cmd run lint` passed; `npm.cmd run build` succeeded; `git diff --check` exited successfully. The build reports a **775.74 kB** minified (**236.15 kB** gzip) chunk warning. Bundle optimization remains a separate backlog item.
- The current `app/index.html` meta CSP narrows development connections to `'self'` and `ws:`. Vite dev and preview responses now apply distinct application and DOM Worker CSPs and shared response security headers; preview headers were verified against the served document and hashed Worker asset. The actual production host remains unknown, so production header configuration, HTTPS/HSTS, and cross-browser certification remain deployment requirements.

### Phase 12.1 security closeout

- Confirmed pre-hardening that same-origin `import()` could load a module from the DOM Worker. The document policy was not an effective Worker import restriction. Added Acorn as a direct runtime dependency to parse the learner program and reject `ImportExpression` nodes rather than filtering source with a regular expression. Disabled global and function-prototype constructor paths that could create unchecked code.
- The DOM Worker retains same-origin static imports required by its bundled implementation. Its response CSP is distinct from the application CSP: it allows same-origin scripts and required dynamic evaluation, while denying child Workers, network connections, object embedding, base changes, forms, and frames. Dynamic imports using same-origin, cross-origin, data, blob, or other URL forms are rejected by the AST policy; browser probes also observed CSP blocking cross-origin and blob module loads. Static application imports continue to load.
- Added syntax-policy tests for URL variants, nested and template-expression imports, string/comment false positives, malformed source, and indirect constructor access; response-header tests exercise both Vite development and preview hooks. Added an app integration test that checks the active DOM Worker is terminated and its run state cleared when navigating to a knowledge-check lesson.
- Live evidence: Vite dev and production-like preview served the intended application and dedicated Worker CSP headers. In the integrated Chromium 150.0.7871.250 / Electron 43.8.3 browser, the production-like Worker started, direct learner `import()` failed safely, `while (true) {}` was terminated, the host remained responsive, and a subsequent legitimate DOM exercise ran. This is not a production-host verification or a universal browser guarantee.
- Production deployment is **not yet ready**: the actual HTTPS hosting target is unspecified. Before deployment, verify the document and hashed DOM Worker response headers on that host, then run browser-level tests against the supported current/previous stable releases of Chrome, Edge, Firefox, and Safari. Only Chromium/Electron was tested; other browsers remain unverified. No hard memory quota or complete security guarantee is claimed.

## Phase 13 — Master Completion Plan: Modules 7–9 (APPROVED; MODULE 7 IMPLEMENTED)

**Status:** Master plan approved. Module 7 implementation is authorized and completed; Modules 8–9 remain planned and are not authorized to begin until the Module 7 completion report is reviewed.

### Verified repository findings

- `app/src/curriculum.js` is the canonical source and contains exactly 64 lessons. Modules 1–6 contain 38 lessons; Modules 7–9 contain 26 (7 + 10 + 9). The existing curriculum map supplies all remaining titles, durations and a linear prerequisite chain through `m9-l9`.
- Module 7 totals 165 minutes; Module 8 totals 215 minutes; Module 9 totals 230 minutes. Current reported course progress is 38/64. Target progress is 45/64, 55/64, then 64/64.
- The content registry has 38 lesson definitions through `m6-l7`; no M7–M9 content modules/tests are registered. `curriculum.js` does not yet include objectives for the 26 remaining entries. Proposed objectives and exercises are fully specified in `curriculum-spec.md` §9; no canonical lesson title or prerequisite is changed by this plan.
- Existing lessons use isolated content modules with objectives, instructional sections, an exercise, hints and validator; matching Vitest tests verify metadata/content and expected/mismatch/error cases. The registry validates lesson shape. The playground currently supports ordinary Worker, controlled DOM, and no-execution knowledge-check modes.
- `createRunner` supports an immediate return value that is thenable, but it does not support top-level `await`, explicit unhandled-rejection collection, or tracked timer completion. The ordinary Worker exposes native timer APIs. `done` clears the host watchdog but does not terminate the Worker, so timers can remain active after completion; later messages are filtered but continued work is not. Current runner tests do not comprehensively test Promise/timer completion.
- The DOM training Worker remains a separate synchronous model and deliberately disables timers/network. Do not reuse or broaden its contract for Module 7.
- Phase 12.1 local Vite application/Worker headers were verified, but production hosting remains unknown. Only integrated Chromium/Electron was browser-tested; Firefox, Edge and Safari remain unverified. The main bundle advisory remains separate technical debt.

### Canonical sequence and progress gates

The exact canonical IDs, titles, durations and prerequisites are listed in `app/src/curriculum.js` and reproduced with proposed lesson plans in `curriculum-spec.md` §9.

| Gate | Completed lessons | Progress | Milestone |
|---|---:|---:|---|
| Current | 38 | 38/64 | Through `m6-l7`. |
| Module 7 | 45 | 45/64 | `m7-l7`: controlled HTTP data, loading/success/error/retry. |
| Module 8 | 55 | 55/64 | `m8-l10`: explain and build a bounded object/class model. |
| Module 9/final | 64 | 64/64 | `m9-l9`: framework-neutral application model and transfer explanation. |

### Cross-module implementation decisions and approval gates

1. **Async execution decision (approved and implemented).** A separate `async-worker` mode preserves the synchronous runner and DOM Worker contracts. It supports a settled root Promise, top-level `await`, tracked timer/request completion, bounded output and timers, unhandled-rejection reporting, a parent watchdog, terminal Worker cleanup, and stale/duplicate message rejection. The implementation is specified in `architecture-spec.md` §5.9.
2. **API decision (approved and implemented).** Learner code receives no direct network access. The host bridge allows only fixed GETs to `https://jsonplaceholder.typicode.com/todos/1` and `/todos/999999999`, validates both message directions and response structure, omits credentials, rejects redirects, bounds size/time/requests, and preserves HTTP status versus network rejection. The public endpoint's CORS behavior was verified from the localhost app origin; it requires no key or authentication.
3. **The canonical Module 7 milestone is resolved.** The approved external endpoint satisfies the required external-data milestone; it is not a same-origin fixture. Endpoint and response details are recorded in `curriculum-spec.md` §9.1. The endpoint remains an external availability dependency.
4. **No Module 8 architecture expansion is needed.** Use the existing synchronous Worker for constructors, prototypes and classes. Explicitly connect class methods to prototypes and avoid repeating Module 5 object/method instruction.
5. **No Module 9 framework or module loader is approved.** Reuse the synchronous Worker for single-source algorithms/view models and accessible no-execution checks for file organization, code reading and framework transfer. Do not claim static multi-file import execution.
6. Continue the Phase 12.1 deployment and browser-test requirements; do not claim production security or cross-browser readiness based on Vite preview/Chromium evidence.

### Proposed file inventory

| Area | Proposed files | Purpose |
|---|---|---|
| Async infrastructure | `app/src/async-runner.js`, `app/src/async-runner.test.js`; possibly a small internal host-request helper and its test | Separate Promise/timer lifecycle and allowlisted host request bridge while retaining existing `createRunner` result callbacks where practical. |
| Playground integration | `app/src/components/playground.js`, `playground.test.js`, `app/src/app.js`, `app.test.js` | Select `async-worker` mode; show accessible pending/terminal state; cancel on reset/navigation/destruction; test M7 progress. |
| External API bridge | `app/src/async-fetch.js`, `async-fetch.test.js`, `app/index.html`, `app/vite.config.js`, `app/src/security-policy.test.js` | Fixed external HTTPS endpoint allowlist, host-side bounded request validation, and matching local CSP configuration. |
| Lesson content | `app/src/content/m7-l1.js`–`m7-l7.js` and matching tests; `m8-l1.js`–`m8-l10.js` and matching tests; `m9-l1.js`–`m9-l9.js` and matching tests | All 26 lessons, each isolated and behavior-tested. |
| Registry/curriculum | `app/src/content/index.js`, `index.test.js`, `app/src/curriculum.js`, `curriculum.test.js` | Register content and add approved objective metadata without changing canonical order/duration/prerequisites or denominator. |
| Existing infrastructure tests | `app/src/runner.test.js`, `app/src/dom-runner.test.js`, playground and app integration tests | Regression checks only; preserve existing synchronous and DOM protocol behavior. |
| SDD documents | `curriculum-spec.md`, `implementation-plan.md`, `requirements.md`, `architecture-spec.md`, `feature-spec-playground.md` | Record approved behavior and acceptance/verification results; update only after decisions are approved. |

No separate DOM model changes, persistent progress-schema changes, framework package, general network proxy, production hosting provider, or module bundler are proposed.

### Ordered implementation roadmap

Every implementation batch adds no more than two lessons and runs focused tests before proceeding.

#### Gate 0 — approve and verify execution design

- Review and explicitly approve/revise the async-runner and host-fetch proposal in `architecture-spec.md` §5.9.
- Establish baseline full suite, lint, build and diff checks; record worktree state and preserve existing staged/unstaged changes.
- Confirm ordinary Worker, DOM Worker, CSP, output protocol, and browser matrix constraints before adding the mode.

#### Batch A — asynchronous foundation (no lesson content)

- Implement the separate async Worker/runner contract, tracked `setTimeout`/`clearTimeout`, Promise-root completion, rejection/error handling, quotas, terminal cleanup and recovery. Implement the allowlisted fetch bridge only if specifically approved.
- Tests: sync return, Promise fulfil/reject, callback error, unhandled rejection, timer ordering/cancel/overflow, microtask-before-timer order, pending Promise, infinite loop, timer loop, late output, stale/duplicate/malformed messages, request 404/network/size/timeout, reset/lesson teardown, Worker recovery, and unchanged ordinary/DOM protocols.
- Real-browser stop gate: if any supported tested browser cannot terminate runaway work while keeping the host responsive, stop and report before lesson implementation.

#### Module 7 — four small batches

1. `m7-l1`–`m7-l2`: event-loop prediction and callback exercise; test no-execution mode plus timer ordering/completion.
2. `m7-l3`–`m7-l4`: Promise chain and `async`/`await`; test values, `finally`, returned root settlement and rejection recovery.
3. `m7-l5`–`m7-l6`: asynchronous error handling and controlled HTTP GET; test caught/unhandled rejection, response status/JSON, request bounds and fixture policy.
4. `m7-l7`: loading, failure, retry and the module milestone; test success/error/stale request UI, keyboard/screen-reader feedback and `38/64` → `45/64`.

At each batch, update lesson registry/objectives/navigation tests and run focused unit and integration tests. After M7, run all tests, lint, build and real-browser async/security checks.

#### Module 8 — five small batches

1. `m8-l1`–`m8-l2`: object-model retrieval and constructor functions/prototypes.
2. `m8-l3`–`m8-l4`: prototype lookup/shadowing and classes-as-prototype syntax.
3. `m8-l5`–`m8-l6`: instance `this`, `extends`, and `super`.
4. `m8-l7`–`m8-l8`: private invariants and polymorphic behavior.
5. `m8-l9`–`m8-l10`: composition trade-offs and OOP fit assessment/milestone; verify `45/64` → `55/64`.

Each batch has per-lesson content/validator tests and focused app navigation/completion tests. After M8, run complete suite/lint/build and regress all Modules 1–7.

#### Module 9 — five small batches

1. `m9-l1`–`m9-l2`: module responsibility (no multi-file execution) and reusable pure helpers.
2. `m9-l3`–`m9-l4`: immutable updates and derived state.
3. `m9-l5`–`m9-l6`: event/action flow and framework-neutral view-model composition.
4. `m9-l7`–`m9-l8`: evidence-based code/docs reading and framework responsibility transfer.
5. `m9-l9`: final integrated framework-neutral capstone; verify all objectives, `55/64` → `64/64`, retry, idempotency, persistence and reset.

At each batch, test all new exercises and previous module navigation. After M9, run full regressions for Modules 1–9.

#### Gate 10 — final curriculum release validation

- Verify all 64 canonical lesson entries have registered content and the exact title, objective, prerequisites, order, and completion assessment.
- Verify navigation `m6-l7` → `m7-l1` → `m7-l7` → `m8-l1` → `m8-l10` → `m9-l1` → `m9-l9`; verify all progress transitions and local-storage persistence/idempotency/reset.
- Run full Vitest suite, ESLint, production build and `git diff --check`; review all changed files and update specifications with actual results only.
- Execute real-browser tests across the explicitly supported current/previous desktop Chrome, Edge, Firefox and Safari releases, including async watchdog/responsiveness, worker recovery, network boundary, accessibility/keyboard, and lesson cleanup.
- Verify deployed HTTPS document and Worker headers and the controlled fixture path against the actual production host. If host or browser coverage is unavailable, state that release readiness remains unverified.

### Final acceptance criteria

- Exactly all 64 canonical lessons are implemented, registered and navigable; no title, prerequisite, sequence or denominator changes are implicit.
- Every lesson objective maps to a meaningful, tested coding exercise, prediction, evidence-based check or capstone criterion. Content is technically accurate and avoids repeated fundamentals or premature framework concepts.
- Async execution distinguishes microtasks from timer tasks, awaits explicit completion, surfaces rejection/error correctly, bounds and cancels work, rejects stale messages and leaves the host responsive.
- HTTP access remains limited to the approved fixture bridge; no direct arbitrary egress, credentials, secrets or privileged app APIs reach learner code.
- Module 8 demonstrates prototypes as the basis for classes, plus encapsulation, inheritance, polymorphism and composition. Module 9 remains framework-neutral and does not claim multi-file imports execute.
- Progress transitions exactly `38/64` → `45/64` → `55/64` → `64/64`; completion is idempotent and persists; reset restores `0/64`.
- Accessible controls, visible keyboard focus, announced loading/error/success states, responsive lessons, safe feedback, and cleanup are verified.
- Existing Modules 1–6 remain regression-free; complete suite, lint and production build pass.
- Production CSP/headers and the agreed browser matrix are verified on actual targets before claiming production readiness. Preserve known no-hard-memory-quota/security limitations and bundle advisory.

### Risks and unresolved decisions

- **Architecture approval required:** separate async Worker lifecycle and the host-mediated HTTP bridge. No implementation is authorized in Phase 13.
- **Fixture hosting:** production must serve the public same-origin JSON fixture with correct content type and headers; actual host is currently unspecified.
- **Promise/task quiescence:** native JavaScript does not provide a general “all async work is done” signal. The proposed runner deliberately supports only returned Promise roots, tracked timers, and approved host requests; it cannot safely promise completion for arbitrary unreturned work.
- **Security/performance:** no hard memory quota or complete sandbox guarantee; termination and message caps do not eliminate browser-process failure. Host-mediated fetch broadens the trusted application surface and requires review.
- **Browser and deployment readiness:** only Chromium/Electron was tested in the prior phase, and actual production headers remain unverified. Firefox, Edge and Safari and the final host remain release gates.
- **Scope:** framework-specific instruction, multi-file execution, arbitrary internet access, bundle optimization and hosting selection are excluded unless approved separately.

**Phase 13 implementation status:** The master plan is approved. Module 7 implementation is complete; Modules 8–9 remain planned and have not been started. The earlier planning findings and batch roadmap above describe the state at plan creation. The approved Module 7 architecture, endpoint decision, curriculum updates, and implementation status supersede the former approval gates.

Module 7 adds `async-worker.js`, `async-runner.js`, and `async-fetch.js` as a separate execution path. It preserves the ordinary Worker and DOM Worker protocols. The worker supports top-level `await`, tracked timers and mediated fetch requests, root-Promise settlement, unhandled-rejection failure, output/message limits, stale-ID rejection, termination and recovery. The main thread performs only the two approved API requests; worker CSP denies direct connections and child Workers. The configured limits do not provide a hard memory quota or a complete security guarantee.

The approved API responses were verified from Vite localhost in integrated Chromium. The Vite development/preview policies now allow the endpoint in the application policy and apply the restricted response policy to both DOM and Async Workers. Production hosting headers remain unverified. Browser evidence is limited to integrated Chromium 150.0.7871.250 / Electron 43.8.3; Firefox, Edge, and Safari remain unverified. Therefore, production deployment and the full supported browser matrix are not certified.

The final course denominator remains 64; the Module 7 target is `45/64`. Do not begin Modules 8 or 9 until the Module 7 completion report has been reviewed.
