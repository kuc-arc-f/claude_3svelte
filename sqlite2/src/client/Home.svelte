<script lang="ts">
  import { onMount } from 'svelte';
  import { isDialogOpen, editingTodo, searchQuery } from './Home/stores';
  import { api } from './Home/api';
  import TodoDialog from './Home/TodoDialog.svelte';
  import type { Todo } from './Home/types';
  
  let todos: Todo[] = [], mode: string = "create";
  const initialData = {
    title: '',
    content: '',
    public: false,
    food_orange: false,
    food_apple: false,
    food_banana: false,
    pub_date: new Date().toISOString().split('T')[0],
    qty1: '',
    qty2: '',
    qty3: ''
  };

  const loadTodos = async () => {
    todos = await api.getAllTodos($searchQuery);
  };
  
  const handleDelete = async (id: number) => {
    if (confirm('本当に削除しますか？')) {
      await api.deleteTodo(id);
      await loadTodos();
    }
  };
  
  const handleEdit = (todo: Todo) => {
    mode = "edit";
    editingTodo.set(todo);
    isDialogOpen.set(true);
  };
  
  const handleAdd = () => {
    mode = "create";
    //editingTodo.set(null);
    editingTodo.set(initialData);
    isDialogOpen.set(true);
  };
  
  onMount(loadTodos);
  
  $: {
    if ($searchQuery) {
      loadTodos();
    }
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <div class="flex gap-4 items-center">
      <h1 class="text-3xl">TODOリスト</h1>
      <input
        type="text"
        placeholder="検索..."
        bind:value={$searchQuery}
        class="border rounded p-2"
      />
    </div>
    <button
      on:click={handleAdd}
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      新規追加
    </button>
  </div>

  <div class="grid gap-4">
    {#each todos as todo (todo.id)}
      <div class="border rounded p-4 flex justify-between items-center">
        <div>
          <h3 class="text-xl">{todo.title}</h3>
          <p>{todo.content}</p>
          <div class="text-sm text-gray-600">
            公開: {todo.public ? '公開' : '非公開'} |
            公開日: {todo.pub_date}
          </div>
          <div class="text-sm text-gray-600">
            食べ物:
            {#if todo.food_orange}オレンジ{/if}
            {#if todo.food_apple}りんご{/if}
            {#if todo.food_banana}バナナ{/if}
          </div>
          <div class="text-sm text-gray-600">
            数量: {todo.qty1}, {todo.qty2}, {todo.qty3}
          </div>
        </div>
        <div class="flex gap-2">
          <button
            on:click={() => handleEdit(todo)}
            class="px-3 py-1 border rounded hover:bg-gray-100"
          >
            編集
          </button>
          <button
            on:click={() => handleDelete(todo.id)}
            class="px-3 py-1 border rounded text-red-500 hover:bg-red-50"
          >
            削除
          </button>
        </div>
      </div>
    {/each}
  </div>

  {#if $isDialogOpen}
    <TodoDialog onSave={loadTodos} mode={mode} />
  {/if}
</div>
