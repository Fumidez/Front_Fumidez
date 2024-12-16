import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importar los íconos de Bootstrap (opcional)
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importar funcionalidades de JS de Bootstrap (opcional, si usas dropdowns, modales, etc.)
import 'bootstrap';
createApp(App)
  .use(router)
  .mount('#app');
