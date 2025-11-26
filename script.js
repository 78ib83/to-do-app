let todos = [
    { id: 1, text: "Complete online Javascript course", completed: true },
    { id: 2, text: "Jog around the park 3x", completed: false },
    { id: 3, text: "10 minutes meditation", completed: false },
    { id: 4, text: "Read for 1 hour", completed: false },
    { id: 5, text: "Pick up groceries", completed: false },
    { id: 6, text: "Complete Todo App on Frontend Mentor", completed: false }
]
let currentFilter = 'all'
let nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1

const todoListElement = document.getElementById('todo-list')
const newTodoInput = document.getElementById('new-todo-input')
const itemsLeftSpan = document.getElementById('items-left')
const clearCompletedBtn = document.getElementById('clear-completed-btn')

const filterButtons = document.querySelectorAll('.filters-desktop .filter-btn, #mobile-filters .filter-btn')

function createTodoElement(todo) {
    const li = document.createElement('li')
    li.classList.add('todo-item')
    if (todo.completed) {
        li.classList.add('completed')
    }
    li.dataset.id = todo.id
    
    li.setAttribute('draggable', 'true')
    li.addEventListener('dragstart', handleDragStart)
    li.addEventListener('dragover', handleDragOver)
    li.addEventListener('drop', handleDrop)
    li.addEventListener('dragend', handleDragEnd)

    li.innerHTML = `
        <span class="checkbox-circle" onclick="toggleCompleted(${todo.id})">${todo.completed ? '✓' : ''}</span>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">x</button>
    `
    return li
}

function renderTodos() {
    todoListElement.innerHTML = ''
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed
        if (currentFilter === 'completed') return todo.completed
        return true
    })

    filteredTodos.forEach(todo => {
        todoListElement.appendChild(createTodoElement(todo))
    })

    updateItemsLeft()
}

function updateItemsLeft() {
    const itemsLeft = todos.filter(todo => !todo.completed).length
    itemsLeftSpan.textContent = `${itemsLeft} items left`
}

newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const text = newTodoInput.value.trim()
        if (text) {
            todos.push({
                id: nextId++,
                text: text,
                completed: false
            })
            newTodoInput.value = ''
            renderTodos()
        }
    }
})

window.toggleCompleted = function(id) {
    const todoIndex = todos.findIndex(t => t.id === id)
    if (todoIndex > -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed
        renderTodos()
    }
}

window.deleteTodo = function(id) {
    todos = todos.filter(t => t.id !== id)
    renderTodos()
}

filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'))
        
        document.querySelectorAll(`[data-filter="${filter}"]`).forEach(btn => {
            btn.classList.add('active')
        })

        currentFilter = filter
        renderTodos()
    })
})

clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed)
    renderTodos()
})

let draggedTodoId = null

function handleDragStart(e) {
    draggedTodoId = parseInt(e.target.dataset.id)
    e.dataTransfer.effectAllowed = 'move'
    setTimeout(() => {
        e.target.classList.add('dragging')
    }, 0)
}

function handleDragOver(e) {
    e.preventDefault() 
    e.dataTransfer.dropEffect = 'move'
    
    const currentItem = e.target.closest('.todo-item')
    if (!currentItem || currentItem.dataset.id == draggedTodoId) return

    const rect = currentItem.getBoundingClientRect()
    const isAfter = e.clientY > rect.top + rect.height / 2
    
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('drag-over-top', 'drag-over-bottom')
    })

    if (isAfter) {
        currentItem.classList.add('drag-over-bottom')
    } else {
        currentItem.classList.add('drag-over-top')
    }
}

function handleDrop(e) {
    e.preventDefault()
    const targetId = parseInt(e.target.closest('.todo-item').dataset.id)
    
    if (draggedTodoId === targetId) return

    const draggedIndex = todos.findIndex(t => t.id === draggedTodoId)
    const targetIndex = todos.findIndex(t => t.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
        const [movedTodo] = todos.splice(draggedIndex, 1)
        
        const currentItem = e.target.closest('.todo-item')
        const rect = currentItem.getBoundingClientRect()
        const isAfter = e.clientY > rect.top + rect.height / 2

        if (isAfter) {
            todos.splice(targetIndex + 1, 0, movedTodo)
        } else {
            todos.splice(targetIndex, 0, movedTodo)
        }

        renderTodos()
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging')
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('drag-over-top', 'drag-over-bottom')
    })
    draggedTodoId = null
}

renderTodos();


// Thème Sombre / Clair
const themeLink = document.getElementById("theme-link");
const toggleButton = document.getElementById("theme-toggle");
const SUN_ICON_URL = './assets/sun.svg'; // ☀️
const MOON_ICON_URL = "./assets/moon.svg"; // 🌙
const themeIcon = document.getElementById("theme-icon");


function toggleCssFile() {
  const currentTheme = themeLink.getAttribute("href");
  let newTheme = "";

  // Déterminer le nouveau fichier CSS
  if (currentTheme === "light.css") {
    newTheme = "dark.css";
      //   toggleButton.textContent = "☀️";
      //   toggleButton.innerHTML = "☀️";
      themeIcon.src = SUN_ICON_URL;
  } else {
    newTheme = "light.css";
      //   toggleButton.innerHTML = "🌙";
      themeIcon.src = MOON_ICON_URL;
  }

  // Changer le fichier CSS
  themeLink.setAttribute("href", newTheme);

  // OPTIONNEL: Enregistrer la préférence dans le stockage local
  localStorage.setItem("theme", newTheme);
}

// Ajouter l'écouteur d'événement
toggleButton.addEventListener("click", toggleCssFile);

// OPTIONNEL: Appliquer le thème sauvegardé au chargement
function loadSavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    themeLink.setAttribute("href", savedTheme);
    // Mettre à jour le texte du bouton en fonction du thème chargé
    // toggleButton.textContent =
      //     savedTheme === "light.css" ? "🌙" : "☀️";
      
      if (savedTheme === "light.css") {
          // toggleButton.innerHTML = "🌙";
          themeIcon.src = MOON_ICON_URL;
      } else {
          // toggleButton.innerHTML = "☀️";
          themeIcon.src = SUN_ICON_URL;
      }
  }
}

loadSavedTheme();