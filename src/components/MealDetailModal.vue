<template>
    <div class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white w-1/2 h-[90%] p-5 rounded-lg shadow-lg relative flex flex-col">
            <!-- Close Button -->
            <button class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl cursor-pointer" @click="$emit('close')">
                ✖
            </button>

            <div v-if="meal" class="flex flex-col space-y-4 h-full">
                <!-- First Row: Image & Details -->
                <div class="flex flex-col md:flex-row h-1/2">
                    <!-- Image (Left, Centered) -->
                    <div class="md:w-1/2 flex justify-center items-center">
                        <img :src="meal.strMealThumb" class="w-44 h-44 object-cover rounded-lg shadow-md" alt="Meal Image">
                    </div>

                    <!-- Details (Right) -->
                    <div class="md:w-1/2 flex flex-col justify-center text-center md:text-left p-3">
                        <h2 class="text-lg font-semibold mb-1">{{ meal.strMeal }}</h2>
                        <p class="text-gray-600 text-sm"><strong>Area:</strong> {{ meal.strArea }}</p>
                        <p class="text-gray-600 text-sm"><strong>Category:</strong> {{ meal.strCategory }}</p>

                        <!-- Ingredients as Tags (Small Scroll if Needed) -->
                        <div class="mt-2 text-sm text-gray-700">
                            <h3 class="font-medium mb-2">Ingredients:</h3>
                            <div class="flex flex-wrap gap-2 max-h-20 overflow-y-auto custom-scrollbar">
                                <span v-for="(ingredient, index) in getIngredients()" :key="index"
                                    class="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded-full">
                                    {{ ingredient }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Second Row: Description (Small Scrollbar if Too Long) -->
                <div class="flex-1 p-2 border-t text-sm text-gray-700 overflow-y-auto custom-scrollbar max-h-40">
                    {{ meal.strInstructions }}
                </div>

                <!-- YouTube Link -->
                <div v-if="meal.strYoutube" class="text-center mt-2">
                    <a :href="meal.strYoutube" target="_blank" class="text-blue-500 text-sm underline">
                        Watch Recipe Video
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #a0aec0;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
</style>

<script>
export default {
    props: {
        meal: {
            type: Object,
            required: true
        }
    },
    methods: {
        getIngredients() {
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = this.meal[`strIngredient${i}`];
                const measure = this.meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim()) {
                    ingredients.push(`${measure} ${ingredient}`);
                }
            }
            return ingredients;
        }
    }
};
</script>
