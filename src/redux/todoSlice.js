import { createSlice } from '@reduxjs/toolkit';

// Helper functions to interact with localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('todos');
        return serializedState ? JSON.parse(serializedState) : { tasks: [], deletedTasks: [] };
    } catch (error) {
        console.warn("Could not load state from localStorage", error);
        return { tasks: [], deletedTasks: [] };
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('todos', serializedState);
    } catch (error) {
        console.warn("Could not save state to localStorage", error);
    }
};

// Create the slice with initial state loaded from localStorage
const todoSlice = createSlice({
    name: 'todos',
    initialState: loadState(),
    reducers: {
        addTask: (state, action) => {
            state.tasks.push({ id: Date.now(), text: action.payload, completed: false });
        },
        toggleComplete: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload);
            if (task) task.completed = !task.completed;
        },
        deleteTask: (state, action) => {
            const taskIndex = state.tasks.findIndex(task => task.id === action.payload);
            if (taskIndex !== -1) {
                state.deletedTasks.push(state.tasks[taskIndex]);
                state.tasks.splice(taskIndex, 1);
            }
        },
        clearTasks: (state) => {
            state.tasks = [];
        },
        updateTask: (state, action) => {
            const { id, newText } = action.payload;
            const task = state.tasks.find(task => task.id === id);
            if (task) {
                task.text = newText;
            }
        },
        restoreTask: (state, action) => {
            const taskIndex = state.deletedTasks.findIndex(task => task.id === action.payload);
            if (taskIndex !== -1) {
                state.tasks.push(state.deletedTasks[taskIndex]);
                state.deletedTasks.splice(taskIndex, 1);
            }
        },
        clearDeletedTasks: (state) => {
            state.deletedTasks = [];
        },
    },
});

// Export actions
export const { addTask, toggleComplete, deleteTask, clearTasks, updateTask, restoreTask, clearDeletedTasks } = todoSlice.actions;

// Custom reducer to save the updated state to localStorage after every action
const todoReducer = (state, action) => {
    const newState = todoSlice.reducer(state, action);
    saveState(newState);  
    return newState;
};

export default todoReducer;
