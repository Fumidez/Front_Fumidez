<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
        <!-- Contenido Principal -->
        <main class="flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="card p-5 shadow-lg"
                style="max-width: 800px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
                <h1 class="text-center text-primary mb-4">Gestión de Proveedores</h1>
                <!-- Formulario de Proveedores -->
                <form @submit.prevent="actualizarDato ? actualizar() : ingresar()">
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="nombre" class="w-25"><i class="bi bi-person-fill"></i> Nombre</label>
                        <input type="text" id="nombre" v-model="proveedor.nombre" class="form-control"
                            placeholder="Nombre del Proveedor" required />
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="direccion" class="w-25"><i class="bi bi-house-door-fill"></i> Dirección</label>
                        <input type="text" id="direccion" v-model="proveedor.direccion" class="form-control"
                            placeholder="Dirección" required />
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="n_cuenta" class="w-25"><i class="bi bi-credit-card-fill"></i> Número de
                            Cuenta</label>
                        <input type="text" id="n_cuenta" v-model="proveedor.n_cuenta" class="form-control"
                            placeholder="Número de Cuenta" required />
                    </div>
                    <div v-if="mensajeConfirmacion" class="alert alert-success mt-3">
                        {{ mensajeConfirmacion }}
                    </div>
                    <button type="submit" class="btn btn-primary w-100 py-2">
                        {{ ver_proveedor ? 'Actualizar Proveedor' : 'Crear Proveedor' }}
                    </button>
                    <button type="button" class="btn btn-secondary w-100 mt-2 py-2" @click="redirigirListadoProveedor">
                        Volver al listado
                    </button>
                </form>


            </div>
        </main>
    </div>
</template>

<script>
import router from "@/router";

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
            actualizarDato: false,
            proveedorId: this.$route.params.id,
            ver_proveedor: false,
            mensajeConfirmacion: "",

        };
    },
    methods: {
        async consultarPorIdProveedor() {
            try {
                if (this.proveedorId) {
                    const prov = await obtenerProveedorFachada(this.proveedorId);
                    this.proveedor = {
                        nombre: prov.nombre || '',
                        direccion: prov.direccion || '',
                        n_cuenta: prov.n_cuenta || '',
                    };
                    this.ver_proveedor = true;
                } else {
                    this.ver_proveedor = false;
                }
            } catch (error) {
                console.error('Error al cargar los Formularios IPM:', error);
            }
        },
        async ingresar() {
            if (this.proveedor.nombre && this.proveedor.direccion && this.proveedor.n_cuenta) {
                try {
                    if (this.ver_proveedor) {
                        // Llama al método de actualización
                        await actualizarProveedorFachada(this.proveedorId, this.proveedor);
                        this.mensajeConfirmacion = "¡El proveedor ha sido actualizado con exito!";
                    } else {
                        await crearProveedorFachada(this.proveedor);
                        this.mensajeConfirmacion = "¡El proveedor ha sido creado con exito!";
                        this.resetProveedor();
                        this.buscarProveedores();
                    }
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
        },
        async redirigirListadoProveedor() {
            const ruta = `/proveedores_lista`;
            await router.push({ path: ruta });
        },
    },
    mounted() {
        this.buscarProveedores();
        this.consultarPorIdProveedor();
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
