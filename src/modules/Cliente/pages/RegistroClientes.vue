<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
        <!-- Header -->

        <!-- Contenido Principal -->
        <main class="flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="card p-5 shadow-lg"
                style="max-width: 800px; width: 100%; border-radius: 15px;   background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080 , #a9c4f5); border-image-slice: 1;">
                <h1 class="text-center text-primary mb-4">Ingresar Cliente</h1>
                <form @submit.prevent="submitForm">
                    <!-- Nombre -->
                    <div class="form-group row align-items-center g-0 mb-3">
                        <label for="nombre" class="col-2 d-flex align-items-center">
                            <i class="bi bi-person-fill me-2 text-primary"></i> Nombre
                        </label>
                        <div class="col-10">
                            <input type="text" id="nombre" v-model="cliente.nombre" class="form-control" required
                                placeholder="Nombre del cliente" />
                        </div>
                    </div>

                    <div class="form-group row align-items-center g-0 mb-3">
                        <label for="nombreEncargado" class="col-2 d-flex align-items-center">
                            <i class="bi bi-person-fill me-2 text-primary"></i> Persona Encargada
                        </label>
                        <div class="col-10">
                            <input type="text" id="nombreEncargado" v-model="cliente.personaEncargada"
                                class="form-control" required placeholder="Persona encargada" />
                        </div>
                    </div>

                    <!-- Teléfono -->
                    <div class="form-group row align-items-center mb-3">
                        <label for="telefono" class="col-2 d-flex align-items-center">
                            <i class="bi bi-telephone-fill me-2 text-primary"></i> Teléfono
                        </label>
                        <div class="col-10">
                            <input type="tel" id="telefono" v-model="cliente.telefono" class="form-control" required
                                placeholder="Número de teléfono" />
                        </div>
                    </div>

                    <!-- Correo -->
                    <div class="form-group row align-items-center mb-3">
                        <label for="correo" class="col-2 d-flex align-items-center">
                            <i class="bi bi-envelope-at-fill me-2 text-primary"></i> Correo
                        </label>
                        <div class="col-10">
                            <input type="email" id="correo" v-model="cliente.correo" class="form-control" required
                                placeholder="Correo electrónico" />
                        </div>
                    </div>

                    <!-- Dirección -->
                    <div class="form-group row align-items-center mb-3">
                        <label for="direccion" class="col-2 d-flex align-items-center">
                            <i class="bi bi-geo-alt-fill me-2 text-primary"></i> Dirección
                        </label>
                        <div class="col-10">
                            <input type="text" id="direccion" v-model="cliente.direccion" class="form-control" required
                                placeholder="Dirección del cliente" />
                        </div>
                    </div>

                    <!-- RUC -->
                    <div class="form-group row align-items-center mb-4">
                        <label for="ruc" class="col-2 d-flex align-items-center">
                            <i class="bi bi-person-square me-2 text-primary"></i> RUC
                        </label>
                        <div class="col-10">
                            <input type="text" id="ruc" v-model="cliente.ruc" class="form-control" required
                                placeholder="RUC del cliente" />
                        </div>
                    </div>
                    <div v-if="mensajeConfirmacion" class="alert alert-success mt-3">
                        {{ mensajeConfirmacion }}
                    </div>
                    <!-- Botón Guardar -->
                    <button v-if="!ver_cliente" type="submit" class="btn btn-primary w-100 py-2">
                        Guardar
                    </button>
                    <button v-else type="submit" class="btn btn-primary w-100 py-2">
                        Actualizar
                    </button>
                    <button type="button" class="btn btn-secondary w-100 mt-2 py-2" @click="redirigirListadoCliente">
                        Volver al listado
                    </button>
                </form>
            </div>
        </main>


    </div>
</template>

<script>
import Footer from '../../../components/Footer.vue';
import Header from '../../../components/Header.vue';
import router from "@/router";

import { actualizarClienteFachada, buscarClientePorIdFachada, consultarClienteFachada, crearClienteFachada, obtenerClienteFachada } from '../helpers/ClienteHelper';

export default {
    name: "IngresarCliente",
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            cliente: {
                nombre: '',
                telefono: '',
                correo: '',
                direccion: '',
                ruc: '',
                personaEncargada: ''
            },
            clienteId: this.$route.params.id,
            ver_cliente: false,
            mensajeConfirmacion: '',
            esEdicion: false, 
        };
    },
    mounted() {
        this.consultarPorIdCliente();
    },
    methods: {

        async consultarPorIdCliente() {
            try {
                if (this.clienteId) {
                    const cli = await obtenerClienteFachada(this.clienteId);
                    console.log("asdadasdasd");
                    console.log(cli);
                    this.cliente = {
                        nombre: cli.nombre,
                        telefono: cli.telefono,
                        correo: cli.correo,
                        direccion: cli.direccion || '',
                        ruc: cli.ruc,
                        personaEncargada: cli.personaEncargada,
                    };
                    this.ver_cliente = true;
                } else {
                    this.ver_cliente = false;
                }
            } catch (error) {
                console.error('Error al cargar los Formularios IPM:', error);
            }
        },
        async cargarClientes() {
            try {
                this.clientes = await consultarClienteFachada();
            } catch (error) {
                console.error('Error al cargar los clientes:', error);
            }
        },

        async submitForm() {
            try {
                if (this.ver_cliente) {
                    // Llama al método de actualización
                    await actualizarClienteFachada(this.clienteId, this.cliente);
                    console.log('Cliente actualizado con éxito');
                    this.mensajeConfirmacion = "¡El cliente ha sido actualizado con exito!";
                    this.consultarPorIdCliente(this.clienteId);
                } else {
                    // Llama al método de creación
                    const nuevoCliente = await crearClienteFachada(this.cliente);
                    this.mensajeConfirmacion = "¡El cliente ha sido creado con exito!";
                }
            } catch (error) {
                console.error('Error al procesar el formulario:', error);

            }
        },
        async redirigirListadoCliente() {
            const ruta = `/clientes_lista`;
            await router.push({ path: ruta });
        },
        limpiarDatosCliente() {
            this.cliente = {
                nombre: '',
                telefono: '',
                correo: '',
                direccion: '',
                ruc: ''
            };
        }
    },

};
</script>

<style scoped>
/* General */
.page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex-grow: 1;
    /* Ocupa el espacio restante entre el header y footer */
    background-image: url('src/assets/fumi.jpg'), linear-gradient(to bottom, #132333, #132333);
    background-size: cover;
    /* Hace que la imagen cubra todo el fondo sin distorsionarse */
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
}

/* Card Estilo Empresarial */
.card {
    border: 3px solid transparent;
    border-image: linear-gradient(to right, #004080, #a9c4f5);
    border-image-slice: 1;
    border-radius: 15px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    background-color: rgba(5, 6, 29, 0.4);
    /* Fondo negro con 40% de opacidad para ver la imagen detrás */
    border-image: linear-gradient(to right, #004080, #a9c4f5);

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

/* Responsividad */
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

/* Pantallas grandes */
@media (min-width: 1200px) {
    .card {
        max-width: 600px;
    }
}
</style>