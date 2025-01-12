import axios from "axios";

const API_URL = "http://localhost:7070/app-email/email";
const API_URL_USER =  `http://localhost:7070/app-usuarios/usuario`;

export const recuperarContraseniaFachada = async (correo) => {
    return await recuperarContrasenia(correo);
};

export const cambiarContraseniaFachada = async (correo, password, token) => {
    return await cambiarContrasenia(correo, password, token);
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


const cambiarContrasenia = async (correo, password, token) => {
    try {
        const response = await axios.put(`${API_URL_USER}/recuperarPass`, null, { 
            params: { correo, password, token }
        });
        return response.data;
    } catch (error) {
        console.error("Error al recuperar la contraseña:", error);
        throw error;
    }
};
