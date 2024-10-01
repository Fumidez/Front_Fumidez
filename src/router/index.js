import { createRouter, createWebHistory } from 'vue-router';
import Clientes from '../modules/Cliente/pages/Clientes.vue';
import Usuarios from '../modules/Usuario/pages/Usuarios.vue';
import OrdenTrabajo from '../modules/OrdenTrabajo/pages/OrdenTrabajo.vue';
import Plaga from '../modules/Plaga/components/Plaga.vue';
import Producto from '../modules/Producto/components/Producto.vue';
import Proveedor from '../modules/Proveedor/components/Proveedor.vue';
import Informe from '../modules/InformeIPM/pages/Informe.vue';
import login from '../modules/Login/pages/login.vue';


const routes = [
  { path: '/clientes', component: Clientes },
  { path: '/usuarios', component: Usuarios },
  { path: '/orden-trabajo', component: OrdenTrabajo },
  { path: '/productos', component: Producto },
  { path: '/plagas', component: Plaga },
  { path: '/proveedores', component: Proveedor },
  { path: '/informe', component: Informe },
  { path: '/login', component: login },

  { path: '/', redirect: '/clientes' }, // Redirigir al inicio
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
