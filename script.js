const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const countList = document.getElementById('count-list');
const todoList = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');
const showAll = document.getElementById('show-all');
const showCompleted = document.getElementById('show-completed');
const showActive = document.getElementById('show-active');

const STORAGE_KEY = 'todoListItems';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; //localStorageに保存済みのTodoがあれば読み込む
//なければ空配列で開始する

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); //文字列にして保存
}

function renderTodos() {
   todoList.innerHTML = '';
   countList.innerHTML = '';

  if (todos.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }
  
    emptyMessage.style.display = 'none';

    let activeCount = todos.filter(todo => !todo.done).length;
    let completeCount = todos.filter(todo => todo.done).length;

    const activeElement = document.createElement('p');
    activeElement.className = 'count-element'
    activeElement.textContent = `残り: ${activeCount} 件`;

    const completeCountElement = document.createElement('p');
    completeCountElement.className = 'count-element'
    completeCountElement.textContent = `完了: ${completeCount} 件`;
    countList.append(activeElement, completeCountElement);

  todos.forEach((todo, index) => {
    if(currentFilter === 'completed' && !todo.done) {
      return;
    }
    if(currentFilter === 'active' && todo.done) {
      return;
    }
    const listItem = document.createElement('li');
    listItem.className = 'todo-item';

    const label = document.createElement('p');
    label.className = 'todo-label';
    label.textContent = `${index + 1}: ${todo.text}`;
    if (todo.done) {
      label.classList.add('completed');
    }

    listItem.appendChild(label);
    //編集ボタン
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = '編集';
    editButton.addEventListener('click', () => editTodo(index));
    listItem.appendChild(editButton);

    //完了ボタン
    if(!todo.done) {
      const completeButton = document.createElement('button');
      completeButton.type = 'button';
      completeButton.textContent = '完了';
      completeButton.className = 'complete-button'
      completeButton.addEventListener('click', () => toggleTodo(index));
      listItem.appendChild(completeButton);
    };
    //削除ボタン
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '削除';
    removeButton.className = 'delete-button'
    removeButton.addEventListener('click', () => removeTodo(index));
    listItem.appendChild(removeButton);
    todoList.appendChild(listItem);
  });
}
    //全削除ボタン
const clearAllButton = document.querySelector('.clear-completed');
clearAllButton.addEventListener('click', () => {
  if (confirm('本当にすべてのタスクを削除しますか？')) {
    todos = [];
    saveTodos();
    renderTodos();
   }
  });

//最初にすべてのフィルターが表示される
let currentFilter = 'all';
showAll.addEventListener('click', () => {
  currentFilter = 'all';
  setActiveButton(showAll);
  renderTodos();
});
//完了フィルターボタン
showCompleted.addEventListener('click', () => {
  currentFilter = 'completed';
  setActiveButton(showCompleted);
  renderTodos();
});
//未完了フィルターボタン
showActive.addEventListener('click', () => {
  currentFilter = 'active';
  setActiveButton(showActive);
  renderTodos();
});

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  
  if (text === '')return;
  addTodo(text);
  todoInput.value = '';
  todoInput.focus();
});

//オブジェクトを作って追加する関数
function addTodo(text) {
  todos.push({ text, done: false });
  saveTodos();
  renderTodos();
}
//指定したtodoの配列から一件削除する
function removeTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}
//指定した配列をtrueからfalseにする
function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  saveTodos();
  renderTodos();
}
//指定したタスクを編集
function editTodo(index) {
  const newText = prompt('タスクを編集してください', todos[index].text);
  if(newText === null) return;
  todos[index].text = newText;
  saveTodos();
  renderTodos();
}
//選択したボタンをアクティブにする
function setActiveButton(button) {
  showAll.classList.remove('active');
  showCompleted.classList.remove('active');
  showActive.classList.remove('active');
  button.classList.add('active');
}

setActiveButton(showAll);
renderTodos();
