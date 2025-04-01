<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getPaquetes();
        break;
    case 'POST':
        createPaquete();
        break;
    case 'PUT':
        updatePaquete();
        break;
    case 'DELETE':
        deletePaquete();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getPaquetes() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT codigo, lote, temp_requerida, descripcion, vacuna, num_planta, num_envio FROM paquete ORDER BY codigo ASC");
        $paquetes = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($paquetes);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createPaquete() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo) || !isset($data->lote) || !isset($data->temp_requerida) || 
            !isset($data->descripcion) || !isset($data->vacuna) || 
            !isset($data->num_planta) || !isset($data->num_envio)) {
            throw new Exception("Todos los campos son requeridos");
        }

        $connection = Conexion::get_connection();

        // Verificar si el código ya existe
        $checkQuery = $connection->prepare("SELECT codigo FROM paquete WHERE codigo = ?");
        $checkQuery->bind_param("i", $data->codigo);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        
        if ($result->num_rows > 0) {
            throw new Exception("El código de paquete ya existe");
        }

        $query = $connection->prepare("INSERT INTO paquete (codigo, lote, temp_requerida, descripcion, vacuna, num_planta, num_envio) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("isdssii", 
            $data->codigo, 
            $data->lote,
            $data->temp_requerida, 
            $data->descripcion, 
            $data->vacuna, 
            $data->num_planta, 
            $data->num_envio
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al crear el paquete: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Paquete creado exitosamente"
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

function updatePaquete() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo) || !isset($data->lote) || !isset($data->temp_requerida) || 
            !isset($data->descripcion) || !isset($data->vacuna) || 
            !isset($data->num_planta) || !isset($data->num_envio)) {
            throw new Exception("Todos los campos son requeridos");
        }

        $connection = Conexion::get_connection();

        // Verificar si el paquete existe
        $checkQuery = $connection->prepare("SELECT codigo, num_planta, num_envio FROM paquete WHERE codigo = ?");
        $checkQuery->bind_param("i", $data->codigo);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        
        if ($result->num_rows === 0) {
            throw new Exception("El paquete no existe");
        }

        $existingData = $result->fetch_assoc();
        
        // Verificar que los campos inmutables no hayan cambiado
        if ($existingData['num_planta'] != $data->num_planta || $existingData['num_envio'] != $data->num_envio) {
            throw new Exception("No se pueden modificar el número de planta o de envío");
        }

        $query = $connection->prepare("UPDATE paquete SET temp_requerida = ?, descripcion = ?, vacuna = ? WHERE codigo = ?");
        $query->bind_param("dssi", 
            $data->temp_requerida, 
            $data->descripcion, 
            $data->vacuna,
            $data->codigo
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al actualizar el paquete: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Paquete actualizado exitosamente"
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

function deletePaquete() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo)) {
            throw new Exception("El código del paquete es requerido");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM paquete WHERE codigo = ?");
        $query->bind_param("i", $data->codigo);
        
        if (!$query->execute()) {
            throw new Exception("Error al eliminar el paquete: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Paquete eliminado exitosamente"
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