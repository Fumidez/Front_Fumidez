<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
      <!-- Contenido Principal -->
      <main class="flex-grow-1 d-flex align-items-center justify-content-center">
        <div class="card p-5 shadow-lg"
          style="max-width: 600px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
          <h1 class="text-center text-primary mb-4">Recuperar Contraseña</h1>
          <!-- Formulario de Recuperación -->
          <form @submit.prevent="solicitarCambio">
            <!-- Correo Electrónico -->
            <div class="form-group mb-4">
              <label for="ipt-email" class="font-weight-bold"><i class="bi bi-envelope"></i> Correo Electrónico</label>
              <input type="email" id="ipt-email" v-model="email" class="form-control" placeholder="Ingrese su correo electrónico" required />
            </div>
  
            <button type="submit" class="btn btn-primary w-100 py-2" @click="enviarCorreo">
              <i class="pi pi-key"></i> Solicitar cambio de contraseña
            </button>
          </form>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import { createApp, h } from "vue";
  import { enviarcorreoFachada } from "../helpers/enviarCorreo";
  import MensajeHtmlTemplate from "../components/MensajeHtmlTemplate.vue";
  
  export default {
    data() {
      return {
        email: null,
        url: "http://localhost:5173/cambio-contrasenia/:correo",
        cuerpoCorreo: {
          destinatario: this.email,
          asunto: "Notificación de cambio de estado",
          cuerpo: "",
          mensajeHtml: "",
        },
      };
    },
    methods: {
      async enviarCorreo() {
        const mensaje = this.convertirComponenteHtml(MensajeHtmlTemplate, {
          email: this.email,
          url: this.url,
        });
  
        this.cuerpoCorreo.mensajeHtml = mensaje;
        this.cuerpoCorreo.destinatario = this.email;
        await enviarcorreoFachada(this.cuerpoCorreo);
  
        alert("El correo ha sido enviado exitosamente");
      },
      convertirComponenteHtml(componente, propsData) {
        const app = createApp({
          render() {
            return h(componente, propsData);
          },
        });
        const container = document.createElement("div");
        app.mount(container);
        return container.innerHTML;
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
    border: 3px solid transparent;
    border-image: linear-gradient(to right, #004080, #a9c4f5);
    border-image-slice: 1;
    border-radius: 15px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.9);
  }
  
  h1 {
    font-weight: 700;
    color: #031425;
  }
  
  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
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
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #003060;
  }
  </style>
  