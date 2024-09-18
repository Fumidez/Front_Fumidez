import { createWebHashHistory, createRouter } from 'vue-router'
import Plaga from '../modules/Plaga/components/Plaga.vue'
import Producto from '../modules/Producto/components/Producto.vue'
import Proveedor from '../modules/Proveedor/components/Proveedor.vue'

const routes = [
    { path: '/productos', component: Producto },
    { path: '/plagas', component: Plaga },
    { path: '/proveedores', component: Proveedor }
  ]
  
  const router = createRouter({
    history: createWebHashHistory('./'),
    routes,
  })
  export default router