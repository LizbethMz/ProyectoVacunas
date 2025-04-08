import { API_URL } from './config';

// Obtener todos los envíos con su último estado
export const getEnvios = async () => {
  try {
    const response = await fetch(`${API_URL}/backend/consultas/envios.php`);
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo envíos:", error);
    throw error;
  }
};

// Obtener los estados base disponibles
export const getEstadosDisponibles = async () => {
  try {
    const response = await fetch(`${API_URL}/backend/consultas/estados.php`);
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
    const response = await fetch(`${API_URL}/backend/consultas/envios.php`, {
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
    const response = await fetch(`${API_URL}/backend/consultas/envios.php`, {
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
    const response = await fetch(`${API_URL}/backend/consultas/envios.php`, {
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
    const response = await fetch(`${API_URL}/backend/consultas/envios.php`, {
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

// Obtener envíos por conductor
export const getEnviosPorConductor = async (conductorId) => {
  try {
    const response = await fetch(`${API_URL}/backend/consultasUsuarios/getEnviosChofer.php?conductorId=${conductorId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Respuesta de la API:', data);
    return data;
  } catch (error) {
    console.error("Error obteniendo envíos del conductor:", error);
    throw error;
  }
};

// Obtener envíos activos por conductor
export const getEnviosActivosPorConductor = async (conductorId) => {
  try {
    console.log('Obteniendo envíos para conductor:', conductorId);
    const response = await fetch(`${API_URL}/backend/consultasUsuarios/envios_conductor.php?conductorId=${conductorId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      credentials: 'include'
    });

    console.log('Respuesta HTTP:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Respuesta de la API:', JSON.stringify(data, null, 2));

    if (data.success && Array.isArray(data.data)) {
      return {
        success: true,
        data: data.data.map(envio => ({
          ...envio,
          id: envio.numero.toString()
        }))
      };
    } else {
      console.error('Error en la respuesta:', data.message);
      return {
        success: false,
        data: [],
        message: data.message || 'Error al cargar envíos'
      };
    }
  } catch (error) {
    console.error('Error al obtener envíos:', error);
    return {
      success: false,
      data: [],
      message: error.message
    };
  }
};