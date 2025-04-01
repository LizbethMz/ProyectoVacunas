<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getLaboratorios();
        break;
    case 'POST':
        createLaboratorio();
        break;
    case 'PUT':
        updateLaboratorio();
        break;
    case 'DELETE':
        deleteLaboratorio();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getLaboratorios() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT * FROM laboratorio ORDER BY codigo ASC");
        $laboratorios = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($laboratorios);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createLaboratorio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        $requiredFields = ['codigo', 'nombre', 'contacto'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data->$field)) {
                throw new Exception("El campo $field es requerido");
            }
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("INSERT INTO laboratorio (codigo, nombre, contacto) VALUES (?, ?, ?)");
        $query->bind_param("iss", 
            $data->codigo, 
            $data->nombre,
            $data->contacto
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al crear el laboratorio: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Laboratorio creado exitosamente"
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

function updateLaboratorio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo) || !isset($data->contacto)) {
            throw new Exception("El código y contacto son requeridos");
        }

        $connection = Conexion::get_connection();

        // Solo actualizamos el contacto
        $query = $connection->prepare("UPDATE laboratorio SET contacto = ? WHERE codigo = ?");
        $query->bind_param("si", 
            $data->contacto,
            $data->codigo
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al actualizar el laboratorio: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Contacto de laboratorio actualizado exitosamente"
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

function deleteLaboratorio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo)) {
            throw new Exception("El código del laboratorio es requerido");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM laboratorio WHERE codigo = ?");
        $query->bind_param("i", $data->codigo);
        
        if (!$query->execute()) {
            throw new Exception("Error al eliminar el laboratorio: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Laboratorio eliminado exitosamente"
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