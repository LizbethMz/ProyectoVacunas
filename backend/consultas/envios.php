<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getEnviosConEstado();
        break;
    case 'POST':
        crearEnvioConEstadoInicial();
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

function getEnviosConEstado() {
    try {
        $connection = Conexion::get_connection();
        
        $query = "SELECT e.*, 
                 (SELECT descripcion FROM estado WHERE num_envio = e.numero ORDER BY fecha DESC, hora DESC LIMIT 1) as estado,
                 (SELECT numero FROM estado WHERE num_envio = e.numero ORDER BY fecha DESC, hora DESC LIMIT 1) as cod_estado
                 FROM envio e
                 ORDER BY e.numero ASC";
        
        $result = $connection->query($query);
        $envios = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode($envios);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function crearEnvioConEstadoInicial() {
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

        // Iniciar transacción
        $connection->begin_transaction();

        // Crear envío
        $query = $connection->prepare("INSERT INTO envio (numero, fecha_progr, hora_salida, hora_llegada, cod_camion, cod_ruta) 
                                     VALUES (?, ?, ?, ?, ?, ?)");
        $query->bind_param("isssii", $data->numero, $data->fecha_progr, $data->hora_salida, $data->hora_llegada, $data->cod_camion, $data->cod_ruta);
        $query->execute();
        
        $num_envio = $connection->insert_id;

        // Registrar estado inicial "Preparando carga" (código 1)
        $estadoQuery = $connection->prepare("INSERT INTO estado (numero, descripcion, num_envio) 
                                           VALUES (1, 'Preparando carga', ?)");
        $estadoQuery->bind_param("i", $num_envio);
        $estadoQuery->execute();

        // Actualizar estado del camión
        $updateCamion = $connection->prepare("UPDATE camion SET estado = 'En ruta' WHERE codigo = ?");
        $updateCamion->bind_param("i", $data->cod_camion);
        $updateCamion->execute();

        $connection->commit();

        echo json_encode([
            "success" => true,
            "message" => "Envío creado con estado inicial",
            "num_envio" => $num_envio
        ]);
    } catch (Exception $e) {
        $connection->rollback();
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        $connection->close();
    }
}

function actualizarEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        // Actualizar datos básicos del envío
        $query = $connection->prepare("UPDATE envio SET 
                                     fecha_progr = ?, 
                                     hora_salida = ?, 
                                     hora_llegada = ?, 
                                     cod_camion = ?, 
                                     cod_ruta = ? 
                                     WHERE numero = ?");
        $query->bind_param("ssssii", 
            $data->fecha_progr, 
            $data->hora_salida, 
            $data->hora_llegada, 
            $data->cod_camion, 
            $data->cod_ruta, 
            $data->numero
        );
        $query->execute();

        // Si se envió un nuevo estado, registrarlo
        if (isset($data->nuevo_estado)) {
            $estadoQuery = $connection->prepare("INSERT INTO estado (numero, descripcion, num_envio) 
                                               VALUES (?, ?, ?)");
            $estadoQuery->bind_param("isi", 
                $data->nuevo_estado->numero, 
                $data->nuevo_estado->descripcion, 
                $data->numero
            );
            $estadoQuery->execute();
        }

        echo json_encode([
            "success" => true,
            "message" => "Envío actualizado correctamente"
        ]);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function eliminarEnvio() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        $connection = Conexion::get_connection();

        // Verificar estado actual del envío
        $estadoQuery = $connection->prepare("SELECT descripcion FROM estado 
                                           WHERE num_envio = ? 
                                           ORDER BY fecha DESC, hora DESC 
                                           LIMIT 1");
        $estadoQuery->bind_param("i", $data->numero);
        $estadoQuery->execute();
        $estado = $estadoQuery->get_result()->fetch_assoc();

        if (!$estado || !in_array($estado['descripcion'], ['Entregado', 'Cancelado'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Solo se pueden eliminar envíos en estado "Entregado" o "Cancelado"'
            ]);
            return;
        }

        // Iniciar transacción
        $connection->begin_transaction();

        // Obtener camión asociado para liberarlo
        $camionQuery = $connection->prepare("SELECT cod_camion FROM envio WHERE numero = ?");
        $camionQuery->bind_param("i", $data->numero);
        $camionQuery->execute();
        $camion = $camionQuery->get_result()->fetch_assoc();

        // Eliminar estados asociados al envío
        $connection->query("DELETE FROM estado WHERE num_envio = " . $data->numero);

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
        $connection->close();
    }
}
?>