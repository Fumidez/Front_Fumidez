<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Iniciar Sesión</h1>
      <form @submit.prevent="login">
        <!-- Email -->
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="credentials.email" required
            placeholder="Ingresa tu correo electrónico" />
        </div>

        <!-- Contraseña -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="credentials.password" required
            placeholder="Ingresa tu contraseña" />
        </div>

        <!-- Botón de Iniciar Sesión -->
        <button type="submit">Iniciar Sesión</button>

        <!-- Opciones de Inicio de Sesión OAuth -->

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
        // Realiza una solicitud POST al backend para autenticación local
        const response = await consultarLoginFachada(this.credentials);

        console.log(response);
        if (response && response.constrasenia) {
          localStorage.setItem('token', response.constrasenia);
          // Redirige a la página de 'informe' después de iniciar sesión
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
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-form h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #181C71;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #181C71;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

button:hover {
  background-color: #4a5d92;
}

.oauth-options {
  text-align: center;
  margin-top: 1rem;
}

.oauth-options p {
  margin-bottom: 0.5rem;
  color: #555;
}

.oauth-options button {
  width: 48%;
  padding: 0.5rem;
  margin: 0.25rem 1%;
  background-color: #4285F4;
  /* Google Blue */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.oauth-options button:nth-child(3) {
  background-color: #333;
  /* GitHub Black */
}

.oauth-options button:hover {
  opacity: 0.9;
}
</style>