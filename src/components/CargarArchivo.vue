<template>
  <div class="file-upload">
    <input type="file" @change="handleFileUpload" multiple />

    <!-- Lista de archivos seleccionados -->
    <div v-if="files.length > 0">
      <h3>Archivos seleccionados:</h3>
      <ul>
        <li v-for="(file, index) in files" :key="index">
          {{ file.name }} - {{ (file.size / 1024).toFixed(2) }} KB
          <button @click="removeFile(index)">Eliminar</button>
        </li>
      </ul>
    </div>

    <!-- Botón para subir archivos -->
    <button @click="uploadFiles" :disabled="files.length === 0">
      Subir archivos
    </button>

    <!-- Muestra del estado de carga -->
    <div v-if="uploadStatus">
      {{ uploadStatus }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'FileUpload',
  setup() {
    const files = ref([]);
    const uploadStatus = ref('');

    // Maneja la selección de archivos
    const handleFileUpload = (event) => {
      const newFiles = Array.from(event.target.files);

      // Agregar los nuevos archivos sin sobrescribir los existentes
      files.value = [...files.value, ...newFiles];
    };

    // Elimina un archivo de la lista
    const removeFile = (index) => {
      files.value.splice(index, 1);
    };

    // Simula la subida de archivos
    const uploadFiles = async () => {
      uploadStatus.value = 'Subiendo...';

      try {
        console.log(files.value);
        uploadStatus.value = '¡Archivos subidos con éxito!';
      } catch (error) {
        uploadStatus.value = 'Error al subir los archivos';
      }
    };

    return {
      files,
      uploadStatus,
      handleFileUpload,
      removeFile,
      uploadFiles,
    };
  },
};
</script>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
