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
        crearEnvio();
        break;
    case 'PUT':
        actualizarEnvio();
        break;
    case 'DELETE':
        eliminarEnvio();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getEnvios() {
    try {
        $connection = Conexion::get_connection();
        
        $query = "SELECT * FROM envio ORDER BY numero ASC";
        $result = $connection->query($query);
        $envios = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode($envios);
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function crearEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        // Verificar camión disponible
        $stmt = $connection->prepare("SELECT estado FROM camion WHERE codigo = ?");
        $stmt->bind_param("i", $data->cod_camion);
        $stmt->execute();
        $camion = $stmt->get_result()->fetch_assoc();

        if (!$camion || $camion['estado'] != 'Disponible') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'El camión no está disponible'
            ]);
            return;
        }

        // Crear envío
        $query = $connection->prepare("INSERT INTO envio (numero, fecha_progr, hora_salida, hora_llegada, cod_camion, cod_ruta) 
                                     VALUES (?, ?, ?, ?, ?, ?)");
        $query->bind_param("isssii", 
            $data->numero, 
            $data->fecha_progr, 
            $data->hora_salida, 
            $data->hora_llegada, 
            $data->cod_camion, 
            $data->cod_ruta
        );
        $query->execute();
        
        // Actualizar estado del camión
        $updateCamion = $connection->prepare("UPDATE camion SET estado = 'En ruta' WHERE codigo = ?");
        $updateCamion->bind_param("i", $data->cod_camion);
        $updateCamion->execute();

        echo json_encode([
            "success" => true,
            "message" => "Envío creado correctamente",
            "num_envio" => $data->numero
        ]);
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function actualizarEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        $query = $connection->prepare("UPDATE envio SET 
                                     hora_llegada = ?
                                     WHERE numero = ?");
        $query->bind_param("si", 
            $data->hora_llegada, 
            $data->numero
        );
        $query->execute();

        echo json_encode([
            "success" => true,
            "message" => "Envío actualizado correctamente"
        ]);
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function eliminarEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        // Iniciar transacción
        $connection->begin_transaction();

        // Obtener camión asociado para liberarlo
        $camionQuery = $connection->prepare("SELECT cod_camion FROM envio WHERE numero = ?");
        $camionQuery->bind_param("i", $data->numero);
        $camionQuery->execute();
        $camion = $camionQuery->get_result()->fetch_assoc();

        // Eliminar el envío
        $connection->query("DELETE FROM envio WHERE numero = " . $data->numero);

        // Liberar camión (volver a Disponible)
        if ($camion) {
            $connection->query("UPDATE camion SET estado = 'Disponible' WHERE codigo = " . $camion['cod_camion']);
        }

        $connection->commit();

        echo json_encode([
            "success" => true,
            "message" => "Envío eliminado y camión liberado"
        ]);
    } catch (Exception $e) {
        $connection->rollback();
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($connection)) $connection->close();
    }
}
?>