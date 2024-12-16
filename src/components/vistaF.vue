<template>
  <div class="photo-uploader">
    <div class="upload-section">
      <h2>Subir Foto</h2>
      <form @submit.prevent="uploadPhoto" class="upload-form">
        <input
          type="file"
          @change="onFileChange"
          accept="image/*"
          class="file-input"
        />
        <button type="submit" class="upload-button">Subir Foto</button>
      </form>
    </div>

    <div class="photos-section">
      <h2>Fotos Cargadas</h2>
      <div v-if="photos.length > 0" class="photo-grid">
        <div
          v-for="foto in photos"
          :key="foto.id"
          class="photo-item"
        >
          <img
            :src="'data:' + foto.mimeType + ';base64,' + foto.fotoBase64"
            alt="Foto"
            class="photo-image"
          />
          <p class="photo-name">{{ foto.nombre }}</p>
        </div>
      </div>
      <p v-else class="no-photos">No hay fotos disponibles</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PhotoUploader",
  data() {
    return {
      selectedFile: null,
      photos: [], // Para almacenar las fotos recuperadas del backend
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadPhoto() {
      if (!this.selectedFile) {
        alert("Por favor, selecciona una foto.");
        return;
      }

      const formData = new FormData();
      formData.append("foto", this.selectedFile);

      try {
        await axios.post(
          "http://localhost:7070/app-almacenamiento/almacenamiento/guardar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.selectedFile = null;
        this.fetchPhotos();
      } catch (error) {
        console.error("Error al subir la foto", error);
      }
    },
    async fetchPhotos() {
      try {
        const response = await axios.get(
          "http://localhost:7070/app-almacenamiento/almacenamiento/listar"
        );
        this.photos = response.data;
      } catch (error) {
        console.error("Error al obtener las fotos", error);
      }
    },
  },
  mounted() {
    this.fetchPhotos();
  },
};
</script>

<style scoped>
.photo-uploader {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.upload-section {
  text-align: center;
  margin-bottom: 20px;
}

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-input {
  margin-bottom: 10px;
}

.upload-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-button:hover {
  background-color: #0056b3;
}

.photos-section {
  text-align: center;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 10px;
}

.photo-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.photo-image {
  max-width: 100%;
  max-height: 150px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.photo-name {
  font-size: 14px;
  color: #555;
}

.no-photos {
  color: #888;
  font-size: 16px;
  margin-top: 20px;
}
</style>
