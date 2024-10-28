import { createRouter, createWebHistory } from 'vue-router';
import Clientes from '../modules/Cliente/pages/Clientes.vue';
import Usuarios from '../modules/Usuario/pages/Usuarios.vue';
import OrdenTrabajo from '../modules/OrdenTrabajo/pages/OrdenTrabajo.vue';
import OrdenTrabajoLista from '../modules/OrdenTrabajo/pages/ListaOrdenTrabajo.vue';
import OrdenTrabajoRegistrar from '../modules/OrdenTrabajo/pages/RegistrarOrdenTrabajo.vue';
import Plaga from '../modules/Plaga/components/Plaga.vue';
import Producto from '../modules/Producto/components/Producto.vue';
import Proveedor from '../modules/Proveedor/components/Proveedor.vue';
import Informe from '../modules/InformeIPM/pages/Informe.vue';
import login from '../modules/Login/pages/login.vue';
import Desratizacion from '../modules/InformeIPM/pages/Desratizacion.vue';


const routes = [
  { path: '/clientes', component: Clientes },
  { path: '/usuarios', component: Usuarios },
  //Rutas Ordenes de trabajo
  { path: '/orden_trabajo', component: OrdenTrabajo },
  { path: '/orden_trabajo_lista', component: OrdenTrabajoLista },
  { path: '/orden_trabajo_registro', component: OrdenTrabajoRegistrar },
  //Rutas Productos
  { path: '/productos', component: Producto },
  { path: '/plagas', component: Plaga },
  { path: '/proveedores', component: Proveedor },
  { path: '/informe', component: Informe },
  { path: '/login', component: login },
  { path: '/desratizacion/:id', component: Desratizacion },

  { path: '/', redirect: '/clientes' }, // Redirigir al inicio
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
