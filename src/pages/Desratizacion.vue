<template>
    <div class="desratizacion-form">
      <h1>Formulario de Desratización</h1>
      <form @submit.prevent="submitForm">
        
        <!-- Tipo Identificador Cordon -->
        <div class="form-group">
          <label for="tipoIdentificadorCordon">¿Tipo Identificador Cordon?</label>
          <input type="checkbox" id="tipoIdentificadorCordon" v-model="desratizacion.tipoIdentificadorCordon" />
        </div>
  
        <!-- Consumo -->
        <div class="form-group">
          <label for="consumo">Consumo</label>
          <input type="text" id="consumo" v-model="desratizacion.consumo" placeholder="Consumo" />
        </div>
  
        <!-- Ubicación -->
        <div class="form-group">
          <label for="ubicacion">Ubicación</label>
          <input type="text" id="ubicacion" v-model="desratizacion.ubicacion" placeholder="Ubicación" />
        </div>
  
        <!-- Observaciones -->
        <div class="form-group">
          <label for="observaciones">Observaciones</label>
          <textarea id="observaciones" v-model="desratizacion.observaciones" placeholder="Observaciones"></textarea>
        </div>
  
        <!-- Reemplazo Pega Cebo -->
        <div class="form-group">
          <label for="reemplazoPegaCebo">¿Reemplazo Pega Cebo?</label>
          <input type="checkbox" id="reemplazoPegaCebo" v-model="desratizacion.reemplazoPegaCebo" />
        </div>
  
        <!-- CSP -->
        <div class="form-group">
          <label for="csp">CSP</label>
          <input type="text" id="csp" v-model="desratizacion.csp" placeholder="CSP" />
        </div>
  
        <!-- Informe ID -->
        <div class="form-group">
          <label for="informeId">ID del Informe</label>
          <input type="number" id="informeId" v-model="desratizacion.informeId" placeholder="ID del Informe" />
        </div>
  
        <button type="submit">Guardar</button>
      </form>
    </div>
  </template>
  
  <script>
  // Importamos el helper para manejar la creación de desratización
  import { createDesratizacion } from '@/helpers/apiHelper';
  
  export default {
    name: "Desratizacion",
    data() {
      return {
        desratizacion: {
          tipoIdentificadorCordon: false,
          consumo: '',
          ubicacion: '',
          observaciones: '',
          reemplazoPegaCebo: false,
          csp: '',
          informeId: null
        }
      };
    },
    methods: {
      async submitForm() {
        try {
          const nuevaDesratizacion = await createDesratizacion(this.desratizacion);
          console.log('Desratización creada con éxito:', nuevaDesratizacion);
          this.limpiarFormulario();
        } catch (error) {
          console.error('Error al crear la desratización:', error);
        }
      },
      limpiarFormulario() {
        this.desratizacion = {
          tipoIdentificadorCordon: false,
          consumo: '',
          ubicacion: '',
          observaciones: '',
          reemplazoPegaCebo: false,
          csp: '',
          informeId: null
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .desratizacion-form {
    max-width: 500px; /* Ajusta el tamaño del formulario */
    margin: auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  h1 {
    text-align: center;
    font-size: 1.4rem;
    color: #181C71;
  }
  
  .form-group {
    margin-bottom: 0.75rem;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 0.6rem;
    background-color: #181C71;
    color: white;
    font-size: 0.9rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
  }
  
  button:hover {
    background-color: #4a5d92;
  }
  
  input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  </style>
  