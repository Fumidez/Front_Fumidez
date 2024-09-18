import axios from "axios";

const API_URL = `http://localhost:7070/app-clientes/cliente`

export const crearClienteFachada = async (clienteBody) => {
    return await crearCliente(clienteBody)
}

export const consultarClienteFachada = async () => {
    return await consultarCliente()
}

const crearCliente = async (clienteBody) => {
    return await axios.post(API_URL, clienteBody).then(r => r.data);

}

const consultarCliente = async () => {
    const data = axios.get(API_URL).then(r => r.data);
    return data;
}

