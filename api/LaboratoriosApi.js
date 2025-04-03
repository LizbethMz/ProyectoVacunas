const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/laboratorios.php";
//const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/laboratorios.php";

// Obtener todos los laboratorios (GET)
export const getLaboratorios = async () => {
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
    console.error("Error obteniendo laboratorios:", error);
    throw error;
  }
};

// Crear un laboratorio (POST)
export const createLaboratorio = async (laboratorio) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(laboratorio),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creando laboratorio:", error);
    throw error;
  }
};

// Actualizar un laboratorio (PUT) - Solo contacto
export const updateLaboratorio = async (codigo, laboratorio) => {
  try {
    // Solo enviamos contacto para actualizar
    const { contacto } = laboratorio;
    
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        codigo,
        contacto 
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error al actualizar: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error actualizando laboratorio:", error);
    throw error;
  }
};

// Eliminar un laboratorio (DELETE)
export const deleteLaboratorio = async (codigo) => {
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
    console.error("Error eliminando laboratorio:", error);
    throw error;
  }
};