<template>
    <div class="container">
        <h2>Productos</h2>
        <div class="content">
            <div class="form-container">
                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input type="text" id="name" v-model="producto.nombre" required>
                </div>
                <div class="form-group">
                    <label for="cantidad">Cantidad</label>
                    <input type="number" id="cantidad" v-model="producto.cantidad" required>
                </div>
                <div class="form-group">
                    <label for="precio">Precio</label>
                    <input type="number" id="precio" v-model="producto.precio" required>
                </div>
                <div class="form-group">
                    <label for="idProveedor">ID Proveedor</label>
                    <input type="number" id="idProveedor" v-model="producto.idProveedor" required>
                </div>
                <button v-if="!actualizarDato" class="btn" @click="ingresar">Crear Producto</button>
                <button v-else class="btn" @click="actualizar">Actualizar Producto</button>
                <button v-if="actualizarDato" class="btn" @click="cambiarEstado">Cambiar campos para ingresar</button>
            </div>
            <div class="product-list-container">
                <div class="product-list-header">
                    <span class="header-item">ID</span>
                    <span class="header-item">Nombre</span>
                    <span class="header-item">Cantidad</span>
                    <span class="header-item">Precio</span>
                    <span class="header-item">ID Proveedor</span>
                    <span class="header-item">Acciones</span>
                </div>
                <ul class="product-list">
                    <li v-for="producto in productos" :key="producto.id" class="product-item">
                        <span>{{ producto.id }}</span>
                        <span>{{ producto.nombre }}</span>
                        <span>{{ producto.cantidad }}</span>
                        <span>{{ producto.precio }}</span>
                        <span>{{ producto.idProveedor }}</span>
                        <div class="action-buttons">
                            <button class="btn" @click="cambiarCampos(producto.id)">Editar</button>
                            <button class="btn btn-danger" @click="eliminar(producto.id)">Eliminar</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
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
            actualizarDato: false
        };
    },
    methods: {
        async ingresar() {
            if (this.producto.nombre && this.producto.cantidad && this.producto.precio && this.producto.idProveedor) {
                try {
                    await crearProductoFachada(this.producto);
                    alert("Producto ingresado");
                    this.resetProducto();
                    this.buscarProductos();
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
        cambiarEstado() {
            this.actualizarDato = !this.actualizarDato;
            this.resetProducto();
        },
        resetProducto() {
            this.producto = {
                id: null,
                nombre: "",
                cantidad: null,
                precio: null,
                idProveedor: null
            };
        }
    },
    mounted() {
        this.buscarProductos();
    }
};
</script>

<style scoped>
.container {
    background-color: #121212;
    color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    max-width: 1200px;
    margin: 0 auto;
}

h2 {
    color: #f0f0f0;
    margin-bottom: 20px;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-container {
    background-color: #1e1e1e;
    padding: 20px;
    border-radius: 8px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #b0b0b0;
}

input[type="text"],
input[type="number"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #444;
    border-radius: 4px;
    background-color: #333;
    color: #fff;
}

.btn {
    background-color: #6200ea;
    color: #ffffff;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.btn:hover {
    background-color: #3700b3;
}

.btn-danger {
    background-color: #b00020;
}

.btn-danger:hover {
    background-color: #790000;
}

.product-list-container {
    background-color: #1e1e1e;
    padding: 20px;
    border-radius: 8px;
}

.product-list-header {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    background-color: #333;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
}

.header-item {
    text-align: left;
    font-weight: bold;
    color: #f0f0f0;
}

.product-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.product-item {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #444;
    background-color: #2c2c2c;
    border-radius: 4px;
    margin-bottom: 10px;
}

.action-buttons {
    display: flex;
    gap: 10px;
}
</style>