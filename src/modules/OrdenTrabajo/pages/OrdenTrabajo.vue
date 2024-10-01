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
            <option v-for="cliente in  clientes" :key="cliente.id" :value="cliente.id">
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
            <td>
              <button @click="generatePDF(orden)">Generar PDF</button>
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

import { consultarUsuarioFachada } from '../../Usuario/helpers/UsuarioHelper';

import { consultarClienteFachada } from '../../Cliente/helpers/ClienteHelper';

import jsPDF from 'jspdf';

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
      ordenesTrabajo: [] ,// Array para almacenar las órdenes existentes
      usuarios:[],
      clientes:[],
    };
    
      
  },
  mounted() {
    this.cargarOrdenesTrabajo(); // Cargamos las órdenes al montar el componente
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

    generatePDF(ordenTrabajo) {
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
      doc.text('ORDEN DE TRABAJO', pageWidth - 25, 50, null, null, 'right');

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
      doc.text(`CLIENTE: ${ordenTrabajo.cliente.nombre}`, divisionX + 10, headerHeight + 40);
      doc.text(`RUC / CÉDULA: ${ordenTrabajo.cliente.ruc}`, divisionX + 10, headerHeight + 60);
      doc.text(`TELÉFONO: ${ordenTrabajo.cliente.telefono}`, divisionX + 10, headerHeight + 80);
      doc.text(`DIRECCIÓN: ${ordenTrabajo.cliente.direccion}`, divisionX + 10, headerHeight + 100);
      doc.text(`FECHA: ${ordenTrabajo.fecha}`, divisionX + 250, headerHeight + 60);
      doc.text(`HORA: ${ordenTrabajo.hora}`, divisionX + 250, headerHeight + 80);
      doc.text(`ATTE: ${ordenTrabajo.hora}`, divisionX + 250, headerHeight + 100);

      // Descripción
      const descriptionYStart = headerHeight + 120;
      doc.setFont('cambria', 'bold');
      doc.setFontSize(11);

      doc.text('DESCRIPCION DEL TRABAJO REALIZADO', 255, descriptionYStart + 20);

      const afterDescriptionY = descriptionYStart + 28; // Ajusta el valor según sea necesario
      doc.setLineWidth(0.75); // Grosor de la línea (ajusta según sea necesario)
      doc.line(150, afterDescriptionY, pageWidth - 50, afterDescriptionY); // Línea horizontal

      doc.setFont('cambria', 'normal');


      doc.text(ordenTrabajo.descripcion, 130, descriptionYStart + 55);


      // Pie de página con degradado (blanco -> azul -> blanco)
      drawGradient(doc, 0, doc.internal.pageSize.height - footerHeight, sectionWidth * 2, footerHeight, white, white, 50); // 20% blanco
      drawGradient(doc, sectionWidth * 2, doc.internal.pageSize.height - footerHeight, sectionWidth * 2.9, footerHeight, white, blue, 50); // 29% blanco a azul
      drawGradient(doc, sectionWidth * 4.9, doc.internal.pageSize.height - footerHeight, sectionWidth * 0.2, footerHeight, blue, blue, 50); // 2% azul
      drawGradient(doc, sectionWidth * 5.1, doc.internal.pageSize.height - footerHeight, sectionWidth * 2.9, footerHeight, blue, white, 50); // 29% azul a blanco
      drawGradient(doc, sectionWidth * 8, doc.internal.pageSize.height - footerHeight, sectionWidth * 2, footerHeight, white, white, 50); // 20% blanco
      const webIcon = 'src/assets/web.png'; // Ruta al icono del sitio web
      const emailIcon = 'src/assets/mail.png'; // Ruta al icono de correo
      const locationIcon = 'src/assets/home.png'; // Ruta al icono de ubicación
      const phoneIcon = 'src/assets/phone.png'; // Ruta al icono de ubicación
      const whatsappIcon = 'src/assets/whatsapp.png'; // Ruta al icono de ubicación

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

      doc.addImage(whatsappIcon, 'PNG', doc.internal.pageSize.width - 80 - 15, footerY + 15 - 5, 10, 10);
      doc.text('099 995 4079', doc.internal.pageSize.width - 80, footerY + 15);

      // Guardar PDF
      doc.save(`orden_${ordenTrabajo.numeroOrden}.pdf`);
    }


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
