<?php
// Deshabilitar la visualización de errores en la salida
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Configurar el manejador de errores para capturar errores fatales
function exception_error_handler($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
}
set_error_handler("exception_error_handler");

// Asegurar que siempre enviemos headers de JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

try {
    require_once '../../backend/conexion.php';

    if (!isset($conn)) {
        throw new Exception('Error de conexión a la base de datos');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['conductorId'])) {
            $conductorId = $_GET['conductorId'];
            
            // Primero verificar si el conductor existe
            $checkConductor = "SELECT numero, nombre_pila, apellidoP FROM conductor WHERE numero = ?";
            $stmtCheck = $conn->prepare($checkConductor);
            $stmtCheck->bind_param("i", $conductorId);
            $stmtCheck->execute();
            $resultCheck = $stmtCheck->get_result();
            
            if ($resultCheck->num_rows === 0) {
                error_log("Conductor no encontrado: " . $conductorId);
                throw new Exception('Conductor no encontrado');
            }
            
            $conductor = $resultCheck->fetch_assoc();
            error_log("Buscando envíos para conductor: " . $conductor['nombre_pila'] . " " . $conductor['apellidoP'] . " (ID: " . $conductorId . ")");
            
            // Verificar asignación de camión
            $checkCamion = "SELECT c.codigo, c.matricula FROM camion c 
                          JOIN camion_conductor cc ON c.codigo = cc.cod_camion 
                          WHERE cc.num_conductor = ?";
            $stmtCamion = $conn->prepare($checkCamion);
            $stmtCamion->bind_param("i", $conductorId);
            $stmtCamion->execute();
            $resultCamion = $stmtCamion->get_result();
            
            if ($resultCamion->num_rows === 0) {
                error_log("El conductor no tiene camión asignado");
                echo json_encode([]);
                exit;
            }
            
            $camion = $resultCamion->fetch_assoc();
            error_log("Camión asignado: " . $camion['matricula'] . " (ID: " . $camion['codigo'] . ")");

            // Verificar envíos del camión
            $checkEnvios = "SELECT numero FROM envio WHERE cod_camion = ?";
            $stmtEnvios = $conn->prepare($checkEnvios);
            $stmtEnvios->bind_param("i", $camion['codigo']);
            $stmtEnvios->execute();
            $resultEnvios = $stmtEnvios->get_result();
            
            if ($resultEnvios->num_rows === 0) {
                error_log("No hay envíos asignados al camión " . $camion['matricula']);
                echo json_encode([]);
                exit;
            }
            
            error_log("Número de envíos encontrados para el camión: " . $resultEnvios->num_rows);
            
            // Consulta principal
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
                    LEFT JOIN envio_estado ee ON e.numero = ee.num_envio
                    LEFT JOIN estado es ON ee.num_estado = es.numero
                    WHERE cc.num_conductor = ? 
                    ORDER BY e.fecha_progr DESC, e.hora_salida DESC";

            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                error_log("Error en la preparación de la consulta: " . $conn->error);
                throw new Exception('Error en la preparación de la consulta: ' . $conn->error);
            }

            $stmt->bind_param("i", $conductorId);
            if (!$stmt->execute()) {
                error_log("Error al ejecutar la consulta: " . $stmt->error);
                throw new Exception('Error al ejecutar la consulta: ' . $stmt->error);
            }

            $result = $stmt->get_result();
            if (!$result) {
                error_log("Error al obtener resultados: " . $stmt->error);
                throw new Exception('Error al obtener resultados: ' . $stmt->error);
            }

            $envios = [];
            while ($row = $result->fetch_assoc()) {
                $envios[] = $row;
            }

            error_log("Número de envíos encontrados: " . count($envios));
            if (empty($envios)) {
                echo json_encode([]);
            } else {
                echo json_encode($envios);
            }
        } else {
            error_log("No se proporcionó conductorId");
            echo json_encode([]);
        }
    } else {
        error_log("Método no permitido: " . $_SERVER['REQUEST_METHOD']);
        echo json_encode([]);
    }
} catch (Exception $e) {
    error_log("Error en getEnviosChofer.php: " . $e->getMessage());
    echo json_encode([]);
}
?> 