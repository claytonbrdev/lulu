<?php
// Configurar headers CORS e de resposta
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Tratar requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configurar exibição de erros para debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

// Função para enviar resposta JSON
function sendJsonResponse($status, $message = '', $data = null) {
    $response = ['status' => $status];
    if ($message) $response['message'] = $message;
    if ($data !== null) $response['data'] = $data;
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

// Obter o método da requisição
$method = $_SERVER['REQUEST_METHOD'];

// Obter o ID do toner da URL, se existir
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

try {
    // Conectar ao banco de dados
    $conn = getConnection();
    
    switch ($method) {
        case 'GET':
            // Listar todos os toners ou buscar um toner específico
            if ($id) {
                $stmt = $conn->prepare("SELECT * FROM toners WHERE id = ?");
                $stmt->execute([$id]);
                $toner = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($toner) {
                    sendJsonResponse('success', '', $toner);
                } else {
                    http_response_code(404);
                    sendJsonResponse('error', 'Toner não encontrado');
                }
            } else {
                $stmt = $conn->query("SELECT * FROM toners ORDER BY modelo");
                $toners = $stmt->fetchAll(PDO::FETCH_ASSOC);
                sendJsonResponse('success', '', $toners);
            }
            break;

        case 'POST':
            // Obter dados JSON do corpo da requisição
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            // Verificar se os dados foram decodificados corretamente
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                sendJsonResponse('error', 'Dados JSON inválidos: ' . json_last_error_msg());
            }
            
            // Validar campos obrigatórios
            $required_fields = ['modelo', 'capacidade', 'peso_cheio', 'peso_vazio', 'valor', 'cor', 'tipo'];
            foreach ($required_fields as $field) {
                if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                    http_response_code(400);
                    sendJsonResponse('error', "Campo obrigatório não informado: {$field}");
                }
            }
            
            // Validações de negócio
            if ($data['peso_vazio'] >= $data['peso_cheio']) {
                http_response_code(400);
                sendJsonResponse('error', 'O peso vazio deve ser menor que o peso cheio');
            }
            
            if ($data['capacidade'] <= 0) {
                http_response_code(400);
                sendJsonResponse('error', 'A capacidade deve ser maior que zero');
            }
            
            if ($data['valor'] <= 0) {
                http_response_code(400);
                sendJsonResponse('error', 'O valor deve ser maior que zero');
            }
            
            // Verificar se o modelo já existe
            $stmt = $conn->prepare("SELECT id FROM toners WHERE modelo = ?");
            $stmt->execute([$data['modelo']]);
            if ($stmt->fetch()) {
                http_response_code(400);
                sendJsonResponse('error', 'Já existe um toner com este modelo');
            }
            
            try {
                $stmt = $conn->prepare("INSERT INTO toners (modelo, capacidade, peso_cheio, peso_vazio, valor, cor, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $data['modelo'],
                    intval($data['capacidade']),
                    floatval($data['peso_cheio']),
                    floatval($data['peso_vazio']),
                    floatval($data['valor']),
                    $data['cor'],
                    $data['tipo']
                ]);
                $id = $conn->lastInsertId();
                sendJsonResponse('success', 'Toner cadastrado com sucesso', ['id' => $id]);
            } catch (PDOException $e) {
                http_response_code(500);
                sendJsonResponse('error', 'Erro ao cadastrar toner: ' . $e->getMessage());
            }
            break;

        case 'PUT':
            if (!$id) {
                http_response_code(400);
                sendJsonResponse('error', 'ID do toner não informado');
            }
            
            // Obter dados JSON do corpo da requisição
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            // Verificar se os dados foram decodificados corretamente
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                sendJsonResponse('error', 'Dados JSON inválidos: ' . json_last_error_msg());
            }
            
            // Validar campos obrigatórios
            $required_fields = ['modelo', 'capacidade', 'peso_cheio', 'peso_vazio', 'valor', 'cor', 'tipo'];
            foreach ($required_fields as $field) {
                if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                    http_response_code(400);
                    sendJsonResponse('error', "Campo obrigatório não informado: {$field}");
                }
            }
            
            // Validações de negócio
            if ($data['peso_vazio'] >= $data['peso_cheio']) {
                http_response_code(400);
                sendJsonResponse('error', 'O peso vazio deve ser menor que o peso cheio');
            }
            
            if ($data['capacidade'] <= 0) {
                http_response_code(400);
                sendJsonResponse('error', 'A capacidade deve ser maior que zero');
            }
            
            if ($data['valor'] <= 0) {
                http_response_code(400);
                sendJsonResponse('error', 'O valor deve ser maior que zero');
            }
            
            // Verificar se o modelo já existe em outro registro
            $stmt = $conn->prepare("SELECT id FROM toners WHERE modelo = ? AND id != ?");
            $stmt->execute([$data['modelo'], $id]);
            if ($stmt->fetch()) {
                http_response_code(400);
                sendJsonResponse('error', 'Já existe outro toner com este modelo');
            }
            
            try {
                $stmt = $conn->prepare("UPDATE toners SET modelo=?, capacidade=?, peso_cheio=?, peso_vazio=?, valor=?, cor=?, tipo=? WHERE id=?");
                $stmt->execute([
                    $data['modelo'],
                    intval($data['capacidade']),
                    floatval($data['peso_cheio']),
                    floatval($data['peso_vazio']),
                    floatval($data['valor']),
                    $data['cor'],
                    $data['tipo'],
                    $id
                ]);
                
                if ($stmt->rowCount() > 0) {
                    sendJsonResponse('success', 'Toner atualizado com sucesso');
                } else {
                    http_response_code(404);
                    sendJsonResponse('error', 'Toner não encontrado ou nenhuma alteração foi feita');
                }
            } catch (PDOException $e) {
                http_response_code(500);
                sendJsonResponse('error', 'Erro ao atualizar toner: ' . $e->getMessage());
            }
            break;

        case 'DELETE':
            // Excluir um toner
            if (!$id) {
                http_response_code(400);
                sendJsonResponse('error', 'ID do toner não informado');
            }
            
            try {
                $stmt = $conn->prepare("DELETE FROM toners WHERE id = ?");
                $stmt->execute([$id]);
                
                if ($stmt->rowCount() > 0) {
                    sendJsonResponse('success', 'Toner excluído com sucesso');
                } else {
                    http_response_code(404);
                    sendJsonResponse('error', 'Toner não encontrado');
                }
            } catch (PDOException $e) {
                http_response_code(500);
                sendJsonResponse('error', 'Erro ao excluir toner: ' . $e->getMessage());
            }
            break;
            
        default:
            http_response_code(405);
            sendJsonResponse('error', 'Método não permitido');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    sendJsonResponse('error', 'Erro interno do servidor: ' . $e->getMessage());
}
?>