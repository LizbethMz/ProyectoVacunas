//const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/ciudades.php";
const API_URL = "http://172.18.3.83/ProyectoApp/backend/consultas/ciudades.php";

export const getCiudades = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo ciudades:", error);
    return { message: "Error al obtener ciudades" };
  }
};