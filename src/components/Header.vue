<template>
  <header v-if="!isRecuperarContraseniaPage">
    <div class="header-container">
      <!-- Logo con redirección al inicio -->
      <div class="logo" @click="goToInicio">
        <img src="../assets/fumidez_logo.png" alt="Fumidez Logo" />
      </div>

      <!-- Navbar -->
      <nav class="navbar" :class="{ 'navbar-open': isNavbarOpen }">
        <ul>
          <!--   <li v-if="tipo === 'ADMIN'">
            <router-link to="/clientes">Clientes</router-link>
          </li> -->
          <li><router-link to="/productos_lista">Productos</router-link></li>
          <li><router-link to="/proveedores_lista">Proveedores</router-link></li>
          <li><router-link to="/usuarios_lista">Usuarios</router-link></li>
          <li><router-link to="/orden_trabajo_lista">Ordenes de Trabajo</router-link></li>
          <li><router-link to="/informe_lista">Informes</router-link></li>
          <li><router-link to="/calendario">Calendario</router-link></li>
          <li><router-link to="/clientes_lista">Cliente</router-link></li>
          <li><router-link to="/cambiar_contraseña">Cambiar</router-link></li>
          <li><router-link to="/recuperar_contrasenia">Recuperar</router-link></li>
        </ul>
      </nav>

      <!-- User Actions -->
      <div class="user-actions">
        <button @click="toggleNavbar" class="navbar-toggle-btn" aria-label="Toggle Navigation">
          <i class="fas" :class="isNavbarOpen ? 'fa-times' : 'fa-bars'"></i>
        </button>
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
      isNavbarOpen: false,
    };
  },

  computed: {
    isRecuperarContraseniaPage() {
      return this.$route.path === '/recuperar_contrasenia';
    }
  },

  mounted() {
    this.tipo = comprobarTipoUsuario();
  },

  methods: {
    // Método para redirigir al inicio cuando se hace clic en el logo
    goToInicio() {
      this.$router.push('/inicio');
    },

    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
    },

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
  flex-wrap: wrap;
}

.logo {
  cursor: pointer;
}

/* Navbar */
.navbar {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar ul {
  display: flex;
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

/* Navbar Toggle Button */
.navbar-toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
}

.navbar-toggle-btn:hover {
  color: #ffd700;
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .navbar {
    display: none;
    flex-direction: column;
    gap: 1rem;
  }

  .navbar.navbar-open {
    display: flex;
  }

  .navbar-toggle-btn {
    display: block;
  }
}
</style>
