<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh">
    <!-- Contenido Principal -->
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg" style="
          max-width: 1200px;
          width: 100%;
          border-radius: 15px;
          background-color: rgba(255, 255, 255, 0.9);
          border: 3px solid transparent;
          border-image: linear-gradient(to right, #004080, #a9c4f5);
          border-image-slice: 1;
        ">
        <h1 class="text-center text-primary mb-4">Informes IPM Registrados</h1>

        <!-- Botón para crear nuevo informe -->
        <div class="mb-4 d-flex justify-content-between align-items-center">
          <input v-model="filtro" type="text" class="form-control w-50"
            placeholder="Buscar por número de informe o cliente" />
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
              <tr v-for="(informe, index) in informesPaginados" :key="informe.id" class="text-center">
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
                    <button class="btn btn-outline-success btn-sm" @click="abrirModal(informe.id)">
                      <i class="bi bi-images"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="informesFiltrados.length === 0">
                <td colspan="5" class="text-center">No se encontraron resultados</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-center mt-4">
          <button :disabled="paginaActual === 1" @click="cambiarPagina(paginaActual - 1)"
            class="btn btn-outline-primary">
            Anterior
          </button>
          <span class="mx-3">{{ paginaActual }} / {{ totalPaginas }}</span>
          <button :disabled="paginaActual === totalPaginas" @click="cambiarPagina(paginaActual + 1)"
            class="btn btn-outline-primary">
            Siguiente
          </button>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal d-block" tabindex="-1" role="dialog"
      style="background-color: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Subir Fotos</h5>
            <button type="button" class="btn-close" @click="cerrarModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Selecciona una foto para el informe seleccionado.</p>
            <input type="file" @change="manejarArchivo" accept="image/*" multiple />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModal">
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="guardarFotos">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
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
import { guardarFotosFachada } from "../helpers/fotosHelper";
import { generateFotosPDFData } from "../helpers/formatoFotos";

export default {
  name: "InformeIpm",
  data() {
    return {
      informes: [],
      isModalOpen: false,
      archivos: [],
      informeSeleccionado: null,
      filtro: "",
      paginaActual: 1,
      informesPorPagina: 5,
      columnaOrdenada: null,
      ordenAscendente: true,
    };
  },
  computed: {
    informesFiltrados() {
      const filtroMinusculas = this.filtro.toLowerCase();
      return this.informes.filter(
        (informe) =>
          informe.numFactura.toLowerCase().includes(filtroMinusculas) ||
          informe.frecuencia.toLowerCase().includes(filtroMinusculas)
      );
    },
    informesPaginados() {
      // Ordenar los proveedores filtrados
      const informesOrdenados = [...this.informesFiltrados].sort((a, b) => {
        const valorA = a[this.columnaOrdenada];
        const valorB = b[this.columnaOrdenada];

        if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
        if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
        return 0;
      });

      // Paginado: devuelve los proveedores correspondientes a la página actual
      const inicio = (this.paginaActual - 1) * this.informesPorPagina;
      const fin = inicio + this.informesPorPagina;
      return informesOrdenados.slice(inicio, fin);
    },
    totalPaginas() {
      return Math.ceil(this.informesFiltrados.length / this.informesPorPagina);
    }
  },
  mounted() {
    this.cargarInformes();
  },
  methods: {
    cambiarPagina(nuevaPagina) {
      if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
        this.paginaActual = nuevaPagina;
      }
    },
    redirigirCrearInforme() {
      this.$router.push("/informe_registrar");
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
    abrirModal(id) {
      this.informeSeleccionado = id;
      this.isModalOpen = true;
    },
    manejarArchivo(event) {
      this.archivos = Array.from(event.target.files); // Convertimos FileList a un array
    },
    async guardarFotos() {
      if (!this.archivos.length) {
        alert("Por favor, selecciona al menos una foto.");
        return;
      }

      const formData = new FormData();
      formData.append("id", this.informeSeleccionado); // ID del informe
      this.archivos.forEach((archivo) => {
        formData.append("fotos", archivo); // El campo debe coincidir con el nombre esperado en el backend
      });

      try {
        await guardarFotosFachada(formData); // enviar `formData` al backend
        this.cerrarModal();
      } catch (error) {
        console.error("Error al guardar las fotos:", error);
      }
    },
    cerrarModal() {
      this.isModalOpen = false;
      this.archivos = []; // Limpiamos los archivos seleccionados
      this.informeSeleccionado = null;
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

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #003060;
}

.modal {
  display: block !important;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border-radius: 10px;
}

@media (max-width: 768px) {
  .card {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .table th,
  .table td {
    font-size: 0.85rem;
  }
}
</style>
