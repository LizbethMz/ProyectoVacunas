<?php
// Desactivar la visualización de errores en producción
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: http://localhost:8081");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Manejar solicitud preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Incluir el archivo de conexión usando ruta absoluta
    $conexionPath = $_SERVER['DOCUMENT_ROOT'] . '/ProyectoApp/backend/config/conexion.php';
    if (!file_exists($conexionPath)) {
        throw new Exception("El archivo de conexión no existe en: " . $conexionPath);
    }
    require_once $conexionPath;

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $conductorId = isset($_GET['conductorId']) ? $_GET['conductorId'] : null;
        
        if (!$conductorId) {
            http_response_code(400);
            echo json_encode(['error' => 'Se requiere el ID del conductor']);
            exit;
        }

        $connection = Conexion::get_connection();
        
        // Consulta para obtener el camión asignado al conductor
        $query = "SELECT c.*, m.nombre as modelo, ma.nombre as marca 
                 FROM camion c 
                 JOIN modelo m ON c.cod_modelo = m.codigo 
                 JOIN marca ma ON c.cod_marca = ma.codigo 
                 JOIN camion_conductor cc ON c.codigo = cc.cod_camion 
                 WHERE cc.num_conductor = ?";
        
        $stmt = $connection->prepare($query);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $connection->error);
        }
        
        $stmt->bind_param("i", $conductorId);
        if (!$stmt->execute()) {
            throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
        }
        
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $camion = $result->fetch_assoc();
            echo json_encode($camion);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'No se encontró camión asignado para este conductor']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
} finally {
    if (isset($connection)) {
        $connection->close();
    }
}
?> 