const API_URL = "http://192.168.1.35/ProyectoApp/backend/consultas/getUsuario.php";

// Obtener información del usuario (GET)
export const getUsuario = async (username) => {
  try {
    console.log('Iniciando getUsuario...');
    console.log('Username:', username);
    
    const url = `${API_URL}?username=${username}`;
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
    
    if (!data.success) {
      console.error('Error en los datos:', data.message);
      throw new Error(data.message || 'Error al obtener la información del usuario');
    }
    
    return data;
  } catch (error) {
    console.error("Error en getUsuario:", error);
    return { 
      success: false, 
      message: `Error al obtener información del usuario: ${error.message}` 
    };
  }
}; 