const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/auth.php";
//const API_URL = "http://172.18.3.5/ProyectoApp/backend/consultas/auth.php";

// Función para manejar errores de forma consistente
const handleApiError = (error, context) => {
  console.error(`Error ${context}:`, error);
  return { 
    success: false,
    message: error.message || `Error al ${context}`
  };
};

// Función para procesar la respuesta del servidor
const processResponse = async (response) => {
  const text = await response.text();
  
  // Limpiar posibles advertencias PHP del string
  const cleanJson = text.replace(/<br \/>|<b>|<\/b>|Warning:.*?\n/g, '').trim();
  
  try {
    const data = JSON.parse(cleanJson);
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error HTTP: ${response.status}`
      };
    }
    
    return data;
  } catch (e) {
    console.error("Respuesta no JSON:", cleanJson);
    return {
      success: false,
      message: "La respuesta del servidor no es válida"
    };
  }
};

// Autenticar usuario (POST)
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const result = await processResponse(response);
    
    if (!result.success) {
      return result;
    }

    // Verificar si es admin o usuario normal
    const { id, username, rol, num_conductor, nombre_conductor, tipo_usuario } = result.user;

    return {
      success: true,
      data: {
        id,
        username,
        rol,
        num_conductor,
        nombre_conductor,
        tipo_usuario,
        isAdmin: tipo_usuario === "admin"
      }
    };
  } catch (error) {
    return handleApiError(error, "autenticando usuario");
  }
};
