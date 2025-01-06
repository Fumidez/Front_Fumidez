<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
        <!-- Contenido Principal -->
        <main class="flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="card p-5 shadow-lg"
                style="max-width: 800px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
                <h1 class="text-center text-primary mb-4">Gestión de Productos</h1>
                <!-- Formulario de Productos -->
                <form @submit.prevent="actualizarDato ? actualizar() : ingresar()">
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="nombre" class="w-25"><i class="bi bi-tag-fill"></i> Nombre</label>
                        <input type="text" id="nombre" v-model="producto.nombre" class="form-control"
                            placeholder="Nombre del Producto" required />
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="cantidad" class="w-25"><i class="bi bi-boxes"></i> Cantidad</label>
                        <input type="number" id="cantidad" v-model="producto.cantidad" class="form-control"
                            placeholder="Cantidad" required />
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="precio" class="w-25"><i class="bi bi-currency-dollar"></i> Precio</label>
                        <input type="number" id="precio" v-model="producto.precio" class="form-control"
                            placeholder="Precio" required />
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="idProveedor" class="w-25"><i class="bi bi-person-check"></i>Proveedor</label>
                        <select id="idProveedor" v-model="producto.idProveedor" class="form-control" required>
                            <option disabled value="">Seleccione un Proveedor</option>
                            <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">{{
                                proveedor.nombre }}
                            </option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2">
                        {{ ver_producto ? 'Actualizar Producto' : 'Crear Producto' }}
                    </button>
                    <button type="button" class="btn btn-secondary w-100 mt-2 py-2"
                        @click="redirigirListadoProducto">
                        Volver al listado
                    </button>
                </form>

                <!-- Lista de Productos -->
            </div>
        </main>
    </div>
</template>
<script>
import router from "@/router";
import { obtenerTodosLosProveedorsFachada } from '../../Proveedor/helpers/proveedoresHelpers';
import {
    crearProductoFachada,
    obtenerTodosLosProductosFachada,
    actualizarProductoFachada,
    eliminarProductoFachada,
    obtenerProductoFachada
} from '../helpers/productosHelpers';

export default {
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
            proveedores: [],
            actualizarDato: false,
            productoId: this.$route.params.id,
            ver_producto: false
        };
    },
    methods: {
        async consultarPorIdProducto() {
            try {
                if (this.productoId) {
                    const producto = await obtenerProductoFachada(this.productoId);
                    this.producto = {
                        nombre: producto.nombre || '',
                        cantidad: producto.cantidad || 0,
                        precio: producto.precio || 0,
                        idProveedor: producto.idProveedor ? producto.idProveedor : null,
                    };
                    this.ver_producto = true;
                } else {
                    this.ver_producto = false;
                }
            } catch (error) {
                console.error('Error al cargar los Formularios IPM:', error);
            }
        },
        async ingresar() {
            if (this.producto.nombre && this.producto.cantidad && this.producto.precio && this.producto.idProveedor) {
                try {
                    if (this.ver_producto) {
                        // Llama al método de actualización
                        await actualizarProductoFachada(this.productoId, this.producto);
                        alert("Producto actualizado con éxito");
                    } else {
                        await crearProductoFachada(this.producto);
                        alert("Producto ingresado");
                        this.resetProducto();
                        this.buscarProductos();
                    }
                } catch (error) {
                    console.error("Error al ingresar el producto:", error);
                }
            } else {
                alert("Faltan llenar campos");
            }
        },
        async actualizar() {
            if (this.producto.nombre && this.producto.cantidad && this.producto.precio && this.producto.idProveedor) {
                try {
                    await actualizarProductoFachada(this.producto.id, this.producto);
                    alert("Producto actualizado");
                    this.buscarProductos();
                    this.resetProducto();
                    this.actualizarDato = false;
                } catch (error) {
                    console.error("Error al actualizar el producto:", error);
                }
            } else {
                alert("Faltan llenar campos");
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
        async buscarProductos() {
            try {
                const response = await obtenerTodosLosProductosFachada();
                this.productos = response;
            } catch (error) {
                console.error("Error al buscar productos:", error);
            }
        },
        async cambiarCampos(id) {
            try {
                let productoData = await obtenerProductoFachada(id);
                this.producto = productoData;
                this.actualizarDato = true;
            } catch (error) {
                console.error("Error al cargar los datos del producto:", error);
            }
        },
        async redirigirListadoProducto() {
            const ruta = `/productos_lista`;
            await router.push({ path: ruta });
        },
        resetProducto() {
            this.producto = {
                id: null,
                nombre: "",
                cantidad: null,
                precio: null,
                idProveedor: null
            };
        },
        async cargarProveedores() {
            try {
                const response = await obtenerTodosLosProveedorsFachada();
                this.proveedores = response;
            } catch (error) {
                console.error("Error al buscar proveedores:", error);
            }
        }
    },
    mounted() {
        this.buscarProductos();
        this.cargarProveedores();
        this.consultarPorIdProducto();
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

h1,
h2 {
    font-weight: 700;
    color: #031425;
}

.list-header {
    background-color: rgba(0, 64, 128, 0.1);
    border-radius: 5px;
    padding: 5px 10px;
    font-weight: bold;
    color: #031425;
}

.list-group-item {
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.9);
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

    h1,
    h2 {
        font-size: 1.5rem;
    }
}
</style>