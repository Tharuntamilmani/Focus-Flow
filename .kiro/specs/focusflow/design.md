# FocusFlow — Design

## Architecture

FocusFlow is a single-page, zero-build web application.

```
e:\Study-Planner\
├── index.html        ← Shell, markup structure
├── style.css         ← All visual styles
├── app.js            ← All application logic
└── tests/
    └── tasks.test.js ← Property-based tests (Vitest + fast-check)
```

There is no bundler, no server, and no network dependency at runtime. Opening `index.html` directly in a browser is the complete "deployment".

---

## Data Model

A **Task** is a plain JavaScript object:

```js
{
  id:        string,   // crypto.randomUUID() or Date.now().toString()
  title:     string,   // non-empty, trimmed
  priority:  'low' | 'medium' | 'high',
  completed: boolean,
  createdAt: number    // Date.now() timestamp
}
```

Tasks are stored as a JSON array in `localStorage['focusflow_tasks']`.  
The active filter string (`'all'`, `'active'`, `'completed'`) is stored in `localStorage['focusflow_filter']`.

---

## Module Breakdown (app.js)

All logic lives in `app.js`, structured into three clear sections:

### 1. State
```
let tasks  = []       // in-memory array of Task objects
let filter = 'all'    // current filter
```

### 2. Pure Task-Management Functions (exported for testing)
These functions are **side-effect free** — they take state and return new state.

| Function | Signature | Description |
|---|---|---|
| `createTask` | `(title, priority) → Task` | Returns a new Task object |
| `addTask` | `(tasks, task) → Task[]` | Returns new array with task appended |
| `toggleTask` | `(tasks, id) → Task[]` | Flips `completed` on the matching task |
| `deleteTask` | `(tasks, id) → Task[]` | Returns array with task removed |
| `filterTasks` | `(tasks, filter) → Task[]` | Returns filtered view (does not mutate) |
| `clearCompleted` | `(tasks) → Task[]` | Returns array with only incomplete tasks |

### 3. UI / DOM Functions
These functions read/write the DOM and call `save()` + `render()`.

| Function | Description |
|---|---|
| `save()` | Serialises `tasks` and `filter` to localStorage |
| `load()` | Deserialises from localStorage into `tasks` and `filter` |
| `render()` | Full re-render of task list, progress, filter state |
| `handleAdd()` | Validates input, calls `addTask`, saves, renders |
| `handleToggle(id)` | Calls `toggleTask`, saves, renders |
| `handleDelete(id)` | Calls `deleteTask`, saves, renders |
| `handleFilter(f)` | Updates `filter`, saves, renders |
| `handleClear()` | Calls `clearCompleted`, saves, renders |

---

## UI Layout

```
┌─────────────────────────────────────────┐
│  FocusFlow                              │  ← header
├─────────────────────────────────────────┤
│  [Task title input] [Priority ▼] [Add] │  ← add form
├─────────────────────────────────────────┤
│  Progress: ████████░░  4 of 6 completed │  ← progress bar
├─────────────────────────────────────────┤
│  [All] [Active] [Completed]             │  ← filter bar
├─────────────────────────────────────────┤
│  ☐  Buy textbooks            [HIGH] [✕] │  ← task item
│  ☑  Read chapter 3           [MED] [✕]  │
│  ☐  Submit assignment        [LOW] [✕]  │
├─────────────────────────────────────────┤
│                    [Clear Completed]    │  ← footer
└─────────────────────────────────────────┘
```

---

## Visual Design Tokens

| Token | Value |
|---|---|
| Font | System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| Background | `#f5f7fa` |
| Card background | `#ffffff` |
| Primary accent | `#4f46e5` (indigo) |
| Text primary | `#1e1b4b` |
| Text secondary | `#6b7280` |
| Border | `#e5e7eb` |
| Priority High | `#ef4444` |
| Priority Medium | `#f59e0b` |
| Priority Low | `#22c55e` |
| Border radius | `8px` |
| Card shadow | `0 1px 3px rgba(0,0,0,0.08)` |

---

## Accessibility Design

- `<input>` and `<select>` have matching `<label>` elements.
- Checkboxes use native `<input type="checkbox">` for full keyboard support.
- Delete buttons have `aria-label="Delete task: {title}"`.
- Filter buttons use `aria-pressed` to convey selection state.
- Progress bar uses `<progress>` element with `aria-label`.
- No information conveyed by colour alone — priority badges display text labels.

---

## Testing Design

Tests live in `tests/tasks.test.js` and import only the pure functions from `app.js` (no DOM).  
`app.js` uses a conditional export pattern so functions are available in Node/Vitest:

```js
// bottom of app.js
if (typeof module !== 'undefined') {
  module.exports = { createTask, addTask, toggleTask, deleteTask, filterTasks, clearCompleted };
}
```

### Property-Based Test Properties

| Property | Description |
|---|---|
| P-1: Size invariant | Adding N valid tasks to an empty list results in a list of exactly N tasks |
| P-2: Filter purity | `filterTasks` never mutates the original array |
| P-3: Clear completeness | After `clearCompleted`, the resulting array contains zero completed tasks |
| P-4: Toggle idempotency | Toggling the same task twice returns it to its original state |
| P-5: Delete correctness | After `deleteTask(tasks, id)`, no task with that id remains |
