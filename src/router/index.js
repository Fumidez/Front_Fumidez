import { createRouter, createWebHistory } from 'vue-router';
import Clientes from '../pages/Clientes.vue';
import Productos from '../pages/Productos.vue';
import Usuarios from '../pages/Usuarios.vue';
import OrdenTrabajo from '../pages/OrdenTrabajo.vue';

const routes = [
  { path: '/clientes', component: Clientes },
  { path: '/productos', component: Productos },
  { path: '/usuarios', component: Usuarios },
  { path: '/orden-trabajo', component: OrdenTrabajo },
  { path: '/', redirect: '/clientes' }, // Redirigir al inicio
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
