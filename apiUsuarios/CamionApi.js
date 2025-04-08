export const getCamionAsignado = async (conductorId) => {
    try {
      const response = await fetch(`http://172.18.3.83/ProyectoApp/backend/consultasUsuarios/camion_conductor.php?conductorId=${conductorId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener camión asignado:', error);
      throw error;
    }
  };