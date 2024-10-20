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

        <!-- Tiempo -->
        <div class="form-group">
          <label for="tiempo">Tiempo</label>
          <input type="time" id="tiempo" v-model="informe.tiempo" placeholder="Tiempo" />
        </div>

        <!-- Frecuencia -->
        <div class="form-group">
          <label for="frecuencia">Frecuencia</label>
          <select id="frecuencia" v-model="informe.frecuencia" class="form-control">
            <option value="" disabled selected>Selecciona una frecuencia</option>
            <option v-for="frecuencia in frecuencias" :key="frecuencia" :value="frecuencia">
              {{ frecuencia }}
            </option>
          </select>
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

            <select id="idProcedimientos" v-model="procedimineto.tipoProcedimineto">
              <option disabled value="">Procesdimientos</option>
              <option v-for="(proc, index) in procedimientos" :key="proc.id" :value="index">
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
              <input type="text" v-model="plaga.tipoPlaga" placeholder="Tipo de Plaga" class="plaga-input" />
              <button type="button" @click="removePlaga(plagaIndex)">Eliminar Plaga</button>
            </div>

            <!-- Productos dentro de la Plaga -->
            <div v-for="(producto, productoIndex) in plaga.cantidadProductoPlaga" :key="productoIndex"
              class="producto-group">

              <!-- Selección de producto -->
              <select id="idProductos" v-model="producto.productoDto">
                <option disabled value="">Seleccione un producto</option>
                <option v-for="producto in productos" :key="producto.id" :value="producto">
                  {{ producto.nombre }}
                </option>
              </select>


              <input type="number" v-model="producto.cantidadProducto" placeholder="Cantidad" class="cantidad-input"
                min="0" />
              <button type="button" @click="removeProducto(plagaIndex, productoIndex)">Eliminar Producto</button>
            </div>

            <!-- Botón para añadir un nuevo Producto a la Plaga -->
            <button type="button" @click="addProducto(plagaIndex)">Añadir Producto</button>
          </div>
          <!-- Botón para añadir una nueva Plaga -->
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
            <div class="input-group">
              <label>Nombre del Área Opcional 1</label>
              <input v-model="informe.sanitizacionConfidenciales.areaNombreOpc1" type="text"
                placeholder="Nombre del Área Opcional 1">
            </div>
            <select v-model="informe.sanitizacionConfidenciales.areaOpc1">
              <option disabled value="">Seleccione una opción</option>
              <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <div class="input-group">
            <div class="input-group">
              <label>Nombre del Área Opcional 2</label>
              <input v-model="informe.sanitizacionConfidenciales.areaNombreOpc2" type="text"
                placeholder="Nombre del Área Opcional 2">
            </div>
            <select v-model="informe.sanitizacionConfidenciales.areaOpc2">
              <option disabled value="">Seleccione una opción</option>
              <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
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
            <th>Frecuencia</th>
            <th>Precio</th>
            <th>cLIENTE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(informe) in informes" :key="informe.id">
            <td>{{ informe.id }}</td>
            <td>{{ informe.numFactura }}</td>
            <td>{{ informe.frecuencia }}</td>
            <td>{{ informe.precio }}</td>
            <td>{{ informe.ordenDto.cliente.nombre }}</td>
            <td>
              <button @click="generatePDF(informe)">Generar PDF</button>

            </td>
            <td>
              <button @click="redirigirFormularioIPM(informe.id)">Formulario</button>

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
import JsPDFAutotable from 'jspdf-autotable'
import { obtenerTodosLosProductosFachada } from '../../Producto/helpers/productosHelpers';
import router from '@/router';
import { consultarDesratizacionFachadaPorIdInforme } from '../helpers/desratizacionHelper';

export default {
  name: "InformeIpm",
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
        procediminetos: [
          { tipoProcedimineto: '' } // Inicialmente un procedimiento
        ]
      },
      procedimientos: ['NEBULIZADOR TÉRMICO',
        'ASPERSOR MANUAL',
        'NEBULIZADOR UVL ELÉCTRICO DIINA FOG',
        'NEBULIZADOR MECÁNICO',
        'LÁMPARAS ELECTROCUTADORAS/ATRAPADORAS',
        'BIOMONITORES PEGABLES',
        'ESTACIONES DE CEBADO',
        'CORDÓN SANITARIO PERIMETRAL',
        'NEBULIZADOR UVL ELECTRICO',
        'NEBULIZADOR MECÁNICO',
        'SANITIZACIÓN'],

      productos: [],
      informes: [],
      frecuencias: ['MENSUAL', 'BIMENSUAL', 'TRIMESTRAL', 'OCASIONAL']
    };
  },
  mounted() {
    this.cargarInformes(); // Cargamos los informes al montar el componente
    this.cargarProductos();
  },
  methods: {
    async submitForm() {
      try {
        console.log('Informe IPM creado con éxito:', this.informe);
        const nuevoInforme = await crearInformePlagaFachada(this.informe);
        console.log('Informe IPM creado con éxito:', nuevoInforme);
        this.limpiarFormulario();
        this.cargarInformes(); // Recargamos los informes después de crear uno nuevo
      } catch (error) {
        console.error('Error al crear el informe IPM:', error);
      }
    },
    async submitForm2() {
      try {
        console.log('Informe IPM creado con éxito 2:', this.informe);
        const informeDto = {
          numFactura: this.informe.numFactura,
          observacion: this.informe.observacion,
          procedimineto: this.informe.procedimineto,
          recomendaciones: this.informe.recomendaciones,
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
            cantidadProductoPlaga: plaga.cantidadProductoPlaga.map(cp => ({
              productoDto: cp.productoDto,
              cantidadProducto: cp.cantidadProducto
            }))
          })),
          sanitizacionConfidencialDto: { // Cambia 'sanitizacionConfidencialDtos' por 'sanitizacionConfidencialDto'
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

    async cargarInformesPorId(id) {
      try {
        return await consultarDesratizacionFachadaPorIdInforme(id);
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
        cantidadProductoPlaga: [
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
      this.informe.plagas[plagaIndex].cantidadProductoPlaga.push({
        cantidad: 0,
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
        procediminetos: [{ tipoProcedimineto: '' }],
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
      };
    },
    async redirigirFormularioIPM(id) {
      const ruta = `/desratizacion/${id}`;
      await router.push({ path: ruta });
    },

    async cargarProductos() {
      try {
        this.productos = await obtenerTodosLosProductosFachada();
      } catch (error) {
        console.error('Error al cargar los productos:', error);
        alert('Hubo un error al cargar los productos.');
      }
    },
    async generatePDF(informe) {
      const doc = new jsPDF('portrait', 'pt', 'a4'); // Orientación vertical

      const headerHeight = 65;
      const footerHeight = 65;
      const pageWidth = doc.internal.pageSize.width;

      // Función para generar un degradado simulado entre dos colores
      const drawGradient = (doc, x, y, width, height, color1, color2, steps) => {
        for (let i = 0; i <= steps; i++) {
          const ratio = i / steps;
          const r = Math.floor(color1.r * (1 - ratio) + color2.r * ratio);
          const g = Math.floor(color1.g * (1 - ratio) + color2.g * ratio);
          const b = Math.floor(color1.b * (1 - ratio) + color2.b * ratio);

          doc.setFillColor(r, g, b);
          doc.rect(x + (i * (width / steps)), y, width / steps, height, 'F');
        }
      };

      // Colores
      const white = { r: 255, g: 255, b: 255 };
      const blue = { r: 69, g: 150, b: 217 };
      // Anchos de las secciones del degradado
      const sectionWidth = pageWidth / 10; // Ancho de cada sección (10 partes)

      // Crear degradado en el encabezado
      drawGradient(doc, 0, 0, sectionWidth * 2, headerHeight, white, white, 50); // 20% blanco
      drawGradient(doc, sectionWidth * 2, 0, sectionWidth * 2.9, headerHeight, white, blue, 50); // 29% blanco a azul
      drawGradient(doc, sectionWidth * 4.9, 0, sectionWidth * 0.2, headerHeight, blue, blue, 50); // 2% azul
      drawGradient(doc, sectionWidth * 5.1, 0, sectionWidth * 2.9, headerHeight, blue, white, 50); // 29% azul a blanco
      drawGradient(doc, sectionWidth * 8, 0, sectionWidth * 2, headerHeight, white, white, 50); // 20% blanco
      // Logo (ajusta la posición y tamaño según sea necesario)
      const logo = 'src/assets/fumidez_logo.png'; // Reemplaza con la ruta de tu logo
      doc.addImage(logo, 'PNG', 10, 14, 125, 40); // X, Y, Width, Height

      // Texto en el encabezado
      doc.setFont('cambria', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 0, 0);
      doc.text('INFORME I.P.M', pageWidth - 25, 30, null, null, 'right');
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 255);
      doc.text('MANEJO INTEGRADO DE PLAGAS', pageWidth - 25, 50, null, null, 'right');

      doc.setDrawColor(32, 76, 130); // Color para la línea divisoria

      // División vertical
      doc.setLineWidth(0.75); // Cambia el valor para ajustar el grosor (2 es más grueso que el valor predeterminado)
      const divisionX = pageWidth / 5;
      doc.line(divisionX, headerHeight, divisionX, doc.internal.pageSize.height - footerHeight);

      // Imágenes en el lado izquierdo (ajustar rutas y posiciones)
      const image1 = 'src/assets/CamaraComercio.png';
      const image2 = 'src/assets/RegistroSanitario.png';
      const image3 = 'src/assets/SAQ.png';
      const image4 = 'src/assets/seal.png';
      const image5 = 'src/assets/oms.png';

      doc.setTextColor(32, 76, 130);
      doc.setFont('cambria', 'bold');
      doc.setFontSize(8);

      // Añadir imágenes con pie de imagen
      doc.addImage(image1, 'PNG', 10, headerHeight + 40, 100, 40);
      doc.text('REG. MERCANTIL 18392', 10, headerHeight + 90);

      doc.addImage(image2, 'PNG', -5, headerHeight + 135, 130, 80);
      doc.text('ARCSA-2020-12.3-0000320', 12, headerHeight + 215);

      doc.addImage(image3, 'PNG', 10, headerHeight + 360, 100, 40);
      doc.text('MAEE-RA-2020-364760', 20, headerHeight + 410);

      doc.addImage(image4, 'PNG', 28, headerHeight + 458, 60, 60);

      doc.addImage(image5, 'PNG', 30, headerHeight + 573, 60, 60);

      doc.setFontSize(7);
      doc.text('UTILIZAMOS QUÍMICOS \nAPROBADOS POR \nEPA Y OMS', 20, 350);

      doc.setFontSize(8);
      doc.setFont('cambria', 'normal');

      // Lado derecho de la división
      doc.text(`CLIENTE: ${informe.ordenDto.cliente.nombre}`, divisionX + 10, headerHeight + 20);
      doc.text(`FACTURA Nº: ${informe.numFactura}`, divisionX + 10, headerHeight + 40);
      doc.text(`AREA TRATADA: ${informe.ordenDto.area}`, divisionX + 10, headerHeight + 60);
      doc.text(`FECHA: ${informe.ordenDto.fecha}`, divisionX + 10, headerHeight + 80);
      // Definir posiciones y dimensiones
      const cuadroX = divisionX + 10; // Margen a la derecha de la línea divisoria
      const cuadroY = headerHeight + 90; // Posición Y ajustada hacia arriba
      const cuadroWidth = (pageWidth - divisionX) * 0.45; // Aproximadamente 45% del ancho restante
      const cuadroHeight = 130; // Altura ligeramente reducida
      const tablaWidth = pageWidth - cuadroX - 250; // Ancho definido para el cuadro


      // --- Agregar Cuadro "Tipo de servicio" ---

      let serviciosY = headerHeight + 30;
      let cabeceraTipoServicio = [{ title: 'TIPO DE SERVICIO', dataKey: 'servicio' }];
      let distanciaDerecha = cuadroX + 228;

      // Tabla para la cabecera (se mantiene en su posición)
      doc.autoTable({
        head: [cabeceraTipoServicio.map(col => col.title)],  // Título de la cabecera
        startY: serviciosY,  // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },  // La cabecera se queda en la posición original
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'center',  // Alineación a la izquierda
          fontSize: 12, // Tamaño de la fuente para la cabecera
          lineColor: [37, 123, 205],
          cellWidth: tablaWidth
        },
        styles: {
          lineColor: [37, 123, 205],
          lineWidth: 0.5, // Ancho de las líneas

        },
        columnStyles: {
          0: { cellWidth: tablaWidth },  // Mantiene el ancho de la cabecera
        },
        tableWidth: 'wrap',
      });

      const seleccion = informe.frecuencia;

      let datosTabla = [
        [
          seleccion === 'MENSUAL' ? 'X' : ' ', // Marca si es MENSUAL
          seleccion === 'BIMENSUAL' ? 'X' : ' ', // Marca si es BIMENSUAL
          seleccion === 'TRIMESTRAL' ? 'X' : ' ', // Marca si es TRIMESTRAL
          seleccion === 'OCASIONAL' ? 'X' : ' ', // Marca si es OCASIONAL
          ' '  // Última celda vacía
        ],
        ['MENSUAL', 'BIMENSUAL', 'TRIMESTRAL', 'OCASIONAL', '____'],  // Segunda fila
      ];

      serviciosY = serviciosY + 20;

      doc.autoTable({
        body: datosTabla,
        startY: serviciosY,
        margin: { left: distanciaDerecha },
        theme: 'grid',

        bodyStyles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 6,
          cellPadding: 3,
          halign: 'center',
        },
        styles: {
          cellWidth: 'wrap',  // Ajusta el ancho de las celdas al contenido
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [37, 123, 205],
          lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
          0: { cellWidth: tablaWidth * 0.2 },  // Ancho de la primera columna (título de las áreas)
          1: { cellWidth: tablaWidth * 0.2 },  // Ancho de las columnas de calificación
          2: { cellWidth: tablaWidth * 0.2 },
          3: { cellWidth: tablaWidth * 0.2 },
          4: { cellWidth: tablaWidth * 0.2 },

        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });

      // --- Agregar Cuadro "PLAGAS" ---
      let cabeceraPlagas = [{ title: 'Plagas', dataKey: 'plagas' },
      { title: 'Producto', dataKey: 'producto' },
      { title: 'Cantidad', dataKey: 'cantidad' },
      { title: 'Tiempo', dataKey: 'tiempo' }];

      let filasPlagas = [];
      if (Array.isArray(informe.plagaDtos)) {
        informe.plagaDtos.forEach(plaga => {
          if (Array.isArray(plaga.cantidadProductoPlaga)) {
            let firstRow = true;  // Para controlar cuándo escribir el nombre de la plaga
            plaga.cantidadProductoPlaga.forEach(producto => {
              filasPlagas.push([
                firstRow ? plaga.tipoPlaga : '',  // Solo poner el nombre de la plaga en la primera fila
                producto.productoDto.nombre,
                producto.cantidadProducto,
                informe.tiempo
              ]);
              firstRow = false;  // Para las siguientes filas, dejar el campo vacío
            });
          }
        });
      }

      serviciosY = serviciosY + 40;

      doc.autoTable({
        head: [cabeceraPlagas.map(col => col.title)],  // Título de la cabecera
        body: filasPlagas,
        startY: serviciosY,  // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'center',  // Alineación a la izquierda
          fontSize: 10, // Tamaño de la fuente para la cabecera
          lineColor: [37, 123, 205],
          cellWidth: tablaWidth * 0.25
        },
        bodyStyles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 6,  // Tamaño de la fuente para el contenido
          cellPadding: 3,  // Espacio interno de las celdas
          halign: 'center',  // Alineación horizontal del contenido
        },
        styles: {
          cellWidth: 'wrap',  // Ajusta el ancho de las celdas al contenido
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [37, 123, 205],
          lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
          0: { cellWidth: tablaWidth * 0.25 },
          1: { cellWidth: tablaWidth * 0.25 },
          2: { cellWidth: tablaWidth * 0.25 },
          3: { cellWidth: tablaWidth * 0.25 },
        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });

      console.log("Cantidad de filas")
      console.log(filasPlagas.length)

      let formularioY = serviciosY + (filasPlagas.length * 15) + 30;
      let cabeceraFormulario = [{ title: 'IDENTIFICACIÓN Y RELACIÓN DEL CONTROL DE ROEDORES', dataKey: 'servicio' }];

      doc.autoTable({
        head: [cabeceraFormulario.map(col => col.title)],  // Título de la cabecera
        startY: formularioY,  // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'center',  // Alineación a la izquierda
          fontSize: 8, // Tamaño de la fuente para la cabecera
          lineColor: [37, 123, 205],
          cellWidth: tablaWidth
        },
        styles: {
          cellWidth: 'wrap',  // Ajusta el ancho de las celdas al contenido
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [37, 123, 205],
          lineWidth: 0.5, // Ancho de las líneas
        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });


      let formulariosIPM = await this.cargarInformesPorId(informe.id);
      console.log(formulariosIPM);
      const datosFormulario = {
        ubicacion: 'Formulario IPM',
        conSi: 0,
        conNo: 0,
        totalCeb: 0,
        rodentP: '',
        rodentC: ''

      }
      const datosFormularioCordon = {
        ubicacion: 'Formulario Cordon',
        conSi: 0,
        conNo: 0,
        totalCeb: 0,
        rodentP: '',
        rodentC: ''

      }
      if (Array.isArray(formulariosIPM)) {
        formulariosIPM.forEach(formulario => {
          if (formulario.tipoIdentificadorCordon) {

            if (formulario.consumo == 'SI') {
              datosFormulario.conSi += 1;
            } else {
              datosFormulario.conNo += 1;
            }
            if (formulario.reemplazoPegaCebo == true) {
              datosFormulario.rodentP = 'X';
            } else {
              datosFormulario.rodentC = 'X';
            }
            datosFormulario.totalCeb += 1;
          } else {
            if (formulario.consumo == 'SI') {
              datosFormularioCordon.conSi += 1;
            } else {
              datosFormularioCordon.conNo += 1;
            }
            if (formulario.reemplazoPegaCebo == true) {
              datosFormularioCordon.rodentP = 'X';
            } else {
              datosFormularioCordon.rodentC = 'X';
            }
            datosFormularioCordon.totalCeb += 1;

          }
        });
        console.log(datosFormulario);

      }

      formularioY = formularioY + 25;

      doc.autoTable({
        head: [
          ['UBICACIÓN', 'CON. SI', 'CON. NO', 'TOTAL CEB', 'RODENT. PEGA', 'RODENT. CB']
        ],
        body: [
          [datosFormulario.ubicacion, datosFormulario.conSi, datosFormulario.conNo, datosFormulario.totalCeb, datosFormulario.rodentP, datosFormulario.rodentC],
        ],
        startY: formularioY,  // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'center',  // Alineación a la izquierda
          fontSize: 5, // Tamaño de la fuente para la cabecera
          lineColor: [37, 123, 205],
        },
        bodyStyles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 6,  // Tamaño de la fuente para el contenido
          cellPadding: 3,  // Espacio interno de las celdas
          halign: 'center',  // Alineación horizontal del contenido
        },
        styles: {
          cellWidth: 'wrap',  // Ajusta el ancho de las celdas al contenido
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [37, 123, 205],
          lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
          0: { cellWidth: tablaWidth * 0.30 },
          1: { cellWidth: tablaWidth * 0.14 },
          2: { cellWidth: tablaWidth * 0.14 },
          3: { cellWidth: tablaWidth * 0.14 },
          4: { cellWidth: tablaWidth * 0.14 },
          5: { cellWidth: tablaWidth * 0.14 },
        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });

      cabeceraFormulario = [{ title: 'CORDON SANITARIO ESTRUCTURAL', dataKey: 'servicio' }];
      formularioY = formularioY + 35;

      doc.autoTable({
        head: [cabeceraFormulario.map(col => col.title)],  // Título de la cabecera
        startY: formularioY,  // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'center',  // Alineación a la izquierda
          fontSize: 8, // Tamaño de la fuente para la cabecera
          lineColor: [37, 123, 205],
          cellWidth: tablaWidth
        },
        styles: {
          cellWidth: 'wrap',  // Ajusta el ancho de las celdas al contenido
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [37, 123, 205],
          lineWidth: 0.5, // Ancho de las líneas
        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });

      formularioY = formularioY + 17;

      doc.autoTable({
        head: [
          ['UBICACIÓN', 'CON. SI', 'CON. NO', 'TOTAL CEB', 'RODENT. PEGA', 'RODENT. CB']
        ],
        body: [
          ['GUARDIANÍA', datosFormularioCordon.conSi, datosFormularioCordon.conNo, datosFormularioCordon.totalCeb, datosFormularioCordon.rodentP, datosFormularioCordon.rodentC],
          ['GRAN TOTAL:', (datosFormularioCordon.conSi + datosFormulario.conSi), (datosFormularioCordon.conNo + datosFormulario.conNo), (datosFormularioCordon.totalCeb + datosFormulario.totalCeb), '', ''],
        ],
        startY: formularioY,  // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'center',  // Alineación a la izquierda
          fontSize: 5, // Tamaño de la fuente para la cabecera
          lineColor: [37, 123, 205],
        },
        bodyStyles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 6,  // Tamaño de la fuente para el contenido
          cellPadding: 3,  // Espacio interno de las celdas
          halign: 'center',  // Alineación horizontal del contenido
        },
        styles: {
          cellWidth: 'wrap',  // Ajusta el ancho de las celdas al contenido
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [37, 123, 205],
          lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
          0: { cellWidth: tablaWidth * 0.30 },
          1: { cellWidth: tablaWidth * 0.14 },
          2: { cellWidth: tablaWidth * 0.14 },
          3: { cellWidth: tablaWidth * 0.14 },
          4: { cellWidth: tablaWidth * 0.14 },
          5: { cellWidth: tablaWidth * 0.14 },
        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });

      formularioY = formularioY + 60;

      doc.autoTable({
        head: [
          ['INDICADOR DEL RIESGO', 'BAJO 0 al 14%', 'MEDIO 15 al 30%', 'ALTO sup al 30%']
        ],
        body: [
          ['TOTAL SI X 100 \n___________\n TOTAL CEB. ', ' ', '', '']
        ],
        startY: formularioY,  // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'center',  // Alineación a la izquierda
          fontSize: 5, // Tamaño de la fuente para la cabecera
          lineColor: [37, 123, 205],
        },
        bodyStyles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 6,  // Tamaño de la fuente para el contenido
          cellPadding: 3,  // Espacio interno de las celdas
          halign: 'center',  // Alineación horizontal del contenido
        },
        styles: {
          cellWidth: 'wrap',  // Ajusta el ancho de las celdas al contenido
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [37, 123, 205],
          lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
          0: { cellWidth: tablaWidth * 0.52 },
          1: { cellWidth: tablaWidth * 0.16 },
          2: { cellWidth: tablaWidth * 0.16 },
          3: { cellWidth: tablaWidth * 0.16 },
        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });

      // --- Agregar Cuadro "SANITIZACION CONFIDENCIAL" ---


      doc.autoTable({
        head: [['SANITIZACION CONFIDENCIAL']],  // Título principal
        body: [
          ['1. EXCELENTE  2. BUENO  3. REGULAR  4. CRÍTICO']
        ],
        startY: cuadroY,  // Posición Y donde empieza la tabla
        margin: { left: cuadroX },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],  // Color de la cabecera
          textColor: [37, 123, 205],
          halign: 'center',
          fontSize: 10  // Tamaño de la fuente para la cabecera
        },
        bodyStyles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 6,  // Tamaño de la fuente para el contenido
          cellPadding: 3,  // Espacio interno de las celdas
          halign: 'center',  // Alineación horizontal del contenido
        },
        styles: {
          cellWidth: 'wrap',  // Ajusta el ancho de las celdas al contenido
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
        },
        columnStyles: {
          0: { cellWidth: tablaWidth },  // Ancho de la primera columna (título de las áreas)

        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });

      datosTabla = [
        ['AREAS INTERNAS', '1', '2', '3', '4'],  // Primera fila
        ['AREAS EXTERNAS', '1', '2', '3', '4'],  // Segunda fila
        [informe.sanitizacionConfidencialDto.areaNombreOpc1 ? informe.sanitizacionConfidencialDto.areaNombreOpc1 : 'AREA', '1', '2', '3', '4'],  // Tercera fila
        [informe.sanitizacionConfidencialDto.areaNombreOpc2 ? informe.sanitizacionConfidencialDto.areaNombreOpc2 : 'AREA', '1', '2', '3', '4']   // Cuarta fila
      ];

      doc.autoTable({
        body: datosTabla,
        startY: cuadroY + 32,  // Posición Y donde empieza la tabla
        margin: { left: cuadroX },
        theme: 'grid',

        bodyStyles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 6,  // Tamaño de la fuente para el contenido
          cellPadding: 3,  // Espacio interno de las celdas
          halign: 'center',  // Alineación horizontal del contenido
        },
        styles: {
          cellWidth: 'wrap',  // Ajusta el ancho de las celdas al contenido
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
        },
        columnStyles: {
          0: { cellWidth: tablaWidth * 0.6, halign: 'left' },  // Ancho de la primera columna (título de las áreas)
          1: { cellWidth: tablaWidth * 0.1 },  // Ancho de las columnas de calificación
          2: { cellWidth: tablaWidth * 0.1 },
          3: { cellWidth: tablaWidth * 0.1 },
          4: { cellWidth: tablaWidth * 0.1 },

        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });
      // --- Agregar Cuadro "Observaciones" ---

      // Definir posiciones y dimensiones para el nuevo cuadro
      const observacionesY = cuadroY + 95; // Posición Y donde empieza el cuadro
      const observacionesHeight = 130; // Altura fija para el cuadro de observaciones

      // Dibuja el cuadro
      doc.rect(cuadroX, observacionesY, tablaWidth, observacionesHeight); // Dibuja el cuadro donde va la tabla

      // Añade la tabla dentro del cuadro
      const cabeceraObservacion = [{ title: 'OBSERVACIONES', dataKey: 'observacion' }];
      const textObservacion = [{ observacion: informe.observacion || '' }]; // Asegúrate de que siempre haya un valor

      doc.autoTable({
        head: [cabeceraObservacion.map(col => col.title)],  // Título de la cabecera
        body: textObservacion.map(item => [item.observacion]),  // Datos del cuerpo de la tabla
        startY: observacionesY + 10,  // Añade un margen de 10 debajo del cuadro
        margin: { left: cuadroX },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'center',
          fontSize: 10,  // Tamaño de la fuente para la cabecera
        },
        styles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 7,  // Tamaño de la fuente para el contenido
          cellPadding: 5,
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [37, 123, 205],  // Color de las líneas de la tabla
          lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
          0: {  // Define las propiedades de la primera columna
            cellWidth: tablaWidth,  // Limita el ancho de la columna
            maxCellHeight: 100,  // Limita la altura de las celdas para no exceder el cuadro
            lineColor: [0, 0, 0, 0],  // Bordes transparentes
          },
          1: { // Ejemplo para aplicar al borde derecho
            cellWidth: tablaWidth,
            lineColor: [37, 123, 205], // Color del borde derecho (azul)
            lineWidth: 0.5, // Ancho del borde derecho
          },
          2: {
            cellWidth: tablaWidth,
            lineColor: [0, 0, 0], // Color del borde derecho (azul)
          },
          2: {
            cellWidth: tablaWidth,
            lineColor: [37, 123, 205], // Color del borde derecho (azul)
            lineWidth: 0.5, // Ancho del borde derecho
          },

        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });



      // --- Agregar Cuadro "Procedimientos" ---

      // Definir posiciones y dimensiones para el cuadro "Procedimientos"
      let procedimientosY = observacionesY + observacionesHeight + 10; // 10 puntos de margen debajo del cuadro de observaciones
      const procedimientosHeight = 180; // Altura ajustada para acomodar las categorías y procedimientos

      // Añade la tabla dentro del cuadro
      let cabeceraProcedimiento = [{ title: 'PROCEDIMIENTOS:', dataKey: 'procedimiento' }];
      const textProcedimiento = [{ procedimiento: informe.procedimientos }];
      doc.autoTable({
        head: [cabeceraProcedimiento.map(col => col.title)],  // Título de la cabecera

        startY: procedimientosY,  // Posición Y donde empieza la tabla
        margin: { left: cuadroX },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'left',
          cellWidth: tablaWidth,
          fontSize: 10  // Tamaño de la fuente para la cabecera
        },
        styles: {
          fontSize: 5,  // Tamaño de la fuente para el contenido
          cellPadding: 5,
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
        },

        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });
      procedimientosY = procedimientosY + 17;
      cabeceraProcedimiento = [{ title: 'DESINSECTACION / FUMIGACION', dataKey: 'procedimiento' }];
      // Tabla para la cabecera (se mantiene en su posición)
      doc.autoTable({
        head: [cabeceraProcedimiento.map(col => col.title)],  // Título de la cabecera
        startY: procedimientosY,  // Posición Y donde empieza la tabla
        margin: { left: cuadroX },  // La cabecera se queda en la posición original
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'left',  // Alineación a la izquierda
          fontSize: 8  // Tamaño de la fuente para la cabecera
        },
        styles: {
          lineColor: [0, 0, 0, 0],  // Bordes transparentes
        },
        columnStyles: {
          0: { cellWidth: tablaWidth },  // Mantiene el ancho de la cabecera
        },
        tableWidth: 'wrap',
      });

      // Ajustamos el valor Y para el contenido y agregamos más margen a la izquierda para el cuerpo
      procedimientosY = doc.lastAutoTable.finalY;  // Ajustamos la posición Y después de la cabecera

      // Tabla para el contenido (cuerpo)
      doc.autoTable({
        body: [
          ['NEBULIZADOR TÉRMICO'],  // Primera fila
          ['ASPERSOR MANUAL'],  // Segunda fila
          ['NEBULIZADOR UVL ELÉCTRICO DIINA FOG'],  // Tercera fila
          ['NEBULIZADOR MECÁNICO'],   // Cuarta fila
          ['LÁMPARAS ELECTROCUTADORAS/ATRAPADORAS'],  // Quinta fila
        ],
        startY: procedimientosY,  // Posición Y donde empieza la tabla
        margin: { left: cuadroX + 30 },  // Mueve el cuerpo 20 unidades más a la derecha
        theme: 'grid',
        styles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 5,  // Tamaño de la fuente para el contenido
          cellPadding: 5,
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [0, 0, 0, 0],  // Hace los bordes transparentes
        },
        columnStyles: {
          0: { cellWidth: tablaWidth - 30 },  // Mantiene el ancho del cuerpo
        },
        tableWidth: 'wrap',
      });


      procedimientosY = procedimientosY + 80;
      cabeceraProcedimiento = [{ title: 'DESRATIZACIÓN', dataKey: 'procedimiento' }];
      // Tabla para la cabecera (se mantiene en su posición original)
      doc.autoTable({
        head: [cabeceraProcedimiento.map(col => col.title)],  // Título de la cabecera
        startY: procedimientosY,  // Posición Y donde empieza la tabla
        margin: { left: cuadroX },  // La cabecera se queda en la posición original
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'left',  // Alineación a la izquierda
          fontSize: 8  // Tamaño de la fuente para la cabecera
        },
        styles: {
          lineColor: [0, 0, 0, 0],  // Bordes transparentes
        },
        columnStyles: {
          0: { cellWidth: tablaWidth - 30 },  // Mantiene el ancho de la cabecera
        },
        tableWidth: 'wrap',
      });

      // Ajustamos el valor Y para el contenido y agregamos más margen a la izquierda para el cuerpo
      procedimientosY = doc.lastAutoTable.finalY;  // Ajustamos la posición Y después de la cabecera

      // Tabla para el contenido (cuerpo)
      doc.autoTable({
        body: [
          ['BIOMONITORES PEGABLES'],  // Sexta fila
          ['ESTACIONES DE CEBADO'],  // Séptima fila
          ['CORDÓN SANITARIO PERIMETRAL'],  // Octava fila
        ],
        startY: procedimientosY,  // Posición Y donde empieza la tabla
        margin: { left: cuadroX + 30 },  // Mueve el cuerpo 20 unidades más a la derecha
        theme: 'grid',
        styles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 5,  // Tamaño de la fuente para el contenido
          cellPadding: 5,
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [0, 0, 0, 0],  // Hace los bordes transparentes
        },
        columnStyles: {
          0: { cellWidth: tablaWidth - 30 },  // Mantiene el ancho del cuerpo
        },
        tableWidth: 'wrap',
      });


      procedimientosY = procedimientosY + 45;
      cabeceraProcedimiento = [{ title: 'DESINFECCIÓN', dataKey: 'procedimiento' }];
      // Tabla para la cabecera (se mantiene en su posición original)
      doc.autoTable({
        head: [cabeceraProcedimiento.map(col => col.title)],  // Título de la cabecera
        startY: procedimientosY,  // Posición Y donde empieza la tabla
        margin: { left: cuadroX },  // La cabecera se queda en la posición original
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'left',  // Alineación a la izquierda
          fontSize: 8  // Tamaño de la fuente para la cabecera
        },
        styles: {
          lineColor: [0, 0, 0, 0],  // Bordes transparentes
        },
        columnStyles: {
          0: { cellWidth: tablaWidth - 30 },  // Mantiene el ancho de la cabecera
        },
        tableWidth: 'wrap',
      });

      // Ajustamos el valor Y para el contenido y agregamos más margen a la izquierda para el cuerpo
      procedimientosY = doc.lastAutoTable.finalY;  // Ajustamos la posición Y después de la cabecera

      // Tabla para el contenido (cuerpo)
      doc.autoTable({
        body: [
          ['NEBULIZADOR UVL ELECTRICO'],  // Novena fila
          ['NEBULIZADOR MECÁNICO'],  // Décima fila
          ['SANITIZACIÓN'],  // Undécima fila
        ],
        startY: procedimientosY,  // Posición Y donde empieza la tabla
        margin: { left: cuadroX + 30 },  // Mueve el cuerpo 20 unidades más a la derecha
        theme: 'grid',
        styles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 5,  // Tamaño de la fuente para el contenido
          cellPadding: 5,
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
          lineColor: [0, 0, 0, 0],  // Hace los bordes transparentes
        },
        columnStyles: {
          0: { cellWidth: tablaWidth - 30 },  // Mantiene el ancho del cuerpo
        },
        tableWidth: 'wrap',
      });


      // --- Agregar Cuadro "Recomendaciones" ---

      // Definir posiciones y dimensiones para el nuevo cuadro "Recomendaciones"
      const recomendacionesY = procedimientosY + 40; // 10 puntos de margen debajo del cuadro de procedimientos
      const recomendacionesHeight = 60; // Altura del nuevo cuadro


      const cabecera = [{ title: 'RECOMENDACIONES:', dataKey: 'recomendacion' }];
      const text = [{ recomendacion: informe.recomendaciones }];
      doc.autoTable({
        head: [cabecera.map(col => col.title)],  // Título de la cabecera
        body: text.map(item => [item.recomendacion]),  // Datos del cuerpo de la tabla
        startY: recomendacionesY + 10,
        margin: { left: cuadroX },
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [37, 123, 205],
          halign: 'left',
          fontSize: 10  // Tamaño de la fuente para la cabecera
        },
        styles: {
          textColor: [37, 123, 205],
          font: 'Cambria',
          fontSize: 7,  // Tamaño de la fuente para el contenido
          cellPadding: 5,
          overflow: 'linebreak',  // Permitir saltos de línea en las celdas
        },
        columnStyles: {
          0: {  // Define las propiedades de la primera columna
            cellWidth: pageWidth - cuadroX - 20, // Limita el ancho de la columna
          }
        },
        tableWidth: 'wrap',  // Ajusta la tabla al contenido
      });

      // --- Agregar Sección "Firma Supervisor" ---

      // Definir posiciones y dimensiones para la firma
      const firmaY = recomendacionesY + recomendacionesHeight + 60; // 20 puntos de margen debajo del cuadro de recomendaciones
      const firmaLineWidth = 170; // Ancho de la línea de firma
      const firmaLineX = (pageWidth - firmaLineWidth) / 2; // Centrar la línea horizontalmente
      const firmaLineY = firmaY; // Posición Y de la línea

      // Dibujar la línea para la firma
      doc.setLineWidth(1);
      doc.line(firmaLineX + 100, firmaLineY, firmaLineX + firmaLineWidth, firmaLineY); // Línea horizontal

      // Agregar el texto "Firma Supervisor" debajo de la línea
      doc.setFont('cambria', 'normal');
      doc.setFontSize(12);
      doc.text('Firma Supervisor', (pageWidth) / 2, firmaLineY + 15, { align: 'center' });


      // --- Pie de página con degradado (blanco -> azul -> blanco) ---
      drawGradient(doc, 0, doc.internal.pageSize.height - footerHeight, sectionWidth * 2, footerHeight, white, white, 50); // 20% blanco
      drawGradient(doc, sectionWidth * 2, doc.internal.pageSize.height - footerHeight, sectionWidth * 2.9, footerHeight, white, blue, 50); // 29% blanco a azul
      drawGradient(doc, sectionWidth * 4.9, doc.internal.pageSize.height - footerHeight, sectionWidth * 0.2, footerHeight, blue, blue, 50); // 2% azul
      drawGradient(doc, sectionWidth * 5.1, doc.internal.pageSize.height - footerHeight, sectionWidth * 2.9, footerHeight, blue, white, 50); // 29% azul a blanco
      drawGradient(doc, sectionWidth * 8, doc.internal.pageSize.height - footerHeight, sectionWidth * 2, footerHeight, white, white, 50); // 20% blanco
      const webIcon = 'src/assets/web.png'; // Ruta al icono del sitio web
      const emailIcon = 'src/assets/mail.png'; // Ruta al icono de correo
      const locationIcon = 'src/assets/home.png'; // Ruta al icono de ubicación
      const phoneIcon = 'src/assets/phone.png'; // Ruta al icono de teléfono
      const whatsappIcon = 'src/assets/whatsapp.png'; // Ruta al icono de WhatsApp

      // Añadir textos con iconos
      const footerY = doc.internal.pageSize.height - footerHeight + 20;

      // Sitio web
      doc.addImage(webIcon, 'PNG', 30, footerY - 5, 10, 10); // Ajusta el tamaño y posición
      doc.text('www.fumidez.com', 50, footerY);

      // Correo electrónico
      doc.addImage(emailIcon, 'PNG', 30, footerY + 15 - 5, 10, 10);
      doc.text('fumidezplagas@gmail.com', 50, footerY + 15);

      // Dirección
      doc.addImage(locationIcon, 'PNG', 30, footerY + 30 - 5, 10, 10);
      doc.text('Matriz Quito: Urb. Caminos del Sur. Pasaje 6 Casa Oe 10-23 y Julián Estrella', 50, footerY + 30);

      // Teléfonos
      doc.addImage(phoneIcon, 'PNG', doc.internal.pageSize.width - 80 - 15, footerY - 5, 10, 10);
      doc.text('02 262 0298', doc.internal.pageSize.width - 80, footerY);

      // WhatsApp
      doc.addImage(whatsappIcon, 'PNG', doc.internal.pageSize.width - 80 - 15, footerY + 15 - 5, 10, 10);
      doc.text('099 995 4079', doc.internal.pageSize.width - 80, footerY + 15);

      // Guardar PDF
      doc.save(`informe_${informe.numFactura}.pdf`);
    },

    generateFormularioIPM(informe) {
      const doc = new jsPDF('portrait', 'pt', 'a4'); // Orientación vertical

      const headerHeight = 65;
      const footerHeight = 65;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Función para generar un degradado simulado entre dos colores
      const drawGradient = (doc, x, y, width, height, color1, color2, steps) => {
        for (let i = 0; i <= steps; i++) {
          const ratio = i / steps;
          const r = Math.floor(color1.r * (1 - ratio) + color2.r * ratio);
          const g = Math.floor(color1.g * (1 - ratio) + color2.g * ratio);
          const b = Math.floor(color1.b * (1 - ratio) + color2.b * ratio);

          doc.setFillColor(r, g, b);
          doc.rect(x + (i * (width / steps)), y, width / steps, height, 'F');
        }
      };

      // Colores
      const white = { r: 255, g: 255, b: 255 };
      const blue = { r: 69, g: 150, b: 217 };
      // Anchos de las secciones del degradado
      const sectionWidth = pageWidth / 10; // Ancho de cada sección (10 partes)

      // --- Encabezado ---
      // Crear degradado en el encabezado
      drawGradient(doc, 0, 0, sectionWidth * 2, headerHeight, white, white, 50); // 20% blanco
      drawGradient(doc, sectionWidth * 2, 0, sectionWidth * 2.9, headerHeight, white, blue, 50); // 29% blanco a azul
      drawGradient(doc, sectionWidth * 4.9, 0, sectionWidth * 0.2, headerHeight, blue, blue, 50); // 2% azul
      drawGradient(doc, sectionWidth * 5.1, 0, sectionWidth * 2.9, headerHeight, blue, white, 50); // 29% azul a blanco
      drawGradient(doc, sectionWidth * 8, 0, sectionWidth * 2, headerHeight, white, white, 50); // 20% blanco

      // Logo (ajusta la posición y tamaño según sea necesario)
      const logo = 'src/assets/fumidez_logo.png'; // Reemplaza con la ruta de tu logo
      // Asegúrate de que las imágenes estén en base64 o accesibles
      // Puedes usar una promesa para cargar imágenes si es necesario
      doc.addImage(logo, 'PNG', 10, 14, 125, 40); // X, Y, Width, Height

      // Texto en el encabezado
      doc.setFont('cambria', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 0, 0);
      doc.text('FORMULARIO I.P.M', pageWidth - 25, 30, null, null, 'right');
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 255);

      doc.setDrawColor(32, 76, 130); // Color para la línea divisoria


      // Títulos centrados
      doc.setFont('cambria', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Color negro
      const titulo1 = 'FORMULARIO IPM';
      doc.setFontSize(10);
      const titulo2 = 'MANEJO DE ROEDORES';
      const tituloY = headerHeight + 40;

      doc.text(titulo1, pageWidth / 2, tituloY, { align: 'center' });
      doc.text(titulo2, pageWidth / 2, tituloY + 30, { align: 'center' });

      // --- Información del Cliente ---
      doc.setFont('cambria', 'normal');
      doc.setFontSize(8);
      const infoYStart = tituloY + 60;
      const infoX = 50; // Margen izquierdo

      doc.text(`Cliente: ${informe.ordenDto.cliente.nombre}`, infoX, infoYStart);
      doc.text(`FECHA DE TRABAJO REALIZADO: ${informe.ordenDto.fecha}`, infoX, infoYStart + 20);
      doc.text(`AREA TRATADA: ${informe.ordenDto.area}`, infoX, infoYStart + 40);

      let formularioY1 = tituloY + 120;

      doc.autoTable({
        head: [
          [
            { content: 'N° EST. DE CEBADO', rowSpan: 2 },
            { content: 'CONSUMO', colSpan: 3, styles: { halign: 'center' } },
            { content: 'UBICACIÓN', rowSpan: 2, fontSize: 10 },
            { content: 'OBSERVACIONES', rowSpan: 2 },
            { content: 'REEMPLAZO', colSpan: 2, styles: { halign: 'center' } },
            { content: 'C.S.P', colSpan: 3, styles: { halign: 'center' } }
          ],
          [
            'DAÑO', 'SI', 'NO', 'P', 'CB', 'S', 'CR', 'DE'
          ]
        ],
        body: [
          ['', '', '', '', '', '', '', '', '', '', ''],

        ],
        startY: formularioY1,
        margin: { left: 40, right: 10 }, // Márgenes para ajustar la tabla al ancho de la página
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          halign: 'center',
          fontSize: 5,
          lineColor: [0, 0, 0]
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          font: 'Cambria',
          fontSize: 6,
          cellPadding: 3,
          halign: 'center'
        },
        styles: {
          cellWidth: 'auto',
          overflow: 'linebreak',
          lineColor: [0, 0, 0],
          lineWidth: 0.5
        },
        tableWidth: 'wrap', // Ajustar la tabla para que se ajuste al ancho de la página
        columnStyles: {
          0: { cellWidth: 12 + 20 },  // Ajuste del ancho para la columna de Nº
          1: { cellWidth: 5 + 20 },  // Ajuste del ancho para EST. DE CEBADO
          2: { cellWidth: 5 + 20 },  // Ajuste del ancho para CONSUMO DAÑO
          3: { cellWidth: 5 + 20 },  // Ajuste del ancho para CONSUMO SI
          4: { cellWidth: 100 + 20 },  // Ajuste del ancho para CONSUMO NO
          5: { cellWidth: 110 + 20 },  // Ajuste del ancho para UBICACIÓN
          6: { cellWidth: 5 + 20 },  // Ajuste del ancho para OBSERVACIONES
          7: { cellWidth: 5 + 20 },  // Ajuste del ancho para REEMPLAZO P
          8: { cellWidth: 5 + 20 },  // Ajuste del ancho para REEMPLAZO CB
          9: { cellWidth: 5 + 20 },  // Ajuste del ancho para REEMPLAZO S
          10: { cellWidth: 5 + 20 }, // Ajuste del ancho para REEMPLAZO C.R
          11: { cellWidth: 5 + 20 }, // Ajuste del ancho para REEMPLAZO D.E
          12: { cellWidth: 5 + 20 }, // Ajuste del ancho para C.S.P
          13: { cellWidth: 5 + 20 }, // Ajuste del ancho para C.S.P CB
          14: { cellWidth: 5 + 20 }, // Ajuste del ancho para C.S.P S
        }
      });

      // --- Pie de página ---
      // Crear degradado en el pie de página
      drawGradient(
        doc,
        0,
        pageHeight - footerHeight,
        sectionWidth * 2,
        footerHeight,
        white,
        white,
        50
      ); // 20% blanco
      drawGradient(
        doc,
        sectionWidth * 2,
        pageHeight - footerHeight,
        sectionWidth * 2.9,
        footerHeight,
        white,
        blue,
        50
      ); // 29% blanco a azul
      drawGradient(
        doc,
        sectionWidth * 4.9,
        pageHeight - footerHeight,
        sectionWidth * 0.2,
        footerHeight,
        blue,
        blue,
        50
      ); // 2% azul
      drawGradient(
        doc,
        sectionWidth * 5.1,
        pageHeight - footerHeight,
        sectionWidth * 2.9,
        footerHeight,
        blue,
        white,
        50
      ); // 29% azul a blanco
      drawGradient(
        doc,
        sectionWidth * 8,
        pageHeight - footerHeight,
        sectionWidth * 2,
        footerHeight,
        white,
        white,
        50
      ); // 20% blanco

      const webIcon = 'src/assets/web.png'; // Ruta al icono del sitio web
      const emailIcon = 'src/assets/mail.png'; // Ruta al icono de correo
      const locationIcon = 'src/assets/home.png'; // Ruta al icono de ubicación
      const phoneIcon = 'src/assets/phone.png'; // Ruta al icono de teléfono
      const whatsappIcon = 'src/assets/whatsapp.png'; // Ruta al icono de WhatsApp

      // Añadir textos con iconos
      const footerY = pageHeight - footerHeight + 20;

      // Sitio web
      doc.addImage(webIcon, 'PNG', 30, footerY - 5, 10, 10); // Ajusta el tamaño y posición
      doc.text('www.fumidez.com', 50, footerY);

      // Correo electrónico
      doc.addImage(emailIcon, 'PNG', 30, footerY + 15 - 5, 10, 10);
      doc.text('fumidezplagas@gmail.com', 50, footerY + 15);

      // Dirección
      doc.addImage(locationIcon, 'PNG', 30, footerY + 30 - 5, 10, 10);
      doc.text(
        'Matriz Quito: Urb. Caminos del Sur. Pasaje 6 Casa Oe 10-23 y Julián Estrella',
        50,
        footerY + 30
      );

      // Teléfonos
      doc.addImage(phoneIcon, 'PNG', pageWidth - 80 - 15, footerY - 5, 10, 10);
      doc.text('02 262 0298', pageWidth - 80, footerY);

      // WhatsApp
      doc.addImage(whatsappIcon, 'PNG', pageWidth - 80 - 15, footerY + 15 - 5, 10, 10);
      doc.text('099 995 4079', pageWidth - 80, footerY + 15);

      // --- Guardar PDF ---
      doc.save(`Formulario_IPM_${informe.numFactura}.pdf`);
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
