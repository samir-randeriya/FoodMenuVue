<template>
    <div class="p-4">
        <!-- Title Section -->
        <h2 class="text-2xl font-bold mb-4">
            Restaurant with online food delivery in Pune
        </h2>

        <!-- Filter Section with Dropdown -->
        <div class="flex flex-col gap-4">
            <!-- Filter By Area -->
            <div class="flex items-center gap-2">
                <div class="relative">
                    <!-- Filter Dropdown Button -->
                    <button @click="toggleDropdown" class="px-4 py-2 bg-gray-200 rounded-[20px] shadow-lg flex items-center gap-2 hover:bg-orange-400 hover:text-white transition-all font-medium">
                        Filter by Area
                        <svg class="w-4 h-4 text-gray-500 hover:text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <!-- First Line -->
                            <line x1="4" y1="8" x2="16" y2="8" stroke-linecap="round" />
                            <circle cx="19" cy="8" r="2" fill="currentColor" />
                            
                            <!-- Second Line -->
                            <circle cx="5" cy="16" r="2" fill="currentColor" />
                            <line x1="8" y1="16" x2="20" y2="16" stroke-linecap="round" />
                        </svg>

                    </button>

                    <!-- Dropdown Menu -->
                    <div v-if="isDropdownOpen" 
                        class="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-[500px] z-10">
                        <div class="p-4">
                            <div v-if="loadingAreas" class="text-center text-gray-500">Loading...</div>
                            <div v-else>
                                <!-- Grid Layout for Radio Buttons -->
                                <div class="grid grid-cols-4 gap-2">
                                    <div v-for="(area, index) in areas" :key="index" class="flex items-center">
                                        <input type="radio" :id="`area-${index}`" :name="`area-filter`" :value="area"
                                            v-model="selectedArea" class="mr-1" />
                                        <label :for="`area-${index}`" class="text-sm">{{ area }}</label>
                                    </div>
                                </div>

                                <div class="mt-4 text-right">
                                    <button @click="applyFilter"
                                        class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sort By Dropdown -->
                <div class="relative">
                    <button @click="toggleSortDropdown"
                        class="px-4 py-2 bg-gray-200 rounded-[20px] shadow-lg flex items-center gap-2 hover:bg-orange-400 hover:text-white transition-all font-medium">
                        Sort By
                        <svg class="w-4 h-4 text-gray-500 hover:text-white" fill="none" stroke="currentColor" stroke-width="2" 
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    <!-- Sort Dropdown Menu -->
                    <div v-if="isSortDropdownOpen"
                        class="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-10">
                        <div class="p-4">
                            <!-- Sort Options -->
                            <div v-for="(option, index) in sortOptions" :key="index" class="flex items-center mb-2">
                                <input type="radio" :id="`sort-${index}`" :name="`sort-filter`" :value="option.value"
                                    v-model="selectedSortOption" class="mr-2" />
                                <label :for="`sort-${index}`" class="text-sm">{{ option.label }}</label>
                            </div>
                            <div class="mt-4 text-right">
                                <button @click="applySort"
                                    class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    emits: ['filter', 'sort'],
    setup(_, { emit }) {
        const store = useStore();
        const selectedArea = ref(null);
        const selectedSortOption = ref("relevance");
        const isDropdownOpen = ref(false);
        const isSortDropdownOpen = ref(false);
        const loadingAreas = ref(false);
        const areas = computed(() => store.getters.getAreas);
        
        onMounted(async () => {
            loadingAreas.value = true;
            await store.dispatch('fetchAreas');
            loadingAreas.value = false;
        });

        const sortOptions = [
            { label: "Default (Relevance)", value: "relevance" },
            { label: "Rating (Low to High)", value: "rating-asc" },
            { label: "Rating (High to Low)", value: "rating-desc" },
            { label: "Alphabetical (A to Z)", value: "alpha-asc" },
            { label: "Alphabetical (Z to A)", value: "alpha-desc" }
        ];

        const applyFilter = () => {
            emit('filter', selectedArea.value); // Emit updated area filter
            isDropdownOpen.value = false; // Close dropdown after applying
        };

        const applySort = () => {
            emit('sort', selectedSortOption.value);
            isSortDropdownOpen.value = false;
        };

        const toggleDropdown = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };

        const toggleSortDropdown = () => {
            isSortDropdownOpen.value = !isSortDropdownOpen.value;
        };

        return {
            areas,
            selectedArea,
            applySort, 
            sortOptions,
            selectedSortOption,
            isDropdownOpen,
            isSortDropdownOpen,
            loadingAreas,
            toggleDropdown,
            toggleSortDropdown,
            applyFilter,
        };
    }
};
</script>

<style scoped>
h2 {
    color: #333;
}
</style>
