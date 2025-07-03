// Funções de configuração dos formulários e grids dos cadastros

// --- TONERS ---
function configurarCadastroToners() {
  // Cabeçalho da tabela
  const cabecalho = [
    'ID',
    'Modelo',
    'Capacidade de Folhas',
    'Peso Cheio (g)',
    'Peso Vazio (g)',
    'Gramatura (g)',
    'Gramatura/Folha (g)',
    'Valor do Toner (R$)',
    'Custo Página (R$)',
    'Cor',
    'Tipo',
    'Ações'
  ];
  document.getElementById('cabecalho-toners').innerHTML = cabecalho.map(col => `<th>${col}</th>`).join('');

  // Função para renderizar a tabela de toners
  function renderTabelaToners(toners) {
    const tbody = document.getElementById('corpo-toners');
    if (!toners || toners.length === 0) {
      tbody.innerHTML = '<tr><td colspan="12" class="text-center">Nenhum toner cadastrado</td></tr>';
      return;
    }
    
    tbody.innerHTML = toners.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.modelo}</td>
        <td>${t.capacidade}</td>
        <td>${parseFloat(t.peso_cheio).toFixed(2)}</td>
        <td>${parseFloat(t.peso_vazio).toFixed(2)}</td>
        <td>${(parseFloat(t.peso_cheio) - parseFloat(t.peso_vazio)).toFixed(2)}</td>
        <td>${((parseFloat(t.peso_cheio) - parseFloat(t.peso_vazio))/parseInt(t.capacidade)).toFixed(4)}</td>
        <td>R$ ${parseFloat(t.valor).toFixed(2)}</td>
        <td>R$ ${(parseFloat(t.valor)/parseInt(t.capacidade)).toFixed(4)}</td>
        <td><span class="badge bg-secondary">${t.cor}</span></td>
        <td><span class="badge bg-info">${t.tipo}</span></td>
        <td>
          <button class="btn btn-outline-primary btn-sm me-1 btn-editar-toner" data-id="${t.id}" title="Editar">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm btn-excluir-toner" data-id="${t.id}" title="Excluir">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Buscar toners do backend PHP
  function carregarToners() {
    console.log('Carregando toners do backend...');
    
    fetch('/api/toners.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      console.log('Dados recebidos:', json);
      if (json.status === 'success') {
        renderTabelaToners(json.data);
        document.getElementById('total-registros').textContent = json.data.length;
        document.getElementById('registros-exibidos').textContent = json.data.length;
      } else {
        console.error('Erro na resposta:', json.message);
        renderTabelaToners([]);
      }
    })
    .catch(error => {
      console.error('Erro ao carregar toners:', error);
      renderTabelaToners([]);
      Swal.fire('Erro', 'Erro ao carregar dados dos toners', 'error');
    });
  }

  // Carregar toners ao inicializar
  carregarToners();

  // Variável para controlar edição
  let editandoId = null;

  // Configurar o formulário no modal
  document.getElementById('form-toners').innerHTML = `
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Modelo *</label>
        <input type="text" class="form-control" id="toner-modelo" required>
        <div class="invalid-feedback">Por favor, informe o modelo do toner.</div>
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Capacidade de Folhas *</label>
        <input type="number" class="form-control" id="toner-capacidade" min="1" required>
        <div class="invalid-feedback">Por favor, informe a capacidade.</div>
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Valor do Toner (R$) *</label>
        <input type="number" step="0.01" class="form-control" id="toner-valor" min="0" required>
        <div class="invalid-feedback">Por favor, informe o valor.</div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 mb-3">
        <label class="form-label">Peso Cheio (g) *</label>
        <input type="number" step="0.01" class="form-control" id="toner-cheio" min="0" required>
        <div class="invalid-feedback">Por favor, informe o peso cheio.</div>
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Peso Vazio (g) *</label>
        <input type="number" step="0.01" class="form-control" id="toner-vazio" min="0" required>
        <div class="invalid-feedback">Por favor, informe o peso vazio.</div>
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Cor *</label>
        <select class="form-select" id="toner-cor" required>
          <option value="">Selecione a cor</option>
          <option value="Black">Black</option>
          <option value="Cyan">Cyan</option>
          <option value="Magenta">Magenta</option>
          <option value="Yellow">Yellow</option>
        </select>
        <div class="invalid-feedback">Por favor, selecione a cor.</div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Tipo *</label>
        <select class="form-select" id="toner-tipo" required>
          <option value="">Selecione o tipo</option>
          <option value="Compatível">Compatível</option>
          <option value="Recondicionado">Recondicionado</option>
          <option value="Original">Original</option>
        </select>
        <div class="invalid-feedback">Por favor, selecione o tipo.</div>
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Gramatura do Toner (g)</label>
        <input type="number" step="0.01" class="form-control bg-light" id="toner-gramatura" readonly>
        <small class="text-muted">Calculado automaticamente</small>
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Gramatura por folha (g)</label>
        <input type="number" step="0.01" class="form-control bg-light" id="toner-gramatura-folha" readonly>
        <small class="text-muted">Calculado automaticamente</small>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Custo Página do Toner (R$)</label>
        <input type="number" step="0.01" class="form-control bg-light" id="toner-custo-pagina" readonly>
        <small class="text-muted">Calculado automaticamente</small>
      </div>
    </div>
  `;

  // Configurar cálculos automáticos
  function configurarCalculosAutomaticos() {
    const capacidade = document.getElementById('toner-capacidade');
    const cheio = document.getElementById('toner-cheio');
    const vazio = document.getElementById('toner-vazio');
    const valor = document.getElementById('toner-valor');
    const gramatura = document.getElementById('toner-gramatura');
    const gramaturaFolha = document.getElementById('toner-gramatura-folha');
    const custoPagina = document.getElementById('toner-custo-pagina');

    function atualizarCamposCalculados() {
      const cap = parseFloat(capacidade.value) || 0;
      const ch = parseFloat(cheio.value) || 0;
      const vz = parseFloat(vazio.value) || 0;
      const vl = parseFloat(valor.value) || 0;
      const gr = ch - vz;
      
      gramatura.value = gr > 0 ? gr.toFixed(2) : '';
      gramaturaFolha.value = (gr > 0 && cap > 0) ? (gr / cap).toFixed(4) : '';
      custoPagina.value = (vl > 0 && cap > 0) ? (vl / cap).toFixed(4) : '';
    }

    [capacidade, cheio, vazio, valor].forEach(el => {
      el.addEventListener('input', atualizarCamposCalculados);
      el.addEventListener('change', atualizarCamposCalculados);
    });

    // Calcular inicialmente se há valores
    atualizarCamposCalculados();
  }

  // Configurar cálculos automáticos
  configurarCalculosAutomaticos();

  // Função para salvar toner (criar ou editar)
  function salvarToner() {
    const form = document.getElementById('form-toners');
    
    // Validar campos obrigatórios
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Coletar dados do formulário
    const dados = {
      modelo: document.getElementById('toner-modelo').value.trim(),
      capacidade: parseInt(document.getElementById('toner-capacidade').value),
      peso_cheio: parseFloat(document.getElementById('toner-cheio').value),
      peso_vazio: parseFloat(document.getElementById('toner-vazio').value),
      valor: parseFloat(document.getElementById('toner-valor').value),
      cor: document.getElementById('toner-cor').value,
      tipo: document.getElementById('toner-tipo').value
    };

    // Validações adicionais
    if (dados.peso_vazio >= dados.peso_cheio) {
      Swal.fire('Erro', 'O peso vazio deve ser menor que o peso cheio', 'error');
      return;
    }

    console.log('Dados a serem enviados:', dados);

    const url = editandoId ? `/api/toners.php?id=${editandoId}` : '/api/toners.php';
    const method = editandoId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(dados)
    })
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      console.log('Resposta do servidor:', json);
      if (json.status === 'success') {
        carregarToners();
        form.reset();
        form.classList.remove('was-validated');
        editandoId = null;
        document.getElementById('modal-title-toners').textContent = 'Novo Toner';
        bootstrap.Modal.getInstance(document.getElementById('modal-cadastro-toners')).hide();
        
        const mensagem = editandoId ? 'Toner atualizado com sucesso!' : 'Toner cadastrado com sucesso!';
        Swal.fire('Sucesso', mensagem, 'success');
      } else {
        Swal.fire('Erro', json.message || 'Erro ao salvar toner', 'error');
      }
    })
    .catch(error => {
      console.error('Erro ao salvar toner:', error);
      Swal.fire('Erro', 'Erro de comunicação com o servidor', 'error');
    });
  }

  // Configurar evento do botão salvar no modal
  document.getElementById('btn-salvar-toners').addEventListener('click', salvarToner);

  // Configurar evento do botão novo
  document.getElementById('btn-novo-cadastro').addEventListener('click', function() {
    editandoId = null;
    const form = document.getElementById('form-toners');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('modal-title-toners').textContent = 'Novo Toner';
    configurarCalculosAutomaticos(); // Reconfigurar após reset
    const modal = new bootstrap.Modal(document.getElementById('modal-cadastro-toners'));
    modal.show();
  });

  // Delegação para editar/excluir
  document.getElementById('corpo-toners').addEventListener('click', function(e) {
    if (e.target.closest('.btn-excluir-toner')) {
      const id = e.target.closest('.btn-excluir-toner').dataset.id;
      Swal.fire({
        title: 'Confirmar Exclusão',
        text: 'Deseja realmente excluir este toner?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/api/toners.php?id=${id}`, { 
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(json => {
            if (json.status === 'success') {
              carregarToners();
              Swal.fire('Excluído', 'Toner removido com sucesso!', 'success');
            } else {
              Swal.fire('Erro', json.message || 'Erro ao excluir toner', 'error');
            }
          })
          .catch(error => {
            console.error('Erro ao excluir toner:', error);
            Swal.fire('Erro', 'Erro de comunicação com o servidor', 'error');
          });
        }
      });
    }
    
    if (e.target.closest('.btn-editar-toner')) {
      const id = e.target.closest('.btn-editar-toner').dataset.id;
      
      fetch(`/api/toners.php?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        if (json.status === 'success') {
          const t = json.data;
          document.getElementById('toner-modelo').value = t.modelo;
          document.getElementById('toner-capacidade').value = t.capacidade;
          document.getElementById('toner-cheio').value = t.peso_cheio;
          document.getElementById('toner-vazio').value = t.peso_vazio;
          document.getElementById('toner-valor').value = t.valor;
          document.getElementById('toner-cor').value = t.cor;
          document.getElementById('toner-tipo').value = t.tipo;
          
          editandoId = id;
          document.getElementById('modal-title-toners').textContent = 'Editar Toner';
          configurarCalculosAutomaticos(); // Reconfigurar para o modo edição
          
          const modal = new bootstrap.Modal(document.getElementById('modal-cadastro-toners'));
          modal.show();
        } else {
          Swal.fire('Erro', 'Toner não encontrado', 'error');
        }
      })
      .catch(error => {
        console.error('Erro ao carregar dados do toner:', error);
        Swal.fire('Erro', 'Erro de comunicação com o servidor', 'error');
      });
    }
  });

  // Filtro de colunas
  const colunasFiltro = [
    {nome: 'Modelo', valor: 'modelo'},
    {nome: 'Capacidade de Folhas', valor: 'capacidade'},
    {nome: 'Cor', valor: 'cor'},
    {nome: 'Tipo', valor: 'tipo'}
  ];
  document.getElementById('filtro-colunas').innerHTML = colunasFiltro.map(c => 
    `<li><a class="dropdown-item" href="#" data-col="${c.valor}">${c.nome}</a></li>`
  ).join('');
}

// --- FORNECEDORES ---
function configurarCadastroFornecedores() {
  const cabecalho = [
    'ID',
    'Nome',
    'Link do RMA',
    'Contato',
    'Observação',
    'Ações'
  ];
  document.getElementById('cabecalho-fornecedores').innerHTML = cabecalho.map(col => `<th>${col}</th>`).join('');
  
  // Corpo exemplo
  document.getElementById('corpo-fornecedores').innerHTML = `
    <tr>
      <td>1</td>
      <td>Fornecedor Exemplo</td>
      <td><a href="#" target="_blank">https://rma.exemplo.com</a></td>
      <td>(99) 99999-9999</td>
      <td>Fornecedor confiável</td>
      <td>
        <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `;
  
  // Filtro
  document.getElementById('filtro-colunas').innerHTML = [
    '<li><a class="dropdown-item" href="#" data-col="nome">Nome</a></li>',
    '<li><a class="dropdown-item" href="#" data-col="contato">Contato</a></li>'
  ].join('');
  
  // Formulário/modal
  document.getElementById('form-fornecedores').innerHTML = `
    <div class="mb-3">
      <label class="form-label">Nome</label>
      <input type="text" class="form-control" id="fornecedor-nome" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Link do RMA</label>
      <input type="url" class="form-control" id="fornecedor-rma">
    </div>
    <div class="mb-3">
      <label class="form-label">Contato</label>
      <input type="text" class="form-control" id="fornecedor-contato">
    </div>
    <div class="mb-3">
      <label class="form-label">Observação</label>
      <textarea class="form-control" id="fornecedor-observacao"></textarea>
    </div>
  `;
}

// Outras funções de cadastro podem ser implementadas seguindo o mesmo padrão

// Garantir funções globais
window.configurarCadastroToners = configurarCadastroToners;
window.configurarCadastroFornecedores = configurarCadastroFornecedores;