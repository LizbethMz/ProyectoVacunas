const API_URL = "http://172.18.3.83/ProyectoApp/backend/consultas/paquetes.php";
//const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/paquetes.php";

export const getPaquetes = async () => {
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
    console.error("Error obteniendo paquetes:", error);
    throw error;
  }
};

// Crear un paquete (POST)
export const createPaquete = async (paquete) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paquete),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creando paquete:", error);
    throw error;
  }
};

// Actualizar un paquete (PUT)
export const updatePaquete = async (codigo, paquete) => {
  try {
    // Solo enviamos los campos editables
    const editableFields = {
      codigo: codigo,
      temp_requerida: paquete.temp_requerida,
      descripcion: paquete.descripcion,
      vacuna: paquete.vacuna
    };

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editableFields),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error al actualizar: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error actualizando paquete:", error);
    throw error;
  }
};

// Eliminar un paquete (DELETE)
export const deletePaquete = async (codigo) => {
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
    console.error("Error eliminando paquete:", error);
    throw error;
  }
};