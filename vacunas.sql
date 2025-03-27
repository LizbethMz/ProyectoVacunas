-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-03-2025 a las 20:18:47
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `vacunas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camion`
--

CREATE TABLE `camion` (
  `codigo` int(11) NOT NULL,
  `year` int(11) NOT NULL DEFAULT 0,
  `MMA` decimal(10,2) NOT NULL DEFAULT 0.00,
  `matricula` varchar(20) NOT NULL DEFAULT '',
  `estado` varchar(50) NOT NULL DEFAULT '',
  `cod_modelo` int(11) NOT NULL,
  `cod_marca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camion_conductor`
--

CREATE TABLE `camion_conductor` (
  `cod_camion` int(11) NOT NULL,
  `num_conductor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conductor`
--

CREATE TABLE `conductor` (
  `numero` int(11) NOT NULL,
  `nombre_pila` varchar(50) NOT NULL DEFAULT '',
  `apellidoP` varchar(50) NOT NULL DEFAULT '',
  `apellidoM` varchar(50) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envio`
--

CREATE TABLE `envio` (
  `numero` int(11) NOT NULL,
  `fecha_progr` date NOT NULL DEFAULT curdate(),
  `hora_salida` time NOT NULL DEFAULT '00:00:00',
  `hora_llegada` time NOT NULL DEFAULT '00:00:00',
  `cod_camion` int(11) NOT NULL,
  `cod_sucursal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envio_estado`
--

CREATE TABLE `envio_estado` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `num_envio` int(11) NOT NULL,
  `num_estado` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `numero` int(11) NOT NULL,
  `descripcion` text NOT NULL DEFAULT '',
  `fecha` date NOT NULL DEFAULT curdate(),
  `hora` time NOT NULL DEFAULT '00:00:00',
  `num_envio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `farmaceutica`
--

CREATE TABLE `farmaceutica` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL DEFAULT '',
  `correo` varchar(100) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidente`
--

CREATE TABLE `incidente` (
  `codigo` int(11) NOT NULL,
  `descripcion` text NOT NULL DEFAULT '',
  `num_envio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `laboratorio`
--

CREATE TABLE `laboratorio` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `contacto` varchar(100) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelo`
--

CREATE TABLE `modelo` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `year` int(11) NOT NULL DEFAULT 0,
  `cod_marca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquete`
--

CREATE TABLE `paquete` (
  `codigo` int(11) NOT NULL,
  `lote` varchar(50) NOT NULL DEFAULT '',
  `temp_requerida` decimal(5,2) NOT NULL DEFAULT 0.00,
  `descripcion` text NOT NULL DEFAULT '',
  `vacuna` varchar(100) NOT NULL DEFAULT '',
  `num_planta` int(11) NOT NULL,
  `num_envio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planta`
--

CREATE TABLE `planta` (
  `numero` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `pais` varchar(50) NOT NULL DEFAULT '',
  `colonia` varchar(100) NOT NULL DEFAULT '',
  `calle` varchar(100) NOT NULL DEFAULT '',
  `numeroD` varchar(10) NOT NULL DEFAULT '',
  `codigo_postal` varchar(10) NOT NULL DEFAULT '',
  `telefono` varchar(20) NOT NULL DEFAULT '',
  `correo` varchar(100) NOT NULL DEFAULT '',
  `cod_laboratorio` int(11) NOT NULL,
  `cod_ciudad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_carga`
--

CREATE TABLE `registro_carga` (
  `codigo` int(11) NOT NULL,
  `carga_util` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cod_camion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_temperatura`
--

CREATE TABLE `registro_temperatura` (
  `numero` int(11) NOT NULL,
  `hora` time NOT NULL DEFAULT '00:00:00',
  `temperatura` decimal(5,2) NOT NULL DEFAULT 0.00,
  `fecha` date NOT NULL DEFAULT curdate(),
  `num_envio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ruta`
--

CREATE TABLE `ruta` (
  `numero` int(11) NOT NULL,
  `f_salida` date NOT NULL DEFAULT curdate(),
  `f_llegada` date NOT NULL DEFAULT curdate(),
  `h_salida` time NOT NULL DEFAULT '00:00:00',
  `h_llegada` time NOT NULL DEFAULT '00:00:00',
  `num_envio` int(11) NOT NULL,
  `num_planta` int(11) NOT NULL,
  `cod_sucursal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursal`
--

CREATE TABLE `sucursal` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `pais` varchar(50) NOT NULL DEFAULT '',
  `colonia` varchar(100) NOT NULL DEFAULT '',
  `calle` varchar(100) NOT NULL DEFAULT '',
  `numeroD` varchar(10) NOT NULL DEFAULT '',
  `codigo_postal` varchar(10) NOT NULL DEFAULT '',
  `telefono` varchar(20) NOT NULL DEFAULT '',
  `correo` varchar(100) NOT NULL DEFAULT '',
  `cod_farmaceutica` int(11) NOT NULL,
  `cod_ciudad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear la tabla usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'chofer') NOT NULL,
    num_conductor INT,
    FOREIGN KEY (num_conductor) REFERENCES conductor(numero) ON DELETE SET NULL
);

-- Insertar usuario administrador
INSERT INTO usuarios (username, password, rol) VALUES
('admin', 'admin123', 'admin');

-- Insertar usuarios para los conductores existentes
INSERT INTO usuarios (username, password, rol, num_conductor) VALUES
('mmartinez', '123', 'chofer', 2),
('crodriguez', '123', 'chofer', 3),
('ahernandez', '123', 'chofer', 4),
('ldiaz', '123', 'chofer', 5);

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS tipo_usuario VARCHAR(10) DEFAULT 'user' NOT NULL;

-- Actualiza usuarios existentes si es necesario
UPDATE usuarios SET tipo_usuario = 'admin' WHERE username = 'admin';
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `camion`
--
ALTER TABLE `camion`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `cod_modelo` (`cod_modelo`),
  ADD KEY `cod_marca` (`cod_marca`);

--
-- Indices de la tabla `camion_conductor`
--
ALTER TABLE `camion_conductor`
  ADD PRIMARY KEY (`cod_camion`,`num_conductor`),
  ADD KEY `num_conductor` (`num_conductor`);

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `UC_CIUDAD_NOMBRE` (`nombre`);

--
-- Indices de la tabla `conductor`
--
ALTER TABLE `conductor`
  ADD PRIMARY KEY (`numero`);

--
-- Indices de la tabla `envio`
--
ALTER TABLE `envio`
  ADD PRIMARY KEY (`numero`),
  ADD KEY `cod_camion` (`cod_camion`),
  ADD KEY `cod_sucursal` (`cod_sucursal`);

--
-- Indices de la tabla `envio_estado`
--
ALTER TABLE `envio_estado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `num_envio` (`num_envio`),
  ADD KEY `num_estado` (`num_estado`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`numero`),
  ADD KEY `num_envio` (`num_envio`);

--
-- Indices de la tabla `farmaceutica`
--
ALTER TABLE `farmaceutica`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `UC_FARMACEUTICA_NOMBRE` (`nombre`);

--
-- Indices de la tabla `incidente`
--
ALTER TABLE `incidente`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `num_envio` (`num_envio`);

--
-- Indices de la tabla `laboratorio`
--
ALTER TABLE `laboratorio`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `UC_LABORATORIO_NOMBRE` (`nombre`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `UC_MARCA_NOMBRE` (`nombre`);

--
-- Indices de la tabla `modelo`
--
ALTER TABLE `modelo`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `cod_marca` (`cod_marca`);

--
-- Indices de la tabla `paquete`
--
ALTER TABLE `paquete`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `num_planta` (`num_planta`),
  ADD KEY `FK_paquete` (`num_envio`);

--
-- Indices de la tabla `planta`
--
ALTER TABLE `planta`
  ADD PRIMARY KEY (`numero`),
  ADD UNIQUE KEY `UC_PLANTA_NOMBRE` (`nombre`),
  ADD KEY `cod_laboratorio` (`cod_laboratorio`),
  ADD KEY `cod_ciudad` (`cod_ciudad`);

--
-- Indices de la tabla `registro_carga`
--
ALTER TABLE `registro_carga`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `cod_camion` (`cod_camion`);

--
-- Indices de la tabla `registro_temperatura`
--
ALTER TABLE `registro_temperatura`
  ADD PRIMARY KEY (`numero`),
  ADD KEY `num_envio` (`num_envio`);

--
-- Indices de la tabla `ruta`
--
ALTER TABLE `ruta`
  ADD PRIMARY KEY (`numero`),
  ADD KEY `num_envio` (`num_envio`),
  ADD KEY `num_planta` (`num_planta`),
  ADD KEY `cod_sucursal` (`cod_sucursal`);

--
-- Indices de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `UC_SUCURSAL_NOMBRE` (`nombre`),
  ADD KEY `cod_farmaceutica` (`cod_farmaceutica`),
  ADD KEY `cod_ciudad` (`cod_ciudad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `envio_estado`
--
ALTER TABLE `envio_estado`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `camion`
--
ALTER TABLE `camion`
  ADD CONSTRAINT `camion_ibfk_1` FOREIGN KEY (`cod_modelo`) REFERENCES `modelo` (`codigo`),
  ADD CONSTRAINT `camion_ibfk_2` FOREIGN KEY (`cod_marca`) REFERENCES `marca` (`codigo`);

--
-- Filtros para la tabla `camion_conductor`
--
ALTER TABLE `camion_conductor`
  ADD CONSTRAINT `camion_conductor_ibfk_1` FOREIGN KEY (`cod_camion`) REFERENCES `camion` (`codigo`),
  ADD CONSTRAINT `camion_conductor_ibfk_2` FOREIGN KEY (`num_conductor`) REFERENCES `conductor` (`numero`);

--
-- Filtros para la tabla `envio`
--
ALTER TABLE `envio`
  ADD CONSTRAINT `envio_ibfk_1` FOREIGN KEY (`cod_camion`) REFERENCES `camion` (`codigo`),
  ADD CONSTRAINT `envio_ibfk_2` FOREIGN KEY (`cod_sucursal`) REFERENCES `sucursal` (`codigo`);

--
-- Filtros para la tabla `envio_estado`
--
ALTER TABLE `envio_estado`
  ADD CONSTRAINT `envio_estado_ibfk_1` FOREIGN KEY (`num_envio`) REFERENCES `envio` (`numero`),
  ADD CONSTRAINT `envio_estado_ibfk_2` FOREIGN KEY (`num_estado`) REFERENCES `estado` (`numero`);

--
-- Filtros para la tabla `estado`
--
ALTER TABLE `estado`
  ADD CONSTRAINT `estado_ibfk_1` FOREIGN KEY (`num_envio`) REFERENCES `envio` (`numero`);

--
-- Filtros para la tabla `incidente`
--
ALTER TABLE `incidente`
  ADD CONSTRAINT `incidente_ibfk_1` FOREIGN KEY (`num_envio`) REFERENCES `envio` (`numero`);

--
-- Filtros para la tabla `modelo`
--
ALTER TABLE `modelo`
  ADD CONSTRAINT `modelo_ibfk_1` FOREIGN KEY (`cod_marca`) REFERENCES `marca` (`codigo`);

--
-- Filtros para la tabla `paquete`
--
ALTER TABLE `paquete`
  ADD CONSTRAINT `FK_paquete` FOREIGN KEY (`num_envio`) REFERENCES `envio` (`numero`),
  ADD CONSTRAINT `paquete_ibfk_1` FOREIGN KEY (`num_planta`) REFERENCES `planta` (`numero`);

--
-- Filtros para la tabla `planta`
--
ALTER TABLE `planta`
  ADD CONSTRAINT `planta_ibfk_1` FOREIGN KEY (`cod_laboratorio`) REFERENCES `laboratorio` (`codigo`),
  ADD CONSTRAINT `planta_ibfk_2` FOREIGN KEY (`cod_ciudad`) REFERENCES `ciudad` (`codigo`);

--
-- Filtros para la tabla `registro_carga`
--
ALTER TABLE `registro_carga`
  ADD CONSTRAINT `registro_carga_ibfk_1` FOREIGN KEY (`cod_camion`) REFERENCES `camion` (`codigo`);

--
-- Filtros para la tabla `registro_temperatura`
--
ALTER TABLE `registro_temperatura`
  ADD CONSTRAINT `registro_temperatura_ibfk_1` FOREIGN KEY (`num_envio`) REFERENCES `envio` (`numero`);

--
-- Filtros para la tabla `ruta`
--
ALTER TABLE `ruta`
  ADD CONSTRAINT `ruta_ibfk_1` FOREIGN KEY (`num_envio`) REFERENCES `envio` (`numero`),
  ADD CONSTRAINT `ruta_ibfk_2` FOREIGN KEY (`num_planta`) REFERENCES `planta` (`numero`),
  ADD CONSTRAINT `ruta_ibfk_3` FOREIGN KEY (`cod_sucursal`) REFERENCES `sucursal` (`codigo`);

--
-- Filtros para la tabla `sucursal`
--
ALTER TABLE `sucursal`
  ADD CONSTRAINT `sucursal_ibfk_1` FOREIGN KEY (`cod_farmaceutica`) REFERENCES `farmaceutica` (`codigo`),
  ADD CONSTRAINT `sucursal_ibfk_2` FOREIGN KEY (`cod_ciudad`) REFERENCES `ciudad` (`codigo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Actualizar datos de ciudad para Baja California
DELETE FROM ciudad WHERE codigo IN (1, 2, 3, 4, 5);
INSERT INTO ciudad (codigo, nombre) VALUES
(1, 'Tijuana'),
(2, 'Mexicali'),
(3, 'Ensenada'),
(4, 'Rosarito'),
(5, 'Tecate');

INSERT INTO farmaceutica (codigo, nombre, telefono, correo) VALUES
(1, 'Pfizer México', '6641234501', 'contacto.tj@pfizer.com'),
(2, 'AstraZeneca BC', '6861234502', 'contacto.mxl@astrazeneca.com'),
(3, 'Moderna Noroeste', '6461234503', 'contacto.ens@moderna.com'),
(4, 'J&J Baja California', '6611234504', 'contacto.ros@jnj.com'),
(5, 'Novavax Frontera', '6651234505', 'contacto.tec@novavax.com');

INSERT INTO laboratorio (codigo, nombre, contacto) VALUES
(1, 'Laboratorios Tijuana', 'Dr. Carlos Méndez'),
(2, 'Biotecnología Mexicali', 'Dra. Laura Sánchez'),
(3, 'Ensenada Vaccines', 'Dr. Roberto Navarro'),
(4, 'Rosarito Pharma Labs', 'Dra. Patricia Castro'),
(5, 'Tecate Biologicals', 'Dr. Javier Ruiz');

INSERT INTO planta (numero, nombre, pais, colonia, calle, numeroD, codigo_postal, telefono, correo, cod_laboratorio, cod_ciudad) VALUES
(1, 'Planta Fronteriza TJ', 'México', 'Otay', 'Blvd. Industrial', '1001', '22444', '6641001001', 'planta1@labtj.com', 1, 1),
(2, 'Planta Capital BC', 'México', 'Industrial', 'Av. de los Lagos', '2002', '21020', '6862002002', 'planta2@labmxl.com', 2, 2),
(3, 'Planta Costera ENS', 'México', 'El Sauzal', 'Carretera 1', '3003', '22760', '6463003003', 'planta3@labens.com', 3, 3),
(4, 'Planta Turística ROS', 'México', 'El Descanso', 'Vía Rápida', '4004', '22703', '6614004004', 'planta4@labros.com', 4, 4),
(5, 'Planta Cervecera TEC', 'México', 'La Rumorosa', 'Carretera Libre', '5005', '21410', '6655005005', 'planta5@labtec.com', 5, 5);

INSERT INTO sucursal (codigo, nombre, pais, colonia, calle, numeroD, codigo_postal, telefono, correo, cod_farmaceutica, cod_ciudad) VALUES
(1, 'Pfizer Zona Río', 'México', 'Zona Río', 'Blvd. Agua Caliente', '1101', '22010', '6641111111', 'sucursal1@pfizer.com', 1, 1),
(2, 'AstraZeneca Centro', 'México', 'Centro', 'Av. Reforma', '2202', '21000', '6862222222', 'sucursal2@astrazeneca.com', 2, 2),
(3, 'Moderna Ensenada', 'México', 'Centro', 'Av. Ruiz', '3303', '22800', '6463333333', 'sucursal3@moderna.com', 3, 3),
(4, 'J&J Rosarito', 'México', 'Benito Juárez', 'Blvd. Benito Juárez', '4404', '22700', '6614444444', 'sucursal4@jnj.com', 4, 4),
(5, 'Novavax Tecate', 'México', 'Centro', 'Av. Juárez', '5505', '21400', '6655555555', 'sucursal5@novavax.com', 5, 5);

INSERT INTO marca (codigo, nombre) VALUES
(1, 'Kenworth'),
(2, 'Freightliner'),
(3, 'International'),
(4, 'Volvo'),
(5, 'Mercedes-Benz');

INSERT INTO modelo (codigo, nombre, year, cod_marca) VALUES
(1, 'T680', 2022, 1),
(2, 'Cascadia', 2023, 2),
(3, 'LT625', 2021, 3),
(4, 'VNL860', 2023, 4),
(5, 'Actros', 2022, 5);

INSERT INTO camion (codigo, year, MMA, matricula, estado, cod_modelo, cod_marca) VALUES
(1, 2022, 38000.00, 'BC12345', 'Disponible', 1, 1),
(2, 2023, 40000.00, 'BC23456', 'En ruta', 2, 2),
(3, 2021, 36000.00, 'BC34567', 'Mantenimiento', 3, 3),
(4, 2023, 42000.00, 'BC45678', 'Disponible', 4, 4),
(5, 2022, 39000.00, 'BC56789', 'Disponible', 5, 5);

INSERT INTO conductor (numero, nombre_pila, apellidoP, apellidoM) VALUES
(2, 'María', 'Martínez', 'Sánchez'),
(3, 'Carlos', 'Rodríguez', 'Pérez'),
(4, 'Ana', 'Hernández', 'Gómez'),
(5, 'Luis', 'Díaz', 'Fernández');

INSERT INTO camion_conductor (cod_camion, num_conductor) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO envio (numero, fecha_progr, hora_salida, hora_llegada, cod_camion, cod_sucursal) VALUES
(1, '2025-04-10', '08:00:00', '10:00:00', 1, 1),
(2, '2025-04-11', '07:00:00', '12:00:00', 2, 2),
(3, '2025-04-12', '06:00:00', '08:30:00', 3, 3),
(4, '2025-04-13', '09:00:00', '10:30:00', 4, 4),
(5, '2025-04-14', '07:30:00', '11:00:00', 5, 5);

INSERT INTO estado (numero, descripcion, fecha, hora, num_envio) VALUES
(1, 'Preparando carga', '2025-04-09', '16:00:00', 1),
(2, 'En tránsito', '2025-04-10', '08:30:00', 1),
(3, 'Entregado', '2025-04-10', '10:15:00', 1),
(4, 'Retrasado por clima', '2025-04-11', '09:00:00', 2),
(5, 'En revisión aduanal', '2025-04-12', '07:30:00', 3);

INSERT INTO envio_estado (id, num_envio, num_estado, fecha) VALUES
(1, 1, 1, '2025-04-09 16:00:00'),
(2, 1, 2, '2025-04-10 08:30:00'),
(3, 1, 3, '2025-04-10 10:15:00'),
(4, 2, 4, '2025-04-11 09:00:00'),
(5, 3, 5, '2025-04-12 07:30:00');

INSERT INTO incidente (codigo, descripcion, num_envio) VALUES
(1, 'Retraso por revisión en garita', 1),
(2, 'Neblina en carretera a Mexicali', 2),
(3, 'Revisión aduanal aleatoria', 3),
(4, 'Tráfico en centro de Rosarito', 4),
(5, 'Desvío por obras en Tecate', 5);

INSERT INTO paquete (codigo, lote, temp_requerida, descripcion, vacuna, num_planta, num_envio) VALUES
(1, 'LOTE-TJ-0425', 2.50, 'Vacuna Pfizer COVID-19', 'Pfizer-BioNTech', 1, 1),
(2, 'LOTE-MXL-0425', 4.00, 'Vacuna AstraZeneca', 'AstraZeneca', 2, 2),
(3, 'LOTE-ENS-0425', 2.00, 'Vacuna Moderna', 'Moderna', 3, 3),
(4, 'LOTE-ROS-0425', 4.00, 'Vacuna J&J', 'Johnson & Johnson', 4, 4),
(5, 'LOTE-TEC-0425', 2.50, 'Vacuna Novavax', 'Novavax', 5, 5);

INSERT INTO registro_carga (codigo, carga_util, cod_camion) VALUES
(1, 12000.50, 1),
(2, 15000.75, 2),
(3, 11000.25, 3),
(4, 18000.00, 4),
(5, 13000.30, 5);

INSERT INTO registro_temperatura (numero, hora, temperatura, fecha, num_envio) VALUES
(1, '08:30:00', 2.75, '2025-04-10', 1),
(2, '09:00:00', 4.25, '2025-04-11', 2),
(3, '07:15:00', 2.50, '2025-04-12', 3),
(4, '09:30:00', 4.00, '2025-04-13', 4),
(5, '08:45:00', 2.80, '2025-04-14', 5);

INSERT INTO ruta (numero, f_salida, f_llegada, h_salida, h_llegada, num_envio, num_planta, cod_sucursal) VALUES
(1, '2025-04-10', '2025-04-10', '08:00:00', '10:00:00', 1, 1, 1),
(2, '2025-04-11', '2025-04-11', '07:00:00', '12:00:00', 2, 2, 2),
(3, '2025-04-12', '2025-04-12', '06:00:00', '08:30:00', 3, 3, 3),
(4, '2025-04-13', '2025-04-13', '09:00:00', '10:30:00', 4, 4, 4),
(5, '2025-04-14', '2025-04-14', '07:30:00', '11:00:00', 5, 5, 5);