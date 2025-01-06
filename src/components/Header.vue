<template>
  <header>
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <img src="../assets/fumidez_logo.png" alt="Fumidez Logo" />
      </div>

      <!-- Navbar -->
      <nav class="navbar">
        <ul>
          <li v-if="tipo === 'ADMIN'">
            <router-link to="/clientes">Clientes</router-link>
          </li>
          <li><router-link to="/productos_lista">Productos</router-link></li>
          <li><router-link to="/proveedores_lista">Proveedores</router-link></li>
          <li><router-link to="/usuarios_lista">Usuarios</router-link></li>
          <li><router-link to="/orden_trabajo_lista">Ordenes de Trabajo</router-link></li>
          <li><router-link to="/informe_lista">Informes</router-link></li>
          <li><router-link to="/calendario">Calendario</router-link></li>
          <li><router-link to="/clientes_lista">Cliente</router-link></li>

        </ul>
      </nav>

      <!-- User Actions -->
      <div class="user-actions">
        <input 
          type="text" 
          class="search-bar" 
          placeholder="Buscar..." 
          v-model="searchQuery" 
        />
        <button @click="logout" class="logout-btn" title="Cerrar sesión">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { comprobarTipoUsuario } from '../modules/Login/helpers/rolesHelper';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  name: "Header",

  data() {
    return {
      tipo: '',
      searchQuery: ''
    };
  },

  mounted() {
    this.tipo = comprobarTipoUsuario();
  },

  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
header {
  background: linear-gradient(to right, #002b5b, #005792);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1.5rem;
  color: white;
  font-family: 'Arial', sans-serif;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo img {
  height: 60px;
  cursor: pointer;
}

/* Navbar */
.navbar ul {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar ul li a {
  color: white;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s;
}

.navbar ul li a:hover {
  color: #ffd700;
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar {
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  outline: none;
  width: 200px;
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
}

.logout-btn:hover {
  color: #ffd700;
}
</style>
