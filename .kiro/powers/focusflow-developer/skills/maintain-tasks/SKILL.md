# Skill: Maintain FocusFlow Task-Management Code

## When to use this skill
Activate this skill when you are asked to:
- Add, modify, or remove a task-management function in `app.js`
- Update the task data model
- Add or change UI rendering logic in `app.js`
- Write or update property-based tests in `tests/tasks.test.js`
- Adjust styles for task items, badges, or the progress bar in `style.css`

---

## Project layout (relevant files)

```
app.js                  ← All logic — pure functions (top) + DOM functions (bottom)
style.css               ← All styles — CSS custom properties on :root
tests/tasks.test.js     ← Property-based tests — Vitest + fast-check
```

---

## Pure-function rules

All task-management functions live at the **top of `app.js`**, before any DOM code.

They must be:
- **Side-effect free** — no `document`, no `localStorage`, no `console.log`
- **Immutable** — always return a new array or object; never mutate the input
- **Exported** at the bottom via `if (typeof module !== 'undefined') { module.exports = ... }`

### Current pure functions

| Function | Signature | Contract |
|---|---|---|
| `createTask(title, priority)` | `→ Task` | Returns a new Task with a unique id, `completed: false` |
| `addTask(tasks, task)` | `→ Task[]` | Returns `[...tasks, task]` |
| `toggleTask(tasks, id)` | `→ Task[]` | Flips `completed` on the matching task; leaves others unchanged |
| `deleteTask(tasks, id)` | `→ Task[]` | Removes the task with the given id |
| `filterTasks(tasks, filter)` | `→ Task[]` | Returns a filtered copy; never mutates the input |
| `clearCompleted(tasks)` | `→ Task[]` | Keeps only tasks where `completed === false` |

### Task data model

```js
{
  id:        string,            // crypto.randomUUID() or fallback
  title:     string,            // non-empty, trimmed
  priority:  'low'|'medium'|'high',
  completed: boolean,
  createdAt: number             // Date.now()
}
```

---

## DOM / UI rules

DOM functions live in **Section 3 and 4** of `app.js` (clearly commented).

- `render()` is the single entry point for all UI updates — always call it after mutating state.
- `save()` must be called before `render()` in every handler so localStorage is never stale.
- Never access `localStorage` outside of `save()` and `load()`.
- Always wrap `localStorage` calls in `try/catch`.
- The boot block (`DOMContentLoaded`) is wrapped in `if (typeof document !== 'undefined')` so Node/Vitest can import the pure functions safely.

---

## CSS conventions

- All colours, spacing, and radii are **CSS custom properties** on `:root` in `style.css`.
- Class names follow **BEM** conventions: `.task-item`, `.task-item--completed`, `.badge--high`.
- Do not add inline styles to DOM elements created in `app.js` — use CSS classes only.
- Priority badge classes: `badge--low`, `badge--medium`, `badge--high`.

---

## Adding a new pure function — checklist

1. Write the function at the top of `app.js` (Section 1).
2. Add it to the `module.exports` block at the bottom.
3. Import it in `tests/tasks.test.js`.
4. Write at least one property-based test using a `fast-check` arbitrary.
5. Run `npm test` and confirm all 12+ tests pass.

---

## Adding a new property-based test — checklist

1. Define an arbitrary using `fc.*` that generates valid inputs.
2. Write a property that would actually **fail** if the function had a bug.
3. Use `fc.assert(fc.property(...))` — never hardcode specific values.
4. Group tests under a `describe` block named `P-N: <short description>`.

---

## What NOT to do

- Do not import any runtime library into `app.js` (no lodash, no axios, etc.).
- Do not add a build step or bundler.
- Do not add `localStorage` calls to pure functions.
- Do not add DOM queries to the test file.
- Do not skip the `module.exports` guard — it is what makes tests work.
