<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getFarmaceuticas();
        break;
    case 'POST':
        createFarmaceutica();
        break;
    case 'PUT':
        updateFarmaceutica();
        break;
    case 'DELETE':
        deleteFarmaceutica();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getFarmaceuticas() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT * FROM farmaceutica ORDER BY codigo ASC");
        $farmaceuticas = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($farmaceuticas);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createFarmaceutica() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        $requiredFields = ['codigo', 'nombre', 'telefono', 'correo'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data->$field)) {
                throw new Exception("El campo $field es requerido");
            }
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("INSERT INTO farmaceutica (codigo, nombre, telefono, correo) VALUES (?, ?, ?, ?)");
        $query->bind_param("isss", 
            $data->codigo, 
            $data->nombre,
            $data->telefono, 
            $data->correo
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al crear la farmacéutica: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Farmacéutica creada exitosamente"
        ]);
        $connection->close();
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ]);
    }
}

function updateFarmaceutica() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo) || !isset($data->telefono) || !isset($data->correo)) {
            throw new Exception("El código, teléfono y correo son requeridos");
        }

        $connection = Conexion::get_connection();

        // Solo actualizamos teléfono y correo
        $query = $connection->prepare("UPDATE farmaceutica SET telefono = ?, correo = ? WHERE codigo = ?");
        $query->bind_param("ssi", 
            $data->telefono,
            $data->correo,
            $data->codigo
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al actualizar la farmacéutica: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Contacto de farmacéutica actualizado exitosamente"
        ]);
        $connection->close();
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ]);
    }
}

function deleteFarmaceutica() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo)) {
            throw new Exception("El código de la farmacéutica es requerido");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM farmaceutica WHERE codigo = ?");
        $query->bind_param("i", $data->codigo);
        
        if (!$query->execute()) {
            throw new Exception("Error al eliminar la farmacéutica: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Farmacéutica eliminada exitosamente"
        ]);
        $connection->close();
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ]);
    }
}
?>