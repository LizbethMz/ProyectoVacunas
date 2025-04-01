<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getEstadosEnvio();
        break;
    case 'POST':
        createEstadoEnvio();
        break;
    case 'PUT':
        updateEstadoEnvio();
        break;
    case 'DELETE':
        deleteEstadoEnvio();
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getEstadosEnvio() {
    try {
        $connection = Conexion::get_connection();
        
        // Filtrar por número de envío si se especifica
        $num_envio = isset($_GET['num_envio']) ? $_GET['num_envio'] : null;
        
        $query = "SELECT id, num_envio, num_estado, fecha FROM envio_estado";
        $conditions = [];
        $params = [];
        $types = '';
        
        if ($num_envio) {
            $conditions[] = "num_envio = ?";
            $params[] = $num_envio;
            $types .= 'i';
        }
        
        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }
        
        $query .= " ORDER BY fecha DESC";
        
        $stmt = $connection->prepare($query);
        
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
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

function createEstadoEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        // Validar datos requeridos
        $requiredFields = ['num_envio', 'num_estado'];
        foreach ($requiredFields as $field) {
            if (!isset($data->$field)) {
                throw new Exception("El campo $field es requerido");
            }
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("INSERT INTO envio_estado (num_envio, num_estado) VALUES (?, ?)");
        $query->bind_param("ii", 
            $data->num_envio, 
            $data->num_estado
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al crear el estado de envío: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Estado de envío creado exitosamente",
            "id" => $connection->insert_id
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function updateEstadoEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        // Validar datos requeridos
        if (!isset($data->id)) {
            throw new Exception("El ID del estado de envío es requerido");
        }

        $connection = Conexion::get_connection();

        // Construir consulta dinámica para actualizar solo los campos proporcionados
        $fields = [];
        $params = [];
        $types = '';
        
        $updatableFields = [
            'num_envio' => 'i',
            'num_estado' => 'i'
        ];
        
        foreach ($updatableFields as $field => $type) {
            if (isset($data->$field)) {
                $fields[] = "$field = ?";
                $params[] = $data->$field;
                $types .= $type;
            }
        }
        
        if (empty($fields)) {
            throw new Exception("No se proporcionaron campos para actualizar");
        }
        
        $params[] = $data->id;
        $types .= 'i';
        
        $queryStr = "UPDATE envio_estado SET " . implode(", ", $fields) . " WHERE id = ?";
        $query = $connection->prepare($queryStr);
        $query->bind_param($types, ...$params);
        
        if (!$query->execute()) {
            throw new Exception("Error al actualizar el estado de envío: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Estado de envío actualizado exitosamente",
            "id" => $data->id
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function deleteEstadoEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->id)) {
            throw new Exception("El ID del estado de envío es requerido");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM envio_estado WHERE id = ?");
        $query->bind_param("i", $data->id);
        
        if (!$query->execute()) {
            throw new Exception("Error al eliminar el estado de envío: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Estado de envío eliminado exitosamente"
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    } finally {
        if (isset($connection)) $connection->close();
    }
}
?>