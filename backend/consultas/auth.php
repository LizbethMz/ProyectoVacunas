<?php
// Habilitar solo para desarrollo
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=UTF-8');

// Verificar si es una solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    include_once '../config/conexion.php';
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json = file_get_contents('php://input');
        $data = json_decode($json);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Datos JSON inválidos: ' . json_last_error_msg());
        }
        
        if (empty($data->username) || empty($data->password)) {
            throw new Exception('Usuario y contraseña son requeridos');
        }

        $connection = Conexion::get_connection();
        
        // Consulta preparada con JOIN opcional con la tabla conductor
        $query = $connection->prepare("
            SELECT u.id, u.username, u.rol, u.num_conductor, u.tipo_usuario,
                   c.nombre_pila 
            FROM usuarios u
            LEFT JOIN conductor c ON u.num_conductor = c.numero
            WHERE u.username = ? AND u.password = ?
        ");
        
        if (!$query) {
            throw new Exception('Error al preparar la consulta: ' . $connection->error);
        }
        
        $query->bind_param("ss", $data->username, $data->password);
        
        if (!$query->execute()) {
            throw new Exception('Error al ejecutar la consulta: ' . $query->error);
        }
        
        $result = $query->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            $response = [
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'rol' => $user['rol'],
                    'num_conductor' => $user['num_conductor'],
                    'nombre_conductor' => $user['nombre_pila'], // Solo el nombre de pila
                    'tipo_usuario' => $user['tipo_usuario']
                ]
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'Usuario o contraseña incorrectos'
            ];
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        $connection->close();
    } else {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en el servidor: ' . $e->getMessage()
    ]);
}
