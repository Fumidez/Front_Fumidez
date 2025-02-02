<template>
  <div id="app">
    <Header v-if="!isExcludedRoute" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    Header,
  },
  computed: {
    isExcludedRoute() {
      const excludedRoutes = ['/login', '/recuperar_contrasenia', '/cambiar_contrasenia'];
      return excludedRoutes.includes(this.$route.path);
    },
  },
};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
  background-image: url('@/assets/FumidezBackgroundFinal1.png'), linear-gradient(to bottom, #132333, #132333);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat; /* Evita que la imagen se repita */
  min-height: 100vh; /* Asegura que cubra toda la pantalla */
  width: 100%;
}
</style>
