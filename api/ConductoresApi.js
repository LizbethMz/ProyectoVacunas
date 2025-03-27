const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/conductores.php";

// Obtener todos los conductores (GET)
export const getConductores = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo conductores:", error);
    return { message: "Error al obtener conductores" };
  }
};

// Crear un conductor (POST)
export const createConductor = async (conductor) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conductor),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando conductor:", error);
    return { message: "Error al crear conductor" };
  }
};

// Actualizar un conductor (PUT)
export const updateConductor = async (conductor) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conductor),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando conductor:", error);
    return { message: "Error al actualizar conductor" };
  }
};

// Eliminar un conductor (DELETE)
export const deleteConductor = async (numero) => {
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
    console.error("Error eliminando conductor:", error);
    return { message: "Error al eliminar conductor" };
  }
};