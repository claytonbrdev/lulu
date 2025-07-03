<?php
require_once 'config.php';

try {
    $conn = getConnection();
    
    echo "<h2>Verificação da Tabela Toners</h2>";
    
    // Verificar se a tabela existe
    $stmt = $conn->prepare("SHOW TABLES LIKE 'toners'");
    $stmt->execute();
    $tableExists = $stmt->fetch();
    
    if (!$tableExists) {
        echo "<p style='color: red;'>❌ A tabela 'toners' NÃO existe no banco de dados.</p>";
        echo "<p>Criando a tabela...</p>";
        
        // Criar a tabela toners
        $createTableSQL = "
        CREATE TABLE IF NOT EXISTS toners (
            id INT AUTO_INCREMENT PRIMARY KEY,
            modelo VARCHAR(100) NOT NULL UNIQUE,
            capacidade INT NOT NULL,
            peso_cheio DECIMAL(8,2) NOT NULL,
            peso_vazio DECIMAL(8,2) NOT NULL,
            valor DECIMAL(10,2) NOT NULL,
            cor ENUM('Black','Cyan','Magenta','Yellow') NOT NULL,
            tipo ENUM('Compatível','Recondicionado','Original') NOT NULL,
            gramatura DECIMAL(8,2) GENERATED ALWAYS AS (peso_cheio - peso_vazio) STORED,
            gramatura_por_folha DECIMAL(10,6) GENERATED ALWAYS AS ((peso_cheio - peso_vazio)/capacidade) STORED,
            custo_pagina DECIMAL(10,6) GENERATED ALWAYS AS (valor/capacidade) STORED,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        
        $conn->exec($createTableSQL);
        echo "<p style='color: green;'>✅ Tabela 'toners' criada com sucesso!</p>";
        
        // Inserir alguns dados de exemplo
        $insertExampleSQL = "
        INSERT INTO toners (modelo, capacidade, peso_cheio, peso_vazio, valor, cor, tipo) VALUES
        ('MLT-D101S', 1500, 850.50, 150.30, 89.90, 'Black', 'Compatível'),
        ('CLT-C406S', 1000, 420.80, 80.20, 65.50, 'Cyan', 'Original'),
        ('CLT-M406S', 1000, 425.60, 82.40, 67.80, 'Magenta', 'Original'),
        ('CLT-Y406S', 1000, 418.90, 79.10, 64.90, 'Yellow', 'Original');
        ";
        
        try {
            $conn->exec($insertExampleSQL);
            echo "<p style='color: blue;'>📝 Dados de exemplo inseridos com sucesso!</p>";
        } catch (PDOException $e) {
            echo "<p style='color: orange;'>⚠️ Aviso: Não foi possível inserir dados de exemplo: " . $e->getMessage() . "</p>";
        }
        
    } else {
        echo "<p style='color: green;'>✅ A tabela 'toners' existe no banco de dados.</p>";
        
        // Mostrar estrutura da tabela
        echo "<h3>Estrutura da Tabela:</h3>";
        $stmt = $conn->prepare("DESCRIBE toners");
        $stmt->execute();
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>";
        echo "<tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Chave</th><th>Padrão</th><th>Extra</th></tr>";
        foreach ($columns as $col) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($col['Field']) . "</td>";
            echo "<td>" . htmlspecialchars($col['Type']) . "</td>";
            echo "<td>" . htmlspecialchars($col['Null']) . "</td>";
            echo "<td>" . htmlspecialchars($col['Key']) . "</td>";
            echo "<td>" . htmlspecialchars($col['Default']) . "</td>";
            echo "<td>" . htmlspecialchars($col['Extra']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Contar registros
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM toners");
        $stmt->execute();
        $count = $stmt->fetch();
        echo "<p>Total de registros na tabela: <strong>" . $count['total'] . "</strong></p>";
        
        // Mostrar alguns registros
        if ($count['total'] > 0) {
            echo "<h3>Primeiros 5 registros:</h3>";
            $stmt = $conn->prepare("SELECT * FROM toners LIMIT 5");
            $stmt->execute();
            $toners = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>";
            echo "<tr><th>ID</th><th>Modelo</th><th>Capacidade</th><th>Peso Cheio</th><th>Peso Vazio</th><th>Valor</th><th>Cor</th><th>Tipo</th></tr>";
            foreach ($toners as $toner) {
                echo "<tr>";
                echo "<td>" . $toner['id'] . "</td>";
                echo "<td>" . htmlspecialchars($toner['modelo']) . "</td>";
                echo "<td>" . $toner['capacidade'] . "</td>";
                echo "<td>" . $toner['peso_cheio'] . "</td>";
                echo "<td>" . $toner['peso_vazio'] . "</td>";
                echo "<td>" . $toner['valor'] . "</td>";
                echo "<td>" . $toner['cor'] . "</td>";
                echo "<td>" . $toner['tipo'] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    }
    
    echo "<h3>Teste de Conexão com a API:</h3>";
    echo "<p>Testando endpoint GET /api/toners.php...</p>";
    
    // Testar a API diretamente
    $stmt = $conn->prepare("SELECT * FROM toners LIMIT 3");
    $stmt->execute();
    $testToners = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($testToners) {
        echo "<p style='color: green;'>✅ Consulta SQL funcionando corretamente!</p>";
        echo "<pre>" . json_encode($testToners, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
    } else {
        echo "<p style='color: orange;'>⚠️ Tabela existe mas não há dados para testar.</p>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Erro de conexão com o banco de dados: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Erro geral: " . $e->getMessage() . "</p>";
}
?>