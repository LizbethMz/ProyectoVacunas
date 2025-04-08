//const API_URL = "http://192.168.100.8/ProyectoApp/backend/consultas/usuarios.php";
const API_URL = "http://172.18.3.83/ProyectoApp/backend/consultas/usuarios.php";


// Obtener todos los usuarios (GET)
export const getUsuarios = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return { message: "Error al obtener usuarios" };
  }
};

// Crear un usuario (POST)
export const createUsuario = async (usuario) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando usuario:", error);
    return { message: "Error al crear usuario" };
  }
};

// Actualizar un usuario (PUT)
export const updateUsuario = async (usuario) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return { message: "Error al actualizar usuario" };
  }
};

// Eliminar un usuario (DELETE)
export const deleteUsuario = async (id) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    return { message: "Error al eliminar usuario" };
  }
};