const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/sucursales.php";
//const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/sucursales.php";



// Obtener todas las sucursales (GET)
export const getSucursales = async () => {
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
    console.error("Error obteniendo sucursales:", error);
    throw error;
  }
};

// Crear una sucursal (POST)
export const createSucursal = async (sucursal) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sucursal),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creando sucursal:", error);
    throw error;
  }
};

export const updateSucursal = async (codigo, sucursal) => {
  try {
    // Solo enviamos teléfono y correo para actualizar
    const { telefono, correo } = sucursal;
    
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
    console.error("Error actualizando sucursal:", error);
    throw error;
  }
};

// Eliminar una sucursal (DELETE)
export const deleteSucursal = async (codigo) => {
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
    console.error("Error eliminando sucursal:", error);
    throw error;
  }
};