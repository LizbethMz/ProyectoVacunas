const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/incidentes.php";
//const API_URL = "http://172.18.2.160/ProyectoApp/backend/consultas/incidentes.php";

// Obtener todos los incidentes (GET)
export const getIncidentes = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo incidentes:", error);
    return { message: "Error al obtener incidentes" };
  }
};

// Crear un incidente (POST)
export const createIncidente = async (incidente) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incidente),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando incidente:", error);
    return { message: "Error al crear incidente" };
  }
};

// Actualizar un incidente (PUT)
export const updateIncidente = async (codigo, incidente) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo, ...incidente }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando incidente:", error);
    return { message: "Error al actualizar incidente" };
  }
};

// Eliminar un incidente (DELETE)
export const deleteIncidente = async (codigo) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando incidente:", error);
    return { message: "Error al eliminar incidente" };
  }
};