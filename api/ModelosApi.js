//const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/modelos.php";
//const MARCAS_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/marcas.php";

const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/modelos.php";
const MARCAS_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/marcas.php";

// Obtener todos los modelos (GET)
export const getModelos = async () => {
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
    console.error("Error obteniendo modelos:", error);
    throw error;
  }
};

// Obtener todas las marcas (para el selector)
export const getMarcas = async () => {
  try {
    const response = await fetch(MARCAS_URL, {
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
    console.error("Error obteniendo marcas:", error);
    throw error;
  }
};

// Verificar si código de modelo existe
export const checkCodigoModeloExistente = async (codigo) => {
  try {
    const response = await fetch(`${API_URL}?check_codigo=${codigo}`);
    if (!response.ok) {
      throw new Error(`Error verificando código de modelo`);
    }
    const data = await response.json();
    return data.existe;
  } catch (error) {
    console.error("Error verificando código de modelo:", error);
    throw error;
  }
};

// Crear un modelo (POST)
export const createModelo = async (modelo) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modelo),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Error HTTP! estado: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creando modelo:", error);
    throw error;
  }
};

// Actualizar un modelo (PUT)
export const updateModelo = async (modelo) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modelo),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Error HTTP! estado: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error actualizando modelo:", error);
    throw error;
  }
};

// Eliminar un modelo (DELETE)
export const deleteModelo = async (codigo) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Error HTTP! estado: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error eliminando modelo:", error);
    throw error;
  }
};