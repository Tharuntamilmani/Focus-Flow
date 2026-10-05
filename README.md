# FocusFlow

A lightweight, offline student productivity dashboard built for the **Kiro University Challenge**.

No frameworks. No server. No account. Open `index.html` in a browser and start working.

---

## Demo — How to Run

1. Clone or download this repository.
2. Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari).
3. That's it. No `npm install`, no build step, no internet required at runtime.

### Screenshots (manual steps)

To capture screenshots for your submission:

1. Open `index.html` in Chrome.
2. Add a few tasks with different priorities (e.g. "Read chapter 5 — High", "Buy textbooks — Low").
3. Mark one task complete by clicking its checkbox.
4. Screenshot the full page — you will see the progress bar update.
5. Click "Active" in the filter bar and screenshot again.
6. Open DevTools → Toggle device toolbar → set width to 375 px (iPhone) and screenshot.

---

## How to Run Tests

```bash
npm install        # install vitest + fast-check (first time only)
npm test           # runs all 12 property-based tests
```

Expected output:

```
✓ tests/tasks.test.js (12)
  ✓ P-1: addTask size invariant (2)
  ✓ P-2: filterTasks does not mutate the original array (3)
  ✓ P-3: clearCompleted removes all completed tasks (2)
  ✓ P-4: toggleTask idempotency (2)
  ✓ P-5: deleteTask removes the target task (3)

Test Files  1 passed (1)
     Tests  12 passed (12)
```

---

## Features

| Feature | Description |
|---|---|
| Add task | Title + priority (Low / Medium / High), Enter or click Add |
| Complete/incomplete | Checkbox toggles state with immediate visual feedback |
| Delete | Trash icon removes task permanently |
| Filter | All / Active / Completed — state persists across reloads |
| Progress bar | "X of Y tasks completed" updates in real time |
| Clear completed | Removes all done tasks at once; button hidden when none exist |
| Persistence | localStorage — tasks survive page refresh |
| Responsive | Works at 320 px through 1440 px wide |
| Accessible | Keyboard navigable, ARIA labels, no colour-only information |

---

## Architecture

```
e:\Study-Planner\
│
├── index.html              ← Application shell — semantic HTML5
├── style.css               ← All styles — CSS custom properties, mobile-first
├── app.js                  ← All logic
│   ├── Section 1           Pure task-management functions (side-effect free)
│   ├── Section 2           State (tasks[], filter)
│   ├── Section 3           Persistence (save / load via localStorage)
│   ├── Section 4           Render (DOM rebuild)
│   ├── Section 5           Event handlers
│   ├── Section 6           Boot (DOMContentLoaded, guarded for Node)
│   └── Section 7           Conditional module.exports for Vitest
│
├── tests/
│   └── tasks.test.js       ← 12 property-based tests (Vitest + fast-check)
│
├── package.json            ← devDependencies only: vitest, fast-check
│
├── .kiro/
│   ├── specs/focusflow/    ← Spec-driven development artefacts
│   │   ├── requirements.md
│   │   ├── design.md
│   │   └── tasks.md
│   ├── steering/
│   │   ├── product.md      ← Product context injected into every Kiro session
│   │   └── technical.md    ← Technical constraints injected into every session
│   ├── hooks/
│   │   └── run-tests.json  ← Auto-runs tests on .js file save
│   ├── agents/
│   │   └── qa-reviewer.md  ← Custom QA agent
│   └── powers/
│       └── focusflow-developer/
│           ├── plugin.json
│           └── skills/maintain-tasks.md
│
└── docs/
    └── mcp-setup.md        ← MCP filesystem server setup guide
```

### Data flow

```
User action
    │
    ▼
Event handler (handleAdd / handleToggle / handleDelete / handleFilter / handleClear)
    │
    ├─► Pure function (addTask / toggleTask / deleteTask / filterTasks / clearCompleted)
    │       returns new tasks[]
    │
    ├─► save()   ── serialise to localStorage
    │
    └─► render() ── rebuild DOM from tasks[] + filter
```

### Persistence model

```
localStorage['focusflow_tasks']  = JSON array of Task objects
localStorage['focusflow_filter'] = 'all' | 'active' | 'completed'
```

---

## Kiro University — Lesson Mapping

Every lesson from the challenge is demonstrated by a real, working file in this project.

| Lesson | What was built | Where to find it |
|---|---|---|
| **1. Spec-Driven Development** | Full spec with requirements, design, and implementation tasks written before any code | `.kiro/specs/focusflow/requirements.md` `.kiro/specs/focusflow/design.md` `.kiro/specs/focusflow/tasks.md` |
| **2. Steering** | Two always-active steering files inject product context and technical constraints into every Kiro session automatically | `.kiro/steering/product.md` `.kiro/steering/technical.md` |
| **3. Hooks** | `PostFileSave` hook triggers `npm test` automatically whenever a `.js` file is saved | `.kiro/hooks/run-tests.json` |
| **4. Property-Based Testing** | 12 tests across 5 properties using Vitest + fast-check; tests pure functions only, all pass | `tests/tasks.test.js` |
| **5. Powers** | Custom Power "FocusFlow Developer" with a skill explaining how to maintain the task-management code and test conventions | `.kiro/powers/focusflow-developer/plugin.json` `.kiro/powers/focusflow-developer/skills/maintain-tasks.md` |
| **6. MCP** | Filesystem MCP server config documented for local use — no credentials required | `docs/mcp-setup.md` |
| **7. Custom Agent** | QA Reviewer agent that inspects requirements, reads the implementation, runs tests, and reports findings without modifying code | `.kiro/agents/qa-reviewer.md` |

---

## Technology

- **HTML5 / CSS3 / Vanilla JavaScript (ES2020)** — zero runtime dependencies
- **localStorage** — offline-first persistence
- **Vitest 2.1.9** — test runner (dev only)
- **fast-check 3.22.0** — property-based testing (dev only)

---

## License

MIT
