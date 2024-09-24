import axios from "axios";

const API_URL = `http://localhost:7070/app-informe/informe`

export const crearInformeFachada = async (bodyInforme) => {
    return await crearInforme(bodyInforme)
}

export const consultarInformeFachada = async () => {
    return await consultarInforme()
}

export const crearInformePlagaFachada = async (bodyInforme) => {
    return await crearInformePlaga(bodyInforme)
}

const crearInforme = async (bodyInforme) => {
    return await axios.post(API_URL, bodyInforme).then(r => r.data);

}

const crearInformePlaga = async (bodyInforme) => {
    return await axios.post(API_URL+'/plagas', bodyInforme).then(r => r.data);

}

const consultarInforme = async () => {
    const data = axios.get(API_URL).then(r => r.data);
    return data;
}

