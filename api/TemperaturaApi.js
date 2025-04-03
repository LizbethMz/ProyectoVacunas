const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/temperatura.php";
//const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/temperatura.php";


export const getTemperaturas = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo registros de temperatura:", error);
    return { message: "Error al obtener registros de temperatura" };
  }
};