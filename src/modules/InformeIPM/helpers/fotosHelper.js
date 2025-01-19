import axios from "axios";
const API_URL = `http://localhost:7070/app-almacenamiento/almacenamiento`

export const guardarFotosFachada = async (fotos) => {
    return await guardarFotos(fotos)
}

export const consultarFotosIdInformeFachada = async (id) => {
    return await consultarFotosIdInforme(id)
}

const guardarFotos = async (fotos) => {
    return await axios.post(API_URL+'/save', fotos).then(r => r.data);

}

const consultarFotosIdInforme = async (id) => {
    const data = axios.get(API_URL+'/buscarInforme/'+id).then(r => r.data);
    return data;
}

export const eliminarFotoFachada = async (id) => {
    return await eliminarFoto(id);
  };
  
  const eliminarFoto = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error eliminando foto:", error);
      throw error;
    }
  };