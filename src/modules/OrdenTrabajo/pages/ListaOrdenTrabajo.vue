<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh;">
    <!-- Contenido Principal -->
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg"
        style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
        <h1 class="text-center text-primary mb-4">Gestión de Órdenes de Trabajo</h1>

        <!-- Campo de búsqueda -->
        <div class="mb-4 d-flex justify-content-between align-items-center">
          <input v-model="filtro" type="text" class="form-control w-50"
            placeholder="Buscar por número de orden, área, estado...">
          <button @click="redirigirCrearOrden" class="btn btn-primary py-2 px-4">
            <i class="bi bi-plus-circle"></i> Crear Nueva Orden de Trabajo
          </button>
        </div>

        <!-- Tabla de Órdenes de Trabajo -->
        <div>
          <table class="table table-striped table-hover align-middle">
            <thead class="table-primary text-center">
              <tr>
                <th @click="ordenar('id')" :class="{'highlighted': columnaOrdenada === 'id'}">#</th>
                <th @click="ordenar('fecha')" :class="{'highlighted': columnaOrdenada === 'fecha'}">Fecha</th>
                <th @click="ordenar('hora')" :class="{'highlighted': columnaOrdenada === 'hora'}">Hora</th>
                <th @click="ordenar('numeroOrden')" :class="{'highlighted': columnaOrdenada === 'numeroOrden'}">Número de Orden</th>
                <th @click="ordenar('descripcion')" :class="{'highlighted': columnaOrdenada === 'descripcion'}">Descripción</th>
                <th @click="ordenar('area')" :class="{'highlighted': columnaOrdenada === 'area'}">Área</th>
                <th @click="ordenar('estado')" :class="{'highlighted': columnaOrdenada === 'estado'}">Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(orden, index) in ordenesPaginadas" :key="orden.id" class="text-center">
                <td>{{ index + 1 }}</td>
                <td>{{ orden.fecha }}</td>
                <td>{{ orden.hora }}</td>
                <td>{{ orden.numeroOrden }}</td>
                <td>{{ orden.descripcion }}</td>
                <td>{{ orden.area }}</td>
                <td>
                  <span v-if="orden.estado === 'confirmado'" class="badge bg-success">
                    <i class="bi bi-check-circle"></i> Confirmado
                  </span>
                  <span v-else-if="orden.estado === 'cancelado'" class="badge bg-danger">
                    <i class="bi bi-x-circle"></i> Cancelado
                  </span>
                  <span v-else-if="orden.estado === 'pendiente'" class="badge bg-warning text-dark">
                    <i class="bi bi-exclamation-circle"></i> Pendiente
                  </span>
                  <span v-else class="badge bg-warning text-dark">
                    <i class="bi bi-x-circle"></i> Sin estado
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-outline-success btn-sm" @click="verOrden(orden.id)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-primary btn-sm" @click="generatePDF(orden)">
                      <i class="bi bi-file-earmark-pdf"></i>
                    </button>
                    <button class="btn btn-outline-success btn-sm" @click="updateEstado(orden.id, 'confirmado', orden)">
                      <i class="bi bi-check"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="updateEstado(orden.id, 'cancelado', orden)">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="d-flex justify-content-center mt-4">
          <button :disabled="paginaActual === 1" @click="cambiarPagina(paginaActual - 1)" class="btn btn-outline-primary">
            Anterior
          </button>
          <span class="mx-3">{{ paginaActual }} / {{ totalPaginas }}</span>
          <button :disabled="paginaActual === totalPaginas" @click="cambiarPagina(paginaActual + 1)" class="btn btn-outline-primary">
            Siguiente
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import { generatePDFOrdenFachada } from '../helpers/generarOrdenPdf';
import { actualizarOrdenEstadoFachada, buscarOrdenPorId, consultarOrdenFachada } from '../helpers/OrdenTrabajoHelper';
import router from "@/router";

export default {
  name: "OrdenTrabajo",
  data() {
    return {
      ordenesTrabajo: [],
      filtro: "",
      paginaActual: 1,
      ordenesPorPagina: 5, // Número de órdenes por página
      columnaOrdenada: null, // Inicialmente no hay ninguna columna ordenada
      ordenAscendente: true, // Orden ascendente o descendente
    };
  },
  computed: {
    ordenesFiltradas() {
      const filtroLower = this.filtro.toLowerCase();
      return this.ordenesTrabajo.filter((orden) => {
        return (
          String(orden.numeroOrden ?? "").toLowerCase().includes(filtroLower) || 
          (orden.area ?? "").toLowerCase().includes(filtroLower) || 
          (orden.estado ?? "").toLowerCase().includes(filtroLower) 
        );
      });
    },
    ordenesPaginadas() {
      const ordenesOrdenadas = [...this.ordenesFiltradas].sort((a, b) => {
        const valorA = a[this.columnaOrdenada];
        const valorB = b[this.columnaOrdenada];
        
        if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
        if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
        return 0;
      });

      const inicio = (this.paginaActual - 1) * this.ordenesPorPagina;
      const fin = inicio + this.ordenesPorPagina;
      return ordenesOrdenadas.slice(inicio, fin);
    },
    totalPaginas() {
      return Math.ceil(this.ordenesFiltradas.length / this.ordenesPorPagina);
    }
  },
  mounted() {
    this.cargarOrdenesTrabajo();
  },
  methods: {
    async cargarOrdenesTrabajo() {
      try {
        this.ordenesTrabajo = await consultarOrdenFachada();
      } catch (error) {
        console.error("Error al cargar las órdenes de trabajo:", error);
      }
    },
    async redirigirCrearOrden() {
      const ruta = `/orden_trabajo_registro`;
      await router.push({ path: ruta });
    },
    async verOrden(id) {
      const ruta = `/orden_trabajo_ver/${id}`;
      await router.push({ path: ruta });
    },
    async generatePDF(ordenTrabajo) {
      const orden = await buscarOrdenPorId(ordenTrabajo.id);
      console.log(orden);
      await generatePDFOrdenFachada(orden);
    },
    async updateEstado(id, param, orden) {
      const estado = {
        estado: param,
      };
      await actualizarOrdenEstadoFachada(id, estado);
      orden.estado = param;
    },
    ordenar(columna) {
      if (this.columnaOrdenada === columna) {
        this.ordenAscendente = !this.ordenAscendente;
      } else {
        this.columnaOrdenada = columna;
        this.ordenAscendente = true;
      }
    },
    cambiarPagina(nuevaPagina) {
      if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
        this.paginaActual = nuevaPagina;
      }
    }
  }
};
</script>

<style scoped>
/* El estilo sigue igual que el original */
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

.badge {
  font-size: 0.9rem;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #003060;
}

/* Responsividad */
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

/* Estilo para el encabezado resaltado */
th.highlighted {
  background-color: #004080;
  color: white;
  border: 2px solid #a9c4f5;
}
</style>
