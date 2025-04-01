<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getRutas();
        break;
    case 'POST':
        createRuta();
        break;
    case 'PUT':
        updateRuta();
        break;
    case 'DELETE':
        deleteRuta();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRutas() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT numero, nombre, f_salida, f_llegada, h_salida, h_llegada, num_planta, cod_sucursal FROM ruta ORDER BY numero ASC");
        $rutas = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($rutas);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createRuta() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("INSERT INTO ruta (numero, nombre, f_salida, f_llegada, h_salida, h_llegada, num_planta, cod_sucursal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("isssssii", $data->numero, $data->nombre, $data->f_salida, $data->f_llegada, $data->h_salida, $data->h_llegada, $data->num_planta, $data->cod_sucursal);
        $query->execute();

        echo json_encode(["message" => "Ruta creada"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function updateRuta() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("UPDATE ruta SET nombre = ?, f_salida = ?, f_llegada = ?, h_salida = ?, h_llegada = ?, num_planta = ?, cod_sucursal = ? WHERE numero = ?");
        $query->bind_param("ssssssii", $data->nombre, $data->f_salida, $data->f_llegada, $data->h_salida, $data->h_llegada, $data->num_planta, $data->cod_sucursal, $data->numero);
        $query->execute();

        echo json_encode(["message" => "Ruta actualizada"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function deleteRuta() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM ruta WHERE numero = ?");
        $query->bind_param("i", $data->numero);
        $query->execute();

        echo json_encode(["message" => "Ruta eliminada"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>