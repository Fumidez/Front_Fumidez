import { createRouter, createWebHistory } from 'vue-router';
import Clientes from '../modules/Cliente/pages/Clientes.vue';
import Usuarios from '../modules/Usuario/pages/Usuarios.vue';
import OrdenTrabajo from '../modules/OrdenTrabajo/pages/OrdenTrabajo.vue';
import OrdenTrabajoLista from '../modules/OrdenTrabajo/pages/ListaOrdenTrabajo.vue';
import OrdenTrabajoRegistrar from '../modules/OrdenTrabajo/pages/RegistrarOrdenTrabajo.vue';
import Producto from '../modules/Producto/components/Producto.vue';
import Proveedor from '../modules/Proveedor/components/Proveedor.vue';
import Login from '../modules/Login/pages/login.vue';
import Desratizacion from '../modules/InformeIPM/pages/Desratizacion.vue';

import InformeLista from '../modules/InformeIPM/pages/ListaInforme.vue'
import InformeRegistrar from '../modules/InformeIPM/pages/RegistrarInforme.vue'

import Calendario from '../modules/Calendario/Page/CalendarioPage.vue';
import ListaProductos from '../modules/Producto/components/ListaProductos.vue';
import RegistrarProducto from '../modules/Producto/components/RegistrarProducto.vue';
import ListaProveedor from '../modules/Proveedor/components/ListaProveedor.vue';
import RegistroProveedor from '../modules/Proveedor/components/RegistroProveedor.vue';
import ListarClientes from '../modules/Cliente/pages/ListarClientes.vue';
import RegistroClientes from '../modules/Cliente/pages/RegistroClientes.vue';
import ListarUsuarios from '../modules/Usuario/pages/ListarUsuarios.vue';
import RegistroUsuarios from '../modules/Usuario/pages/RegistroUsuarios.vue';
import RegistrarInforme from '../modules/InformeIPM/pages/RegistrarInforme.vue';

import CargarArchivo from '../components/CargarArchivo.vue';
import RecuperarContrasenia from '../modules/Login/pages/RecuperarContrasenia.vue';
import CambioContrasenia from '../modules/Login/pages/CambioContrasenia.vue';
import Home from '../modules/Home/pages/Home.vue';

const routes = [
  { path: '/login', component: Login }, // Página de login
  { path: '/recuperar_contraseña', component: RecuperarContrasenia}, // Página de login

  { path: '/clientes', component: Clientes , meta: { requiresAuth: true } },
  { path: '/clientes_lista', component: ListarClientes , meta: { requiresAuth: true } },
  { path: '/cliente_registrar', component: RegistroClientes , meta: { requiresAuth: true } },
  { path: '/cliente_ver/:id', component: RegistroClientes , meta: { requiresAuth: true } },

  { path: '/usuarios', component: Usuarios , meta: { requiresAuth: true } },
  { path: '/orden_trabajo', component: OrdenTrabajo, meta: { requiresAuth: true } },
  { path: '/orden_trabajo_lista', component: OrdenTrabajoLista, meta: { requiresAuth: true } },
  { path: '/orden_trabajo_registro', component: OrdenTrabajoRegistrar, meta: { requiresAuth: true } },
  { path: '/orden_trabajo_ver/:id', component: OrdenTrabajoRegistrar, meta: { requiresAuth: true } },
  { path: '/productos', component: Producto, meta: { requiresAuth: true } },
  { path: '/proveedores', component: Proveedor, meta: { requiresAuth: true } },
  { path: '/proveedores_lista', component: ListaProveedor, meta: { requiresAuth: true } },
  { path: '/proveedor_registrar', component: RegistroProveedor, meta: { requiresAuth: true } },

  { path: '/informe_lista', component: InformeLista, meta: { requiresAuth: true } },
  { path: '/informe_registrar', component: InformeRegistrar, meta: { requiresAuth: true } },
  { path: '/desratizacion/:id', component: Desratizacion, meta: { requiresAuth: true } },
  { path: '/calendario', component: Calendario, meta: { requiresAuth: true } },
  { path: '/productos_lista', component: ListaProductos, meta: { requiresAuth: true } },
  { path: '/producto_registro', component: RegistrarProducto, meta: { requiresAuth: true } },
  { path: '/producto_ver/:id', component: RegistrarProducto, meta: { requiresAuth: true } },
  { path: '/proveedor_ver/:id', component: RegistroProveedor, meta: { requiresAuth: true } },
  { path: '/usuarios_lista', component: ListarUsuarios, meta: { requiresAuth: false } },
  { path: '/usuario_ver/:id', component: RegistroUsuarios, meta: { requiresAuth: true } },
  { path: '/usuario_registro', component: RegistroUsuarios, meta: { requiresAuth: false } },
  { path: '/informe_ver/:id', component: RegistrarInforme, meta: { requiresAuth: true } },
  { path: '/cambiar_contrasenia/:correo/:token', component: CambioContrasenia, meta: { requiresAuth: true } },
  { path: '/inicio', component: Home, meta: { requiresAuth: false } },

  { path: '/', redirect: '/inicio' },
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
    next('/inicio');
  } else {
    next();
  }
});

export default router;
