<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
        <!-- Contenido Principal -->
        <main class="flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="card p-5 shadow-lg" style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
                <h1 class="text-center text-primary mb-4">Gestión de Proveedores</h1>

                <!-- Botón para crear nuevo proveedor -->
                <div class="mb-4 text-end">
                    <button @click="redirigirCrearProveedor" class="btn btn-primary py-2 px-4">
                        <i class="bi bi-plus-circle"></i> Crear Nuevo Proveedor
                    </button>
                </div>

                <!-- Tabla de Proveedores -->
                <div>
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-primary text-center">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Dirección</th>
                                <th>Número de Cuenta</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(proveedor, index) in proveedores" :key="proveedor.id" class="text-center">
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
                        </tbody>
                    </table>
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
            proveedores: []
        };
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
                alert('Proveedor eliminado con éxito');
                this.cargarProveedores();
            } catch (error) {
                console.error('Error al eliminar el proveedor:', error);
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
