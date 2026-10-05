---
inclusion: always
---

# FocusFlow — Product Steering

## Project Purpose
FocusFlow is a lightweight, offline student productivity dashboard. It helps students organise their study tasks with priorities and track progress toward completing them — all without requiring an account, internet connection, or any installation beyond opening a browser.

## Target User
University and high-school students who want a simple, distraction-free tool to manage study tasks. They value speed, simplicity, and privacy. They do not want to sign up for yet another service or rely on a connection to use a basic to-do list.

## Core UX Principles

1. **Zero friction to start** — The page loads instantly and the cursor lands in the task input. No onboarding, no modals, no tutorial overlays.

2. **Clarity over features** — Every element on screen has a purpose. No widgets, banners, or settings panels that don't serve the core workflow.

3. **Visible progress** — Students are motivated by seeing progress. The progress bar and "X of Y completed" label must always be in view and update immediately.

4. **Keyboard first** — Power users should be able to add and manage tasks without touching the mouse. All actions must be reachable via keyboard.

5. **Respectful defaults** — Medium priority is the default. The filter defaults to "All". No state is reset between sessions.

6. **No surprises** — Deleting a task is immediate and permanent by design (no confirmation dialog — the list is short and tasks can be re-added). Clear Completed is visually distinct to avoid accidents.

## Out of Scope
- User accounts or authentication
- Cloud sync or sharing
- Due dates, reminders, or notifications
- Sub-tasks or tags
- Drag-and-drop reordering
- Dark mode toggle (a future enhancement if requested)
