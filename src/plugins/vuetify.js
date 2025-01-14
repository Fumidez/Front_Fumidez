// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import 'vuetify/styles';

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light', // Cambia a 'dark' si prefieres un tema oscuro
    },
});

export default vuetify;
