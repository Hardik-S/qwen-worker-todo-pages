(() => {
  'use strict';

  const STORAGE_KEY = 'qwenWorkerTodos.v1';

  const form = document.querySelector('#todo-form');
  const input = document.querySelector('#todo-input');
  const list = document.querySelector('#todo-list');
  const emptyState = document.querySelector('#empty-state');
  const remainingCount = document.querySelector('#todo-count');
  const clearCompletedButton = document.querySelector('#clear-completed');

  let todos = loadTodos();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }

    todos = [
      ...todos,
      {
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text,
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];

    input.value = '';
    saveAndRender();
    input.focus();
  });

  list.addEventListener('change', (event) => {
    const checkbox = event.target.closest('[data-action="toggle"]');
    if (!checkbox) {
      return;
    }

    const id = checkbox.dataset.id;
    todos = todos.map((todo) => (
      todo.id === id ? { ...todo, completed: checkbox.checked } : todo
    ));
    saveAndRender();
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="delete"]');
    if (!button) {
      return;
    }

    todos = todos.filter((todo) => todo.id !== button.dataset.id);
    saveAndRender();
  });

  clearCompletedButton.addEventListener('click', () => {
    todos = todos.filter((todo) => !todo.completed);
    saveAndRender();
  });

  render();

  function saveAndRender() {
    saveTodos(todos);
    render();
  }

  function render() {
    list.replaceChildren(...todos.map(createTodoElement));

    const remaining = todos.filter((todo) => !todo.completed).length;
    const completed = todos.length - remaining;

    remainingCount.textContent = `${remaining} ${pluralize('item', remaining)} remaining`;
    clearCompletedButton.disabled = completed === 0;
    clearCompletedButton.setAttribute(
      'aria-label',
      completed === 0
        ? 'No completed todos to clear'
        : `Clear ${completed} completed ${pluralize('todo', completed)}`
    );

    const hasTodos = todos.length > 0;
    emptyState.hidden = hasTodos;
    list.hidden = !hasTodos;
  }

  function createTodoElement(todo) {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' is-completed' : ''}`;

    const checkboxId = `todo-${todo.id}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = todo.completed;
    checkbox.dataset.action = 'toggle';
    checkbox.dataset.id = todo.id;

    const label = document.createElement('label');
    label.className = 'todo-text';
    label.htmlFor = checkboxId;
    label.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.dataset.action = 'delete';
    deleteButton.dataset.id = todo.id;
    deleteButton.setAttribute('aria-label', `Delete todo: ${todo.text}`);
    deleteButton.textContent = 'Delete';

    item.append(checkbox, label, deleteButton);
    return item;
  }

  function loadTodos() {
    try {
      const rawTodos = localStorage.getItem(STORAGE_KEY);
      if (!rawTodos) {
        return [];
      }

      const parsedTodos = JSON.parse(rawTodos);
      if (!Array.isArray(parsedTodos)) {
        return [];
      }

      return parsedTodos
        .filter((todo) => todo && typeof todo.text === 'string')
        .map((todo, index) => ({
          id: typeof todo.id === 'string' ? todo.id : `legacy-${index}-${Date.now()}`,
          text: todo.text,
          completed: Boolean(todo.completed),
          createdAt: typeof todo.createdAt === 'string' ? todo.createdAt : null
        }));
    } catch (error) {
      console.warn('Unable to load saved todos.', error);
      return [];
    }
  }

  function saveTodos(nextTodos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos));
  }

  function pluralize(word, count) {
    return count === 1 ? word : `${word}s`;
  }
})();
