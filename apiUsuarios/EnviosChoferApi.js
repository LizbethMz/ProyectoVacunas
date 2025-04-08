const API_URL = "http://192.168.1.35/ProyectoApp/backend/consultas/getEnviosChofer.php";

// Obtener envíos del chofer (GET)
export const getEnviosChofer = async (num_conductor) => {
  try {
    const response = await fetch(`${API_URL}?num_conductor=${num_conductor}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo envíos del chofer:", error);
    return { message: "Error al obtener envíos" };
  }
}; 