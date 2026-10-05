/* ============================================================
   FocusFlow — Application Logic
   Vanilla JS, no framework, no build step
   ============================================================ */

/* ============================================================
   SECTION 1 — PURE TASK-MANAGEMENT FUNCTIONS
   These functions are side-effect free: no DOM, no localStorage.
   They are exported at the bottom for Vitest property-based tests.
   ============================================================ */

/**
 * Create a new Task object.
 * @param {string} title     — non-empty, already trimmed
 * @param {'low'|'medium'|'high'} priority
 * @returns {Object} Task
 */
function createTask(title, priority) {
  const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Date.now().toString() + Math.random().toString(36).slice(2);
  return {
    id,
    title,
    priority,
    completed: false,
    createdAt: Date.now(),
  };
}

/**
 * Return a new array with the task appended.
 * @param {Object[]} tasks
 * @param {Object}   task
 * @returns {Object[]}
 */
function addTask(tasks, task) {
  return [...tasks, task];
}

/**
 * Return a new array with the target task's completed flag flipped.
 * @param {Object[]} tasks
 * @param {string}   id
 * @returns {Object[]}
 */
function toggleTask(tasks, id) {
  return tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
}

/**
 * Return a new array with the target task removed.
 * @param {Object[]} tasks
 * @param {string}   id
 * @returns {Object[]}
 */
function deleteTask(tasks, id) {
  return tasks.filter(t => t.id !== id);
}

/**
 * Return only the tasks matching the filter.
 * Does NOT mutate the input array.
 * @param {Object[]} tasks
 * @param {'all'|'active'|'completed'} filter
 * @returns {Object[]}
 */
function filterTasks(tasks, filter) {
  if (filter === 'active')    return tasks.filter(t => !t.completed);
  if (filter === 'completed') return tasks.filter(t => t.completed);
  return tasks.slice(); // 'all' — return a copy
}

/**
 * Return a new array containing only incomplete tasks.
 * @param {Object[]} tasks
 * @returns {Object[]}
 */
function clearCompleted(tasks) {
  return tasks.filter(t => !t.completed);
}

/* ============================================================
   SECTION 2 — UI STATE
   ============================================================ */

const STORAGE_KEY_TASKS  = 'focusflow_tasks';
const STORAGE_KEY_FILTER = 'focusflow_filter';
const VALID_PRIORITIES   = ['low', 'medium', 'high'];
const VALID_FILTERS      = ['all', 'active', 'completed'];

let tasks  = [];
let filter = 'all';

/* ============================================================
   SECTION 3 — PERSISTENCE
   ============================================================ */

function save() {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEY_FILTER, filter);
  } catch (_) {
    // localStorage unavailable — silently continue
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) tasks = parsed;
    }
    const savedFilter = localStorage.getItem(STORAGE_KEY_FILTER);
    if (savedFilter && VALID_FILTERS.includes(savedFilter)) {
      filter = savedFilter;
    }
  } catch (_) {
    // Corrupted data — start fresh
    tasks  = [];
    filter = 'all';
  }
}

/* ============================================================
   SECTION 4 — RENDER
   ============================================================ */

function render() {
  renderProgress();
  renderFilterBar();
  renderTaskList();
  renderClearButton();
}

function renderProgress() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pct       = total === 0 ? 0 : Math.round((completed / total) * 100);

  const label = document.getElementById('progress-label');
  const bar   = document.getElementById('progress-bar');
  const pctEl = document.getElementById('progress-pct');

  if (label) label.textContent = `${completed} of ${total} task${total !== 1 ? 's' : ''} completed`;
  if (pctEl)  pctEl.textContent = `${pct}%`;
  if (bar) {
    bar.value = pct;
    bar.max   = 100;
  }
}

function renderFilterBar() {
  const buttons = document.querySelectorAll('.btn--filter');
  buttons.forEach(btn => {
    const pressed = btn.dataset.filter === filter;
    btn.setAttribute('aria-pressed', String(pressed));
  });
}

function renderTaskList() {
  const list      = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const emptyMsg  = document.getElementById('empty-message');
  if (!list) return;

  const visible = filterTasks(tasks, filter);

  list.innerHTML = '';

  if (visible.length === 0) {
    list.hidden       = true;
    if (emptyState) {
      emptyState.hidden = false;
      if (emptyMsg) {
        if (tasks.length === 0) {
          emptyMsg.textContent = 'No tasks yet. Add one above!';
        } else if (filter === 'active') {
          emptyMsg.textContent = 'No active tasks — all done!';
        } else if (filter === 'completed') {
          emptyMsg.textContent = 'No completed tasks yet.';
        }
      }
    }
    return;
  }

  list.hidden       = false;
  if (emptyState) emptyState.hidden = true;

  visible.forEach(task => {
    const li = buildTaskElement(task);
    list.appendChild(li);
  });
}

function buildTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item${task.completed ? ' task-item--completed' : ''}`;
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-item__checkbox';
  checkbox.checked = task.completed;
  checkbox.id = `task-check-${task.id}`;
  checkbox.setAttribute('aria-label', `Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`);
  checkbox.addEventListener('change', () => handleToggle(task.id));

  // Body
  const body = document.createElement('div');
  body.className = 'task-item__body';

  // Title
  const titleEl = document.createElement('span');
  titleEl.className = 'task-item__title';
  titleEl.textContent = task.title;

  // Badge
  const badge = document.createElement('span');
  const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  badge.className = `badge badge--${task.priority}`;
  badge.textContent = priorityLabel;
  badge.setAttribute('aria-label', `Priority: ${priorityLabel}`);

  body.appendChild(titleEl);
  body.appendChild(badge);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'btn btn--delete';
  delBtn.setAttribute('aria-label', `Delete task: ${task.title}`);
  delBtn.innerHTML = `
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>`;
  delBtn.addEventListener('click', () => handleDelete(task.id));

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(delBtn);

  return li;
}

function renderClearButton() {
  const btn = document.getElementById('clear-btn');
  if (!btn) return;
  const hasCompleted = tasks.some(t => t.completed);
  btn.hidden = !hasCompleted;
}

/* ============================================================
   SECTION 5 — EVENT HANDLERS
   ============================================================ */

function handleAdd(event) {
  event.preventDefault();

  const titleInput    = document.getElementById('task-title');
  const priorityInput = document.getElementById('task-priority');
  const errorEl       = document.getElementById('title-error');

  const title    = titleInput ? titleInput.value.trim() : '';
  const priority = priorityInput ? priorityInput.value : 'medium';

  // Validate
  if (!title) {
    if (errorEl) errorEl.textContent = 'Please enter a task title.';
    if (titleInput) {
      titleInput.setAttribute('aria-invalid', 'true');
      titleInput.focus();
    }
    return;
  }

  if (!VALID_PRIORITIES.includes(priority)) {
    return; // defensive; shouldn't happen with a <select>
  }

  // Clear validation state
  if (errorEl) errorEl.textContent = '';
  if (titleInput) titleInput.removeAttribute('aria-invalid');

  const task = createTask(title, priority);
  tasks = addTask(tasks, task);
  save();
  render();

  // Reset input and restore focus
  if (titleInput) {
    titleInput.value = '';
    titleInput.focus();
  }
}

function handleToggle(id) {
  tasks = toggleTask(tasks, id);
  save();
  render();
}

function handleDelete(id) {
  tasks = deleteTask(tasks, id);
  save();
  render();
}

function handleFilter(newFilter) {
  filter = newFilter;
  save();
  render();
}

function handleClear() {
  tasks = clearCompleted(tasks);
  save();
  render();
}

/* ============================================================
   SECTION 6 — BOOT
   ============================================================ */

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    load();
    render();

    // Form submit
    const form = document.getElementById('add-form');
    if (form) form.addEventListener('submit', handleAdd);

    // Filter buttons
    const filterBtns = document.querySelectorAll('.btn--filter');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => handleFilter(btn.dataset.filter));
    });

    // Clear completed
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', handleClear);

    // Auto-focus the title input
    const titleInput = document.getElementById('task-title');
    if (titleInput) titleInput.focus();
  });
}

/* ============================================================
   SECTION 7 — CONDITIONAL EXPORTS (for Vitest / Node)
   ============================================================ */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createTask,
    addTask,
    toggleTask,
    deleteTask,
    filterTasks,
    clearCompleted,
  };
}
