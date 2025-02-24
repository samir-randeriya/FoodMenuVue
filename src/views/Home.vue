<template>
  <div>
    <Header @search="handleSearch" />
    <Filters @filter="handleFilterByArea" @sort="handleSort"/>

    <div v-if="loading" class="text-center my-6">
      <div class="loader"></div>
      <p class="text-gray-500 mt-2">Loading...</p>
    </div>

    <FoodList v-else :ingredients="foods" />
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Header from '../components/Header.vue';
import Filters from '../components/Filters.vue';
import FoodList from '../components/FoodList.vue';
import Footer from '../components/Footer.vue';

export default {
  components: { Header, Filters, FoodList, Footer },
  setup() {
    const store = useStore();
    const loading = ref(false);
    const foods = ref([]); 
    const originalFoods = ref([]);

    onMounted(async () => {
      loading.value = true;
      await store.dispatch('fetchFoods'); // Fetch from API
      originalFoods.value = [...store.getters.getFoods]; // Store original list
      foods.value = [...originalFoods.value]; // Display foods
      loading.value = false;
    });

    // // Handle search with proper loader
    const handleSearch = async (query) => {
      loading.value = true;
      if (!query.trim()) {
        foods.value = [...originalFoods.value];
      } else {
        await store.dispatch('searchFoods', query);
        foods.value = [...store.getters.getFoods]; // Update list with filtered results
      }
      loading.value = false;
    };

    const handleFilterByArea = async (selectedArea) => {
      await store.dispatch('updateAreaFilter', selectedArea);
      foods.value = [...store.getters.getFoods]; // Ensure updated data is displayed
    };

    const handleSort = async (sorting) => {
      await store.dispatch('updateSortFilter', sorting);
      foods.value = [...store.getters.getFoods]; // Ensure updated data is displayed
    };

    return { foods, loading, handleSearch, handleFilterByArea, handleSort };
  }
};
</script>

<style>
/* 🔹 Loader Animation */
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ff7f50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>