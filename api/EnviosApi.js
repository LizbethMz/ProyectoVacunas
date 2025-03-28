const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/envios.php";
//const API_URL = "http://172.18.2.160/ProyectoApp/backend/consultas/envios.php";


// Obtener todos los envíos (GET)
export const getEnvios = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo envíos:", error);
    return { message: "Error al obtener envíos" };
  }
};

// Crear un envío (POST)
export const createEnvio = async (envio) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envio),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando envío:", error);
    return { message: "Error al crear envío" };
  }
};

// Actualizar un envío (PUT)
export const updateEnvio = async (numero, envio) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero, ...envio }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando envío:", error);
    return { message: "Error al actualizar envío" };
  }
};

// Eliminar un envío (DELETE)
export const deleteEnvio = async (numero) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando envío:", error);
    return { message: "Error al eliminar envío" };
  }
};