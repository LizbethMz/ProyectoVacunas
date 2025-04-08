const API_URL = "http://192.168.1.35/ProyectoApp/backend/consultas/camiones.php";
//const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/camiones.php";

// Obtener todos los camiones (GET)
export const getCamiones = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo camiones:", error);
    throw error;
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
      body: JSON.stringify(camion),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creando camión:", error);
    throw error;
  }
};

// Actualizar un camión (PUT)
export const updateCamion = async (codigo, camion) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...camion, codigo }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error al actualizar: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error actualizando camión:", error);
    throw error;
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
      body: JSON.stringify({ codigo }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error eliminando camión:", error);
    throw error;
  }
};