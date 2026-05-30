function loadTasks() {
  try {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
let tasks = loadTasks();
let currentFilter = "all";

function showSpinner() {
  document.getElementById("spinner").style.display = "flex";
}
function hideSpinner() {
  document.getElementById("spinner").style.display = "none";
}
function renderTasks() {
  const todoList = document.querySelector(".todo-list");
  todoList.innerHTML = "";
  
  const filtered = tasks.filter((t) => {
    if (currentFilter === "pending") return !t.done;
    if (currentFilter === "done")    return t.done;
    return true;
  });

  if (filtered.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-message";
    li.textContent = "Nenhuma tarefa encontrada.";
    todoList.appendChild(li);
    return;
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (task.done ? " completed" : "");

    const badge = document.createElement("span");
    badge.className = "badge " + (task.done ? "badge-done" : "badge-pending");
    badge.textContent = task.done ? "Concluída" : "Pendente";

    const label = document.createElement("label");
    label.className = "task-content";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.textContent = task.text;

    label.appendChild(checkbox);
    label.appendChild(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.title = "Excluir tarefa";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.addEventListener("click", () => removeTask(task.id));

    li.appendChild(badge);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();

  if (!text) {
    input.classList.add("input-error");
    input.placeholder = "⚠️ Digite uma tarefa!";
    input.focus();
    return;
  }

  input.classList.remove("input-error");
  input.placeholder = "Nova tarefa...";

  setTimeout(() => {
    tasks.push({ id: Date.now(), text, done: false });
    saveTasks(tasks); 
    input.value = "";
    renderTasks();
    hideSpinner();
  }, 500);
}
function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTasks(tasks);
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  renderTasks();
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();

  document.getElementById("add-btn").addEventListener("click", addTask);

  document.getElementById("task-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });

  document.getElementById("task-input").addEventListener("input", (e) => {
    e.target.classList.remove("input-error");
    e.target.placeholder = "Nova tarefa...";
  });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
  });
});
