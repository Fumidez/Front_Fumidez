<template>
    <div class="informe-container">
        <div class="orden-trabajo-header">
            <button @click="redirigirCrearInforme" class="crear-orden-btn">
                Crear Nuevo Informe
            </button>
        </div>

        <div class="informe-list">
            <h1>Informes IPM Registrados</h1>
            <table class="informes-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Número de Factura</th>
                        <th>Frecuencia</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="informe in informes" :key="informe.id">
                        <td>{{ informe.id }}</td>
                        <td>{{ informe.numFactura }}</td>
                        <td>{{ informe.frecuencia }}</td>
                        <td>{{ informe.precio }}</td>
                        <td>
                            <button @click="generatePDF(informe)">Generar PDF</button>
                        </td>
                        <td>
                            <button @click="redirigirFormularioIPM(informe.id)">
                                Formulario
                            </button>
                        </td>
                        <td>
                            <button @click="generatePDFFormularioIPM(informe)">
                                Generar PDF IPM
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <CargarArchivo />
        </div>
    </div>
</template>

<script>
import {
    consultarInformeFachada,
    consultarInformePorIdFachada,
} from "../helpers/InformeHelper";
import router from "@/router";

import { generatePDFInformeFachada } from "../helpers/generarInforme";
import CargarArchivo from "../../../components/CargarArchivo.vue";
import { generateFormularioIPMFachada } from "../helpers/generarInformeIPM";

export default {
    components: { CargarArchivo },
    name: "InformeIpm",
    data() {
        return {
            procedimientos: [
                "NEBULIZADOR TÉRMICO",
                "ASPERSOR MANUAL",
                "NEBULIZADOR UVL ELÉCTRICO DIINA FOG",
                "NEBULIZADOR MECÁNICO",
                "LÁMPARAS ELECTROCUTADORAS/ATRAPADORAS",
                "BIOMONITORES PEGABLES",
                "ESTACIONES DE CEBADO",
                "CORDÓN SANITARIO PERIMETRAL",
                "NEBULIZADOR UVL ELECTRICO",
                "NEBULIZADOR MECÁNICO",
                "SANITIZACIÓN",
            ],
            registro: {
                tipoIdentificadorCordon: false,
                consumo: "",
                ubicacion: "",
                observaciones: "",
                reemplazoPegaCebo: false,
                csp: "",
            },
            informes: [], // Array para almacenar los informes existentes
            frecuencias: ["MENSUAL", "BIMENSUAL", "TRIMESTRAL", "OCASIONAL"],
        };
    },
    mounted() {
        this.cargarInformes();

    },
    methods: {

        redirigirCrearInforme() {
            this.$router.push('/informe_registrar');
        },
        async cargarInformes() {
            try {
                this.informes = await consultarInformeFachada();
            } catch (error) {
                console.error("Error al cargar los informes IPM:", error);
            }
        },

        async redirigirFormularioIPM(id) {
            const ruta = `/desratizacion/${id}`;
            await router.push({ path: ruta });
        },
        async generatePDF(informe) {

            const informeId = await consultarInformePorIdFachada(informe.id);
            await generatePDFInformeFachada(informeId);
        },
        async generatePDFFormularioIPM(informe) {

            const informeId = await consultarInformePorIdFachada(informe.id);
            await generateFormularioIPMFachada(informeId);
        },
    },
};
</script>


<style scoped>
.sanitizacion-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* Espacio entre los elementos */
}

.input-group {
    display: flex;
    align-items: center;
    gap: 10px;
    /* Espacio entre el label y el select */
}

label {
    width: 150px;
    /* Ajusta el ancho de los labels para alinearlos */
}

select {
    width: 200px;
    /* Ajusta el ancho de los selects */
}

.informe-container {
    max-width: 1200px;
    margin: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.informe-form {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

h1 {
    text-align: center;
    font-size: 1.4rem;
    color: #181c71;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

input,
textarea {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 0.6rem 1rem;
    background-color: #181c71;
    color: white;
    font-size: 0.9rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
}

button:hover {
    background-color: #4a5d92;
}

.informe-list {
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
}

.informes-table {
    width: 100%;
    margin-top: 1rem;
    border-collapse: collapse;
}

.informes-table th,
.informes-table td {
    padding: 0.75rem;
    border: 1px solid #ccc;
    text-align: left;
}

.informes-table th {
    background-color: #181c71;
    color: white;
}

ul {
    padding-left: 20px;
}

.procedimiento-group,
.plaga-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.plaga-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.plaga-group .plaga-header .plaga-input {
    flex: 2;
}

.plaga-group .plaga-header button {
    background-color: #d9534f;
}

.producto-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;
}

.producto-group input {
    flex: 2;
}

.cantidad-input {
    flex: 1;
}

.producto-group button {
    background-color: #d9534f;
}

.plaga-group button {
    background-color: #5bc0de;
    margin-top: 0.5rem;
}

.procedimiento-group button,
.plaga-group button {
    padding: 0.4rem 0.8rem;
}

@media (max-width: 768px) {
    .producto-group {
        flex-direction: column;
        align-items: flex-start;
    }

    .producto-group input {
        width: 100%;
    }

    .plaga-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .plaga-group button {
        align-self: flex-end;
    }
}
</style>