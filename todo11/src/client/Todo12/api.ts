
//const API_BASE = 'http://localhost:8787/api';
const API_BASE = 'https://workers16.kuc-arc-f.workers.dev/api';
//"https://workers16.kuc-arc-f.workers.dev"
//todo12

export async function fetchTodos(search = '') {
    const response = await fetch(`${API_BASE}/todo12${search ? `?search=${search}` : ''}`);
    return await response.json();
}

export async function fetchTodo(id: number) {
    const response = await fetch(`${API_BASE}/todo12/${id}`);
    return await response.json();
}

export async function createTodo(todo: Omit<Todo, 'id'>) {
    const response = await fetch(`${API_BASE}/todo12`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    });
    return await response.json();
}

export async function updateTodo(id: number, todo: Omit<Todo, 'id'>) {
    const response = await fetch(`${API_BASE}/todo12/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    });
    return await response.json();
}

export async function deleteTodo(id: number) {
    await fetch(`${API_BASE}/todo12/${id}`, { method: 'DELETE' });
}