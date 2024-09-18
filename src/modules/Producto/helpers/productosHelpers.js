import axios from "axios";

const API_URL = "http://localhost:7070/app-producto/producto";

// Crear un Producto
export const crearProductoFachada = async (bodyProducto) => {
  return await crearProducto(bodyProducto);
};

const crearProducto = async (bodyProducto) => {
  try {
    const response = await axios.post(API_URL, bodyProducto);
    return response.data;
  } catch (error) {
    console.error("Error creando Producto:", error);
    throw error;
  }
};

// Obtener un Producto por ID
export const obtenerProductoFachada = async (idProducto) => {
  return await obtenerProducto(idProducto);
};

const obtenerProducto = async (idProducto) => {
  try {
    const response = await axios.get(`${API_URL}/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo Producto:", error);
    throw error;
  }
};

// Obtener todos los Productos
export const obtenerTodosLosProductosFachada = async () => {
  return await obtenerTodosLosProductos();
};

const obtenerTodosLosProductos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo todos los Productos:", error);
    throw error;
  }
};

// Actualizar un Producto
export const actualizarProductoFachada = async (
  idProducto,
  bodyProductoActualizado
) => {
  return await actualizarProducto(idProducto, bodyProductoActualizado);
};

const actualizarProducto = async (
  idProducto,
  bodyProductoActualizado
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${idProducto}`,
      bodyProductoActualizado
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando Producto:", error);
    throw error;
  }
};

// Eliminar un Producto
export const eliminarProductoFachada = async (idProducto) => {
  return await eliminarProducto(idProducto);
};

const eliminarProducto = async (idProducto) => {
  try {
    const response = await axios.delete(`${API_URL}/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando Producto:", error);
    throw error;
  }
};