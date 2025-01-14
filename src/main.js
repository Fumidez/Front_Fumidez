import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importar los íconos de Bootstrap (opcional)
import 'bootstrap-icons/font/bootstrap-icons.css';
import vuetify from './plugins/vuetify'; // Archivo de configuración de Vuetify
import 'vuetify/styles';
// Importar funcionalidades de JS de Bootstrap (opcional, si usas dropdowns, modales, etc.)
import 'bootstrap';
const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount('#app');
