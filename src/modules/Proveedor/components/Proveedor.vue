<template>
    <div class="container">
        <h2>Proveedores</h2>
        <div class="content">
            <div class="form-container">
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" v-model="proveedor.nombre" required>
                </div>
                <div class="form-group">
                    <label for="direccion">Dirección</label>
                    <input type="text" id="direccion" v-model="proveedor.direccion" required>
                </div>
                <div class="form-group">
                    <label for="n_cuenta">Número de Cuenta</label>
                    <input type="text" id="n_cuenta" v-model="proveedor.n_cuenta" required>
                </div>
                <button v-if="!actualizarDato" class="btn" @click="ingresar">Crear Proveedor</button>
                <button v-else class="btn" @click="actualizar">Actualizar Proveedor</button>
                <button v-if="actualizarDato" class="btn" @click="cambiarEstado">Cambiar campos para ingresar</button>
            </div>
            <div class="client-list-container">
                <div class="client-list-header">
                    <span class="header-item">ID</span>
                    <span class="header-item">Nombre</span>
                    <span class="header-item">Dirección</span>
                    <span class="header-item">Número de Cuenta</span>
                    <span class="header-item">Acciones</span>
                </div>
                <ul class="client-list">
                    <li v-for="proveedor in proveedores" :key="proveedor.id" class="client-item">
                        <span>{{ proveedor.id }}</span>
                        <span>{{ proveedor.nombre }}</span>
                        <span>{{ proveedor.direccion }}</span>
                        <span>{{ proveedor.n_cuenta }}</span>
                        <div class="action-buttons">
                            <button class="btn" @click="cambiarCampos(proveedor.id)">Editar</button>
                            <button class="btn btn-danger" @click="eliminar(proveedor.id)">Eliminar</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {
    crearProveedorFachada,
    obtenerProveedorFachada,
    obtenerTodosLosProveedorsFachada,
    actualizarProveedorFachada,
    eliminarProveedorFachada
} from '../helpers/proveedoresHelpers';

export default {
    data() {
        return {
            proveedor: {
                id: null,
                nombre: "",
                direccion: "",
                n_cuenta: ""
            },
            proveedores: [],
            actualizarDato: false
        };
    },
    methods: {
        async ingresar() {
            if (this.proveedor.nombre && this.proveedor.direccion && this.proveedor.n_cuenta) {
                try {
                    await crearProveedorFachada(this.proveedor);
                    alert("Proveedor ingresado");
                    this.resetProveedor();
                    this.buscarProveedores();
                } catch (error) {
                    console.error("Error al ingresar el proveedor:", error);
                }
            } else {
                alert("Faltan llenar campos");
            }
        },
        async actualizar() {
            if (this.proveedor.nombre && this.proveedor.direccion && this.proveedor.n_cuenta) {
                try {
                    await actualizarProveedorFachada(this.proveedor.id, this.proveedor);
                    alert("Proveedor actualizado");
                    this.buscarProveedores();
                    this.resetProveedor();
                    this.actualizarDato = false;
                } catch (error) {
                    console.error("Error al actualizar el proveedor:", error);
                }
            } else {
                alert("Faltan llenar campos");
            }
        },
        async eliminar(id) {
            try {
                await eliminarProveedorFachada(id);
                alert("Proveedor eliminado");
                this.buscarProveedores();
            } catch (error) {
                console.error("Error al eliminar el proveedor:", error);
            }
        },
        async buscarProveedores() {
            try {
                const response = await obtenerTodosLosProveedorsFachada();
                this.proveedores = response;
            } catch (error) {
                console.error("Error al buscar proveedores:", error);
            }
        },
        async cambiarCampos(id) {
            try {
                let proveedorData = await obtenerProveedorFachada(id);
                this.proveedor = proveedorData;
                this.actualizarDato = true;
            } catch (error) {
                console.error("Error al cargar los datos del proveedor:", error);
            }
        },
        cambiarEstado() {
            this.actualizarDato = !this.actualizarDato;
            this.resetProveedor();
        },
        resetProveedor() {
            this.proveedor = {
                id: null,
                nombre: "",
                direccion: "",
                n_cuenta: ""
            };
        }
    },
    mounted() {
        this.buscarProveedores();
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

input[type="text"] {
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

.client-list-container {
    background-color: #1e1e1e;
    padding: 20px;
    border-radius: 8px;
}

.client-list-header {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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

.client-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.client-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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