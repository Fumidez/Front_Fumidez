<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
      <!-- Contenido Principal -->
      <main class="flex-grow-1 d-flex align-items-center justify-content-center">
        <div class="card p-5 shadow-lg"
          style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
          <h1 class="text-center text-primary mb-4">Gestión de Usuarios</h1>
  
          <!-- Botón para crear nueva orden -->
          <div class="mb-4 text-end">
            <button @click="redirigirCrearUsuario" class="btn btn-primary py-2 px-4">
              <i class="bi bi-plus-circle"></i> Crear Nuevo Usuario
            </button>
          </div>
  
          <!-- Tabla de Órdenes de Trabajo -->
          <div>
            <table class="table table-striped table-hover align-middle">
              <thead class="table-primary text-center">
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Correo</th>
                  <th>N.Cuenta</th>
                  <th>Ruc</th>
                  <th>Dirección</th>
                  <th>Telefono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(usuario, index) in usuarios" :key="usuario.id" class="text-center">
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

import router from "@/router";
import { consultarUsuarioFachada } from "../helpers/UsuarioHelper";

export default {
    name: "Usuario",
    data() {
        return {
            usuarios: []
        };
    },
    mounted() {
        this.cargarUsuarios();
    },
    methods: {
        async cargarUsuarios() {
            try {
                this.usuarios = await consultarUsuarioFachada();
                console.log(this.usuarios);
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