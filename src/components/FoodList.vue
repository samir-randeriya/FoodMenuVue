<template>
    <div>
        <!-- No Results Message -->
        <div v-if="!displayedIngredients.length" class="text-center text-gray-500">
            No results found.
        </div>

        <!-- Food Items Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 m-5">
            <div v-for="ingredient in displayedIngredients" :key="ingredient.idIngredient"
                class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow cursor-pointer"
                @click="openMealModal(ingredient.idMeal)">
                
                <!-- Title with Tooltip -->
                <h2 class="text-lg font-semibold truncate w-full" :title="ingredient.strMeal">
                    {{ ingredient.strMeal.length > 20 ? ingredient.strMeal.slice(0, 20) + "..." : ingredient.strMeal }}
                </h2>

                <!-- Image -->
                <img :src="ingredient.strMealThumb" alt="Ingredient" 
                    class="w-full h-40 object-cover rounded-md mt-2"
                    @error="setFallbackImage"/>
                
                <!-- Tags with Max 3 Displayed -->
                <div class="flex flex-wrap gap-2 mt-3 text-sm items-center min-h-[60px]">
                    <template v-if="getDisplayedTags(ingredient).length > 0">
                        <span v-for="(tag, index) in getDisplayedTags(ingredient)" :key="index"
                            class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                            {{ tag }}
                        </span>
                    </template>
                </div>

                <!-- Description with Fixed Height -->
                <p class="text-gray-600 mt-3 h-[100px] overflow-hidden line-clamp-4" :title="ingredient.strInstructions">
                    {{ ingredient.strInstructions || "No description available." }}
                </p>

                <!-- Location & Rating Row -->
                <div class="flex items-center justify-between mt-3 text-gray-700 text-sm">
                    <!-- Location on the Left -->
                    <div class="flex items-center text-orange-500 font-medium">
                        <svg class="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" 
                                d="M12 2C8.13 2 5 5.13 5 9c0 4.67 5.86 10.74 6.13 11.03a1 1 0 0 0 1.74 0C13.14 19.74 19 13.67 19 9c0-3.87-3.13-7-7-7Zm0 16.45C9.84 15.04 7 10.99 7 9a5 5 0 0 1 10 0c0 1.99-2.84 6.04-5 9.45Zm0-11.45a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                        </svg>
                        <span class="ml-1 truncate">{{ ingredient.strArea || "Not Specified" }}</span>
                    </div>

                    <!-- Ratings on the Right -->
                    <div class="flex">
                        <span v-for="n in ingredient.rating" :key="n" class="text-yellow-500 text-lg">⭐</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreToLoad" class="text-center my-6">
            <button @click="loadMoreIngredients"
                class="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600">
                Load More
            </button>
        </div>

        <MealDetailModal v-if="isModalOpen" :meal="mealDetails" @close="closeModal"/>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import MealDetailModal from '../components/MealDetailModal.vue';

export default {
    components: {
        MealDetailModal
    },
    props: {
        ingredients: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const store = useStore();
        const itemsPerPage = 30;
        const displayedIngredients = ref([]);
        let loadedCount = 0;
        const isModalOpen = computed(() => store.getters.isModalOpen);
        const mealDetails = computed(() => store.getters.getMealDetails);

        // Watch for changes in ingredients and load initial batch
        watch(() => props.ingredients, (newIngredients) => {
            if (newIngredients.length > 0) {
                displayedIngredients.value = newIngredients.slice(0, itemsPerPage);
                loadedCount = itemsPerPage;
            }
            console.log('loadedCount', loadedCount)
        }, { immediate: true });

        // Check if more items need to be loaded
        const hasMoreToLoad = computed(() => props.ingredients.length > loadedCount);

        // Load More Ingredients
        const loadMoreIngredients = () => {
            const nextBatch = props.ingredients.slice(loadedCount, loadedCount + itemsPerPage);
            displayedIngredients.value = [...displayedIngredients.value, ...nextBatch];
            loadedCount += nextBatch.length;
        };

        const getDisplayedTags = (ingredient) => {
            if (!ingredient.strTags) return []; // Handle null or undefined values

            const allTags = ingredient.strTags.split(",").map(tag => tag.trim()); // Split into an array
            return allTags.slice(0, 3); // Show only first 3
        };

        const openMealModal = (mealId) => {
            store.dispatch('fetchMealDetails', mealId);
        };

        const closeModal = () => {
            store.dispatch('closeModal');
        };

        // Set fallback image if error occurs
        const setFallbackImage = (event) => {
            event.target.src = "https://via.placeholder.com/150?text=No+Image";
        };

        return {
            displayedIngredients,
            hasMoreToLoad,
            loadMoreIngredients,
            getDisplayedTags,
            openMealModal,
            closeModal,
            setFallbackImage,
            isModalOpen,
            mealDetails
        };
    }
};
</script>

<style scoped>
.truncate {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
