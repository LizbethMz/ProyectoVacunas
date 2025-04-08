<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Desactivar la visualización de errores
ini_set('display_errors', 0);
error_reporting(0);

try {
    require_once '../../backend/conexion.php';

    // Obtener el método HTTP
    $method = $_SERVER['REQUEST_METHOD'];

    // Obtener el contenido JSON del cuerpo de la solicitud
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($method === 'PUT') {
        // Actualizar incidente
        if (!isset($data['codigo']) || !isset($data['descripcion'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Faltan datos requeridos'
            ]);
            exit;
        }

        $codigo = $data['codigo'];
        $descripcion = $data['descripcion'];

        $sql = "UPDATE incidente SET descripcion = ? WHERE codigo = ?";
        $stmt = $conexion->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $conexion->error);
        }

        $stmt->bind_param("si", $descripcion, $codigo);
        if (!$stmt->execute()) {
            throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Incidente actualizado correctamente'
        ]);

    } elseif ($method === 'DELETE') {
        // Eliminar incidente
        if (!isset($data['codigo'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Falta el código del incidente'
            ]);
            exit;
        }

        $codigo = $data['codigo'];

        $sql = "DELETE FROM incidente WHERE codigo = ?";
        $stmt = $conexion->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $conexion->error);
        }

        $stmt->bind_param("i", $codigo);
        if (!$stmt->execute()) {
            throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Incidente eliminado correctamente'
        ]);

    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido'
        ]);
    }
} catch (Exception $e) {
    error_log("Error en actualizar_incidente.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error al procesar la solicitud'
    ]);
}
?> 