import axios from "axios";

const API_URL = `http://localhost:7070/app-orden/orden`

export const crearOrdenFachada = async (clienteOrden) => {
    return await crearOrden(clienteOrden)
}

export const consultarOrdenFachada = async () => {
    return await consultarOrden()
}

const crearOrden = async (clienteOrden) => {
    return await axios.post(API_URL, clienteOrden).then(r => r.data);

}

const consultarOrden = async () => {
    const data = axios.get(API_URL).then(r => r.data);
    return data;
}

