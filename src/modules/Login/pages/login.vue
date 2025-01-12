<template>
  <div class="container-fluid vh-100 d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow-lg" style="max-width: 400px; width: 100%; border-radius: 15px; background: #ffffff; border: 3px solid transparent; border-image: linear-gradient(to right, #c82121 , #ffffff); border-image-slice: 1;">
      
      <!-- Logo de la empresa -->
      <div class="text-center mb-4">
        <img src="../../../assets/fumidez_logo.png" alt="Logo de la empresa" class="logo" />
      </div>

      <h1 class="text-center text-primary mb-4">Iniciar Sesión</h1>

      <!-- Indicador de carga -->
      <div v-if="loading" class="text-center mb-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Mensaje de error si existe -->
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="login">
        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input type="email" id="email" v-model="credentials.email" class="form-control" required
            placeholder="Ingresa tu correo electrónico" :class="{'is-invalid': emailError}" />
          <div v-if="emailError" class="invalid-feedback">Por favor ingresa un correo válido.</div>
        </div>

        <!-- Contraseña -->
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" id="password" v-model="credentials.password" class="form-control" required
            placeholder="Ingresa tu contraseña" :class="{'is-invalid': passwordError}" />
          <div v-if="passwordError" class="invalid-feedback">La contraseña es obligatoria.</div>
        </div>

        <!-- Botón de Iniciar Sesión -->
        <button type="submit" class="btn btn-primary w-100 py-2 mt-3">
          Iniciar Sesión
        </button>

        <!-- ¿Olvidaste tu contraseña? -->
        <div class="text-center mt-3">
          <button type="button" @click="abrirRecuperarContrasenia" class="btn btn-link text-muted">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { consultarLoginFachada } from '../helpers/loginHelper';

export default {
  name: "Login",
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      emailError: false,
      passwordError: false,
      loading: false,
      errorMessage: null // Aquí guardamos el mensaje de error
    };
  },

  methods: {
    async login() {
      this.emailError = this.passwordError = false; // Reset errors
      this.errorMessage = null; // Reset error message

      // Validar campos antes de enviar
      if (!this.credentials.email || !this.credentials.password) {
        this.emailError = !this.credentials.email;
        this.passwordError = !this.credentials.password;
        return;
      }

      this.loading = true; // Mostrar indicador de carga
      try {
        const response = await consultarLoginFachada(this.credentials);

        if (response && response.constrasenia) {
          localStorage.setItem('token', response.constrasenia);
          localStorage.setItem('userType', response.tipo);
          this.$router.push('/');
        } else {
          this.errorMessage = 'Error en la autenticación, por favor revisa tus credenciales.';
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = 'Credenciales inválidas. Por favor, intenta nuevamente.';
      } finally {
        this.loading = false; // Ocultar indicador de carga
      }
    },
    abrirRecuperarContrasenia() {
      this.$router.push('/recuperar_contrasenia');
    }
  }
};
</script>

<style scoped>
/* Fondo con gradiente dinámico */
.container-fluid {
  background: linear-gradient(135deg, #0a1a2f, #001f3f);
  background-size: cover;
  background-position: center;
}

/* Estilo del formulario */
.card {
  border: 3px solid transparent;
  border-image: linear-gradient(to right, #c82121, #ffffff);
  border-image-slice: 1;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
  padding: 2rem;
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}

h1 {
  font-weight: 700;
  font-size: 1.8rem;
  color: #333;
}

input.form-control {
  transition: border-color 0.3s ease;
}

input.form-control:focus {
  border-color: #007bff;
}

button {
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #004080;
}

button:focus {
  outline: none;
}

.invalid-feedback {
  font-size: 0.875rem;
  color: #dc3545;
}

.logo {
  width: 120px;
  margin-bottom: 20px;
  animation: logoFade 2s ease-in-out;
}

@keyframes logoFade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@media (max-width: 576px) {
  .card {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  button {
    font-size: 0.9rem;
  }
}
</style>
