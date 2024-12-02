<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { TodoSchema } from './types';
    import type { Todo } from './types';
  
    export let isOpen = false;
    export let todo: Partial<Todo> = { title: '', description: '' };
    export let mode: 'create' | 'edit' = 'create';
  
    const dispatch = createEventDispatcher();
    let errors: { [key: string]: string } = {};
  
    function validate() {
      try {
        TodoSchema.parse(todo);
        errors = {};
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors = error.errors.reduce((acc, curr) => {
            const field = curr.path[0];
            acc[field] = curr.message;
            return acc;
          }, {} as { [key: string]: string });
        }
        return false;
      }
    }
  
    function handleSubmit() {
      if (validate()) {
        dispatch('save', todo);
        isOpen = false;
      }
    }
  
    function handleClose() {
      isOpen = false;
      errors = {};
      dispatch('close');
    }
  </script>
  
  {#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">
        {mode === 'create' ? 'TODOの追加' : 'TODOの編集'}
      </h2>
      
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">タイトル</label>
          <input
            type="text"
            bind:value={todo.title}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {#if errors.title}
            <p class="mt-1 text-sm text-red-600">{errors.title}</p>
          {/if}
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">説明</label>
          <textarea
            bind:value={todo.description}
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>
  
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            on:click={handleClose}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {mode === 'create' ? '追加' : '更新'}
          </button>
        </div>
      </form>
    </div>
  </div>
  {/if}