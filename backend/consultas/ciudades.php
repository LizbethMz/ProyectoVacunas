<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getCiudades();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getCiudades() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT codigo, nombre FROM ciudad ORDER BY nombre ASC");
        $ciudades = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($ciudades);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>