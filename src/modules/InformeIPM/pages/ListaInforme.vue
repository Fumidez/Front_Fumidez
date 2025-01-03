<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
      <!-- Contenido Principal -->
      <main class="flex-grow-1 d-flex align-items-center justify-content-center">
        <div class="card p-5 shadow-lg"
          style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
          <h1 class="text-center text-primary mb-4">Informes IPM Registrados</h1>
  
          <!-- Botón para crear nuevo informe -->
          <div class="mb-4 text-end">
            <button @click="redirigirCrearInforme" class="btn btn-primary py-2 px-4">
              <i class="bi bi-plus-circle"></i> Crear Nuevo Informe
            </button>
          </div>
  
          <!-- Tabla de Informes IPM -->
          <div>
            <table class="table table-striped table-hover align-middle">
              <thead class="table-primary text-center">
                <tr>
                  <th>#</th>
                  <th>Número de Factura</th>
                  <th>Frecuencia</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(informe, index) in informes" :key="informe.id" class="text-center">
                  <td>{{ index + 1 }}</td>
                  <td>{{ informe.numFactura }}</td>
                  <td>{{ informe.frecuencia }}</td>
                  <td>{{ informe.precio }}</td>
                  <td>
                    <div class="d-flex gap-2 justify-content-center">
                      <button class="btn btn-outline-primary btn-sm" @click="generatePDF(informe)">
                        <i class="bi bi-file-earmark-pdf"></i>
                      </button>
                      <button class="btn btn-outline-success btn-sm" @click="redirigirFormularioIPM(informe.id)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-outline-info btn-sm" @click="generatePDFFormularioIPM(informe)">
                        <i class="bi bi-journal"></i>
                      </button>
                      <button class="btn btn-outline-warning btn-sm" @click="generatePDFCompleto(informe)">
                        <i class="bi bi-file-earmark-text"></i>
                      </button>
                      <button class="btn btn-outline-success btn-sm" @click="verInforme(informe.id)">
                        <i class="bi bi-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
</template>

<script>
import {
    consultarInformeFachada,
    consultarInformePorIdFachada,
} from "../helpers/InformeHelper";
import router from "@/router";
import { generatePDFInformeFachada } from "../helpers/generarInforme";
import { generateFormularioIPMFachada } from "../helpers/generarInformeIPM";
import { generateFormularioCompletoFachada } from "../helpers/generarInformeUnido";

export default {
    name: "InformeIpm",
    data() {
        return {
            informes: [],
        };
    },
    mounted() {
        this.cargarInformes();
    },
    methods: {
        redirigirCrearInforme() {
            this.$router.push('/informe_registrar');
        },
        async cargarInformes() {
            try {
                this.informes = await consultarInformeFachada();
            } catch (error) {
                console.error("Error al cargar los informes IPM:", error);
            }
        },
        async redirigirFormularioIPM(id) {
            const ruta = `/desratizacion/${id}`;
            await router.push({ path: ruta });
        },
        async generatePDF(informe) {
            const informeId = await consultarInformePorIdFachada(informe.id);
            await generatePDFInformeFachada(informeId);
        },
        async generatePDFFormularioIPM(informe) {
            const informeId = await consultarInformePorIdFachada(informe.id);
            await generateFormularioIPMFachada(informeId);
        },
        async generatePDFCompleto(informe) {
            const informeId = await consultarInformePorIdFachada(informe.id);
            await generateFormularioCompletoFachada(informeId);
        },
        async verInforme(id) {
            const ruta = `/informe_ver/${id}`;
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
}

.card {
  border: 3px solid transparent;
  border-image: linear-gradient(to right, #004080, #a9c4f5);
  border-image-slice: 1;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.8);
}

h1 {
  font-weight: 700;
  color: #031425;
}

.table {
  margin-top: 1rem;
  border-collapse: collapse;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #003060;
}

@media (max-width: 768px) {
  .card {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .table th, .table td {
    font-size: 0.85rem;
  }
}
</style>
