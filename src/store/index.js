import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        foods: [],        // All meals (full list)
        sortedFoods: [],  // Displayed meals (filtered & sorted)
        initialLoaded: false,
        areas: [],
        selectedArea: "Indian",
        selectedSortOption: "relevance",
        mealDetails: null,
        isModalOpen: false
    },
    mutations: {
        setFoods(state, foods) {
            state.foods = foods;  // Store all fetched meals
            state.sortedFoods = [...foods]; // Keep same list, let component handle pagination
            state.initialLoaded = true;
        },
        addMoreFoods(state, newMeals) {
            state.foods = [...state.foods, ...newMeals];
            state.sortedFoods = [...state.foods]; // Keep all meals available
        },
        setFilteredFoods(state, filteredFoods) {
            state.sortedFoods = [...filteredFoods];
        },
        setAreas(state, areas) {
            state.areas = areas;
        },
        setSelectedArea(state, area) {
            state.selectedArea = area;
        },
        setSelectedSort(state, sortOption) {
            state.selectedSortOption = sortOption;
        },
        applyFilters(state) {
            let filtered = [...state.foods];

            // Apply area filter if selected
            if (state.selectedArea) {
                filtered = filtered.filter(meal => meal.strArea === state.selectedArea);
            }

            // Apply sorting filter
            switch (state.selectedSortOption) {
                case "rating-asc":
                    filtered.sort((a, b) => a.rating - b.rating);
                    break;
                case "rating-desc":
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case "alpha-asc":
                    filtered.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
                    break;
                case "alpha-desc":
                    filtered.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
                    break;
                default:
                    break;
            }

            state.sortedFoods = filtered;
        },
        setMealDetails(state, meal) {
            state.mealDetails = meal;
        },
        setModalOpen(state, isOpen) {
            state.isModalOpen = isOpen;
        }
    },
    actions: {
        async fetchFoods({ commit }) {
            try {
                const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split(''); // Full alphabet
                const firstBatchLetters = ['a', 'b']; // Fetch 'a' and 'b' first
                let allMeals = [];
        
                // Fetch 'a' and 'b' first
                for (const letter of firstBatchLetters) {
                    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
                    if (response.data.meals) {
                        const mealsWithRatings = response.data.meals.map(meal => ({
                            ...meal,
                            rating: Math.floor(Math.random() * 5) + 1
                        }));
                        allMeals = [...allMeals, ...mealsWithRatings];
                    }
                }
        
                // Commit first batch for instant display
                commit('setFoods', allMeals);
        
                // Fetch remaining letters in the background
                for (const letter of alphabet.filter(l => !firstBatchLetters.includes(l))) {
                    const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
                    const response = await axios.get(url);
        
                    if (response.data.meals) {
                        const mealsWithRatings = response.data.meals.map(meal => ({
                            ...meal,
                            rating: Math.floor(Math.random() * 5) + 1
                        }));
                        commit('addMoreFoods', mealsWithRatings); // Add data dynamically
                    }
                }
            } catch (error) {
                console.error('Error fetching food data:', error);
            }
        },        
        searchFoods({ commit, state }, query) {
            if (!query) {
                commit('resetFoods'); // Reset to all meals
                return;
            }
        
            const filteredMeals = state.foods.filter(meal =>
                meal.strMeal.toLowerCase().includes(query.toLowerCase())
            );
        
            commit('setFilteredFoods', filteredMeals);
        },
        async fetchAreas({ commit }) {
            try {
                const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
                if (response.data.meals) {
                    const areas = response.data.meals.map(meal => meal.strArea);
                    commit('setAreas', areas);
                }
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        },
        updateAreaFilter({ commit, dispatch }, area) {
            commit('setSelectedArea', area);
            dispatch('applyFilters');
        },
        updateSortFilter({ commit, dispatch }, sortOption) {
            commit('setSelectedSort', sortOption);
            dispatch('applyFilters');
        },
        applyFilters({ commit }) {
            commit('applyFilters');
        },
        async fetchMealDetails({ commit }, mealId) {
            try {
                const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
                if (response.data.meals) {
                    commit('setMealDetails', response.data.meals[0]);
                    commit('setModalOpen', true); // Open the modal
                }
            } catch (error) {
                console.error('Error fetching meal details:', error);
            }
        },
        closeModal({ commit }) {
            commit('setModalOpen', false);
            commit('setMealDetails', null);
        }
    },
    getters: {
        getFoods: (state) => state.sortedFoods,
        getAreas: (state) => state.areas,
        getMealDetails: (state) => state.mealDetails,
        isModalOpen: (state) => state.isModalOpen
    },
});

