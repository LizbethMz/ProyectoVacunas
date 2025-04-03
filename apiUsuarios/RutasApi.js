export const getRutaAsignada = async (envioId) => {
    try {
      const response = await fetch(`http://192.168.100.8/ProyectoApp/backend/consultasUsuarios/ruta_envio.php?envioId=${envioId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener ruta:', error);
      throw error;
    }
  };