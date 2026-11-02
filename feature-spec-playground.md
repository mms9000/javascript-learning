# Feature Specification — Interactive JavaScript Playground

**Version:** 1.1  
**Status:** Confirmed feature baseline — Phase 3 execution limits specified  
**Priority:** Required for MVP  
**Parent:** `requirements.md`, `architecture-spec.md`

## 1. User story

As a learner, I want to modify and execute JavaScript examples so that I can experiment with concepts and observe their behavior.

## 2. Preconditions

- The lesson is loaded.
- The editor contains a valid initial example, or a documented empty state is shown.
- The execution environment is available or the interface explains that it is unavailable.

## 3. Normal flow

1. The learner views an example in the editor.
2. The learner changes the code.
3. The learner selects **Run**.
4. The application creates a unique execution ID and sends the code to the isolated execution context.
5. The execution context runs the code under defined restrictions.
6. The application displays ordered console output and execution status.
7. The learner modifies the code and runs it again.

## 4. Acceptance scenarios

### Scenario A — Successful output

**Given** code containing `console.log(2 + 3)`, **when** the learner selects Run, **then** the output displays `5`.

### Scenario B — Multiple messages

**Given** code that prints multiple values, **when** execution completes, **then** output entries appear in execution order.

### Scenario C — No output

**Given** valid code without console output, **when** execution completes, **then** the application indicates that execution finished without output rather than suggesting it failed.

### Scenario D — Syntax error

**Given** malformed JavaScript, **when** the learner selects Run, **then** the application displays an understandable error and keeps the editor usable.

### Scenario E — Runtime error

**Given** code that throws an exception, **when** execution occurs, **then** the application reports the failure without crashing the lesson page.

### Scenario F — Execution limit

**Given** code that exceeds the configured execution time limit (default: 5,000ms), **when** the limit is reached, **then** the current run is terminated, the background execution context is discarded, the learner is notified, and a subsequent run can be started. If code generates excessive output, entries beyond 100 lines are capped with a truncation notice, and individual messages longer than 2,000 characters are safely truncated.

### Scenario G — Repeated execution

**Given** the learner has edited an example, **when** Run is selected again, **then** the latest submitted code is executed rather than a stale version.

### Scenario H — Reset

**Given** the learner has changed the code, **when** Reset is selected, **then** the editor restores the original lesson example. If edits may be lost, the UI MUST communicate that outcome clearly.

### Scenario I — Stale messages

**Given** a previous run has been terminated and a new run has started, **when** a late message from the previous execution arrives, **then** it MUST NOT replace the current run's output or status.

### Scenario J — Unavailable runner

**Given** the execution environment cannot be initialized, **when** the learner opens the playground, **then** the app explains the limitation and preserves access to the lesson content.

## 5. State model

The playground MUST distinguish these states:

- **Ready:** code can be run.
- **Running:** an execution is in progress.
- **Completed:** execution finished successfully, with or without output.
- **Failed:** execution produced an error.
- **Terminated:** execution was stopped because of a time or resource limit, or explicit cancellation.
- **Unavailable:** the execution environment could not be initialized.

The interface MUST NOT show contradictory states. A new run MUST supersede the previous run according to a documented policy.

## 6. Security requirements

- Learner code MUST NOT execute with the privileges of the main application.
- The execution environment MUST have a defined timeout (5,000ms watchdog) and termination strategy (`worker.terminate()`).
- The capability model MUST explicitly block or neutralize access to DOM, storage, network, modules, and browser APIs:
  - Parent DOM, `window`, `document`, cookies, `localStorage`, `sessionStorage`: inaccessible in Web Worker scope.
  - `indexedDB` and `caches` (CacheStorage): explicitly neutralized (`undefined` and non-writable) in worker bootstrap scope.
  - Network APIs (`fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`): explicitly neutralized in worker bootstrap scope.
  - `importScripts`: neutralized in worker bootstrap scope.
- **Boundary Reality & Limits:** The Web Worker provides thread and capability isolation; it is **not** a VM sandbox with hard memory limits. The browser's Web Worker API does not allow setting a hard byte memory quota. Protection against resource exhaustion relies on string truncation (2,000 chars), output entry capping (100 entries), and watchdog termination.
- Messages crossing the execution boundary MUST be validated defensively on the host thread:
  - Non-object, null, or foreign messages MUST be discarded.
  - Arguments MUST be sanitized, clamped in count, and string-length capped to prevent UI freeze or DOM flooding.
  - Stale and duplicate messages MUST be discarded.
  - Uncaught worker errors (`onerror`) MUST terminate the worker and immediately recreate a clean worker for future runs.
- The execution context MUST be restartable automatically after manual termination, timeout, or worker crash.
- Deployment configuration MUST enforce a Content Security Policy supporting worker blob creation (`worker-src 'self' blob:`) and worker dynamic evaluation (`script-src 'self' 'unsafe-eval'`).

## 7. Output protocol

The precise message schema is implemented over structured `postMessage`:

- **Run request:** `{ type: "run", executionId: "<uuid>", code: "<string>", timeoutMs: 5000 }`
- **Output event:** `{ type: "output", executionId: "<uuid>", kind: "log" | "warn" | "error" | "info", args: ["<string>"] }`
- **Completion event:** `{ type: "done", executionId: "<uuid>", status: "success" | "error" | "terminated", error: { name: "<string>", message: "<string>" } | null }`

Output rendering MUST treat learner-generated text as text nodes (`document.createTextNode`), strictly avoiding `innerHTML` or HTML interpolation.

- **Output Cap:** Maximum 100 log entries per execution. A 101st entry triggers a truncation notice; subsequent logs are discarded.
- **String Cap:** Maximum 2,000 characters per output item. Longer strings are truncated with `... [truncated]`.
- **Timeout:** Maximum 5,000ms wall-clock duration before watchdog terminates the worker thread.

## 8. Verification plan

Automated tests MUST cover:

- Numeric or string output from valid code.
- Multiple output entries in order.
- Valid code with no output.
- Syntax errors without crashing host.
- Runtime errors without crashing host.
- Timeout or forced termination and automatic runner respawn.
- Repeated runs using the latest code without stale output leakage.
- Reset behavior.
- Stale result rejection.
- Unavailable execution environment.
- Neutralization of `indexedDB`, `caches`, `fetch`, `localStorage`, `document`.
- Resource-exhaustion handling:
  - Strings exceeding 2,000 characters truncated safely.
  - Log floods exceeding 100 entries capped with warning.
  - Rapid repeated execution handling without UI freeze or stale cross-talk.
  - Memory-intensive allocations and manual/watchdog termination.
- Message handling robustness:
  - Malformed, non-object, and foreign messages discarded.
  - Oversized worker message arguments sanitized on host.
  - Duplicate `done` and post-done messages discarded.
  - Worker crash (`onerror`) recovery and automatic recreation.

## 9. Interactive exercise validation, progressive hints, and feedback

When an interactive exercise is bound to the playground:

1. **Validation Boundary:**
   - Validation MUST evaluate the actual execution output entries and final runner status (`status === "success"`). It MUST NOT attempt to validate by string-matching editor source code.
   - For single-line output exercises, exactly one line of output matching the target string (ignoring trailing newlines only) is required. Additional output lines, missing output, or incorrect capitalization are rejected.
   - For sequential multi-line output exercises, output entries MUST match the exact line count and expected sequence. Inverted order, missing lines, or surplus lines are rejected with line-specific diagnostic guidance.
   - **Serialized Stream Limitation:** The Web Worker boundary serializes all console arguments into string text. Output validation verifies what was received on the console output stream (e.g., `"100"`), but does not claim to prove the in-memory JavaScript type of the expression.
2. **Diagnostic Feedback:**
   - Feedback MUST be based on the reliable execution status and error details:
     - **Success:** Congratulatory banner with completion state and next-lesson navigation link.
     - **Incorrect Output / Inverted Order:** Clear comparison indicating what was logged versus what was expected (including line order and case-sensitivity guidance when applicable).
     - **Line Count Discrepancy:** Explains when fewer or more output lines were printed than required.
     - **No Output:** Reminder to call the appropriate output function.
     - **Syntax / Runtime Errors:** Friendly translation of `SyntaxError`, `ReferenceError`, or `TypeError` pointing learner toward matching quotes, parentheses, or correct spelling.
     - **Timeout / Infinite Loop:** Clear timeout notice suggesting inspection of termination conditions.
3. **Progressive Hints:**
   - Must use an accessible, keyboard-operable toggle button with `aria-expanded` and `aria-controls`.
   - Supports stepping through progressive hint tiers (Tier 1 guidance, Tier 2 syntax reference) and allows collapsing the hint panel at any time.
4. **State Separation & Reset:**
   - Resetting the editor restores initial starter code and clears transient output and exercise feedback.
   - Editor reset MUST NOT erase earned lesson completion in the persistent progress system.
   - Repeated successful runs MUST be idempotent and MUST NOT inflate completion counters.
5. **Lesson Switching Synchronization:**
   - When switching between lessons, navigation, editor code, exercise configuration, hints, console output, and feedback banners MUST be synchronized cleanly.
   - Transient exercise state for the previous lesson is cleared, while persistent completion records for all lessons remain intact.
6. **Accessibility:**
   - Exercise task, hint panel, and feedback banners MUST have appropriate semantic roles, accessible labels, and live region announcements (`aria-live="polite"`).

## 10. Phase 12 — controlled DOM exercise mode (APPROVED AND IMPLEMENTED)

The approved Worker-backed controlled DOM interface in `architecture-spec.md` §5.8 is implemented. It does not replace or alter the existing pure-JavaScript Web Worker protocol or execution behavior. This is a bounded DOM-like model rendered by trusted host code, not native DOM access.

### Execution modes

- `m6-l1` and `m6-l6`: existing Worker mode, using existing runner/validators.
- `m6-l2` through `m6-l4`: separate DOM mode. Learner code runs in a dedicated Worker and operates only on a documented virtual DOM facade passed as a modeled `document` parameter. The Worker does not expose the platform `document`, `window`, application state, storage, location, or direct network APIs through its global scope or inherited prototypes. This restriction is not a complete sandbox guarantee.
- `m6-l5` and `m6-l7`: no-execution knowledge checks. The current single-source `new Function()` runner cannot execute static `import`/`export`; the module assessment demonstrates name/path matching and output prediction only, not actual multi-file loading. The DevTools assessment teaches conceptual tool selection and debugging reasoning; it does not debug the app's Worker or expose browser DevTools.

### DOM model and host rendering

- Scope the facade to fixture selectors, `querySelector`, allowlisted `createElement`, `textContent`, safe append operations, fixture-scoped approved `querySelectorAll`, `children.length`, input `value`, checkbox `checked`, host-rendered `focus()`, and a small set of click/submit/change listeners and event fields (including `target` and modeled `preventDefault()`). Do not model arbitrary HTML, layout, CSS, full event propagation, native form navigation, or unrestricted DOM APIs.
- Maintain a bounded virtual tree in the DOM Worker. The host validates every typed state operation/snapshot and constructs its preview with trusted `createElement`, safe properties, and `textContent`; never interpolate learner-provided markup or return native nodes/references.
- Preview controls are actual host-rendered controls with stable labels, visible keyboard focus, and polite status regions. Learner interactions are serialized as validated events to the active Worker. Clearly label the experience as a controlled DOM preview and document modeled behavior.
- Configured per-run caps: 200 virtual nodes, depth 20, 50 event registrations, 100 combined protocol/output entries, 2,000 characters per string, and 5,000ms for learner initialization and each individual event callback. A watchdog handles active execution and a heartbeat detects a Worker blocked after its initial response. Rate-limit user events under the 100-entry cap. The Worker is terminated on timeout, rerun, reset, lesson change, and app destruction. Reset clears preview, event, output, and input state; DOM model state is not persisted.

### Protocol and validation

- DOM mode has its own versioned protocol and Worker instance; do not broaden or reinterpret the existing pure-JavaScript protocol.
- Validate the current Worker source, active run ID, protocol version, message schema, sequence/run state, operation types, fixture/node/event IDs, and all count/depth/string/payload limits. Reject malformed, unknown, repeated, or stale operations and messages; do not let learner messages request arbitrary host commands or navigation.
- Run IDs are correlation values, not secrets. Treat all output and model changes as untrusted learner-controlled data and assessment signals, not security evidence. The Worker source and schema checks limit accidental or cross-run messages but do not prove learner correctness.
- Do not expose platform document/window, application state, progress/localStorage functions, secrets, or privileged host APIs through the facade or message payload.

### Runaway and adversarial behavior

The Worker watchdog must terminate `while (true) {}`, deep/non-terminating recursion, and long synchronous computation without blocking the application event loop. Caps must reject listener floods, node/depth floods, message/output floods, and oversized strings. Tests also cover malformed/repeated/stale messages, attempted network/storage/global access, unexpected IDs/types, and navigation/host-command requests. The parent must remain responsive during timeout and subsequent rerun/lesson navigation.

These are application-level controls, not a hard memory quota or complete sandbox guarantee. The trusted Worker bootstrap retains a captured `Function` constructor to execute learner code, but removes access to `Function`, `eval`, and ordinary/async/generator function constructors from the learner scope. Acorn rejects all dynamic `import()` expressions before evaluation; the Worker CSP provides additional restrictions but does not itself block same-origin imports. Large allocation may consume memory until termination; browser engine faults, side channels, process failure, and untested browser behavior remain possible. Do not claim a universal security guarantee.

### Lifecycle and assessment

- Dispose the active DOM Worker, virtual tree, preview, output, event bindings, and pending host state on timeout/rerun/reset/lesson transition/app teardown. Reject any later messages using the no-longer-active run identity.
- Assess DOM outcomes by inspecting the host-rendered preview and exercising real mouse/keyboard actions; console output alone cannot establish state. Tests verify labels, focus, live feedback, submit/click/change behavior, safe text rendering, no state persistence, and cleanup.
- Knowledge checks have accessible names, keyboard operation, correct/incorrect feedback, retry/reset, and idempotent completion. They do not invoke either code runner.

### Hosting and browser-test requirements

- The target support matrix remains current and previous major stable desktop releases of Chrome, Edge, Firefox, and Safari; only integrated Chromium/Electron was tested for this implementation (Chrome 150.0.7871.250, Electron 43.8.3). The other browsers are not certified.
- Development uses Vite localhost. Production is assumed HTTPS with documented response headers and a reviewed CSP retaining only required app/Worker capabilities (`object-src 'none'`, `base-uri 'none'`, `form-action 'none'`, `frame-ancestors 'none'`, narrowly scoped `connect-src`, reviewed `script-src`/`worker-src`, and no DOM-execution `frame-src` allowance). The app meta policy now limits `connect-src` to `'self'` and `ws:` for development; it does not supply `frame-ancestors` or verify production response headers. Also require `X-Content-Type-Options: nosniff`, restrictive `Referrer-Policy`, and `Permissions-Policy` denying unused device/sensor capabilities; enable HSTS once HTTPS hosting is confirmed. Cloudflare Pages deployment headers are configured in `app/public/_headers`; production deployment and header verification remain pending. Hosting must not expose learner code or state to privileged origins.
- Vitest/jsdom tests cover schemas, validators, UI state, and protocol handlers, but cannot prove browser event/focus/accessibility behavior or Worker isolation. Real-browser checks were run with the integrated browser; the project still has no in-repository browser automation suite, Playwright setup, or direct Playwright dependency.
- Browser verification covered normal DOM exercise behavior, keyboard operation, watchdog responsiveness, runaway cleanup, resource caps, and global capability blocking. A passing run is empirical evidence for the tested Chromium/Electron version only.

## 11. Phase 12.1 — DOM Worker import and deployment hardening

- The learner-code path in the DOM Worker rejects dynamic `import()` using Acorn AST inspection before evaluation. The check applies to all URL forms and nested expressions and does not mistake strings or comments for imports. Malformed source fails closed.
- The DOM Worker disables `Function`, async-function, generator-function, and async-generator constructors, including constructor access through ordinary function objects, so learner code cannot generate new source that evades the original-source import check. Ordinary function callbacks remain executable.
- The policy is required even with CSP: the Worker response's `script-src 'self'` permits same-origin module imports, and the document CSP does not govern imports inside an external Worker. Worker CSP is defense in depth against cross-origin/resource loading, network access, and child Workers; it is not the same-origin `import()` control.
- Development and preview configuration MUST return a dedicated CSP on `dom-worker.js` and hashed `dom-worker-*.js` assets. Production hosting MUST preserve that route-specific Worker response policy as well as the application response policy defined in `architecture-spec.md` §9. Verify actual HTTP response headers for both resources; a meta tag or a successful Vite preview is not proof that the production host is configured.
- The DOM Worker is a same-origin module Worker; the ordinary JavaScript runner remains the existing Blob Worker and its protocol is unchanged. The production-like Vite preview Worker bundle and its static dependency graph were verified to start under the dedicated response policy.
- In the integrated Chromium/Electron browser, direct learner `import()` was rejected by the AST policy, and a synchronous infinite loop was terminated while the page remained responsive; a subsequent exercise ran successfully. The module check also rejects imports nested in callbacks and template expressions. Browser probes confirmed the Worker lacks `importScripts`, Worker constructors, fetch/storage, and direct application-document capabilities. Treat browser evidence as specific to the tested version, not a universal guarantee.
- Retain the existing limitation: there is no hard memory quota, complete security guarantee, or protection from browser-engine/process failure. Learner code is untrusted; message validation and CSP are defense in depth.
- Browser matrix status: integrated Chromium 150.0.7871.250 on Electron 43.8.3 was tested against development and Vite preview. Firefox, Edge, and Safari are unverified; the current/previous stable desktop release target is not certified. Production deployment is not ready until the real HTTPS host's document and Worker headers are verified and the supported browser matrix receives browser-level testing.

## 12. Phase 13 — Async Worker requirements for Module 7 (APPROVED; IMPLEMENTED)

Module 7 uses a separate async Worker mode. The ordinary JavaScript Worker and DOM Worker protocols remain unchanged.

### Execution contract findings

The ordinary `createRunner` executes `new Function(data.code)` in a Blob Worker and has a 5,000ms host watchdog, execution IDs, bounded console serialization and stale-message filtering. The Worker recognizes a returned thenable and reports its settlement, but does not support top-level `await`, does not deliberately collect unhandled rejections, and does not track Worker timers. Its watchdog is cleared on `done`, while the Worker is not terminated; timers/intervals may continue after the reported result even though late output is ignored. Thus the current behavior is not a sufficient Module 7 async completion contract.

The DOM Worker has a separate protocol and intentionally disables timers, direct networking and imports. It must remain unchanged for this work. Module 7 requires a new `async-worker` exercise mode; Modules 1–6 keep their current contracts.

### `async-worker` execution contract

- Execute learner source in an async-function wrapper, supporting top-level `await`. Report completion only after the root Promise settles, tracked timers/fetch requests and active callbacks complete, and a later task-turn grace allows pending unhandled-rejection events to surface. Output before terminal completion remains provisional.
- Provide tracked `setTimeout`/`clearTimeout` callbacks; do not expose `setInterval`. The configured limits are 50 timer registrations, 2,000ms per timer delay, 5,000ms overall execution, three approved API requests, 3,000ms per request, and 64 KiB per response. Output is capped at 100 entries with a truncation warning; messages and serialized values are bounded. Promise reactions run after the current stack at a microtask checkpoint; timer callbacks run as later tasks. Timer delays are minimum scheduling delays, not exact deadlines.
- Explicitly collect Worker errors and unhandled Promise rejections. Handle awaited rejections as part of normal `try/catch`; surface unhandled rejection or callback exceptions as execution failure. A pending root Promise or runaway computation reaches the host watchdog and terminates the Worker.
- Terminate the Worker on terminal success, error, timeout, reset, rerun, lesson switch and app destruction. Clear timers and host request state; reject stale/duplicate outputs and responses by execution and request ID. A later run receives a fresh Worker.
- These are configured resource caps, not hard memory limits or complete isolation. Arbitrary unreturned asynchronous work cannot generally be detected; supported work must be returned/awaited or use the tracked timer/fetch APIs.

### Controlled external API request path

The host-mediated bridge permits only `GET https://jsonplaceholder.typicode.com/todos/1` and `GET https://jsonplaceholder.typicode.com/todos/999999999`. The host validates the versioned message and exact URL, makes a credentials-omitted GET with redirects denied, bounds streamed responses and request time, and validates the expected JSON object. The first endpoint returns `{ userId, id, title, completed }`; the second returns HTTP 404 with `{}`. The learner facade supports only `response.ok`, `response.status`, and `response.json()`. A 404 resolves normally; network/timeout failures reject. The public endpoint's CORS behavior was verified from the localhost application origin; no API key or authentication is required. The endpoint is not a deterministic fixture and its service availability is outside the app's control.

The application CSP allows the API origin only for the host request; the Async Worker's own CSP denies direct connections and nested Workers. Do not broaden Worker networking or accept learner-supplied destinations.

### Canonical lesson execution mapping

| Lesson IDs | Mode | Scope |
|---|---|---|
| `m7-l1` | No-execution knowledge check | Call stack, microtasks and timer-task prediction. |
| `m7-l2`–`m7-l7` | New `async-worker` | Timer callback through Promise/fetch/error/loading scenarios; requests limited to the two approved external URLs. |
| `m8-l1`–`m8-l9`, `m9-l2`–`m9-l6`, `m9-l9` | Existing synchronous Worker | Single-source code exercises with existing output/timeout rules. |
| `m8-l10`, `m9-l1`, `m9-l7`, `m9-l8` | No-execution knowledge check | OOP design trade-offs, module responsibility, code/documentation reading and framework-neutral transfer. |

Static multi-file imports remain unexecuted. Module 9 file organization and the final capstone assess architecture and behavior inside a single source exercise; they must not be presented as a multi-file bundler.

### Assessment and lesson implementation requirements

Use the full per-lesson objectives, examples/starter code, expected output, validation, feedback, hints, misconception, comprehension check and test mapping in `curriculum-spec.md` §9. Add each lesson as an isolated `app/src/content/mN-lN.js` plus matching `.test.js`; register it in `content/index.js`; add objective arrays to canonical metadata only when implementing the approved lesson. Add module integration tests for execution mode, navigation, module completion, progress, persistence and reset.

Reuse `createBaseValidator` and the existing exercise feedback/hint/navigation components wherever possible. Async validators must receive only the terminal result for the active run. Output-only validators do not prove source technique; use immutability/state assertions, objective-specific prediction questions and short explanations where the outcome requires them.

### Testing and deployment gates

- Unit tests: async completion, timer scheduling/cancel, Promise resolution/rejection, `finally`, unhandled rejections, pending-run timeout, message schema/IDs, output/request quotas, 404/network distinction, JSON limits, worker termination and recovery.
- Integration tests: exercise success/failure, output ordering, retry, stale responses, lesson switching, app teardown, progress idempotency/persistence/reset and unchanged Modules 1–6 behavior.
- Browser tests: microtask-before-timer order, callback output, rejected/unresolved Promise handling, infinite loops, timer cleanup after success, async timeout responsiveness, fixture request restrictions, keyboard/screen-reader status, and rerun/navigation. Use real browser engines; jsdom is supplemental only.
- Local Vite development/preview policies cover the approved API origin in the app and deny connections in both restricted Workers. The production host's actual response headers remain unverified. Browser verification covers integrated Chromium 150.0.7871.250 / Electron 43.8.3 only; Firefox, Edge and Safari remain unverified.
- Preserve the known large main-bundle advisory as separate technical debt. No framework package, browser test dependency, remote API, or production hosting provider is selected by this plan.
