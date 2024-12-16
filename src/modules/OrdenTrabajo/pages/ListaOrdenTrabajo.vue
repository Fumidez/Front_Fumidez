<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
      <!-- Contenido Principal -->
      <main class="flex-grow-1 d-flex align-items-center justify-content-center">
        <div class="card p-5 shadow-lg"
          style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
          <h1 class="text-center text-primary mb-4">Gestión de Órdenes de Trabajo</h1>
  
          <!-- Botón para crear nueva orden -->
          <div class="mb-4 text-end">
            <button @click="redirigirCrearOrden" class="btn btn-primary py-2 px-4">
              <i class="bi bi-plus-circle"></i> Crear Nueva Orden de Trabajo
            </button>
          </div>
  
          <!-- Tabla de Órdenes de Trabajo -->
          <div>
            <table class="table table-striped table-hover align-middle">
              <thead class="table-primary text-center">
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Número de Orden</th>
                  <th>Descripción</th>
                  <th>Área</th>
                  <th>Servicios</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(orden, index) in ordenesTrabajo" :key="orden.id" class="text-center">
                  <td>{{ index + 1 }}</td>
                  <td>{{ orden.fecha }}</td>
                  <td>{{ orden.hora }}</td>
                  <td>{{ orden.numeroOrden }}</td>
                  <td>{{ orden.descripcion }}</td>
                  <td>{{ orden.area }}</td>
                  <td>
                    <ul class="list-unstyled mb-0">
                      <li v-for="servicio in orden.servicios" :key="servicio.id">
                        {{ servicio.tipoServicio }}
                      </li>
                    </ul>
                  </td>
                  <td>
                    <span v-if="orden.estado === 'confirmado'" class="badge bg-success">
                      <i class="bi bi-check-circle"></i> Aprobado
                    </span>
                    <span v-else-if="orden.estado === 'cancelado'" class="badge bg-danger">
                      <i class="bi bi-x-circle"></i> Cancelado
                    </span>
                    <span v-else class="badge bg-warning text-dark">
                      <i class="bi bi-exclamation-circle"></i> Pendiente
                    </span>
                  </td>
                  <td>
                    <div class="d-flex gap-2 justify-content-center">
                      <button class="btn btn-outline-primary btn-sm" @click="generatePDF(orden)">
                        <i class="bi bi-file-earmark-pdf"></i>
                      </button>
                      <button class="btn btn-outline-success btn-sm" @click="updateEstado(orden.id, 'confirmado')">
                        <i class="bi bi-check"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm" @click="updateEstado(orden.id, 'cancelado')">
                        <i class="bi bi-x"></i>
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
import { generatePDFOrdenFachada } from '../helpers/generarOrdenPdf';
import { actualizarOrdenEstadoFachada, actualizarOrdenFachada, buscarOrdenPorId, consultarOrdenFachada } from '../helpers/OrdenTrabajoHelper';

export default {
    name: "OrdenTrabajo",
    data() {
        return {
            ordenesTrabajo: []
        };
    },
    mounted() {
        this.cargarOrdenesTrabajo();
    },
    methods: {
        async cargarOrdenesTrabajo() {
            try {
                this.ordenesTrabajo = await consultarOrdenFachada();
            } catch (error) {
                console.error('Error al cargar las órdenes de trabajo:', error);
            }
        },
        redirigirCrearOrden() {
            this.$router.push('/orden_trabajo_registro');
        },
        async generatePDF(ordenTrabajo) {
            const orden = await buscarOrdenPorId(ordenTrabajo.id);
            console.log(orden);
            await generatePDFOrdenFachada(orden);
        },

        async updateEstado(id, param) {
            const estado = {
                estado: param
            }
            const data = await actualizarOrdenEstadoFachada(id, estado);
        }


    }
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
</style>