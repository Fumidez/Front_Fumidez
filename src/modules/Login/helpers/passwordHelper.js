const API_URL = `http://localhost:7070/app-usuarios/usuario/login`

export async function solicitarRecuperacion(email) {
  try {
    const response = await fetch(`${BASE_URL}/password-recovery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Error al solicitar recuperación de contraseña.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en el helper de recuperación:", error);
    throw error;
  }
}
