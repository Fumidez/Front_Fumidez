<template>
  <div id="app">
    <Header v-if="!['/login', '/recuperar_contraseña'].includes($route.path)" />
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
