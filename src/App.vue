<template>
  <div class="w-full min-h-screen bg-gray-100"> <!-- Ensure full width and full height -->
    <Home />  
  </div>
</template>

<script>
import Home from './views/Home.vue';
 
  export default {
    components: { Home },
  };
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
