import axios from "axios";

const API_URL = `http://localhost:7070/app-desratizacion/formulario`

export const crearFormularioFachada = async (clienteFormulario) => {
    return await crearFormulario(clienteFormulario)
}

export const consultarFormularioFachada = async () => {
    return await consultarFormulario()
}

const crearFormulario = async (clienteFormulario) => {
    return await axios.post(API_URL, clienteFormulario).then(r => r.data);

}

const consultarFormulario = async () => {
    const data = axios.get(API_URL).then(r => r.data);
    return data;
}

