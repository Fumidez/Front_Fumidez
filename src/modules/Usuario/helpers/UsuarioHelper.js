import axios from "axios";

const API_URL = `http://localhost:7070/app-usuarios/usuario`

export const crearUsuarioFachada = async (usuarioBody) => {
    return await crearUsuario(usuarioBody)
}

export const consultarUsuarioFachada = async () => {
    return await consultarUsuario()
}

export const obtenerUsuarioFachada = async (idUsuario) => {
    return await obtenerUsuario(idUsuario);
  };
  
  const obtenerUsuario = async (idUsuario) => {
    try {
      const response = await axios.get(`${API_URL}/${idUsuario}`);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo Usuario:", error);
      throw error;
    }
  };

const crearUsuario = async (usuarioBody) => {
    return await axios.post(API_URL, usuarioBody).then(r => r.data);

}

const consultarUsuario = async () => {
    const data = axios.get(API_URL).then(r => r.data);
    return data;
}

