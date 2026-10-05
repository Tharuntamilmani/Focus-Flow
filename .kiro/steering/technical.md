---
inclusion: always
---

# FocusFlow — Technical Steering

## Technology Stack
- **HTML5** — semantic markup only (`<main>`, `<header>`, `<section>`, `<label>`, etc.)
- **CSS3** — custom properties, flexbox, no frameworks, no preprocessors
- **Vanilla JavaScript (ES2020)** — no transpilation, no bundler, runs directly in modern browsers
- **localStorage** — sole persistence mechanism; no IndexedDB, no cookies, no server

## Dependency Policy
- **Zero runtime dependencies.** No libraries, no CDN links, no npm packages loaded at runtime.
- **Test-only dependencies:** `vitest` and `fast-check` are the only allowed npm packages and are `devDependencies`.
- Do not add lodash, jQuery, React, Vue, Axios, or any other runtime library.

## File Structure
```
e:\Study-Planner\
├── index.html          ← application shell (load this in a browser to run)
├── style.css           ← all styles
├── app.js              ← all application logic + conditional exports for testing
├── tests/
│   └── tasks.test.js   ← property-based tests (Vitest + fast-check)
├── package.json        ← devDependencies and test script only
└── .kiro/              ← Kiro configuration artefacts
```

## Code Conventions

### JavaScript
- Use `const` and `let`; never `var`.
- Pure task-management functions go at the top of `app.js`. They must be free of DOM access and side effects.
- DOM manipulation functions go in a clearly marked second section of `app.js`.
- Use `crypto.randomUUID()` for task IDs (falls back to `Date.now().toString()` if unavailable).
- Wrap all localStorage calls in try/catch.
- Export pure functions at the bottom of `app.js` via `if (typeof module !== 'undefined') { module.exports = ... }` so Vitest can import them without a browser.

### CSS
- Define all colours, spacing, and radii as CSS custom properties on `:root`.
- Use BEM-inspired class names: `.task-item`, `.task-item--completed`, `.badge--high`, etc.
- Media queries use `min-width` (mobile-first).

### HTML
- One `<label>` per form control, always associated via `for`/`id`.
- Interactive elements that are not native buttons must have `role` and `tabindex`.
- Use `aria-label` on icon-only buttons.
- Use `aria-pressed` on filter toggle buttons.
- Use `<progress>` for the progress bar with an `aria-label`.

## Accessibility Requirements
- WCAG 2.1 AA colour contrast for all text.
- No information conveyed by colour alone — priority badges include a text label.
- Focus order follows DOM order.
- Focus is not lost after any user action (e.g. after adding a task, focus returns to the input).

## Responsive Requirements
- Mobile-first layout. Base styles target 320 px screens.
- Single breakpoint at `min-width: 600px` widens the card and places the form controls in a row.
- No horizontal scrollbar at any supported viewport width (320 px – 1440 px).

## Testing Rules
- Tests must only import pure functions from `app.js`. No DOM, no localStorage, no browser globals in tests.
- Use `fast-check` arbitraries to generate test data. Do not hardcode specific task titles.
- Each property must be falsifiable — write properties that would actually catch real bugs.
- Run tests with: `npm test` (which calls `vitest run`).
