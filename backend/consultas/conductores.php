<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getConductores();
        break;
    case 'POST':
        createConductor();
        break;
    case 'PUT':
        updateConductor();
        break;
    case 'DELETE':
        deleteConductor();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getConductores() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT numero, nombre_pila, apellidoP, apellidoM FROM conductor ORDER BY numero ASC");
        $conductores = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($conductores);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createConductor() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("INSERT INTO conductor (numero, nombre_pila, apellidoP, apellidoM) VALUES (?, ?, ?, ?)");
        $query->bind_param("isss", $data->numero, $data->nombre_pila, $data->apellidoP, $data->apellidoM);
        $query->execute();

        echo json_encode(["message" => "Conductor creado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function updateConductor() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("UPDATE conductor SET nombre_pila = ?, apellidoP = ?, apellidoM = ? WHERE numero = ?");
        $query->bind_param("sssi", $data->nombre_pila, $data->apellidoP, $data->apellidoM, $data->numero);
        $query->execute();

        echo json_encode(["message" => "Conductor actualizado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function deleteConductor() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM conductor WHERE numero = ?");
        $query->bind_param("i", $data->numero);
        $query->execute();

        echo json_encode(["message" => "Conductor eliminado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>