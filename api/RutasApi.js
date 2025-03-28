const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/rutas.php";
//const API_URL = "http://172.18.2.160/ProyectoApp/backend/consultas/rutas.php";


// Obtener todas las rutas (GET)
export const getRutas = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo rutas:", error);
    return { message: "Error al obtener rutas" };
  }
};

// Crear una ruta (POST)
export const createRuta = async (ruta) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ruta),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando ruta:", error);
    return { message: "Error al crear ruta" };
  }
};

// Actualizar una ruta (PUT)
export const updateRuta = async (ruta) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ruta),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando ruta:", error);
    return { message: "Error al actualizar ruta" };
  }
};

// Eliminar una ruta (DELETE)
export const deleteRuta = async (numero) => {
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
    console.error("Error eliminando ruta:", error);
    return { message: "Error al eliminar ruta" };
  }
};