<template>
    <div class="orden-trabajo-container">
        <div class="orden-trabajo-form">
            <h1>Ingresar Orden de Trabajo</h1>
            <form @submit.prevent="submitForm">
                <!-- Fecha -->
                <div class="form-group">
                    <label for="fecha">Fecha</label>
                    <input type="date" id="fecha" v-model="ordenTrabajo.fecha" />
                </div>

                <!-- Hora -->
                <div class="form-group">
                    <label for="hora">Hora</label>
                    <input type="time" id="hora" v-model="ordenTrabajo.hora" />
                </div>

                <!-- Número de Orden -->
                <div class="form-group">
                    <label for="numeroOrden">Número de Orden</label>
                    <input type="text" id="numeroOrden" v-model="ordenTrabajo.numeroOrden"
                        placeholder="Número de Orden" />
                </div>

                <!-- Descripción -->
                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea id="descripcion" v-model="ordenTrabajo.descripcion" placeholder="Descripción"></textarea>
                </div>

                <!-- Área -->
                <div class="form-group">
                    <label for="area">Área</label>
                    <input type="text" id="area" v-model="ordenTrabajo.area" placeholder="Área" />
                </div>

                <!-- Selección de Usuario -->
                <div class="form-group">
                    <label for="idUsuarios">Usuario</label>
                    <select id="idUsuarios" v-model="ordenTrabajo.idUsuarios">
                        <option disabled value="">Seleccione un usuario</option>
                        <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                            {{ usuario.nombre }}
                        </option>
                    </select>
                </div>

                <!-- Selección de Cliente -->
                <div class="form-group">
                    <label for="idClientes">Cliente</label>
                    <select id="idClientes" v-model="ordenTrabajo.idClientes">
                        <option disabled value="">Seleccione un cliente</option>
                        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                            {{ cliente.nombre }}
                        </option>
                    </select>
                </div>

                <!-- Servicios -->
                <div class="form-group">
                    <label>Servicios</label>
                    <div v-for="(servicio, index) in ordenTrabajo.servicios" :key="index" class="servicio-group">
                        <input type="text" v-model="servicio.tipoServicio" placeholder="Tipo de Servicio" />
                        <button type="button" @click="removeServicio(index)">Eliminar</button>
                    </div>
                    <button type="button" @click="addServicio">Añadir Servicio</button>
                </div>

                <button type="submit">Guardar</button>
            </form>
        </div>
    </div>
</template>

<script>
import { crearOrdenFachada } from '../helpers/OrdenTrabajoHelper';

import { consultarUsuarioFachada } from '../../Usuario/helpers/UsuarioHelper';

import { consultarClienteFachada } from '../../Cliente/helpers/ClienteHelper';

export default {
    name: "OrdenTrabajo",
    data() {
        return {
            ordenTrabajo: {
                fecha: '',
                hora: '',
                numeroOrden: '',
                descripcion: '',
                area: '',
                idUsuarios: '',
                idClientes: '',
                servicios: [
                    { tipoServicio: '' }  // Inicialmente un servicio
                ]
            },
            usuarios: [],
            clientes: [],
        };


    },
    mounted() {
        this.cargarClientes();
        this.cargarUsuarios();
    },
    methods: {
        async submitForm() {
            try {
                console.log('Orden de trabajo creada con éxito:', this.ordenTrabajo);

                const nuevaOrden = await crearOrdenFachada(this.ordenTrabajo);
                console.log('Orden de trabajo creada con éxito:', nuevaOrden);
                this.limpiarFormulario();
                this.cargarOrdenesTrabajo(); // Recargamos las órdenes después de crear una nueva
            } catch (error) {
                console.error('Error al crear la orden de trabajo:', error);
            }
        },
        addServicio() {
            this.ordenTrabajo.servicios.push({ tipoServicio: '' });
        },
        removeServicio(index) {
            this.ordenTrabajo.servicios.splice(index, 1);
        },
        limpiarFormulario() {
            this.ordenTrabajo = {
                fecha: '',
                hora: '',
                numeroOrden: '',
                descripcion: '',
                area: '',
                idUsuarios: '',
                idClientes: '',
                servicios: [{ tipoServicio: '' }]
            };
        },
        async cargarUsuarios() {
            try {
                this.usuarios = await consultarUsuarioFachada();
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
                alert('Hubo un error al cargar los usuarios.');
            }
        },

        // Método para cargar la lista de clientes
        async cargarClientes() {
            try {
                this.clientes = await consultarClienteFachada();
            } catch (error) {
                console.error('Error al cargar los clientes:', error);
                alert('Hubo un error al cargar los clientes.');
            }
        },

    }
};
</script>

<style scoped>
.orden-trabajo-container {
    max-width: 1200px;
    /* Ajusta el tamaño máximo del contenedor */
    margin: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.orden-trabajo-form {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
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