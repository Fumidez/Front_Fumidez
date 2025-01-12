<template>
  <div class="page-container d-flex flex-column" style="min-height: 100vh;">
    <main class="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
      <div class="container py-5">
        <h1 class="text-center text-primary mb-5">Bienvenido al Panel Principal</h1>

        <!-- Información destacada o bienvenida -->
        <div class="alert alert-info text-center shadow-sm" role="alert">
          <strong>¡Bienvenido!</strong> Gestiona tus módulos de forma eficiente y accede rápidamente a las funcionalidades principales.
        </div>

        <!-- Grid de módulos -->
        <div class="row g-4 mt-4">
          <div 
            v-for="modulo in modulos" 
            :key="modulo.nombre" 
            class="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
            <div class="card text-center shadow-lg p-3" style="width: 18rem; border-radius: 20px;">
              <div class="card-body d-flex flex-column justify-content-center align-items-center">
                <div class="icon-container mb-4">
                  <i :class="modulo.icono" style="font-size: 3.5rem; color: #ffffff;"></i>
                </div>
                <h5 class="card-title text-primary mb-3">{{ modulo.nombre }}</h5>
                <button 
                  @click="redirigir(modulo.ruta)" 
                  class="btn btn-gradient px-4 py-2">
                  Acceder
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pie de página o información adicional -->
        <div class="text-center mt-5">
          <p class="text-muted">© 2025 Panel de Gestión. Todos los derechos reservados.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "PaginaInicio",
  data() {
    return {
      modulos: [
        { nombre: "Usuarios", ruta: "/usuarios_lista", icono: "bi bi-people" },
        { nombre: "Clientes", ruta: "/clientes_lista", icono: "bi bi-person-square" },
        { nombre: "Orden de Trabajo", ruta: "/orden_trabajo_lista", icono: "bi bi-journal-text" },
        { nombre: "Informe", ruta: "/informe_lista", icono: "bi bi-graph-up" },
        { nombre: "Productos", ruta: "/productos_lista", icono: "bi bi-basket3" },
        { nombre: "Proveedores", ruta: "/proveedores_lista", icono: "bi bi-truck" },
        { nombre: "Calendario", ruta: "/calendario", icono: "bi bi-calendar-event" },
      ],
    };
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

main {
  flex-grow: 1;
  background-color: #f0f8ff;
  background-image: linear-gradient(to bottom right, #e6f7ff, #ffffff);
}

.card {
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid transparent;
  border-image: linear-gradient(to right, #4e79a7, #76a5f7);
  border-image-slice: 1;
  border-radius: 20px;
  background: linear-gradient(to bottom, #ffffff, #f4f8ff);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.25);
}

.icon-container {
  background: linear-gradient(135deg, #4e79a7, #76a5f7);
  padding: 20px;
  border-radius: 50%;
  display: inline-block;
  color: #ffffff;
}

h1 {
  font-weight: bold;
  color: #003366;
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

.alert {
  background: linear-gradient(to right, #cce5ff, #f8f9ff);
  color: #004085;
  font-size: 1.1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Responsividad */
@media (max-width: 768px) {
  h1 {
    font-size: 1.75rem;
  }

  .card {
    width: 100%;
  }
}
</style>
