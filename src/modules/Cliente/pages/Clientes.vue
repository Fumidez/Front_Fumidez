<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh;">
    <!-- Header -->

    <!-- Contenido Principal -->
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg"
        style="max-width: 800px; width: 100%; border-radius: 15px; background: rgba(255, 255, 255, 0.95); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
        <!-- Título con Icono -->
        <div class="text-center mb-4">
          <i class="bi bi-person-plus-fill text-primary fs-1"></i>
          <h1 class="text-center text-primary mt-2">Ingresar Cliente</h1>
          <p class="text-muted">Completa el formulario para agregar un nuevo cliente a la base de datos.</p>
        </div>

        <form @submit.prevent="submitForm">
          <!-- Nombre -->
          <div class="form-group row align-items-center g-0 mb-4">
            <label for="nombre" class="col-3 d-flex align-items-center text-secondary fw-bold">
              <i class="bi bi-person-fill me-2 text-primary"></i> Nombre
            </label>
            <div class="col-9">
              <input type="text" id="nombre" v-model="cliente.nombre" class="form-control" required
                placeholder="Nombre del cliente" />
            </div>
          </div>

          <div class="form-group row align-items-center g-0 mb-3">
            <label for="nombreEncargado" class="col-2 d-flex align-items-center">
              <i class="bi bi-person-fill me-2 text-primary"></i> Persona Encargada
            </label>
            <div class="col-10">
              <input type="text" id="nombreEncargado" v-model="cliente.personaEncargada" class="form-control" required
                placeholder="Persona encargada" />
            </div>
          </div>

          <!-- Teléfono -->
          <div class="form-group row align-items-center mb-4">
            <label for="telefono" class="col-3 d-flex align-items-center text-secondary fw-bold">
              <i class="bi bi-telephone-fill me-2 text-primary"></i> Teléfono
            </label>
            <div class="col-9">
              <input type="tel" id="telefono" v-model="cliente.telefono" class="form-control" required
                placeholder="Número de teléfono" />
            </div>
          </div>

          <!-- Correo -->
          <div class="form-group row align-items-center mb-4">
            <label for="correo" class="col-3 d-flex align-items-center text-secondary fw-bold">
              <i class="bi bi-envelope-at-fill me-2 text-primary"></i> Correo
            </label>
            <div class="col-9">
              <input type="email" id="correo" v-model="cliente.correo" class="form-control" required
                placeholder="Correo electrónico" />
            </div>
          </div>

          <!-- Dirección -->
          <div class="form-group row align-items-center mb-4">
            <label for="direccion" class="col-3 d-flex align-items-center text-secondary fw-bold">
              <i class="bi bi-geo-alt-fill me-2 text-primary"></i> Dirección
            </label>
            <div class="col-9">
              <input type="text" id="direccion" v-model="cliente.direccion" class="form-control" required
                placeholder="Dirección del cliente" />
            </div>
          </div>

          <!-- RUC -->
          <div class="form-group row align-items-center mb-4">
            <label for="ruc" class="col-3 d-flex align-items-center text-secondary fw-bold">
              <i class="bi bi-person-square me-2 text-primary"></i> RUC
            </label>
            <div class="col-9">
              <input type="text" id="ruc" v-model="cliente.ruc" class="form-control" required
                placeholder="RUC del cliente" />
            </div>
          </div>

          <!-- Botón Guardar -->
          <div class="d-flex justify-content-between align-items-center mt-4">
            <button type="reset" @click="limpiarDatosCliente" class="btn btn-outline-secondary px-4 rounded-pill">
              <i class="bi bi-arrow-clockwise me-2"></i> Limpiar
            </button>
            <button type="submit" class="btn btn-primary px-5 py-3 fw-bold rounded-pill shadow-sm">
              <i class="bi bi-save me-2"></i> Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import Footer from '../../../components/Footer.vue';
import Header from '../../../components/Header.vue';
import { crearClienteFachada } from '../helpers/ClienteHelper';

export default {
  name: "IngresarCliente",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      cliente: {
        nombre: '',
        telefono: '',
        correo: '',
        direccion: '',
        ruc: '',
        personaEncargada:''
      }
    };
  },
  methods: {
    async submitForm() {
      console.log("Datos del cliente:", this.cliente);
      const nuevoCliente = await crearClienteFachada(this.cliente);
      this.limpiarDatosCliente();
    },
    limpiarDatosCliente() {
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
/* General */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
  background-image: url('src/assets/fumidezBackground.jpg'), linear-gradient(to bottom, #132333, #132333);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

/* Card Estilo Empresarial */
.card {
  border: 3px solid transparent;
  border-image: linear-gradient(to right, #004080, #a9c4f5);
  border-image-slice: 1;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.95);
  padding: 2rem 2.5rem;
}

h1 {
  font-weight: 700;
  font-size: 1.8rem;
  color: #004080;
}

button {
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #003060;
  transform: scale(1.05);
}

/* Responsividad */
@media (max-width: 768px) {
  .card {
    padding: 2rem 1.5rem;
    max-width: 100%;
  }

  h1 {
    font-size: 1.5rem;
  }

  button {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .card {
    padding: 1.5rem 1rem;
  }

  h1 {
    font-size: 1.3rem;
  }

  button {
    font-size: 0.85rem;
  }
}

/* Pantallas grandes */
@media (min-width: 1200px) {
  .card {
    max-width: 600px;
  }
}
</style>
