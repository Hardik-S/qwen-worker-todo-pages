const STORAGE_KEY = "qwen-worker-todos";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#todo-count");
const clearCompletedButton = document.querySelector("#clear-completed");

let todos = loadTodos();

function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createTodo(text) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    text,
    complete: false,
  };
}

function addTodo(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return;
  }

  todos = [createTodo(trimmedText), ...todos];
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((todo) => (
    todo.id === id ? { ...todo, complete: !todo.complete } : todo
  ));
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.complete);
  saveTodos();
  render();
}

function render() {
  list.textContent = "";

  for (const todo of todos) {
    const item = document.createElement("li");
    item.className = "todo-item";
    item.classList.toggle("is-complete", todo.complete);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.complete;
    checkbox.setAttribute("aria-label", `Mark ${todo.text} as ${todo.complete ? "incomplete" : "complete"}`);
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    item.append(checkbox, text, deleteButton);
    list.append(item);
  }

  const remaining = todos.filter((todo) => !todo.complete).length;
  const completed = todos.length - remaining;
  count.textContent = todos.length === 0
    ? "No todos yet."
    : `${remaining} active, ${completed} completed.`;
  clearCompletedButton.disabled = completed === 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(input.value);
  form.reset();
  input.focus();
});

clearCompletedButton.addEventListener("click", clearCompleted);

render();
