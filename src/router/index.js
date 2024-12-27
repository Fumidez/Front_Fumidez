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
import Login from '../modules/Login/pages/login.vue';
import Desratizacion from '../modules/InformeIPM/pages/Desratizacion.vue';

import InformeLista from '../modules/InformeIPM/pages/ListaInforme.vue'
import InformeRegistrar from '../modules/InformeIPM/pages/RegistrarInforme.vue'

import Calendario from '../modules/Calendario/Page/CalendarioPage.vue';
import vistaF from '../components/vistaF.vue';


const routes = [
  { path: '/login', component: Login }, // Página de login
  { path: '/clientes', component: Clientes , meta: { requiresAuth: true } },
  { path: '/usuarios', component: Usuarios , meta: { requiresAuth: true } },
  { path: '/orden_trabajo', component: OrdenTrabajo, meta: { requiresAuth: true } },
  { path: '/orden_trabajo_lista', component: OrdenTrabajoLista, meta: { requiresAuth: true } },
  { path: '/orden_trabajo_registro', component: OrdenTrabajoRegistrar, meta: { requiresAuth: true } },
  { path: '/orden_trabajo_ver/:id', component: OrdenTrabajoRegistrar, meta: { requiresAuth: true } },
  { path: '/productos', component: Producto, meta: { requiresAuth: true } },
  { path: '/proveedores', component: Proveedor, meta: { requiresAuth: true } },
  { path: '/informe', component: Informe, meta: { requiresAuth: true } },
  { path: '/informe_lista', component: InformeLista, meta: { requiresAuth: true } },
  { path: '/informe_registrar', component: InformeRegistrar, meta: { requiresAuth: true } },
  { path: '/desratizacion/:id', component: Desratizacion, meta: { requiresAuth: true } },
  { path: '/calendario', component: Calendario, meta: { requiresAuth: true } },

  { path: '/vistaF', component: vistaF },
  { path: '/', redirect: '/clientes' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/informe');
  } else {
    next();
  }
});

export default router;
