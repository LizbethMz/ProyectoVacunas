//const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/conductores.php";
const API_URL = "http://172.18.3.83/ProyectoApp/backend/consultas/conductores.php";

// Obtener todos los conductores (GET)
export const getConductores = async () => {
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
    console.error("Error obteniendo conductores:", error);
    throw error;
  }
};

// Verificar si número de conductor existe
export const checkNumeroConductorExistente = async (numero) => {
  try {
    const response = await fetch(`${API_URL}?check_numero=${numero}`);
    if (!response.ok) {
      throw new Error(`Error verificando número de conductor`);
    }
    const data = await response.json();
    return data.existe;
  } catch (error) {
    console.error("Error verificando número de conductor:", error);
    throw error;
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

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Error HTTP! estado: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creando conductor:", error);
    throw error;
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

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Error HTTP! estado: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error actualizando conductor:", error);
    throw error;
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

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Error HTTP! estado: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error eliminando conductor:", error);
    throw error;
  }
};