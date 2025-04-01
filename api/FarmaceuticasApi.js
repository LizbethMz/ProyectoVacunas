//const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/farmaceuticas.php";
const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/farmaceuticas.php";


// Obtener todas las farmacéuticas (GET)
export const getFarmaceuticas = async () => {
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
    console.error("Error obteniendo farmacéuticas:", error);
    throw error;
  }
};

// Crear una farmacéutica (POST)
export const createFarmaceutica = async (farmaceutica) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(farmaceutica),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creando farmacéutica:", error);
    throw error;
  }
};

// Actualizar una farmacéutica (PUT) - Solo teléfono y correo
export const updateFarmaceutica = async (codigo, farmaceutica) => {
  try {
    // Solo enviamos teléfono y correo para actualizar
    const { telefono, correo } = farmaceutica;
    
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        codigo,
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
    console.error("Error actualizando farmacéutica:", error);
    throw error;
  }
};

// Eliminar una farmacéutica (DELETE)
export const deleteFarmaceutica = async (codigo) => {
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
    console.error("Error eliminando farmacéutica:", error);
    throw error;
  }
};