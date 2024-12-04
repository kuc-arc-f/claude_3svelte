<script lang="ts">
    import { onMount } from 'svelte';
    import { z } from 'zod';
    import { todoSchema } from './Todo12/schema';
    import type { Todo } from './Todo12/types';
    import { 
      fetchTodos, createTodo, updateTodo, deleteTodo 
    } from './Todo12/api';
    
    let todos: Todo[] = [];
    let searchQuery = '';
    let showDialog = false;
    let editingTodo: Partial<Todo> = getEmptyTodo();
    let errors: { [key: string]: string } = {};
    
    function getEmptyTodo(): Partial<Todo> {
        return {
            title: '',
            content: '',
            public: 0,
            food_orange: 0,
            food_apple: 0,
            food_banana: 0,
            pub_date: new Date().toISOString().split('T')[0],
            qty1: '',
            qty2: '',
            qty3: ''
        };
    }
    
    onMount(async () => {
        await loadTodos();
    });
    
    async function loadTodos() {
        todos = await fetchTodos(searchQuery);
    }
    
    function openDialog(todo?: Todo) {
        editingTodo = todo ? { ...todo } : getEmptyTodo();
        showDialog = true;
        errors = {};
    }
    
    async function handleSubmit() {
        try {
            const validatedData = todoSchema.parse(editingTodo);
            
            if (editingTodo.id) {
                await updateTodo(editingTodo.id, validatedData);
            } else {
                await createTodo(validatedData);
            }
            
            showDialog = false;
            await loadTodos();
        } catch (error) {
          console.log(error);
          if (error instanceof z.ZodError) {
              errors = error.errors.reduce((acc, curr) => {
                  const field = curr.path[0] as string;
                  acc[field] = curr.message;
                  return acc;
              }, {} as { [key: string]: string });
          }
        }
    }
    
    async function handleDelete(id: number) {
        if (confirm('本当に削除しますか？')) {
            await deleteTodo(id);
            await loadTodos();
        }
    }
</script>

<div class="container mx-auto p-4">
    <div class="mb-4 flex justify-between items-center">
        <div class="flex gap-2">
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="検索..."
                class="border rounded p-2"
            />
            <button
                on:click={loadTodos}
                class="bg-blue-500 text-white px-4 py-2 rounded"
            >
                検索
            </button>
        </div>
        <button
            on:click={() => openDialog()}
            class="bg-green-500 text-white px-4 py-2 rounded"
        >
            新規作成
        </button>
    </div>

    <div class="grid gap-4">
        {#each todos as todo}
            <div class="border p-4 rounded shadow">
                <h3 class="text-xl font-bold">{todo.title}</h3>
                <p class="mt-2">{todo.content}</p>
                <div class="mt-2">
                    <p>公開: {todo.public ? '公開' : '非公開'}</p>
                    <p>フルーツ選択: 
                        {todo.food_orange ? 'オレンジ ' : ''}
                        {todo.food_apple ? 'りんご ' : ''}
                        {todo.food_banana ? 'バナナ' : ''}
                    </p>
                    <p>公開日: {todo.pub_date}</p>
                    <p>数量1: {todo.qty1}</p>
                    <p>数量2: {todo.qty2}</p>
                    <p>数量3: {todo.qty3}</p>
                </div>
                <div class="mt-4 flex gap-2">
                    <button
                        on:click={() => openDialog(todo)}
                        class="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                        編集
                    </button>
                    <button
                        on:click={() => handleDelete(todo?.id)}
                        class="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        削除
                    </button>
                </div>
            </div>
        {/each}
    </div>

    {#if showDialog}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-full max-w-2xl">
                <h2 class="text-2xl font-bold mb-4">
                    {editingTodo.id ? 'TODO編集' : 'TODO作成'}
                </h2>
                
                <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                    <div>
                        <label class="block mb-1">タイトル</label>
                        <input
                            type="text"
                            bind:value={editingTodo.title}
                            class="w-full border rounded p-2"
                        />
                        {#if errors.title}
                            <p class="text-red-500 text-sm">{errors.title}</p>
                        {/if}
                    </div>

                    <div>
                        <label class="block mb-1">内容</label>
                        <input
                            type="text"
                            bind:value={editingTodo.content}
                            class="w-full border rounded p-2"
                        />
                        {#if errors.content}
                            <p class="text-red-500 text-sm">{errors.content}</p>
                        {/if}
                    </div>

                    <div>
                        <label class="block mb-1">公開設定</label>
                        <div class="space-x-4">
                            <label>
                                <input
                                    type="radio"
                                    bind:group={editingTodo.public}
                                    value={1}
                                />
                                公開
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    bind:group={editingTodo.public}
                                    value={0}
                                />
                                非公開
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block mb-1">フルーツ選択</label>
                        <div class="space-x-4">
                            <label>
                                <input
                                    type="checkbox"
                                    bind:checked={editingTodo.food_orange}
                                />
                                オレンジ
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    bind:checked={editingTodo.food_apple}
                                />
                                りんご
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    bind:checked={editingTodo.food_banana}
                                />
                                バナナ
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block mb-1">公開日</label>
                        <input
                            type="date"
                            bind:value={editingTodo.pub_date}
                            class="border rounded p-2"
                        />
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block mb-1">数量1</label>
                            <input
                                type="text"
                                bind:value={editingTodo.qty1}
                                class="w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label class="block mb-1">数量2</label>
                            <input
                                type="text"
                                bind:value={editingTodo.qty2}
                                class="w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label class="block mb-1">数量3</label>
                            <input
                                type="text"
                                bind:value={editingTodo.qty3}
                                class="w-full border rounded p-2"
                            />
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            on:click={() => showDialog = false}
                            class="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            class="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {editingTodo.id ? '更新' : '作成'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>