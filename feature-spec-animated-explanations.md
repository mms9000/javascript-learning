# Feature Specification — Module 1 Animated Explanations

**Version:** 1.0  
**Status:** Approved for implementation planning; implementation not yet authorized  
**Scope:** Four existing Module 1 lessons  
**Parent:** `constitution.md`, `requirements.md`, `curriculum-spec.md`, `architecture-spec.md`

## 1. Purpose

Add short, polished, interactive motion-graphics scenes to the explanations in Module 1. Each scene MUST make an existing JavaScript concept easier to understand by showing the relationship between the lesson's actual code and its described behavior. Motion MUST communicate a meaningful state change; it MUST NOT be decorative.

The feature adds no curriculum objectives, exercise behavior, new JavaScript concepts, or runnable learner code. Existing lesson text and objectives remain unchanged.

## 2. User story

As a beginning JavaScript learner, I want to play, pause, and replay a concise visual explanation beside its lesson text so that I can see how the existing code relates to its behavior.

## 3. Scope and requirements

### 3.1 Functional requirements

- **AEX-001 — Lesson mapping:** Provide one scene for each of `m1-l1`, `m1-l2`, `m1-l3`, and `m1-l4`. Each scene MUST be associated with an existing lesson section ID and MUST appear only with that lesson and section.
- **AEX-002 — Instructional accuracy:** Scene labels, code, diagrams, and transitions MUST accurately represent the existing explanation. Scene content MUST NOT contradict the JavaScript language model or introduce concepts outside that lesson's existing objectives.
- **AEX-003 — Code synchronization:** When a scene changes its visual state, the corresponding actual code fragment MUST be shown and the relevant line or token MUST be identified. The scene MUST NOT present invented or altered lesson code as if it were the lesson example.
- **AEX-004 — Learner control:** Playback MUST be learner-initiated. Provide Play, Pause, and Replay in standard-motion mode. Scenes MUST NOT autoplay, loop, or start as a consequence of scrolling.
- **AEX-005 — Scene duration:** Each complete standard-motion sequence SHOULD last approximately 5–8 seconds and MUST remain concise. No individual phase should require the learner to wait before using controls.
- **AEX-006 — Reduced motion:** When `prefers-reduced-motion: reduce` is active, do not animate movement or automatically advance steps. Provide discrete step progression so that the complete explanation remains available without motion.
- **AEX-007 — Responsive presentation:** Scenes MUST fit the lesson column at mobile, tablet, and desktop sizes. Code and labels MUST remain readable; diagrams MUST scale without clipping or page-level horizontal overflow.
- **AEX-008 — Progressive enhancement:** A meaningful static scene MUST be present before playback initialization. If JavaScript sequencing fails, the static diagram, code, caption, and explanation MUST remain available; the scene MUST NOT become a blank reserved area.
- **AEX-009 — Lifecycle:** Playback and pending callbacks MUST stop when the scene is disposed or the learner navigates to another lesson. Re-entering a lesson MUST start in a stable initial scene state.
- **AEX-010 — Isolation:** Scene code MUST animate only authored lesson data. It MUST NOT evaluate learner code, connect to the Worker execution architecture, or gain access to runner capabilities.

### 3.2 Visual requirements

- Use a consistent educational motion-graphics language across the four scenes: deliberate code highlighting, simple shapes, clearly labeled boundaries, arrows/connectors, and restrained transitions.
- Use inline SVG for diagram structures and connectors; use semantic HTML for code, controls, captions, and explanatory text.
- Reuse existing color, border, surface, and focus design tokens where appropriate. Pair color with text, shape, or position so meaning is not conveyed by color alone.
- Do not use cartoon mascots, decorative illustrations, background motion, unrelated effects, looping animation, or video files.
- Motion MUST have a clear instructional start and end state.

## 4. Revised storyboards

All source snippets below are taken from the existing lesson sections. Scene captions may summarize an existing concept, but MUST NOT add new curriculum material. Scenes do not change the lesson content, starter code, exercises, or validators.

### 4.1 M1-L1 — What JavaScript Is and Where It Runs

**Placement:** `m1-l1`, section `the-three-pieces`, following the existing three concept cards. The scene may refer to the existing `first-program` section's exact example.

**Supporting concepts:** JavaScript is a language; a browser is one host environment; a JavaScript engine reads and executes the language; the browser host supplies APIs such as the console; a console call can produce visible output.

**Code shown:** `console.log("Hello, world!");` from the existing first-program example.

**Scene sequence (approximately 7 seconds):**

1. **Establish the parts:** Show a card labeled “JavaScript language” containing the exact source line. Beside it, show a labeled “Browser host” boundary. Inside that boundary, show a separate “JavaScript engine” shape and a “Console API” label supplied by the host.
2. **Execute the source:** Highlight the complete code line, then move a small code token/flow marker from the source card into the engine. Do not depict `console.log()` as a language keyword or as the engine itself.
3. **Show the host interaction:** Within the execution depiction, connect the call to the host-provided Console API. Show the string value `Hello, world!` sent to a visible console output panel.
4. **Hold the final relationship:** Keep the language, host, engine, API, and output labels visible together long enough to inspect.

**Takeaway:** JavaScript is the language being executed; the browser is a host that contains an engine and provides browser APIs, including the console used by this example. `console.log()` is not itself part of the JavaScript language syntax specification.

**Trigger/control:** User presses Play. Pause and Replay are available. No scrolling trigger or autoplay.

### 4.2 M1-L2 — Your First Program and `console.log()`

**Placement:** `m1-l2`, section `sequential-execution`, after the paragraph describing top-to-bottom execution.

**Supporting concepts:** Statements execute sequentially; calls add output in the order written; text and number values use the exact example.

**Code shown:** The existing lesson starter:

```javascript
console.log("Player Score:");
console.log(100);
```

**Scene sequence (approximately 6 seconds):**

1. Show both source lines in a code panel and an empty output panel.
2. Highlight the first line from top to bottom. Show its text value travel to output as the first line, `Player Score:`.
3. Move the highlight to the second line only after the first phase completes. Show the unquoted numeric literal `100` travel to output below the first line.
4. Hold the final two-line output aligned with the two source calls.

**Takeaway:** The engine processes these statements from top to bottom, and each `console.log()` call contributes output in sequence.

**Explicit distinction from M1-L1:** Do not repeat the host-versus-engine diagram. Treat the execution environment as established context; focus this scene only on statement order and output accumulation.

**Trigger/control:** User presses Play; Pause and Replay are available.

### 4.3 M1-L3 — Reading Basic Syntax and Comments

**Placement:** `m1-l3`, section `single-line-comments`, after the existing single-line-comment example. The scene MAY reference the existing `comments-are-not-output` example in its final state.

**Supporting concepts:** Comment text is a source-code note, not an executable JavaScript statement; comment markers distinguish it from executable statements; only the executable `console.log()` calls contribute output.

**Code shown:** The exact existing single-line-comment example:

```javascript
// This is a full-line comment explaining the next line
console.log("System initializing...");

console.log("Ready!"); // You can also put comments at the end of a line
```

The ending comparison may also show the exact existing example:

```javascript
// console.log("This will never print!");
console.log("Only this line will print.");
```

**Scene sequence (approximately 7 seconds):**

1. Present the full-line comment and the following executable statement together. Use a “comment / source note” label and a distinct visual treatment for the comment; identify `console.log(...)` as an executable statement.
2. Transition to a source-processing view in which the comment is classified as non-executable source text before the executable statement is run. Do not animate the comment as an instruction that enters the engine and is later skipped during runtime.
3. Show the output `System initializing...`; then show the later `Ready!` call produce its output in the existing example's order.
4. Show the inline comment after `console.log("Ready!");` as a note attached to the source line, while leaving its executable statement distinct.
5. Optionally conclude with the exact “This will never print!” example: the commented-out call is visibly marked as a comment and produces no output; only `Only this line will print.` appears.

**Takeaway:** Comments are part of the written source for human readers but are not executable JavaScript statements. They do not execute and are not “skipped at runtime”; the visual distinction is made while interpreting source.

**Trigger/control:** User presses Play; Pause and Replay are available. Optional final comparison is part of the same short scene, not a separate lesson.

### 4.4 M1-L4 — Understanding Common Syntax Errors

**Placement:** `m1-l4`, section `missing-parentheses`, after the existing broken/fixed examples.

**Supporting concepts:** The parser checks source syntax before execution; an unmatched opening parenthesis prevents the program from executing; adding the close delimiter before the semicolon makes the shown statement syntactically complete.

**Code shown:** The exact existing section example and its correction:

```javascript
console.log("Learning syntax";
```

```javascript
console.log("Learning syntax");
```

**Scene sequence (approximately 7 seconds):**

1. Show the broken source and a “Parsing source” phase. Highlight the opening `(` and its argument, then reach the semicolon without a matching `)`.
2. Before any execution/output phase, show a SyntaxError diagnostic connected to the unmatched delimiter. Keep the output area empty and explicitly label the program “not executed.”
3. Insert the closing `)` immediately before the existing semicolon. Highlight the matched pair.
4. Show parsing succeed, then show the corrected statement execute and produce the exact output `Learning syntax`.

**Takeaway:** A syntax error is detected while the source is being parsed, before the malformed program begins execution. Correct the source first; only then can the program execute.

**Trigger/control:** User presses Play; Pause and Replay are available.

## 5. Component and data architecture

### 5.1 Approved design

- A reusable lesson-animation component renders the scene, authored code panel, diagram, captions, and controls.
- A separate declarative Module 1 scene registry maps each lesson ID and section ID to fixed scene data and ordered visual states.
- `lesson-view.js` performs the minimal integration: after rendering a matching lesson section, it mounts the corresponding scene component.
- SVG represents diagrams, shapes, boundaries, and connectors. HTML represents code, buttons, captions, and descriptive text. CSS provides visual styling and transitions. JavaScript sequences authored scene states and manages controls/lifecycle.
- The component enhances a meaningful static scene. The initial DOM MUST contain a useful scene state before sequencing is initialized.
- Scene sequencing is limited to the four authored scenes. This is a feature component, not a general-purpose animation/timeline framework.

### 5.2 Boundaries

- Do not modify the ordinary, async, or DOM Worker implementations, protocols, policies, or execution interface.
- Do not run lesson examples as part of animation playback. The animation depicts the fixed authored examples; it does not claim to execute or validate them.
- Do not modify lesson text, objectives, content order, exercises, validators, completion behavior, curriculum metadata, progress, or navigation behavior.
- Do not add a runtime dependency. The existing browser APIs, SVG, CSS, and JavaScript are sufficient unless a concrete unmet requirement is demonstrated and separately approved.
- Use only authored static scene data. Do not evaluate HTML/code sourced from learners or interpolate learner-controlled values into SVG markup.

## 6. Interaction and state behavior

### Standard motion preference

- **Initial:** Render a meaningful static first frame and controls. Playback does not start until Play is activated.
- **Play:** Advance through the authored states using short, purposeful transitions. Update the active code highlight and diagram state together.
- **Pause:** Stop progression and leave the current state visible. Resuming Play continues from that state.
- **Replay:** Cancel any pending progression, return to the first state, and begin the sequence again. Replay MUST NOT create overlapping timers.
- **Completion:** Stop on the final state. Do not loop. The learner may press Replay.
- **Lesson change/disposal:** Cancel pending callbacks, remove event handlers owned by the component, and restore stable state before releasing the old component.

### Reduced-motion preference

- Read the system preference using `prefers-reduced-motion`.
- Disable movement, animated transforms, and automatic timed progression when reduced motion is requested.
- Replace Play/Pause sequencing with discrete, keyboard-operable step progression (for example, “Next step”) and a way to return to the first step. Each activation moves directly to the next understandable visual state with no animated transition.
- Keep all scene steps, code, diagrams, captions, and final takeaway available. Do not hide the scene for reduced-motion users.
- If the preference changes while a scene is mounted, stop current timed progression and switch to discrete states without losing the learner’s current conceptual step.

## 7. Accessibility requirements

- Controls MUST be native buttons with clear accessible names, correct disabled states, logical DOM order, and visible keyboard focus.
- Use a semantic figure-like scene structure with a visible caption. Provide a concise text description of the full relationship/dependency shown by the SVG; do not rely on SVG paths or color alone.
- Code MUST remain selectable semantic text, with active-line/token state exposed by text/structure and not color alone.
- Scene-step changes MAY be announced through a polite status region. Announcements MUST be concise and occur only on a user-initiated step/state change; do not announce every animation frame, countdown, or intermediate visual interpolation.
- Screen-reader users MUST be able to understand the scene from the static description, code, caption, and discrete step controls without needing to perceive motion.
- Focus MUST remain on the activated control during playback and step changes. Playback MUST NOT move focus automatically.
- Ensure text and controls meet existing contrast and target-size expectations; preserve the existing focus indicator styling.
- Honor `prefers-reduced-motion` and ensure no essential information is available only through movement.

## 8. Acceptance criteria

### Scene mapping and instructional correctness

- **AC-01:** `m1-l1` renders exactly its language/host/engine/console-output scene beside section `the-three-pieces`; the scene labels JavaScript as the language, browser as host, engine as executor, and console API as host-provided.
- **AC-02:** The M1-L1 scene shows the exact `console.log("Hello, world!");` example and visible `Hello, world!` output without representing `console.log()` as a JavaScript language keyword.
- **AC-03:** `m1-l2` renders its sequential-execution scene beside `sequential-execution`; it highlights the exact two starter statements from top to bottom and shows `Player Score:` before `100`.
- **AC-04:** M1-L2 contains no repeated host-versus-engine conceptual animation.
- **AC-05:** `m1-l3` uses only the existing comment examples identified in §4.3. It classifies comments as non-executable source and never depicts a comment entering runtime execution and being skipped.
- **AC-06:** `m1-l4` uses the existing missing-parenthesis section example. It reports the SyntaxError during parsing, shows no execution/output for the malformed source, and depicts execution/output only after the closing parenthesis is added.
- **AC-07:** Automated content/registry tests verify the four exact lesson-to-section associations and the expected code strings/states. A reviewer verifies the visual explanations against the existing lesson paragraphs and objectives.

### Playback, synchronization, and lifecycle

- **AC-08:** A scene starts in a useful static state and does not play until the learner activates Play.
- **AC-09:** Play advances each scene through its defined states; active code highlighting, labels, and diagram state remain synchronized.
- **AC-10:** Pause halts progression and leaves the current state visible; resuming continues from that state.
- **AC-11:** Replay resets to the initial state and starts one sequence; repeated activation does not produce overlapping progression.
- **AC-12:** Playback stops at completion and never loops.
- **AC-13:** Navigating to another lesson disposes the prior scene and its pending callbacks. Returning to the lesson renders a stable initial state with no stale state or duplicate handlers.

### Static fallback and failure handling

- **AC-14:** Before playback initialization, the rendered lesson already contains a meaningful static diagram, code, and caption.
- **AC-15:** If sequencing initialization fails, the explanation, static diagram, code, and caption remain visible and usable; no blank panel or uncaught application-level error is introduced.
- **AC-16:** If scene data is absent for other lessons, lesson rendering is unchanged and no empty animation container is added.

### Accessibility and motion preferences

- **AC-17:** Keyboard-only users can operate Play/Pause/Replay or reduced-motion step controls, see focus, and keep focus stable through every state transition.
- **AC-18:** Assistive technology can access a concise scene description, code, caption, and current state. Step announcements are polite, user-triggered, and not emitted continuously during visual interpolation.
- **AC-19:** Under `prefers-reduced-motion: reduce`, timed progression and movement are absent; all states remain available through discrete controls.
- **AC-20:** A browser test emulates reduced motion and verifies the discrete behavior and lack of active timed progression.

### Responsive behavior and regression

- **AC-21:** At supported mobile, tablet, and desktop test widths, the scene, code, controls, and caption remain within the lesson column with no page-level horizontal overflow or clipped essential content.
- **AC-22:** Code and labels remain readable and controls usable at each tested width; SVG scales proportionally.
- **AC-23:** Existing lesson text, objectives, exercises, validators, Module 1 completion, course denominator (64), navigation, and progress behavior are unchanged.
- **AC-24:** Existing lesson-view, curriculum/content, app, and browser regression tests pass along with the new component, integration, and accessibility tests.
- **AC-25:** No new dependency is added, and no Worker implementation or execution boundary is modified.

## 9. Testing plan

- **Scene registry/component unit tests:** Association and code-data integrity; initial static state; each scene state; Play/Pause/Resume/Replay; final-state stop; duplicate timer prevention; disposal and callback cancellation; reduced-motion discrete stepping; initialization failure fallback.
- **Lesson-view integration tests:** Correct placement after each mapped explanation; no animation container for unmapped lessons; lesson switch cleanup; unchanged header, objectives, lesson text, summary, and next-lesson footer.
- **Playwright tests:** Exercise controls with pointer and keyboard; inspect synchronized code highlights and SVG state; visit each lesson and navigate away/back; verify focus and live announcements; emulate reduced motion; check responsive bounds and horizontal overflow at representative mobile, tablet, and desktop widths.
- **Regression tests:** Run existing Vitest suite and relevant Playwright suite to protect the playground, execution security, navigation, progress, and course completion.
- **Manual instructional/accessibility review:** Confirm each sequence teaches only its stated concept, the diagrams match their examples, the static alternative is understandable, and announcements are not noisy.

## 10. Phased implementation plan

1. **Foundation and M1-L1:** Implement the small reusable component and declarative registry; integrate the browser-host/engine/Console API scene. Verify its static fallback, lifecycle, keyboard controls, and reduced-motion behavior before proceeding.
2. **M1-L2:** Add sequential execution and ordered output using the same component. Verify line-by-line synchronization and explicitly ensure this scene does not repeat M1-L1's host diagram.
3. **M1-L3 and M1-L4:** Add the source-comment classification scene and parse-before-execution syntax-error scene. Review exact source examples and instructional state order.
4. **Cross-scene acceptance:** Run responsive, accessibility, cleanup, failure-fallback, and full regression checks for all four scenes. Confirm all unchanged-scope criteria in AC-23 and AC-25.

Each phase MUST pass its focused tests before the next scene is added. No phase authorizes lesson-content edits or scope expansion.

## 11. Risks and constraints

- The existing renderer inserts section HTML and currently has no scene lifecycle. Integration must remain narrow and explicitly dispose component-owned callbacks when lessons change.
- A declarative registry can still become an unnecessary general-purpose timeline system. Keep its states limited to the needs of the four approved scenes.
- SVG accessibility is not automatic. Every diagram needs a concise equivalent description, while the actual code and labels remain semantic text.
- Reduced-motion behavior must preserve the causal explanation rather than merely disable CSS transitions while retaining automatic timed steps.
- A static-first scene must be meaningful before JavaScript sequencing; otherwise initialization failure would remove the feature's teaching value.
- The M1-L1 lesson currently calls `console.log()` a “built-in instruction.” This feature MUST NOT edit that existing text under the approved scope; its scene must accurately clarify that `console` is a host-provided API and `console.log()` is not part of JavaScript language syntax.

## 12. Explicitly unchanged

- Existing Module 1 lesson prose, objectives, examples, exercises, validators, and completion rules.
- Canonical 64-lesson curriculum and all curriculum metadata.
- Lesson navigation, progress persistence, and course completion.
- Playground behavior and ordinary, async, and DOM Worker architectures, protocols, security rules, and policies.
- Dependencies and package manifests.
- Lesson renderer behavior outside the minimal scene integration.
- All unrelated staged, unstaged, and untracked Git work.
