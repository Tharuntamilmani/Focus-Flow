# FocusFlow — Implementation Tasks

## Status Legend
- [ ] Not started
- [x] Complete

---

## Phase 1: Project Scaffold

### T-01: Create directory structure
- [ ] Create `tests/` directory
- [ ] Create `screenshots/` directory
- Acceptance: Directories exist in workspace root

### T-02: Initialise package.json and install test dependencies
- [ ] Run `npm init -y`
- [ ] Install `vitest` and `fast-check` as dev dependencies
- [ ] Add `"test": "vitest run"` script to package.json
- Acceptance: `npm test` resolves without "command not found"

---

## Phase 2: Spec & Steering (Kiro Artefacts)

### T-03: Write requirements.md
- [x] FR-1 through FR-8 (functional)
- [x] NFR-1 through NFR-4 (non-functional)
- [x] Acceptance criteria table
- File: `.kiro/specs/focusflow/requirements.md`

### T-04: Write design.md
- [x] Architecture diagram
- [x] Data model
- [x] Module breakdown
- [x] UI layout sketch
- [x] Design tokens
- [x] Testing design
- File: `.kiro/specs/focusflow/design.md`

### T-05: Write tasks.md
- [x] This file
- File: `.kiro/specs/focusflow/tasks.md`

### T-06: Write steering files
- [x] `.kiro/steering/product.md`
- [x] `.kiro/steering/technical.md`

---

## Phase 3: Application Implementation

### T-07: Create index.html
- [ ] Semantic HTML5 structure
- [ ] Add form: title input, priority select, add button
- [ ] Task list container
- [ ] Progress bar + label
- [ ] Filter buttons (All, Active, Completed)
- [ ] Clear Completed button
- [ ] Link style.css and app.js
- Acceptance: AC-1, AC-2 (form renders correctly)

### T-08: Create style.css
- [ ] Design tokens as CSS custom properties
- [ ] Responsive layout (320 px – 1440 px)
- [ ] Task item styles (normal + completed state)
- [ ] Priority badge colours
- [ ] Filter button active state
- [ ] Progress bar styles
- Acceptance: AC-9 (visual correctness at three breakpoints)

### T-09: Create app.js
- [ ] Pure functions: createTask, addTask, toggleTask, deleteTask, filterTasks, clearCompleted
- [ ] State: tasks array, filter string
- [ ] save() / load() with localStorage
- [ ] render() rebuilds task list DOM
- [ ] Event handlers wired on DOMContentLoaded
- [ ] Conditional module.exports for Vitest
- Acceptance: AC-1 through AC-8

---

## Phase 4: Testing

### T-10: Create tests/tasks.test.js
- [ ] P-1: Adding N valid tasks → list length = N
- [ ] P-2: filterTasks never mutates original
- [ ] P-3: clearCompleted leaves zero completed tasks
- [ ] P-4: Toggle idempotency
- [ ] P-5: deleteTask removes target id
- Acceptance: AC-10 (`npx vitest run` passes)

---

## Phase 5: Kiro Artefacts

### T-11: Create PostFileSave hook
- [ ] `.kiro/hooks/run-tests.json`
- [ ] Triggers on `.js` file saves
- [ ] Runs `npm test`

### T-12: Create FocusFlow Developer Power
- [ ] `.kiro/powers/focusflow-developer/plugin.json`
- [ ] `.kiro/powers/focusflow-developer/skills/maintain-tasks.md`

### T-13: Add MCP configuration
- [ ] `.kiro/settings/mcp.json` with filesystem server entry
- [ ] `docs/mcp-setup.md` with usage instructions

### T-14: Create QA Reviewer agent
- [ ] `.kiro/agents/qa-reviewer.md`

---

## Phase 6: Documentation

### T-15: Create README.md
- [ ] Project description + screenshot instructions
- [ ] How to run
- [ ] How to run tests
- [ ] Architecture overview
- [ ] Kiro University lesson mapping table
