import axios from "axios";

const API_URL = "http://localhost:7070/app-email/email";

export const recuperarContraseniaFachada = async (correo) => {
    return await recuperarContrasenia(correo);
};

const recuperarContrasenia = async (correo) => {
    try {
        const response = await axios.post(`${API_URL}/recuperarPassword`, null, { 
            params: { correo }
        });
        return response.data;
    } catch (error) {
        console.error("Error al recuperar la contraseña:", error);
        throw error;
    }
};
