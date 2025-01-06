import axios from "axios";
const API_URL = `http://localhost:7070/app-usuarios/usuario/sendNotif`;
//Fachada
export const enviarcorreoFachada= async(cuerpoCorreo)=>{
    return await enviarcorreoApi(cuerpoCorreo)
}

//Consumir
const enviarcorreoApi= async (cuerpoCorreo)=>{
 
    return await axios.post(API_URL,cuerpoCorreo).then(r => r.data)
   
}