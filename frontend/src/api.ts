// Types
export interface Task {
	id: number;
	title: string;
	completed: boolean;
  }
  
  export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
  }
  
  // API URL - Change to match your backend URL
  const API_URL = 'http://localhost:3000';
  
  // Fetch all tasks
  export async function getTasks(): Promise<Task[]> {
	try {
	  const response = await fetch(`${API_URL}/api/tasks`);
	  
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
	  
	  const data: ApiResponse<Task[]> = await response.json();
	  
	  if (!data.success || !data.data) {
		throw new Error(data.error || 'Failed to fetch tasks');
	  }
	  
	  return data.data;
	} catch (error) {
	  console.error('Error fetching tasks:', error);
	  throw error;
	}
  }
  
  // Create a new task
  export async function createTask(title: string): Promise<Task> {
	try {
	  const response = await fetch(`${API_URL}/api/tasks`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({ title })
	  });
	  
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
	  
	  const data: ApiResponse<Task> = await response.json();
	  
	  if (!data.success || !data.data) {
		throw new Error(data.error || 'Failed to create task');
	  }
	  
	  return data.data;
	} catch (error) {
	  console.error('Error creating task:', error);
	  throw error;
	}
  }
  
  // Update a task
  export async function updateTaskStatus(id: number, completed: boolean): Promise<Task> {
	try {
	  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
		method: 'PUT',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({ completed })
	  });
	  
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
	  
	  const data: ApiResponse<Task> = await response.json();
	  
	  if (!data.success || !data.data) {
		throw new Error(data.error || 'Failed to update task');
	  }
	  
	  return data.data;
	} catch (error) {
	  console.error('Error updating task:', error);
	  throw error;
	}
  }
  
  // Delete a task
  export async function deleteTask(id: number): Promise<void> {
	try {
	  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
		method: 'DELETE'
	  });
	  
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
	  
	  const data: ApiResponse<void> = await response.json();
	  
	  if (!data.success) {
		throw new Error(data.error || 'Failed to delete task');
	  }
	} catch (error) {
	  console.error('Error deleting task:', error);
	  throw error;
	}
  }