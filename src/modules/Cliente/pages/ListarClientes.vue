<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
        <!-- Contenido Principal -->
        <main class="flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="card p-5 shadow-lg" style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
                <h1 class="text-center text-primary mb-4">Gestión de Clientes</h1>

                <!-- Botón para crear nuevo proveedor -->
                <div class="mb-4 text-end">
                    <button @click="redirigirCrearCliente" class="btn btn-primary py-2 px-4">
                        <i class="bi bi-plus-circle"></i> Crear Nuevo Cliente
                    </button>
                </div>

                <!-- Tabla de Proveedores -->
                <div>
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-primary text-center">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Direccion</th>
                                <th>Telefono</th>
                                <th>RUC</th>
                                <th>Persona Encargada</th>
                                <th>Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(cliente, index) in clientes" :key="cliente.id" class="text-center">
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
  import { consultarClienteFachada, crearClienteFachada } from '../helpers/ClienteHelper';
  import router from '@/router';
  
  export default {
    name: "IngresarCliente",
    data() {
        return {
            clientes: []
        };
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
  </style>
  