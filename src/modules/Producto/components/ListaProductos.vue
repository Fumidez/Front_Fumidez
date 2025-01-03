<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
        <!-- Contenido Principal -->
        <main class="flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="card p-5 shadow-lg"
                style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
                <h1 class="text-center text-primary mb-4">Gestión de Productos</h1>

                <!-- Botón para agregar nuevo producto -->
                <div class="mb-4 text-end">
                    <button @click="redirigirCrearProducto" class="btn btn-primary py-2 px-4">
                        <i class="bi bi-plus-circle"></i> Crear Nuevo Producto
                    </button>
                </div>

                <!-- Tabla de Productos -->
                <div>
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-primary text-center">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Proveedor</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(producto, index) in productos" :key="producto.id" class="text-center">
                                <td>{{ index + 1 }}</td>
                                <td>{{ producto.nombre }}</td>
                                <td>{{ producto.cantidad }}</td>
                                <td>{{ producto.precio }}</td>
                                <td>{{ obtenerNombreProveedor(producto.idProveedor) }}</td>
                                <td>
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button class="btn btn-outline-success btn-sm"
                                            @click="cambiarCampos(producto.id)">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-outline-success btn-sm" @click="verProducto(producto.id)">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                        <button class="btn btn-outline-danger btn-sm" @click="eliminar(producto.id)">
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
import { obtenerTodosLosProveedorsFachada } from '../../Proveedor/helpers/proveedoresHelpers';
import router from "@/router";

import {
    crearProductoFachada,
    obtenerTodosLosProductosFachada,
    eliminarProductoFachada,
    obtenerProductoFachada
} from '../helpers/productosHelpers';

export default {
    name: "ListarProducto",
    data() {
        return {
            producto: {
                id: null,
                nombre: "",
                cantidad: null,
                precio: null,
                idProveedor: null
            },
            productos: [],
            proveedores: []
        };
    },
    methods: {
        async buscarProductos() {
            try {
                const response = await obtenerTodosLosProductosFachada();
                this.productos = response;
            } catch (error) {
                console.error("Error al buscar productos:", error);
            }
        },
        async eliminar(id) {
            try {
                await eliminarProductoFachada(id);
                alert("Producto eliminado");
                this.buscarProductos();
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
            }
        },
        async cambiarCampos(id) {
            try {
                const productoData = await obtenerProductoFachada(id);
                this.producto = productoData;
            } catch (error) {
                console.error("Error al cargar los datos del producto:", error);
            }
        },
        obtenerNombreProveedor(idProveedor) {
            const proveedor = this.proveedores.find(p => p.id === idProveedor);
            return proveedor ? proveedor.nombre : "Desconocido";
        },
        async cargarProveedores() {
            try {
                const response = await obtenerTodosLosProveedorsFachada();
                this.proveedores = response;
            } catch (error) {
                console.error("Error al buscar proveedores:", error);
            }
        },
        async redirigirCrearProducto() {
            const ruta = `/producto_registro`;
            await router.push({ path: ruta });
        },
        async verProducto(id) {
            const ruta = `/producto_ver/${id}`;
            await router.push({ path: ruta });
        },
    },
    mounted() {
        this.buscarProductos();
        this.cargarProveedores();
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
</style>