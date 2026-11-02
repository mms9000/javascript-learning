# Architecture Specification — Interactive JavaScript Learning Platform

**Version:** 1.2  
**Status:** Confirmed — Phase 3 execution boundary specified  
**Parent:** `constitution.md`, `requirements.md`

## 1. Architecture goals

- Minimize initial complexity and cost.
- Keep lesson content independent of presentation.
- Support a browser-based JavaScript playground.
- Preserve the security boundary between learner code and the application.
- Enable automated testing and incremental curriculum expansion.

## 2. Confirmed technology choices

The following choices are confirmed for the MVP. Changes require a specification update.

| Concern | Decision |
|---------|----------|
| Teaching language | JavaScript |
| Application language | JavaScript (TypeScript optional for app code; not required by learners) |
| Build tooling | Vite |
| Interface | HTML, CSS, and modular JavaScript; UI framework only if justified |
| Code editor | CodeMirror |
| Code execution | Dedicated Web Worker with stripped global scope and hard watchdog termination for ordinary JavaScript; a separate, bounded Worker-backed DOM-like model is implemented for Module 6 under §5.8 |
| Progress persistence | Browser localStorage for the MVP |
| Unit testing | Vitest |
| Linting | ESLint |
| Browser automation | Real-browser end-to-end verification is required; tooling remains to be selected (current repository baseline is Vitest/jsdom) |
| Hosting | Static HTTPS; must support the approved Worker architecture and content security policy |

## 3. Application modules

### Curriculum module
Provides the course map, lesson order, prerequisites, and completion state.

### Lesson module
Renders explanations, examples, activities, summaries, and lesson navigation.

### Playground module
Manages the editor, Run action, execution state, output, errors, timeout status, and reset behavior.

### Exercise module
Loads exercise definitions, collects answers or code, evaluates results, and displays hints and feedback.

### Progress module
Stores and retrieves completion information and exercise results.

### Content module
Contains version-controlled lesson content, runnable examples, exercise definitions, evaluation rules, and documented expected outcomes.

### Testing module
Verifies application behavior, content validity, exercise grading, persistence, accessibility, and code-execution boundaries.

## 4. Lesson content model

Each lesson SHOULD contain:

- Stable lesson ID.
- Title and description.
- Learning objectives.
- Prerequisite IDs.
- Ordered content blocks.
- Runnable code examples.
- Exercise definitions and evaluation rules.
- Assessment and completion rules.
- Next and previous lesson references.

Content MUST be validated for required fields, valid references, and unique IDs before publication.

## 5. Code execution architecture

Learner code MUST NOT execute directly in the privileged application context.

### 5.1 Isolation mechanism and thread separation

The execution architecture addresses two fundamental isolation concerns:
1. **Capability Isolation:** Preventing untrusted code from accessing unauthorized APIs, platform `localStorage`, cookies, or the parent application's DOM.
2. **Resource & Thread Isolation:** Preventing an infinite synchronous loop (e.g. `while (true) {}`) from monopolizing the browser's main event loop and freezing the platform UI.

To achieve both capability isolation and resource/thread isolation without freezing the UI thread, pure JavaScript code execution (Modules 1–5, including the MVP vertical slice) runs inside a **Dedicated Web Worker** with stripped capabilities:
- **Independent OS Thread:** The worker executes on a distinct OS background thread. If learner code enters an infinite loop or recursive freeze, the main UI thread remains 100% interactive.
- **Hard Watchdog Termination:** The parent application maintains an active execution timer (default: 5000ms). If execution does not complete within this window, the parent invokes `worker.terminate()`, instantly halting the thread at the browser engine level, and re-spawns a fresh worker.
- **Natural Boundary:** By design, Web Workers have no access to `window`, `document`, DOM nodes, cookies, `localStorage`, or `sessionStorage`.

The Phase 12 ADR in §5.8 records the approved and implemented browser/DOM execution approach: a separate Worker-backed controlled DOM model. No iframe execution is implemented.

### 5.2 Capability model

The table below documents what student code can and cannot do inside the execution context.

| Capability | Status | Notes |
|-----------|--------|-------|
| `console.log` / `console.warn` / `console.error` | ✅ Allowed | Intercepted, serialized, and relayed via `postMessage` |
| Core JavaScript language (variables, functions, loops, etc.) | ✅ Allowed | Full language access within isolated scope |
| Parent DOM / UI access | ❌ Blocked | Worker has no `document` or `window` access |
| `localStorage` / `sessionStorage` | ❌ Blocked | Not exposed in Web Worker scope |
| Cookies | ❌ Blocked | Not exposed in Web Worker scope |
| `indexedDB` | ❌ Blocked | Neutralized (`undefined` and non-writable) in bootstrap scope |
| `caches` (CacheStorage) | ❌ Blocked | Neutralized (`undefined` and non-writable) in bootstrap scope |
| `fetch` / `XMLHttpRequest` / `WebSocket` | ❌ Blocked | Explicitly neutralized / overwritten in bootstrap scope |
| `EventSource` / `navigator.sendBeacon` | ❌ Blocked | Explicitly neutralized in bootstrap scope |
| `importScripts()` | ❌ Blocked | Overwritten / neutralized in bootstrap scope |
| `alert` / `confirm` / `prompt` | ❌ Blocked | Not available in Worker scope |
| Opening new windows / popups | ❌ Blocked | Not available in Worker scope |
| Form submission | ❌ Blocked | Not available in Worker scope |
| Access to parent application state | ❌ Blocked | Strict postMessage boundary; no parent secrets provided |

Lessons that require capabilities not listed here MUST document this dependency and undergo a security review before granting additional sandbox permissions.

### 5.3 Communication protocol

All communication crosses the structured `postMessage` boundary. Both sender and receiver validate message shape and run IDs.

**Main application → Runner (run request):**

```json
{
  "type": "run",
  "executionId": "<uuid>",
  "code": "<student code string>",
  "timeoutMs": 5000
}
```

**Runner → Main application (output event):**

```json
{
  "type": "output",
  "executionId": "<uuid>",
  "kind": "log" | "warn" | "error" | "info",
  "args": ["<serialized string>"]
}
```

**Runner → Main application (completion event):**

```json
{
  "type": "done",
  "executionId": "<uuid>",
  "status": "success" | "error" | "terminated",
  "error": { "message": "<string>", "name": "<string>" } | null
}
```

**Defensive message handling rules:**
- Non-object, null, or malformed worker message payloads are discarded.
- Messages whose `executionId` does not strictly match `activeExecutionId` are discarded (preventing stale, foreign, or duplicate events).
- `kind` is validated against allowed console channels (`log`, `info`, `warn`, `error`), defaulting to `log`.
- Output arguments are capped in count and individual string lengths are truncated to `2,000` characters on the parent host to defend against bypassed or oversized payloads.
- Any output arriving after a run has completed or duplicate `done` messages are discarded.
- Uncaught worker-level errors (`onerror`) immediately terminate the broken worker, notify `onDone` with `RuntimeError`, and respawn a fresh worker so subsequent runs are unaffected.

### 5.4 Execution timeout, termination, and limits

- **Timeout:** The main application runs a watchdog timer (default: **5,000ms**) for each execution.
- **Hard Termination:** If no `done` message arrives before the timer fires:
  1. The run is marked **Terminated**.
  2. The parent calls `worker.terminate()` immediately, halting the background thread at the browser engine level.
  3. A fresh worker instance is spawned in the background.
  4. The UI displays an informative message explaining the execution was stopped due to exceeding the time limit.
- **Output Line Cap:** Max **100 log entries** per run. Output beyond 100 entries is truncated with a clear warning notice.
- **Line Length Cap:** Max **2,000 characters** per output argument to prevent memory exhaustion and UI locking.
- **Absence of Hard Memory Limit:** The browser's Web Worker API does **not** provide a mechanism to set a hard byte-level heap memory limit on a worker thread. Memory exhaustion protections rely entirely on string/entry truncation, worker termination via watchdog or manual stop, and automatic recreation of the worker.

### 5.5 Stale-message handling

Each run is assigned a cryptographically random UUID (`executionId`). The parent tracks the `activeExecutionId`. Any message arriving with a different `executionId` is silently discarded. This prevents output from a timed-out, canceled, or delayed run from contaminating a subsequent run. When a new run is initiated while an execution is still in progress, the prior run is superseded, the running worker is terminated, and a fresh worker is initialized.

### 5.6 Security boundary, verified protections, and residual risks

The Web Worker architecture provides thread and capability isolation for learner code, but it is **not** a full cryptographic virtualization sandbox. The precise boundaries and limitations are documented below:

#### Verified Protections:
- **Thread Isolation:** Pure JavaScript code executes on a dedicated Web Worker OS thread. Synchronous infinite loops (e.g. `while(true){}`) do not lock the platform UI thread.
- **Watchdog Hard Kill:** A 5,000ms watchdog timer on the host thread invokes `worker.terminate()`, reliably destroying non-terminating worker threads.
- **Zero Access to Parent Storage & Secrets:** Web Workers have no access to parent DOM, `window`, `document`, cookies, `localStorage`, or `sessionStorage`.
- **Capability Neutralization:** Persistent storage APIs (`indexedDB`, `caches`), network APIs (`fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`), and dynamic loading (`importScripts`) are neutralized in the worker scope.
- **Safe Output Rendering:** Output logs are rendered exclusively as text nodes (`document.createTextNode` or `.textContent`) on the host UI, eliminating DOM-based XSS vectors.
- **Defensive Message Ingestion:** The host validates message types, sanitizes message argument lengths, and discards stale/duplicate messages.

#### Residual Risks and Browser Limitations:
- **No Per-Worker Memory Quota:** Browsers do not enforce a hard memory limit on Web Workers. Runaway memory allocations (e.g., massive arrays) execute until worker termination, garbage collection, or browser-level tab crash.
- **Shared Browser Process:** The worker thread shares the host tab's OS process and memory address space.
- **Dynamic Code Evaluation (`'unsafe-eval'`):** Evaluating learner-submitted strings via `new Function()` requires `'unsafe-eval'` in the executing Worker policy (the ordinary Blob Worker inherits its creator policy; the external DOM Worker uses its own response policy). The DOM learner scope disables `Function` and function-prototype constructor access after capturing the constructor for trusted execution. CSP cannot distinguish learner code from other dynamic eval calls.
- **Microarchitectural Side-Channels:** Without Cross-Origin-Opener-Policy (`same-origin`) and Cross-Origin-Embedder-Policy (`require-corp`) headers, fine-grained CPU timing attacks (e.g., Spectre) cannot be eliminated by client-side code alone.

### 5.7 Superseded Phase 12 iframe proposal — retained for decision history

**Superseded:** An earlier draft proposed direct iframe execution. It was rejected because synchronous runaway code cannot be reliably terminated by a parent timer if the browser renderer is blocked. The final comparison, decision, constraints, and implementation evidence are maintained in §5.8.

### 5.8 Phase 12 Architecture Decision Record — controlled DOM interface (APPROVED AND IMPLEMENTED)

**Status:** Option B was explicitly approved and implemented. This ADR supersedes §5.7.

**Context:** Module 6 teaches selection, element updates, events, and forms. The existing runner evaluates learner code in a dedicated Worker, which has no `document`/`window` and can be hard-terminated by the host watchdog. A direct iframe gives genuine browser DOM APIs, but a synchronous infinite loop may block the shared renderer and parent watchdog. A parent timer is not an adequate watchdog if it cannot run.

#### Options considered

| Criterion | A. Sandboxed iframe; direct DOM | B. Existing Worker; controlled DOM interface | C. DOM simulation |
|---|---|---|---|
| Security/isolation | Separate browsing context and opaque origin with `sandbox="allow-scripts"`; reduces same-origin access, but does not guarantee process separation, memory limits, or parent responsiveness. | Learner code remains in a dedicated Worker with stripped globals and watchdog. It receives only a small DOM-like facade; host renderer exposes operations, never host nodes or references. | Small data model in a Worker or no execution; no browser capabilities are exposed. |
| Platform application access | Parent DOM should not be passed. Opaque-origin `event.origin` is `"null"`; source-window checks are required. | No `document`, `window`, application object, storage, or host node crosses into the Worker. Host receives only validated data operations/snapshots. | No platform access; model and examples are data-only. |
| Native DOM compatibility | Highest: browser-native nodes/events/forms/focus. | Partial: API names/operations can mirror a documented subset (`querySelector`, `textContent`, `createElement`, append, basic listeners), but there are no native nodes, full event propagation, layout, or browser form defaults. Host preview uses trusted native controls generated from the model. | Lowest: behavior exists only as explicitly specified simulation. |
| Termination and runaway code | Not acceptable as default. Parent JS timer may not run while iframe blocks its renderer thread; removing the iframe is not proven to unblock it. | Existing Worker thread and `worker.terminate()` stop learner execution at watchdog. No hard memory quota or universal browser guarantee is claimed. | Worker-backed simulation can use the Worker watchdog; fixed no-execution assessment cannot contain arbitrary loops. |
| Network/storage/navigation | Sandbox flags and CSP reduce access, but navigation/egress and policy deployment need complex verification. | Direct network, storage, navigation, and Worker APIs are disabled on the Worker global and its prototype chain; the facade exposes none. CSP and browser behavior remain part of the boundary, not a complete sandbox guarantee. | No such APIs are modeled. |
| Messaging/result validation | New cross-context protocol; validate source, run IDs, schemas and caps; opaque origin is not authentication. | Worker source plus run ID and strict versioned schema; validate every operation, node/event ID, output length/count, and run state. Existing exercises retain their protocol; DOM mode requires a separate protocol. | Deterministic local checks; no cross-context bridge unless executed in Worker. |
| Cleanup/lesson switching | Remove frame and clear host listeners/timers; removal cannot be relied on as the execution watchdog. | Terminate/reset the active Worker on timeout, rerun, reset, lesson switch, or app destruction; clear preview, node/event state, and listeners. | Drop model state and reset or terminate Worker. |
| Browser compatibility | CSP, opaque origin, frame sandbox, and termination behavior vary; requires real-browser deployment tests. | Uses the existing Worker support requirement. Preview controls are trusted native host-rendered controls; modeled behavior is defined consistently. Still requires browser testing. | Broad compatibility; model fidelity, not browser compatibility, is primary risk. |
| Accessibility | Native frame controls can be accessible, but frame focus/context changes and cleanup must be explained and tested. | Host renders real labeled native controls and live regions; learner code cannot bypass required labels/focus constraints. Browser tests validate keyboard behavior. | Knowledge checks can be accessible; simulation cannot demonstrate native focus/form behavior. |
| Maintenance complexity | High: isolated origin, CSP/deployment headers, frame lifecycle, opaque messaging, browser-runaway uncertainty. | Medium/high: virtual tree, safe renderer, event bridge and quotas; bounded and compatible with existing watchdog. | Low/medium for small scope; risks misrepresenting browser APIs and growing a duplicate DOM implementation. |

#### Decision

**Decision: B accepted and implemented:** retain the existing Web Worker execution model and add a separate, narrowly scoped Worker exercise mode with a **controlled DOM-like interface**, backed by a bounded virtual tree and trusted host-side preview renderer. The existing pure-JavaScript Worker request/response behavior remains unchanged. DOM mode uses a separate versioned protocol. Learner code receives a facade, not actual host DOM nodes or the platform `document`.

This is not native DOM execution. Teach a carefully bounded subset with API names and behavior matching introductory browser concepts, and label the preview as a **controlled DOM model**. Real-browser automation verifies host-rendered controls, keyboard interaction, focus, and accessibility; it cannot establish full native DOM compatibility. If objectives require native event propagation, layout, or arbitrary DOM APIs, stop for a new architecture decision.

**Educational trade-off:** B retains the meaningful experience of changing elements, handling events, and validating forms while isolating synchronous CPU work in a Worker. Learners will not observe full browser DOM semantics. C is suitable for conceptual checks but not the interactive DOM milestone. A offers greatest fidelity but does not meet the mandatory reliable termination requirement absent a demonstrated browser-provided hard isolation/termination mechanism.

#### B protocol, configured limits, and threat scenarios

- Each DOM exercise runs in a dedicated Worker instance or isolated execution instance with a run ID and DOM-mode protocol. Existing pure-JavaScript lessons continue using the current protocol unchanged.
- The Worker facade exposes a documented subset: learner code receives a fixture-scoped modeled `document` parameter with `querySelector` for fixture IDs, `createElement` for allowlisted tags, `textContent`, append operations, fixture-scoped `querySelectorAll` for approved selectors, `children.length`, input `value`, checkbox `checked`, host-rendered `focus()`, and click/submit/change listeners with modeled event fields (including `target` and `preventDefault()`). The Worker global's `document`, `window`, `parent`, `location`, storage, and direct network client are unavailable; there is no `innerHTML` or arbitrary host callback.
- The Worker owns a virtual tree and sends typed state operations/snapshots. Host code validates and renders via trusted DOM APIs (`createElement`, safe properties, `textContent`); learner strings are never interpreted as markup. Unknown node IDs, selectors, tags, event types, malformed messages, and stale IDs are rejected.
- Correlate every message with current run ID and protocol version; validate source Worker, schema, sequence/run state, message count, string lengths, node/listener counts, and tree depth. Stale/duplicate/post-completion messages are discarded. Learner output is not trusted proof of assessment success.
- Configured per-run caps: 200 virtual nodes, depth 20, 50 event registrations, 100 combined protocol/output entries, 2,000 characters per string, and 5,000ms for initialization and each dispatched event callback. A watchdog and heartbeat terminate the Worker when it blocks synchronously, including after its initial response. Exceeding structural limits yields learner-facing feedback. These are application-level limits, not hard memory quotas.
- User interactions in the preview become validated event messages to the active Worker. Rate-limit them under the 100-entry run cap. Rerun/reset/lesson switch/app destroy terminates or resets that Worker and discards all tree, event, output, and input state. Do not persist the DOM model.

Threat scenarios MUST include `while (true) {}`, deep/non-terminating recursion, long synchronous computation, listener floods, node/depth floods, malformed/repeated/stale messages, unexpected node IDs/types, attempted `fetch`/storage/global access, output floods/oversized strings, and attempts to request navigation or arbitrary host commands. Verify the Worker terminates within its watchdog while the parent remains responsive. The facade must not expose the platform document/window, application state, localStorage/progress APIs, secrets, or privileged host APIs.

**Implementation verification:** Unit tests cover model and protocol quotas, malformed/oversized/stale messages, watchdog termination, interaction validation, and cleanup. In the integrated Chromium/Electron browser (Chrome 150.0.7871.250; Electron 43.8.3), real Worker checks exercised synchronous and post-result runaway loops, recursion, node/listener/output caps, model rendering and keyboard-accessible form behavior, lesson-switch cleanup, and the capability boundary. The production preview was also exercised in this browser. Firefox, Edge, and Safari were not tested.

The Worker blocks the tested network/storage/host APIs both as global properties and through inherited prototypes. Its trusted bootstrap retains a captured `Function` constructor to execute learner code, while the learner scope cannot access `Function`, `eval`, or ordinary/async/generator function constructors. Acorn rejects all learner `import()` expressions before evaluation; CSP alone would still allow same-origin dynamic imports. Static imports required by the Worker implementation remain allowed. This is not a complete VM sandbox. The Worker has no hard memory quota and cannot prevent browser-engine vulnerabilities, side channels, large allocations until termination, all renderer/process failures, or incorrect learner-visible claims. Browser testing is empirical evidence for the tested versions only, not a universal guarantee. Vite development and local preview response headers were verified; production hosting remains unverified.

**Rejected alternatives:**

- **A: Direct iframe DOM:** rejected as default because reliable termination of synchronous loops cannot be guaranteed by a parent timer when the renderer is blocked. `allow-same-origin` would remain disabled in any separately approved experiment; it does not solve termination. Do not implement A under this plan.
- **C: Simulation only:** rejected for DOM exercises/milestone because it would not give learners interactive controls and could obscure the difference between modeled and native behavior. Retain only for non-execution comprehension examples, with limitations stated.

**Implementation outcome:** B remains the approved architecture. If future objectives require full native DOM access, stop and request a new security design; do not silently enable iframe execution.

### 5.9 Phase 13 — approved asynchronous execution and controlled HTTP access

This section records the approved and implemented Module 7 execution mode. The existing ordinary JavaScript runner and DOM Worker contracts remain unchanged.

#### Verified existing behavior and gap

- `app/src/runner.js` creates one Blob Worker per runner instance, executes a code string with `new Function(data.code)`, and enforces a 5,000ms parent-thread watchdog. The Worker serializes output with the existing 100-entry/2,000-character limits and tags output/terminal messages with an execution ID; the parent discards messages whose ID is no longer active.
- The bootstrap checks whether the immediate return value is thenable. It calls `.then()` and reports success after that Promise settles; a rejection of that returned Promise is reported as an error. Thus a returned Promise/async-IIFE can work in some cases, but this is not a complete asynchronous execution contract.
- `new Function` is not an async-function body, so top-level `await` is invalid. Learners must currently wrap async work and return its Promise. Unreturned Promise rejections are not explicitly collected; asynchronous callback errors have no deliberate result contract.
- Worker-native timers are available in the ordinary Worker and are not tracked or quota-bounded by `runner.js`. The runner clears its watchdog when it receives `done`, but does not terminate the Worker then. A timer or interval can therefore outlive the reported result; later output is ignored after the active ID is cleared, but the work can continue. Promise chains that spawn timers have similar ambiguity.
- `Promise` microtasks can run before a returned Promise settles. The current runner does not model or label microtask checkpoints versus later timer tasks. Output received before `done` is validated only when a terminal result is reported, but there is no tracked-task quiescence rule for timers.
- The DOM training Worker intentionally disables timers, direct network APIs and dynamic imports. It has a separate protocol and must not be changed into the Module 7 async runner.

#### Approved bounded extension

Add a distinct `async-worker` exercise mode for Module 7; do not silently change the ordinary Worker protocol or DOM Worker. Reuse the current runner's execution-ID, serialized-output, error/result and parent-watchdog conventions where practical, while giving the async mode an explicit, versioned internal task/request lifecycle. Existing lessons keep their synchronous Worker behavior. Module 8 and synchronous Module 9 coding exercises continue using the existing mode.

- Compile submitted code in a controlled async wrapper and require the wrapper's returned Promise to settle. The runner must not declare completion solely because the initial synchronous stack returned.
- Provide real Worker `setTimeout`/`clearTimeout` behavior through tracked wrappers. Do not expose `setInterval`; do not expose unbounded native timer registration via the Worker global. Configured limits: 50 timer registrations, delay no greater than 2,000ms, a 5,000ms overall watchdog, 100 learner output entries plus a truncation warning, 110 total Worker messages, 20 console arguments, and 2,000 characters per serialized output value. All callback errors terminate as execution errors.
- Report success only when the root Promise has settled and all timers registered through the wrapper have completed/cancelled, followed by a later task-turn completion check so Promise microtasks queued by the last callback can drain. A never-settling root Promise, microtask loop, recursive timer loop, or synchronous loop remains bounded by the parent watchdog and callback quota. There is no browser API for a hard memory quota.
- Attach deliberate Worker error and `unhandledrejection` handling before user code runs. A handled awaited rejection is ordinary learner code; an unhandled rejection is a failed run. Never infer completion from an unhandled or unreturned Promise. On terminal success/error/timeout/reset/lesson switch, terminate the Worker and reject all later outputs/requests by execution ID. A late timer must not emit learner-visible output after success.
- A timer-created callback that starts additional asynchronous work must either be represented by a tracked timer/request or be returned/awaited by the root Promise. The supported completion contract must be taught explicitly. Arbitrary APIs that can remain pending indefinitely are not supported.
- Preserve native ordering within the supported environment: current stack first, Promise jobs at a microtask checkpoint, then a later timer task. Tests assert this specific ordering without claiming exact timing or ordering among unrelated tasks.

#### Restricted external Fetch bridge for Module 7

The Async Worker has no direct network access. The Module 7 external-data objective is implemented through a host-mediated request bridge exposed as a narrow `fetch`-compatible facade only in `async-worker` mode:

1. Learner code can request only `GET https://jsonplaceholder.typicode.com/todos/1` and `GET https://jsonplaceholder.typicode.com/todos/999999999` (the approved success and 404 examples). No caller-supplied origin/path, credentials, headers, body, arbitrary method, redirect, or other destination is accepted.
2. The Worker sends a versioned message with active execution/request IDs and the exact URL. The host independently validates every message and performs the cross-origin GET; the Worker's direct `fetch`, XHR, sockets, `importScripts`, storage, and nested Worker APIs remain disabled.
3. Use `credentials: "omit"` and `redirect: "error"`. Enforce at most three requests per execution, a 64 KiB streamed response cap, a 3,000ms request timeout, and response-schema validation. The success response must be JSON `{ userId: positive integer, id: 1, title: non-empty string up to 200 characters, completed: boolean }`; the approved 404 response is `{}`. A 404 resolves to a response-like object with `ok === false` and `status`; network/timeout failures reject. The Worker facade supports only `ok`, `status`, and `json()`.
4. The parent watchdog remains effective while the Worker waits. Timeout, cancellation, stale execution, or lesson change aborts the matching host request and terminates the Worker; stale results are ignored.
5. The public endpoint and CORS response were verified from the localhost application origin in integrated Chromium. The endpoint requires no API key or authentication. It is an external service, not a deterministic fixture; availability and content remain outside the application's control.

This cross-thread message path and host-side capability are approved for Module 7. The document `connect-src` policy permits only the application origin and this API origin, plus Vite HMR WebSockets in development. Do not enable direct or arbitrary Worker networking as a shortcut.

#### Mode separation and compatibility

| Lesson group | Proposed execution mode | Contract |
|---|---|---|
| `m7-l1` | No-execution knowledge check | Event-loop traces; no timer implementation required for the prediction assessment. |
| `m7-l2`–`m7-l7` | New bounded async Worker | Tracked timer tasks, settled Promise root, and validated host fetch bridge for the two approved external URLs; no direct network. |
| `m8-l1`–`m8-l9`, `m9-l2`–`m9-l6`, `m9-l9` | Existing synchronous Worker | Single-source JavaScript, ordinary output and existing timeout; no DOM or browser global. |
| `m8-l10`, `m9-l1`, `m9-l7`, `m9-l8` | No-execution assessment | Design decisions, file organization, code reading and framework-neutral transfer. No multi-file imports execute. |

Async lesson validators receive results only after an explicit terminal status for the current run. They must not grade intermediate console messages as completion. Existing `createBaseValidator` behavior remains the default; extend result handling only as needed for a terminal async result and preserve existing validator call signatures for Modules 1–6.

#### Security, failure and verification obligations

- Worker messages, including fetch requests and responses, are untrusted. Validate protocol/version, source Worker, execution/request ID, message type, sequence/state, counts, string lengths, route allowlist, response status/shape, and duplicate/stale messages. The IDs correlate messages; they are not authentication.
- No request can expose app storage, secrets, credentials or application state. The only network action is the host's fixed, credentials-omitted GET to one of two public HTTPS URLs. Do not expose raw `fetch` or host objects to learner code.
- Unit/integration tests cover returned and unreturned Promises, fulfilled/rejected/never-settling Promises, `then`/`catch`/`finally`, timer ordering and cancellation, unhandled rejections, timer/output/request floods, malformed and stale messages, HTTP 404 vs network rejection, JSON bounds, timeout, reset/lesson cleanup, recovery, and regression of existing Worker/DOM contracts.
- Real-browser tests must demonstrate that an infinite synchronous loop and never-settling async run do not freeze the host; timers are cancelled on terminal completion; late responses cannot overwrite a rerun; and the fixture request is same-origin only. Test supported desktop Chrome, Edge, Firefox and Safari releases before making a compatibility claim. Local preview is not production-host verification.
- This design remains a constrained Worker execution environment, not a VM sandbox; it cannot provide a hard memory quota or universal security guarantee. Existing Phase 12.1 production-header and browser-matrix limitations remain open.

## 6. Output protocol

The playground SHOULD return structured execution results containing:

- Execution ID.
- Ordered console output entries.
- Error information, if any.
- Execution status.
- Timeout or termination status, if applicable.

The application MUST distinguish successful execution with output, successful execution without output, execution failure, and termination due to a limit.

## 7. Progress storage

The MVP SHOULD store a versioned progress record in local storage. It MAY include completed lesson IDs, exercise completion state, and timestamps. It MUST NOT contain unnecessary personal data.

The application MUST handle missing, corrupted, or outdated records safely and offer a way to reset local progress. It MUST tell learners that browser-local progress is not automatically synchronized between devices.

The course-wide progress indicator MUST display the number of completed lesson IDs in the existing progress record over the total number of lesson entries in the canonical curriculum. The denominator MUST include future lessons whose content is not yet registered and MUST be derived from the canonical curriculum data (for example, through a shared curriculum helper), not duplicated as a literal in the application. The current canonical map contains 64 entries. Resetting progress therefore displays `0/64`; reloading restores the recorded completion count while deriving the denominator from the curriculum again. This denominator rule MUST NOT change the localStorage schema or the representation of completed lesson IDs.

## 8. Quality attributes

- Core lesson content SHOULD load independently of the playground.
- Editor or execution failures MUST NOT prevent navigation to other lessons.
- Content and application logic MUST be testable separately where practical.
- Dependencies MUST be documented and reviewed.
- Essential flows MUST be tested on supported screen sizes and browsers.

## 9. Deployment

The application MUST be built reproducibly and deployed over HTTPS.

### Content Security Policy (CSP) Requirements:

The application and its external DOM-training and Async Workers require distinct response policies. Production hosting MUST serve the application policy on the document and the restricted Worker policy on both Worker script responses. A document meta policy does not supply or replace the policy on those external Worker responses; `frame-ancestors` is enforced only when delivered as an HTTP response header.

Application response policy:

```http
Content-Security-Policy: default-src 'none'; script-src 'self' 'unsafe-eval'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://jsonplaceholder.typicode.com; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; frame-ancestors 'none'
```

DOM-training and Async Worker response policy:

```http
Content-Security-Policy: default-src 'none'; script-src 'self' 'unsafe-eval'; worker-src 'none'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; frame-ancestors 'none'
```

Directive rationale and limits:
- Application `worker-src 'self' blob:` supports the module DOM Worker and the existing Blob-backed ordinary JavaScript Worker. The DOM Worker response's `worker-src 'none'` prevents child Worker creation.
- Worker `script-src 'self'` permits the Worker bundle and its same-origin static dependency graph, but does **not** prevent same-origin dynamic `import()`. The DOM execution path therefore parses learner code with Acorn and rejects every `ImportExpression` before evaluation. Function, async-function, generator, and async-generator constructor access is disabled to prevent constructing code that bypasses this parse-time restriction.
- `script-src 'unsafe-eval'` is required by the approved `Function`-based learner-code execution mechanism. It is not a module-loading restriction and does not provide complete isolation.
- Worker `connect-src 'none'` blocks direct Worker network connections; the approved API call is performed by the host under the application policy. The application allows only same-origin connections and `https://jsonplaceholder.typicode.com`; development additionally permits Vite HMR WebSockets (`ws:`). `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`, and `frame-src 'none'` disallow unrelated capabilities.
- `style-src 'self' 'unsafe-inline'` supports app and CodeMirror styling; `img-src 'self' data: blob:` supports existing local assets.

Production responses MUST also include `X-Content-Type-Options: nosniff`, a restrictive `Referrer-Policy`, and a `Permissions-Policy` denying unused device/sensor capabilities. Enable HSTS only after HTTPS hosting is configured. Vite development and preview configurations apply the restricted Worker response policy to both DOM and Async Worker scripts; the application policy adds only the approved API origin. Cloudflare Pages is the selected static hosting target, with `app/public/_headers` providing the production response policies. Production readiness remains unverified until deployed response headers and Worker startup are checked on the actual Pages URL. The meta policy is supplemental and does not satisfy this hosting requirement.

## 10. Deferred decisions

Cloud synchronization, authentication, remote grading, analytics, and backend services are excluded from the initial architecture unless an approved requirement establishes their necessity.
