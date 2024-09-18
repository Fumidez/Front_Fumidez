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
            <input type="text" id="numeroOrden" v-model="ordenTrabajo.numeroOrden" placeholder="Número de Orden" />
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
    
          <!-- Usuario ID -->
          <div class="form-group">
            <label for="idUsuarios">ID del Usuario</label>
            <input type="number" id="idUsuarios" v-model="ordenTrabajo.idUsuarios" placeholder="ID del Usuario" />
          </div>
    
          <!-- Cliente ID -->
          <div class="form-group">
            <label for="idClientes">ID del Cliente</label>
            <input type="number" id="idClientes" v-model="ordenTrabajo.idClientes" placeholder="ID del Cliente" />
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
      
      <div class="orden-trabajo-list">
        <h1>Órdenes de Trabajo Registradas</h1>
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="(orden, index) in ordenesTrabajo" :key="orden.id">
              <td>{{ index + 1 }}</td>
              <td>{{ formatDate(orden.fecha) }}</td>
              <td>{{ (orden.hora) }}</td>
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
<script>
// Importamos el helper para manejar la creación y obtención de órdenes de trabajo
import { crearOrdenFachada, consultarOrdenFachada } from '../helpers/OrdenTrabajoHelper';

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
      ordenesTrabajo: [] // Array para almacenar las órdenes existentes
    };
  },
  mounted() {
    this.cargarOrdenesTrabajo(); // Cargamos las órdenes al montar el componente
  },
  methods: {
    async submitForm() {
      try {
        const nuevaOrden = await crearOrdenFachada(this.ordenTrabajo);
        console.log('Orden de trabajo creada con éxito:', nuevaOrden);
        this.limpiarFormulario();
        this.cargarOrdenesTrabajo(); // Recargamos las órdenes después de crear una nueva
      } catch (error) {
        console.error('Error al crear la orden de trabajo:', error);
      }
    },
    async cargarOrdenesTrabajo() {
      try {
        this.ordenesTrabajo = await consultarOrdenFachada();
      } catch (error) {
        console.error('Error al cargar las órdenes de trabajo:', error);
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
    formatDate(fecha) {
      const date = new Date(fecha);
      return date.toLocaleDateString();
    },
    formatTime(hora) {
      const time = new Date(hora);
      return time.toLocaleTimeString();
    }
  }
};
</script>

<style scoped>
.orden-trabajo-container {
  max-width: 1200px; /* Ajusta el tamaño máximo del contenedor */
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

input, textarea {
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

.ordenes-table th, .ordenes-table td {
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
