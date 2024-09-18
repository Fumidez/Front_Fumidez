import axios from "axios";

const API_URL = "http://localhost:7070/app-proveedor/proveedor";

// Crear un Proveedor
export const crearProveedorFachada = async (bodyProveedor) => {
  return await crearProveedor(bodyProveedor);
};

const crearProveedor = async (bodyProveedor) => {
  try {
    const response = await axios.post(API_URL, bodyProveedor);
    return response.data;
  } catch (error) {
    console.error("Error creando Proveedor:", error);
    throw error;
  }
};

// Obtener un Proveedor por ID
export const obtenerProveedorFachada = async (idProveedor) => {
  return await obtenerProveedor(idProveedor);
};

const obtenerProveedor = async (idProveedor) => {
  try {
    const response = await axios.get(`${API_URL}/${idProveedor}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo Proveedor:", error);
    throw error;
  }
};

// Obtener todos los Proveedors
export const obtenerTodosLosProveedorsFachada = async () => {
  return await obtenerTodosLosProveedors();
};

const obtenerTodosLosProveedors = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo todos los Proveedors:", error);
    throw error;
  }
};

// Actualizar un Proveedor
export const actualizarProveedorFachada = async (
  idProveedor,
  bodyProveedorActualizado
) => {
  return await actualizarProveedor(idProveedor, bodyProveedorActualizado);
};

const actualizarProveedor = async (
  idProveedor,
  bodyProveedorActualizado
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${idProveedor}`,
      bodyProveedorActualizado
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando Proveedor:", error);
    throw error;
  }
};

// Eliminar un Proveedor
export const eliminarProveedorFachada = async (idProveedor) => {
  return await eliminarProveedor(idProveedor);
};

const eliminarProveedor = async (idProveedor) => {
  try {
    const response = await axios.delete(`${API_URL}/${idProveedor}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando Proveedor:", error);
    throw error;
  }
};