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
            checkCodigoModeloExistente($_GET['check_codigo']);
        } else {
            getModelos();
        }
        break;
    case 'POST':
        createModelo();
        break;
    case 'PUT':
        updateModelo();
        break;
    case 'DELETE':
        deleteModelo();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getModelos() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT codigo, nombre, year, cod_marca FROM modelo ORDER BY codigo ASC");
        $modelos = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($modelos);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function checkCodigoModeloExistente($codigo) {
    try {
        $connection = Conexion::get_connection();
        $query = $connection->prepare("SELECT COUNT(*) as count FROM modelo WHERE codigo = ?");
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

function createModelo() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo) || !isset($data->nombre) || !isset($data->year) || !isset($data->cod_marca)) {
            throw new Exception("Todos los campos son requeridos");
        }

        $connection = Conexion::get_connection();

        // Verificar si el código ya existe
        $checkQuery = $connection->prepare("SELECT COUNT(*) as count FROM modelo WHERE codigo = ?");
        $checkQuery->bind_param("i", $data->codigo);
        $checkQuery->execute();
        $checkResult = $checkQuery->get_result();
        $checkRow = $checkResult->fetch_assoc();
        
        if ($checkRow['count'] > 0) {
            throw new Exception("El código de modelo ya está registrado");
        }

        $query = $connection->prepare("INSERT INTO modelo (codigo, nombre, year, cod_marca) VALUES (?, ?, ?, ?)");
        $query->bind_param("isii", $data->codigo, $data->nombre, $data->year, $data->cod_marca);
        
        if (!$query->execute()) {
            throw new Exception("Error al crear el modelo: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Modelo creado exitosamente"
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

function updateModelo() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo) || !isset($data->nombre) || !isset($data->year) || !isset($data->cod_marca)) {
            throw new Exception("Todos los campos son requeridos");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("UPDATE modelo SET nombre = ?, year = ?, cod_marca = ? WHERE codigo = ?");
        $query->bind_param("siii", $data->nombre, $data->year, $data->cod_marca, $data->codigo);
        
        if (!$query->execute()) {
            throw new Exception("Error al actualizar el modelo: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Modelo actualizado exitosamente"
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

function deleteModelo() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo)) {
            throw new Exception("El código del modelo es requerido");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM modelo WHERE codigo = ?");
        $query->bind_param("i", $data->codigo);
        
        if (!$query->execute()) {
            throw new Exception("Error al eliminar el modelo: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Modelo eliminado exitosamente"
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