<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['num_envio'])) {
            getEstadosEnvio($_GET['num_envio']);
        } else {
            getEstadosBase();
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->num_envio)) {
            crearEstadoEnvio($data);
        } else {
            crearEstadoBase($data);
        }
        break;
    case 'PUT':
        actualizarEstadoBase();
        break;
    case 'DELETE':
        eliminarEstadoBase();
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getEstadosBase() {
    try {
        $connection = Conexion::get_connection();
        
        $query = "SELECT numero, descripcion FROM estado WHERE num_envio = 0 ORDER BY numero";
        $result = $connection->query($query);
        $estados = $result->fetch_all(MYSQLI_ASSOC);
        
        if (empty($estados)) {
            $estados = [
                ['numero' => 1, 'descripcion' => 'Preparando carga'],
                ['numero' => 2, 'descripcion' => 'En tránsito'],
                ['numero' => 3, 'descripcion' => 'Entregado'],
                ['numero' => 4, 'descripcion' => 'Retrasado'],
                ['numero' => 5, 'descripcion' => 'Cancelado']
            ];
        }
        
        echo json_encode($estados, JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function getEstadosEnvio($num_envio) {
    try {
        $connection = Conexion::get_connection();
        
        $query = "SELECT e.numero, e.descripcion, es.fecha, es.hora 
                 FROM envio_estado es
                 JOIN estado e ON es.num_estado = e.numero
                 WHERE es.num_envio = ?
                 ORDER BY es.fecha DESC, es.hora DESC";
        
        $stmt = $connection->prepare($query);
        $stmt->bind_param("i", $num_envio);
        $stmt->execute();
        $result = $stmt->get_result();
        $estados = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode($estados, JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function crearEstadoEnvio($data) {
    try {
        $connection = Conexion::get_connection();
        
        // Validar datos
        if (!isset($data->num_envio) || !isset($data->numero)) {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos"]);
            return;
        }
        
        // Verificar que el estado base existe
        $stmt = $connection->prepare("SELECT 1 FROM estado WHERE numero = ? AND num_envio = 0");
        $stmt->bind_param("i", $data->numero);
        $stmt->execute();
        if (!$stmt->get_result()->fetch_assoc()) {
            http_response_code(400);
            echo json_encode(["error" => "Estado no válido"]);
            return;
        }
        
        // Registrar en envio_estado
        $query = $connection->prepare("INSERT INTO envio_estado (num_envio, num_estado, fecha) 
                                     VALUES (?, ?, NOW())");
        $query->bind_param("ii", $data->num_envio, $data->numero);
        $query->execute();
        
        echo json_encode([
            "success" => true,
            "message" => "Estado de envío registrado",
            "id" => $connection->insert_id
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function crearEstadoBase($data) {
    try {
        $connection = Conexion::get_connection();

        // Validar datos
        if (!isset($data->numero) || !isset($data->descripcion)) {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos"]);
            return;
        }

        $query = $connection->prepare("INSERT INTO estado (numero, descripcion, num_envio) 
                                     VALUES (?, ?, 0)");
        $query->bind_param("is", $data->numero, $data->descripcion);
        $query->execute();

        echo json_encode([
            "success" => true,
            "message" => "Estado base creado",
            "id" => $connection->insert_id
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function actualizarEstadoBase() {
    // Implementar según necesidades
    http_response_code(501);
    echo json_encode(["message" => "No implementado"]);
}

function eliminarEstadoBase() {
    // Implementar según necesidades
    http_response_code(501);
    echo json_encode(["message" => "No implementado"]);
}
?>