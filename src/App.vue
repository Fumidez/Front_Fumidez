<template>
  <div id="app">
    <nav>
      <router-link to="/productos">Productos</router-link>
      <router-link to="/plagas">Plagas</router-link>
      <router-link to="/proveedores">Proveedores</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  background: black;
  padding: 1rem;
  border-bottom: 2px solid #333;
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
}

nav a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  nav {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }

  nav a {
    margin: 0.5rem 0;
  }
}

router-view {
  flex: 1;
}
</style>
