<?php
require_once 'config.php';

try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Erro de conexão: " . $e->getMessage());
}

$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

if (!$tables) {
    echo "Nenhuma tabela encontrada no banco de dados.";
    exit;
}

echo "<h2>Tabelas no banco de dados: <code>" . DB_NAME . "</code></h2>";
foreach ($tables as $table) {
    echo "<h3>Tabela: <code>$table</code></h3>";
    $columns = $pdo->query("SHOW FULL COLUMNS FROM `$table`")->fetchAll(PDO::FETCH_ASSOC);
    echo "<table border='1' cellpadding='4' cellspacing='0' style='border-collapse:collapse;'>";
    echo "<tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Chave</th><th>Default</th><th>Extra</th><th>Comentário</th></tr>";
    foreach ($columns as $col) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($col['Field']) . "</td>";
        echo "<td>" . htmlspecialchars($col['Type']) . "</td>";
        echo "<td>" . htmlspecialchars($col['Null']) . "</td>";
        echo "<td>" . htmlspecialchars($col['Key']) . "</td>";
        echo "<td>" . htmlspecialchars($col['Default']) . "</td>";
        echo "<td>" . htmlspecialchars($col['Extra']) . "</td>";
        echo "<td>" . htmlspecialchars($col['Comment']) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
}
