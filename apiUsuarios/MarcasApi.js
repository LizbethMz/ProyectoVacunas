const API_URL = "http://192.168.1.35/ProyectoApp/backend/consultas/marcas.php";
//const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/marcas.php";


// Obtener todas las marcas (GET)
export const getMarcas = async () => {
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
    console.error("Error obteniendo marcas:", error);
    throw error;
  }
};

// Verificar si código de marca existe
export const checkCodigoMarcaExistente = async (codigo) => {
  try {
    const response = await fetch(`${API_URL}?check_codigo=${codigo}`);
    if (!response.ok) {
      throw new Error(`Error verificando código de marca`);
    }
    const data = await response.json();
    return data.existe;
  } catch (error) {
    console.error("Error verificando código de marca:", error);
    throw error;
  }
};

// Crear una marca (POST)
export const createMarca = async (marca) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(marca),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Error HTTP! estado: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creando marca:", error);
    throw error;
  }
};

// Actualizar una marca (PUT)
export const updateMarca = async (marca) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(marca),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Error HTTP! estado: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error actualizando marca:", error);
    throw error;
  }
};

// Eliminar una marca (DELETE)
export const deleteMarca = async (codigo) => {
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
    console.error("Error eliminando marca:", error);
    throw error;
  }
};