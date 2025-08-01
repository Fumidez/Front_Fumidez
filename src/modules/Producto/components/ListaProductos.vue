<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
        <!-- Contenido Principal -->
        <main class="flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="card p-5 shadow-lg"
                style="max-width: 1200px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
                <h1 class="text-center text-primary mb-4">Gestión de Productos</h1>

                <!-- Botón para agregar nuevo producto -->
                <div class="mb-4 d-flex justify-content-between align-items-center">
                    <input v-model="filtro" type="text" class="form-control w-50"
                        placeholder="Buscar por nombre o proveedor">
                    <button @click="redirigirCrearProducto" class="btn btn-primary py-2 px-4">
                        <i class="bi bi-plus-circle"></i> Crear Nuevo Producto
                    </button>
                </div>
                <!-- Tabla de Productos -->
                <div>
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-primary text-center">
                            <tr>
                                <th @click="ordenar('id')" :class="{ 'highlighted': columnaOrdenada === 'id' }">#</th>
                                <th @click="ordenar('nombre')" :class="{ 'highlighted': columnaOrdenada === 'nombre' }">
                                    Nombre</th>
                                <th @click="ordenar('cantidad')"
                                    :class="{ 'highlighted': columnaOrdenada === 'cantidad' }">Cantidad</th>
                                <th @click="ordenar('precio')" :class="{ 'highlighted': columnaOrdenada === 'precio' }">
                                    Precio</th>
                                <th @click="ordenar('idProveedor')"
                                    :class="{ 'highlighted': columnaOrdenada === 'idProveedor' }">Proveedor</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(producto, index) in productosPaginados" :key="producto.id" class="text-center">
                                <td>{{ index + 1 }}</td>
                                <td>{{ producto.nombre }}</td>
                                <td>{{ producto.cantidad }}</td>
                                <td>{{ producto.precio }}</td>
                                <td>{{ obtenerNombreProveedor(producto.idProveedor) }}</td>
                                <td>
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button class="btn btn-outline-success btn-sm"
                                            @click="verProducto(producto.id)">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                        <button class="btn btn-outline-danger btn-sm" @click="eliminar(producto.id)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="productosFiltrados.length === 0">
                                <td colspan="6" class="text-center">No se encontraron resultados</td>
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
            mensajeExito: "",
            producto: {
                id: null,
                nombre: "",
                cantidad: null,
                precio: null,
                idProveedor: null
            },
            productos: [],
            proveedores: [],
            filtro: "",
            paginaActual: 1,
            productosPorPagina: 5,
            columnaOrdenada: null,
            ordenAscendente: true,
            filtro: "",
        };
    },
    computed: {
        productosFiltrados() {
            const filtroMinusculas = this.filtro.toLowerCase();
            return this.productos.filter(producto =>
                producto.nombre.toLowerCase().includes(filtroMinusculas) ||
                producto.precio.toString().includes(filtroMinusculas)
            );
        },
        productosPaginados() {
            // Ordenar los productos filtrados
            const productosOrdenados = [...this.productosFiltrados].sort((a, b) => {
                const valorA = a[this.columnaOrdenada];
                const valorB = b[this.columnaOrdenada];

                if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
                if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
                return 0;
            });

            // Paginado: devuelve los productos correspondientes a la página actual
            const inicio = (this.paginaActual - 1) * this.productosPorPagina;
            const fin = inicio + this.productosPorPagina;
            return productosOrdenados.slice(inicio, fin);
        },
        totalPaginas() {
            return Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
        }
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
                this.mensajeExito = "El producto ha sido eliminado con exito";
                this.buscarProductos();
                setTimeout(() => {
                    this.mensajeExito = "";
                }, 5000);
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
</style>
