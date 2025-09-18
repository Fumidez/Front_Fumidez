<template>
  <div class="page-container d-flex flex-column">
    <main class="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
      <div class="container py-5">
        <h1 class="text-center text-primary mb-5 animate__animated animate__fadeInDown">
          🚀 Bienvenido al Panel Principal
        </h1>

        <!-- Información destacada -->
        <div class="alert alert-info text-center shadow-sm animate__animated animate__fadeIn" role="alert">
          <strong>¡Bienvenido!</strong> Gestiona tus módulos con eficiencia y accede rápidamente a las principales funcionalidades.
        </div>

        <!-- Grid de módulos -->
        <div class="row g-4 mt-4">
          <div v-for="modulo in modulos" :key="modulo.nombre" class="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
            <div class="card module-card text-center shadow-lg p-4" @click="redirigir(modulo.ruta)">
              <div class="card-body d-flex flex-column justify-content-center align-items-center">
                <div class="icon-container mb-4">
                  <i :class="modulo.icono" class="module-icon"></i>
                </div>
                <h5 class="card-title text-primary mb-3">{{ modulo.nombre }}</h5>
                <button class="btn btn-gradient px-4 py-2">Acceder</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pie de página -->
        <div class="text-center mt-5">
          <p class="text-muted">© 2025 Panel de Gestión. Todos los derechos reservados.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { comprobarTipoUsuario } from "../../Login/helpers/rolesHelper";
import router from "@/router";

export default {
  name: "PaginaInicio",
  data() {
    return {
      tipo: '',
      modulos: [
        { nombre: "Usuarios", ruta: "/usuarios_lista", icono: "fas fa-users" },
        { nombre: "Clientes", ruta: "/clientes_lista", icono: "fas fa-user-tie" },
        { nombre: "Orden de Trabajo", ruta: "/orden_trabajo_lista", icono: "fas fa-tasks" },
        { nombre: "Informe", ruta: "/informe_lista", icono: "fas fa-chart-line" },
        { nombre: "Productos", ruta: "/productos_lista", icono: "fas fa-box-open" },
        { nombre: "Proveedores", ruta: "/proveedores_lista", icono: "fas fa-truck-moving" },
        { nombre: "Calendario", ruta: "/calendario", icono: "fas fa-calendar-alt" },
      ],
    };
  },
  mounted() {
    this.tipo = comprobarTipoUsuario();
  },
  methods: {
    redirigir(ruta) {
      router.push({ path: ruta });
    },
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.module-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 20px;
  background: linear-gradient(to bottom, #ffffff, #f4f8ff);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  width: 100%;
  height: 220px;
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.25);
}

.module-icon {
  font-size: 4rem;
  color: #007bff;
}

.icon-container {
  padding: 20px;
  border-radius: 50%;
  display: inline-block;
}

.btn-gradient {
  background: linear-gradient(to right, #4e79a7, #76a5f7);
  color: #ffffff;
  border: none;
  transition: background 0.3s;
  border-radius: 30px;
}

.btn-gradient:hover {
  background: linear-gradient(to right, #3a5b80, #5d8ce6);
}
</style>
