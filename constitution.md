# Project Constitution — Interactive JavaScript Learning Platform

**Version:** 1.0  
**Status:** Proposed baseline  
**Methodology:** Spec-Driven Development (SDD)

## 1. Mission

The project SHALL deliver a simple, interactive, beginner-friendly website that teaches JavaScript from fundamental programming concepts through object-oriented programming (OOP). Its goal is to prepare learners to read, understand, write, debug, and maintain JavaScript code, giving them transferable knowledge they can apply when learning unfamiliar JavaScript frameworks and libraries.

The platform SHALL teach JavaScript itself rather than center the core curriculum on any one framework.

## 2. Governing principles

### Principle I — Learning outcomes first

Every feature, lesson, exercise, and interface element MUST serve a clearly identified learning outcome. The experience MUST prioritize understanding, practical application, experimentation, debugging, and problem-solving over passive reading or memorization. Features that do not meaningfully improve learning SHOULD NOT be included in the initial release.

### Principle II — Specifications before implementation

Development MUST follow the SDD workflow. Before a feature is implemented, it MUST have a specification describing its purpose, user story, functional requirements, expected interactions, acceptance criteria, relevant edge cases, and required tests. Implementation MUST comply with the specification. Approved behavior changes MUST be reflected in the relevant specification and tests rather than introduced silently.

### Principle III — Framework independence

The core curriculum MUST teach JavaScript concepts independently of a particular framework. Learners MUST NOT need prior React, Vue, Angular, or other framework knowledge to complete the core course. Lessons SHOULD demonstrate how JavaScript concepts appear in practical applications. Framework-readiness material SHOULD explain transferable concepts without requiring mastery of a specific framework.

### Principle IV — Interactive learning

The website MUST provide meaningful practice opportunities. Where appropriate, lessons SHOULD include editable examples, in-browser execution, immediate output and error feedback, quizzes, debugging tasks, hints, guided exercises, and small projects. Interactivity MUST support a learning objective rather than serve as decoration. If an interactive feature is unavailable, the lesson SHOULD offer another way to practise the same concept.

### Principle V — Progressive complexity

The curriculum MUST follow a dependency-aware sequence. Lessons MUST NOT silently assume knowledge that has not been taught or identified as a prerequisite. Major learning units MUST include objectives, an explanation, examples, practice, feedback, and a checkpoint appropriate to the learning outcome.

### Principle VI — Simplicity and maintainability

The initial implementation MUST favor the simplest architecture that satisfies approved requirements. Unnecessary dependencies, premature abstractions, and unused infrastructure SHOULD be avoided. Curriculum content, lesson presentation, exercises, progress tracking, and code execution SHOULD be separable where practical. Adding a lesson SHOULD NOT require redesigning the application.

No framework, database, backend, authentication provider, or hosting platform is mandated by this constitution. Technical choices MUST be justified in the architecture specification.

### Principle VII — Accessibility and usability

The interface MUST be understandable to users with limited programming experience. Navigation, terminology, code examples, and errors MUST be clear. Keyboard navigation, visible focus indicators, accessible labels, and sufficient contrast MUST be treated as core quality requirements. The initial design SHOULD target WCAG 2.2 Level AA, subject to testing.

### Principle VIII — Instructional correctness

Instructional content MUST be technically accurate and consistent with the JavaScript language and browser behavior being taught. Code examples MUST be tested wherever practical. The course MUST distinguish JavaScript language features from browser APIs and framework-specific behavior. It MUST explain, among other things, values and data types, variables and scope, functions, objects and prototypes, classes and inheritance, and synchronous and asynchronous execution.

## 3. Curriculum obligations

The course MUST cover these stages in a dependency-aware sequence:

1. Getting started with JavaScript and basic debugging.
2. Values, data types, variables, operators, and type conversion.
3. Conditions, truthy/falsy values, loops, and iteration.
4. Functions, parameters, return values, scope, callbacks, and closures.
5. Arrays, objects, data transformations, references, mutation, and copying.
6. Browser interaction, DOM, events, modules, and error handling.
7. Promises, `async`/`await`, and basic HTTP requests.
8. OOP, including objects, prototypes, classes, encapsulation, inheritance, polymorphism, and composition.
9. Framework readiness, code organization, data flow, state, and transferable concepts.

Learners SHOULD complete practical milestones that demonstrate application of concepts rather than merely reading through lessons.

## 4. Interactive learning requirements

The platform SHOULD provide a browser-based editor and code runner that support course examples and exercises. It SHOULD explain syntax and runtime errors in beginner-friendly terms. Exercises MUST be associated with stated learning outcomes and explicit evaluation rules. Feedback MUST explain the relevant concept and offer hints when appropriate. The initial release MAY store progress locally without registration, provided its limitations are clear.

Student-submitted code MUST be treated as untrusted. It MUST NOT execute with unrestricted access to the privileged application context.

## 5. Architecture and technology constraints

- The subject taught MUST remain JavaScript regardless of the website implementation stack.
- The initial release SHOULD avoid a backend or account system unless an approved requirement justifies one.
- Lesson content SHOULD be separable from presentation and execution logic.
- Code execution MUST have a documented isolation boundary and resource limits.
- Core application behavior, lesson content, assessments, progress, and execution boundaries MUST be testable.
- The interface MUST support agreed desktop, tablet, and mobile viewports.
- Core instructional content SHOULD remain useful if a nonessential interactive feature fails.
- Dependencies and external services MUST be justified and reviewed for maintenance, privacy, and security implications.

## 6. Testing and quality assurance

A feature MUST NOT be considered complete solely because its interface looks correct. It MUST satisfy its acceptance criteria and pass applicable tests. Testing SHOULD cover unit behavior, integration flows, browser interactions, code execution boundaries, responsive behavior, accessibility, content validity, and regression risks. Critical defects that compromise security, core learning flows, or instructional correctness MUST be resolved before release.

Automated tests MUST NOT replace necessary manual review of the learning experience.

## 7. Security and privacy

The application MUST minimize personal-data collection. Authentication, analytics, advertising, and third-party tracking MUST NOT be introduced without a documented requirement and privacy review. Student code MUST be handled as untrusted input, and suitable safeguards MUST address unsafe DOM manipulation, cross-site scripting, unauthorized access, and exposure of sensitive information. Secrets and privileged credentials MUST NOT be exposed in client-side code.

## 8. Scope control

The initial release MUST focus on a complete JavaScript learning journey through the first working lesson and its core interactive learning loop. User accounts, cloud-synchronized progress, social features, leaderboards, certificates, AI tutoring, multiple programming languages, full courses for individual frameworks, and collaborative coding are optional future extensions, not initial-release obligations.

New features MUST be evaluated for learning value, complexity, maintenance cost, risk, and alignment with the mission.

## 9. Definition of done

A feature is complete only when:

- Its specification and measurable acceptance criteria are defined.
- Its implementation satisfies the specification.
- Relevant tests pass and results are recorded.
- Edge cases have been considered.
- Accessibility and security have been reviewed where applicable.
- Required documentation is updated.
- No unresolved critical defect blocks acceptance.

A lesson is complete only when its content is accurate, examples are verified, exercises behave as specified, and its learning outcomes can be assessed.

## 10. Governance and change management

This constitution is the project's highest-level governing document. Requirements, designs, implementation plans, and tests MUST remain consistent with it. If a lower-level document conflicts with the constitution, the constitution takes precedence until formally amended. Proposed constitutional changes MUST document the rationale, impact, affected specifications, and version change.

## 11. Guiding principle

**Teach the concepts. Encourage experimentation. Verify understanding. Build transferable skills.**

The project succeeds when learners can solve unfamiliar problems, understand code they did not write, debug mistakes, and start learning a new framework with confidence—not merely when they finish reading the lessons.
