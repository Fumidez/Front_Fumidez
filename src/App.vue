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
#app {
  padding-bottom: 50px; /* Para evitar que el contenido quede tapado por el footer */
}
</style>
