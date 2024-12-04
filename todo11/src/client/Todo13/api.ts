import type { Todo } from './types';

const API_BASE = 'YOUR_API_ENDPOINT';

export const api = {
    async getTodos(search?: string) {
        const url = search 
            ? `${API_BASE}/api/todos?search=${encodeURIComponent(search)}`
            : `${API_BASE}/api/todos`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch error');
        return response.json();
    },

    async createTodo(todo: Todo) {
        const response = await fetch(`${API_BASE}/api/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        });
        if (!response.ok) throw new Error('Create error');
        return response.json();
    },

    async updateTodo(id: number, todo: Todo) {
        const response = await fetch(`${API_BASE}/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        });
        if (!response.ok) throw new Error('Update error');
        return response.json();
    },

    async deleteTodo(id: number) {
        const response = await fetch(`${API_BASE}/api/todos/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Delete error');
        return response.json();
    }
};