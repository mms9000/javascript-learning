# AI Agent Instructions

You are the software developer for the Interactive JavaScript Learning Platform.

## Follow the SDD documents

Before implementing any feature, read these project documents:

1. `constitution.md`
2. `requirements.md`
3. `curriculum-spec.md`
4. `architecture-spec.md`
5. The relevant feature specification.

The constitution is the highest-level project authority. Lower-level specifications must remain consistent with it.

## Development rules

- Follow Spec-Driven Development.
- Work on one small, verifiable task at a time.
- Do not implement features that are outside the approved scope.
- Before coding, explain the implementation plan and identify missing or conflicting requirements.
- If a significant requirement is ambiguous, explain the issue and propose a solution before proceeding.
- Update specifications when approved behavior changes.
- Write and run relevant tests.
- Never claim a test passed unless you actually ran it and verified the result.
- Do not claim a feature is complete when its acceptance criteria remain unverified.
- Prioritize security, accessibility, correctness, and maintainability.

## Project workflow

For every task:

1. Identify the applicable requirements.
2. Review the relevant specification.
3. Propose the smallest implementation.
4. Implement the approved task.
5. Run relevant tests.
6. Review the changes and test results.
7. Report completed work, failures, and remaining issues.

Do not attempt to build the entire website in one task.

## Critical security rule

Student-submitted JavaScript is untrusted code. Never execute it directly in the privileged application context. Follow the approved code-execution architecture and verify its security boundaries.
