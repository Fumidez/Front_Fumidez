<template>
    <div>
      <Header />
      <main>
        <router-view />
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from './Header.vue'
  import Footer from './Footer.vue'
  
  export default {
    components: {
      Header,
      Footer
    }
  }
  </script>
  
  <style scoped>
  /* Añade tu estilo para el layout aquí */
  </style>
  