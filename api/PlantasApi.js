//const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/plantas.php";
const API_URL = "http://172.18.3.83/ProyectoApp/backend/consultas/plantas.php";


// Obtener todas las plantas (GET)
export const getPlantas = async () => {
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
    console.error("Error obteniendo plantas:", error);
    throw error;
  }
};

// Crear una planta (POST)
export const createPlanta = async (planta) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planta),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creando planta:", error);
    throw error;
  }
};

// Actualizar una planta (PUT) - Solo teléfono y correo
export const updatePlanta = async (numero, planta) => {
  try {
    // Solo enviamos teléfono y correo para actualizar
    const { telefono, correo } = planta;
    
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        numero,
        telefono,
        correo 
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error al actualizar: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error actualizando planta:", error);
    throw error;
  }
};

// Eliminar una planta (DELETE)
export const deletePlanta = async (numero) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error eliminando planta:", error);
    throw error;
  }
};