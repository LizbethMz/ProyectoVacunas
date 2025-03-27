<?php
// Configuración de la base de datos
$host = '127.0.0.1';
$dbname = 'vacunas';
$username = 'root'; // Cambia por tu usuario
$password = ''; // Cambia por tu contraseña

// Conexión a la base de datos
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Estructura principal para el JSON
    $data = [];

    // 1. Obtener todas las ciudades
    $ciudades = fetchAll($pdo, "SELECT * FROM ciudad");
    
    foreach ($ciudades as &$ciudad) {
        $ciudadId = $ciudad['codigo'];
        
        // 2. Obtener sucursales por ciudad
        $sucursales = fetchAll($pdo, "SELECT * FROM sucursal WHERE cod_ciudad = ?", [$ciudadId]);
        
        foreach ($sucursales as &$sucursal) {
            $sucursalId = $sucursal['codigo'];
            
            // 3. Obtener farmacéutica de la sucursal
            $farmaceutica = fetchOne($pdo, "SELECT * FROM farmaceutica WHERE codigo = ?", [$sucursal['cod_farmaceutica']]);
            $sucursal['farmaceutica'] = $farmaceutica;
            
            // 4. Obtener envíos de la sucursal
            $envios = fetchAll($pdo, "SELECT * FROM envio WHERE cod_sucursal = ?", [$sucursalId]);
            
            foreach ($envios as &$envio) {
                $envioId = $envio['numero'];
                
                // 5. Obtener camión del envío
                $camion = fetchOne($pdo, "SELECT * FROM camion WHERE codigo = ?", [$envio['cod_camion']]);
                
                if ($camion) {
                    // Obtener modelo y marca del camión
                    $modelo = fetchOne($pdo, "SELECT * FROM modelo WHERE codigo = ?", [$camion['cod_modelo']]);
                    $marca = fetchOne($pdo, "SELECT * FROM marca WHERE codigo = ?", [$camion['cod_marca']]);
                    
                    $modelo['marca'] = $marca;
                    $camion['modelo'] = $modelo;
                    
                    // Obtener conductores del camión
                    $conductores = fetchAll($pdo, 
                        "SELECT c.* FROM conductor c 
                         JOIN camion_conductor cc ON c.numero = cc.num_conductor 
                         WHERE cc.cod_camion = ?", 
                        [$camion['codigo']]);
                    $camion['conductores'] = $conductores;
                    
                    // Obtener registros de carga del camión
                    $registrosCarga = fetchAll($pdo, "SELECT * FROM registro_carga WHERE cod_camion = ?", [$camion['codigo']]);
                    $camion['registros_carga'] = $registrosCarga;
                }
                $envio['camion'] = $camion;
                
                // 6. Obtener estados del envío
                $estados = fetchAll($pdo, "SELECT * FROM estado WHERE num_envio = ?", [$envioId]);
                $envio['estados'] = $estados;
                
                // 7. Obtener estados de envío (envio_estado)
                $envioEstados = fetchAll($pdo, "SELECT * FROM envio_estado WHERE num_envio = ?", [$envioId]);
                $envio['envio_estados'] = $envioEstados;
                
                // 8. Obtener incidentes del envío
                $incidentes = fetchAll($pdo, "SELECT * FROM incidente WHERE num_envio = ?", [$envioId]);
                $envio['incidentes'] = $incidentes;
                
                // 9. Obtener paquetes del envío
                $paquetes = fetchAll($pdo, "SELECT * FROM paquete WHERE num_envio = ?", [$envioId]);
                
                foreach ($paquetes as &$paquete) {
                    // Obtener planta del paquete
                    $planta = fetchOne($pdo, "SELECT * FROM planta WHERE numero = ?", [$paquete['num_planta']]);
                    
                    if ($planta) {
                        // Obtener laboratorio de la planta
                        $laboratorio = fetchOne($pdo, "SELECT * FROM laboratorio WHERE codigo = ?", [$planta['cod_laboratorio']]);
                        $planta['laboratorio'] = $laboratorio;
                        
                        // Obtener ciudad de la planta
                        $ciudadPlanta = fetchOne($pdo, "SELECT * FROM ciudad WHERE codigo = ?", [$planta['cod_ciudad']]);
                        $planta['ciudad'] = $ciudadPlanta;
                    }
                    $paquete['planta'] = $planta;
                }
                $envio['paquetes'] = $paquetes;
                
                // 10. Obtener registros de temperatura del envío
                $registrosTemp = fetchAll($pdo, "SELECT * FROM registro_temperatura WHERE num_envio = ?", [$envioId]);
                $envio['registros_temperatura'] = $registrosTemp;
                
                // 11. Obtener rutas del envío
                $rutas = fetchAll($pdo, "SELECT * FROM ruta WHERE num_envio = ?", [$envioId]);
                
                foreach ($rutas as &$ruta) {
                    // Obtener planta de la ruta
                    $plantaRuta = fetchOne($pdo, "SELECT * FROM planta WHERE numero = ?", [$ruta['num_planta']]);
                    
                    if ($plantaRuta) {
                        // Obtener laboratorio de la planta
                        $laboratorioRuta = fetchOne($pdo, "SELECT * FROM laboratorio WHERE codigo = ?", [$plantaRuta['cod_laboratorio']]);
                        $plantaRuta['laboratorio'] = $laboratorioRuta;
                        
                        // Obtener ciudad de la planta
                        $ciudadPlantaRuta = fetchOne($pdo, "SELECT * FROM ciudad WHERE codigo = ?", [$plantaRuta['cod_ciudad']]);
                        $plantaRuta['ciudad'] = $ciudadPlantaRuta;
                    }
                    $ruta['planta'] = $plantaRuta;
                    
                    // Obtener sucursal de la ruta
                    $sucursalRuta = fetchOne($pdo, "SELECT * FROM sucursal WHERE codigo = ?", [$ruta['cod_sucursal']]);
                    
                    if ($sucursalRuta) {
                        // Obtener farmacéutica de la sucursal
                        $farmaceuticaRuta = fetchOne($pdo, "SELECT * FROM farmaceutica WHERE codigo = ?", [$sucursalRuta['cod_farmaceutica']]);
                        $sucursalRuta['farmaceutica'] = $farmaceuticaRuta;
                        
                        // Obtener ciudad de la sucursal
                        $ciudadSucursalRuta = fetchOne($pdo, "SELECT * FROM ciudad WHERE codigo = ?", [$sucursalRuta['cod_ciudad']]);
                        $sucursalRuta['ciudad'] = $ciudadSucursalRuta;
                    }
                    $ruta['sucursal'] = $sucursalRuta;
                }
                $envio['rutas'] = $rutas;
            }
            $sucursal['envios'] = $envios;
        }
        $ciudad['sucursales'] = $sucursales;
        
        // 12. Obtener plantas por ciudad
        $plantas = fetchAll($pdo, "SELECT * FROM planta WHERE cod_ciudad = ?", [$ciudadId]);
        
        foreach ($plantas as &$planta) {
            // Obtener laboratorio de la planta
            $laboratorio = fetchOne($pdo, "SELECT * FROM laboratorio WHERE codigo = ?", [$planta['cod_laboratorio']]);
            $planta['laboratorio'] = $laboratorio;
        }
        $ciudad['plantas'] = $plantas;
    }
    $data['ciudades'] = $ciudades;

    // Convertir a JSON
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    // Guardar en un archivo
    $filename = 'export_vacunas_' . date('Y-m-d_H-i-s') . '.json';
    file_put_contents($filename, $json);

    // Descargar el archivo
    header('Content-Type: application/json');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . strlen($json));
    echo $json;

} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Función para obtener múltiples registros
function fetchAll($pdo, $sql, $params = []) {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Función para obtener un solo registro
function fetchOne($pdo, $sql, $params = []) {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
?>