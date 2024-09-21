<template>
    <div class="cliente-form">
      <h1>Ingresar Cliente</h1>
      <form @submit.prevent="submitForm">
  
        <!-- Nombre -->
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="cliente.nombre" placeholder="Nombre" />
        </div>
  
        <!-- Teléfono -->
        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input type="tel" id="telefono" v-model="cliente.telefono" placeholder="Teléfono" />
        </div>
  
        <!-- Correo -->
        <div class="form-group">
          <label for="correo">Correo</label>
          <input type="email" id="correo" v-model="cliente.correo" placeholder="Correo" />
        </div>
  
        <!-- Dirección -->
        <div class="form-group">
          <label for="direccion">Dirección</label>
          <input type="text" id="direccion" v-model="cliente.direccion" placeholder="Dirección" />
        </div>
  
        <!-- RUC -->
        <div class="form-group">
          <label for="ruc">RUC</label>
          <input type="text" id="ruc" v-model="cliente.ruc" placeholder="RUC" />
        </div>
  
        <button type="submit">Guardar</button>
      </form>
    </div>
  </template>
  
  <script>
import { crearClienteFachada } from '../helpers/ClienteHelper';

  export default {
    name: "Clientes",
    data() {
      return {
        cliente: {
          nombre: '',
          telefono: '',
          correo: '',
          direccion: '',
          ruc: ''
        }
      };
    },
    methods: {
     async submitForm() {
        console.log("Datos del cliente:", this.cliente);
        const nuevoCliente = await crearClienteFachada(this.cliente);
        this.limpiarDatosCliente();
    },

    limpiarDatosCliente(){
        this.cliente = {

            nombre: '',
            telefono: '',
            correo: '',
            direccion: '',
            ruc: ''

        };
    }

    }
  };
  </script>
  
  <style scoped>
  .cliente-form {
    max-width: 400px; /* Ajusta el tamaño del formulario */
    margin: auto;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  h1 {
    text-align: center;
    font-size: 1.2rem; /* Reduce el tamaño del título */
    color: #181C71;
  }
  
  .form-group {
    margin-bottom: 0.75rem; /* Reduce el espacio entre campos */
  }
  
  label {
    display: block;
    font-weight: bold;
    font-size: 0.9rem; /* Tamaño más pequeño para las etiquetas */
    margin-bottom: 0.25rem;
  }
  
  input {
    width: 100%;
    padding: 0.4rem; /* Reduce el padding de los campos de entrada */
    font-size: 0.9rem; /* Reduce el tamaño del texto en los campos */
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 0.6rem; /* Botón más pequeño */
    background-color: #181C71;
    color: white;
    font-size: 0.9rem; /* Texto más pequeño en el botón */
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #4a5d92;
  }
  </style>
  