export const reportarIncidente = async (envioId, descripcion) => {
    try {
      const response = await fetch(`http://192.168.100.8/ProyectoApp/backend/consultasUsuarios/reportar_incidente.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          envioId: envioId,
          descripcion: descripcion
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error al reportar incidente:', error);
      throw error;
    }
  };