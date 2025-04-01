<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

include_once '../config/conexion.php';

try {
    $connection = Conexion::get_connection();
    $result = $connection->query("SELECT codigo, nombre FROM ciudad ORDER BY codigo ASC");
    $ciudades = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($ciudades);
    $connection->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>