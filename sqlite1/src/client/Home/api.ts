import { TodoSchema } from './types';
import type { Todo } from './types';

const API_URL = 'http://localhost:3000/api';

export const api = {
  async getTodos(search?: string) {
    const url = search 
      ? `${API_URL}/todos?search=${encodeURIComponent(search)}`
      : `${API_URL}/todos`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('TODOの取得に失敗しました');
    return response.json() as Promise<Todo[]>;
  },

  async createTodo(data: z.infer<typeof TodoSchema>) {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('TODOの作成に失敗しました');
    return response.json() as Promise<Todo>;
  },

  async updateTodo(id: number, data: Partial<Todo>) {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('TODOの更新に失敗しました');
    return response.json() as Promise<Todo>;
  },

  async deleteTodo(id: number) {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('TODOの削除に失敗しました');
  },
};