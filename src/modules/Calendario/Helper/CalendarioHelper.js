// src/helpers/notificationHelper.js

import axios from "axios";

const API_URL = `http://localhost:7070/app-orden/orden/enviar`;

export const enviarNotificacionFachada = async (token, title, body, email) => {
    try {
        const response = await axios.post(API_URL, {
            token,
            title,
            body,
            email
        });
        return response.data; // Devuelve la respuesta del servidor
    } catch (error) {
        console.error("Error al enviar la notificación:", error);
        throw error; // Propaga el error para manejarlo en el componente
    }
};
