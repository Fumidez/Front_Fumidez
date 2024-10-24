import axios from "axios";

const API_URL = `http://localhost:7070/app-desratizacion/formulario`

export const crearDesratizacionFachada = async (bodyDesratizacion) => {
    return await crearDesratizacion(bodyDesratizacion)
}

export const consultarDesratizacionFachada = async () => {
    return await consultarDesratizacion()
}

export const consultarDesratizacionFachadaPorIdInforme = async (id) => {
    return await consultarDesratizacionPorIdInforme(id)
}


const crearDesratizacion = async (bodyDesratizacion) => {
    return await axios.post(API_URL, bodyDesratizacion).then(r => r.data);

}

const consultarDesratizacion = async () => {
    const data = axios.get(API_URL).then(r => r.data);
    return data;
}

const consultarDesratizacionPorIdInforme = async (id) => {
    const data = axios.get(API_URL+'/informe/'+id).then(r => r.data);
    return data;
}



