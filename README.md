# Food Menu Webpage

## Overview
This is a Vue.js-based Food Menu Webpage that showcases food items fetched from [TheMealDB API](https://www.themealdb.com/api.php). The design and theme are inspired by [Swiggy](https://www.swiggy.com/), ensuring a clean and user-friendly interface. The webpage includes filtering, sorting, pagination, and a responsive layout.

## Features

### 1. Header Section
- Displays a logo and a search bar (non-functional, for design purposes only).

### 2. Filters Section
- Dropdown-based filtering by Area.
- Users can select an Area using radio buttons and apply the filter.
- Sorting functionality: Sort food items alphabetically.

### 3. Food Items Section
- By default, displays all Indian food items.
- Each food item card includes:
  - Image
  - Name
  - Randomly generated ratings
- Clicking a food item opens a Modal with additional details fetched from the API.
- Added load more functionality to load extra data.

### 4. Footer Section
- Basic footer to balance the page.

## Technologies Used
- Vue.js 3 (Composition API)
- Vue Router
- Tailwind CSS for styling
- Axios for API requests

## Setup & Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v20.10.0)
- npm

### Steps to Run the Project Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/samir-randeriya/FoodMenuVue
   cd FoodMenuVue
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open `http://localhost:5173/` in your browser.

## API Usage
- Fetching Areas: `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
- Fetching Meals by Area: `https://www.themealdb.com/api/json/v1/1/filter.php?a={area_name}`
- Fetching Meal Details: `https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}`

## Deployment
- The application is deployed at: [https://food-menu-netlyo3ys-samir-randeriyas-projects.vercel.app/](#)
- Demo Video: [Video Link](#)

## Folder Structure
```
food-menu-webpage/
│── src/
│   ├── components/
│   │   ├── Header.vue
│   │   ├── Filters.vue
│   │   ├── FoodItems.vue
│   │   ├── Footer.vue
│   │   └── Modal.vue
│   ├── views/
│   │   ├── Home.vue
│   ├── router/
│   ├── store/
│   ├── assets/
│   ├── App.vue
│   ├── main.js
│── public/
│── package.json
│── README.md
```