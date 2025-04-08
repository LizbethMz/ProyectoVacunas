<?php
// Mostrar errores para diagnóstico
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h2>Verificación de conexión a la base de datos:</h2>";

// Verificar la ruta del archivo de conexión
$conexion_path = realpath('../../backend/conexion.php');
echo "Ruta del archivo de conexión: " . $conexion_path . "<br>";

if (file_exists($conexion_path)) {
    echo "El archivo de conexión existe<br>";
    require_once $conexion_path;
    
    // Verificar si la conexión se estableció
    if (isset($conn)) {
        echo "Conexión establecida correctamente<br>";
        
        // Verificar conductor
        $conductorId = 2;
        $sql = "SELECT c.numero, c.nombre_pila, c.apellidoP, 
                       cam.codigo as camion_id, cam.matricula,
                       COUNT(e.numero) as total_envios
                FROM conductor c
                LEFT JOIN camion_conductor cc ON c.numero = cc.num_conductor
                LEFT JOIN camion cam ON cc.cod_camion = cam.codigo
                LEFT JOIN envio e ON cam.codigo = e.cod_camion
                WHERE c.numero = ?
                GROUP BY c.numero, c.nombre_pila, c.apellidoP, cam.codigo, cam.matricula";

        $stmt = $conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("i", $conductorId);
            $stmt->execute();
            $result = $stmt->get_result();

            echo "<h2>Datos del conductor y sus envíos:</h2>";
            if ($row = $result->fetch_assoc()) {
                echo "Conductor: " . $row['nombre_pila'] . " " . $row['apellidoP'] . "<br>";
                echo "ID Conductor: " . $row['numero'] . "<br>";
                echo "Camión asignado: " . $row['matricula'] . " (ID: " . $row['camion_id'] . ")<br>";
                echo "Total de envíos: " . $row['total_envios'] . "<br>";
            } else {
                echo "Conductor no encontrado";
            }

            // Verificar envíos específicos
            echo "<h2>Detalles de los envíos:</h2>";
            $sql = "SELECT e.numero, e.fecha_progr, e.hora_salida, e.hora_llegada,
                           s.nombre as sucursal_nombre,
                           p.nombre as planta_nombre,
                           c.matricula as camion_matricula,
                           es.descripcion as estado
                    FROM envio e
                    JOIN camion c ON e.cod_camion = c.codigo
                    JOIN camion_conductor cc ON c.codigo = cc.cod_camion
                    JOIN ruta r ON e.numero = r.num_envio
                    JOIN sucursal s ON r.cod_sucursal = s.codigo
                    JOIN planta p ON r.num_planta = p.numero
                    LEFT JOIN envio_estado ee ON e.numero = ee.num_envio
                    LEFT JOIN estado es ON ee.num_estado = es.numero
                    WHERE cc.num_conductor = ?
                    ORDER BY e.fecha_progr DESC, e.hora_salida DESC";

            $stmt = $conn->prepare($sql);
            if ($stmt) {
                $stmt->bind_param("i", $conductorId);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo "<div style='border: 1px solid #ccc; padding: 10px; margin: 10px;'>";
                        echo "Envío #" . $row['numero'] . "<br>";
                        echo "Fecha: " . $row['fecha_progr'] . "<br>";
                        echo "Hora salida: " . $row['hora_salida'] . "<br>";
                        echo "Hora llegada: " . $row['hora_llegada'] . "<br>";
                        echo "Origen: " . $row['planta_nombre'] . "<br>";
                        echo "Destino: " . $row['sucursal_nombre'] . "<br>";
                        echo "Estado: " . $row['estado'] . "<br>";
                        echo "</div>";
                    }
                } else {
                    echo "No se encontraron envíos";
                }
            } else {
                echo "Error al preparar la consulta de envíos: " . $conn->error;
            }
        } else {
            echo "Error al preparar la consulta del conductor: " . $conn->error;
        }
    } else {
        echo "Error: La variable \$conn no está definida después de incluir conexion.php<br>";
    }
} else {
    echo "Error: El archivo de conexión no existe en la ruta especificada<br>";
}
?> 