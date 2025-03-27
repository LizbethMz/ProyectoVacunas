<?php
class Conexion
{
    public static $host = 'localhost';
    public static $dbname = 'vacunas';
    public static $username = 'root';
    public static $password = '';

    public static function get_connection()
    {
        $connection = mysqli_connect(
            self::$host,
            self::$username,
            self::$password,
            self::$dbname
        );

        if ($connection === false) {
            error_log('Error al conectar a MySQL: ' . mysqli_connect_error());
            throw new Exception('Error al conectar a la base de datos');
        }

        // Establecer charset utf8
        mysqli_set_charset($connection, 'utf8');

        return $connection;
    }

    public static function begin_transaction($connection)
    {
        if (!$connection || !($connection instanceof mysqli)) {
            error_log("Error: Conexión inválida al intentar iniciar una transacción.");
            return false;
        }
        return mysqli_begin_transaction($connection);
    }

    public static function commit_transaction($connection)
    {
        if (!$connection || !($connection instanceof mysqli)) {
            error_log("Error: Conexión inválida al intentar confirmar una transacción.");
            return false;
        }
        return mysqli_commit($connection);
    }

    public static function rollback_transaction($connection)
    {
        if (!$connection || !($connection instanceof mysqli)) {
            error_log("Error: Conexión inválida al intentar revertir una transacción.");
            return false;
        }
        return mysqli_rollback($connection);
    }

    public static function close($connection)
    {
        if ($connection && $connection instanceof mysqli) {
            mysqli_close($connection);
        }
    }
}