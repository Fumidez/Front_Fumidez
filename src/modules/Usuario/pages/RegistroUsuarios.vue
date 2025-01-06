<template>
    <div class="page-container d-flex flex-column" style="min-height: 100vh;">
        <!-- Header -->

        <!-- Contenido Principal -->
        <main class="flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="card p-5 shadow-lg"
                style="max-width: 800px; width: 100%; border-radius: 15px; background-color: rgba(255, 255, 255, 0.9); border: 3px solid transparent; border-image: linear-gradient(to right, #004080, #a9c4f5); border-image-slice: 1;">
                <h1 class="text-center text-primary mb-4">Ingresar Usuario</h1>
                <form @submit.prevent="submitForm">

                    <!-- Rol del Usuario -->
                    <div class="form-group mb-3">
                        <label for="role" class="d-flex align-items-center"><i class="bi bi-person-fill"></i> Rol del
                            usuario</label>
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle w-100" type="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                {{ usuario.tipo || 'Seleccione un rol' }}
                            </button>
                            <ul class="dropdown-menu w-100">
                                <li v-for="rol in roles" :key="rol">
                                    <a class="dropdown-item" href="#" @click="usuario.tipo = rol">{{ rol }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Contraseña -->
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="contrasenia" class="w-25"><i class="bi bi-person-raised-hand"></i>
                            Contraseña</label>
                        <input type="password" id="contrasenia" v-model="usuario.contrasenia" class="form-control"
                            placeholder="Contraseña" />
                    </div>

                    <!-- Nombre -->
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="nombre" class="w-25"><i class="bi bi-person-fill"></i> Nombre</label>
                        <input type="text" id="nombre" v-model="usuario.nombre" class="form-control"
                            placeholder="Nombre" />
                    </div>

                    <!-- Correo -->
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="correo" class="w-25"><i class="bi bi-envelope-at-fill"></i> Correo</label>
                        <input type="email" id="correo" v-model="usuario.correo" class="form-control"
                            placeholder="Correo" />
                    </div>

                    <!-- Número de Cuenta -->
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="nCuenta" class="w-25"><i class="bi bi-chat-left-dots-fill"></i> Número de
                            Cuenta</label>
                        <input type="text" id="nCuenta" v-model="usuario.ncuenta" class="form-control"
                            placeholder="Número de Cuenta" />
                    </div>

                    <!-- RUC -->
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="ruc" class="w-25"><i class="bi bi-person-square"></i> RUC</label>
                        <input type="text" id="ruc" v-model="usuario.ruc" class="form-control" placeholder="RUC" />
                    </div>

                    <!-- Dirección -->
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="direccion" class="w-25"><i class="bi bi-geo-alt-fill"></i> Dirección</label>
                        <input type="text" id="direccion" v-model="usuario.direccion" class="form-control"
                            placeholder="Dirección" />
                    </div>

                    <!-- Teléfono -->
                    <div class="form-group mb-3 d-flex align-items-center">
                        <label for="telefono" class="w-25"><i class="bi bi-person-fill"></i> Teléfono</label>
                        <input type="tel" id="telefono" v-model="usuario.telefono" class="form-control"
                            placeholder="Teléfono" />
                    </div>

                    <!-- Botón Guardar -->
                    <button v-if="!esEdicion" type="submit" class="btn btn-primary w-100 py-2">
                        Guardar
                    </button>
                    <button v-else type="submit" class="btn btn-primary w-100 py-2">
                        Actualizar
                    </button>
                    <button type="button" class="btn btn-secondary w-100 mt-2 py-2"
                        @click="redirigirListadoUsuario">
                        Volver al listado
                    </button>
                </form>
            </div>
        </main>
    </div>
</template>


<script>
import router from "@/router";
import { 
  consultarUsuarioFachada, 
  crearUsuarioFachada, 
  obtenerUsuarioFachada, 
  actualizarUsuarioFachada 
} from '../helpers/UsuarioHelper';

export default {
  name: "Usuarios",
  data() {
    return {
      usuario: {
        tipo: '',
        contrasenia: '',
        nombre: '',
        correo: '',
        nCuenta: '',
        ruc: '',
        direccion: '',
        telefono: ''
      },
      roles: ['ADMIN', 'TECNICO'],
      usuarioId: this.$route.params.id, // Detecta el ID del usuario desde la URL.
      esEdicion: false // Variable para determinar si es edición o creación.
    };
  },
  mounted() {
    this.consultarPorIdUsuario();
  },
  methods: {
    async consultarPorIdUsuario() {
      try {
        if (this.usuarioId) {
          const user = await obtenerUsuarioFachada(this.usuarioId);
          this.usuario = { 
            tipo: user.tipo,
            contrasenia: user.contrasenia,
            nombre: user.nombre,
            correo: user.correo,
            nCuenta: user.ncuenta,
            ruc: user.ruc,
            direccion: user.direccion,
            telefono: user.telefono
          };
          this.esEdicion = true; // Es edición porque se encontró un usuario existente.
        } else {
          this.esEdicion = false;
        }
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
      }
    },
    async submitForm() {
      try {
        if (this.esEdicion) {
          // Llama al método de actualización
          await actualizarUsuarioFachada(this.usuarioId, this.usuario);
          console.log('Usuario actualizado con éxito');
          alert("Usuario actualizado con éxito");

        } else {
          // Llama al método de creación
          const nuevoUsuario = await crearUsuarioFachada(this.usuario);
          console.log('Usuario creado con éxito:', nuevoUsuario);
        }
        this.limpiarFormulario();
      } catch (error) {
        console.error('Error al procesar el formulario:', error);
      }
    },
    async redirigirListadoUsuario() {
            const ruta = `/usuarios_lista`;
            await router.push({ path: ruta });
        },
    limpiarFormulario() {
      this.usuario = {
        tipo: '',
        contrasenia: '',
        nombre: '',
        correo: '',
        nCuenta: '',
        ruc: '',
        direccion: '',
        telefono: ''
      };
      this.esEdicion = false;
    }
  }
};
</script>

<style scoped>
/* General */
.page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex-grow: 1;
    /* Ocupa el espacio restante entre el header y footer */
    background-image: url('@/assets/fumi.jpg'), linear-gradient(to bottom, #132333, #132333);
    background-size: cover;
    /* Hace que la imagen cubra todo el fondo sin distorsionarse */
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
}

/* Card Estilo Empresarial */
.card {
    border: 3px solid transparent;
    border-image: linear-gradient(to right, #004080, #a9c4f5);
    border-image-slice: 1;
    border-radius: 15px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.8);
    /* Fondo blanco con opacidad */
}

/* Estilos para los encabezados y botones */
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

/* Responsividad */
@media (max-width: 768px) {
    .card {
        padding: 2rem 1.5rem;
        max-width: 100%;
    }

    h1 {
        font-size: 1.5rem;
    }

    button {
        font-size: 0.9rem;
    }
}

@media (max-width: 576px) {
    .card {
        padding: 1.5rem 1rem;
    }

    h1 {
        font-size: 1.3rem;
    }

    button {
        font-size: 0.85rem;
    }
}

/* Pantallas grandes */
@media (min-width: 1200px) {
    .card {
        max-width: 600px;
    }
}
</style>