export const getEnviosPorConductor = async (conductorId) => {
    try {
      const response = await fetch(`http://192.168.100.8/ProyectoApp/backend/consultasUsuarios/envios_conductor.php?conductorId=${conductorId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener envíos:', error);
      throw error;
    }
  };
  
  export const cambiarEstadoEnvio = async (envioId, nuevoEstado) => {
    try {
      const response = await fetch(`http://192.168.100.8/ProyectoApp/backend/consultasUsuarios/actualizar_estado.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          envioId: envioId,
          nuevoEstado: nuevoEstado 
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  };