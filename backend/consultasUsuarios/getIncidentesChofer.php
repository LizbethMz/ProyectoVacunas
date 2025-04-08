<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8081');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Cache-Control, Accept, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Desactivar la visualización de errores
ini_set('display_errors', 0);
error_reporting(0);

try {
    // Incluir el archivo de conexión
    $conexion = require_once '../../backend/conexion.php';

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['conductorId'])) {
            $conductorId = $_GET['conductorId'];
            
            // Verificar si la conexión está establecida
            if (!$conexion) {
                throw new Exception("Error de conexión a la base de datos");
            }
            
            $sql = "SELECT i.codigo, i.descripcion, i.num_envio,
                           e.fecha_progr, e.hora_salida, e.hora_llegada,
                           s.nombre as sucursal_nombre,
                           p.nombre as planta_nombre
                    FROM incidente i
                    JOIN envio e ON i.num_envio = e.numero
                    JOIN camion c ON e.cod_camion = c.codigo
                    JOIN camion_conductor cc ON c.codigo = cc.cod_camion
                    JOIN sucursal s ON e.cod_sucursal = s.codigo
                    JOIN ruta r ON e.numero = r.num_envio
                    JOIN planta p ON r.num_planta = p.numero
                    WHERE cc.num_conductor = ?
                    ORDER BY e.fecha_progr DESC, e.hora_salida DESC";

            $stmt = $conexion->prepare($sql);
            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $conexion->error);
            }

            $stmt->bind_param("i", $conductorId);
            if (!$stmt->execute()) {
                throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
            }

            $result = $stmt->get_result();
            $incidentes = [];
            
            while ($row = $result->fetch_assoc()) {
                $incidentes[] = $row;
            }

            echo json_encode([
                'success' => true,
                'data' => $incidentes
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Se requiere el ID del conductor'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido'
        ]);
    }
} catch (Exception $e) {
    error_log("Error en getIncidentesChofer.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener los incidentes: ' . $e->getMessage()
    ]);
}
?> 