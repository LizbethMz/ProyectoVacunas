<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['check_codigo'])) {
            checkCodigoMarcaExistente($_GET['check_codigo']);
        } else {
            getMarcas();
        }
        break;
    case 'POST':
        createMarca();
        break;
    case 'PUT':
        updateMarca();
        break;
    case 'DELETE':
        deleteMarca();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getMarcas() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT codigo, nombre FROM marca ORDER BY codigo ASC");
        $marcas = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($marcas);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function checkCodigoMarcaExistente($codigo) {
    try {
        $connection = Conexion::get_connection();
        $query = $connection->prepare("SELECT COUNT(*) as count FROM marca WHERE codigo = ?");
        $query->bind_param("i", $codigo);
        $query->execute();
        $result = $query->get_result();
        $row = $result->fetch_assoc();
        
        echo json_encode(["existe" => $row['count'] > 0]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createMarca() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo) || !isset($data->nombre)) {
            throw new Exception("Todos los campos son requeridos");
        }

        $connection = Conexion::get_connection();

        // Verificar si el código ya existe
        $checkQuery = $connection->prepare("SELECT COUNT(*) as count FROM marca WHERE codigo = ?");
        $checkQuery->bind_param("i", $data->codigo);
        $checkQuery->execute();
        $checkResult = $checkQuery->get_result();
        $checkRow = $checkResult->fetch_assoc();
        
        if ($checkRow['count'] > 0) {
            throw new Exception("El código de marca ya está registrado");
        }

        $query = $connection->prepare("INSERT INTO marca (codigo, nombre) VALUES (?, ?)");
        $query->bind_param("is", $data->codigo, $data->nombre);
        
        if (!$query->execute()) {
            throw new Exception("Error al crear la marca: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Marca creada exitosamente"
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

function updateMarca() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo) || !isset($data->nombre)) {
            throw new Exception("Todos los campos son requeridos");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("UPDATE marca SET nombre = ? WHERE codigo = ?");
        $query->bind_param("si", $data->nombre, $data->codigo);
        
        if (!$query->execute()) {
            throw new Exception("Error al actualizar la marca: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Marca actualizada exitosamente"
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

function deleteMarca() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo)) {
            throw new Exception("El código de la marca es requerido");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM marca WHERE codigo = ?");
        $query->bind_param("i", $data->codigo);
        
        if (!$query->execute()) {
            throw new Exception("Error al eliminar la marca: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Marca eliminada exitosamente"
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