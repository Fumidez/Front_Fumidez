<template>
  <div 
    class="container-fluid vh-100 d-flex justify-content-center align-items-center" 
    style="background-color: #0a1a2f; background-size: cover; background-position: center;">
    <div 
      class="card p-4 shadow-lg" 
      style="max-width: 400px; width: 100%; border-radius: 15px; background: #ffffffee; border: 3px solid transparent; border-image: linear-gradient(to right, #c82121 , #ffffff); border-image-slice: 1;">
      <!-- Logo de la empresa -->
      <div class="text-center mb-3">
        <img 
          src="../../../assets/fumidez_logo.png" 
          alt="Logo de la empresa" 
          style="width: 100px;">
      </div>
      
      <h1 class="text-center text-primary mb-4">Iniciar Sesión</h1>
      <form @submit.prevent="login">
        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="credentials.email" 
            class="form-control" 
            required 
            placeholder="Ingresa tu correo electrónico" />
        </div>

        <!-- Contraseña -->
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="credentials.password" 
            class="form-control" 
            required 
            placeholder="Ingresa tu contraseña" />
        </div>

        <!-- Botón de Iniciar Sesión -->
        <button 
          type="submit" 
          class="btn btn-primary w-100 py-2">
          Iniciar Sesión
        </button>

        <!-- ¿Olvidaste tu contraseña? -->
        <div class="text-center mt-3">
          <a href="/recuperar" class="text-decoration-none text-muted">
            ¿Olvidaste tu contraseña?
          </a>
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
      }
    };
  },
  methods: {
    async login() {
      try {
        const response = await consultarLoginFachada(this.credentials);

        console.log(response);
        if (response && response.constrasenia) {
          localStorage.setItem('token', response.constrasenia);
          localStorage.setItem('userType', response.tipo);

          this.$router.push('/informe');
        } else {
          alert('Error en la autenticación, por favor revisa tus credenciales.');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Credenciales inválidas. Por favor, intenta nuevamente.');
      }
    },
  }
};
</script>


<style scoped>
/* Fondo azul marino oscuro */
.container-fluid {
  background-color: #0a1a2f;
  background-size: cover;
  background-position: center;
}

/* Estilo del formulario con borde rojo y blanco */
.card {
  border: 3px solid transparent;
  border-image: linear-gradient(to right, #4d2323, #ffffff); /* Gradiente de color rojo y blanco */
  border-image-slice: 1;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
  background-color: #ffffffee; /* Fondo semitransparente */
}

h1 {
  font-weight: 700;
  font-size: 1.8rem;
}

button {
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #004080;
}

a {
  font-size: 0.9rem;
  color: #6c757d;
}

a:hover {
  color: #495057;
  text-decoration: underline;
}

/* Responsividad */
@media (max-width: 576px) {
  .card {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  button {
    font-size: 0.9rem;
  }
}
</style>