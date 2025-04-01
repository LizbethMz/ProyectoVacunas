<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once '../config/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getCamiones();
        break;
    case 'POST':
        createCamion();
        break;
    case 'PUT':
        updateCamion();
        break;
    case 'DELETE':
        deleteCamion();
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getCamiones() {
    try {
        $connection = Conexion::get_connection();
        
        // Filtrar por estado si se especifica
        $estado = isset($_GET['estado']) ? $_GET['estado'] : null;
        $disponibles = isset($_GET['disponibles']) ? $_GET['disponibles'] : false;
        
        $query = "SELECT codigo, year, MMA, matricula, estado, cod_modelo, cod_marca FROM camion";
        $conditions = [];
        $params = [];
        $types = '';
        
        if ($estado) {
            $conditions[] = "estado = ?";
            $params[] = $estado;
            $types .= 's';
        }
        
        if ($disponibles) {
            $conditions[] = "estado IN ('Disponible', 'Asignado')";
        }
        
        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }
        
        $query .= " ORDER BY codigo ASC";
        
        $stmt = $connection->prepare($query);
        
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $camiones = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode($camiones, JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function createCamion() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        // Validar datos requeridos
        $requiredFields = ['codigo', 'year', 'MMA', 'matricula', 'estado', 'cod_modelo', 'cod_marca'];
        foreach ($requiredFields as $field) {
            if (!isset($data->$field)) {
                throw new Exception("El campo $field es requerido");
            }
        }
        
        // Validar estado válido
        $estadosPermitidos = ['Disponible', 'Asignado', 'En ruta', 'En mantenimiento'];
        if (!in_array($data->estado, $estadosPermitidos)) {
            throw new Exception("Estado no válido. Use: " . implode(', ', $estadosPermitidos));
        }

        $connection = Conexion::get_connection();

        // Verificar si el código ya existe
        $checkStmt = $connection->prepare("SELECT 1 FROM camion WHERE codigo = ?");
        $checkStmt->bind_param("i", $data->codigo);
        $checkStmt->execute();
        if ($checkStmt->get_result()->fetch_assoc()) {
            throw new Exception("El código de camión ya existe");
        }

        $query = $connection->prepare("INSERT INTO camion (codigo, year, MMA, matricula, estado, cod_modelo, cod_marca) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("iidssii", 
            $data->codigo, 
            $data->year,
            $data->MMA, 
            $data->matricula, 
            $data->estado, 
            $data->cod_modelo, 
            $data->cod_marca
        );
        
        if (!$query->execute()) {
            throw new Exception("Error al crear el camión: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Camión creado exitosamente",
            "codigo" => $data->codigo
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function updateCamion() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        // Validar datos requeridos
        if (!isset($data->codigo)) {
            throw new Exception("El código del camión es requerido");
        }

        $connection = Conexion::get_connection();

        // Obtener camión actual para comparar
        $currentStmt = $connection->prepare("SELECT estado FROM camion WHERE codigo = ?");
        $currentStmt->bind_param("i", $data->codigo);
        $currentStmt->execute();
        $currentCamion = $currentStmt->get_result()->fetch_assoc();
        
        if (!$currentCamion) {
            throw new Exception("Camión no encontrado");
        }

        // Validar transición de estado
        if (isset($data->estado) && $currentCamion['estado'] !== $data->estado) {
            // No permitir cambiar de "En ruta" a "Disponible" directamente
            if ($currentCamion['estado'] === 'En ruta' && $data->estado === 'Disponible') {
                throw new Exception("No se puede cambiar de 'En ruta' a 'Disponible' directamente. Primero debe pasar por 'Asignado'");
            }
        }

        // Construir consulta dinámica para actualizar solo los campos proporcionados
        $fields = [];
        $params = [];
        $types = '';
        
        $updatableFields = [
            'year' => 'i',
            'MMA' => 'd',
            'matricula' => 's',
            'estado' => 's',
            'cod_modelo' => 'i',
            'cod_marca' => 'i'
        ];
        
        foreach ($updatableFields as $field => $type) {
            if (isset($data->$field)) {
                $fields[] = "$field = ?";
                $params[] = $data->$field;
                $types .= $type;
            }
        }
        
        if (empty($fields)) {
            throw new Exception("No se proporcionaron campos para actualizar");
        }
        
        $params[] = $data->codigo;
        $types .= 'i';
        
        $queryStr = "UPDATE camion SET " . implode(", ", $fields) . " WHERE codigo = ?";
        $query = $connection->prepare($queryStr);
        $query->bind_param($types, ...$params);
        
        if (!$query->execute()) {
            throw new Exception("Error al actualizar el camión: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Camión actualizado exitosamente",
            "codigo" => $data->codigo
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    } finally {
        if (isset($connection)) $connection->close();
    }
}

function deleteCamion() {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->codigo)) {
            throw new Exception("El código del camión es requerido");
        }

        $connection = Conexion::get_connection();

        // Verificar si el camión está en uso
        $checkStmt = $connection->prepare("SELECT 1 FROM envio WHERE cod_camion = ?");
        $checkStmt->bind_param("i", $data->codigo);
        $checkStmt->execute();
        if ($checkStmt->get_result()->fetch_assoc()) {
            throw new Exception("No se puede eliminar el camión porque está asignado a un envío");
        }

        $query = $connection->prepare("DELETE FROM camion WHERE codigo = ?");
        $query->bind_param("i", $data->codigo);
        
        if (!$query->execute()) {
            throw new Exception("Error al eliminar el camión: " . $query->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Camión eliminado exitosamente"
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    } finally {
        if (isset($connection)) $connection->close();
    }
}
?>