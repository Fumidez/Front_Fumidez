<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh;">
    <!-- Contenido Principal -->
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg"
        style="max-width: 800px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
        <h1 class="text-center text-primary mb-4">Ingresar Orden de Trabajo</h1>
        <!-- Formulario de Orden de Trabajo -->
        <form @submit.prevent="submitForm">
          <!-- Fecha -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="fecha" class="w-25"><i class="bi bi-calendar"></i> Fecha</label>
            <input type="date" id="fecha" v-model="ordenTrabajo.fecha" class="form-control" required />
          </div>

          <!-- Hora -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="hora" class="w-25"><i class="bi bi-clock"></i> Hora</label>
            <input type="time" id="hora" v-model="ordenTrabajo.hora" class="form-control" required />
          </div>

          <!-- Número de Orden -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="numeroOrden" class="w-25"><i class="bi bi-file-earmark"></i> Número de Orden</label>
            <input v-if="!ver_orden" type="text" id="numeroOrden" v-model="ordenTrabajo.numeroOrden" class="form-control"
              placeholder="Número de Orden" required minlength="3" />
            <label v-else for="numeroOrdenVer" class="w-25">{{ ordenTrabajo.numeroOrden }}</label>
          </div>

          <!-- Descripción -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="descripcion" class="w-25"><i class="bi bi-file-earmark-text"></i> Descripción</label>
            <textarea id="descripcion" v-model="ordenTrabajo.descripcion" class="form-control" placeholder="Descripción"
              required minlength="10"></textarea>
          </div>

          <!-- Área -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="area" class="w-25"><i class="bi bi-geo-alt-fill"></i> Área</label>
            <input type="text" id="area" v-model="ordenTrabajo.area" class="form-control" placeholder="Área" required
              minlength="3" />
          </div>

          <!-- Selección de Usuario -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="idUsuarios" class="w-25"><i class="bi bi-person"></i> Usuario</label>
            <select id="idUsuarios" v-model="ordenTrabajo.idUsuarios" class="form-control" required>
              <option disabled value="">Seleccione un usuario</option>
              <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">{{ usuario.nombre }}</option>
            </select>
          </div>

          <!-- Selección de Cliente -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="idClientes" class="w-25"><i class="bi bi-person-check"></i> Cliente</label>
            <select id="idClientes" v-model="ordenTrabajo.idClientes" class="form-control" required>
              <option disabled value="">Seleccione un cliente</option>
              <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">{{ cliente.nombre }}</option>
            </select>
          </div>

          <!-- Servicios -->
          <div class="form-group mb-3">
            <label><i class="bi bi-tools"></i> Servicios</label>
            <div v-for="(servicio, index) in ordenTrabajo.servicios" :key="index"
              class="d-flex gap-2 align-items-center">
              <input type="text" v-model="servicio.tipoServicio" class="form-control" placeholder="Tipo de Servicio"
                required minlength="3" />
              <button type="button" class="btn btn-danger btn-sm" @click="removeServicio(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <button type="button" class="btn btn-primary w-100 mt-2 py-2" @click="addServicio">
              <i class="bi bi-plus-circle"></i> Añadir Servicio
            </button>
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2">
            Guardar
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import { buscarOrdenPorId, crearOrdenFachada } from '../helpers/OrdenTrabajoHelper';

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
      ordenId: this.$route.params.id,
      ver_orden: false
    };


  },
  mounted() {
    this.cargarClientes();
    this.cargarUsuarios();
    this.consultarPorIdOrden();
  },
  methods: {
    async consultarPorIdOrden() {
      try {
        if (this.ordenId) {
          const orden = await buscarOrdenPorId(this.ordenId);
          console.log(orden)
          this.ordenTrabajo = {
            fecha: orden.fecha.split('T')[0],
            hora: orden.hora,
            numeroOrden: orden.numeroOrden,
            descripcion: orden.descripcion,
            area: orden.area,
            idUsuarios: orden.usuario.id,
            idClientes: orden.cliente.id,
            servicios: orden.servicios
          };
          this.ver_orden = true
        } else {
          this.ver_orden = false
        }
      } catch (error) {
        console.error('Error al cargar los Formularios IPM:', error);
      }
    },
    async submitForm() {
      try {
        console.log('Orden de trabajo creada con éxito:', this.ordenTrabajo);
        const nuevaOrden = await crearOrdenFachada(this.ordenTrabajo);
        console.log('Orden de trabajo creada con éxito:', nuevaOrden);
        this.limpiarFormulario();
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
  position: relative;
}

/* Indicador de carga */
main::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: -1;
  pointer-events: none;
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
  padding: 0.4rem;
}

/* Mensajes de error */
input:invalid,
textarea:invalid,
select:invalid {
  border-color: #e74c3c;
}

/* Indicador visual para formularios válidos */
input:valid,
textarea:valid,
select:valid {
  border-color: #2ecc71;
}

/* Responsividad */
@media (max-width: 768px) {
  .card {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>