import { getTasks, createTask, updateTaskStatus, deleteTask, Task } from './api';

// DOM Elements
const taskForm = document.getElementById('task-form') as HTMLFormElement;
const taskInput = document.getElementById('task-input') as HTMLInputElement;
const taskList = document.getElementById('task-list') as HTMLUListElement;
const loadingMessage = document.getElementById('loading-message') as HTMLDivElement;
const errorMessage = document.getElementById('error-message') as HTMLDivElement;

// Display error message
function showError(message: string): void {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  setTimeout(() => {
    errorMessage.classList.add('hidden');
  }, 5000);
}

// Create a task element
function createTaskElement(task: Task): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'flex items-center justify-between p-3 border rounded-md';
  li.dataset.id = task.id.toString();
  
  // Task checkbox and title
  const leftDiv = document.createElement('div');
  leftDiv.className = 'flex items-center gap-3';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.className = 'w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500';
  checkbox.addEventListener('change', async () => {
    try {
      await updateTaskStatus(task.id, checkbox.checked);
      if (checkbox.checked) {
        taskTitle.classList.add('line-through', 'text-gray-400');
      } else {
        taskTitle.classList.remove('line-through', 'text-gray-400');
      }
    } catch (error) {
      showError('Failed to update task status.');
      checkbox.checked = !checkbox.checked; // Revert the checkbox state
    }
  });
  
  const taskTitle = document.createElement('span');
  taskTitle.textContent = task.title;
  if (task.completed) {
    taskTitle.classList.add('line-through', 'text-gray-400');
  }
  
  leftDiv.appendChild(checkbox);
  leftDiv.appendChild(taskTitle);
  
  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '&times;';
  deleteBtn.className = 'text-red-500 hover:text-red-700 font-bold text-xl';
  deleteBtn.addEventListener('click', async () => {
    try {
      await deleteTask(task.id);
      li.remove();
    } catch (error) {
      showError('Failed to delete task.');
    }
  });
  
  // Add everything to the list item
  li.appendChild(leftDiv);
  li.appendChild(deleteBtn);
  
  return li;
}

// Load tasks
async function loadTasks(): Promise<void> {
  try {
    loadingMessage.classList.remove('hidden');
    taskList.innerHTML = '';
    
    const tasks = await getTasks();
    
    if (tasks.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.textContent = 'No tasks yet. Add one above!';
      emptyMessage.className = 'text-center py-4 text-gray-500';
      taskList.appendChild(emptyMessage);
    } else {
      tasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
      });
    }
  } catch (error) {
    showError('Failed to load tasks. Check if the backend server is running.');
  } finally {
    loadingMessage.classList.add('hidden');
  }
}

// Add task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = taskInput.value.trim();
  if (!title) return;
  
  try {
    const newTask = await createTask(title);
    taskList.appendChild(createTaskElement(newTask));
    
    // Clear the input
    taskInput.value = '';
    
    // Remove the "no tasks" message if it exists
    const emptyMessage = taskList.querySelector('li.text-center');
    if (emptyMessage) {
      emptyMessage.remove();
    }
  } catch (error) {
    showError('Failed to add task.');
  }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', loadTasks);