const API_BASE_URL = "http://192.168.100.8/ProyectoApp/backend/consultas";
//const API_BASE_URL = "http://172.18.3.5/ProyectoApp/backend/consultas";
const ASIGNACIONES_URL = `${API_BASE_URL}/camion_conductor.php`;
const CONDUCTORES_URL = `${API_BASE_URL}/conductores.php`;
const CAMIONES_URL = `${API_BASE_URL}/camiones.php`;

// Configuración global
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

/**
 * Maneja la respuesta del servidor y parsea JSON
 * @param {Response} response 
 * @returns {Promise<Object>}
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      const text = await response.text();
      throw new Error(text || `Error HTTP (${response.status} ${response.statusText})`);
    }
    
    const error = new Error(errorData.error || errorData.message || `Error HTTP (${response.status})`);
    error.response = errorData;
    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return response.text();
  }

  return response.json();
};

/**
 * Ejecuta una petición con reintentos
 * @param {Function} requestFn - Función que realiza la petición
 * @param {number} maxRetries - Máximo de reintentos
 * @returns {Promise<Object>}
 */
const fetchWithRetry = async (requestFn, maxRetries = MAX_RETRIES) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await requestFn();
      return await handleResponse(response);
    } catch (error) {
      lastError = error;
      console.warn(`Intento ${i + 1}/${maxRetries} fallido:`, error.message);
      if (i < maxRetries) await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  throw new Error(`Falló después de ${maxRetries} intentos: ${lastError.message}`);
};

/**
 * Valida que los datos sean un array
 * @param {any} data 
 * @returns {Array}
 */
const validateArrayResponse = (data) => {
  if (!Array.isArray(data)) {
    throw new Error("La respuesta no es un array válido");
  }
  return data;
};

/**
 * Obtiene todas las asignaciones de camiones-conductores
 * @returns {Promise<Array>}
 */
export const getAsignaciones = async () => {
  return fetchWithRetry(async () => {
    const response = await fetch(ASIGNACIONES_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
    });
    return response;
  }).then(validateArrayResponse);
};

/**
 * Obtiene conductores disponibles (no asignados)
 * @returns {Promise<Array>}
 */
export const getConductoresDisponibles = async () => {
  const [todosConductores, asignaciones] = await Promise.all([
    fetchWithRetry(async () => fetch(CONDUCTORES_URL))
      .then(validateArrayResponse)
      .catch(error => {
        throw new Error(`Error obteniendo conductores: ${error.message}`);
      }),
    
    getAsignaciones()
      .catch(error => {
        console.error("Error obteniendo asignaciones, asumiendo ninguna:", error.message);
        return [];
      })
  ]);

  const numerosAsignados = new Set(asignaciones.map(a => a.num_conductor));
  return todosConductores.filter(
    conductor => !numerosAsignados.has(conductor.numero)
  );
};

/**
 * Obtiene camiones disponibles (estado = 'disponible')
 * @returns {Promise<Array>}
 */
export const getCamionesDisponibles = async () => {
  return fetchWithRetry(async () => fetch(CAMIONES_URL))
    .then(validateArrayResponse)
    .then(data => data.filter(c => c.estado === 'Disponible'))
    .catch(error => {
      throw new Error(`Error obteniendo camiones disponibles: ${error.message}`);
    });
};

/**
 * Valida los datos de asignación
 * @param {Object} asignacion 
 * @throws {Error} Si los datos son inválidos
 */
const validateAsignacion = (asignacion) => {
  if (!asignacion || typeof asignacion !== 'object') {
    throw new Error("Datos de asignación no proporcionados");
  }
  
  if (!Number.isInteger(asignacion.cod_camion) || asignacion.cod_camion <= 0) {
    throw new Error("ID de camión inválido");
  }
  
  if (!Number.isInteger(asignacion.num_conductor) || asignacion.num_conductor <= 0) {
    throw new Error("ID de conductor inválido");
  }
};

/**
 * Crea una nueva asignación camión-conductor
 * @param {Object} asignacion - { cod_camion: number, num_conductor: number }
 * @returns {Promise<Object>}
 */

export const createAsignacion = async (asignacion) => {
  // Convertir a número
  asignacion.cod_camion = Number(asignacion.cod_camion);
  asignacion.num_conductor = Number(asignacion.num_conductor);

  console.log("Validando asignación (corregida):", asignacion);
  validateAsignacion(asignacion); // Validación antes de enviar

  return fetchWithRetry(async () => {
      console.log("Enviando solicitud a:", ASIGNACIONES_URL, "con datos:", JSON.stringify(asignacion));

      return fetch(ASIGNACIONES_URL, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          body: JSON.stringify(asignacion)
      });
  })
  .then((data) => {
      console.log("Respuesta JSON de la API:", data);
      if (!data || typeof data !== 'object') {
          throw new Error("Respuesta de creación inválida");
      }
      return data;
  })
  .catch((error) => {
      console.error("Error en createAsignacion:", error);
      throw error;
  });
};




/**
 * Elimina una asignación existente
 * @param {Object} asignacion - { cod_camion: number, num_conductor: number }
 * @returns {Promise<Object>}
 */
export const deleteAsignacion = async (asignacion) => {
  // Convertir a número para evitar errores de validación
  asignacion.cod_camion = Number(asignacion.cod_camion);
  asignacion.num_conductor = Number(asignacion.num_conductor);

  console.log("Validando asignación (corregida):", asignacion);
  
  validateAsignacion(asignacion); // Aquí ya no debería fallar

  return fetchWithRetry(async () => {

    return fetch(ASIGNACIONES_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(asignacion)
    });
  }).then(data => {

    if (!data || typeof data !== 'object') {
      throw new Error("Respuesta de eliminación inválida");
    }
    return data;
  });
};


/**
 * Obtiene los detalles completos de una asignación
 * @param {number} cod_camion 
 * @param {number} num_conductor 
 * @returns {Promise<Object>}
 */
export const getAsignacionDetalle = async (cod_camion, num_conductor) => {
  if (!Number.isInteger(cod_camion) || cod_camion <= 0 || 
      !Number.isInteger(num_conductor) || num_conductor <= 0) {
    throw new Error("IDs de camión o conductor inválidos");
  }

  return fetchWithRetry(async () => {
    const url = new URL(ASIGNACIONES_URL);
    url.searchParams.append('cod_camion', cod_camion);
    url.searchParams.append('num_conductor', num_conductor);

    return fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
  }).then(data => {
    if (!data || typeof data !== 'object') {
      throw new Error("Formato de detalle inválido");
    }
    return data;
  });

  
  
};