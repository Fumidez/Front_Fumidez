<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh;">
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg"
        style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
        <h1 class="text-center text-primary mb-4">Gestión de Proveedores</h1>

        <!-- Botón para crear nuevo proveedor -->
        <div class="mb-4 d-flex justify-content-between align-items-center">
          <input v-model="filtro" type="text" class="form-control w-50"
            placeholder="Buscar por nombre, dirección o cuenta">
          <button @click="redirigirCrearProveedor" class="btn btn-primary py-2 px-4">
            <i class="bi bi-plus-circle"></i> Crear Nuevo Proveedor
          </button>
        </div>

        <!-- Tabla de Proveedores -->
        <div>
          <table class="table table-striped table-hover align-middle">
            <thead class="table-primary text-center">
              <tr>
                <th @click="ordenar('id')" :class="{ 'highlighted': columnaOrdenada === 'id' }">#</th>
                <th @click="ordenar('nombre')" :class="{ 'highlighted': columnaOrdenada === 'nombre' }">Nombre</th>
                <th @click="ordenar('direccion')" :class="{ 'highlighted': columnaOrdenada === 'direccion' }">Dirección
                </th>
                <th @click="ordenar('n_cuenta')" :class="{ 'highlighted': columnaOrdenada === 'n_cuenta' }">N° Cuenta
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(proveedor, index) in proveedoresPaginados" :key="proveedor.id" class="text-center">
                <td>{{ index + 1 }}</td>
                <td>{{ proveedor.nombre }}</td>
                <td>{{ proveedor.direccion }}</td>
                <td>{{ proveedor.n_cuenta }}</td>
                <td>
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-outline-success btn-sm" @click="editarProveedor(proveedor.id)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="eliminarProveedor(proveedor.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="proveedoresFiltrados.length === 0">
                <td colspan="5" class="text-center">No se encontraron resultados</td>
              </tr>
            </tbody>
          </table>

        </div>
        <div v-if="mensajeExito" class="alert alert-danger text-center mt-3">
          {{ mensajeExito }}
        </div>
        <!-- Paginación -->
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
  </div>
</template>

<script>
import {
  crearProveedorFachada,
  obtenerTodosLosProveedorsFachada,
  eliminarProveedorFachada
} from '../helpers/proveedoresHelpers';
import router from "@/router";

export default {
  name: "ListarProveedor",
  data() {
    return {
      mensajeExito: "",
      proveedores: [],
      filtro: "",
      paginaActual: 1,
      proveedoresPorPagina: 5,
      columnaOrdenada: null,
      ordenAscendente: true,
    };
  },
  computed: {
    proveedoresFiltrados() {
      const filtroMinusculas = this.filtro.toLowerCase();
      return this.proveedores.filter(proveedor =>
        proveedor.nombre.toLowerCase().includes(filtroMinusculas) ||
        proveedor.direccion.toLowerCase().includes(filtroMinusculas) ||
        proveedor.n_cuenta.toLowerCase().includes(filtroMinusculas)
      );
    },
    proveedoresPaginados() {
      // Ordenar los proveedores filtrados
      const proveedoresOrdenados = [...this.proveedoresFiltrados].sort((a, b) => {
        const valorA = a[this.columnaOrdenada];
        const valorB = b[this.columnaOrdenada];

        if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
        if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
        return 0;
      });

      // Paginado: devuelve los proveedores correspondientes a la página actual
      const inicio = (this.paginaActual - 1) * this.proveedoresPorPagina;
      const fin = inicio + this.proveedoresPorPagina;
      return proveedoresOrdenados.slice(inicio, fin);
    },
    totalPaginas() {
      return Math.ceil(this.proveedoresFiltrados.length / this.proveedoresPorPagina);
    }
  },
  mounted() {
    this.cargarProveedores();
  },
  methods: {
    async cargarProveedores() {
      try {
        this.proveedores = await obtenerTodosLosProveedorsFachada();
      } catch (error) {
        console.error('Error al cargar los proveedores:', error);
      }
    },
    async redirigirCrearProveedor() {
      const ruta = '/proveedor_registrar';
      await router.push({ path: ruta });
    },
    async editarProveedor(id) {
      const ruta = `/proveedor_ver/${id}`;
      await router.push({ path: ruta });
    },
    async eliminarProveedor(id) {
      try {
        await eliminarProveedorFachada(id);
        this.mensajeExito = "El proveedor ha sido eliminado con exito";
        this.cargarProveedores();
        setTimeout(() => {
          this.mensajeExito = "";
        }, 5000);
      } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
      }
    },
    ordenar(columna) {
      // Si la columna es la misma que la actual, cambiar el orden
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

/* Estilo para el encabezado resaltado */
th.highlighted {
  background-color: #004080;
  color: white;
  border: 2px solid #a9c4f5;
}

  .alert {
    padding: 12px;
    margin-top: 20px;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
  }

  /* Cambia el fondo a rojo */
  .alert-danger {
    background-color: #dc3545;
    color: white;
  }
/* Responsividad */
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
