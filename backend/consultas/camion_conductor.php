<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once '../config/conexion.php';

try {
    $connection = Conexion::get_connection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de conexión a la base de datos: ' . $e->getMessage()
    ]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getAsignaciones($connection);
        break;
    case 'POST':
        crearAsignacion($connection);
        break;
    case 'DELETE':
        eliminarAsignacion($connection);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getAsignaciones($connection) {
    try {
        $query = "SELECT cc.cod_camion, c.matricula, cc.num_conductor, 
                         CONCAT(cond.nombre_pila, ' ', cond.apellidoP, ' ', cond.apellidoM) AS nombre_conductor,
                         cc.fecha_asignacion
                  FROM camion_conductor cc
                  JOIN camion c ON cc.cod_camion = c.codigo
                  JOIN conductor cond ON cc.num_conductor = cond.numero
                  ORDER BY cc.fecha_asignacion DESC";
        $result = $connection->query($query);
        
        if (!$result) {
            throw new Exception("Error en la consulta: " . $connection->error);
        }
        
        $asignaciones = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($asignaciones, JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

function crearAsignacion($connection) {
    try {
        $data = json_decode(file_get_contents("php://input"));

        error_log("Datos recibidos en PHP: " . json_encode($data)); // Log en servidor

        if (!$data || !isset($data->cod_camion) || !isset($data->num_conductor)) {
            http_response_code(400);
            error_log("Error: Datos incompletos o inválidos");
            echo json_encode([
                'success' => false,
                'error' => 'Datos incompletos o inválidos'
            ]);
            return;
        }

        // Verificar si el camión está disponible
$stmt = $connection->prepare("SELECT estado FROM camion WHERE codigo = ?");
$stmt->bind_param("i", $data->cod_camion);
$stmt->execute();
$camion = $stmt->get_result()->fetch_assoc();

error_log("Estado del camión consultado: " . json_encode($camion));

if (!$camion || $camion['estado'] != 'Disponible') {
    http_response_code(400);
    error_log("Error: El camión no está disponible");
    echo json_encode([
        'success' => false,
        'error' => 'El camión no está disponible'
    ]);
    return;
}


        // Verificar si el conductor ya está asignado
        $stmt = $connection->prepare("SELECT 1 FROM camion_conductor WHERE num_conductor = ?");
        $stmt->bind_param("i", $data->num_conductor);
        $stmt->execute();
        $conductorAsignado = $stmt->get_result()->fetch_assoc();

        error_log("Verificación de conductor asignado: " . json_encode($conductorAsignado));

        if ($conductorAsignado) {
            http_response_code(400);
            error_log("Error: El conductor ya está asignado");
            echo json_encode([
                'success' => false,
                'error' => 'El conductor ya está asignado a otro camión'
            ]);
            return;
        }

        // Crear la asignación con fecha automática
        $stmt = $connection->prepare("INSERT INTO camion_conductor (cod_camion, num_conductor, fecha_asignacion) VALUES (?, ?, NOW())");
        $stmt->bind_param("ii", $data->cod_camion, $data->num_conductor);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al crear la asignación: " . $stmt->error);
        }

        error_log("Asignación creada exitosamente");

        // Actualizar estado del camión
        $stmt = $connection->prepare("UPDATE camion SET estado = 'Asignado' WHERE codigo = ?");
        $stmt->bind_param("i", $data->cod_camion);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Asignación creada exitosamente"
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        error_log("Excepción atrapada: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

function eliminarAsignacion($connection) {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!$data || !isset($data->cod_camion) || !isset($data->num_conductor)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Datos incompletos o inválidos'
            ]);
            return;
        }

        // Eliminar la asignación
        $stmt = $connection->prepare("DELETE FROM camion_conductor WHERE cod_camion = ? AND num_conductor = ?");
        $stmt->bind_param("ii", $data->cod_camion, $data->num_conductor);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al eliminar la asignación: " . $stmt->error);
        }

        // Actualizar estado del camión
        $stmt = $connection->prepare("UPDATE camion SET estado = 'Disponible' WHERE codigo = ?");
        $stmt->bind_param("i", $data->cod_camion);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Asignación eliminada exitosamente"
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}
?>