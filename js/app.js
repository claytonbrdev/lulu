// app.js - SPA Navigation for SGQ OTI PRO

// SPA navigation: only dashboard is available
var spaContent;
document.addEventListener('DOMContentLoaded', function () {
  spaContent = document.getElementById('spa-content');

  // Render página de boas-vindas
  function renderHome() {
    spaContent.innerHTML = `
      <div class="welcome-page d-flex justify-content-center align-items-center" style="min-height: 100vh; width: 100%; background: linear-gradient(135deg, #052659 0%, #1B3B6F 60%, #34A0A4 100%);">
        <div class="welcome-card text-center p-5 shadow-lg" style="background: #fff; border-radius: 24px; max-width: 480px; width: 95vw; margin: 0 auto;" data-aos="zoom-in">
          <div class="welcome-icon mb-4" data-aos="fade-up" data-aos-delay="100">
            <i class="fas fa-hand-peace fa-4x" style="color: #27AE60;"></i>
          </div>
          <h1 class="mb-3 fw-bold" style="color: #052659; letter-spacing: -1px;" data-aos="fade-up" data-aos-delay="200">Bem-vindo ao <span style="color:#1B3B6F">SGQ OTI</span></h1>
          <div class="alert alert-primary d-inline-block mb-4" style="background: linear-gradient(90deg,#052659,#1B3B6F); color: #fff; border: none;" data-aos="fade-up" data-aos-delay="300">
            Seu sistema integrado de gestão da qualidade.
          </div>
          <ul class="list-unstyled mb-4 text-start mx-auto" style="max-width:340px;" data-aos="fade-up" data-aos-delay="400">
            <li class="mb-2"><span class="badge rounded-pill bg-success me-2"><i class="fas fa-check"></i></span> Navegação rápida e intuitiva</li>
            <li class="mb-2"><span class="badge rounded-pill bg-success me-2"><i class="fas fa-check"></i></span> Indicadores visuais no Dashboard</li>
            <li class="mb-2"><span class="badge rounded-pill bg-success me-2"><i class="fas fa-check"></i></span> Gestão de toners, clientes e muito mais</li>
          </ul>
          <button id="btnAcessarDashboard" class="btn btn-lg btn-gradient-primary w-100 mt-2" style="background: linear-gradient(90deg, #052659 0%, #1B3B6F 100%); color: #fff; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 8px rgba(27,59,111,0.10); transition: background 0.2s;" data-aos="fade-up" data-aos-delay="500">Acessar Dashboard <i class="fas fa-arrow-right ms-2"></i></button>
        </div>
      </div>
    `;
    // Botão de acesso rápido ao dashboard
    setTimeout(() => {
      const btn = document.getElementById('btnAcessarDashboard');
      if (btn) {
        btn.onclick = function() {
          // Ativa menu dashboard e renderiza
          document.querySelectorAll('.sidebar a[data-page]').forEach(l => l.classList.remove('active'));
          const dash = document.querySelector('.sidebar a[data-page=\"dashboard\"]');
          if (dash) dash.classList.add('active');
          renderDashboard();
        };
      }
    }, 100);
    // Exemplo de SweetAlert2 (descomente para testar)
    // Swal.fire({
    //   title: 'Bem-vindo!',
    //   text: 'Esta é uma notificação elegante com SweetAlert2.',
    //   icon: 'success',
    //   confirmButtonColor: '#052659',
    // });
  }

  // Render dashboard (default and only page)
  function renderDashboard() {
    spaContent.innerHTML = `
      <div class="dashboard-container" style="padding: 30px; width: 100%;">
        <div class="header mb-4">
          <h2 class="text-white">Dashboard</h2>
          <button class="btn btn-light"><i class="fas fa-sign-out-alt"></i> Sair</button>
        </div>
        <div class="row mb-4">
          <div class="col-md-6 mb-4"><div class="card p-3 shadow-sm"><h5>Gráfico de Auditorias</h5><canvas id="chartAuditorias"></canvas></div></div>
          <div class="col-md-6 mb-4"><div class="card p-3 shadow-sm"><h5>Gráfico de Retornos</h5><canvas id="chartRetornos"></canvas></div></div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6 mb-4"><div class="card p-3 shadow-sm"><h5>Garantias por Status</h5><canvas id="chartGarantias"></canvas></div></div>
          <div class="col-md-6 mb-4"><div class="card p-3 shadow-sm"><h5>Documentos Ativos</h5><canvas id="chartDocumentos"></canvas></div></div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6 mb-4"><div class="card p-3 shadow-sm"><h5>Garantias por Fornecedor</h5><canvas id="chartGarantiasFornecedor"></canvas></div></div>
          <div class="col-md-6 mb-4"><div class="card p-3 shadow-sm"><h5>Toners Recuperados por Mês</h5><canvas id="chartTonersRecuperados"></canvas></div></div>
        </div>
      </div>
    `;
    // Re-inicializar os gráficos
    if (window.initDashboardCharts) {
      window.initDashboardCharts();
    }
  }

  // Inicializa a página inicial
  renderHome();
  
  // Marca o item 'Início' como ativo inicialmente
  setActiveMenuItem('home');

  // Função para delegar navegação SPA para todos os elementos com data-page
  function delegarNavegacaoSPA(e) {
    const target = e.target.closest('[data-page]');
    if (target) {
      e.preventDefault();
      const page = target.getAttribute('data-page');
      // Fecha o popup de cadastros se estiver aberto
      document.getElementById('cadastros-popup').style.display = 'none';
      setActiveMenuItem(page);
      if (page === 'home') {
        renderHome();
      } else if (page === 'dashboard') {
        renderDashboard();
      } else if (page.startsWith('cadastro-')) {
        renderCadastroPage(page);
      }
    }
  }
  // Delegação de eventos para toda a página (SPA navigation)
  document.body.addEventListener('click', delegarNavegacaoSPA);

  
  // Configuração do popup menu de cadastros (externo ao menu)
  const cadastrosTrigger = document.querySelector('.cadastros-trigger');
  const cadastrosPopup = document.getElementById('cadastros-popup');
  const cadastrosMenu = document.getElementById('cadastros-menu');
  let isPopupVisible = false;
  
  // Mostra/esconde o popup quando clicar no item Cadastros
  cadastrosTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Calcula a posição vertical do popup baseada na posição do item do menu
      const menuRect = cadastrosMenu.getBoundingClientRect();
      cadastrosPopup.style.top = menuRect.top + 'px';
      
      // Alterna a visibilidade do popup
      if (isPopupVisible) {
          cadastrosPopup.style.display = 'none';
          isPopupVisible = false;
      } else {
          cadastrosPopup.style.display = 'block';
          isPopupVisible = true;
      }
  });
  
  // Fecha o popup ao clicar em qualquer lugar da página
  document.addEventListener('click', function(e) {
      if (!cadastrosMenu.contains(e.target) && !cadastrosPopup.contains(e.target)) {
          cadastrosPopup.style.display = 'none';
      }
  });
  
  // Função para marcar o item de menu ativo
  function setActiveMenuItem(page) {
      // Remove a classe 'active' de todos os itens do menu
      document.querySelectorAll('.sidebar a').forEach(item => {
          item.classList.remove('active');
      });
      
      // Adiciona a classe 'active' ao item selecionado
      const activeItem = document.querySelector(`.sidebar a[data-page="${page}"]`);
      if (activeItem) {
          activeItem.classList.add('active');
      }
  }
});

// Função para renderizar páginas de cadastro
function renderCadastroPage(page) {
  // Obtém o nome do cadastro a partir do data-page
  const cadastroName = page.replace('cadastro-', '');
  
  // Mapeamento de nomes amigáveis
  const cadastroTitles = {
    'toners': 'Toners',
    'fornecedores': 'Fornecedores',
    'filiais': 'Filiais',
    'setores': 'Setores',
    'clientes': 'Clientes',
    'pop-it': 'Títulos de POP / IT',
    'processos': 'Títulos de Processos',
    'garantias': 'Status de Garantia',
    'defeitos': 'Defeitos'
  };
  
  // Obtém o título do cadastro
  const title = cadastroTitles[cadastroName] || 'Cadastro';
  
  // Renderiza o conteúdo base da página de cadastro
  spaContent.innerHTML = `
    <div class="dashboard-container" style="padding: 30px; width: 100%;">
      <div class="header mb-4 d-flex justify-content-between align-items-center">
        <h2 class="text-white">Cadastro de ${title}</h2>
        <div>
          <button id="btn-novo-cadastro" class="btn btn-light me-2"><i class="fas fa-plus"></i> Novo</button>
          <button id="btn-exportar" class="btn btn-success me-2"><i class="fas fa-file-excel"></i> Exportar</button>
          <button id="btn-importar" class="btn btn-info"><i class="fas fa-upload"></i> Importar</button>
        </div>
      </div>
      
      <div class="card shadow-sm mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Lista de ${title}</h5>
          <div class="d-flex align-items-center">
            <div class="dropdown me-2">
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="dropdownFiltro" data-bs-toggle="dropdown" aria-expanded="false">
                Filtrar por
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownFiltro" id="filtro-colunas">
                <!-- Preenchido dinamicamente -->
              </ul>
            </div>
            <div class="input-group">
              <input type="text" class="form-control form-control-sm" placeholder="Buscar..." id="search-input">
              <button class="btn btn-sm btn-primary" id="search-button"><i class="fas fa-search"></i></button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover" id="tabela-${cadastroName}">
              <thead>
                <tr id="cabecalho-${cadastroName}">
                  <!-- Cabeçalho preenchido dinamicamente -->
                </tr>
              </thead>
              <tbody id="corpo-${cadastroName}">
                <!-- Dados preenchidos dinamicamente -->
              </tbody>
            </table>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="pagination-info">Exibindo <span id="registros-exibidos">0</span> de <span id="total-registros">0</span> registros</div>
            <nav aria-label="Page navigation">
              <ul class="pagination pagination-sm justify-content-end mb-0">
                <li class="page-item disabled"><a class="page-link" href="#">Anterior</a></li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">Próximo</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      
      <!-- Modal para Novo/Editar -->
      <div class="modal fade" id="modal-cadastro-${cadastroName}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modal-title-${cadastroName}">Novo ${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
              <form id="form-${cadastroName}">
                <!-- Campos do formulário preenchidos dinamicamente -->
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btn-salvar-${cadastroName}">Salvar</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal de Confirmação de Exclusão -->
      <div class="modal fade" id="modal-excluir" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmar Exclusão</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
              <p>Tem certeza que deseja excluir este registro?</p>
              <p class="text-danger">Esta ação não poderá ser desfeita.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" id="btn-confirmar-exclusao">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Configura o formulário e a tabela de acordo com o tipo de cadastro
  switch(cadastroName) {
    case 'toners':
      configurarCadastroToners();
      break;
    case 'fornecedores':
      configurarCadastroFornecedores();
      break;
    case 'filiais':
      configurarCadastroFiliais();
      break;
    case 'setores':
      configurarCadastroSetores();
      break;
    case 'clientes':
      configurarCadastroClientes();
      break;
    case 'pop-it':
      configurarCadastroPOPIT();
      break;
    case 'processos':
      configurarCadastroProcessos();
      break;
    case 'garantias':
      configurarCadastroGarantias();
      break;
    case 'defeitos':
      configurarCadastroDefeitos();
      break;
    default:
      console.error('Tipo de cadastro não reconhecido:', cadastroName);
  }
  
  // Configura os eventos dos botões
  document.getElementById('btn-novo-cadastro').addEventListener('click', function() {
    const modalId = `modal-cadastro-${cadastroName}`;
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    document.getElementById(`form-${cadastroName}`).reset();
    document.getElementById(`modal-title-${cadastroName}`).textContent = `Novo ${title}`;
    modal.show();
  });
  
  // Adiciona efeito de animação aos elementos
  setTimeout(() => {
    if (window.AOS) {
      AOS.refresh();
    }
  }, 100);
}

// Função global para re-inicializar os gráficos após o conteúdo ser injetado
window.initDashboardCharts = function () {
  // Auditorias
  new Chart(document.getElementById('chartAuditorias'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr'],
      datasets: [{
        label: 'Auditorias',
        data: [5, 8, 4, 6],
        backgroundColor: '#0d6efd'
      }]
    }
  });
  // Retornos
  new Chart(document.getElementById('chartRetornos'), {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr'],
      datasets: [{
        label: 'Toners Retornados',
        data: [12, 9, 14, 10],
        borderColor: '#6610f2',
        fill: false
      }]
    }
  });
  // Garantias
  new Chart(document.getElementById('chartGarantias'), {
    type: 'pie',
    data: {
      labels: ['Aprovadas', 'Pendentes', 'Rejeitadas'],
      datasets: [{
        data: [10, 5, 2],
        backgroundColor: ['#198754', '#ffc107', '#dc3545']
      }]
    }
  });
  // Documentos
  new Chart(document.getElementById('chartDocumentos'), {
    type: 'doughnut',
    data: {
      labels: ['POP', 'IT', 'BPMN'],
      datasets: [{
        data: [30, 20, 10],
        backgroundColor: ['#0d6efd', '#20c997', '#6f42c1']
      }]
    }
  });
  // Garantias por Fornecedor
  new Chart(document.getElementById('chartGarantiasFornecedor'), {
    type: 'bar',
    data: {
      labels: ['Fornecedor A', 'Fornecedor B', 'Fornecedor C'],
      datasets: [{
        label: 'Garantias',
        data: [12, 7, 5],
        backgroundColor: ['#0d6efd', '#6f42c1', '#20c997']
      }]
    }
  });
  // Toners Recuperados
  new Chart(document.getElementById('chartTonersRecuperados'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr'],
      datasets: [
        {
          label: 'Quantidade',
          data: [40, 55, 60, 70],
          backgroundColor: '#198754'
        },
        {
          label: 'Valor R$',
          data: [800, 1200, 1500, 1800],
          backgroundColor: '#ffc107'
        }
      ]
    }
  });
};
