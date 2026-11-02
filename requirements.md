# Product Requirements — Interactive JavaScript Learning Platform

**Version:** 1.0  
**Status:** Proposed baseline for implementation  
**Parent:** `constitution.md`

## 1. Product objective

Deliver a beginner-friendly, interactive website that teaches JavaScript from fundamentals through OOP and prepares learners to study unfamiliar JavaScript frameworks.

## 2. Target users

- Complete beginners with no programming experience.
- Learners who want to strengthen their JavaScript fundamentals.
- Developers preparing to learn JavaScript frameworks.

## 3. Core user journey

A learner should be able to:

1. Open the website and identify where to begin.
2. Browse a structured learning path.
3. Read a lesson and study a working example.
4. Modify and run JavaScript in the browser.
5. Complete a related exercise.
6. Receive understandable feedback and retry.
7. See completed lessons and continue learning.
8. Progress toward writing and understanding object-oriented JavaScript.

## 4. MVP scope

The first release MUST include:

- Curriculum overview and lesson navigation.
- A structured lesson page.
- An interactive JavaScript playground.
- At least one automatically evaluated coding exercise.
- Feedback, hints, and retry behavior appropriate to the exercise.
- Local lesson-progress persistence.
- Responsive and keyboard-accessible essential flows.
- Automated tests for core functionality and execution boundaries.

The MVP MUST demonstrate the full learning journey with the first lesson. It MUST NOT require authentication, cloud storage, AI tutoring, leaderboards, or paid services.

## 5. Functional requirements

### FR-001 — Curriculum navigation

Learners MUST be able to browse the curriculum, identify the recommended starting point, open lessons, and revisit earlier lessons.

**Acceptance criteria:**
- A new learner can identify the first lesson without prior instruction.
- Lessons display titles and learning objectives.
- Available lessons can be opened and revisited.
- Navigation remains usable on supported screen sizes.

### FR-002 — Lesson content

Every published lesson MUST include a learning objective, explanation, verified example, and practice activity.

**Acceptance criteria:**
- Explanations use beginner-friendly language appropriate to the lesson.
- Each code example has a documented expected result or behavior.
- Examples and explanations are consistent.
- Prerequisites are identified when relevant.

### FR-003 — Code editing and execution

Learners MUST be able to edit JavaScript and run it in an isolated execution environment.

**Acceptance criteria:**
- The learner can modify a supplied example.
- A Run action executes the latest submitted code.
- The output panel displays supported console output in order.
- Successful execution with no output is distinguishable from failure.
- Syntax and runtime errors produce understandable feedback.
- Code exceeding execution limits is terminated and reported.
- The editor and lesson remain usable after a failed run.
- Execution MUST NOT expose privileged application data or functionality.

### FR-004 — Exercise evaluation

Each coding exercise MUST define its instructions, expected behavior, validation method, success criteria, and failure feedback.

**Acceptance criteria:**
- Learners can submit or run a solution as specified by the exercise.
- Evaluation is based on defined criteria, not merely visual similarity or exact formatting unless formatting is part of the objective.
- Correct and incorrect cases are covered by tests.
- A learner can retry an unsuccessful exercise.

### FR-005 — Feedback and retry

Learners MUST be able to retry unsuccessful exercises. Feedback MUST identify the relevant concept and offer a useful hint without necessarily revealing the complete answer.

**Acceptance criteria:**
- Feedback distinguishes success from failure.
- Hints are related to the learning objective.
- Retrying does not require reloading the lesson.
- Feedback remains understandable to a beginner.

### FR-006 — Progress persistence

The application MUST persist completed lessons locally and restore that progress after a page reload.

**Acceptance criteria:**
- Completion state is visible in the curriculum.
- Progress is restored after a reload in the same browser profile.
- The course-wide progress indicator displays the number of completed lesson IDs out of the total lesson entries in the canonical curriculum, including lessons whose content is not yet implemented.
- The denominator is derived from the canonical curriculum data and MUST NOT be a separately maintained literal.
- The denominator currently evaluates to 64; clearing progress displays `0/64`, and reloading preserves completed lesson IDs while keeping the denominator derived from the curriculum.
- The interface explains that local progress may not synchronize between devices.
- Missing, malformed, or outdated local progress data is handled safely.
- The learner has a way to reset local progress.

### FR-007 — Lesson completion

A lesson MUST be marked complete according to an explicit rule in the lesson or assessment specification. Merely opening a lesson MUST NOT be treated as evidence of mastery.

### FR-008 — Curriculum prerequisites

The curriculum MUST identify dependencies between concepts and provide a logical learning order. Learners SHOULD be able to revisit earlier material when needed.

### FR-009 — Responsive interface

Essential learning flows MUST remain usable on agreed desktop, tablet, and mobile viewports. Code editing controls and output MUST remain accessible and readable.

### FR-010 — Accessibility

Essential navigation, editor controls, exercise submission, and feedback MUST be operable using a keyboard. The application SHOULD target WCAG 2.2 Level AA.

**Acceptance criteria:**
- Interactive controls have accessible names.
- Keyboard focus is visible.
- Feedback and execution states are perceivable without relying on color alone.
- Contrast and responsive behavior are reviewed against the chosen target.

### FR-011 — Security

Learner code MUST run outside the privileged application context with a documented isolation boundary and resource limits.

**Acceptance criteria:**
- The execution design and its assumptions are documented.
- Execution has a timeout and termination strategy.
- Messages crossing the execution boundary are validated.
- Student code cannot access secrets or privileged application capabilities through the intended execution interface.
- Security tests cover the boundary; a sandbox attribute alone MUST NOT be considered proof of security.

### Phase 12 requirements amendment (APPROVED AND IMPLEMENTED)

The following Module 6 requirements were approved and implemented:

- The Module 6 DOM exercises use the architecture approved by the Phase 12 ADR in `architecture-spec.md` §5.8: a separate Worker-backed, bounded DOM-like interface and trusted host renderer. This is a controlled model, not native DOM execution. The existing pure-JavaScript Worker protocol remains unchanged.
- Learner code MUST NOT receive a reference to the platform's `document`, `window`, application state, privileged host APIs, or progress-storage interface. The DOM-mode facade MUST expose only the approved operations and fixture selectors. The host MUST render validated state using safe DOM APIs and text, never learner-provided markup.
- The DOM-mode protocol MUST be separate/versioned, validate schema, current Worker/run identity, sequence/state, node/event IDs, operation types, and bounded message/output sizes, and reject malformed, duplicate, and stale messages. The Worker source and run ID are correlation evidence, not proof that learner output is trustworthy.
- Configured limits are 200 virtual nodes, depth 20, 50 event registrations, 100 combined protocol/output entries, 2,000 characters per string, and 5,000ms for learner initialization and each individual event callback. A watchdog handles active execution and a heartbeat detects a Worker blocked after its initial response; user events are rate-limited under the 100-entry cap. Structural limits fail with learner-facing feedback; runaway code is terminated by the Worker. These application limits do not establish a hard memory quota or complete sandbox security.
- DOM-mode execution MUST be terminated and its model, listeners, and preview state cleared on timeout, rerun, reset, lesson switch, or application destruction. No DOM exercise state is persisted.
- Security tests cover synchronous infinite loops, post-result blocking, deep recursion, event/node/output floods, malformed/oversized/stale messages, and attempted network/storage/global access. Real-browser termination and host responsiveness were verified only in integrated Chromium/Electron (Chrome 150.0.7871.250, Electron 43.8.3); Firefox, Edge, and Safari remain unverified. These tests are evidence only for the tested environment and are not a universal guarantee.
- Real-browser tests MUST inspect rendered preview state and verify keyboard operation, labels, focus, live feedback, and teardown. jsdom remains supplemental and MUST NOT be treated as proof of browser security or native DOM semantics.
- `m6-l1` and `m6-l6` MAY use the existing Worker. Static `import`/`export` and DevTools lessons MUST use accessible no-execution assessments unless a separately approved execution capability is added. The Module 7 debugging tools MUST not be represented as available inside the platform.
- Target browser baseline: current and previous major stable releases of desktop Chrome, Edge, Firefox, and Safari; only Chromium/Electron was tested. Production hosting MUST use HTTPS and a documented origin/security-header policy; development uses Vite localhost. Cloudflare Pages is the selected production hosting target; deployment remains pending.
- Production responses MUST include the separate application and DOM Worker CSPs defined in `architecture-spec.md` §9, plus `X-Content-Type-Options: nosniff`, a restrictive `Referrer-Policy`, and a `Permissions-Policy` denying unused device/sensor capabilities. Enable HSTS only after HTTPS deployment is confirmed. Vite development and local preview responses are configured and checked; Cloudflare Pages response headers and Worker startup remain unverified until deployed.
- DOM Worker learner code MUST reject dynamic `import()` by syntax-tree inspection before execution and disable function-constructor access that could generate imports indirectly. CSP alone is insufficient because same-origin module imports remain permitted by the Worker `script-src 'self'` policy. Do not use a regular-expression source filter.
- The DOM Worker response policy MUST allow only the same-origin Worker bundle/static dependencies and required dynamic evaluation; deny child Workers, network connections, object embedding, base changes, form actions, and frames. This does not constitute a complete sandbox or a hard memory quota.

### Phase 13 requirements (APPROVED; Module 7 implemented)

- Module 7 async exercises MUST distinguish immediate synchronous execution, Promise microtasks, and timer tasks. They MUST NOT treat timers as exact deadlines, Promises as threads, or `await` as blocking execution.
- Async assessment MUST receive a terminal result only after its declared root Promise settles and all tracked callbacks complete. Output emitted before terminal completion is provisional. Pending work, unhandled rejection, callback failure, or timeout MUST NOT appear as success.
- The separate async execution mode MUST preserve the existing ordinary Worker and DOM Worker contracts. It MUST support top-level `await`, wait for the root Promise and tracked timers/requests/callbacks, report unhandled rejections as failures, and distinguish Promise microtasks from timer tasks. It MUST terminate on completion, timeout, rerun, lesson change, reset, or app teardown and reject stale/duplicate messages. Output before terminal completion is provisional.
- Module 7 HTTP exercises MUST NOT enable arbitrary learner-code network access. The host-mediated bridge permits only GET requests to `https://jsonplaceholder.typicode.com/todos/1` and `/todos/999999999`, validates both message directions and the returned JSON structure, omits credentials, denies redirects, and bounds request count, duration, and response size. HTTP 404 responses resolve normally; network and request errors reject. The external service requires no API key or authentication. Its CORS response was verified from the local application origin; production availability is not guaranteed.
- The Async Worker response policy MUST deny direct connections and nested Workers; the application policy may connect only to itself and the approved API origin (plus Vite HMR WebSockets in development). Production hosting headers remain unverified. No hard memory quota or complete security guarantee is claimed.
- Modules 8–9 MUST retain the canonical sequence and remain framework-independent. Module 8 explains the prototype model underlying classes. Module 9's module-organization checks MUST NOT claim to execute static multi-file imports unless that capability is implemented separately.
- Final acceptance requires all 64 canonical lessons, progress from `38/64` through `45/64` and `55/64` to `64/64`, correct navigation/prerequisites, meaningful assessments, accessibility, persistence/idempotency/reset, full regression coverage, lint/build, and browser/deployment verification. Production hosting and cross-browser support remain unverified until tested.

### FR-012 — Failure recovery

Execution errors MUST NOT crash the lesson page. Learners MUST be able to edit and rerun code after a failure. Stale output from an earlier execution MUST NOT overwrite a newer result.

## 6. Non-functional requirements

- **Correctness:** instructional examples and exercise tests MUST be verified.
- **Maintainability:** lesson content MUST be separable from application logic where practical.
- **Performance:** the lesson interface SHOULD become interactive within 3 seconds on an agreed reference environment. The environment and measurement method MUST be documented before this target is used as a release gate.
- **Privacy:** the MVP MUST NOT require an account or collect unnecessary personal information.
- **Portability:** lesson content MUST use a documented format and avoid unnecessary dependence on a particular UI framework.
- **Testability:** core application behavior MUST have repeatable automated tests.
- **Recoverability:** malformed local progress and execution failures MUST fail safely.

## 7. Explicit exclusions

The MVP does not include user accounts, cloud synchronization, social features, certificates, AI-generated tutoring, paid subscriptions, or complete framework-specific courses.

## 8. Technical decisions deferred

The following choices are documented in `architecture-spec.md` and MUST be confirmed before implementation is committed:

- UI approach and whether a framework is needed.
- Editor library.
- Code execution and isolation mechanism.
- Lesson content format.
- Progress persistence mechanism.
- Test tooling.
- Hosting and security configuration.

## 9. Acceptance and traceability

Each requirement MUST map to one or more acceptance tests or documented manual verification steps. A feature MUST NOT be accepted when its required tests fail or a critical security defect remains unresolved.

## 10. Change management

Changes to approved behavior MUST update the relevant specification and tests. The constitution takes precedence over this document.
