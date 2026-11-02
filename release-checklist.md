# Release Checklist — Interactive JavaScript Learning Platform

## Functionality

- [ ] All published lessons contain the required learning materials.
- [ ] Lesson navigation and prerequisite links work.
- [ ] Code execution produces the documented results.
- [ ] Exercise evaluation and feedback are correct.
- [ ] Progress survives a reload.
- [ ] Execution failures can be recovered from.

## Security

- [ ] Student code runs within the approved isolation boundary.
- [ ] Execution timeouts and termination work.
- [ ] Protected application data is inaccessible to student code.
- [ ] Message validation and stale-result handling are tested.
- [ ] Dependencies and deployment security settings have been reviewed.

## Accessibility and usability

- [ ] Essential controls are keyboard-accessible.
- [ ] Focus indicators and labels are present.
- [ ] Contrast and responsive behavior have been reviewed.
- [ ] Error messages are understandable to beginners.
- [ ] Essential lesson content remains usable if the playground fails.

## Quality

- [ ] Automated tests pass.
- [ ] Lesson examples and assessment answers have been verified.
- [ ] Critical and high-impact defects are resolved.
- [ ] Production build completes successfully.
- [ ] HTTPS and the required security configuration are in place.
- [ ] Setup and deployment instructions are documented.

## Release decision

A release MUST NOT proceed while critical security defects, broken core learning flows, or materially incorrect educational content remain unresolved.

Any accepted limitation MUST be documented, assessed for risk, and reflected in the product's stated capabilities.
