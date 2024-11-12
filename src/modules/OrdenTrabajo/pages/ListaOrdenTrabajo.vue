<template>
    <div class="orden-trabajo-container">
        <!-- Botón para redirigir a la creación de una nueva orden de trabajo -->
        <div class="orden-trabajo-header">
            <button @click="redirigirCrearOrden" class="crear-orden-btn">Crear Nueva Orden de Trabajo</button>
        </div>

        <div class="orden-trabajo-list">
            <h1>Órdenes de Trabajo</h1>
            <!-- Tabla para visualizar las órdenes de trabajo -->
            <table class="ordenes-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Número de Orden</th>
                        <th>Descripción</th>
                        <th>Área</th>
                        <th>Usuario</th>
                        <th>Cliente</th>
                        <th>Servicios</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(orden, index) in ordenesTrabajo" :key="orden.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ orden.fecha }}</td>
                        <td>{{ orden.hora }}</td>
                        <td>{{ orden.numeroOrden }}</td>
                        <td>{{ orden.descripcion }}</td>
                        <td>{{ orden.area }}</td>
                        <td>{{ orden.usuario.nombre }}</td>
                        <td>{{ orden.cliente.nombre }}</td>
                        <td>
                            <ul>
                                <li v-for="servicio in orden.servicios" :key="servicio.id">
                                    {{ servicio.tipoServicio }}
                                </li>
                            </ul>
                        </td>
                        <td>{{ orden.estado }}</td>

                        <td>
                            <button @click="generatePDF(orden)">Generar PDF</button>
                        </td>
                        <td>
                            <button @click="updateEstado(orden.id, 'confirmado')">Confirmar Estado</button>
                        </td>
                        <td>
                            <button @click="updateEstado(orden.id, 'cancelado')">Cancelar Estado</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { generatePDFOrdenFachada } from '../helpers/generarOrdenPdf';
import { actualizarOrdenEstadoFachada, actualizarOrdenFachada, consultarOrdenFachada } from '../helpers/OrdenTrabajoHelper';

export default {
    name: "OrdenTrabajo",
    data() {
        return {
            ordenesTrabajo: []
        };
    },
    mounted() {
        this.cargarOrdenesTrabajo();
    },
    methods: {
        async cargarOrdenesTrabajo() {
            try {
                this.ordenesTrabajo = await consultarOrdenFachada();
            } catch (error) {
                console.error('Error al cargar las órdenes de trabajo:', error);
            }
        },
        redirigirCrearOrden() {
            this.$router.push('/orden_trabajo_registro');
        },
        async generatePDF(ordenTrabajo) {
           await generatePDFOrdenFachada(ordenTrabajo); 
        },

        async updateEstado(id, param){
            const estado = {
                estado : param
            }
            const data = await actualizarOrdenEstadoFachada(id, estado);
        }


    }
};
</script>

<style scoped>
.orden-trabajo-container {
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.orden-trabajo-header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.crear-orden-btn {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.crear-orden-btn:hover {
  background-color: #2980b9;
}

h1 {
    text-align: center;
    font-size: 1.4rem;
    color: #181C71;
}

.form-group {
    margin-bottom: 0.75rem;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.25rem;
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
    padding: 0.6rem;
    background-color: #181C71;
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

.orden-trabajo-list {
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
}

.ordenes-table {
    width: 100%;
    margin-top: 1rem;
    border-collapse: collapse;
}

.ordenes-table th,
.ordenes-table td {
    padding: 0.75rem;
    border: 1px solid #ccc;
    text-align: left;
}

.ordenes-table th {
    background-color: #181C71;
    color: white;
}

ul {
    padding-left: 20px;
}

.servicio-group {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}

.servicio-group input {
    flex: 1;
    margin-right: 0.5rem;
}

.servicio-group button {
    background-color: red;
    padding: 0.4rem;
}
</style>