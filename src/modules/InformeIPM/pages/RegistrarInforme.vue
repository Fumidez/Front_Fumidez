<template>
  <div class="informe-container d-flex flex-column" style="min-height: 100vh;">
    <main class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="card p-5 shadow-lg"
        style="max-width: 800px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
        <h1 class="text-center text-primary mb-4">Ingresar Informe IPM</h1>
        <form @submit.prevent="submitForm">
          <!-- Número de Factura -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="numFactura" class="w-25"><i class="bi bi-file-earmark"></i> Número de Factura</label>
            <input type="text" id="numFactura" v-model="informe.numFactura" class="form-control"
              placeholder="Número de Factura" required />
          </div>

          <!-- Observación -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="observacion" class="w-25"><i class="bi bi-file-earmark-text"></i> Observación</label>
            <textarea id="observacion" v-model="informe.observacion" class="form-control" placeholder="Observación"
              required></textarea>
          </div>

          <!-- Recomendaciones -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="recomendaciones" class="w-25"><i class="bi bi-file-earmark-check"></i> Recomendaciones</label>
            <textarea id="recomendaciones" v-model="informe.recomendaciones" class="form-control"
              placeholder="Recomendaciones" required></textarea>
          </div>

          <!-- Tiempo -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="tiempo" class="w-25"><i class="bi bi-clock"></i> Tiempo</label>
            <input type="time" id="tiempo" v-model="informe.tiempo" class="form-control" required />
          </div>

          <!-- Frecuencia -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="frecuencia" class="w-25"><i class="bi bi-clock"></i> Frecuencia</label>
            <select id="frecuencia" v-model="informe.frecuencia" class="form-control" required>
              <option disabled value="">Selecciona una frecuencia</option>
              <option v-for="frecuencia in frecuencias" :key="frecuencia" :value="frecuencia">
                {{ frecuencia }}
              </option>
            </select>
          </div>

          <!-- Precio -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="precio" class="w-25"><i class="bi bi-currency-dollar"></i> Precio</label>
            <input type="number" id="precio" v-model="informe.precio" class="form-control" placeholder="Precio"
              required />
          </div>

          <!-- Selección de Orden de Trabajo -->
          <div class="form-group mb-3 d-flex align-items-center">
            <label for="ordenSelect" class="w-25"><i class="bi bi-file-earmark"></i> Seleccionar Orden de
              Trabajo</label>
            <select id="ordenSelect" v-model="informe.idOrden" @change="cargarOrdenSeleccionada" class="form-control"
              required>
              <option value="">Seleccione una orden</option>
              <option v-for="orden in ordenes" :key="orden.id" :value="orden.id">
                {{ orden.numeroOrden }}
              </option>
            </select>
          </div>

          <!-- Procedimientos -->
          <div class="form-group mb-3">
            <label><i class="bi bi-tools"></i> Procedimientos</label>
            <div v-for="(procedimiento, index) in informe.procedimientos" :key="index"
              class="d-flex gap-2 align-items-center">
              <select v-model="procedimiento.tipoProcedimiento" class="form-control" required>
                <option disabled value="">Seleccione un procedimiento</option>
                <option v-for="(nombre, id) in procedimientosLista" :key="id" :value="id">
                  {{ nombre }}
                </option>
              </select>
              <button type="button" class="btn btn-danger btn-sm" @click="removeProcedimiento(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <button type="button" class="btn btn-primary w-100 mt-2 py-2" @click="addProcedimiento">
              <i class="bi bi-plus-circle"></i> Añadir Procedimiento
            </button>
          </div>

          <!-- Plagas -->
          <div class="form-group mb-3">
            <label><i class="bi bi-bug"></i> Plagas</label>
            <div v-for="(plaga, plagaIndex) in informe.plagas" :key="plagaIndex" class="plaga-group">
              <div class="plaga-header d-flex align-items-center">
                <input type="text" v-model="plaga.tipoPlaga" class="form-control" placeholder="Tipo de Plaga"
                  required />
                <button type="button" class="btn btn-danger btn-sm" @click="removePlaga(plagaIndex)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div v-for="(producto, productoIndex) in plaga.cantidadProductoPlaga" :key="productoIndex"
                class="producto-group">
                <select v-model="producto.productoDto" class="form-control" required>
                  <option disabled value="">Seleccione un producto</option>
                  <option v-for="productoS in productos" :key="productoS.id" :value="productoS">
                    {{ productoS.nombre }}
                  </option>
                </select>

                <input type="number" v-model="producto.cantidadProducto" class="form-control" placeholder="Cantidad"
                  min="0" required />
                <button type="button" class="btn btn-danger btn-sm" @click="removeProducto(plagaIndex, productoIndex)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button type="button" class="btn btn-primary w-100 mt-2 py-2" @click="addProducto(plagaIndex)">
                <i class="bi bi-plus-circle"></i> Añadir Producto
              </button>
            </div>
            <button type="button" class="btn btn-primary w-100 mt-2 py-2" @click="addPlaga">
              <i class="bi bi-plus-circle"></i> Añadir Plaga
            </button>
          </div>

          <!-- Sanitización -->
          <div class="sanitizacion-row">
            <div class="input-group mb-3">
              <label for="areaInterna" class="w-25"><i class="bi bi-geo-alt"></i> Área Interna</label>
              <select v-model="informe.sanitizacionConfidenciales.areaInterna" class="form-control" required>
                <option disabled value="">Seleccione una opción</option>
                <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="input-group mb-3">
              <label for="areaExterna" class="w-25"><i class="bi bi-geo-alt"></i> Área Externa</label>
              <select v-model="informe.sanitizacionConfidenciales.areaExterna" class="form-control" required>
                <option disabled value="">Seleccione una opción</option>
                <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="input-group mb-3">
              <label for="areaNombreOpc1" class="w-25"><i class="bi bi-geo-alt"></i> Nombre del Área Opcional 1</label>
              <input v-model="informe.sanitizacionConfidenciales.areaNombreOpc1" type="text" class="form-control"
                placeholder="Nombre del Área Opcional 1" required />
              <select v-model="informe.sanitizacionConfidenciales.areaOpc1" class="form-control" required>
                <option disabled value="">Seleccione una opción</option>
                <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="input-group mb-3">
              <label for="areaNombreOpc2" class="w-25"><i class="bi bi-geo-alt"></i> Nombre del Área Opcional 2</label>
              <input v-model="informe.sanitizacionConfidenciales.areaNombreOpc2" type="text" class="form-control"
                placeholder="Nombre del Área Opcional 2" required />
              <select v-model="informe.sanitizacionConfidenciales.areaOpc2" class="form-control" required>
                <option disabled value="">Seleccione una opción</option>
                <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>

          <!-- Botón de guardar -->
          <button type="submit" class="btn btn-primary w-100 py-2">
            Guardar
          </button>
          <button class="btn btn-outline-success btn-sm" @click="abrirModal()">
            <i class="bi bi-images"></i>
          </button>
        </form>
      </div>
      <div v-if="isModalOpen" class="modal d-block" tabindex="-1" role="dialog"
        style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Subir Fotos</h5>
              <button type="button" class="btn-close" @click="cerrarModal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Selecciona una foto para el informe seleccionado.</p>
              <input type="file" @change="manejarArchivo" accept="image/*" multiple />

              <!-- Contenedor para mostrar las imágenes precargadas -->
              <div class="image-preview mt-3 d-flex flex-wrap gap-3">
                <div v-for="(foto, index) in fotos" :key="index" class="position-relative">
                  <img :src="foto.foto" alt="Imagen subida" class="img-thumbnail"
                    style="width: 150px; height: 150px; object-fit: cover;" />
                  <!-- Botón para eliminar la imagen -->
                  <button type="button" class="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle"
                    @click="eliminarFoto(index, foto)">
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="guardarFotos">Guardar</button>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import { obtenerTodosLosProductosFachada } from '../../Producto/helpers/productosHelpers';
import { consultarOrdenFachada } from '../../OrdenTrabajo/helpers/OrdenTrabajoHelper';
import { consultarInformePorIdFachada, crearInformePlagaFachada } from '../helpers/InformeHelper';
import Footer from '../../../components/Footer.vue';
import { consultarFotosIdInformeFachada, eliminarFotoFachada, guardarFotosFachada } from '../helpers/fotosHelper';

export default {
  name: "InformeIpm",
  components: {
    Footer
  },
  data() {
    return {
      isModalOpen: false,
      fotos: [],
      informeId: this.$route.params.id,
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
      procedimientosLista: {
        0: 'NEBULIZADOR TÉRMICO',
        1: 'ASPERSOR MANUAL',
        2: 'NEBULIZADOR UVL ELÉCTRICO DIINA FOG',
        3: 'NEBULIZADOR MECÁNICO',
        4: 'LÁMPARAS ELECTROCUTADORAS/ATRAPADORAS',
        5: 'BIOMONITORES PEGABLES',
        6: 'ESTACIONES DE CEBADO',
        7: 'CORDÓN SANITARIO PERIMETRAL',
        8: 'NEBULIZADOR UVL ELECTRICO',
        9: 'NEBULIZADOR MECÁNICO',
        10: 'SANITIZACIÓN'
      },
      productos: [],
      ordenes: [],
      frecuencias: ['MENSUAL', 'BIMENSUAL', 'TRIMESTRAL', 'OCASIONAL'],
      informeId: this.$route.params.id,
      ver_informe: false
    };
  },
  mounted() {
    this.cargarProductos();
    this.cargarOrdenes();
    this.consultarPorIdInforme();
  },
  methods: {
    async consultarPorIdInforme() {
      try {
        if (this.informeId) {
          const inf = await consultarInformePorIdFachada(this.informeId);
          this.informe = {
            numFactura: inf.numFactura,
            observacion: inf.observacion,
            recomendaciones: inf.recomendaciones,
            tiempo: inf.tiempo,
            frecuencia: inf.frecuencia,
            precio: inf.precio,
            idOrden: inf.ordenDto.id,
            sanitizacionConfidenciales: inf.sanitizacionConfidencialDto,
            plagas: inf.plagaDtos.map(plaga => ({
              ...plaga,
              cantidadProductoPlaga: plaga.cantidadProductoPlaga.map(producto => ({
                cantidadProducto: producto.cantidadProducto,
                productoDto: this.productos.find(p => p.id === producto.productoDto.id) || '' // Asegurarte que coincida con una referencia exacta
              }))
            })),
            procedimientos: inf.procedimientoDtos
          };
          this.ver_informe = true
        } else {
          this.ver_informe = false
        }
      } catch (error) {
        console.error('Error al cargar los Formularios IPM:', error);
      }
    },

    async submitForm() {
      if (this.isModalOpen) {
        return;
      }
      try {
        const informeDto = {
          numFactura: this.informe.numFactura,
          observacion: this.informe.observacion,
          procedimientoDtos: this.informe.procedimientos.map(p => ({
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
        if (this.ver_informe) {
          this.mensajeConfirmacion = "¡El informe se ha sido actualizado con exito!";
        } else {
          const nuevoInforme = await crearInformePlagaFachada(informeDto);
          this.informeId = nuevoInforme.id
          this.guardarFotos();
          this.informeId = null;
          this.limpiarFormulario();
        }
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
    },
    async abrirModal() {
      if (this.ver_informe) {
        try {
          // Consulta fotos del backend usando el informeId
          const fotosBackend = await consultarFotosIdInformeFachada(this.informeId);
          if (fotosBackend.length !== 0) {
            this.fotos = fotosBackend.map((foto) => {
              const base64Foto = foto.fotoBase64;
              const imageData = `data:image/jpeg;base64,${base64Foto}`;
              return {
                data: foto,
                foto: imageData,
                archivo: null,
                guardada: true,
              };
            });
          }
        } catch (error) {
          console.error("Error al cargar fotos desde el backend:", error);
        }
      }
      this.isModalOpen = true; // Abre el modal
    },
    cerrarModal() {
      this.isModalOpen = false; // Cierra el modal
    },
    manejarArchivo(event) {
      const archivos = event.target.files;
      for (let i = 0; i < archivos.length; i++) {
        const lector = new FileReader();
        lector.onload = (e) => {
          // Agrega la imagen convertida a base64 al array de fotos
          this.fotos.push({
            data: null,
            foto: e.target.result,
            archivo: archivos[i],
            guardada: false,
          });
        };
        lector.readAsDataURL(archivos[i]);
      }
    },
    async eliminarFoto(index, foto) {
      if (foto.data) {
        await eliminarFotoFachada(foto.data.id);
      }
      this.fotos.splice(index, 1);
    },

    async guardarFotos() {
      if (this.informeId) {
        const formData = new FormData();
        const listaGuardarFotos = this.fotos.filter((foto) => !foto.guardada);
        listaGuardarFotos.forEach((foto) => {
          if (foto.archivo) {
            formData.append("fotos", foto.archivo);
          }
        });
        formData.append("id", this.informeId);

        try {
          await guardarFotosFachada(formData);
        } catch (error) {
          console.error("Error al guardar las fotos:", error);
        }
      }
      this.cerrarModal();
    },
  }
};
</script>

<style scoped>
.sanitizacion-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>