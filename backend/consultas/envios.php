<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getEnvios();
        break;
    case 'POST':
        createEnvio();
        break;
    case 'PUT':
        updateEnvio();
        break;
    case 'DELETE':
        deleteEnvio();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getEnvios() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT numero, fecha_progr, hora_salida, hora_llegada, cod_camion, cod_sucursal FROM envio ORDER BY numero ASC");
        $envios = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($envios);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("INSERT INTO envio (numero, fecha_progr, hora_salida, hora_llegada, cod_camion, cod_sucursal) VALUES (?, ?, ?, ?, ?, ?)");
        $query->bind_param("isssii", $data->numero, $data->fecha_progr, $data->hora_salida, $data->hora_llegada, $data->cod_camion, $data->cod_sucursal);
        $query->execute();

        echo json_encode(["message" => "Envío creado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function updateEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("UPDATE envio SET fecha_progr = ?, hora_salida = ?, hora_llegada = ?, cod_camion = ?, cod_sucursal = ? WHERE numero = ?");
        $query->bind_param("ssssii", $data->fecha_progr, $data->hora_salida, $data->hora_llegada, $data->cod_camion, $data->cod_sucursal, $data->numero);
        $query->execute();

        echo json_encode(["message" => "Envío actualizado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function deleteEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM envio WHERE numero = ?");
        $query->bind_param("i", $data->numero);
        $query->execute();

        echo json_encode(["message" => "Envío eliminado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>