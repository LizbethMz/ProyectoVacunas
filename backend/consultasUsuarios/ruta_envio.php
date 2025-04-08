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
        $envioId = isset($_GET['envioId']) ? $_GET['envioId'] : null;
        
        if (!$envioId) {
            http_response_code(400);
            echo json_encode(['error' => 'Se requiere el ID del envío']);
            exit;
        }

        $connection = Conexion::get_connection();
        
        // Consulta para obtener la ruta del envío con más información
        $query = "SELECT r.*, 
                        p.nombre as origen, 
                        p.pais as pais_origen,
                        p.colonia as colonia_origen,
                        p.calle as calle_origen,
                        p.numeroD as numero_origen,
                        p.codigo_postal as cp_origen,
                        s.nombre as destino,
                        s.pais as pais_destino,
                        s.colonia as colonia_destino,
                        s.calle as calle_destino,
                        s.numeroD as numero_destino,
                        s.codigo_postal as cp_destino,
                        TIMESTAMPDIFF(HOUR, CONCAT(r.f_salida, ' ', r.h_salida), CONCAT(r.f_llegada, ' ', r.h_llegada)) as tiempo_estimado
                 FROM ruta r
                 JOIN planta p ON r.num_planta = p.numero
                 JOIN sucursal s ON r.cod_sucursal = s.codigo
                 WHERE r.num_envio = ?";
        
        $stmt = $connection->prepare($query);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $connection->error);
        }
        
        $stmt->bind_param("i", $envioId);
        if (!$stmt->execute()) {
            throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
        }
        
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $ruta = $result->fetch_assoc();
            // Agregar una distancia estimada fija ya que no tenemos las coordenadas
            $ruta['distancia'] = '0.00';
            echo json_encode($ruta);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'No se encontró ruta para este envío']);
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