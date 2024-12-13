<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { z } from 'zod';
  import { format } from 'date-fns';

  export let isOpen: boolean;
  //export let initialTodo: any = null;
  export let initialTodo: Record<string, any> = null;
  export let isEditMode: boolean = false;

  const dispatch = createEventDispatcher();

  let title = '';
  let content = '';
  let content_type = '';
  let public_type = 'public';
  let food_orange = false;
  let food_apple = false;
  let food_banana = false;
  let food_melon = false;
  let food_grape = false;
  let category_food = false;
  let category_drink = false;
  let category_gadget = false;
  let category_sport = false;
  let category_government = false;
  let category_internet = false;
  let category_smartphone = false;
  let country_jp = '';
  let country_en = '';
  let prefecture_jp = '';
  let prefecture_en = '';
  let post_no_jp = '';
  let post_no_en = '';
  let address_1_jp = '';
  let address_1_en = '';
  let address_2_jp = '';
  let address_2_en = '';
  let address_other_jp = '';
  let address_other_en = '';
  let pub_date1: string | null = null;
  let pub_date2: string | null = null;
  let pub_date3: string | null = null;
  let pub_date4: string | null = null;
  let pub_date5: string | null = null;
  let pub_date6: string | null = null;
  let qty1 = '';
  let qty2 = '';
  let qty3 = '';
  let qty4 = '';
  let qty5 = '';
  let qty6 = '';
  let errors: { [key: string]: string } = {};

  const schema = z.object({
    title: z.string().min(1, 'タイトルは必須です'),
    content: z.string().min(1, '内容は必須です'),
  });

  console.log("isEditMode=" , isEditMode);
  //console.log("#initialTodo");
  //console.log(initialTodo);

  onMount(() => {
    if (initialTodo) {
      title = initialTodo.title;
      content = initialTodo.content;
      content_type = initialTodo.content_type;
      public_type = initialTodo.public_type;
      food_orange = initialTodo.food_orange === 1;
      food_apple = initialTodo.food_apple === 1;
      food_banana = initialTodo.food_banana === 1;
      food_melon = initialTodo.food_melon === 1;
      food_grape = initialTodo.food_grape === 1;
      category_food = initialTodo.category_food === 1;
      category_drink = initialTodo.category_drink === 1;
      category_gadget = initialTodo.category_gadget === 1;
      category_sport = initialTodo.category_sport === 1;
      category_government = initialTodo.category_government === 1;
      category_internet = initialTodo.category_internet === 1;
      category_smartphone = initialTodo.category_smartphone === 1;
      country_jp = initialTodo.country_jp;
      country_en = initialTodo.country_en;
      prefecture_jp = initialTodo.prefecture_jp;
      prefecture_en = initialTodo.prefecture_en;
      post_no_jp = initialTodo.post_no_jp;
      post_no_en = initialTodo.post_no_en;
      address_1_jp = initialTodo.address_1_jp;
      address_1_en = initialTodo.address_1_en;
      address_2_jp = initialTodo.address_2_jp;
      address_2_en = initialTodo.address_2_en;
      address_other_jp = initialTodo.address_other_jp;
      address_other_en = initialTodo.address_other_en;
      pub_date1 = initialTodo.pub_date1;
      pub_date2 = initialTodo.pub_date2;
      pub_date3 = initialTodo.pub_date3;
      pub_date4 = initialTodo.pub_date4;
      pub_date5 = initialTodo.pub_date5;
      pub_date6 = initialTodo.pub_date6;
      qty1 = initialTodo.qty1;
      qty2 = initialTodo.qty2;
      qty3 = initialTodo.qty3;
      qty4 = initialTodo.qty4;
      qty5 = initialTodo.qty5;
      qty6 = initialTodo.qty6;
    }
  });
  
  const handleSubmit = () => {
    try {
        schema.parse({ title, content });
        errors = {};
      
      const todoData = {
        title,
        content,
        content_type,
        public_type,
        food_orange: food_orange ? 1 : 0,
        food_apple: food_apple ? 1 : 0,
        food_banana: food_banana ? 1 : 0,
        food_melon: food_melon ? 1 : 0,
        food_grape: food_grape ? 1 : 0,
        category_food: category_food ? 1 : 0,
        category_drink: category_drink ? 1 : 0,
        category_gadget: category_gadget ? 1 : 0,
        category_sport: category_sport ? 1 : 0,
        category_government: category_government ? 1 : 0,
        category_internet: category_internet ? 1 : 0,
        category_smartphone: category_smartphone ? 1 : 0,
        country_jp,
        country_en,
        prefecture_jp,
        prefecture_en,
        post_no_jp,
        post_no_en,
        address_1_jp,
        address_1_en,
        address_2_jp,
        address_2_en,
        address_other_jp,
        address_other_en,
         pub_date1: pub_date1 ? format(new Date(pub_date1), 'yyyy-MM-dd') : null,
         pub_date2: pub_date2 ? format(new Date(pub_date2), 'yyyy-MM-dd') : null,
         pub_date3: pub_date3 ? format(new Date(pub_date3), 'yyyy-MM-dd') : null,
         pub_date4: pub_date4 ? format(new Date(pub_date4), 'yyyy-MM-dd') : null,
         pub_date5: pub_date5 ? format(new Date(pub_date5), 'yyyy-MM-dd') : null,
         pub_date6: pub_date6 ? format(new Date(pub_date6), 'yyyy-MM-dd') : null,
        qty1,
        qty2,
        qty3,
        qty4,
        qty5,
        qty6,
      };
        dispatch('submit', todoData);
    } catch (error: any) {
         if (error instanceof z.ZodError) {
            errors = error.flatten().fieldErrors;
         }else{
          console.log(error)
         }
    }
  };

  const closeModal = () => {
    isOpen = false;
    dispatch('close');
  };
</script>

<!--  max-w-4xl max-h-[90vh] overflow-y-auto -->
{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4">{isEditMode ? 'Edit Todo' : 'Add New Todo'}</h2>

      <form on:submit|preventDefault={handleSubmit}>
          <div class="mb-4">
              <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input type="text" id="title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={title} />
              {#if errors.title}<p class="text-red-500 text-xs italic">{errors.title}</p>{/if}
          </div>

          <div class="mb-4">
              <label for="content" class="block text-gray-700 text-sm font-bold mb-2">Content</label>
              <textarea id="content" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={content}></textarea>
              {#if errors.content}<p class="text-red-500 text-xs italic">{errors.content}</p>{/if}
          </div>

           <div class="mb-4">
                <label for="content_type" class="block text-gray-700 text-sm font-bold mb-2">Content Type</label>
                <input type="text" id="content_type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={content_type} />
           </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Public Type</label>
                <div class="flex items-center">
                    <input type="radio" id="public" name="public_type" value="public" class="mr-2" bind:group={public_type} />
                    <label for="public" class="mr-4">Public</label>
                    <input type="radio" id="private" name="public_type" value="private" class="mr-2" bind:group={public_type} />
                    <label for="private">Private</label>
                </div>
            </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Foods</label>
            <div class="flex flex-wrap">
              <label class="inline-flex items-center mr-4">
                <input type="checkbox" class="form-checkbox" bind:checked={food_orange} />
                <span class="ml-2">Orange</span>
              </label>
              <label class="inline-flex items-center mr-4">
                <input type="checkbox" class="form-checkbox" bind:checked={food_apple} />
                <span class="ml-2">Apple</span>
              </label>
              <label class="inline-flex items-center mr-4">
                <input type="checkbox" class="form-checkbox" bind:checked={food_banana} />
                <span class="ml-2">Banana</span>
              </label>
               <label class="inline-flex items-center mr-4">
                <input type="checkbox" class="form-checkbox" bind:checked={food_melon} />
                <span class="ml-2">Melon</span>
               </label>
                 <label class="inline-flex items-center mr-4">
                <input type="checkbox" class="form-checkbox" bind:checked={food_grape} />
                <span class="ml-2">Grape</span>
               </label>
             </div>
            </div>


            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Categories</label>
                <div class="flex flex-wrap">
                    <label class="inline-flex items-center mr-4">
                        <input type="checkbox" class="form-checkbox" bind:checked={category_food} />
                        <span class="ml-2">Food</span>
                    </label>
                    <label class="inline-flex items-center mr-4">
                        <input type="checkbox" class="form-checkbox" bind:checked={category_drink} />
                        <span class="ml-2">Drink</span>
                    </label>
                     <label class="inline-flex items-center mr-4">
                        <input type="checkbox" class="form-checkbox" bind:checked={category_gadget} />
                        <span class="ml-2">Gadget</span>
                    </label>
                       <label class="inline-flex items-center mr-4">
                        <input type="checkbox" class="form-checkbox" bind:checked={category_sport} />
                        <span class="ml-2">Sport</span>
                     </label>
                       <label class="inline-flex items-center mr-4">
                        <input type="checkbox" class="form-checkbox" bind:checked={category_government} />
                        <span class="ml-2">Government</span>
                        </label>
                           <label class="inline-flex items-center mr-4">
                        <input type="checkbox" class="form-checkbox" bind:checked={category_internet} />
                        <span class="ml-2">Internet</span>
                    </label>
                    <label class="inline-flex items-center mr-4">
                         <input type="checkbox" class="form-checkbox" bind:checked={category_smartphone} />
                         <span class="ml-2">Smartphone</span>
                  </label>
                </div>
           </div>

          <div class="mb-4">
           <label class="block text-gray-700 text-sm font-bold mb-2">Country</label>
             <div class="flex space-x-4">
              <div>
               <label for="country_jp" class="block text-gray-700 text-xs font-bold mb-1">JP</label>
                <input type="text" id="country_jp" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={country_jp} />
              </div>
               <div>
               <label for="country_en" class="block text-gray-700 text-xs font-bold mb-1">EN</label>
                <input type="text" id="country_en" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={country_en} />
              </div>
            </div>
        </div>
        
         <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Prefecture</label>
            <div class="flex space-x-4">
              <div>
               <label for="prefecture_jp" class="block text-gray-700 text-xs font-bold mb-1">JP</label>
                <input type="text" id="prefecture_jp" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={prefecture_jp} />
              </div>
              <div>
                 <label for="prefecture_en" class="block text-gray-700 text-xs font-bold mb-1">EN</label>
                   <input type="text" id="prefecture_en" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={prefecture_en} />
              </div>
            </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Post NO</label>
             <div class="flex space-x-4">
              <div>
                <label for="post_no_jp" class="block text-gray-700 text-xs font-bold mb-1">JP</label>
                <input type="text" id="post_no_jp" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={post_no_jp} />
              </div>
             <div>
               <label for="post_no_en" class="block text-gray-700 text-xs font-bold mb-1">EN</label>
                <input type="text" id="post_no_en" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={post_no_en} />
              </div>
            </div>
        </div>

       <div class="mb-4">
         <label class="block text-gray-700 text-sm font-bold mb-2">Address 1</label>
           <div class="flex space-x-4">
              <div>
                 <label for="address_1_jp" class="block text-gray-700 text-xs font-bold mb-1">JP</label>
                  <input type="text" id="address_1_jp" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={address_1_jp} />
               </div>
               <div>
                 <label for="address_1_en" class="block text-gray-700 text-xs font-bold mb-1">EN</label>
                 <input type="text" id="address_1_en" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={address_1_en} />
               </div>
            </div>
       </div>

       <div class="mb-4">
         <label class="block text-gray-700 text-sm font-bold mb-2">Address 2</label>
            <div class="flex space-x-4">
                <div>
                 <label for="address_2_jp" class="block text-gray-700 text-xs font-bold mb-1">JP</label>
                  <input type="text" id="address_2_jp" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={address_2_jp} />
                </div>
                <div>
                  <label for="address_2_en" class="block text-gray-700 text-xs font-bold mb-1">EN</label>
                  <input type="text" id="address_2_en" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={address_2_en} />
              </div>
            </div>
       </div>


        <div class="mb-4">
         <label class="block text-gray-700 text-sm font-bold mb-2">Address Other</label>
          <div class="flex space-x-4">
              <div>
                <label for="address_other_jp" class="block text-gray-700 text-xs font-bold mb-1">JP</label>
                 <input type="text" id="address_other_jp" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={address_other_jp} />
               </div>
             <div>
                 <label for="address_other_en" class="block text-gray-700 text-xs font-bold mb-1">EN</label>
                 <input type="text" id="address_other_en" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={address_other_en} />
               </div>
            </div>
        </div>

        <div class="mb-4">
           <label class="block text-gray-700 text-sm font-bold mb-2">Pub Date</label>
                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label for="pub_date1" class="block text-gray-700 text-xs font-bold mb-1">1</label>
                        <input type="date" id="pub_date1" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={pub_date1} />
                    </div>
                    <div>
                        <label for="pub_date2" class="block text-gray-700 text-xs font-bold mb-1">2</label>
                        <input type="date" id="pub_date2" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={pub_date2} />
                    </div>
                    <div>
                        <label for="pub_date3" class="block text-gray-700 text-xs font-bold mb-1">3</label>
                        <input type="date" id="pub_date3" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={pub_date3} />
                     </div>
                      <div>
                        <label for="pub_date4" class="block text-gray-700 text-xs font-bold mb-1">4</label>
                        <input type="date" id="pub_date4" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={pub_date4} />
                     </div>
                    <div>
                       <label for="pub_date5" class="block text-gray-700 text-xs font-bold mb-1">5</label>
                       <input type="date" id="pub_date5" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={pub_date5} />
                    </div>
                     <div>
                       <label for="pub_date6" class="block text-gray-700 text-xs font-bold mb-1">6</label>
                        <input type="date" id="pub_date6" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={pub_date6} />
                     </div>
                </div>
         </div>
        
        
         <div class="mb-4">
         <label class="block text-gray-700 text-sm font-bold mb-2">Qty</label>
           <div class="grid grid-cols-3 gap-4">
                <div>
                     <label for="qty1" class="block text-gray-700 text-xs font-bold mb-1">1</label>
                      <input type="text" id="qty1" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={qty1} />
                 </div>
               <div>
                  <label for="qty2" class="block text-gray-700 text-xs font-bold mb-1">2</label>
                    <input type="text" id="qty2" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={qty2} />
               </div>
               <div>
                  <label for="qty3" class="block text-gray-700 text-xs font-bold mb-1">3</label>
                  <input type="text" id="qty3" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={qty3} />
               </div>
                 <div>
                      <label for="qty4" class="block text-gray-700 text-xs font-bold mb-1">4</label>
                    <input type="text" id="qty4" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={qty4} />
                 </div>
                 <div>
                  <label for="qty5" class="block text-gray-700 text-xs font-bold mb-1">5</label>
                  <input type="text" id="qty5" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={qty5} />
                 </div>
                 <div>
                      <label for="qty6" class="block text-gray-700 text-xs font-bold mb-1">6</label>
                    <input type="text" id="qty6" class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={qty6} />
                </div>
           </div>
      </div>


        <div class="flex justify-end mt-6 space-x-4">
          <button type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" on:click={closeModal}>
            Cancel
          </button>
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {isEditMode ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}