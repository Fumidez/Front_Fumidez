<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh;">
    <!-- Header -->

    <!-- Contenido Principal -->
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg"
        style="max-width: 800px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
        <h1 class="text-center text-primary mb-4">Ingresar Orden de Trabajo</h1>
        <form @submit.prevent="submitForm">

          <!-- Fecha -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="fecha" class="w-25"><i class="bi bi-calendar-event-fill"></i> Fecha</label>
            <input type="date" id="fecha" v-model="ordenTrabajo.fecha" class="form-control" />
          </div>

          <!-- Hora -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="hora" class="w-25"><i class="bi bi-clock-fill"></i> Hora</label>
            <input type="time" id="hora" v-model="ordenTrabajo.hora" class="form-control" />
          </div>

          <!-- Número de Orden -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="numeroOrden" class="w-25"><i class="bi bi-hash"></i> Número de Orden</label>
            <input type="text" id="numeroOrden" v-model="ordenTrabajo.numeroOrden" class="form-control"
              placeholder="Número de Orden" />
          </div>

          <!-- Descripción -->
          <div class="form-group mb-3">
            <label for="descripcion"><i class="bi bi-textarea-t"></i> Descripción</label>
            <textarea id="descripcion" v-model="ordenTrabajo.descripcion" class="form-control"
              placeholder="Descripción"></textarea>
          </div>

          <!-- Área -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="area" class="w-25"><i class="bi bi-geo-alt-fill"></i> Área</label>
            <input type="text" id="area" v-model="ordenTrabajo.area" class="form-control" placeholder="Área" />
          </div>

          <!-- Selección de Usuario -->
          <div class="form-group mb-3">
            <label for="idUsuarios"><i class="bi bi-person-fill"></i> Usuario</label>
            <select id="idUsuarios" v-model="ordenTrabajo.idUsuarios" class="form-control">
              <option disabled value="">Seleccione un usuario</option>
              <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                {{ usuario.nombre }}
              </option>
            </select>
          </div>

          <!-- Selección de Cliente -->
          <div class="form-group mb-3">
            <label for="idClientes"><i class="bi bi-people-fill"></i> Cliente</label>
            <select id="idClientes" v-model="ordenTrabajo.idClientes" class="form-control">
              <option disabled value="">Seleccione un cliente</option>
              <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                {{ cliente.nombre }}
              </option>
            </select>
          </div>

          <!-- Servicios -->
          <div class="form-group mb-3">
            <label><i class="bi bi-tools"></i> Servicios</label>
            <div v-for="(servicio, index) in ordenTrabajo.servicios" :key="index" class="d-flex mb-2">
              <input type="text" v-model="servicio.tipoServicio" class="form-control me-2"
                placeholder="Tipo de Servicio" />
              <button type="button" class="btn btn-danger" @click="removeServicio(index)">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
            <button type="button" class="btn btn-secondary w-100" @click="addServicio">
              <i class="bi bi-plus-circle-fill"></i> Añadir Servicio
            </button>
          </div>

          <!-- Botón Guardar -->
          <button type="submit" class="btn btn-primary w-100 py-2">
            Guardar
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
// Importamos el helper para manejar la creación y obtención de órdenes de trabajo
import { crearOrdenFachada, consultarOrdenFachada, actualizarOrdenFachada } from '../helpers/OrdenTrabajoHelper';
import CamaraComercio from '/CamaraComercio.png';
import RegistroSanitario from '/RegistroSanitario.png';
import SAQ from '/SAQ.png';
import seal from '/seal.png';
import oms from '/oms.png';

import { consultarUsuarioFachada } from '../../Usuario/helpers/UsuarioHelper';

import { consultarClienteFachada } from '../../Cliente/helpers/ClienteHelper';
actualizarOrdenFachada
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
      const logo = '/fumidez_logo.png'; // Reemplaza con la ruta de tu logo
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
  const image1 = CamaraComercio;
    const image2 = RegistroSanitario;
    const image3 = SAQ;
    const image4 = seal;
    const image5 = oms;

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
      const webIcon = '/web.png'; // Ruta al icono del sitio web
      const emailIcon = '/mail.png'; // Ruta al icono de correo
      const locationIcon = '/home.png'; // Ruta al icono de ubicación
      const phoneIcon = '/phone.png'; // Ruta al icono de ubicación
      const whatsappIcon = '/whatsapp.png'; // Ruta al icono de ubicación

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
  min-height: 100vh;
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
  font-size: 1.8rem;
  color: #031425;
}

button {
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #003060;
}
</style>