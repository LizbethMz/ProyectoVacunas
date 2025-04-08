const API_URL = "http://192.168.1.35/ProyectoApp/backend/consultas/registro_carga.php";
//const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/registro_carga.php";


// Obtener todos los registros de carga (GET)
export const getRegistrosCarga = async () => {
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
    console.error("Error obteniendo registros de carga:", error);
    throw error;
  }
};

// Crear un registro de carga (POST)
export const createRegistroCarga = async (registro) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registro),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Error HTTP! estado: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creando registro de carga:", error);
    throw error;
  }
};

// Función para verificar si un número de envío ya existe
export const checkNumEnvioExistente = async (num_envio, registros) => {
  // Si ya tenemos los registros cargados, verificamos localmente primero
  if (registros && registros.length > 0) {
    const existe = registros.some(reg => reg.num_envio == num_envio);
    if (existe) return true;
  }

  // Si no estamos seguros, hacemos una verificación en el servidor
  try {
    const response = await fetch(`${API_URL}?check_num_envio=${num_envio}`);
    if (!response.ok) {
      throw new Error(`Error verificando número de envío`);
    }
    const data = await response.json();
    return data.existe;
  } catch (error) {
    console.error("Error verificando número de envío:", error);
    throw error;
  }
};