
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  dueDate?: string;
  completed: boolean;
}

export interface TasksState {
  tasks: Task[];
}

// Load tasks from localStorage
const loadTasksFromStorage = (): Task[] => {
  try {
    const tasksString = localStorage.getItem('tasks');
    if (tasksString) {
      return JSON.parse(tasksString);
    }
  } catch (error) {
    console.error('Error loading tasks from localStorage', error);
  }
  return [];
};

const initialState: TasksState = {
  tasks: loadTasksFromStorage(),
};

// Helper function to save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage', error);
  }
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'completed'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        completed: false,
      };
      state.tasks.push(newTask);
      saveTasksToStorage(state.tasks);
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        saveTasksToStorage(state.tasks);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      saveTasksToStorage(state.tasks);
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        if (task.completed) {
          task.status = 'done';
        } else if (task.status === 'done') {
          task.status = 'todo';
        }
        saveTasksToStorage(state.tasks);
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: string, newStatus: Status }>) => {
      const { taskId, newStatus } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.status = newStatus;
        if (newStatus === 'done') {
          task.completed = true;
        } else if (task.completed) {
          task.completed = false;
        }
        saveTasksToStorage(state.tasks);
      }
    },
  },
});

export const { addTask, editTask, deleteTask, toggleTaskCompletion, updateTaskStatus } = tasksSlice.actions;

export default tasksSlice.reducer;
