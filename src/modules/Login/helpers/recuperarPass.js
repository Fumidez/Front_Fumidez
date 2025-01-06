
const API_URL = `http://localhost:7070/app-usuarios/usuario/recuperarPass`;

import axios from 'axios';
export const recuperarContraseniaFachada = async (correo, password) => {
    return await recuperarContrasenia(correo, password);
}



const recuperarContrasenia = async (correo, password) => {
    const data = await axios.put(API_URL, null, {
        params: { correo, password }
    }).then(r => r.data)
    .catch(error => {
        if (error.response && error.response.status === 400) {
            return false;
        } else {
            throw error; 
        }
    });
    return data;
}