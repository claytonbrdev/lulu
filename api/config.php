<?php
// Configurações de conexão com o banco de dados
define('DB_HOST', 'srv1940.hstgr.io');
define('DB_USER', 'u230868210_duclaza');
define('DB_PASS', 'Pandora@1989');
define('DB_NAME', 'u230868210_sgqoti');
define('DB_PORT', 3306);

// Configurações da aplicação
define('APP_NAME', 'SGQ OTI PRO');
define('APP_VERSION', '1.0.0');

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Função para conexão com o banco de dados
function getConnection() {
    try {
        $conn = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $conn->exec("SET NAMES utf8");
        return $conn;
    } catch(PDOException $e) {
        die('Erro na conexão com o banco de dados: ' . $e->getMessage());
    }
}
?>
