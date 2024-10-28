import { createRouter, createWebHistory } from 'vue-router';
import Clientes from '../modules/Cliente/pages/Clientes.vue';
import Usuarios from '../modules/Usuario/pages/Usuarios.vue';
import OrdenTrabajo from '../modules/OrdenTrabajo/pages/OrdenTrabajo.vue';
import Producto from '../modules/Producto/components/Producto.vue';
import Proveedor from '../modules/Proveedor/components/Proveedor.vue';
import Informe from '../modules/InformeIPM/pages/Informe.vue';
import Login from '../modules/Login/pages/login.vue';
import Desratizacion from '../modules/InformeIPM/pages/Desratizacion.vue';

const routes = [
  { path: '/login', component: Login }, // Página de login
  { path: '/clientes', component: Clientes, meta: { requiresAuth: true } },
  { path: '/usuarios', component: Usuarios, meta: { requiresAuth: true } },
  { path: '/orden-trabajo', component: OrdenTrabajo, meta: { requiresAuth: true } },
  { path: '/productos', component: Producto, meta: { requiresAuth: true } },
  { path: '/proveedores', component: Proveedor, meta: { requiresAuth: true } },
  { path: '/informe', component: Informe, meta: { requiresAuth: true } },
  { path: '/desratizacion/:id', component: Desratizacion, meta: { requiresAuth: true } },
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
