<template>
    <div class="usuario-form">
      <h1>Ingresar Usuario</h1>
      <form @submit.prevent="submitForm">
        <!-- Tipo -->
        <div class="form-group">
          <label for="tipo">Tipo de Usuario</label>
          <input type="text" id="tipo" v-model="usuario.tipo" placeholder="Tipo" />
        </div>
  
        <!-- Contraseña -->
        <div class="form-group">
          <label for="contrasenia">Contraseña</label>
          <input type="password" id="contrasenia" v-model="usuario.contrasenia" placeholder="Contraseña" />
        </div>
  
        <!-- Nombre -->
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="usuario.nombre" placeholder="Nombre" />
        </div>
  
        <!-- Correo -->
        <div class="form-group">
          <label for="correo">Correo</label>
          <input type="email" id="correo" v-model="usuario.correo" placeholder="Correo" />
        </div>
  
        <!-- Número de Cuenta -->
        <div class="form-group">
          <label for="nCuenta">Número de Cuenta</label>
          <input type="text" id="nCuenta" v-model="usuario.nCuenta" placeholder="Número de Cuenta" />
        </div>
  
        <!-- RUC -->
        <div class="form-group">
          <label for="ruc">RUC</label>
          <input type="text" id="ruc" v-model="usuario.ruc" placeholder="RUC" />
        </div>
  
        <!-- Dirección -->
        <div class="form-group">
          <label for="direccion">Dirección</label>
          <input type="text" id="direccion" v-model="usuario.direccion" placeholder="Dirección" />
        </div>
  
        <!-- Teléfono -->
        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input type="tel" id="telefono" v-model="usuario.telefono" placeholder="Teléfono" />
        </div>
  
        <button type="submit">Guardar</button>
      </form>
    </div>
  </template>
  
  <script>
import { crearUsuarioFachada } from '../helpers/UsuarioHelper';

  // Importamos el helper que maneja la lógica de crear un usuario.
  
  
  export default {
    name: "Usuarios",
    data() {
      return {
        usuario: {
          tipo: '',
          contrasenia: '',
          nombre: '',
          correo: '',
          nCuenta: '',
          ruc: '',
          direccion: '',
          telefono: ''
        }
      };
    },
    methods: {
      async submitForm() {
        try {
          const nuevoUsuario = await crearUsuarioFachada(this.usuario);
          console.log('Usuario creado con éxito:', nuevoUsuario);
          // Aquí puedes hacer algo con la respuesta, como limpiar el formulario o redirigir.
          this.limpiarFormulario();
        } catch (error) {
          console.error('Error al crear el usuario:', error);
        }
      },
      limpiarFormulario() {
        // Limpia los campos del formulario
        this.usuario = {
          tipo: '',
          contrasenia: '',
          nombre: '',
          correo: '',
          nCuenta: '',
          ruc: '',
          direccion: '',
          telefono: ''
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .usuario-form {
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
  