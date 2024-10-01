<template>
  <div class="informe-container">
    <div class="informe-form">
      <h1>Ingresar Informe IPM</h1>
      <form @submit.prevent="submitForm2">
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
          <div v-for="(plaga, plagaIndex) in informe.plagas" :key="plagaIndex" class="plaga-group">
            <div class="plaga-header">
              <input type="text" v-model="plaga.tipoPlaga" placeholder="Tipo de Plaga" class="plaga-input" />
              <button type="button" @click="removePlaga(plagaIndex)">Eliminar Plaga</button>
            </div>

            <!-- Productos dentro de la Plaga -->
            <div v-for="(producto, productoIndex) in plaga.cantidadProductoDtos" :key="productoIndex"
              class="producto-group">

              <!-- Selección de producto -->
              <select id="idProductos" v-model="producto.productoDto">
                <option disabled value="">Seleccione un producto</option>
                <option v-for="producto in productos" :key="producto.id" :value="producto.id">
                  {{ producto.nombre }}
                </option>
              </select>


              <input type="number" v-model="producto.cantidad" placeholder="Cantidad" class="cantidad-input" min="0" />
              <button type="button" @click="removeProducto(plagaIndex, productoIndex)">Eliminar Producto</button>
            </div>

            <!-- Botón para añadir un nuevo Producto a la Plaga -->
            <button type="button" @click="addProducto(plagaIndex)">Añadir Producto</button>
          </div>
          <!-- Botón para añadir una nueva Plaga -->
          <button type="button" @click="addPlaga">Añadir Plaga</button>
        </div>

        <!-- Botón de Guardar -->
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
            <td>
              <button @click="generatePDF(informe)">Generar PDF</button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  crearInformeFachada,
  consultarInformeFachada,
  crearInformePlagaFachada

} from '../helpers/InformeHelper';
import jsPDF from 'jspdf';
import { obtenerTodosLosProductosFachada } from '../../Producto/helpers/productosHelpers';
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
          {
            tipoPlaga: '',
            cantidadProductoDtos: [
              {
                cantidad: 0,
                productoDto: ''
              }
            ]
          }
        ],
        procediminetos: [
          { tipoProcedimineto: '' } // Inicialmente un procedimiento
        ]
      },
      productos: [],
      informes: [] // Array para almacenar los informes existentes
    };
  },
  mounted() {
    this.cargarInformes(); // Cargamos los informes al montar el componente
    this.cargarProductos();
  },
  methods: {
    async submitForm2() {
      try {
        console.log('Informe IPM creado con éxito 2:', this.informe);
        const informeDto = {
          numFactura: this.informe.numFactura,
          observacion: this.informe.observacion,
          procedimineto: this.informe.procedimineto,
          recomendaciones: this.informe.recomendaciones,
          concurrencia: this.informe.concurrencia,
          frecuencia: this.informe.frecuencia,
          precio: this.informe.precio,
          ordenDto: {
            id: this.informe.idOrden
          },
          procediminetoDtos: this.informe.procediminetos.map(p => ({
            tipoProcedimineto: p.tipoProcedimineto
          })),
          plagaDtos: this.informe.plagas.map(plaga => ({
            tipoPlaga: plaga.tipoPlaga,
            cantidadProductoDtos: plaga.cantidadProductoDtos.map(cp => ({
              productoDto: cp.productoDto,
              cantidad: cp.cantidad
            }))
          }))
        };
        const nuevoInforme = await crearInformePlagaFachada(informeDto);
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
      this.informe.plagas.push({
        tipoPlaga: '',
        cantidadProductoDtos: [
          {
            cantidad: 0,
            productoDto: ''
          }
        ]
      });
    },
    removePlaga(plagaIndex) {
      this.informe.plagas.splice(plagaIndex, 1);
    },
    addProducto(plagaIndex) {
      this.informe.plagas[plagaIndex].cantidadProductoDtos.push({
        cantidad: 0,
        productoDto: ''
      });
    },
    removeProducto(plagaIndex, productoIndex) {
      this.informe.plagas[plagaIndex].cantidadProductoDtos.splice(productoIndex, 1);
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
        plagas: [
          {
            tipoPlaga: '',
            cantidadProductoDtos: [
              {
                cantidad: 0,
                productoDto: ''
              }
            ]
          }
        ],
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
    generatePDF(informe) {
      const doc = new jsPDF();

      // Configuración inicial del PDF
      let yPosition = 10;

      // Agregar contenido al PDF con datos del informe
      doc.setFontSize(12);
      doc.text(`Número de Factura: ${informe.numFactura}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Observación: ${informe.observacion}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Procedimiento: ${informe.procedimineto}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Recomendaciones: ${informe.recomendaciones}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Concurrencia: ${informe.concurrencia}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Frecuencia: ${informe.frecuencia}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Precio: ${informe.precio}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Cliente: ${informe.ordenDto.cliente.nombre}`, 10, yPosition);
      yPosition += 15;

      // Procedimientos
      doc.setFontSize(14);
      doc.text('Procedimientos:', 10, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      informe.procediminetoDtos.forEach((proc, index) => {
        doc.text(`${index + 1}. ${proc.tipoProcedimineto}`, 15, yPosition);
        yPosition += 10;
      });
      yPosition += 5;

      // Plagas
      doc.setFontSize(14);
      doc.text('Plagas:', 10, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      informe.plagaDtos.forEach((plaga, index) => {
        doc.text(`${index + 1}. ${plaga.tipoPlaga}`, 15, yPosition);
        yPosition += 10;

        // Productos dentro de la Plaga
        plaga.cantidadProductoDtos.forEach((cp, cpIndex) => {
          doc.text(`   - Producto: ${cp.productoDto}`, 20, yPosition);
          yPosition += 7;
          doc.text(`     Cantidad: ${cp.cantidad}`, 20, yPosition);
          yPosition += 10;
        });
      });

      // Descargar el PDF
      doc.save(`informe_${informe.numFactura}.pdf`);
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
