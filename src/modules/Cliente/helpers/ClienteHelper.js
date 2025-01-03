import axios from "axios";

const API_URL = `http://localhost:7070/app-clientes/cliente`

export const crearClienteFachada = async (clienteBody) => {
    return await crearCliente(clienteBody)
}

export const consultarClienteFachada = async () => {
    return await consultarCliente()
}

export const buscarClientePorIdFachada = async (id) => {
    return await buscarPorId(id);
}
export const obtenerClienteFachada = async (idCliente) => {
    return await obtenerCliente(idCliente);
  };
  
  const obtenerCliente = async (idCliente) => {
    try {
      const response = await axios.get(`${API_URL}/${idCliente}`);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo Cliente:", error);
      throw error;
    }
  };
  

const crearCliente = async (clienteBody) => {
    return await axios.post(API_URL, clienteBody).then(r => r.data);

}

const consultarCliente = async () => {
    const data = axios.get(API_URL).then(r => r.data);
    return data;
}

const buscarPorId = async (id) => {
    return await axios.get(`${API_URL}/${id}`).then(r => r.data);
}
