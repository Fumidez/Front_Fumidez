import axios from "axios";

const API_URL = `http://localhost:7070/app-orden/orden`

export const crearOrdenFachada = async (clienteOrden) => {
    return await crearOrden(clienteOrden)
}

export const consultarOrdenFachada = async () => {
    return await consultarOrden()
}
export const consultarOrdenSimpleFachada = async () => {
    return await consultarOrdenSimple()
}
export const buscarOrdenPorId = async (id) => {
    return await buscarPorId(id);
}



export const actualizarOrdenFachada = async (id, clienteOrden) => {
    return await actualizarOrden(id, clienteOrden);
}

export const actualizarOrdenEstadoFachada = async (id, estado) => {
    return await actualizarOrdenEstado(id, estado);
}

const crearOrden = async (clienteOrden) => {
    return await axios.post(API_URL, clienteOrden).then(r => r.data);

}

const consultarOrden = async () => {
    const data = axios.get(API_URL).then(r => r.data);
    return data;
}


const consultarOrdenSimple = async () => {
    const data = axios.get(API_URL + "/orderS").then(r => r.data);
    return data;
}

const actualizarOrden = async (id, clienteOrden) => {
    return await axios.put(`${API_URL}/${id}`, clienteOrden).then(r => r.data);
}
const buscarPorId = async (id) => {
    return await axios.get(`${API_URL}/${id}`).then(r => r.data);
}

const actualizarOrdenEstado = async (id, estado) => {
    return await axios.put(`${API_URL}/status/${id}`, estado).then(r => r.data);
}

