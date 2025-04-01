<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getPlantas();
        break;
    case 'POST':
        createPlanta();
        break;
    case 'PUT':
        updatePlanta();
        break;
    case 'DELETE':
        deletePlanta();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getPlantas() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("SELECT * FROM planta ORDER BY numero ASC");
        $plantas = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($plantas);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createPlanta() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        $requiredFields = ['numero', 'nombre', 'pais', 'colonia', 'calle', 
                         'numeroD', 'codigo_postal', 'telefono', 'correo',
                         'cod_laboratorio', 'cod_ciudad'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data->$field)) {
                throw new Exception("El campo $field es requerido");
            }
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("INSERT INTO planta (numero, nombre, pais, colonia, calle, numeroD, codigo_postal, telefono, correo, cod_laboratorio, cod_ciudad) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("issssssssii", 
            $data->numero, 
            $data->nombre,
            $data->pais, 
            $data->colonia, 
            $data->calle, 
            $data->numeroD,
            $data->codigo_postal,
            $data->telefono,
            $data->correo,
            $data->cod_laboratorio,
            $data->cod_ciudad
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al crear la planta: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Planta creada exitosamente"
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

function updatePlanta() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->numero) || !isset($data->telefono) || !isset($data->correo)) {
            throw new Exception("El número, teléfono y correo son requeridos");
        }

        $connection = Conexion::get_connection();

        // Solo actualizamos teléfono y correo
        $query = $connection->prepare("UPDATE planta SET telefono = ?, correo = ? WHERE numero = ?");
        $query->bind_param("ssi", 
            $data->telefono,
            $data->correo,
            $data->numero
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al actualizar la planta: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Contacto de planta actualizado exitosamente"
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

function deletePlanta() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->numero)) {
            throw new Exception("El número de la planta es requerido");
        }

        $connection = Conexion::get_connection();

        $query = $connection->prepare("DELETE FROM planta WHERE numero = ?");
        $query->bind_param("i", $data->numero);
        
        if (!$query->execute()) {
            throw new Exception("Error al eliminar la planta: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Planta eliminada exitosamente"
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