//const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/envio_estado.php";
const API_URL = "http://172.18.3.83/ProyectoApp/backend/consultas/envio_estado.php";


let listeners = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const subscribeToEstadoChanges = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};

export const getEstadosEnvio = async (num_envio = null) => {
  try {
    let url = API_URL;
    if (num_envio) {
      url += `?num_envio=${num_envio}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo estados de envío:", error);
    throw error;
  }
};

export const createEstadoEnvio = async (estadoEnvio) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estadoEnvio),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    notifyListeners();
    return data;
  } catch (error) {
    console.error("Error creando estado de envío:", error);
    throw error;
  }
};

export const updateEstadoEnvio = async (id, estadoEnvio) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...estadoEnvio, id }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    notifyListeners();
    return data;
  } catch (error) {
    console.error("Error actualizando estado de envío:", error);
    throw error;
  }
};

export const deleteEstadoEnvio = async (id) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    notifyListeners();
    return data;
  } catch (error) {
    console.error("Error eliminando estado de envío:", error);
    throw error;
  }
};