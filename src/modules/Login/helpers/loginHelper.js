import axios from "axios";

const API_URL = `http://localhost:7070/app-usuarios/usuario/login`



export const consultarLoginFachada = async (bodyLogin) => {
    return await consultarLogin(bodyLogin)
}


const consultarLogin = async (bodyLogin) => {
    const response = await axios.post(API_URL, {
      email: bodyLogin.email,
      password: bodyLogin.password,
    });
    return response.data;
  };