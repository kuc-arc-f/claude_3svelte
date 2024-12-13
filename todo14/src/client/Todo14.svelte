<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import TodoForm from './Todo14/TodoForm.svelte';
  import ClientUtil from './lib/ClientUtil';

  let todos = [];
  let searchQuery = '';
  let isAddModalOpen = false;
  let isEditModalOpen = false;
  let selectedTodo = null;
  let API_URL = "";

    const fetchTodos = async () => {
    try {
        API_URL = await ClientUtil.getSysApiUrl();
        const response = await axios.get(`${API_URL}/api/todo17?query=${searchQuery}`);
        todos = response.data;
        console.log(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
    };


    const handleSearch = () => {
        fetchTodos();
    };
   
    const openAddModal = () => {
        selectedTodo = null;
        isEditModalOpen = false;
        isAddModalOpen = true;
    };


  const handleFormSubmit = async (event: CustomEvent) => {
       const todoData = event.detail;
        try {
            if(selectedTodo){
             await axios.put(`${API_URL}/api/todo17`, { ...todoData, id: selectedTodo.id });
           }else{
              await axios.post(API_URL + '/api/todo17', todoData);
           }
            fetchTodos();
             isAddModalOpen = false;
            isEditModalOpen = false;
        } catch (error) {
          console.error('Error saving todo:', error);
        }
    };

   const handleFormClose = () => {
    isAddModalOpen = false;
    isEditModalOpen = false;
  };


 const openEditModal = (todo) => {
    selectedTodo = todo;
    isAddModalOpen = false;
    isEditModalOpen = true;
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await axios.delete(API_URL + '/api/todo17', { data: { id } });
        fetchTodos();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };
  
  onMount(fetchTodos);
</script>

<div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Todos</h1>
         <div class="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Search todos..."
                    class="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                    bind:value={searchQuery}
                     on:keyup={handleSearch}
                />
            
             <button on:click={openAddModal} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Todo</button>
         </div>
    </div>
     <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200">
        <thead>
            <tr>
                <th class="py-2 px-4 border-b">Title</th>
                <th class="py-2 px-4 border-b">Content</th>
                <th class="py-2 px-4 border-b">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each todos as todo}
            <tr>
                 <td class="py-2 px-4 border-b">{todo.title}</td>
                  <td class="py-2 px-4 border-b">{todo.content}</td>
                  <td class="py-2 px-4 border-b">
                       <button on:click={() => openEditModal(todo)} class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                        <button on:click={() => handleDelete(todo.id)} class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                  </td>
            </tr>
          {/each}
        </tbody>
    </table>
  </div>

    <TodoForm
      isOpen={isAddModalOpen}
      on:close={handleFormClose}
      on:submit={handleFormSubmit}
        isEditMode={false}
    />
    <TodoForm
        isOpen={isEditModalOpen}
        on:close={handleFormClose}
        on:submit={handleFormSubmit}
        initialTodo={selectedTodo}
         isEditMode={true}
    />
</div>