<template>
  <div id="app">
    <Header v-if="!isExcludedRoute" />
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
  computed: {
    isExcludedRoute() {
      const excludedRoutes = ['/login', '/recuperar_contrasenia', '/cambiar_contrasenia'];
      const currentPath = this.$route.path;
      return excludedRoutes.some(route => currentPath.startsWith(route));
    },
  },
};
</script>

<style>

</style>
