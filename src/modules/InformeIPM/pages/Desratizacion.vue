<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
        <main class="flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="card p-5 shadow-lg"
                style="max-width: 800px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
                <h1 class="text-center text-primary mb-4">Ingresar Nuevo Registro</h1>
                <form @submit.prevent="submitFormulario">
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="tipoIdentificadorCordon" class="w-25"><i class="bi bi-check-square"></i> Tipo
                            Identificador Cordon</label>
                        <input type="checkbox" id="tipoIdentificadorCordon" v-model="registro.tipoIdentificadorCordon"
                            class="form-check-input" />
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="consumo" class="w-25"><i class="bi bi-box"></i> Consumo</label>
                        <select id="idConsumo" v-model="registro.consumo" class="form-control" required>
                            <option v-for="(con) in consumo" :key="con" :value="con">
                                {{ con }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="ubicacion" class="w-25"><i class="bi bi-geo-alt-fill"></i> Ubicación</label>
                        <input type="text" id="ubicacion" v-model="registro.ubicacion" class="form-control"
                            placeholder="Ubicación" required />
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="observaciones" class="w-25"><i class="bi bi-pencil-square"></i>
                            Observaciones</label>
                        <textarea id="observaciones" v-model="registro.observaciones" class="form-control"
                            placeholder="Observaciones"></textarea>
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="reemplazoPegaCebo" class="w-25"><i class="bi bi-eraser"></i> Reemplazo Pega
                            Cebo</label>
                        <input type="checkbox" id="reemplazoPegaCebo" v-model="registro.reemplazoPegaCebo"
                            class="form-check-input" />
                    </div>

                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="csp" class="w-25"><i class="bi bi-archive"></i> CSP</label>
                        <select id="idCSP" v-model="registro.csp" class="form-control" required>
                            <option v-for="(csp) in csp" :key="csp" :value="csp">
                                {{ csp }}
                            </option>
                        </select>
                    </div>

                    <div v-if="mensajeConfirmacion" class="alert alert-success mt-3">
                        {{ mensajeConfirmacion }}
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2">
                        Guardar
                    </button>
                                 
              <button type="button" class="btn btn-secondary w-100 mt-2 py-2" @click="redirigirListadoInformes">
                        Volver al listado
                    </button>
                </form>
            </div>
        </main>

        <div class="registro-list-container">
            <div class="card p-4 shadow-lg registro-list">
                
                <h1 class="text-center text-primary mb-4">Registros de Formulario IPM</h1>
                <div class="table-responsive">
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tipo Identificador Cordon</th>
                                <th>Consumo</th>
                                <th>Ubicación</th>
                                <th>Observaciones</th>
                                <th>Reemplazo Pega Cebo</th>
                                <th class="expand">CSP</th>
                                <th>Informe ID</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in registros" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <select v-model="item.tipoIdentificadorCordon" @change="actualizarRegistro(item.id, item)">
                                        <option :value="true">Sí</option>
                                        <option :value="false">No</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="item.consumo" class="form-control" required @change="actualizarRegistro(item.id, item)">
                                        <option v-for="(con) in consumo" :key="con" :value="con">
                                            {{ con }}
                                        </option>
                                    </select>
                                </td>
                                <td><input type="text" v-model="item.ubicacion" @change="actualizarRegistro(item.id, item)" class="form-control" /></td>
                                <td><input type="text" v-model="item.observaciones" @change="actualizarRegistro(item.id, item)" class="form-control" /></td>
                                <td>
                                    <select v-model="item.reemplazoPegaCebo" @change="actualizarRegistro(item.id, item)">
                                        <option :value="true">Sí</option>
                                        <option :value="false">No</option>
                                    </select>
                                </td>
                                <td class="expand">
                                    <select v-model="item.csp" class="form-control w-100" required @change="actualizarRegistro(item.id, item)">
                                        <option v-for="(csp) in csp" :key="csp" :value="csp">
                                            {{ csp }}
                                        </option>
                                    </select>
                                </td>
                                <td>{{ item.informeId }}</td>
                                <td>
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button class="btn btn-danger btn-sm" @click="eliminarRegistro(item.id)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                        <button class="btn btn-info btn-sm" @click="addRow()">
                                            <i class="bi bi-plus-circle"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import { actualizarFormularioFachada, consultarDesratizacionFachadaPorIdInforme, crearDesratizacionFachada } from '../helpers/desratizacionHelper';
import Footer from '../../../components/Footer.vue';
import { generateFormularioIPMFachada } from '../helpers/generarInformeIPM';
import router from "@/router";

export default {
    name: "RegistroComponent",
    components: {
        Footer
    },
    data() {
        return {
            // Objeto para vincular los campos del formulario
            registro: {
                tipoIdentificadorCordon: false,
                consumo: "",
                ubicacion: "",
                observaciones: "",
                reemplazoPegaCebo: false,
                csp: "",
                informeId: this.$route.params.id,
            },
            mensajeConfirmacion: "",
            // Lista para almacenar los registros existentes
            registros: [],
            consumo: ['DAÑO', 'SI', 'NO'],
            csp: ['SUMIDERO', 'CAJA DE REVISION', 'DUCTOS ELECTRICOS'],

        };
    },
    mounted() {
        this.consultarPorIdInforme();
    },
    methods: {
        async addRow() {
            const lastRow = this.registros[this.registros.length - 1]; // Obtén la última fila
            const newRow = lastRow; // Clona/modifica la última fila
            console.log(newRow);
            newRow.id = null;
            const nuevoRegistroDuplicado = await crearDesratizacionFachada(newRow);
            console.log(nuevoRegistroDuplicado);
            this.registros.push(nuevoRegistroDuplicado); // Añade la nueva fila al final

        },
        // Método para manejar el envío del formulario
        async submitFormulario() {
            // Validación básica (puedes agregar más según tus necesidades)
            if (
                this.registro.consumo &&
                this.registro.ubicacion &&
                this.registro.informeId
            ) {
                // Simulación de guardar el registro (puedes reemplazar esto con una llamada a la API)
                const nuevoRegistro = await crearDesratizacionFachada(this.registro)
                this.mensajeConfirmacion = "¡Registro guardado con exito!";


                // Reiniciar el formulario
                this.registro = {
                    tipoIdentificadorCordon: false,
                    consumo: "",
                    ubicacion: "",
                    observaciones: "",
                    reemplazoPegaCebo: false,
                    csp: "",
                    informeId: this.$route.params.id,

                };
                this.consultarPorIdInforme();

            } else {
            }
        },

        async consultarPorIdInforme() {
            console.log(this.registro.informeId);
            try {
                this.registros = await consultarDesratizacionFachadaPorIdInforme(this.registro.informeId);
            } catch (error) {
                console.error('Error al cargar los Formularios IPM:', error);
            }
        },

        async eliminarRegistro(id) {
            if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
                this.registros = this.registros.filter((reg) => reg.id !== id);
            }
        },
        async actualizarRegistro(id, item) {
            await actualizarFormularioFachada(id, item);
        },

        async generatePDF() {

            const informeId = await consultarDesratizacionFachadaPorIdInforme(this.registro.informeId);
            await generateFormularioIPMFachada(informeId);
        },

        async redirigirListadoInformes() {
            const ruta = `/informe_lista`;
            await router.push({ path: ruta });
        },



    },
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
/* Estilo para las cabeceras de la tabla */
.table th {
    background-color: #a9c4f5;
  color: rgb(0, 0, 0);
  border: 2px solid #a9c4f5;
}

/* Estilo de las cabeceras cuando se pasan por encima */
.table th:hover {
    background-color: #003060; /* Color de fondo más oscuro al pasar el mouse */
}

.registro-list-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
    overflow-x: auto; /* Permite desplazamiento horizontal */
}

.registro-list {
    width: 100%;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 3px solid transparent;
    border-image: linear-gradient(to right, #004080, #a9c4f5);
    border-image-slice: 1;
}

.table-container {
    overflow-x: auto; /* Permite desplazamiento horizontal */
}

.table {
    width: auto;
    min-width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    text-align: center;
    vertical-align: top; /* Alinea el texto en la parte superior de la celda */
    padding: 8px;
    white-space: normal !important; /* Permite que el texto se ajuste */
    word-wrap: break-word !important; /* Evita que el texto se corte */
    overflow: visible !important; /* Asegura que el contenido se expanda */
}

.table th {
    min-width: 120px; /* Asegura un ancho mínimo en las cabeceras */
}

.table td {
    min-width: 150px; /* Asegura un ancho mínimo en cada celda */
    vertical-align: top; /* Alinea el contenido hacia la parte superior de la celda */
}

input[type="text"], textarea {
    width: 100%; /* Asegura que los campos ocupen todo el espacio disponible */
    min-height: 40px; /* Alto mínimo para los inputs */
    height: auto; /* Permite que el campo se expanda según el texto */
    padding: 8px;
}

textarea {
    min-height: 60px; /* Altura mínima para el campo */
    max-height: 150px; /* Limita la altura máxima */
    overflow-y: auto; /* Activar scroll vertical cuando el contenido excede */
    resize: none; /* Desactiva el redimensionamiento */
    padding: 8px;
}

button {
    transition: all 0.3s ease;
}

button:hover {
    background-color: #003060;
}

button.btn-danger {
    background-color: #d9534f;
    border-color: #d9534f;
}

button.btn-danger:hover {
    background-color: #c9302c;
}
</style>
