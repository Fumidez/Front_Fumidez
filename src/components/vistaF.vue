<template>
    <div>
      <h2>Subir Foto</h2>
      <!-- Formulario para subir foto -->
      <form @submit.prevent="uploadPhoto">
        <input type="file" @change="onFileChange" accept="image/*" />
        <button type="submit">Subir Foto</button>
      </form>
  
      <h2>Fotos Cargadas</h2>
      <!-- Lista de fotos -->
      <div v-if="photos.length > 0">
        <div v-for="foto in photos" :key="foto.id" class="foto-item">
          <img :src="'data:' + foto.mimeType + ';base64,' + foto.fotoBase64" alt="Foto" />
          <p>{{ foto.nombre }}</p>
        </div>
      </div>
      <p v-else>No hay fotos disponibles</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        selectedFile: {
            file:null,
            idInform: 0
        },
        photos: [], // Para almacenar las fotos recuperadas del backend
      };
    },
    methods: {
      // Método para manejar la selección de la foto
      onFileChange(event) {
        this.selectedFile = event.target.files[0];
      },
  
      // Método para subir la foto al backend
      async uploadPhoto() {
        if (!this.selectedFile) {
          alert("Por favor, selecciona una foto.");
          return;
        }
  
        const formData = new FormData();
        formData.append('foto', this.selectedFile);
  
        try {
          // Cambiar la URL al endpoint correcto
          await axios.post('http://localhost:7070/app-almacenamiento/almacenamiento/guardar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          this.selectedFile = null;
          this.fetchPhotos(); // Actualiza la lista de fotos después de cargar una nueva
        } catch (error) {
          console.error("Error al subir la foto", error);
        }
      },
  
      // Método para recuperar todas las fotos desde el backend
      async fetchPhotos() {
        try {
          // Cambiar la URL al endpoint correcto
          const response = await axios.get('http://localhost:7070/app-almacenamiento/almacenamiento/listar');
          this.photos = response.data;
        } catch (error) {
          console.error("Error al obtener las fotos", error);
        }
      },
    },
  
    // Llamar a la función fetchPhotos cuando el componente se monte para cargar las fotos existentes
    mounted() {
      this.fetchPhotos();
    },
  };
  </script>
  
  <style scoped>
  .foto-item {
    margin: 20px;
    display: inline-block;
    text-align: center;
  }
  
  .foto-item img {
    max-width: 200px;
    max-height: 200px;
  }
  </style>
  