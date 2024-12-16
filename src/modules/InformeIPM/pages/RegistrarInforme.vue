<template>
  <div class="informe-container">
    <div class="informe-form">
      <h1>Ingresar Informe IPM</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="numFactura">Número de Factura</label>
          <input type="text" id="numFactura" v-model="informe.numFactura" placeholder="Número de Factura" />
        </div>
        <div class="form-group">
          <label for="observacion">Observación</label>
          <textarea id="observacion" v-model="informe.observacion" placeholder="Observación"></textarea>
        </div>
        <div class="form-group">
          <label for="procedimiento">Procedimiento</label>
          <input type="text" id="procedimiento" v-model="informe.procedimiento" placeholder="Procedimiento" />
        </div>
        <div class="form-group">
          <label for="recomendaciones">Recomendaciones</label>
          <textarea id="recomendaciones" v-model="informe.recomendaciones" placeholder="Recomendaciones"></textarea>
        </div>
        <div class="form-group">
          <label for="tiempo">Tiempo</label>
          <input type="time" id="tiempo" v-model="informe.tiempo" placeholder="Tiempo" />
        </div>
        <div class="form-group">
          <label for="frecuencia">Frecuencia</label>
          <select id="frecuencia" v-model="informe.frecuencia">
            <option value="" disabled selected>Selecciona una frecuencia</option>
            <option v-for="frecuencia in frecuencias" :key="frecuencia" :value="frecuencia">
              {{ frecuencia }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="precio">Precio</label>
          <input type="number" id="precio" v-model="informe.precio" placeholder="Precio" />
        </div>
        <div>
          <label for="ordenSelect">Seleccionar Orden de Trabajo:</label>
          <select id="ordenSelect" v-model="informe.idOrden" @change="cargarOrdenSeleccionada">
            <option value="">Seleccione una orden</option>
            <option v-for="orden in ordenes" :key="orden.id" :value="orden.id">
              {{ orden.numeroOrden }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Procedimientos</label>
          <div v-for="(procedimiento, index) in informe.procedimientos" :key="index" class="procedimiento-group">
            <select v-model="procedimiento.tipoProcedimiento">
              <option disabled value="">Procedimientos</option>
              <option v-for="proc in procedimientosLista" :key="proc" :value="proc">
                {{ proc }}
              </option>
            </select>
            <button type="button" @click="removeProcedimiento(index)">Eliminar</button>
          </div>
          <button type="button" @click="addProcedimiento">Añadir Procedimiento</button>
        </div>
        <div class="form-group">
          <label>Plagas</label>
          <div v-for="(plaga, plagaIndex) in informe.plagas" :key="plagaIndex" class="plaga-group">
            <div class="plaga-header">
              <input type="text" v-model="plaga.tipoPlaga" placeholder="Tipo de Plaga" />
              <button type="button" @click="removePlaga(plagaIndex)">Eliminar Plaga</button>
            </div>
            <div v-for="(producto, productoIndex) in plaga.cantidadProductoPlaga" :key="productoIndex" class="producto-group">
              <select v-model="producto.productoDto">
                <option disabled value="">Seleccione un producto</option>
                <option v-for="producto in productos" :key="producto.id" :value="producto">
                  {{ producto.nombre }}
                </option>
              </select>
              <input type="number" v-model="producto.cantidadProducto" placeholder="Cantidad" min="0" />
              <button type="button" @click="removeProducto(plagaIndex, productoIndex)">Eliminar Producto</button>
            </div>
            <button type="button" @click="addProducto(plagaIndex)">Añadir Producto</button>
          </div>
          <button type="button" @click="addPlaga">Añadir Plaga</button>
        </div>
        <div class="sanitizacion-row">
          <div class="input-group">
            <label>Área Interna</label>
            <select v-model="informe.sanitizacionConfidenciales.areaInterna">
              <option disabled value="">Seleccione una opción</option>
              <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="input-group">
            <label>Área Externa</label>
            <select v-model="informe.sanitizacionConfidenciales.areaExterna">
              <option disabled value="">Seleccione una opción</option>
              <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="input-group">
            <label>Nombre del Área Opcional 1</label>
            <input v-model="informe.sanitizacionConfidenciales.areaNombreOpc1" type="text" placeholder="Nombre del Área Opcional 1">
            <select v-model="informe.sanitizacionConfidenciales.areaOpc1">
              <option disabled value="">Seleccione una opción</option>
              <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="input-group">
            <label>Nombre del Área Opcional 2</label>
            <input v-model="informe.sanitizacionConfidenciales.areaNombreOpc2" type="text" placeholder="Nombre del Área Opcional 2">
            <select v-model="informe.sanitizacionConfidenciales.areaOpc2">
              <option disabled value="">Seleccione una opción</option>
              <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>
        <button type="submit">Guardar</button>
      </form>

    </div>

  </div>
</template>

<script>
import { obtenerTodosLosProductosFachada } from '../../Producto/helpers/productosHelpers';
import { consultarOrdenFachada } from '../../OrdenTrabajo/helpers/OrdenTrabajoHelper';
import { crearInformePlagaFachada } from '../helpers/InformeHelper';
import Footer from '../../../components/Footer.vue';

export default {
  name: "InformeIpm",
  components:{
  Footer
  },
  data() {
    return {
      informe: {
        numFactura: '',
        observacion: '',
        recomendaciones: '',
        tiempo: '',
        frecuencia: '',
        precio: '',
        idOrden: '',
        sanitizacionConfidenciales: {
          areaInterna: '',
          areaExterna: '',
          areaOpc1: '',
          areaOpc2: '',
          areaNombreOpc1: '',
          areaNombreOpc2: ''
        },
        plagas: [
          {
            tipoPlaga: '',
            cantidadProductoPlaga: [
              {
                cantidadProducto: 0,
                productoDto: ''
              }
            ]
          }
        ],
        procedimientos: [
          { tipoProcedimiento: '' } // Inicialmente un procedimiento
        ]
      },
      procedimientosLista: [
        'NEBULIZADOR TÉRMICO',
        'ASPERSOR MANUAL',
        'NEBULIZADOR UVL ELÉCTRICO DIINA FOG',
        'NEBULIZADOR MECÁNICO',
        'LÁMPARAS ELECTROCUTADORAS/ATRAPADORAS',
        'BIOMONITORES PEGABLES',
        'ESTACIONES DE CEBADO',
        'CORDÓN SANITARIO PERIMETRAL',
        'NEBULIZADOR UVL ELECTRICO',
        'NEBULIZADOR MECÁNICO',
        'SANITIZACIÓN'
      ],
      productos: [],
      ordenes: [],
      frecuencias: ['MENSUAL', 'BIMENSUAL', 'TRIMESTRAL', 'OCASIONAL']
    };
  },
  mounted() {
    this.cargarProductos();
    this.cargarOrdenes();
  },
  methods: {
    async submitForm() {
      try {
        console.log('Informe IPM creado con éxito:', this.informe);
        const informeDto = {
          numFactura: this.informe.numFactura,
          observacion: this.informe.observacion,
          procediminetoDtos: this.informe.procedimientos.map(p => ({
            tipoProcedimiento: p.tipoProcedimiento
          })),
          recomendaciones: this.informe.recomendaciones,
          frecuencia: this.informe.frecuencia,
          precio: this.informe.precio,
          ordenDto: {
            id: this.informe.idOrden
          },
          plagaDtos: this.informe.plagas.map(plaga => ({
            tipoPlaga: plaga.tipoPlaga,
            cantidadProductoPlaga: plaga.cantidadProductoPlaga.map(cp => ({
              productoDto: cp.productoDto,
              cantidadProducto: cp.cantidadProducto
            }))
          })),
          sanitizacionConfidencialDto: {
            areaInterna: this.informe.sanitizacionConfidenciales.areaInterna,
            areaExterna: this.informe.sanitizacionConfidenciales.areaExterna,
            areaOpc1: this.informe.sanitizacionConfidenciales.areaOpc1,
            areaOpc2: this.informe.sanitizacionConfidenciales.areaOpc2,
            areaNombreOpc1: this.informe.sanitizacionConfidenciales.areaNombreOpc1,
            areaNombreOpc2: this.informe.sanitizacionConfidenciales.areaNombreOpc2
          }
        };
        const nuevoInforme = await crearInformePlagaFachada(informeDto);
        console.log('Informe IPM creado con éxito:', nuevoInforme);
        this.limpiarFormulario(); 
        this.cargarInformes(); 
      } catch (error) {
        console.error('Error al crear el informe IPM:', error);
      }
    },

    addProcedimiento() {
      this.informe.procedimientos.push({ tipoProcedimiento: '' });
    },
    removeProcedimiento(index) {
      this.informe.procedimientos.splice(index, 1);
    },
    addPlaga() {
      this.informe.plagas.push({
        tipoPlaga: '',
        cantidadProductoPlaga: [
          {
            cantidadProducto: 0,
            productoDto: ''
          }
        ]
      });
    },
    removePlaga(plagaIndex) {
      this.informe.plagas.splice(plagaIndex, 1);
    },
    addProducto(plagaIndex) {
      this.informe.plagas[plagaIndex].cantidadProductoPlaga.push({
        cantidadProducto: 0,
        productoDto: ''
      });
    },
    removeProducto(plagaIndex, productoIndex) {
      this.informe.plagas[plagaIndex].cantidadProductoPlaga.splice(productoIndex, 1);
    },
    limpiarFormulario() {
      this.informe = {
        numFactura: '',
        observacion: '',
        recomendaciones: '',
        tiempo: '',
        frecuencia: '',
        precio: '',
        idOrden: '',
        sanitizacionConfidenciales: {
          areaInterna: '',
          areaExterna: '',
          areaOpc1: '',
          areaOpc2: '',
          areaNombreOpc1: '',
          areaNombreOpc2: ''
        },
        plagas: [
          {
            tipoPlaga: '',
            cantidadProductoPlaga: [
              {
                cantidadProducto: 0,
                productoDto: ''
              }
            ]
          }
        ],
        procedimientos: [{ tipoProcedimiento: '' }]
      };
    },
    async cargarProductos() {
      try {
        this.productos = await obtenerTodosLosProductosFachada();
      } catch (error) {
        console.error('Error al cargar los productos:', error);
        alert('Hubo un error al cargar los productos.');
      }
    },
    async cargarOrdenes() {
      try {
        this.ordenes = await consultarOrdenFachada(); // Asegúrate de que este método esté definido y disponible
      } catch (error) {
        console.error('Error al cargar las órdenes:', error);
        alert('Hubo un error al cargar las órdenes.');
      }
    }
  }
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
  color: #181C71;
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

.informes-table th,
.informes-table td {
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