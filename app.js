// Initialize an empty array to store todos
let todos = [];

// Function to add a new todo item
function addTodo(title) {
  const todo = { id: Date.now(), title, completed: false };
  todos.push(todo);
  saveTodos();
}

// Function to toggle the completion status of a todo item
function toggleTodo(id) {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
  }
}

// Function to delete a todo item
function deleteTodo(id) {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    saveTodos();
  }
}

// Function to clear all completed items
function clearCompleted() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
}

// Function to save todos to localStorage
function saveTodos() {
  localStorage.setItem('qwenWorkerTodos.v1', JSON.stringify(todos));
}

// Function to load todos from localStorage
function loadTodos() {
  const storedTodos = localStorage.getItem('qwenWorkerTodos.v1');
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  }
}

// Load todos on page load
loadTodos();

// Example usage of the app
addTodo('Learn Git');
toggleTodo(1);
deleteTodo(2);
clearCompleted();
