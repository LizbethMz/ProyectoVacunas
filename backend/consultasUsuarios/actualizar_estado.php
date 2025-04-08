<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Activar el reporte de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Configurar el archivo de log
ini_set('log_errors', 1);
ini_set('error_log', 'C:\xampp\php\logs\php_error_log');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido', 405);
    }

    $data = json_decode(file_get_contents('php://input'), true);
    error_log("Datos recibidos: " . print_r($data, true));
    
    if (!isset($data['envioId']) || !isset($data['nuevoEstado'])) {
        throw new Exception('Parámetros requeridos faltantes', 400);
    }

    $envioId = intval($data['envioId']);
    $nuevoEstado = $data['nuevoEstado'];
    $fechaActual = date('Y-m-d');
    $horaActual = date('H:i:s');

    error_log("Intentando actualizar estado - Envío ID: $envioId, Nuevo Estado: $nuevoEstado");

    // Conectar a la base de datos
    $conexion = mysqli_connect('localhost', 'root', '', 'vacunas');
    
    if (!$conexion) {
        error_log("Error de conexión: " . mysqli_connect_error());
        throw new Exception('Error de conexión a la base de datos: ' . mysqli_connect_error());
    }

    // Establecer el conjunto de caracteres
    mysqli_set_charset($conexion, 'utf8');

    // Iniciar transacción
    mysqli_begin_transaction($conexion);
    error_log("Transacción iniciada");

    try {
        // 1. Obtener el siguiente número de estado
        $queryMaxEstado = "SELECT MAX(numero) as max_numero FROM estado";
        $resultMax = mysqli_query($conexion, $queryMaxEstado);
        if (!$resultMax) {
            error_log("Error en consulta MAX: " . mysqli_error($conexion));
            throw new Exception("Error al obtener el máximo número de estado");
        }
        
        $row = mysqli_fetch_assoc($resultMax);
        $nextEstadoNum = ($row['max_numero'] ?? 0) + 1;
        error_log("Siguiente número de estado: $nextEstadoNum");

        // 2. Insertar nuevo estado
        $queryEstado = "INSERT INTO estado (numero, descripcion, fecha, hora, num_envio) 
                      VALUES (?, ?, ?, ?, ?)";
        $stmtEstado = mysqli_prepare($conexion, $queryEstado);
        if (!$stmtEstado) {
            error_log("Error al preparar consulta estado: " . mysqli_error($conexion));
            throw new Exception("Error al preparar la consulta de estado");
        }
        
        mysqli_stmt_bind_param($stmtEstado, "isssi", $nextEstadoNum, $nuevoEstado, $fechaActual, $horaActual, $envioId);
        if (!mysqli_stmt_execute($stmtEstado)) {
            error_log("Error al ejecutar consulta estado: " . mysqli_stmt_error($stmtEstado));
            throw new Exception("Error al insertar el estado: " . mysqli_error($conexion));
        }
        error_log("Estado insertado correctamente");

        // 3. Insertar en envio_estado
        $queryEnvioEstado = "INSERT INTO envio_estado (num_envio, num_estado, fecha) 
                           VALUES (?, ?, NOW())";
        $stmtEnvioEstado = mysqli_prepare($conexion, $queryEnvioEstado);
        if (!$stmtEnvioEstado) {
            error_log("Error al preparar consulta envio_estado: " . mysqli_error($conexion));
            throw new Exception("Error al preparar la consulta de envio_estado");
        }
        
        mysqli_stmt_bind_param($stmtEnvioEstado, "ii", $envioId, $nextEstadoNum);
        if (!mysqli_stmt_execute($stmtEnvioEstado)) {
            error_log("Error al ejecutar consulta envio_estado: " . mysqli_stmt_error($stmtEnvioEstado));
            throw new Exception("Error al registrar el estado del envío: " . mysqli_error($conexion));
        }
        error_log("Envio_estado insertado correctamente");

        // Confirmar transacción
        mysqli_commit($conexion);
        error_log("Transacción confirmada");

        // Obtener información actualizada del envío
        $sqlEnvio = "SELECT 
            e.numero,
            e.fecha_progr,
            e.hora_salida,
            e.hora_llegada,
            s.nombre as sucursal_nombre,
            p.nombre as planta_nombre,
            c.matricula as camion_matricula,
            COALESCE(es.descripcion, 'Sin estado') as estado
        FROM envio e
        JOIN camion c ON e.cod_camion = c.codigo
        JOIN ruta r ON e.numero = r.num_envio
        JOIN sucursal s ON r.cod_sucursal = s.codigo
        JOIN planta p ON r.num_planta = p.numero
        LEFT JOIN (
            SELECT ee.num_envio, es.descripcion, ee.fecha
            FROM envio_estado ee
            JOIN estado es ON ee.num_estado = es.numero
            WHERE ee.num_envio = ?
            ORDER BY ee.fecha DESC, es.numero DESC
            LIMIT 1
        ) es ON e.numero = es.num_envio
        WHERE e.numero = ?";

        $stmtEnvio = mysqli_prepare($conexion, $sqlEnvio);
        if (!$stmtEnvio) {
            error_log("Error al preparar consulta envío: " . mysqli_error($conexion));
            throw new Exception("Error al preparar la consulta de envío: " . mysqli_error($conexion));
        }

        mysqli_stmt_bind_param($stmtEnvio, "ii", $envioId, $envioId);
        if (!mysqli_stmt_execute($stmtEnvio)) {
            error_log("Error al ejecutar consulta envío: " . mysqli_stmt_error($stmtEnvio));
            throw new Exception("Error al obtener información del envío: " . mysqli_error($conexion));
        }

        $result = mysqli_stmt_get_result($stmtEnvio);
        $envio = mysqli_fetch_assoc($result);
        
        // Verificar los datos obtenidos
        error_log("Información del envío obtenida: " . print_r($envio, true));
        
        // Verificar directamente el estado más reciente
        $queryEstadoActual = "SELECT es.descripcion, ee.fecha, ee.num_estado
                            FROM envio_estado ee 
                            JOIN estado es ON ee.num_estado = es.numero 
                            WHERE ee.num_envio = ? 
                            ORDER BY ee.fecha DESC, ee.num_estado DESC 
                            LIMIT 1";
        $stmtEstadoActual = mysqli_prepare($conexion, $queryEstadoActual);
        mysqli_stmt_bind_param($stmtEstadoActual, "i", $envioId);
        mysqli_stmt_execute($stmtEstadoActual);
        $resultEstado = mysqli_stmt_get_result($stmtEstadoActual);
        $estadoActual = mysqli_fetch_assoc($resultEstado);
        error_log("Estado actual verificado: " . print_r($estadoActual, true));
        
        // Actualizar el estado en el envío si es necesario
        if ($estadoActual && $estadoActual['descripcion'] !== $envio['estado']) {
            $envio['estado'] = $estadoActual['descripcion'];
        }

        // Cerrar sentencias
        mysqli_stmt_close($stmtEstado);
        mysqli_stmt_close($stmtEnvioEstado);
        mysqli_stmt_close($stmtEnvio);
        mysqli_stmt_close($stmtEstadoActual);

        echo json_encode([
            'success' => true,
            'message' => 'Estado actualizado correctamente',
            'data' => $envio
        ]);

    } catch (Exception $e) {
        error_log("Error en la transacción: " . $e->getMessage());
        mysqli_rollback($conexion);
        throw $e;
    }

} catch (Exception $e) {
    error_log("Error general: " . $e->getMessage());
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conexion)) {
        mysqli_close($conexion);
    }
}
?> 