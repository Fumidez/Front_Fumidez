<template>
    <div class="registro-container">
        <!-- Formulario para ingresar nuevos registros -->
        <div class="registro-form">
            <h1>Ingresar Nuevo Registro</h1>
            <form @submit.prevent="submitFormulario">
                <!-- Tipo Identificador Cordon -->
                <div class="form-group">
                    <label for="tipoIdentificadorCordon">Tipo Identificador Cordon</label>
                    <input type="checkbox" id="tipoIdentificadorCordon" v-model="registro.tipoIdentificadorCordon" />
                </div>

                <!-- Consumo -->
                <div class="form-group">
                    <label for="consumo">Consumo</label>
                    <select id="idConsumo" v-model="registro.consumo">

                        <option v-for="(con) in consumo" :key="con.id" :value="con">
                            {{ con }}
                        </option>
                    </select>

                </div>

                <!-- Ubicación -->
                <div class="form-group">
                    <label for="ubicacion">Ubicación</label>
                    <input type="text" id="ubicacion" v-model="registro.ubicacion" placeholder="Ubicación" required />
                </div>

                <!-- Observaciones -->
                <div class="form-group">
                    <label for="observaciones">Observaciones</label>
                    <textarea id="observaciones" v-model="registro.observaciones"
                        placeholder="Observaciones"></textarea>
                </div>

                <!-- Reemplazo Pega Cebo -->
                <div class="form-group">
                    <label for="reemplazoPegaCebo">Reemplazo Pega Cebo</label>
                    <input type="checkbox" id="reemplazoPegaCebo" v-model="registro.reemplazoPegaCebo" />
                </div>

                <!-- CSP -->
                <div class="form-group">
                    <label for="csp">CSP</label>
                    <select id="idCSP" v-model="registro.csp">

                        <option v-for="(csp) in csp" :key="csp.id" :value="csp">
                            {{ csp }}
                        </option>
                    </select>
                </div>

                <!-- Botón de Guardar -->
                <button type="submit">Guardar</button>
            </form>
        </div>

        <!-- Tabla para visualizar los registros existentes -->
        <div class="registro-list">
            <h1>Registros Registrados</h1>
            <table class="registros-table">
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
                        <td>{{ item.tipoIdentificadorCordon ? 'Sí' : 'No' }}</td>
                        <td>{{ item.consumo }}</td>
                        <td>{{ item.ubicacion }}</td>
                        <td>{{ item.observaciones }}</td>
                        <td>{{ item.reemplazoPegaCebo ? 'Sí' : 'No' }}</td>
                        <td>{{ item.csp }}</td>
                        <td>{{ item.informeId }}</td>
                        <td>
                            <button @click="generateFormularioIPM(registro)">Editar</button>
                            <button @click="eliminarRegistro(item.id)">Eliminar</button>
                            <button @click="addRow">Añadir fila</button>
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

export default {
    name: "RegistroComponent",
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
        addRow() {
            const lastRow = this.registros[this.registros.length - 1]; // Obtén la última fila
            const newRow = lastRow; // Clona/modifica la última fila
            this.rows.push(newRow); // Añade la nueva fila al final
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

        eliminarRegistro(id) {
            if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
                this.registros = this.registros.filter((reg) => reg.id !== id);
            }
        },



    },
};
</script>

<style scoped>
.registro-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.registro-form,
.registro-list {
    margin-bottom: 40px;
}

.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-group input[type="checkbox"] {
    width: 20px;
    height: 20px;
}

button {
    padding: 10px 15px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #369870;
}

.registros-table {
    width: 100%;
    border-collapse: collapse;
}

.registros-table th,
.registros-table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.registros-table th {
    background-color: #f2f2f2;
    text-align: left;
}

.registros-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.registros-table tr:hover {
    background-color: #ddd;
}

.registros-table button {
    margin-right: 5px;
    background-color: #ff4d4d;
}

.registros-table button:first-of-type {
    background-color: #4CAF50;
}

.registros-table button:hover {
    opacity: 0.8;
}
</style>