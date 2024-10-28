<template>
    <header>
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <img src="../assets/fumidez_logo.png" alt="Logo" />
        </div>
  
        <!-- Navbar -->
        <nav class="navbar">
          <ul>
            <li><router-link to="/clientes">Clientes</router-link></li>
            <li><router-link to="/productos">Productos</router-link></li>
            <li><router-link to="/plagas">Plagas</router-link></li>
            <li><router-link to="/proveedores">Proveedores</router-link></li>
            <li><router-link to="/usuarios">Usuarios</router-link></li>
            <li><router-link to="/orden_trabajo">Orden Trabajo</router-link></li>
            <li><router-link to="/orden_trabajo_lista">Ordenes de Trabajo</router-link></li>
            <li><router-link to="/informe">Informe</router-link></li>
            <li><router-link to="/login">Login</router-link></li>

          </ul>
        </nav>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: "Header",
  };
  </script>
  
  <style scoped>
  header {
    background: linear-gradient(to bottom, #080d74 0%, #8d0d0d 100%); /* Degradado vertical suave */
    padding: 1rem;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Mantiene el logo y navbar separados */
  }
  
  /* Logo */
  .logo img {
    height: 50px; /* Ajusta el tamaño del logo */
  }
  
  /* Navbar */
  .navbar {
    padding: 0.5rem 1rem; /* Ajusta el padding alrededor del navbar */
    flex-grow: 1; /* Permite que el navbar ocupe más espacio para facilitar el centrado */
    text-align: center;
  }
  
  .navbar ul {
    display: flex;
    justify-content: center; /* Centra los elementos del navbar */
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .navbar ul li {
    margin-left: 1.5rem;
  }
  
  .navbar ul li a {
    color: white;
    text-decoration: none;
  }
  
  .navbar ul li a:hover {
    text-decoration: underline;
  }
  </style>
  