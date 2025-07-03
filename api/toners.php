<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Obter o método da requisição
$method = $_SERVER['REQUEST_METHOD'];

// Obter o ID do toner da URL, se existir
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

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
                echo json_encode(['status' => 'success', 'data' => $toner]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Toner não encontrado']);
            }
        } else {
            $stmt = $conn->query("SELECT * FROM toners ORDER BY modelo");
            $toners = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['status' => 'success', 'data' => $toners]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['modelo']) || empty($data['modelo'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'O modelo do toner é obrigatório']);
            exit;
        }
        try {
            $stmt = $conn->prepare("INSERT INTO toners (modelo, capacidade, peso_cheio, peso_vazio, valor, cor, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['modelo'],
                $data['capacidade'],
                $data['peso_cheio'],
                $data['peso_vazio'],
                $data['valor'],
                $data['cor'],
                $data['tipo']
            ]);
            $id = $conn->lastInsertId();
            echo json_encode(['status' => 'success', 'message' => 'Toner cadastrado com sucesso', 'id' => $id]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro ao cadastrar toner: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID do toner não informado']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $conn->prepare("UPDATE toners SET modelo=?, capacidade=?, peso_cheio=?, peso_vazio=?, valor=?, cor=?, tipo=? WHERE id=?");
            $stmt->execute([
                $data['modelo'],
                $data['capacidade'],
                $data['peso_cheio'],
                $data['peso_vazio'],
                $data['valor'],
                $data['cor'],
                $data['tipo'],
                $id
            ]);
            echo json_encode(['status' => 'success', 'message' => 'Toner atualizado com sucesso']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar toner: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Excluir um toner
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID do toner não informado']);
            exit;
        }
        
        try {
            $stmt = $conn->prepare("DELETE FROM toners WHERE id = ?");
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['status' => 'success', 'message' => 'Toner excluído com sucesso']);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Toner não encontrado']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir toner: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Método não permitido']);
}
?>
