<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Desactivar la visualización de errores
ini_set('display_errors', 0);
error_reporting(0);

try {
    require_once '../../backend/conexion.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['num_envio']) || !isset($data['descripcion'])) {
            throw new Exception("Faltan datos requeridos");
        }

        $num_envio = $data['num_envio'];
        $descripcion = $data['descripcion'];

        // Verificar si la conexión está establecida
        if (!isset($conexion) || !$conexion) {
            throw new Exception("Error de conexión a la base de datos");
        }

        // Obtener el siguiente código de incidente
        $sql_max = "SELECT MAX(codigo) as max_codigo FROM incidente";
        $result_max = $conexion->query($sql_max);
        $row_max = $result_max->fetch_assoc();
        $nuevo_codigo = ($row_max['max_codigo'] ?? 0) + 1;

        // Insertar el nuevo incidente
        $sql = "INSERT INTO incidente (codigo, descripcion, num_envio) VALUES (?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $conexion->error);
        }

        $stmt->bind_param("isi", $nuevo_codigo, $descripcion, $num_envio);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al registrar el incidente: " . $stmt->error);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Incidente registrado correctamente',
            'data' => [
                'codigo' => $nuevo_codigo
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido'
        ]);
    }
} catch (Exception $e) {
    error_log("Error en registrar_incidente.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error al registrar el incidente: ' . $e->getMessage()
    ]);
}
?> 