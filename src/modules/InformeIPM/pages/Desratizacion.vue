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

                    <button type="submit" class="btn btn-primary w-100 py-2">
                        Guardar
                    </button>
                </form>
            </div>
        </main>

        <div class="registro-list mb-4">
            <h1 class="text-center text-primary mb-4">Registros Registrados</h1>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tipo Identificador Cordon</th>
                        <th>Consumo</th>
                        <th>Ubicación</th>
                        <th>Observaciones</th>
                        <th>Reemplazo Pega Cebo</th>
                        <th>CSP</th>
                        <th>Informe ID</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in registros" :key="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <select v-model="item.tipoIdentificadorCordon"  @change="actualizarRegistro(item)">
                                <option :value="true">Sí</option>
                                <option :value="false">No</option>
                            </select>
                        </td>
                        <td>
                            <div class="form-group mb-3 d-flex align-items-center">
                                <select id="idConsumo" v-model="item.consumo" class="form-control" required  @change="actualizarRegistro(item)">
                                    <option v-for="(con) in consumo" :key="con" :value="con">
                                        {{ con }}
                                    </option>
                                </select>
                            </div>
                        </td>
                        <td><input type="text" v-model="item.ubicacion"  @change="actualizarRegistro(item)"/></td>
                        <td><input type="text" v-model="item.observaciones"  @change="actualizarRegistro(item)"/></td>
                        <td>
                            <select v-model="item.reemplazoPegaCebo"  @change="actualizarRegistro(item)">
                                <option :value="true">Sí</option>
                                <option :value="false">No</option>
                            </select>
                        </td>
                        <td>
                            <div class="form-group mb-3 d-flex align-items-center">
                                <select id="idCSP" v-model="item.csp" class="form-control" required  @change="actualizarRegistro(item)">
                                    <option v-for="(csp) in csp" :key="csp" :value="csp">
                                        {{ csp }}
                                    </option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm" @click="eliminarRegistro(item.id)">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                            <button class="btn btn-info btn-sm" @click="addRow()">
                                <i class="bi bi-plus-circle"></i> Copiar fila
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

    </div>
</template>
<script>
import { consultarDesratizacionFachadaPorIdInforme, crearDesratizacionFachada } from '../helpers/desratizacionHelper';
import jsPDF from 'jspdf';
import JsPDFAutotable from 'jspdf-autotable'
import router from '@/router';
import Footer from '../../../components/Footer.vue';


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
                alert("Registro guardado exitosamente.");

            } else {
                alert("Por favor, completa los campos obligatorios.");
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
        async actualizarRegistro(item){
            console.log(item);
        }



    },
};
</script>

<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.form-check-input {
    width: auto;
    height: auto;
    transform: scale(1);
    /* Ajusta el tamaño del checkbox */
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

.form-group {
    margin-bottom: 1rem;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
}

input,
textarea,
select {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    transition: all 0.3s ease;
}

button:hover {
    background-color: #003060;
}

button:focus {
    outline: none;
}

button.btn-danger {
    background-color: #d9534f;
    border-color: #d9534f;
}

button.btn-danger:hover {
    background-color: #c9302c;
}

.table-striped {
    width: 100%;
    border-collapse: collapse;
}

.table-striped th,
.table-striped td {
    border: 1px solid #ddd;
    padding: 8px;
}

.table-striped th {
    background-color: #f2f2f2;
    text-align: left;
}

.table-striped tr:nth-child(even) {
    background-color: #f9f9f9;
}

.table-striped tr:hover {
    background-color: #ddd;
}

.table-striped button {
    margin-right: 5px;
    background-color: #ff4d4d;
}

.table-striped button:first-of-type {
    background-color: #4CAF50;
}

.table-striped button:nth-of-type(2) {
    background-color: #ff4d4d;
}

.table-striped button:nth-of-type(3) {
    background-color: #17a2b8;
}
</style>