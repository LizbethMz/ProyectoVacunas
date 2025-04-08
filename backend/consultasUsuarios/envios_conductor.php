<?php
// Desactivar la visualización de errores en la salida
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Configurar el manejador de errores personalizado
function handleError($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}
set_error_handler('handleError');

// Archivo de log
$logFile = __DIR__ . '/../../logs/envios_conductor.log';

// Función para enviar respuesta JSON
function sendJsonResponse($data) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: http://localhost:8081');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Cache-Control, Accept, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    echo json_encode($data);
    exit();
}

try {
    // Incluir el archivo de conexión
    $conexion = require_once '../../backend/conexion.php';
    
    // Verificar si la conexión está establecida
    if (!$conexion) {
        throw new Exception("Error de conexión a la base de datos");
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['conductorId'])) {
            $conductorId = $_GET['conductorId'];
            error_log("Recibida solicitud para conductor ID: " . $conductorId . "\n", 3, $logFile);
            
            // Primero verificar si el conductor existe
            $check_sql = "SELECT * FROM conductor WHERE numero = ?";
            $check_stmt = $conexion->prepare($check_sql);
            $check_stmt->bind_param("i", $conductorId);
            $check_stmt->execute();
            $check_result = $check_stmt->get_result();
            
            if ($check_result->num_rows === 0) {
                error_log("Conductor no encontrado: " . $conductorId . "\n", 3, $logFile);
                sendJsonResponse([
                    'success' => false,
                    'message' => 'Conductor no encontrado',
                    'debug' => [
                        'conductorId' => $conductorId,
                        'query' => $check_sql
                    ]
                ]);
            }
            
            // Verificar si el conductor tiene camiones asignados
            $camiones_sql = "SELECT * FROM camion_conductor WHERE num_conductor = ?";
            $camiones_stmt = $conexion->prepare($camiones_sql);
            $camiones_stmt->bind_param("i", $conductorId);
            $camiones_stmt->execute();
            $camiones_result = $camiones_stmt->get_result();
            
            if ($camiones_result->num_rows === 0) {
                error_log("Conductor no tiene camiones asignados: " . $conductorId . "\n", 3, $logFile);
                sendJsonResponse([
                    'success' => false,
                    'message' => 'El conductor no tiene camiones asignados',
                    'debug' => [
                        'conductorId' => $conductorId,
                        'query' => $camiones_sql
                    ]
                ]);
            }
            
            $sql = "SELECT 
                    e.numero,
                    e.fecha_progr,
                    e.hora_salida,
                    e.hora_llegada,
                    s.nombre as sucursal_nombre,
                    p.nombre as planta_nombre,
                    c.matricula as camion_matricula,
                    es.descripcion as estado
                FROM envio e
                JOIN camion c ON e.cod_camion = c.codigo
                JOIN camion_conductor cc ON c.codigo = cc.cod_camion
                JOIN ruta r ON e.numero = r.num_envio
                JOIN sucursal s ON r.cod_sucursal = s.codigo
                JOIN planta p ON r.num_planta = p.numero
                LEFT JOIN (
                    SELECT ee.num_envio, es.descripcion
                    FROM envio_estado ee
                    JOIN estado es ON ee.num_estado = es.numero
                    WHERE (ee.num_envio, ee.fecha, es.numero) IN (
                        SELECT num_envio, MAX(fecha), MAX(num_estado)
                        FROM envio_estado
                        GROUP BY num_envio
                    )
                ) es ON e.numero = es.num_envio
                WHERE cc.num_conductor = ? 
                ORDER BY e.fecha_progr DESC, e.hora_salida DESC";

            // Log de la consulta SQL
            error_log("SQL Query: " . $sql . "\n", 3, $logFile);
            error_log("Conductor ID: " . $conductorId . "\n", 3, $logFile);

            $stmt = $conexion->prepare($sql);
            if (!$stmt) {
                error_log("Error al preparar la consulta: " . $conexion->error . "\n", 3, $logFile);
                throw new Exception("Error al preparar la consulta: " . $conexion->error);
            }

            $stmt->bind_param("i", $conductorId);
            if (!$stmt->execute()) {
                error_log("Error al ejecutar la consulta: " . $stmt->error . "\n", 3, $logFile);
                throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
            }

            $result = $stmt->get_result();
            $envios = [];
            
            while ($row = $result->fetch_assoc()) {
                // Si no hay estado, establecer un valor por defecto
                if (empty($row['estado'])) {
                    $row['estado'] = 'Sin estado';
                }
                $envios[] = $row;
            }

            // Log de los resultados
            error_log("Número de envíos encontrados: " . count($envios) . "\n", 3, $logFile);
            error_log("Envíos: " . json_encode($envios) . "\n", 3, $logFile);

            if (count($envios) === 0) {
                error_log("No se encontraron envíos para el conductor: " . $conductorId . "\n", 3, $logFile);
            }

            sendJsonResponse([
                'success' => true,
                'data' => $envios,
                'debug' => [
                    'conductorId' => $conductorId,
                    'num_envios' => count($envios),
                    'query' => $sql,
                    'envios' => $envios
                ]
            ]);
        } else {
            error_log("No se proporcionó el ID del conductor\n", 3, $logFile);
            sendJsonResponse([
                'success' => false,
                'message' => 'Se requiere el ID del conductor'
            ]);
        }
    } else {
        error_log("Método no permitido: " . $_SERVER['REQUEST_METHOD'] . "\n", 3, $logFile);
        sendJsonResponse([
            'success' => false,
            'message' => 'Método no permitido'
        ]);
    }
} catch (Exception $e) {
    // Log del error
    error_log("Error: " . $e->getMessage() . "\n", 3, $logFile);
    error_log("Stack trace: " . $e->getTraceAsString() . "\n", 3, $logFile);
    
    sendJsonResponse([
        'success' => false,
        'message' => $e->getMessage(),
        'debug' => [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]
    ]);
}
?> 