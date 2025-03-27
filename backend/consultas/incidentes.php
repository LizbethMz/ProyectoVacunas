<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');
header("Cache-Control: no-cache, must-revalidate");

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

// Manejar solicitud OPTIONS para CORS
if ($method == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

try {
    switch ($method) {
        case 'GET':
            if (isset($_GET['codigo'])) {
                getIncidenteById($_GET['codigo']);
            } else {
                getAllIncidentes();
            }
            break;
        case 'POST':
            createIncidente();
            break;
        case 'PUT':
            updateIncidente();
            break;
        case 'DELETE':
            deleteIncidente();
            break;
        default:
            header("HTTP/1.1 405 Method Not Allowed");
            echo json_encode(["error" => "Método no permitido"]);
            break;
    }
} catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => $e->getMessage()]);
}

function getAllIncidentes() {
    $connection = Conexion::get_connection();
    $query = "SELECT i.codigo, i.descripcion, i.num_envio, 
                     e.fecha_progr, e.hora_salida, e.hora_llegada
              FROM incidente i
              LEFT JOIN envio e ON i.num_envio = e.numero
              ORDER BY i.codigo ASC";
    
    $result = $connection->query($query);
    
    if (!$result) {
        throw new Exception("Error al obtener incidentes: " . $connection->error);
    }
    
    $incidentes = [];
    while ($row = $result->fetch_assoc()) {
        $incidentes[] = $row;
    }
    
    echo json_encode($incidentes);
    $connection->close();
}

function getIncidenteById($codigo) {
    $connection = Conexion::get_connection();
    $query = "SELECT i.codigo, i.descripcion, i.num_envio, 
                     e.fecha_progr, e.hora_salida, e.hora_llegada,
                     c.matricula as camion_matricula,
                     s.nombre as sucursal_nombre
              FROM incidente i
              LEFT JOIN envio e ON i.num_envio = e.numero
              LEFT JOIN camion c ON e.cod_camion = c.codigo
              LEFT JOIN sucursal s ON e.cod_sucursal = s.codigo
              WHERE i.codigo = ?";
    
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $codigo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["error" => "Incidente no encontrado"]);
        return;
    }
    
    echo json_encode($result->fetch_assoc());
    $stmt->close();
    $connection->close();
}

function createIncidente() {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['codigo']) || !isset($data['descripcion']) || !isset($data['num_envio'])) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "Datos incompletos"]);
        return;
    }

    $connection = Conexion::get_connection();
    
    // Verificar si el envío existe
    $checkQuery = "SELECT numero FROM envio WHERE numero = ?";
    $checkStmt = $connection->prepare($checkQuery);
    $checkStmt->bind_param("i", $data['num_envio']);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows === 0) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "El número de envío no existe"]);
        $checkStmt->close();
        $connection->close();
        return;
    }
    $checkStmt->close();

    // Insertar el incidente
    $query = "INSERT INTO incidente (codigo, descripcion, num_envio) VALUES (?, ?, ?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("isi", $data['codigo'], $data['descripcion'], $data['num_envio']);
    
    if (!$stmt->execute()) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "Error al crear incidente: " . $stmt->error]);
        $stmt->close();
        $connection->close();
        return;
    }
    
    echo json_encode([
        "message" => "Incidente creado exitosamente",
        "codigo" => $data['codigo']
    ]);
    
    $stmt->close();
    $connection->close();
}

function updateIncidente() {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['codigo']) || !isset($data['descripcion']) || !isset($data['num_envio'])) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "Datos incompletos"]);
        return;
    }

    $connection = Conexion::get_connection();
    
    // Verificar si el incidente existe
    $checkQuery = "SELECT codigo FROM incidente WHERE codigo = ?";
    $checkStmt = $connection->prepare($checkQuery);
    $checkStmt->bind_param("i", $data['codigo']);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows === 0) {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["error" => "Incidente no encontrado"]);
        $checkStmt->close();
        $connection->close();
        return;
    }
    $checkStmt->close();

    // Verificar si el envío existe
    $checkQuery = "SELECT numero FROM envio WHERE numero = ?";
    $checkStmt = $connection->prepare($checkQuery);
    $checkStmt->bind_param("i", $data['num_envio']);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows === 0) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "El número de envío no existe"]);
        $checkStmt->close();
        $connection->close();
        return;
    }
    $checkStmt->close();

    // Actualizar el incidente
    $query = "UPDATE incidente SET descripcion = ?, num_envio = ? WHERE codigo = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sii", $data['descripcion'], $data['num_envio'], $data['codigo']);
    
    if (!$stmt->execute()) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "Error al actualizar incidente: " . $stmt->error]);
        $stmt->close();
        $connection->close();
        return;
    }
    
    echo json_encode([
        "message" => "Incidente actualizado exitosamente",
        "codigo" => $data['codigo']
    ]);
    
    $stmt->close();
    $connection->close();
}

function deleteIncidente() {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['codigo'])) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "Código de incidente no proporcionado"]);
        return;
    }

    $connection = Conexion::get_connection();
    
    // Verificar si el incidente existe
    $checkQuery = "SELECT codigo FROM incidente WHERE codigo = ?";
    $checkStmt = $connection->prepare($checkQuery);
    $checkStmt->bind_param("i", $data['codigo']);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows === 0) {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["error" => "Incidente no encontrado"]);
        $checkStmt->close();
        $connection->close();
        return;
    }
    $checkStmt->close();

    // Eliminar el incidente
    $query = "DELETE FROM incidente WHERE codigo = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $data['codigo']);
    
    if (!$stmt->execute()) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "Error al eliminar incidente: " . $stmt->error]);
        $stmt->close();
        $connection->close();
        return;
    }
    
    echo json_encode([
        "message" => "Incidente eliminado exitosamente",
        "codigo" => $data['codigo']
    ]);
    
    $stmt->close();
    $connection->close();
}
?>