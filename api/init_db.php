<?php
require_once 'config.php';

try {
    // Conectar ao MySQL sem selecionar um banco de dados
    $pdo = new PDO('mysql:host=' . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Criar o banco de dados se não existir
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    echo "Banco de dados criado ou já existente.<br>";
    
    // Selecionar o banco de dados
    $pdo->exec("USE " . DB_NAME);
    
    // Criação das tabelas essenciais

    // Tabela de Toners
    $toners_sql = "CREATE TABLE IF NOT EXISTS toners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        modelo VARCHAR(100) NOT NULL,
        capacidade INT NOT NULL,
        peso_cheio DECIMAL(8,2) NOT NULL,
        peso_vazio DECIMAL(8,2) NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        cor ENUM('Black','Cyan','Magenta','Yellow') NOT NULL,
        tipo ENUM('Compatível','Recondicionado','Original') NOT NULL,
        gramatura DECIMAL(8,2) GENERATED ALWAYS AS (peso_cheio - peso_vazio) STORED,
        gramatura_por_folha DECIMAL(10,6) GENERATED ALWAYS AS ((peso_cheio - peso_vazio)/capacidade) STORED,
        custo_pagina DECIMAL(10,6) GENERATED ALWAYS AS (valor/capacidade) STORED,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

    try {
        $pdo->exec($toners_sql);
        echo "Tabela 'toners' criada ou já existe.<br>";
    } catch (PDOException $e) {
        echo "Erro ao criar tabela 'toners': ", $e->getMessage(), "<br>";
    }

    // Tabela de usuários
    $pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        nivel_acesso ENUM('admin', 'gerente', 'usuario') NOT NULL DEFAULT 'usuario',
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");
    
    // Tabela de filiais
    $pdo->exec("CREATE TABLE IF NOT EXISTS filiais (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        endereco VARCHAR(255),
        cidade VARCHAR(100),
        estado CHAR(2),
        telefone VARCHAR(20),
        email VARCHAR(100),
        responsavel VARCHAR(100),
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");
    
    // Tabela de setores
    $pdo->exec("CREATE TABLE IF NOT EXISTS setores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        filial_id INT,
        responsavel VARCHAR(100),
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (filial_id) REFERENCES filiais(id) ON DELETE SET NULL
    ) ENGINE=InnoDB");
    
    // Tabela de fornecedores
    $pdo->exec("CREATE TABLE IF NOT EXISTS fornecedores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cnpj VARCHAR(20),
        endereco VARCHAR(255),
        telefone VARCHAR(20),
        email VARCHAR(100),
        contato VARCHAR(100),
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");
    
    // Tabela de toners
    $pdo->exec("CREATE TABLE IF NOT EXISTS toners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        modelo VARCHAR(100) NOT NULL,
        impressora VARCHAR(100),
        cor ENUM('preto', 'ciano', 'magenta', 'amarelo', 'colorido') NOT NULL DEFAULT 'preto',
        fornecedor_id INT,
        preco DECIMAL(10,2),
        estoque INT NOT NULL DEFAULT 0,
        estoque_minimo INT NOT NULL DEFAULT 5,
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL
    ) ENGINE=InnoDB");
    
    // Tabela de clientes
    $pdo->exec("CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cpf_cnpj VARCHAR(20),
        endereco VARCHAR(255),
        telefone VARCHAR(20),
        email VARCHAR(100),
        tipo ENUM('pessoa_fisica', 'pessoa_juridica') NOT NULL DEFAULT 'pessoa_fisica',
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");
    
    // Tabela de status de garantia
    $pdo->exec("CREATE TABLE IF NOT EXISTS status_garantia (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        descricao TEXT,
        cor VARCHAR(20) NOT NULL DEFAULT '#777777',
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");
    
    echo "Todas as tabelas foram criadas com sucesso!";
    
} catch(PDOException $e) {
    die("Erro: " . $e->getMessage());
}
?>
