<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh;">
    <!-- Contenido Principal -->
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg" style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
        <h1 class="text-center text-primary mb-4">Gestión de Clientes</h1>

        <!-- Botón para crear nuevo cliente -->
        <div class="mb-4 text-end">
          <button @click="redirigirCrearCliente" class="btn btn-primary py-2 px-4">
            <i class="bi bi-plus-circle"></i> Crear Nuevo Cliente
          </button>
        </div>

        <!-- Filtro de búsqueda -->
        <div class="mb-3">
          <input
            v-model="filtro"
            type="text"
            class="form-control"
            placeholder="Buscar por nombre, correo, RUC"
          />
        </div>

        <!-- Tabla de Clientes -->
        <div>
          <table class="table table-striped table-hover align-middle">
            <thead class="table-primary text-center">
              <tr>
                <th @click="ordenar('id')" :class="{'highlighted': columnaOrdenada === 'id'}">#</th>
                <th @click="ordenar('nombre')" :class="{'highlighted': columnaOrdenada === 'nombre'}">Nombre</th>
                <th @click="ordenar('correo')" :class="{'highlighted': columnaOrdenada === 'correo'}">Correo</th>
                <th @click="ordenar('direccion')" :class="{'highlighted': columnaOrdenada === 'direccion'}">Dirección</th>
                <th @click="ordenar('telefono')" :class="{'highlighted': columnaOrdenada === 'telefono'}">Telefono</th>
                <th @click="ordenar('ruc')" :class="{'highlighted': columnaOrdenada === 'ruc'}">RUC</th>
                <th @click="ordenar('personaEncargada')" :class="{'highlighted': columnaOrdenada === 'personaEncargada'}">Persona Encargada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cliente, index) in clientesPaginados" :key="cliente.id" class="text-center">
                <td>{{ index + 1 }}</td>
                <td>{{ cliente.nombre }}</td>
                <td>{{ cliente.correo }}</td>
                <td>{{ cliente.direccion }}</td>
                <td>{{ cliente.telefono }}</td>
                <td>{{ cliente.ruc }}</td>
                <td>{{ cliente.personaEncargada }}</td>
                <td>
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-outline-success btn-sm" @click="editarCiente(cliente.id)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="eliminarCliente(cliente.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="clientesFiltrados.length === 0">
                <td colspan="8" class="text-center">No se encontraron resultados</td>
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
import { consultarClienteFachada } from '../helpers/ClienteHelper';
import router from '@/router';

export default {
  name: "IngresarCliente",
  data() {
    return {
      clientes: [],
      filtro: "",
      paginaActual: 1,
      clientesPorPagina: 5,
      columnaOrdenada: null,
      ordenAscendente: true,
    };
  },
  computed: {
    clientesFiltrados() {
      const filtroMinusculas = this.filtro.toLowerCase();
      return this.clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(filtroMinusculas) ||
        cliente.correo.toLowerCase().includes(filtroMinusculas) ||
        cliente.ruc.toLowerCase().includes(filtroMinusculas)
      );
    },
    clientesPaginados() {
      // Ordenar los clientes filtrados
      const clientesOrdenados = [...this.clientesFiltrados].sort((a, b) => {
        const valorA = a[this.columnaOrdenada];
        const valorB = b[this.columnaOrdenada];
        
        if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
        if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
        return 0;
      });

      // Paginado: devuelve los clientes correspondientes a la página actual
      const inicio = (this.paginaActual - 1) * this.clientesPorPagina;
      const fin = inicio + this.clientesPorPagina;
      return clientesOrdenados.slice(inicio, fin);
    },
    totalPaginas() {
      return Math.ceil(this.clientesFiltrados.length / this.clientesPorPagina);
    }
  },
  mounted() {
    this.cargarClientes();
  },
  methods: {
    async cargarClientes() {
      try {
        this.clientes = await consultarClienteFachada();
      } catch (error) {
        console.error('Error al cargar los clientes:', error);
      }
    },
    async redirigirCrearCliente() {
      const ruta = '/cliente_registrar';
      await router.push({ path: ruta });
    },
    async editarCiente(id) {
      const ruta = `/cliente_ver/${id}`;
      await router.push({ path: ruta });
    },
    async eliminarCliente(id) {
      try {
        await eliminarProveedorFachada(id);
        alert('Cliente eliminado con éxito');
        this.cargarClientes();
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
      }
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
  min-height: 100vh;
}

.card {
  border: 3px solid transparent;
  border-image: linear-gradient(to right, #004080, #a9c4f5);
  border-image-slice: 1;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.9);
}

h1 {
  font-weight: 700;
  font-size: 1.8rem;
  color: #031425;
}

button {
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #003060;
}

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

@media (min-width: 1200px) {
  .card {
    max-width: 600px;
  }
}

/* Estilo para el encabezado resaltado */
th.highlighted {
  background-color: #004080;
  color: white;
  border: 2px solid #a9c4f5;
}
</style>
