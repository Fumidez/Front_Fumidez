<template>
    <div class="informe-container">
      <div class="informe-form">
        <h1>Ingresar Informe IPM</h1>
        <form @submit.prevent="submitForm">
          <!-- Número de Factura -->
          <div class="form-group">
            <label for="numFactura">Número de Factura</label>
            <input type="text" id="numFactura" v-model="informe.numFactura" placeholder="Número de Factura" />
          </div>
  
          <!-- Observación -->
          <div class="form-group">
            <label for="observacion">Observación</label>
            <textarea id="observacion" v-model="informe.observacion" placeholder="Observación"></textarea>
          </div>
  
          <!-- Procedimiento -->
          <div class="form-group">
            <label for="procedimineto">Procedimiento</label>
            <input type="text" id="procedimineto" v-model="informe.procedimineto" placeholder="Procedimiento" />
          </div>
  
          <!-- Recomendaciones -->
          <div class="form-group">
            <label for="recomendaciones">Recomendaciones</label>
            <textarea id="recomendaciones" v-model="informe.recomendaciones" placeholder="Recomendaciones"></textarea>
          </div>
  
          <!-- Concurrencia -->
          <div class="form-group">
            <label for="concurrencia">Concurrencia</label>
            <input type="text" id="concurrencia" v-model="informe.concurrencia" placeholder="Concurrencia" />
          </div>
  
          <!-- Frecuencia -->
          <div class="form-group">
            <label for="frecuencia">Frecuencia</label>
            <input type="text" id="frecuencia" v-model="informe.frecuencia" placeholder="Frecuencia" />
          </div>
  
          <!-- Precio -->
          <div class="form-group">
            <label for="precio">Precio</label>
            <input type="number" id="precio" v-model="informe.precio" placeholder="Precio" />
          </div>
  
          <!-- Orden ID -->
          <div class="form-group">
            <label for="idOrden">ID de Orden</label>
            <input type="number" id="idOrden" v-model="informe.idOrden" placeholder="ID de Orden" />
          </div>
  
          <!-- Procedimientos -->
          <div class="form-group">
            <label>Procedimientos</label>
            <div v-for="(procedimineto, index) in informe.procediminetos" :key="index" class="procedimiento-group">
              <input type="text" v-model="procedimineto.tipoProcedimineto" placeholder="Tipo de Procedimiento" />
              <button type="button" @click="removeProcedimiento(index)">Eliminar</button>
            </div>
            <button type="button" @click="addProcedimiento">Añadir Procedimiento</button>
          </div>
          <div class="form-group">
            <label>Plagas</label>
            <div v-for="(plaga, index) in informe.plagas" :key="index" class="procedimiento-group">
              <input type="text" v-model="plaga.tipoPlaga" placeholder="Tipo de Plaga" />
              <button type="button" @click="removePlaga(index)">Eliminar</button>
            </div>
            <button type="button" @click="addPlaga">Añadir Plaga</button>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </div>
  
      <div class="informe-list">
        <h1>Informes IPM Registrados</h1>
        <!-- Tabla para visualizar los informes IPM -->
        <table class="informes-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Número de Factura</th>
              <th>Observación</th>
              <th>Procedimiento</th>
              <th>Recomendaciones</th>
              <th>Concurrencia</th>
              <th>Frecuencia</th>
              <th>Precio</th>
              <th>Orden</th>
              <th>Procedimientos</th>
              <th>Plaga</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="(informe) in informes" :key="informe.id">
              <td>{{ informe.id }}</td>
              <td>{{ informe.numFactura }}</td>
              <td>{{ informe.observacion }}</td>
              <td>{{ informe.procedimineto }}</td>
              <td>{{ informe.recomendaciones }}</td>
              <td>{{ informe.concurrencia }}</td>
              <td>{{ informe.frecuencia }}</td>
              <td>{{ informe.precio }}</td>
              <td>{{ informe.ordenDto.cliente.nombre }}</td>
              <td>
                <ul>
                  <li v-for="procedimineto in informe.procediminetoDtos" :key="procedimineto.id">
                    {{ procedimineto.tipoProcedimineto }}
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li v-for="plaga in informe.plagaDtos" :key="plaga.id">
                    {{ plaga.tipoPlaga }}
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
  import { crearInformeFachada, consultarInformeFachada } from '../helpers/InformeHelper';
  
  export default {
    name: "InformeIpm",
    data() {
      return {
        informe: {
          numFactura: '',
          observacion: '',
          procedimineto: '',
          recomendaciones: '',
          concurrencia: '',
          frecuencia: '',
          precio: '',
          idOrden: '',
          plagas: [
            { tipoPlaga: '' }  // Inicialmente un procedimiento
          ],
          procediminetos: [
            { tipoProcedimineto: '' }  // Inicialmente un procedimiento
          ]
        },
        informes: [] // Array para almacenar los informes existentes
      };
    },
    mounted() {
      this.cargarInformes(); // Cargamos los informes al montar el componente
    },
    methods: {
      async submitForm() {
        try {
            console.log('Informe IPM creado con éxito:', this.informe);

          const nuevoInforme = await crearInformeFachada(this.informe);
          console.log('Informe IPM creado con éxito:', nuevoInforme);
          this.limpiarFormulario();
          this.cargarInformes(); // Recargamos los informes después de crear uno nuevo
        } catch (error) {
          console.error('Error al crear el informe IPM:', error);
        }
      },
      async cargarInformes() {
        try {
          this.informes = await consultarInformeFachada();
        } catch (error) {
          console.error('Error al cargar los informes IPM:', error);
        }
      },
      addProcedimiento() {
        this.informe.procediminetos.push({ tipoProcedimineto: '' });
      },
      removeProcedimiento(index) {
        this.informe.procediminetos.splice(index, 1);
      },
      addPlaga() {
        this.informe.plagas.push({ tipoPlaga: '' });
      },
      removePlaga(index) {
        this.informe.plagas.splice(index, 1);
      },
      limpiarFormulario() {
        this.informe = {
          numFactura: '',
          observacion: '',
          procedimineto: '',
          recomendaciones: '',
          concurrencia: '',
          frecuencia: '',
          precio: '',
          idOrden: '',
          procediminetos: [{ tipoProcedimineto: '' }],
          plagas: [{ tipoPlaga: '' }]
        };
      }
    }
  };
  </script>
  
  <style scoped>
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
  
  .informes-table th, .informes-table td {
    padding: 0.75rem;
    border: 1px solid #ccc;
    text-align: left;
  }
  
  .informes-table th {
    background-color: #181C71;
    color: white;
  }
  
  ul {
    padding-left: 20px;
  }
  
  .procedimiento-group {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .procedimiento-group input {
    flex: 1;
    margin-right: 0.5rem;
  }
  
  .procedimiento-group button {
    background-color: red;
    padding: 0.4rem;
  }
  </style>
  