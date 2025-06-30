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
            src="/fumidez_logo.png" 
            alt="Logo de la empresa" 
            style="width: 100px;">
        </div>
  
        <h1 class="text-center text-primary mb-4">Recuperar Contraseña</h1>
        
        <form @submit.prevent="recuperarPassword">
          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="form-control" 
              required 
              placeholder="Ingresa tu correo electrónico" />
          </div>
  
          <!-- Botón de Recuperar Contraseña -->
          <button 
            type="submit" 
            class="btn btn-primary w-100 py-2">
            Enviar Enlace de Recuperación
          </button>
          
          <!-- Regresar al Login -->
          <div class="text-center mt-3">
            <router-link to="/login" class="text-decoration-none text-muted">
              Regresar al Login
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { solicitarRecuperacion } from '../helpers/passwordHelper';
  
  export default {
    name: "Recuperar",
    data() {
      return {
        email: '',
      };
    },
    methods: {
      async recuperarPassword() {
        try {
          const response = await solicitarRecuperacion(this.email);
  
          if (response.success) {
            alert('Se ha enviado un enlace de recuperación a tu correo.');
          } else {
            alert('No se encontró una cuenta asociada a este correo.');
          }
        } catch (error) {
          console.error('Error al solicitar recuperación:', error);
          alert('Hubo un error al procesar la solicitud. Intenta nuevamente más tarde.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Mismos estilos que el login */
  .container-fluid {
    background-color: #0a1a2f;
    background-size: cover;
    background-position: center;
  }
  
  .card {
    border: 3px solid transparent;
    border-image: linear-gradient(to right, #4d2323, #ffffff);
    border-image-slice: 1;
    border-radius: 15px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
    background-color: #ffffffee;
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
  