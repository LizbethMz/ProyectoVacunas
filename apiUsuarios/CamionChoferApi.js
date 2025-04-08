const API_URL = "http://192.168.1.35/ProyectoApp/backend/consultas/getCamionChofer.php";

// Obtener información del camión asignado al chofer (GET)
export const getCamionChofer = async (num_conductor) => {
  try {
    console.log('Iniciando getCamionChofer...');
    console.log('Número de conductor:', num_conductor);
    
    const url = `${API_URL}?num_conductor=${num_conductor}`;
    console.log('URL completa:', url);
    
    // Verificar si la URL es accesible
    try {
      const testResponse = await fetch(url, { method: 'HEAD' });
      console.log('Test de conexión exitoso. Status:', testResponse.status);
    } catch (testError) {
      console.error('Error al conectar con el servidor:', testError);
      throw new Error('No se pudo conectar con el servidor. Verifica que el servidor esté en línea y accesible.');
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    });

    console.log('Estado de la respuesta:', response.status);
    console.log('Headers de la respuesta:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta:', errorText);
      throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Datos recibidos:', data);
    
    return data;
  } catch (error) {
    console.error("Error en getCamionChofer:", error);
    return { 
      success: false, 
      message: `Error al obtener información del camión: ${error.message}` 
    };
  }
}; 