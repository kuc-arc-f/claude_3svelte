<script lang="ts">
  import { onMount } from 'svelte';
  //import TodoDialog from '$lib/components/TodoDialog.svelte';
  import { api } from './Home/api';
  import type { Todo } from './Home/types';
  import TodoDialog from './Home/TodoDialog.svelte'

  let todos: Todo[] = [];
  let isDialogOpen = false;
  let currentTodo: Partial<Todo> = { title: '', description: '' };
  let dialogMode: 'create' | 'edit' = 'create';
  let searchQuery = '';
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    await loadTodos();
  });

  async function loadTodos() {
    try {
      isLoading = true;
      todos = await api.getTodos(searchQuery);
    } catch (e) {
      error = e instanceof Error ? e.message : '予期せぬエラーが発生しました';
    } finally {
      isLoading = false;
    }
  }

  function openCreateDialog() {
    dialogMode = 'create';
    currentTodo = { title: '', description: '' };
    isDialogOpen = true;
  }

  function openEditDialog(todo: Todo) {
    dialogMode = 'edit';
    currentTodo = { ...todo };
    isDialogOpen = true;
  }

  async function handleSave(event: CustomEvent<Partial<Todo>>) {
    try {
      if (dialogMode === 'create') {
        await api.createTodo(event.detail);
      } else {
        await api.updateTodo(currentTodo.id!, event.detail);
      }
      await loadTodos();
    } catch (e) {
      error = e instanceof Error ? e.message : '予期せぬエラーが発生しました';
    }
  }

  async function handleDelete(id: number) {
    if (confirm('このTODOを削除してもよろしいですか？')) {
      try {
        await api.deleteTodo(id);
        await loadTodos();
      } catch (e) {
        error = e instanceof Error ? e.message : '予期せぬエラーが発生しました';
      }
    }
  }

  async function handleSearch() {
    await loadTodos();
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">TODOアプリ</h1>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  <div class="flex justify-between items-center mb-6">
    <div class="flex gap-2">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="TODOを検索..."
        class="px-4 py-2 border rounded-md"
      />
      <button
        on:click={handleSearch}
        class="px-3 py-1 border rounded hover:bg-gray-100"
      >
        検索
      </button>
    </div>
    
    <button
      on:click={openCreateDialog}
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
    >
      新規TODO
    </button>
  </div>

  {#if isLoading}
    <div class="text-center py-4">読み込み中...</div>
  {:else}
    <div class="grid gap-4">
      {#each todos as todo (todo.id)}
        <div class="border rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold">
              <input
                type="checkbox"
                checked={todo.completed}
                on:change={() => api.updateTodo(todo.id, { completed: !todo.completed }).then(loadTodos)}
                class="mr-2"
              />
              <span class:line-through={todo.completed}>{todo.title}</span>
            </h3>
            {#if todo.description}
              <p class="text-gray-600 mt-1">{todo.description}</p>
            {/if}
          </div>
          <div class="flex gap-2">
            <button
              on:click={() => openEditDialog(todo)}
              class="px-3 py-1 border rounded hover:bg-gray-100"
            >
              編集
            </button>
            <button
              on:click={() => handleDelete(todo.id)}
              class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              削除
            </button>
          </div>
        </div>
      {:else}
        <div class="text-center py-4 text-gray-500">
          TODOがありません
        </div>
      {/each}
    </div>
  {/if}
</div>

<TodoDialog
  bind:isOpen={isDialogOpen}
  bind:todo={currentTodo}
  bind:mode={dialogMode}
  on:save={handleSave}
/>
