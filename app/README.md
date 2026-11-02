# Interactive JavaScript Learning Platform — Application

This directory contains the application source code.

## Prerequisites

- Node.js 20 or later
- npm 10 or later

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server at `http://localhost:5173` |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the Vitest test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint on all source files |

## Free hosting with Cloudflare Pages

The app is configured for static deployment on Cloudflare Pages. The `public/_headers` file supplies the required application and Worker Content Security Policies and shared security headers.

1. Push this repository to GitHub.
2. In Cloudflare, open **Workers & Pages**, choose **Create application** > **Pages** > **Connect to Git**, then select this repository and the branch to deploy.
3. Configure the build:
   - **Root directory:** `app`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Save and deploy. Cloudflare Pages will provide a public HTTPS URL.

After deployment, verify the response headers on `/`, `/assets/dom-worker-<hash>.js`, and `/assets/async-worker-<hash>.js`. The page must have the application CSP; both Worker responses must have the restricted Worker CSP. Also open the playground and confirm the exercises run. Production-host behavior is not verified until these checks pass.

## Project structure

```
app/
├── index.html              # HTML entry point
├── vite.config.js          # Vite and Vitest configuration
├── eslint.config.js        # ESLint flat config (v9)
├── package.json
└── src/
    ├── main.js             # Application entry point (mounts app)
    ├── app.js              # Root application factory (createApp)
    ├── app.test.js         # Integration tests for createApp and layout
    ├── curriculum.js       # Curriculum module (full 9-module map, lesson order)
    ├── curriculum.test.js  # Unit tests for curriculum map
    ├── progress.js         # Progress module (localStorage persistence)
    ├── progress.test.js    # Unit tests for the progress module
    ├── test-setup.js       # Vitest/jsdom browser global mocks
    ├── runner.js           # Isolated Web Worker execution runner with watchdog
    ├── runner.test.js      # Unit and security tests for runner (Scenarios A–J)
    ├── style.css           # Responsive WCAG AA design system
    ├── components/
        ├── editor.js       # CodeMirror 6 editor wrapper with accessible labels
        ├── editor.test.js  # Unit tests for editor wrapper
        ├── playground.js   # Interactive playground (Run, Reset, secure output)
        ├── playground.test.js # Unit tests for playground component
        ├── navigation.js   # Curriculum tree navigation & mobile drawer
        ├── navigation.test.js # Unit tests for navigation component
        ├── lesson-view.js  # Lesson content renderer (objectives, cards, takeaways)
        └── lesson-view.test.js # Unit tests for lesson view component
    └── content/
        ├── index.js        # Lesson content registry
        └── m1-l1.js        # Module 1 Lesson 1 content
```

## Implementation status

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Confirm baseline decisions | ✅ Complete |
| 1 | Project initialization | ✅ Complete |
| 2 | Lesson interface | ✅ Complete |
| 3 | Code execution boundary | ✅ Complete |
| 4 | Exercise and feedback | Ready to begin |
| 5 | Progress persistence UI | Core implemented / UI pending |
| 6 | Vertical slice verification | Not started |

## Test results (Phase 3)

```
Test Files  8 passed (8)
Tests       66 passed (66)
```

All 66 tests pass. 0 ESLint errors. 0 npm audit vulnerabilities. Production build passes in 184ms. Live browser verification completed.

## Technology

- **Build:** Vite 8
- **Editor:** CodeMirror 6
- **Testing:** Vitest 5 + jsdom
- **Linting:** ESLint 9 (flat config)
- **Code execution:** Dedicated Web Worker with thread isolation, stripped capabilities, and watchdog termination — see `architecture-spec.md §5`
- **Progress:** localStorage with versioned schema

## Security note

Student-submitted JavaScript executes in a dedicated Web Worker running on an independent OS thread.
- Prohibited globals (`fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts`, `sendBeacon`) are neutralized inside worker scope.
- Zero access to DOM, `window`, `localStorage`, or cookies.
- Watchdog timer (5000ms) terminates runaway loops (`worker.terminate()`) and respawns a clean worker without blocking the main UI thread.
- Output text is safely inserted using `document.createTextNode` (no `innerHTML` evaluation).
- Scenarios A through J from `feature-spec-playground.md` are verified via unit tests and automated browser sessions.
