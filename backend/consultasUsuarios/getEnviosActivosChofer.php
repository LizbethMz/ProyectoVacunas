<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
            
            $sql = "SELECT e.numero as num_envio, e.fecha_progr, e.hora_salida, e.hora_llegada, 
                           s.nombre as sucursal_nombre, s.pais, s.colonia, s.calle, s.numeroD, s.codigo_postal,
                           p.nombre as planta_nombre, p.pais as pais_planta, p.colonia as colonia_planta, 
                           p.calle as calle_planta, p.numeroD as numero_planta, p.codigo_postal as cp_planta,
                           c.matricula as camion_matricula
                    FROM envio e
                    JOIN camion c ON e.cod_camion = c.codigo
                    JOIN camion_conductor cc ON c.codigo = cc.cod_camion
                    JOIN sucursal s ON e.cod_sucursal = s.codigo
                    JOIN ruta r ON e.numero = r.num_envio
                    JOIN planta p ON r.num_planta = p.numero
                    WHERE cc.num_conductor = ? 
                    AND e.numero NOT IN (
                        SELECT ee.num_envio 
                        FROM envio_estado ee 
                        JOIN estado es ON ee.num_estado = es.numero 
                        WHERE es.descripcion = 'Entregado'
                    )
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
            $envios = [];
            
            while ($row = $result->fetch_assoc()) {
                $envios[] = $row;
            }

            echo json_encode([
                'success' => true,
                'data' => $envios
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
    error_log("Error en getEnviosActivosChofer.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener los envíos activos: ' . $e->getMessage()
    ]);
}
?> 