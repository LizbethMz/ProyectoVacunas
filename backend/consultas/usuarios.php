<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getUsuarios();
        break;
    case 'POST':
        createUsuario();
        break;
    case 'PUT':
        updateUsuario();
        break;
    case 'DELETE':
        deleteUsuario();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getUsuarios() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT id, username, rol, num_conductor FROM usuarios ORDER BY id ASC");
        $usuarios = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($usuarios);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createUsuario() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        // Hash de la contraseña antes de guardarla
        $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

        $query = $connection->prepare("INSERT INTO usuarios (username, password, rol, num_conductor) VALUES (?, ?, ?, ?)");
        $query->bind_param("sssi", $data->username, $hashedPassword, $data->rol, $data->num_conductor);
        $query->execute();

        echo json_encode(["message" => "Usuario creado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function updateUsuario() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        // Si se proporciona una nueva contraseña, la hasheamos
        $passwordUpdate = "";
        if (!empty($data->password)) {
            $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
            $passwordUpdate = ", password = '$hashedPassword'";
        }

        $query = $connection->prepare("UPDATE usuarios SET username = ?, rol = ?, num_conductor = ? $passwordUpdate WHERE id = ?");
        
        if (!empty($data->password)) {
            $query->bind_param("ssii", $data->username, $data->rol, $data->num_conductor, $data->id);
        } else {
            $query->bind_param("ssii", $data->username, $data->rol, $data->num_conductor, $data->id);
        }
        
        $query->execute();

        echo json_encode(["message" => "Usuario actualizado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function deleteUsuario() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM usuarios WHERE id = ?");
        $query->bind_param("i", $data->id);
        $query->execute();

        echo json_encode(["message" => "Usuario eliminado"]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>