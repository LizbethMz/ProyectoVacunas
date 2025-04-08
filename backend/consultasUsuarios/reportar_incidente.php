<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include '../../backend/conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el contenido JSON del cuerpo de la solicitud
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Validar los datos recibidos
    if (!isset($data['num_envio']) || !isset($data['descripcion'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Faltan datos requeridos'
        ]);
        exit;
    }

    $num_envio = $data['num_envio'];
    $descripcion = $data['descripcion'];

    try {
        // Iniciar transacción
        $conexion->begin_transaction();

        // Insertar el incidente
        $query = "INSERT INTO incidente (num_envio, descripcion, fecha) VALUES (?, ?, NOW())";
        $stmt = $conexion->prepare($query);
        $stmt->bind_param("is", $num_envio, $descripcion);
        $stmt->execute();

        // Actualizar el estado del envío a "Incidente Reportado"
        $query_estado = "INSERT INTO envio_estado (num_envio, num_estado, fecha) 
                        VALUES (?, 4, NOW())"; // 4 es el código para "Incidente Reportado"
        $stmt_estado = $conexion->prepare($query_estado);
        $stmt_estado->bind_param("i", $num_envio);
        $stmt_estado->execute();

        // Confirmar la transacción
        $conexion->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Incidente reportado exitosamente'
        ]);

    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $conexion->rollback();
        
        echo json_encode([
            'success' => false,
            'message' => 'Error al reportar el incidente: ' . $e->getMessage()
        ]);
    }

    $stmt->close();
    $stmt_estado->close();
    $conexion->close();
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?> 