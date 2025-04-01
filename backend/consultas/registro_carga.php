<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getRegistrosCarga();
        break;
    case 'POST':
        createRegistroCarga();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRegistrosCarga() {
    try {
        $connection = Conexion::get_connection();
        $result = $connection->query("
            SELECT r.codigo, r.carga_util, r.cod_camion, c.matricula, r.num_envio, r.fecha_registro 
            FROM registro_carga r
            LEFT JOIN camion c ON r.cod_camion = c.codigo
            ORDER BY r.fecha_registro DESC
        ");
        $registros = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($registros);
        $connection->close();
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function createRegistroCarga() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        // Validar campos requeridos
        if (!isset($data->carga_util) || !isset($data->cod_camion) || !isset($data->num_envio)) {
            throw new Exception("Todos los campos son requeridos");
        }

        $connection = Conexion::get_connection();

        // 1. Verificar si el número de envío ya existe en registro_carga
        $checkRegistroQuery = $connection->prepare("SELECT COUNT(*) as count FROM registro_carga WHERE num_envio = ?");
        $checkRegistroQuery->bind_param("i", $data->num_envio);
        $checkRegistroQuery->execute();
        $checkRegistroResult = $checkRegistroQuery->get_result();
        $checkRegistroRow = $checkRegistroResult->fetch_assoc();
        
        if ($checkRegistroRow['count'] > 0) {
            throw new Exception("El número de envío ya está registrado en otro carga");
        }

        // 2. Verificar si el número de envío existe en la tabla envio
        $checkEnvioQuery = $connection->prepare("SELECT COUNT(*) as count FROM envio WHERE numero = ?");
        $checkEnvioQuery->bind_param("i", $data->num_envio);
        $checkEnvioQuery->execute();
        $checkEnvioResult = $checkEnvioQuery->get_result();
        $checkEnvioRow = $checkEnvioResult->fetch_assoc();
        
        if ($checkEnvioRow['count'] == 0) {
            throw new Exception("El número de envío no existe en el sistema");
        }

        // 3. Verificar si el camión existe
        $checkCamionQuery = $connection->prepare("SELECT COUNT(*) as count FROM camion WHERE codigo = ?");
        $checkCamionQuery->bind_param("i", $data->cod_camion);
        $checkCamionQuery->execute();
        $checkCamionResult = $checkCamionQuery->get_result();
        $checkCamionRow = $checkCamionResult->fetch_assoc();
        
        if ($checkCamionRow['count'] == 0) {
            throw new Exception("El código de camión no existe en el sistema");
        }

        // Si todas las validaciones pasan, crear el registro
        $query = $connection->prepare("INSERT INTO registro_carga (carga_util, cod_camion, num_envio) VALUES (?, ?, ?)");
        $query->bind_param("dii", 
            $data->carga_util,
            $data->cod_camion,
            $data->num_envio
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al crear el registro: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Registro de carga creado exitosamente"
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