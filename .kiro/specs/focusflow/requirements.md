# FocusFlow — Requirements

## Overview
FocusFlow is a lightweight, offline student productivity dashboard. It runs entirely in the browser using HTML, CSS, and vanilla JavaScript with localStorage for persistence. No server, no login, no external dependencies beyond the testing stack.

---

## Functional Requirements

### FR-1: Add a Task
- **FR-1.1** The user can enter a task title in a text input field.
- **FR-1.2** The user can select a priority: Low, Medium, or High (default: Medium).
- **FR-1.3** Clicking "Add Task" (or pressing Enter) creates a new task and appends it to the list.
- **FR-1.4** The title field must not be empty; if empty, the form shows a validation message and does not create a task.
- **FR-1.5** After a task is added, the title input is cleared and focus returns to it.

### FR-2: Display Tasks
- **FR-2.1** Each task displays its title, priority badge, and completion state.
- **FR-2.2** Completed tasks are visually distinguished (strikethrough text, reduced opacity).
- **FR-2.3** Priority badges use distinct colours: Low = green, Medium = amber, High = red.

### FR-3: Complete / Incomplete a Task
- **FR-3.1** Each task has a checkbox. Clicking it toggles the task between active and completed.
- **FR-3.2** The toggle is reflected immediately in the UI and persisted to localStorage.

### FR-4: Delete a Task
- **FR-4.1** Each task has a delete button.
- **FR-4.2** Clicking it removes the task immediately from the UI and from localStorage.

### FR-5: Filter Tasks
- **FR-5.1** Three filter buttons are available: All, Active, Completed.
- **FR-5.2** Selecting a filter shows only the matching tasks; the others are hidden.
- **FR-5.3** The active filter button is visually highlighted.
- **FR-5.4** Filter state is preserved across page reloads.

### FR-6: Progress Display
- **FR-6.1** A progress bar and label show "X of Y tasks completed".
- **FR-6.2** The display updates in real time whenever tasks change.

### FR-7: Clear Completed Tasks
- **FR-7.1** A "Clear Completed" button removes all completed tasks at once.
- **FR-7.2** The button is disabled (or hidden) when there are no completed tasks.

### FR-8: Persistence
- **FR-8.1** All tasks are saved to localStorage under the key `focusflow_tasks`.
- **FR-8.2** The active filter is saved under `focusflow_filter`.
- **FR-8.3** On page load, tasks and filter are restored from localStorage.
- **FR-8.4** localStorage operations must not throw; errors are caught silently.

---

## Non-Functional Requirements

### NFR-1: Accessibility
- **NFR-1.1** All interactive elements have accessible labels (aria-label or visible text).
- **NFR-1.2** Keyboard navigation works for all actions (add, toggle, delete, filter, clear).
- **NFR-1.3** Colour is never the only way to convey information (priority labels include text).
- **NFR-1.4** Focus is managed predictably after actions.

### NFR-2: Responsive Design
- **NFR-2.1** The layout is usable on screens from 320 px wide up to 1440 px wide.
- **NFR-2.2** No horizontal scroll on any supported viewport.

### NFR-3: Performance
- **NFR-3.1** The page loads and is interactive in under 1 second on a modern laptop with no network.
- **NFR-3.2** No external network requests are made at runtime.

### NFR-4: Technology Constraints
- **NFR-4.1** The application is a single HTML file (index.html) with companion style.css and app.js.
- **NFR-4.2** No frameworks, no build step, no CDN at runtime.
- **NFR-4.3** Testing uses Vitest + fast-check on pure functions only (no DOM required for tests).

---

## Acceptance Criteria Summary

| ID | Criterion |
|----|-----------|
| AC-1 | Adding a task with a non-empty title and any priority appends it to the list and clears the input. |
| AC-2 | Adding a task with an empty title shows a validation message and does not create a task. |
| AC-3 | Toggling the checkbox of a task flips its completed state in the UI and in localStorage. |
| AC-4 | Deleting a task removes it from the UI and from localStorage. |
| AC-5 | The Active filter shows only incomplete tasks; Completed shows only done tasks; All shows all. |
| AC-6 | Progress label reads "X of Y tasks completed" and updates immediately on every change. |
| AC-7 | Clear Completed removes all completed tasks; the button is absent when none exist. |
| AC-8 | Refreshing the page restores all tasks and the active filter exactly as they were. |
| AC-9 | The UI is usable and unbroken at 320 px, 768 px, and 1280 px viewport widths. |
| AC-10 | All property-based tests pass with `npx vitest run`. |
