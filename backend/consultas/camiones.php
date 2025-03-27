<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getCamiones();
        break;
    case 'POST':
        createCamion();
        break;
    case 'PUT':
        updateCamion();
        break;
    case 'DELETE':
        deleteCamion();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getCamiones() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT codigo, MMA,  matricula, estado, cod_modelo, cod_marca FROM camion ORDER BY codigo ASC");
        $camiones = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($camiones);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createCamion() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("INSERT INTO camion (codigo, MMA, matricula, estado, cod_modelo, cod_marca) VALUES (?, ?, ?, ?, ?, ?)");
        $query->bind_param("idssii", $data->codigo, $data->MMA, $data->matricula, $data->estado, $data->cod_modelo, $data->cod_marca);
        $query->execute();

        echo json_encode(["message" => "Camión creado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function updateCamion() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("UPDATE camion SET MMA = ?, matricula = ?, estado = ?, cod_modelo = ?, cod_marca = ? WHERE codigo = ?");
        $query->bind_param("dssiii", $data->MMA, $data->matricula, $data->estado, $data->cod_modelo, $data->cod_marca, $data->codigo);
        $query->execute();

        echo json_encode(["message" => "Camión actualizado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function deleteCamion() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM camion WHERE codigo = ?");
        $query->bind_param("i", $data->codigo);
        $query->execute();

        echo json_encode(["message" => "Camión eliminado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>