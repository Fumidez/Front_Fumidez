<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh;">
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg"
        style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
        <h1 class="text-center text-primary mb-4">Gestión de Usuarios</h1>

        <div class="mb-4 text-end">
          <button @click="redirigirCrearUsuario" class="btn btn-primary py-2 px-4">
            <i class="bi bi-plus-circle"></i> Crear Nuevo Usuario
          </button>
        </div>
        <div class="mb-3">
          <input v-model="filtro" type="text" class="form-control" placeholder="Buscar por nombre, rol o correo" />
        </div>

        <!-- Tabla de Usuarios -->
        <div>
          <table class="table table-striped table-hover align-middle">
            <thead class="table-primary text-center">
              <tr>
                <th @click="ordenar('id')" :class="{ 'highlighted': columnaOrdenada === 'id' }">#</th>
                <th @click="ordenar('nombre')" :class="{ 'highlighted': columnaOrdenada === 'nombre' }">Nombre</th>
                <th @click="ordenar('tipo')" :class="{ 'highlighted': columnaOrdenada === 'tipo' }">Rol</th>
                <th @click="ordenar('correo')" :class="{ 'highlighted': columnaOrdenada === 'correo' }">Correo</th>
                <th @click="ordenar('ncuenta')" :class="{ 'highlighted': columnaOrdenada === 'ncuenta' }">N.Cuenta</th>
                <th @click="ordenar('ruc')" :class="{ 'highlighted': columnaOrdenada === 'ruc' }">Ruc</th>
                <th @click="ordenar('direccion')" :class="{ 'highlighted': columnaOrdenada === 'direccion' }">Dirección
                </th>
                <th @click="ordenar('telefono')" :class="{ 'highlighted': columnaOrdenada === 'telefono' }">Telefono
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(usuario, index) in usuariosPaginados" :key="usuario.id" class="text-center">
                <td>{{ index + 1 }}</td>
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.tipo }}</td>
                <td>{{ usuario.correo }}</td>
                <td>{{ usuario.ncuenta }}</td>
                <td>{{ usuario.ruc }}</td>
                <td>{{ usuario.direccion }}</td>
                <td>{{ usuario.telefono }}</td>
                <td>
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-outline-success btn-sm" @click="verUsuario(usuario.id)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="eliminarUsuario(usuario.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="usuariosFiltrados.length === 0">
                <td colspan="9" class="text-center">No se encontraron resultados</td>
              </tr>
            </tbody>
          </table>
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
import router from "@/router";
import { consultarUsuarioFachada, eliminarUsuarioFachada } from "../helpers/UsuarioHelper";

export default {
  name: "Usuario",
  data() {
    return {
      usuarios: [],
      filtro: "",
      paginaActual: 1,
      usuariosPorPagina: 5, // Número de usuarios por página
      columnaOrdenada: null, // Inicialmente no hay ninguna columna ordenada
      ordenAscendente: true, // Orden ascendente o descendente
      mensajeConfirmacion: "", // Mensaje de confirmación para el usuario
    };
  },
  computed: {
    usuariosFiltrados() {
      const filtroMinusculas = this.filtro.toLowerCase();
      return this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(filtroMinusculas) ||
        usuario.tipo.toLowerCase().includes(filtroMinusculas) ||
        usuario.correo.toLowerCase().includes(filtroMinusculas)
      );
    },
    usuariosPaginados() {
      // Ordenar los usuarios filtrados
      const usuariosOrdenados = [...this.usuariosFiltrados].sort((a, b) => {
        const valorA = a[this.columnaOrdenada];
        const valorB = b[this.columnaOrdenada];

        if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
        if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
        return 0;
      });

      // Paginado: devuelve los usuarios correspondientes a la página actual
      const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
      const fin = inicio + this.usuariosPorPagina;
      return usuariosOrdenados.slice(inicio, fin);
    },
    totalPaginas() {
      return Math.ceil(this.usuariosFiltrados.length / this.usuariosPorPagina);
    }
  },
  mounted() {
    this.cargarUsuarios();
  },
  methods: {
    async cargarUsuarios() {
      try {
        this.usuarios = await consultarUsuarioFachada();
      } catch (error) {
        console.error('Error al cargar los Usuarios:', error);
      }
    },
    async redirigirCrearUsuario() {
      const ruta = `/usuario_registro`;
      await router.push({ path: ruta });
    },
    async verUsuario(id) {
      const ruta = `/usuario_ver/${id}`;
      await router.push({ path: ruta });
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
    },
    mostrarMensajeConfirmacion(mensaje) {
      this.mensajeConfirmacion = mensaje;
      setTimeout(() => {
        this.mostrarMensajeConfirmacion = ""; // Limpia el mensaje después de 3 segundos
      }, 3000); // Duración en milisegundos
    },
    async eliminarUsuario(id) {
      try {
        await eliminarUsuarioFachada(id);
        this.mensajeConfirmacion = 'Usuario eliminado con exito';
        this.cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    },
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

.table th,
.table td {
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

  .table th,
  .table td {
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
