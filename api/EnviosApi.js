//const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/envios.php";
//const ESTADOS_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/estados.php";

const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/envios.php";
const ESTADOS_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/estados.php";

// Obtener todos los envíos con su último estado
export const getEnvios = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo envíos:", error);
    throw error;
  }
};

// Obtener los estados base disponibles
export const getEstadosDisponibles = async () => {
  try {
    const response = await fetch(ESTADOS_URL);
    const data = await response.json();
    
    // Si no hay estados configurados, devolver los básicos
    if (!Array.isArray(data) || data.length === 0) {
      return [
        { numero: 1, descripcion: 'Preparando carga' },
        { numero: 2, descripcion: 'En tránsito' },
        { numero: 3, descripcion: 'Entregado' },
        { numero: 4, descripcion: 'Retrasado' },
        { numero: 5, descripcion: 'Cancelado' }
      ];
    }
    return data;
  } catch (error) {
    console.error("Error obteniendo estados:", error);
    return [
      { numero: 1, descripcion: 'Preparando carga' },
      { numero: 2, descripcion: 'En tránsito' },
      { numero: 3, descripcion: 'Entregado' },
      { numero: 4, descripcion: 'Retrasado' },
      { numero: 5, descripcion: 'Cancelado' }
    ];
  }
};

// Crear nuevo envío (con estado inicial automático)
export const crearEnvio = async (envio) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envio),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando envío:", error);
    throw error;
  }
};

// Actualizar envío (datos básicos)
export const actualizarEnvio = async (numero, envio) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero, ...envio }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando envío:", error);
    throw error;
  }
};

// Cambiar estado de un envío
export const cambiarEstadoEnvio = async (num_envio, estado) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numero: num_envio,
        nuevo_estado: estado
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error cambiando estado:", error);
    throw error;
  }
};

// Eliminar envío (solo si está en estado Entregado o Cancelado)
export const eliminarEnvio = async (numero) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando envío:", error);
    throw error;
  }
};