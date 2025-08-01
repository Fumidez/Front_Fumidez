<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh;">
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg">
        <h1 class="text-center text-primary mb-4">Recuperar Contraseña</h1>
        <form @submit.prevent="solicitarCambio">
          <div class="form-group mb-4">
            <label for="ipt-email" class="font-weight-bold"><i class="bi bi-envelope"></i> Correo Electrónico</label>
            <input type="email" id="ipt-email" v-model="email" class="form-control"
              placeholder="Ingrese su correo electrónico" required />
          </div>

          <!-- Mostrar cargando mientras se procesa -->
          <button v-if="!mensajeConfirmacion && !cargando" type="submit" class="btn btn-primary w-100 py-2">
            <i class="pi pi-key"></i> Solicitar cambio de contraseña
          </button>

          <!-- Botón con estado de cargando -->
          <button v-if="cargando" type="button" class="btn btn-primary w-100 py-2" disabled>
            <i class="pi pi-spin pi-spinner"></i> Enviando...
          </button>
        </form>

        <!-- Mensaje de confirmación -->
        <div v-if="mensajeConfirmacion" class="alert alert-success mt-3">
          {{ mensajeConfirmacion }}
        </div>
        <!-- Mensaje de error -->
        <div v-if="mensajeError" class="alert alert-danger mt-3">
          {{ mensajeError }}
        </div>

        <!-- Botón de redirección a login -->
        <button v-if="mensajeConfirmacion" @click="redirigirLogin" class="btn btn-primary w-100 py-2">
          <i class="pi pi-key"></i> Volver a Iniciar Sesión
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import { recuperarContraseniaFachada } from '../helpers/passwordHelper';
import router from "@/router";

export default {
  data() {
    return {
      email: null,
      mensajeConfirmacion: "", // Mensaje de confirmación para el usuario
      mensajeError: "",
      cargando: false, // Estado de carga
    };
  },
  methods: {
    async solicitarCambio() {
      try {
        // Validación del correo
        if (!this.email) {
          this.mensajeError = "Por favor, ingrese un correo electrónico válido.";
          return;
        }

        // Establecer cargando a true para mostrar el spinner
        this.cargando = true;
        this.mensajeError = ""; // Limpiar errores anteriores

        // Llamada al backend para enviar el enlace de recuperación
        const respuesta = await recuperarContraseniaFachada(this.email);

        // Mostrar el mensaje de confirmación si la solicitud es exitosa
        if (respuesta) {
          this.mensajeConfirmacion = "¡El enlace de recuperación ha sido enviado a tu correo electrónico!";
          this.email = ""; // Limpiar el campo de correo
        } else {
          this.mensajeError = "No se pudo enviar el enlace de recuperación. Verifique el correo ingresado.";
        }
      } catch (error) {
        // Manejo de errores
        this.mensajeError = "No se pudo enviar el enlace de recuperación. Verifique el correo ingresado.";
      } finally {
        // Establecer cargando a false después de la solicitud
        this.cargando = false;
      }
    },
    async redirigirLogin() {
      const ruta = `/login`;
      await router.push({ path: ruta });
    },
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
  background-image: url('@/assets/fumi.jpg'), linear-gradient(to bottom, #132333, #132333);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

main::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: -1;
}

.card {
  max-width: 600px;
  width: 100%;
  border-radius: 15px;
  border: 3px solid transparent;
  border-image: linear-gradient(to right, #004080, #a9c4f5);
  border-image-slice: 1;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

h1 {
  font-weight: 700;
  color: #031425;
}

label {
  font-weight: bold;
}

input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #004080;
  outline: none;
}

button {
  background-color: #004080;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.75rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #003060;
}

.alert {
  padding: 10px;
  margin-top: 15px;
  border-radius: 5px;
  text-align: center;
}

/* Estilo para mensajes de éxito */
.alert-success {
  background-color: #28a745;
  color: white;
}

/* Estilo para mensajes de error */
.alert-danger {
  background-color: #dc3545;
  color: white;
}
</style>
