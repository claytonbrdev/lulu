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

  // Função para renderizar o formulário dentro do modal (apenas o conteúdo, não o <form> inteiro)
  window.renderFormTonersModal = function() {
    const formFields = `
        <div class="row">
          <div class="col-md-6 mb-3">
            <label>Modelo</label>
            <input type="text" class="form-control" id="toner-modelo" required>
          </div>
          <div class="col-md-3 mb-3">
            <label>Capacidade de Folhas</label>
            <input type="number" class="form-control" id="toner-capacidade" required>
          </div>
          <div class="col-md-3 mb-3">
            <label>Valor do Toner (R$)</label>
            <input type="number" step="0.01" class="form-control" id="toner-valor" required>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-3">
            <label>Peso Cheio (g)</label>
            <input type="number" class="form-control" id="toner-cheio" required>
          </div>
          <div class="col-md-4 mb-3">
            <label>Peso Vazio (g)</label>
            <input type="number" class="form-control" id="toner-vazio" required>
          </div>
          <div class="col-md-4 mb-3">
            <label>Cor</label>
            <select class="form-select" id="toner-cor" required>
              <option value="">Selecione</option>
              <option>Black</option>
              <option>Cyan</option>
              <option>Magenta</option>
              <option>Yellow</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label>Tipo</label>
            <select class="form-select" id="toner-tipo" required>
              <option value="">Selecione</option>
              <option>Compatível</option>
              <option>Recondicionado</option>
              <option>Original</option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <label>Gramatura do Toner (g)</label>
            <input type="number" class="form-control" id="toner-gramatura" readonly>
          </div>
          <div class="col-md-3 mb-3">
            <label>Gramatura por folha (g)</label>
            <input type="number" class="form-control" id="toner-gramatura-folha" readonly>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-3">
            <label>Custo Página do Toner (R$)</label>
            <input type="number" class="form-control" id="toner-custo-pagina" readonly>
          </div>
          <div class="col-md-8 mb-3 d-flex align-items-end justify-content-end">
            <button type="submit" class="btn btn-success px-5">Salvar</button>
          </div>
        </div>
    `;
    document.getElementById('form-toners').innerHTML = formFields;
  }

  // Função para renderizar a tabela de toners
  function renderTabelaToners(toners) {
    document.getElementById('corpo-toners').innerHTML = toners.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.modelo}</td>
        <td>${t.capacidade}</td>
        <td>${t.peso_cheio}</td>
        <td>${t.peso_vazio}</td>
        <td>${(t.peso_cheio-t.peso_vazio)}</td>
        <td>${((t.peso_cheio-t.peso_vazio)/t.capacidade).toFixed(3)}</td>
        <td>${parseFloat(t.valor).toFixed(2)}</td>
        <td>${(parseFloat(t.valor)/t.capacidade).toFixed(4)}</td>
        <td>${t.cor}</td>
        <td>${t.tipo}</td>
        <td>
          <button class="btn btn-outline-primary btn-sm me-1 btn-editar-toner" data-id="${t.id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn btn-outline-danger btn-sm btn-excluir-toner" data-id="${t.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  }

  // Buscar toners do backend
  function carregarToners() {
    fetch('api/toners.php')
      .then(r => r.json())
      .then(json => {
        if (json.status === 'success') {
          renderTabelaToners(json.data);
        } else {
          renderTabelaToners([]);
        }
      })
      .catch(() => renderTabelaToners([]));
  }
  carregarToners();

  // Evento para abrir o modal e renderizar o formulário corretamente
  const btnNovo = document.getElementById('btn-novo-cadastro');
  if(btnNovo) {
    btnNovo.addEventListener('click', () => {
      // O modal já existe, apenas renderize o conteúdo do formulário
      window.renderFormTonersModal();
      let formEl = document.getElementById('form-toners');
      if(formEl) {
        // Cálculos automáticos
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
          gramatura.value = gr > 0 ? gr : '';
          gramaturaFolha.value = (gr > 0 && cap > 0) ? (gr / cap).toFixed(4) : '';
          custoPagina.value = (vl > 0 && cap > 0) ? (vl / cap).toFixed(4) : '';
        }
        [capacidade, cheio, vazio, valor].forEach(el => el.addEventListener('input', atualizarCamposCalculados));
        formEl.onsubmit = function(e) {
          e.preventDefault();
          const modelo = document.getElementById('toner-modelo').value;
          const capacidadeVal = capacidade.value;
          const peso_cheio = cheio.value;
          const peso_vazio = vazio.value;
          const valorVal = valor.value;
          const cor = document.getElementById('toner-cor').value;
          const tipo = document.getElementById('toner-tipo').value;
          fetch('api/toners.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modelo, capacidade: capacidadeVal, peso_cheio, peso_vazio, valor: valorVal, cor, tipo })
          })
          .then(r => r.json())
          .then(json => {
            if (json.status === 'success') {
              carregarToners();
              formEl.reset();
              Swal.fire('Sucesso', 'Toner cadastrado!', 'success');
            } else {
              Swal.fire('Erro', json.message || 'Erro ao cadastrar', 'error');
            }
          })
          .catch(() => Swal.fire('Erro', 'Erro ao cadastrar', 'error'));
        };
      }
    });
  }

  // Variável para controlar edição
  let editandoId = null;

  // Delegação para editar/excluir
  document.getElementById('corpo-toners').onclick = function(e) {
    if (e.target.closest('.btn-excluir-toner')) {
      const id = e.target.closest('.btn-excluir-toner').dataset.id;
      Swal.fire({
        title: 'Excluir?',
        text: 'Deseja realmente excluir este toner?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          fetch('api/toners.php?id=' + id, { method: 'DELETE' })
            .then(r => r.json())
            .then(json => {
              if (json.status === 'success') {
                carregarToners();
                Swal.fire('Excluído', 'Toner removido!', 'success');
              } else {
                Swal.fire('Erro', json.message || 'Erro ao excluir', 'error');
              }
            })
            .catch(() => Swal.fire('Erro', 'Erro ao excluir', 'error'));
        }
      });
    }
    if (e.target.closest('.btn-editar-toner')) {
      const id = e.target.closest('.btn-editar-toner').dataset.id;
      fetch('api/toners.php?id=' + id)
        .then(r => r.json())
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
            Swal.fire('Modo edição', 'Agora você pode editar o toner. Salve para atualizar.', 'info');
          } else {
            Swal.fire('Erro', 'Toner não encontrado', 'error');
          }
        });
    }
  };

  // Filtro de colunas
  const colunasFiltro = [
    {nome: 'Modelo', valor: 'modelo'},
    {nome: 'Capacidade de Folhas', valor: 'capacidade'},
    {nome: 'Cor', valor: 'cor'},
    {nome: 'Tipo', valor: 'tipo'}
  ];
  document.getElementById('filtro-colunas').innerHTML = colunasFiltro.map(c => `<li><a class="dropdown-item" href="#" data-col="${c.valor}">${c.nome}</a></li>`).join('');

  // Formulário/modal
  document.getElementById('form-toners').outerHTML = `
    <form id="form-toners" autocomplete="off">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label>Modelo</label>
          <input type="text" class="form-control" id="toner-modelo" required>
        </div>
        <div class="col-md-3 mb-3">
          <label>Capacidade de Folhas</label>
          <input type="number" class="form-control" id="toner-capacidade" required>
        </div>
        <div class="col-md-3 mb-3">
          <label>Valor do Toner (R$)</label>
          <input type="number" step="0.01" class="form-control" id="toner-valor" required>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label>Peso Cheio (g)</label>
          <input type="number" class="form-control" id="toner-cheio" required>
        </div>
        <div class="col-md-4 mb-3">
          <label>Peso Vazio (g)</label>
          <input type="number" class="form-control" id="toner-vazio" required>
        </div>
        <div class="col-md-4 mb-3">
          <label>Cor</label>
          <select class="form-select" id="toner-cor" required>
            <option value="">Selecione</option>
            <option>Black</option>
            <option>Cyan</option>
            <option>Magenta</option>
            <option>Yellow</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label>Tipo</label>
          <select class="form-select" id="toner-tipo" required>
            <option value="">Selecione</option>
            <option>Compatível</option>
            <option>Recondicionado</option>
            <option>Original</option>
          </select>
        </div>
        <div class="col-md-3 mb-3">
          <label>Gramatura do Toner (g)</label>
          <input type="number" class="form-control" id="toner-gramatura" readonly>
        </div>
        <div class="col-md-3 mb-3">
          <label>Gramatura por folha (g)</label>
          <input type="number" class="form-control" id="toner-gramatura-folha" readonly>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label>Custo Página do Toner (R$)</label>
          <input type="number" class="form-control" id="toner-custo-pagina" readonly>
        </div>
        <div class="col-md-8 mb-3 d-flex align-items-end justify-content-end">
          <button type="submit" class="btn btn-success px-5">Salvar</button>
        </div>
      </div>
    </form>
  `;
  
  // Corrigir escopo: formEl declarado fora, aqui só reatribui
  let formEl = document.getElementById('form-toners');
  
  // Reatribuir evento de submit após recriar o formulário
  formEl.onsubmit = function(e) {
    e.preventDefault();
    const modelo = document.getElementById('toner-modelo').value;
    const capacidade = document.getElementById('toner-capacidade').value;
    const peso_cheio = document.getElementById('toner-cheio').value;
    const peso_vazio = document.getElementById('toner-vazio').value;
    const valor = document.getElementById('toner-valor').value;
    const cor = document.getElementById('toner-cor').value;
    const tipo = document.getElementById('toner-tipo').value;
    if (editandoId) {
      // Editar
      fetch('api/toners.php?id=' + editandoId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelo, capacidade, peso_cheio, peso_vazio, valor, cor, tipo })
      })
      .then(r => r.json())
      .then(json => {
        if (json.status === 'success') {
          carregarToners();
          formEl.reset();
          editandoId = null;
          Swal.fire('Sucesso', 'Toner atualizado!', 'success');
        } else {
          Swal.fire('Erro', json.message || 'Erro ao atualizar', 'error');
        }
      })
      .catch(() => Swal.fire('Erro', 'Erro ao atualizar', 'error'));
    } else {
      // Cadastrar novo
      fetch('api/toners.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelo, capacidade, peso_cheio, peso_vazio, valor, cor, tipo })
      })
      .then(r => r.json())
      .then(json => {
        if (json.status === 'success') {
          carregarToners();
          formEl.reset();
          Swal.fire('Sucesso', 'Toner cadastrado!', 'success');
        } else {
          Swal.fire('Erro', json.message || 'Erro ao cadastrar', 'error');
        }
      })
      .catch(() => Swal.fire('Erro', 'Erro ao cadastrar', 'error'));
    }
  };

  // Cálculos automáticos
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
    gramatura.value = gr > 0 ? gr : '';
    gramaturaFolha.value = (gr > 0 && cap > 0) ? (gr / cap).toFixed(4) : '';
    custoPagina.value = (vl > 0 && cap > 0) ? (vl / cap).toFixed(4) : '';
  }
  [capacidade, cheio, vazio, valor].forEach(el => el.addEventListener('input', atualizarCamposCalculados));
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
      <label>Nome</label>
      <input type="text" class="form-control" id="fornecedor-nome" required>
    </div>
    <div class="mb-3">
      <label>Link do RMA</label>
      <input type="url" class="form-control" id="fornecedor-rma">
    </div>
    <div class="mb-3">
      <label>Contato</label>
      <input type="text" class="form-control" id="fornecedor-contato">
    </div>
    <div class="mb-3">
      <label>Observação</label>
      <textarea class="form-control" id="fornecedor-observacao"></textarea>
    </div>
  `;
}

// Outras funções de cadastro (filiais, setores, clientes, etc) podem ser implementadas seguindo o mesmo padrão acima.

// Garantir funções globais
window.configurarCadastroToners = configurarCadastroToners;
window.configurarCadastroFornecedores = configurarCadastroFornecedores;