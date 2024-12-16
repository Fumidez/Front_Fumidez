<template>
  <div id="app">
    <Header v-if="$route.path !== '/login'"/>
    <router-view />

  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style>

</style>
