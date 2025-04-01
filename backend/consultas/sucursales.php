<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getSucursales();
        break;
    case 'POST':
        createSucursal();
        break;
    case 'PUT':
        updateSucursal();
        break;
    case 'DELETE':
        deleteSucursal();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getSucursales() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT * FROM sucursal ORDER BY codigo ASC");
        $sucursales = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($sucursales);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createSucursal() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        $requiredFields = ['codigo', 'nombre', 'pais', 'colonia', 'calle', 
                         'numeroD', 'codigo_postal', 'telefono', 'correo',
                         'cod_farmaceutica', 'cod_ciudad'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data->$field)) {
                throw new Exception("El campo $field es requerido");
            }
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("INSERT INTO sucursal (codigo, nombre, pais, colonia, calle, numeroD, codigo_postal, telefono, correo, cod_farmaceutica, cod_ciudad) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("issssssssii", 
            $data->codigo, 
            $data->nombre,
            $data->pais, 
            $data->colonia, 
            $data->calle, 
            $data->numeroD,
            $data->codigo_postal,
            $data->telefono,
            $data->correo,
            $data->cod_farmaceutica,
            $data->cod_ciudad
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al crear la sucursal: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Sucursal creada exitosamente"
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

function updateSucursal() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo) || !isset($data->telefono) || !isset($data->correo)) {
            throw new Exception("El código, teléfono y correo son requeridos");
        }

        $connection = Conexion::get_connection();

        // Solo actualizamos teléfono y correo
        $query = $connection->prepare("UPDATE sucursal SET 
                                      telefono = ?, 
                                      correo = ? 
                                      WHERE codigo = ?");
        $query->bind_param("ssi", 
            $data->telefono,
            $data->correo,
            $data->codigo
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al actualizar la sucursal: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Contacto de sucursal actualizado exitosamente"
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

function deleteSucursal() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo)) {
            throw new Exception("El código de la sucursal es requerido");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM sucursal WHERE codigo = ?");
        $query->bind_param("i", $data->codigo);
        
        if (!$query->execute()) {
            throw new Exception("Error al eliminar la sucursal: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Sucursal eliminada exitosamente"
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