const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');

const STORAGE_KEY = 'todoListItems';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; //localStorageに保存済みのTodoがあれば読み込む
//なければ空配列で開始する

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); //文字列にして保存
}

function renderTodos() {
   todoList.innerHTML = '';

  if (todos.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }

  emptyMessage.style.display = 'none';

  todos.forEach((todo, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => toggleTodo(index));

    const label = document.createElement('p');
    label.className = 'todo-label';
    label.textContent = todo.text;
    if (todo.done) {
      label.classList.add('completed');
    }

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '削除';
    removeButton.addEventListener('click', () => removeTodo(index));


    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(removeButton);
    todoList.appendChild(listItem);
  });
}

const clearButton = document.querySelector('.clear-completed');
    clearButton.addEventListener('click', () => {
      if (confirm('本当にすべてのタスクを削除しますか？')) {
        todos = [];
        saveTodos();
        renderTodos();
      }
    });

function addTodo(text) {
  todos.push({ text, done: false });
  saveTodos();
  renderTodos();
}

function removeTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  saveTodos();
  renderTodos();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();

  if (text === '') {
    return;
  }

  addTodo(text);
  todoInput.value = '';
  todoInput.focus();
});

renderTodos();
