const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/envio_estado.php";

// Obtener todos los estados de envío (GET)
export const getEstadosEnvio = async () => {
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
    console.error("Error obteniendo estados de envío:", error);
    throw error;
  }
};

// Crear un nuevo estado de envío (POST)
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
    return data;
  } catch (error) {
    console.error("Error creando estado de envío:", error);
    throw error;
  }
};

// Actualizar un estado de envío (PUT)
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
      const errorData = await response.text();
      throw new Error(`Error al actualizar: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error actualizando estado de envío:", error);
    throw error;
  }
};

// Eliminar un estado de envío (DELETE)
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
    return data;
  } catch (error) {
    console.error("Error eliminando estado de envío:", error);
    throw error;
  }
};