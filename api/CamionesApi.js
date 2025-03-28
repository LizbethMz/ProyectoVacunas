const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/camiones.php";
//const API_URL = "http://172.18.2.160/ProyectoApp/backend/consultas/camiones.php";


// Obtener todos los camiones (GET)
export const getCamiones = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json(); // Devuelve los datos en formato JSON
  } catch (error) {
    console.error("Error obteniendo camiones:", error);
    return { message: "Error al obtener camiones" };
  }
};

// Crear un camión (POST)
export const createCamion = async (camion) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camion), // Enviar datos como JSON
    });
    return await response.json(); // Devuelve respuesta en formato JSON
  } catch (error) {
    console.error("Error creando camión:", error);
    return { message: "Error al crear camión" };
  }
};

// Actualizar un camión (PUT)
export const updateCamion = async (camion) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camion), // Incluye el código y los datos actualizados
    });
    return await response.json(); // Devuelve respuesta en formato JSON
  } catch (error) {
    console.error("Error actualizando camión:", error);
    return { message: "Error al actualizar camión" };
  }
};

// Eliminar un camión (DELETE)
export const deleteCamion = async (codigo) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo }), // Enviar el código del camión a eliminar
    });
    return await response.json(); // Devuelve respuesta en formato JSON
  } catch (error) {
    console.error("Error eliminando camión:", error);
    return { message: "Error al eliminar camión" };
  }
};