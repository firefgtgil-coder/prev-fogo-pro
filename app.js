/**
 * PORTAL DE PREVENÇÃO CONTRA INCÊNDIO & PÂNICO (PREV-FOGO PRO)
 * Lógica Completa de Dimensionamento, Grau de Risco e Enquadramento Legal
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de Componentes e Eventos
  initApp();
});

// ============================================================================
// BASE DE DADOS: OCUPAÇÕES, CARGAS DE INCÊNDIO E ESTADOS
// ============================================================================

const OCCUPATION_DATABASE = {
  'escritorios': {
    code: 'D-1',
    name: 'Serviços Profissionais / Escritórios e Consultórios',
    fireLoad: 200, // MJ/m²
    baseRisk: 'baixo',
    description: 'Atividades administrativas, agências bancárias, consultórios médicos sem internação.'
  },
  'residencial': {
    code: 'A-2',
    name: 'Residencial Multifamiliar (Condomínios Verticais)',
    fireLoad: 300,
    baseRisk: 'baixo',
    description: 'Edifícios de apartamentos de habitação permanente.'
  },
  'educacional': {
    code: 'E-1/E-2',
    name: 'Educacional e Cultura Física (Escolas e Faculdades)',
    fireLoad: 300,
    baseRisk: 'baixo',
    description: 'Escolas de ensino fundamental, médio, universidades e centros de treinamento.'
  },
  'comercial_varejo': {
    code: 'C-1/C-2',
    name: 'Comércio Varejista em Geral (Lojas, Mercados)',
    fireLoad: 600,
    baseRisk: 'medio',
    description: 'Comércio de bens de consumo, lojas de vestuário, supermercados e shopping centers.'
  },
  'hotelaria': {
    code: 'B-1/B-2',
    name: 'Serviços de Hospedagem (Hotéis, Pousadas, Motéis)',
    fireLoad: 500,
    baseRisk: 'medio',
    description: 'Edificações com leitos para hospedagem temporária.'
  },
  'oficinas': {
    code: 'G-1/G-2',
    name: 'Serviços Automotivos e Garagens (Oficinas, Concessionárias)',
    fireLoad: 500,
    baseRisk: 'medio',
    description: 'Reparos automotivos, troca de óleo, garagens coletivas e concessionárias.'
  },
  'reuniao_publico': {
    code: 'F-1/F-6',
    name: 'Reunião de Público (Restaurantes, Igrejas, Casas de Shows)',
    fireLoad: 800,
    baseRisk: 'medio',
    description: 'Espaços com concentração de público, auditórios, templos religiosos e gastronomia.'
  },
  'saude': {
    code: 'H-2/H-3',
    name: 'Serviços de Saúde com Internação (Hospitais, Clínicas)',
    fireLoad: 600,
    baseRisk: 'medio',
    description: 'Hospitais, prontos-socorros, clínicas com pacientes acamados ou internação.'
  },
  'industria_leve': {
    code: 'I-1/I-2',
    name: 'Indústria em Geral (Manufatura, Metalúrgica a Frio, Têxtil)',
    fireLoad: 700,
    baseRisk: 'medio',
    description: 'Processamento industrial leve com carga combustível moderada.'
  },
  'industria_quimica': {
    code: 'I-3/M-2',
    name: 'Indústria Química / Tintas / Manipulação de Inflamáveis',
    fireLoad: 1600,
    baseRisk: 'alto',
    description: 'Indústrias que utilizam, refinam ou fabricam solventes, tintas, álcoois e petroquímicos.'
  },
  'deposito_combustivel': {
    code: 'J-2/J-3',
    name: 'Depósitos de Materiais Combustíveis e Centros de Distribuição',
    fireLoad: 1200,
    baseRisk: 'alto',
    description: 'Armazenamento de paletes de madeira, plásticos, embalagens, tecidos e logística intensiva.'
  },
  'posto_combustivel': {
    code: 'G-4/M-1',
    name: 'Posto de Abastecimento de Combustíveis e GNV',
    fireLoad: 1500,
    baseRisk: 'alto',
    description: 'Revenda de combustíveis líquidos derivados de petróleo, etanol e gás veicular.'
  }
};

const STATES_DATABASE = {
  'SP': {
    name: 'São Paulo',
    corpo: 'Corpo de Bombeiros da PMESP (CBMSP)',
    normaGeral: 'Decreto Estadual nº 63.911/2018 e Instruções Técnicas (IT-01 a IT-44)',
    portal: 'Via Fácil Bombeiros (VFB)',
    docPequeno: 'CLCB (Certificado de Licença do Corpo de Bombeiros)',
    docGrande: 'AVCB (Auto de Vistoria do Corpo de Bombeiros)',
    procedimentoPequeno: 'Processo Técnico Simplificado (PTS) - Isento de hidrantes se área ≤ 750m² e baixa carga',
    procedimentoGrande: 'Projeto Técnico (PT) completo com memorial descritivo, ART e plantas de proteção',
    brigadaNorma: 'Instrução Técnica nº 17 (IT-17/CBMSP)',
    hidranteNorma: 'Instrução Técnica nº 22 (IT-22/CBMSP)'
  },
  'RJ': {
    name: 'Rio de Janeiro',
    corpo: 'Corpo de Bombeiros Militar do Estado do Rio de Janeiro (CBMERJ)',
    normaGeral: 'Decreto Estadual nº 42/2018 (COSCIP) e Notas Técnicas (NT)',
    portal: 'Sistema de Informações de Atividades do CBMERJ (SIA-CBMERJ)',
    docPequeno: 'Certificado de Aprovação Simplificado / Alvará do CBMERJ',
    docGrande: 'Laudo de Exigências / Certificado de Aprovação Pleno (AVCB)',
    procedimentoPequeno: 'Procedimento Simplificado eletrônico para edificações térreas de até 750m²',
    procedimentoGrande: 'Vistoria presencial obrigatória e aprovação de Projeto de Segurança Contra Incêndio e Pânico',
    brigadaNorma: 'Nota Técnica NT 2-08 CBMERJ (Brigadas Voluntárias)',
    hidranteNorma: 'Nota Técnica NT 2-04 CBMERJ'
  },
  'MG': {
    name: 'Minas Gerais',
    corpo: 'Corpo de Bombeiros Militar de Minas Gerais (CBMMG)',
    normaGeral: 'Lei Estadual nº 14.130/2001, Decreto Estadual nº 47.998/2020 e ITs',
    portal: 'Sistema INFOCIP (Informações de Proteção Contra Incêndio)',
    docPequeno: 'Certificado de Funcionamento Provisório / Dispensa / PTS',
    docGrande: 'AVCB (Auto de Vistoria do Corpo de Bombeiros)',
    procedimentoPequeno: 'PTS com declaração eletrônica e auto-vistoria para edificações de baixo potencial ofensivo',
    procedimentoGrande: 'Processo de Segurança Contra Incêndio e Pânico (PSCIP) com análise técnica de engenharia',
    brigadaNorma: 'Instrução Técnica nº 12 (IT-12 CBMMG)',
    hidranteNorma: 'Instrução Técnica nº 17 (IT-17 CBMMG)'
  },
  'RS': {
    name: 'Rio Grande do Sul',
    corpo: 'Corpo de Bombeiros Militar do Rio Grande do Sul (CBMRS)',
    normaGeral: 'Lei Complementar nº 14.376/2013 (Lei Kiss) e Resoluções Técnicas (RTCBMRS)',
    portal: 'Sistema SISBOM-RS',
    docPequeno: 'CLCB / PSPCI (Plano Simplificado de Prevenção e Proteção Contra Incêndio)',
    docGrande: 'APPCI (Alvará de Prevenção e Proteção Contra Incêndio)',
    procedimentoPequeno: 'PSPCI para edificações de grau de risco baixo ou médio com área até 750m²',
    procedimentoGrande: 'PPCI Completo com cálculo populacional detalhado e vistoria in loco',
    brigadaNorma: 'Resolução Técnica CBMRS nº 015 (RT-015/2022)',
    hidranteNorma: 'Resolução Técnica CBMRS nº 013 (RT-013/2022)'
  },
  'PR': {
    name: 'Paraná',
    corpo: 'Corpo de Bombeiros da PMPR (CBMPR)',
    normaGeral: 'Lei Estadual nº 19.449/2018 e Normas de Procedimento Técnico (NPT)',
    portal: 'Sistema PREVFOGO (CBMPR)',
    docPequeno: 'CLCB (Certificado de Licença do Corpo de Bombeiros)',
    docGrande: 'CVCB (Certificado de Vistoria do Corpo de Bombeiros)',
    procedimentoPequeno: 'Processo Simplificado para imóveis com até 750m² e carga compatível',
    procedimentoGrande: 'Processo Ordinário de Aprovação de Projeto Técnico com emissão de CVCB',
    brigadaNorma: 'Norma de Procedimento Técnico NPT 017',
    hidranteNorma: 'Norma de Procedimento Técnico NPT 022'
  },
  'SC': {
    name: 'Santa Catarina',
    corpo: 'Corpo de Bombeiros Militar de Santa Catarina (CBMSC)',
    normaGeral: 'Lei Estadual nº 16.157/2013, Decreto nº 1.605/2018 e Instruções Normativas (IN)',
    portal: 'Sistema e-SCI CBMSC',
    docPequeno: 'Atestado de Funcionamento Provisório / Simplificado',
    docGrande: 'Atestado de Vistoria para Funcionamento (AVF) / Habite-se',
    procedimentoPequeno: 'Declaração eletrônica com ART para estabelecimentos de baixo risco até 750m²',
    procedimentoGrande: 'Aprovação prévia de Projeto Preventivo Contra Incêndio (PPCI) e vistoria prévia',
    brigadaNorma: 'Instrução Normativa IN-028 CBMSC',
    hidranteNorma: 'Instrução Normativa IN-007 CBMSC'
  },
  'BA': {
    name: 'Bahia',
    corpo: 'Corpo de Bombeiros Militar da Bahia (CBMBA)',
    normaGeral: 'Lei Estadual nº 12.929/2013, Decreto Estadual nº 16.302/2015 e ITs',
    portal: 'Sistema de Atividades Técnicas (SAT CBMBA)',
    docPequeno: 'APPCI Simplificado / Certificado de Dispensa',
    docGrande: 'AVCB (Auto de Vistoria do Corpo de Bombeiros)',
    procedimentoPequeno: 'Processo de licenciamento simplificado para microempresas e áreas até 750m²',
    procedimentoGrande: 'Aprovação de Projeto de Segurança Contra Incêndio e Pânico (PSCIP) com vistoria presencial',
    brigadaNorma: 'Instrução Técnica nº 17 CBMBA',
    hidranteNorma: 'Instrução Técnica nº 22 CBMBA'
  },
  'PE': {
    name: 'Pernambuco',
    corpo: 'Corpo de Bombeiros Militar de Pernambuco (CBMPE)',
    normaGeral: 'Lei Estadual nº 11.186/1994, Decreto nº 19.644/1997 e Normas Técnicas',
    portal: 'CBMPE Digital / Centro de Atividades Técnicas (CAT)',
    docPequeno: 'Atestado de Regularidade Simplificado',
    docGrande: 'Atestado de Regularidade Pleno do Corpo de Bombeiros',
    procedimentoPequeno: 'Certificação simplificada para edificações de baixo risco e porte compacto',
    procedimentoGrande: 'Exame de Projeto de Segurança Contra Incêndio e Pânico e Vistoria Fiscalizadora',
    brigadaNorma: 'Instrução Normativa CBMPE - Brigadas',
    hidranteNorma: 'Norma Técnica CBMPE - Rede de Hidrantes'
  },
  'CE': {
    name: 'Ceará',
    corpo: 'Corpo de Bombeiros Militar do Estado do Ceará (CBMCE)',
    normaGeral: 'Lei Estadual nº 13.556/2004 e Notas Técnicas (NT CBMCE)',
    portal: 'Sistema Comando CBMCE',
    docPequeno: 'Certificado de Conformidade Simplificado',
    docGrande: 'Certificado de Conformidade do Corpo de Bombeiros (CCCB)',
    procedimentoPequeno: 'Licenciamento autodeclaratório para atividades de baixo risco até 750m²',
    procedimentoGrande: 'Aprovação de Projetos Técnicos com emissão formal de Certificado',
    brigadaNorma: 'Nota Técnica NT-006 CBMCE',
    hidranteNorma: 'Nota Técnica NT-007 CBMCE'
  },
  'DF': {
    name: 'Distrito Federal',
    corpo: 'Corpo de Bombeiros Militar do Distrito Federal (CBMDF)',
    normaGeral: 'Lei Federal nº 8.255/1991, Decreto Distrital nº 21.361/2000 e Normas Técnicas',
    portal: 'Sistema de Licenciamento CBMDF (SISLIC)',
    docPequeno: 'Alvará de Funcionamento Simplificado CBMDF',
    docGrande: 'Certificado de Aprovação de Projeto e Habite-se / Alvará Pleno',
    procedimentoPequeno: 'Declaração de cumprimento de requisitos básicos de proteção para área até 750m²',
    procedimentoGrande: 'Análise de Projeto de Incêndio e Vistoria Técnica pelo DIEP/CBMDF',
    brigadaNorma: 'Norma Técnica NT 001/CBMDF - Brigada',
    hidranteNorma: 'Norma Técnica NT 002/CBMDF - Hidrantes'
  },
  'GO': {
    name: 'Goiás',
    corpo: 'Corpo de Bombeiros Militar do Estado de Goiás (CBMGO)',
    normaGeral: 'Lei Estadual nº 15.802/2006 (Código Estadual) e Normas Técnicas',
    portal: 'Sistema de Gestão de Atividades Técnicas (SIGAT CBMGO)',
    docPequeno: 'CERCON Simplificado (Certificado de Conformidade)',
    docGrande: 'CERCON Pleno (Certificado de Conformidade do CBMGO)',
    procedimentoPequeno: 'Procedimento Rápido para edificações térreas de até 750m²',
    procedimentoGrande: 'Aprovação de Processo Técnico de Proteção Contra Incêndio e Pânico',
    brigadaNorma: 'Norma Técnica NT-17 CBMGO',
    hidranteNorma: 'Norma Técnica NT-22 CBMGO'
  }
};

// ============================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ============================================================================

function initApp() {
  setupTheme();
  setupNavigation();
  setupCalculatorForm();
  setupItsMatrixExplorer();
  setupLegislationExplorer();
  loadHistoryFromStorage();
  
  // Realiza um cálculo inicial demonstrativo com dados padrão
  calculateFireSafety(false);
}

// ============================================================================
// CONTROLE DE TEMA (MODO CLARO / MODO ESCURO)
// ============================================================================

function setupTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('prevfogo_theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('prevfogo_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  if (theme === 'dark') {
    // Ícone de Sol
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />`;
  } else {
    // Ícone de Lua
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />`;
  }
}

// ============================================================================
// NAVEGAÇÃO E MENU RESPONSIVO
// ============================================================================

function setupNavigation() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    // Fecha o menu ao clicar num link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // Header scroll shadow effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

// ============================================================================
// MOTOR DE CÁLCULO E FORMULÁRIO
// ============================================================================

function setupCalculatorForm() {
  const form = document.getElementById('fireSafetyForm');
  const resetBtn = document.getElementById('btnResetForm');
  const printBtn = document.getElementById('btnPrintReport');
  const saveBtn = document.getElementById('btnSaveCalculation');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateFireSafety(true);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      // Restaura valores convenientes
      document.getElementById('inputArea').value = '450';
      document.getElementById('inputEmployees').value = '18';
      document.getElementById('selectState').value = 'SP';
      document.getElementById('selectOccupation').value = 'comercial_varejo';
      calculateFireSafety(false);
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveCurrentCalculation();
    });
  }
}

/**
 * Função principal que realiza todo o cálculo e enquadramento
 * @param {boolean} shouldScrollToResult Se deve rolar suavemente até a seção de resultado
 */
function calculateFireSafety(shouldScrollToResult = true) {
  const occupationKey = document.getElementById('selectOccupation').value;
  const employees = Math.max(1, parseInt(document.getElementById('inputEmployees').value, 10) || 1);
  const area = Math.max(10, parseFloat(document.getElementById('inputArea').value) || 100);
  const stateKey = document.getElementById('selectState').value;
  const height = parseFloat(document.getElementById('inputHeight')?.value) || 6.0;

  const occupation = OCCUPATION_DATABASE[occupationKey] || OCCUPATION_DATABASE['comercial_varejo'];
  const stateData = STATES_DATABASE[stateKey] || STATES_DATABASE['SP'];

  // 1. CÁLCULO DO GRAU DE RISCO (Baixo, Médio, Alto)
  // Regra técnica baseada na Carga de Incêndio (MJ/m²) ponderada por área e ocupação
  let riskGrade = occupation.baseRisk; // 'baixo', 'medio', 'alto'
  let riskScore = 30; // 0 a 100
  let riskBadgeLabel = 'Baixo Risco';

  if (occupation.fireLoad <= 300) {
    // Até 300 MJ/m² geralmente é Baixo Risco
    if (area > 2000 || employees > 150) {
      riskGrade = 'medio';
      riskScore = 55;
      riskBadgeLabel = 'Médio Risco (Área/População Elevada)';
    } else {
      riskGrade = 'baixo';
      riskScore = 25;
      riskBadgeLabel = 'Baixo Risco';
    }
  } else if (occupation.fireLoad <= 1000) {
    // 301 a 1000 MJ/m²: Médio Risco
    if (area > 3000 || employees > 250 || height > 12) {
      riskGrade = 'alto';
      riskScore = 80;
      riskBadgeLabel = 'Alto Risco (Grande Porte)';
    } else {
      riskGrade = 'medio';
      riskScore = 58;
      riskBadgeLabel = 'Médio Risco';
    }
  } else {
    // Acima de 1000 MJ/m² ou líquidos/químicos: Alto Risco
    riskGrade = 'alto';
    riskScore = 92;
    riskBadgeLabel = 'Alto Risco (Carga Elevada / Inflamáveis)';
  }

  // 2. ENQUADRAMENTO DE DOCUMENTO: CLCB / AVCB
  // Regra legal: Área <= 750m² e altura <= 12m e sem risco severo -> CLCB / Simplificado
  // Área > 750m² ou altura > 12m ou risco alto severo -> AVCB com Projeto Técnico completo
  let docType = 'CLCB';
  let isCLCB = true;
  let docTitle = stateData.docPequeno;
  let docProcedure = stateData.procedimentoPequeno;

  if (area > 750 || height > 12 || riskGrade === 'alto') {
    docType = 'AVCB';
    isCLCB = false;
    docTitle = stateData.docGrande;
    docProcedure = stateData.procedimentoGrande;
  }

  // 3. DIMENSIONAMENTO DA BRIGADA DE INCÊNDIO (NBR 14276 / IT-17)
  let brigadePercent = 0.05; // 5% default
  let brigadeLevel = 'Básico (4h a 8h)';
  let brigadeMin = 1;

  if (riskGrade === 'baixo') {
    brigadePercent = 0.03; // 3%
    brigadeLevel = 'Nível Básico (Mínimo 8 horas - Prevenção, combate a princípio de incêndio e APH)';
    brigadeMin = employees <= 10 ? 1 : Math.max(1, Math.ceil(employees * 0.03));
  } else if (riskGrade === 'medio') {
    brigadePercent = 0.06; // 6%
    brigadeLevel = 'Nível Intermediário (Mínimo 16 horas - Abandono de local, uso de extintores e hidrantes, primeiros socorros)';
    brigadeMin = employees <= 10 ? 2 : Math.max(2, Math.ceil(employees * 0.06));
  } else {
    brigadePercent = 0.10; // 10%
    brigadeLevel = 'Nível Avançado (Mínimo 24 a 40 horas - Técnicas de resgate, sistemas fixos, mangueiras, combate com fumaça e simulados práticos semestrais)';
    brigadeMin = employees <= 10 ? 4 : Math.max(4, Math.ceil(employees * 0.10));
  }

  // 4. DIMENSIONAMENTO DE EQUIPAMENTOS OBRIGATÓRIOS
  // Extintores: Quantidade estimada por caminhamento e área
  const maxDistance = riskGrade === 'alto' ? 15 : (riskGrade === 'medio' ? 20 : 25);
  // Área de cobertura por unidade: Alto ~ 150m², Médio ~ 250m², Baixo ~ 350m²
  const areaPerExtinguisher = riskGrade === 'alto' ? 150 : (riskGrade === 'medio' ? 250 : 350);
  const estimatedExtinguishers = Math.max(2, Math.ceil(area / areaPerExtinguisher));

  // Hidrantes e Mangotinhos: Exigido se área > 750 m² ou risco alto
  const hydrantsRequired = area > 750 || riskGrade === 'alto';
  const estimatedHydrants = hydrantsRequired ? Math.max(2, Math.ceil(area / 600)) : 0;
  const reserveWaterM3 = hydrantsRequired ? (riskGrade === 'alto' ? 25 : (area > 1500 ? 18 : 12)) : 0;

  // Sprinklers (Chuveiros automáticos): Exigido para áreas grandes (> 2500m²) ou depósitos/químicos especiais
  const sprinklersRequired = area > 2500 || (riskGrade === 'alto' && area > 1200);

  // Sistema de Alarme e Detecção
  const alarmRequired = area > 750 || riskGrade !== 'baixo' || employees > 50;
  const detectionRequired = riskGrade === 'alto' || occupationKey === 'saude' || occupationKey === 'hotelaria' || area > 1500;

  // 5. ATUALIZAR INTERFACE COM RESULTADOS
  renderResults({
    area,
    employees,
    height,
    occupation,
    stateData,
    riskGrade,
    riskScore,
    riskBadgeLabel,
    docType,
    isCLCB,
    docTitle,
    docProcedure,
    brigadePercent: (brigadePercent * 100).toFixed(0),
    brigadeCount: brigadeMin,
    brigadeLevel,
    maxDistance,
    estimatedExtinguishers,
    hydrantsRequired,
    estimatedHydrants,
    reserveWaterM3,
    sprinklersRequired,
    alarmRequired,
    detectionRequired
  });

  // Salvar estado atual em memória temporária para exportação/gravação
  window.lastCalculation = {
    date: new Date().toISOString(),
    area,
    employees,
    occupationKey,
    occupationName: occupation.name,
    occupationCode: occupation.code,
    stateKey,
    stateName: stateData.name,
    riskGrade,
    docType,
    docTitle,
    brigadeCount: brigadeMin
  };

  const resultsSection = document.getElementById('resultsSection');
  if (resultsSection) {
    resultsSection.classList.remove('hidden');
    if (shouldScrollToResult) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// ============================================================================
// RENDERIZAÇÃO DOS RESULTADOS NA TELA
// ============================================================================

function renderResults(data) {
  // 1. Resumo do Cabeçalho de Resultados
  const badgeEl = document.getElementById('riskBadge');
  if (badgeEl) {
    badgeEl.className = `risk-badge ${data.riskGrade}`;
    badgeEl.innerHTML = `
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
      </svg>
      Grau de Risco: ${data.riskBadgeLabel}
    `;
  }

  const resultsSubheader = document.getElementById('resultsSubheader');
  if (resultsSubheader) {
    resultsSubheader.textContent = `Enquadramento realizado para ${data.occupation.name} no estado de ${data.stateData.name}.`;
  }

  // 2. Card 1: Resumo do Enquadramento
  const metaOccupation = document.getElementById('metaOccupation');
  const metaFireLoad = document.getElementById('metaFireLoad');
  const metaAreaEmployees = document.getElementById('metaAreaEmployees');
  const metaStateNorm = document.getElementById('metaStateNorm');

  if (metaOccupation) metaOccupation.textContent = `${data.occupation.code} - ${data.occupation.name}`;
  if (metaFireLoad) metaFireLoad.textContent = `${data.occupation.fireLoad} MJ/m² (Carga Calorífica)`;
  if (metaAreaEmployees) metaAreaEmployees.textContent = `${data.area.toLocaleString('pt-BR')} m² / ${data.employees} funcionários`;
  if (metaStateNorm) metaStateNorm.textContent = data.stateData.normaGeral;

  // 3. Card 2: Documento Obrigatório do Corpo de Bombeiros (CLCB vs AVCB)
  const docCallout = document.getElementById('docCallout');
  const docTypeLabel = document.getElementById('docTypeLabel');
  const docDesc = document.getElementById('docDesc');
  const docRequirementsList = document.getElementById('docRequirementsList');

  if (docCallout && docTypeLabel && docDesc) {
    docCallout.className = `doc-callout ${data.isCLCB ? 'clcb' : 'avcb'}`;
    docTypeLabel.textContent = data.docTitle;
    docDesc.textContent = `Classificação por critério de área (${data.area} m² ${data.area <= 750 ? '≤ 750 m²' : '> 750 m²'}) e grau de risco.`;

    let reqsHtml = `
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Modalidade Processual:</span> ${data.docProcedure}
          <span class="item-desc">Portal Oficial de Protocolo: <strong>${data.stateData.portal}</strong></span>
        </div>
      </li>
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Responsabilidade Técnica:</span> ${data.isCLCB ? 'Dispensa de projeto completo, exigindo Declaração Eletrônica e ART/RRT de instalação onde couber.' : 'Obrigatório Projeto Técnico de Engenharia (PT) com ART/RRT e plantas detalhadas.'}
          <span class="item-desc">Válido para renovação a cada ${data.riskGrade === 'alto' ? '1 a 2 anos' : '3 a 5 anos'} (conforme IT local).</span>
        </div>
      </li>
    `;
    if (docRequirementsList) docRequirementsList.innerHTML = reqsHtml;
  }

  // 4. Card 3: Brigada de Incêndio (NBR 14276 / IT 17)
  const brigadeStats = document.getElementById('brigadeStats');
  const brigadeDetails = document.getElementById('brigadeDetails');

  if (brigadeStats) {
    brigadeStats.innerHTML = `
      <div class="meta-item">
        <span class="meta-label">Brigadistas Mínimos</span>
        <span class="meta-value" style="color: var(--color-accent);">${data.brigadeCount} profissional(is)</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Percentual População</span>
        <span class="meta-value">${data.brigadePercent}% da equipe</span>
      </div>
    `;
  }

  if (brigadeDetails) {
    brigadeDetails.innerHTML = `
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Capacitação Exigida:</span> ${data.brigadeLevel}
          <span class="item-desc">Regulamentado por: ${data.stateData.brigadaNorma} e ABNT NBR 14276.</span>
        </div>
      </li>
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Reciclagem Obrigatória:</span> Anual (Periodicidade de 12 meses)
          <span class="item-desc">Com registro de presença, atestado técnico com ART do instrutor e simulado de evacuação.</span>
        </div>
      </li>
    `;
  }

  // 5. Card 4: Equipamentos e Sistemas Obrigatórios
  const equipmentList = document.getElementById('equipmentList');
  if (equipmentList) {
    let equipHtml = `
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Extintores de Incêndio (Obrigatório 100%):</span> Mínimo estimado de <strong>${data.estimatedExtinguishers} unidades</strong>
          <span class="item-desc">Tipos recomendados: Pó Químico ABC (4kg/6kg) e CO2 (6kg) para quadros elétricos. Distância máx. de caminhamento: <strong>${data.maxDistance} metros</strong>.</span>
        </div>
      </li>
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Iluminação de Emergência:</span> Blocos autônomos ou sistema centralizado
          <span class="item-desc">Autonomia mínima de 2h nas rotas de fuga, corredores e saídas (NBR 10898).</span>
        </div>
      </li>
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Sinalização de Emergência Fotoluminescente:</span> Placas normalizadas NBR 13434
          <span class="item-desc">Indicação clara de saídas, extintores, rotas e desníveis com luminescência comprovada.</span>
        </div>
      </li>
    `;

    if (data.hydrantsRequired) {
      equipHtml += `
        <li class="checklist-item">
          <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          <div>
            <span class="item-highlight" style="color: var(--color-accent);">Rede de Hidrantes e Mangotinhos:</span> EXIGIDA (${data.stateData.hidranteNorma})
            <span class="item-desc">Estimativa de ~${data.estimatedHydrants} pontos com mangueiras de 1½" (38mm) e Reserva Técnica de Incêndio (RTI) estimada em aprox. <strong>${data.reserveWaterM3} m³</strong> de água.</span>
          </div>
        </li>
      `;
    } else {
      equipHtml += `
        <li class="checklist-item" style="opacity: 0.75;">
          <svg class="check-icon" width="18" height="18" fill="none" stroke="#64748b" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          <div>
            <span class="item-highlight">Rede de Hidrantes:</span> Isento por área reduzida (≤ 750 m² e baixo/médio risco)
            <span class="item-desc">Proteção por extintores portáteis é suficiente conforme IT local.</span>
          </div>
        </li>
      `;
    }

    if (data.alarmRequired) {
      equipHtml += `
        <li class="checklist-item">
          <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          <div>
            <span class="item-highlight">Sistema de Alarme Manual de Incêndio:</span> Botoeiras e sirenes audiovisuais
            <span class="item-desc">Instalação ao longo das rotas de fuga com central de monitoramento (NBR 17240).</span>
          </div>
        </li>
      `;
    }

    if (data.sprinklersRequired) {
      equipHtml += `
        <li class="checklist-item">
          <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          <div>
            <span class="item-highlight" style="color: #dc2626;">Chuveiros Automáticos (Sprinklers):</span> EXIGIDO (NBR 10897)
            <span class="item-desc">Obrigatório em virtude da grande metragem (> 2500m²) ou risco elevado de carga/armazenamento.</span>
          </div>
        </li>
      `;
    }

    equipmentList.innerHTML = equipHtml;
  }

  // 6. Card 5: Requisitos Especiais & Gestão
  const specialReqsList = document.getElementById('specialReqsList');
  if (specialReqsList) {
    specialReqsList.innerHTML = `
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Laudo Elétrico (NBR 5410 / NR-10):</span> Conformidade de quadros e aterramento
          <span class="item-desc">Atestado técnico de conformidade das instalações elétricas emitido por engenheiro eletricista com ART.</span>
        </div>
      </li>
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Plano de Emergência Contra Incêndio (PECI):</span> ${data.riskGrade === 'baixo' && data.area <= 750 ? 'Recomendado' : 'OBRIGATÓRIO'}
          <span class="item-desc">Plano detalhado de abandono de edificação, rotas, ponto de encontro e fluxograma de comunicação.</span>
        </div>
      </li>
      <li class="checklist-item">
        <svg class="check-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <div>
          <span class="item-highlight">Manutenção Preventiva Periódica:</span> Selo INMETRO e checklist
          <span class="item-desc">Recarga anual de extintores, teste hidrostático (a cada 5 anos), teste quinzenal de bomba de incêndio e autonomia das luminárias.</span>
        </div>
      </li>
    `;
  }

  // 7. Atualizar texto do CTA da Matriz de ITs
  const matrixCtaDesc = document.getElementById('matrixCtaDescription');
  if (matrixCtaDesc) {
    matrixCtaDesc.textContent = `Consulte o que todas as 22 Instruções Técnicas de ${data.stateData.name} (${data.stateData.corpo}) exigem por lei para ${data.occupation.code} (${data.riskBadgeLabel}).`;
  }
}

// ============================================================================
// HISTÓRICO LOCAL (LOCALSTORAGE)
// ============================================================================

function saveCurrentCalculation() {
  if (!window.lastCalculation) return;

  const history = getStoredHistory();
  const newEntry = {
    ...window.lastCalculation,
    id: Date.now().toString(),
    timestamp: new Date().toLocaleString('pt-BR')
  };

  // Mantém os últimos 12 cálculos
  history.unshift(newEntry);
  if (history.length > 12) history.pop();

  localStorage.setItem('prevfogo_history', JSON.stringify(history));
  renderHistory(history);

  // Feedback visual no botão
  const saveBtn = document.getElementById('btnSaveCalculation');
  if (saveBtn) {
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      Cálculo Salvo!
    `;
    saveBtn.classList.remove('btn-outline');
    saveBtn.classList.add('btn-primary');
    setTimeout(() => {
      saveBtn.innerHTML = originalText;
      saveBtn.classList.remove('btn-primary');
      saveBtn.classList.add('btn-outline');
    }, 2000);
  }
}

function getStoredHistory() {
  try {
    const raw = localStorage.getItem('prevfogo_history');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erro ao ler histórico', e);
    return [];
  }
}

function loadHistoryFromStorage() {
  const history = getStoredHistory();
  renderHistory(history);

  const clearBtn = document.getElementById('btnClearHistory');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Deseja limpar todo o histórico de dimensionamentos salvos?')) {
        localStorage.removeItem('prevfogo_history');
        renderHistory([]);
      }
    });
  }
}

function renderHistory(list) {
  const container = document.getElementById('historyListContainer');
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="empty-history">
        <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 0.75rem auto; color: var(--text-muted);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p>Nenhum cálculo salvo recentemente no navegador.</p>
        <p style="font-size: 0.8rem; margin-top: 0.25rem;">Execute um dimensionamento e clique em "Salvar no Histórico".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="history-card" data-id="${item.id}">
      <div>
        <div class="history-meta">
          <span>${item.timestamp}</span>
          <span class="risk-badge ${item.riskGrade}" style="font-size: 0.7rem; padding: 0.2rem 0.6rem;">${item.riskGrade.toUpperCase()}</span>
        </div>
        <div class="history-body" style="margin-top: 0.6rem;">
          <h4>${item.occupationName}</h4>
          <p class="history-details">
            <strong>Estado:</strong> ${item.stateKey} &bull; 
            <strong>Área:</strong> ${item.area} m² &bull; 
            <strong>Documento:</strong> ${item.docType} &bull; 
            <strong>Brigada:</strong> ${item.brigadeCount}
          </p>
        </div>
      </div>
      <div class="history-actions">
        <button type="button" class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="loadHistoryItem('${item.id}')">
          Carregar Dados
        </button>
        <button type="button" class="btn btn-outline" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; color: #ef4444;" onclick="deleteHistoryItem('${item.id}')">
          Remover
        </button>
      </div>
    </div>
  `).join('');
}

window.loadHistoryItem = function(id) {
  const history = getStoredHistory();
  const item = history.find(x => x.id === id);
  if (!item) return;

  document.getElementById('selectOccupation').value = item.occupationKey;
  document.getElementById('inputEmployees').value = item.employees;
  document.getElementById('inputArea').value = item.area;
  document.getElementById('selectState').value = item.stateKey;

  calculateFireSafety(true);
};

window.deleteHistoryItem = function(id) {
  let history = getStoredHistory();
  history = history.filter(x => x.id !== id);
  localStorage.setItem('prevfogo_history', JSON.stringify(history));
  renderHistory(history);
};

// ============================================================================
// BASE LEGISLATIVA POR ESTADO (PILLS & VISUALIZADOR)
// ============================================================================

function setupLegislationExplorer() {
  const pillsContainer = document.getElementById('statePillsContainer');
  const detailsContainer = document.getElementById('stateDetailCard');
  if (!pillsContainer || !detailsContainer) return;

  const states = Object.keys(STATES_DATABASE);
  
  pillsContainer.innerHTML = states.map((uf, index) => `
    <button type="button" class="state-pill ${index === 0 ? 'active' : ''}" data-state="${uf}">
      ${uf} - ${STATES_DATABASE[uf].name}
    </button>
  `).join('');

  showStateLegislation(states[0]);

  pillsContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.state-pill');
    if (!pill) return;

    pillsContainer.querySelectorAll('.state-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const stateKey = pill.getAttribute('data-state');
    showStateLegislation(stateKey);
  });
}

function showStateLegislation(stateKey) {
  const s = STATES_DATABASE[stateKey];
  const container = document.getElementById('stateDetailCard');
  if (!s || !container) return;

  container.innerHTML = `
    <div class="state-detail-title">
      <div class="brand-icon-wrapper" style="width: 36px; height: 36px; font-size: 0.9rem;">${stateKey}</div>
      <div>
        <h3 style="font-size: 1.3rem;">${s.corpo} (${stateKey})</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${s.normaGeral}</p>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
      <div class="meta-item">
        <span class="meta-label">Sistema / Portal de Protocolo</span>
        <span class="meta-value" style="font-size: 0.95rem; color: var(--color-secondary);">${s.portal}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Licença Simplificada (≤ 750 m²)</span>
        <span class="meta-value" style="font-size: 0.95rem;">${s.docPequeno}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Licença Plena (> 750 m² / Risco Alto)</span>
        <span class="meta-value" style="font-size: 0.95rem;">${s.docGrande}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Norma de Brigada de Incêndio</span>
        <span class="meta-value" style="font-size: 0.95rem;">${s.brigadaNorma}</span>
      </div>
    </div>
    <div style="margin-top: 1.25rem; padding: 1rem; background: var(--bg-surface-secondary); border-radius: var(--radius-md); font-size: 0.875rem;">
      <strong>Diretriz do Estado:</strong> ${s.procedimentoGrande}
    </div>
  `;
}

// ============================================================================
// MATRIZ COMPLETA DE TODAS AS ITS POR ESTADO E GRAU DE RISCO
// ============================================================================

const ALL_ITS_DATABASE = [
  {
    id: 'it_liquidos_inflamaveis',
    category: 'especiais',
    title: 'Líquidos Combustíveis e Inflamáveis',
    stateNorms: {
      SP: { code: 'IT-25/CBMSP', name: 'Segurança para líquidos combustíveis e inflamáveis', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 3-02 CBMERJ', name: 'Instalações de líquidos inflamáveis e combustíveis', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-20 CBMMG', name: 'Líquidos combustíveis e inflamáveis', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 25', name: 'Instalações de líquidos combustíveis e inflamáveis', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 025 CBMPR', name: 'Líquidos combustíveis e inflamáveis', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-025 CBMSC', name: 'Líquidos inflamáveis e combustíveis', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-25 CBMBA', name: 'Segurança para líquidos inflamáveis', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-25 CBMPE', name: 'Armazenamento de líquidos inflamáveis', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-018 CBMCE', name: 'Líquidos combustíveis e inflamáveis', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-025 CBMDF', name: 'Instalações de combustíveis e inflamáveis', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-25 CBMGO', name: 'Líquidos combustíveis e inflamáveis', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (occ === 'industria_quimica' || occ === 'posto_combustivel') {
        return {
          status: 'severo',
          statusLabel: 'Exigência Crítica / Alto Risco',
          requirement: 'Obrigatório sistema fixo ou semifixo de espuma mecânica, resfriamento contínuo por aspersores para costado e teto de tanques, bacias de contenção estanques dimensionadas para 110% do volume do maior tanque, válvulas corta-chamas e proteção catódica / aterramento estático integral.',
          specs: 'Bacia de contenção: 110% do maior tanque • Espuma: taxa 4 a 6 L/min/m² • Equipamentos elétricos: Certificação Ex (Zonas 0/1/2) • Aterramento: < 10 Ω'
        };
      }
      if (occ === 'deposito_combustivel') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Armazenamento Alto',
          requirement: 'Obrigatório isolamento físico, bacia de contenção de segurança para frascos e tambores, controle estrito de fontes de ignição e ventilação mecânica permanente.',
          specs: 'Contenção secundária para 20% do volume total ou 100% do maior recipiente'
        };
      }
      if (risk === 'alto') {
        return {
          status: 'condicional',
          statusLabel: 'Condicional (Se houver granel/tanque)',
          requirement: 'Exigido caso haja armazenamento de diesel para geradores ou solventes acima dos limites de isenção (geralmente > 250 litros em ambiente interno).',
          specs: 'Limite de isenção: ≤ 250L dentro da edificação (tanque metálico certificado)'
        };
      }
      return {
        status: 'isento',
        statusLabel: 'Não Aplicável / Isento',
        requirement: 'Atividade sem manipulação, processo químico ou estocagem a granel de líquidos combustíveis e inflamáveis.',
        specs: 'Isento conforme Tabela de Exigências do Decreto Estadual'
      };
    }
  },
  {
    id: 'it_extintores',
    category: 'extincao',
    title: 'Sistema de Proteção por Extintores de Incêndio',
    stateNorms: {
      SP: { code: 'IT-21/CBMSP', name: 'Sistema de proteção por extintores de incêndio', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-13 CBMERJ', name: 'Proteção por extintores portáteis e sobre rodas', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-18 CBMMG', name: 'Sistema de proteção por extintores de incêndio', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 21', name: 'Proteção por extintores de incêndio', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 021 CBMPR', name: 'Sistema de extintores de incêndio', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-014 CBMSC', name: 'Sistemas de extintores de incêndio', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-21 CBMBA', name: 'Proteção por extintores', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-21 CBMPE', name: 'Extintores de incêndio portáteis', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-013 CBMCE', name: 'Sistema de proteção por extintores', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-021 CBMDF', name: 'Extintores de incêndio', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-21 CBMGO', name: 'Extintores portáteis e sobre rodas', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Caminhamento Reduzido',
          requirement: 'Distância máxima de caminhamento até o extintor reduzida para apenas 15 metros (risco alto). Obrigatória proteção por extintores com capacidade extintora de alto desempenho (mínimo 4-A:80-B:C), extintor sobre rodas (carreta de 50kg) para áreas amplas e CO2 para quadros elétricos de potência.',
          specs: 'Caminhamento máx.: 15 m • Capacidade mínima: 4-A:80-B:C • Carretas sobre rodas obrigatórias para área > 500 m²'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório por Lei',
          requirement: 'Caminhamento máximo de 20 metros. Mínimo de 2 unidades extintoras por pavimento ou compartimento (sendo 1 unidade 2-A e 1 unidade 20-B:C). Sinalização e demarcação de solo de 1m x 1m.',
          specs: 'Caminhamento máx.: 20 m • Capacidade mínima: 2-A:20-B:C • Suportes fixados a 1,60m de altura máx.'
        };
      }
      return {
        status: 'obrigatorio',
        statusLabel: 'Obrigatório por Lei',
        requirement: 'Caminhamento máximo de 25 metros. Mínimo de 2 unidades por pavimento (tipicamente Pó ABC 4kg ou Água 10L + CO2 6kg).',
        specs: 'Caminhamento máx.: 25 m • Capacidade mínima: 2-A:10-B:C • 100% das edificações'
      };
    }
  },
  {
    id: 'it_hidrantes',
    category: 'extincao',
    title: 'Sistemas de Hidrantes e de Mangotinhos',
    stateNorms: {
      SP: { code: 'IT-22/CBMSP', name: 'Sistemas de hidrantes e mangotinhos', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-04 CBMERJ', name: 'Instalações prediais de hidrantes e mangotinhos', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-17 CBMMG', name: 'Sistema de hidrantes e mangotinhos', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 13', name: 'Instalações de hidrantes e mangotinhos', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 022 CBMPR', name: 'Sistema de hidrantes e mangotinhos', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-007 CBMSC', name: 'Sistemas de hidrantes e mangotinhos', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-22 CBMBA', name: 'Sistema de hidrantes', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-22 CBMPE', name: 'Rede de hidrantes prediais', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-014 CBMCE', name: 'Sistemas de hidrantes e mangotinhos', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-002 CBMDF', name: 'Instalações de hidrantes', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-22 CBMGO', name: 'Sistema de hidrantes urbanos e prediais', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Sistema Tipo 3 / 4',
          requirement: 'Obrigatória rede de hidrantes de alto fluxo (Tipo 3 ou 4) com esguichos reguláveis de alta vazão (300 a 450 L/min por ponto). Reserva Técnica de Incêndio (RTI) calculada para no mínimo 60 minutos de vazão contínua com 2 a 3 hidrantes simultâneos. Conjunto moto-bomba principal elétrica + reserva acionada por motor diesel com partida automática.',
          specs: 'Vazão por hidrante: 300 a 450 L/min • RTI: Mínimo 25m³ a 50m³ • Pressão residual mínima no esguicho: 20 a 30 mca • Mangueiras Tipo 2 ou 4 (2½")'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'condicional',
          statusLabel: 'Condicional (Área > 750m² ou Altura > 12m)',
          requirement: 'Exigido obrigatoriamente se área > 750 m² ou altura superior a 12 metros. Sistema Tipo 2 com mangueiras de 1½" (38mm) e vazão mínima de 150 a 200 L/min por ponto.',
          specs: 'Gatilho: Área > 750 m² • Vazão: 150 a 200 L/min • RTI estimada: 12m³ a 18m³ • Autonomia: 30 min'
        };
      }
      return {
        status: 'condicional',
        statusLabel: 'Isento se ≤ 750m² (Exigido se > 750m²)',
        requirement: 'Isento na maioria dos casos térreos ou de baixo risco com área construída até 750 m². Exigido quando ultrapassar 750 m² ou altura > 12m (Sistema Tipo 1 ou 2).',
        specs: 'Gatilho: Área > 750 m² ou Altura > 12m • RTI compacta: 8m³ a 12m³'
      };
    }
  },
  {
    id: 'it_brigada',
    category: 'gestao',
    title: 'Brigada de Incêndio (ABNT NBR 14276)',
    stateNorms: {
      SP: { code: 'IT-17/CBMSP', name: 'Brigada de incêndio', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-08 CBMERJ', name: 'Brigadas voluntárias contra incêndio', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-12 CBMMG', name: 'Brigada de incêndio', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 15', name: 'Brigada de incêndio', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 017 CBMPR', name: 'Brigada de incêndio', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-028 CBMSC', name: 'Brigada de incêndio', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-17 CBMBA', name: 'Brigada de incêndio', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-17 CBMPE', name: 'Brigada de emergência', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-008 CBMCE', name: 'Brigada de incêndio', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-001 CBMDF', name: 'Brigada contra incêndio e pânico', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-17 CBMGO', name: 'Brigada de incêndio', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Nível Avançado / Profissional',
          requirement: 'Obrigatória composição de Brigada de Incêndio Nível Avançado (mínimo de 24h a 40h de treinamento prático e teórico). Dimensionamento de no mínimo 10% dos funcionários por turno. Treinamento prático semestral em campo de queima com fogo real, uso de EPR (Equipamento de Respiração Autônoma autossuficiente), técnicas de combate a vazamento de produtos químicos e resgate em espaço confinado.',
          specs: 'Efetivo: ≥ 10% por turno • Carga horária: 24h a 40h • Reciclagem: Anual • Simulados: Semestrais com fogo real • EPI: Completo + EPR'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Nível Intermediário',
          requirement: 'Brigada Nível Intermediário (mínimo de 16 horas de capacitação). Dimensionamento de aprox. 6% da população fixa do turno. Treinamento em abandono de local, operação de hidrantes, controle de princípios de incêndio e atendimento pré-hospitalar.',
          specs: 'Efetivo: ~6% da população • Carga: 16 horas • Reciclagem: Anual com certificado e ART'
        };
      }
      return {
        status: 'obrigatorio',
        statusLabel: 'Nível Básico',
        requirement: 'Brigada Nível Básico (mínimo de 8 horas de capacitação). Mínimo de 3% a 5% da população (mínimo de 1 a 2 brigadistas por turno). Conteúdo focado em prevenção, uso de extintores e orientação nas rotas de fuga.',
        specs: 'Efetivo: 3% a 5% • Carga: 8 horas • Reciclagem: Anual'
      };
    }
  },
  {
    id: 'it_sprinklers',
    category: 'extincao',
    title: 'Sistemas de Chuveiros Automáticos (Sprinklers)',
    stateNorms: {
      SP: { code: 'IT-23/CBMSP', name: 'Sistemas de chuveiros automáticos', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-14 CBMERJ', name: 'Sistemas de chuveiros automáticos', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-19 CBMMG', name: 'Sistema de chuveiros automáticos', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 23', name: 'Chuveiros automáticos', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 023 CBMPR', name: 'Chuveiros automáticos', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-015 CBMSC', name: 'Chuveiros automáticos', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-23 CBMBA', name: 'Chuveiros automáticos', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-23 CBMPE', name: 'Sistemas de sprinklers', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-015 CBMCE', name: 'Chuveiros automáticos', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-023 CBMDF', name: 'Sistemas de chuveiros automáticos', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-23 CBMGO', name: 'Chuveiros automáticos para combate', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (occ === 'industria_quimica') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório (Alta Densidade / Dilúvio)',
          requirement: 'Obrigatório sistema de chuveiros automáticos de alta densidade (12 a 20 mm/min/m²) ou sistema de dilúvio aberto acionado por detecção de chama em reatores, tanques de mistura e áreas de processo químico.',
          specs: 'Densidade: 12 a 20 mm/min/m² • Tempo de operação: 60 a 90 min • Bicos especiais resistentes a vapores corrosivos'
        };
      }
      if (occ === 'deposito_combustivel') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório para Depósitos Altos',
          requirement: 'Obrigatório para áreas de armazenamento com altura de estocagem > 3,70m ou área superior a 1200 m², com bicos ESFR (Early Suppression Fast Response) ou sprinkler intra-rack.',
          specs: 'Bicos ESFR K-14 a K-25 • Pressão mínima: 50 a 75 psi no bico mais desfavorável'
        };
      }
      if (risk === 'alto') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório por Risco Alto',
          requirement: 'Exigido para indústrias e depósitos de alto risco com área > 1000m² ou altura > 12m.',
          specs: 'Válvula de Governo e Alarme (VGA) • Manômetros calibrados • Gongo hidráulico'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'condicional',
          statusLabel: 'Condicional (Área > 2500m² ou Shopping)',
          requirement: 'Exigido se área construída superar 2500 m² ou para centros de compras (shoppings), lojas de departamento e hotéis de grande porte.',
          specs: 'Gatilho: Área > 2500 m² ou Altura > 30m • Densidade: 5 a 10 mm/min/m²'
        };
      }
      return {
        status: 'isento',
        statusLabel: 'Isento (Exceto edifícios > 30m)',
        requirement: 'Geralmente dispensado para pequenos e médios edifícios de baixo risco; obrigatório apenas em arranha-céus ou torres acima de 30m.',
        specs: 'Dispensado conforme tabelas estaduais para porte comum'
      };
    }
  },
  {
    id: 'it_alarme_deteccao',
    category: 'deteccao',
    title: 'Sistemas de Detecção e Alarme de Incêndio',
    stateNorms: {
      SP: { code: 'IT-19/CBMSP', name: 'Sistemas de detecção e alarme de incêndio', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-10 CBMERJ', name: 'Sistema de detecção e alarme de incêndio', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-15 CBMMG', name: 'Sistema de detecção e alarme de incêndio', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 19', name: 'Detecção e alarme de incêndio', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 019 CBMPR', name: 'Detecção e alarme de incêndio', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-012 CBMSC', name: 'Detecção e alarme de incêndio', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-19 CBMBA', name: 'Sistemas de detecção e alarme', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-19 CBMPE', name: 'Alarme e detecção de incêndio', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-010 CBMCE', name: 'Sistemas de detecção e alarme', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-019 CBMDF', name: 'Detecção e alarme de incêndio', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-19 CBMGO', name: 'Detecção e alarme de incêndio', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (occ === 'industria_quimica' || risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Óptico UV/IR + Gás',
          requirement: 'Detectores automáticos de radiação de chama (UV/IR) para identificação instantânea de chamas de solventes e hidrocarbonetos. Detectores de concentração de gás e vapores explosivos (LEL) com intertravamento para corte automático de circuitos elétricos e partida de exaustão de emergência. Acionadores manuais blindados com classificação Ex.',
          specs: 'Tecnologia: Chama UV/IR e Gás LEL • Grau de proteção: Ex-d à prova de explosão • Botoeiras a cada 20m'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório por Lei',
          requirement: 'Central de alarme de incêndio endereçável ou convencional com baterias de autonomia de 24h em vigília + 15 min de alarme geral. Acionadores manuais nas saídas e sirenes audiovisuais bitonais em todos os ambientes.',
          specs: 'Pressão sonora mínima: 85 dBA a 3 metros • Distância máx. entre botoeiras: 30 metros • Norma ABNT NBR 17240'
        };
      }
      return {
        status: 'condicional',
        statusLabel: 'Condicional (Área > 750m² ou > 3 Pavimentos)',
        requirement: 'Exigido se a área construída ultrapassar 750 m² ou a edificação possuir mais de 2 pavimentos. Para áreas menores, sistema de botoeira simples ou dispensa em PTS.',
        specs: 'Gatilho: Área > 750 m² ou População > 50 pessoas'
      };
    }
  },
  {
    id: 'it_controle_fumaca',
    category: 'deteccao',
    title: 'Controle de Fumaça & Alívio de Explosão',
    stateNorms: {
      SP: { code: 'IT-15/CBMSP', name: 'Controle de fumaça', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-15 CBMERJ', name: 'Controle e extração de fumaça', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-22 CBMMG', name: 'Controle de fumaça', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 15', name: 'Controle de fumaça', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 015 CBMPR', name: 'Controle de fumaça', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-018 CBMSC', name: 'Controle de fumaça', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-15 CBMBA', name: 'Controle de fumaça', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-15 CBMPE', name: 'Controle e exaustão de fumaça', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-021 CBMCE', name: 'Controle de fumaça', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-015 CBMDF', name: 'Controle e extração de fumaça', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-15 CBMGO', name: 'Controle de fumaça', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (occ === 'industria_quimica') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Exaustão Ex & Alívio',
          requirement: 'Obrigatória exaustão forçada antifaísca para vapores pesados inflamáveis com taxa mínima de 12 a 20 renovações de ar por hora. Painéis de alívio de deflagração (ruptura controlada) dimensionados conforme NBR 15511 / NFPA 68.',
          specs: 'Exaustores certificados Ex • 12 a 20 renovações/h • Painéis de alívio de deflagração na cobertura'
        };
      }
      if (risk === 'alto') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório para Galpões > 1200m²',
          requirement: 'Sistema de extração mecânica ou natural (sheds / venezianas e exaustores gravitacionais) para manter a camada livre de fumaça acima de 2 metros do piso.',
          specs: 'Resistência térmica dos exaustores: 400°C por 120 minutos • Cortinas de fumaça'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'condicional',
          statusLabel: 'Condicional (Subsolos e Áreas > 2000m²)',
          requirement: 'Exigido em subsolos com permanência humana, centros de eventos sem janelas ou depósitos amplos.',
          specs: 'Gatilho: Subsolo comercial ou grande volume fechado'
        };
      }
      return {
        status: 'isento',
        statusLabel: 'Não Aplicável / Isento',
        requirement: 'Dispensa legal em face da ventilação natural abundante por janelas e portas.',
        specs: 'Isento por ventilação perimetral'
      };
    }
  },
  {
    id: 'it_spda',
    category: 'passiva',
    title: 'Proteção Contra Descargas Atmosféricas (SPDA - Para-raios)',
    stateNorms: {
      SP: { code: 'IT-41/CBMSP', name: 'Inspeção visual em SPDA', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-16 CBMERJ', name: 'Proteção contra descargas atmosféricas', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-25 CBMMG', name: 'Proteção contra descargas atmosféricas', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 41', name: 'Proteção contra descargas atmosféricas', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 041 CBMPR', name: 'Proteção contra descargas atmosféricas', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-031 CBMSC', name: 'Sistemas de proteção contra descargas atmosféricas', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-41 CBMBA', name: 'Proteção contra descargas atmosféricas', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-41 CBMPE', name: 'Sistemas de SPDA', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-022 CBMCE', name: 'Proteção contra descargas atmosféricas', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-022 CBMDF', name: 'Sistemas de SPDA', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-41 CBMGO', name: 'Proteção contra descargas atmosféricas', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (occ === 'industria_quimica' || risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Nível I (Máxima Proteção)',
          requirement: 'Obrigatória proteção rigorosa classe Nível I conforme ABNT NBR 5419-3. Malha Faraday de captação densa de 5x5 metros, anéis de cintamento intermediários e equalização de potencial em todas as massas metálicas para impedir centelhas estáticas em atmosfera explosiva. Laudo técnico anual com ensaio de continuidade.',
          specs: 'Nível I de proteção • Malha: 5 x 5 m • DPS Classe I + II nos quadros elétricos • Laudo anual com ART'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'condicional',
          statusLabel: 'Condicional (Análise de Risco NBR 5419-2)',
          requirement: 'Exigido se o cálculo de gerenciamento de risco ou a área da edificação indicar necessidade de proteção (tipicamente Nível II ou III).',
          specs: 'Nível II ou III • Malha 10x10m ou 15x15m • Laudo periódico'
        };
      }
      return {
        status: 'condicional',
        statusLabel: 'Condicional (Altura > 12m ou Área > 750m²)',
        requirement: 'Geralmente dispensado em edificações térreas unifamiliares ou de pequeno porte; exigido para edifícios multifamiliares ou com área > 750m².',
        specs: 'Conforme cálculo de risco da NBR 5419-2'
      };
    }
  },
  {
    id: 'it_isolamento_risco',
    category: 'passiva',
    title: 'Separação entre Edificações (Isolamento de Risco)',
    stateNorms: {
      SP: { code: 'IT-07/CBMSP', name: 'Separação entre edificações (isolamento de risco)', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-02 CBMERJ', name: 'Isolamento de riscos e separação entre edificações', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-06 CBMMG', name: 'Separação entre edificações', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 07', name: 'Separação entre edificações', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 007 CBMPR', name: 'Separação entre edificações', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-005 CBMSC', name: 'Isolamento de riscos', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-07 CBMBA', name: 'Separação entre edificações', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-07 CBMPE', name: 'Isolamento entre edificações', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-003 CBMCE', name: 'Separação e isolamento de riscos', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-007 CBMDF', name: 'Isolamento de risco', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-07 CBMGO', name: 'Separação entre edificações', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Afastamento Severo',
          requirement: 'Obrigatório isolamento físico por distância de segurança calculada (no mínimo 6m a 15m de afastamento de divisas e outros blocos) ou construção de parede corta-fogo cega sem aberturas com TRRF de 180 minutos (3 horas).',
          specs: 'Afastamento mínimo: 6 a 15 metros • Parede cega TRRF 180 min • Proibido aberturas envidraçadas comuns'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'condicional',
          statusLabel: 'Condicional (Afastamento entre Blocos)',
          requirement: 'Necessário para evitar a soma das áreas construídas de blocos adjacentes para fins de exigência de hidrantes e sprinklers.',
          specs: 'Distância mínima de 3m a 6m entre fachadas paralelas'
        };
      }
      return {
        status: 'condicional',
        statusLabel: 'Condicional',
        requirement: 'Aplica-se em condomínios para verificar isolamento entre blocos residenciais ou comerciais.',
        specs: 'Conforme tabela de abertura e radiação térmica da IT'
      };
    }
  },
  {
    id: 'it_trrf',
    category: 'passiva',
    title: 'Segurança Estrutural contra Incêndio (TRRF)',
    stateNorms: {
      SP: { code: 'IT-08/CBMSP', name: 'Segurança estrutural contra incêndio', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-03 CBMERJ', name: 'Resistência ao fogo das estruturas (TRRF)', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-07 CBMMG', name: 'Segurança estrutural das edificações', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 08', name: 'Resistência ao fogo das estruturas', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 008 CBMPR', name: 'Segurança estrutural contra incêndio', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-003 CBMSC', name: 'Segurança estrutural', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-08 CBMBA', name: 'Segurança estrutural', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-08 CBMPE', name: 'Resistência estrutural ao fogo', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-004 CBMCE', name: 'Segurança estrutural contra incêndio', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-008 CBMDF', name: 'Segurança estrutural contra incêndio', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-08 CBMGO', name: 'Segurança estrutural', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - TRRF 90 a 120 min',
          requirement: 'Tempo Requerido de Resistência ao Fogo elevado (90 a 120 minutos) para vigas, pilares e treliças principais. Estruturas metálicas devem receber proteção passiva ensaiada (tinta intumescente ou argamassa projetada) com laudo de espessura de película seca e ART.',
          specs: 'TRRF estrutural: 90 a 120 minutos • Laudo de espessura de tinta intumescente com ART'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório - TRRF 60 a 90 min',
          requirement: 'Pilares e vigas portantes com TRRF de 60 a 90 minutos conforme altura da edificação e carga de fogo.',
          specs: 'TRRF estrutural: 60 a 90 minutos'
        };
      }
      return {
        status: 'condicional',
        statusLabel: 'Isento se Térreo / TRRF 30 a 60 min',
        requirement: 'Geralmente dispensado para edificações térreas de pequena área com saída direta; exigido para edifícios de múltiplos andares (TRRF 30 a 60 min).',
        specs: 'Isento para edificações térreas de pequeno porte'
      };
    }
  },
  {
    id: 'it_compartimentacao',
    category: 'passiva',
    title: 'Compartimentação Horizontal e Vertical',
    stateNorms: {
      SP: { code: 'IT-09/CBMSP', name: 'Compartimentação horizontal e vertical', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-05 CBMERJ', name: 'Compartimentação horizontal e vertical', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-08 CBMMG', name: 'Compartimentação horizontal e vertical', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 09', name: 'Compartimentação de áreas', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 009 CBMPR', name: 'Compartimentação horizontal e vertical', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-004 CBMSC', name: 'Compartimentação de áreas', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-09 CBMBA', name: 'Compartimentação', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-09 CBMPE', name: 'Compartimentação de áreas', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-005 CBMCE', name: 'Compartimentação contra incêndio', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-009 CBMDF', name: 'Compartimentação', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-09 CBMGO', name: 'Compartimentação horizontal e vertical', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Paredes e Portas P-120',
          requirement: 'Obrigatória compartimentação horizontal entre áreas de risco severo e demais setores. Paredes corta-fogo com TRRF de 120 a 180 minutos e portas corta-fogo classe P-90 ou P-120 dotadas de fechadores automáticos. Selagem firestop intumescente em 100% das passagens de cabos, tubulações e dutos de climatização.',
          specs: 'Paredes TRRF: 120/180 min • Portas P-90/P-120 • Selagem de shafts (Firestop NBR 6479)'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'condicional',
          statusLabel: 'Condicional (Áreas > 1000m² ou Pavimentos)',
          requirement: 'Exigida para limitar a área máxima de propagação horizontal (tipicamente a cada 1000m² a 2000m²) e selagem vertical de shafts entre lajes.',
          specs: 'Área máxima de compartimentação: 1000 a 2000 m² sem chuveiros automáticos'
        };
      }
      return {
        status: 'condicional',
        statusLabel: 'Isento se Unifamiliar / Condicional em Torres',
        requirement: 'Dispensado para térreos ou pequenas lojas; exigido entre unidades autônomas em condomínios residenciais.',
        specs: 'Paredes divisórias entre unidades com TRRF 60 min'
      };
    }
  },
  {
    id: 'it_cmar',
    category: 'passiva',
    title: 'Controle de Materiais de Acabamento e Revestimento (CMAR)',
    stateNorms: {
      SP: { code: 'IT-10/CBMSP', name: 'Controle de materiais de acabamento e de revestimento (CMAR)', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-06 CBMERJ', name: 'Controle de materiais de acabamento e revestimento', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-09 CBMMG', name: 'Controle de materiais de acabamento e revestimento', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 10', name: 'Materiais de acabamento e revestimento', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 010 CBMPR', name: 'Controle de materiais de acabamento (CMAR)', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-010 CBMSC', name: 'Materiais de acabamento e revestimento', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-10 CBMBA', name: 'CMAR', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-10 CBMPE', name: 'Controle de materiais', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-006 CBMCE', name: 'Controle de materiais de revestimento', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-010 CBMDF', name: 'CMAR', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-10 CBMGO', name: 'Controle de materiais de acabamento', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Classe I (Incombustível)',
          requirement: 'Exigência rigorosa de Materiais Classe I (incombustíveis) em pisos, forros e paredes das zonas de processo e estocagem. Proibição absoluta de espumas plásticas expostas, isolamentos térmicos combustíveis (EPS/PUD) sem barreira corta-fogo ensaiada em laboratório.',
          specs: 'Classe I (Incombustível) • Índice de propagação de chama Ip = 0 • Densidade ótica de fumaça controlada'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório - Classe II-A ou III-A',
          requirement: 'Materiais com baixa velocidade de propagação superficial de chama e baixa taxa de emissão de fumaça tóxica nas rotas de fuga.',
          specs: 'Pisos: até Classe II-A • Paredes e Forros: até Classe II-A • Laudo IPT ou similar'
        };
      }
      return {
        status: 'obrigatorio',
        statusLabel: 'Obrigatório por Lei',
        requirement: 'Exigência de pisos, tetos e divisórias em conformidade com as classes admissíveis para a ocupação (geralmente Classe III-A ou IV-A).',
        specs: 'Atestado de CMAR com ART do responsável técnico'
      };
    }
  },
  {
    id: 'it_saidas',
    category: 'passiva',
    title: 'Saídas de Emergência, Portas e Escadas',
    stateNorms: {
      SP: { code: 'IT-11/CBMSP', name: 'Saídas de emergência', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-07 CBMERJ', name: 'Saídas de emergência e escadas de segurança', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-10 CBMMG', name: 'Saídas de emergência em edificações', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 11', name: 'Saídas de emergência', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 011 CBMPR', name: 'Saídas de emergência', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-009 CBMSC', name: 'Saídas de emergência', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-11 CBMBA', name: 'Saídas de emergência', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-11 CBMPE', name: 'Dimensionamento de saídas de emergência', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-007 CBMCE', name: 'Saídas de emergência', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-011 CBMDF', name: 'Saídas de emergência', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-11 CBMGO', name: 'Saídas de emergência', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Distância Reduzida',
          requirement: 'Distância máxima de percurso restrita a apenas 15 metros (com 1 saída) ou 20 a 35 metros (com mais de uma saída independente). Portas com abertura no sentido do fluxo de fuga e ferragens antipânico de pressão (NBR 11785). Proibido trancas, correntes ou cadeados.',
          specs: 'Caminhamento máx.: 15 a 20 m • Barra antipânico NBR 11785 • Largura mínima das saídas: 1,20m a 2,20m'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório por Lei',
          requirement: 'Caminhamento máximo de 25 a 35 metros. Cálculo de Unidades de Passagem (UP) dimensionado para a população total do setor.',
          specs: 'Caminhamento máx.: 25 a 35 m • UP = 0,55m por módulo • Portas de rota abrindo no sentido de saída'
        };
      }
      return {
        status: 'obrigatorio',
        statusLabel: 'Obrigatório por Lei',
        requirement: 'Caminhamento de até 35 a 45 metros. Portas com largura mínima livre de 0,80m a 1,10m e corredores desobstruídos.',
        specs: 'Caminhamento máx.: 35 a 45 m • Saídas livres de obstáculos'
      };
    }
  },
  {
    id: 'it_peci',
    category: 'gestao',
    title: 'Plano de Emergência Contra Incêndio (PECI)',
    stateNorms: {
      SP: { code: 'IT-16/CBMSP', name: 'Plano de emergência contra incêndio (PECI)', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-12 CBMERJ', name: 'Plano de emergência contra incêndio', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-13 CBMMG', name: 'Plano de emergência contra incêndio', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 16', name: 'Plano de emergência', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 016 CBMPR', name: 'Plano de emergência', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-029 CBMSC', name: 'Plano de emergência contra incêndio', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-16 CBMBA', name: 'Plano de emergência', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-16 CBMPE', name: 'Plano de emergência', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-012 CBMCE', name: 'Plano de emergência', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-016 CBMDF', name: 'Plano de emergência', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-16 CBMGO', name: 'Plano de emergência contra incêndio', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Registro no CB & PAM',
          requirement: 'Obrigatória elaboração e registro de PECI integral. Definição minuciosa de cenários acidentais de explosão, vazamento e incêndio químico, procedimentos de abandono rápido, definição de Ponto de Encontro a barlavento e integração com o Plano de Auxílio Mútuo (PAM) da região.',
          specs: 'Protocolo formal junto ao CB • Simulado de abandono semestral • Ponto de encontro a barlavento'
        };
      }
      if (risk === 'medio') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório para AVCB',
          requirement: 'Obrigatório para todas as edificações submetidas a Projeto Técnico (AVCB). Documento impresso mantido na portaria/administração com fluxogramas de abandono.',
          specs: 'Exercício simulado anual • Plantas de rotas afixadas nos pavimentos'
        };
      }
      return {
        status: 'condicional',
        statusLabel: 'Recomendado / Dispensado em PTS',
        requirement: 'Geralmente dispensado de protocolo para edificações de baixo risco enquadradas em Processo Técnico Simplificado (PTS/CLCB).',
        specs: 'Recomendadas noções de emergência para ocupantes'
      };
    }
  },
  {
    id: 'it_iluminacao',
    category: 'deteccao',
    title: 'Sistema de Iluminação de Emergência',
    stateNorms: {
      SP: { code: 'IT-18/CBMSP', name: 'Iluminação de emergência', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-09 CBMERJ', name: 'Sistema de iluminação de emergência', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-14 CBMMG', name: 'Iluminação de emergência', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 18', name: 'Iluminação de emergência', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 018 CBMPR', name: 'Iluminação de emergência', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-011 CBMSC', name: 'Iluminação de emergência', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-18 CBMBA', name: 'Iluminação de emergência', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-18 CBMPE', name: 'Sistema de iluminação de emergência', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-009 CBMCE', name: 'Iluminação de emergência', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-018 CBMDF', name: 'Iluminação de emergência', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-18 CBMGO', name: 'Iluminação de emergência', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório - Luminárias Blindadas Ex',
          requirement: 'Obrigatório sistema de iluminação de emergência autônomo ou centralizado com autonomia mínima de 2 horas. Em áreas com vapores combustíveis (I-3), as luminárias devem ter invólucro estanque à prova de explosão (grau de proteção IP-66 / Ex-d).',
          specs: 'Autonomia: 2 horas mínimas • Luminárias Ex-d em áreas classificadas • Nível mínimo: 5 lux em escadas'
        };
      }
      return {
        status: 'obrigatorio',
        statusLabel: 'Obrigatório por Lei',
        requirement: 'Blocos autônomos de LED instalados em rotas de fuga, desníveis, portas e escadas, assegurando iluminamento mínimo de 3 a 5 lux no piso.',
        specs: 'Autonomia mínima: 2 horas • ABNT NBR 10898'
      };
    }
  },
  {
    id: 'it_sinalizacao',
    category: 'deteccao',
    title: 'Sinalização Fotoluminescente de Emergência',
    stateNorms: {
      SP: { code: 'IT-20/CBMSP', name: 'Sinalização de emergência', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-11 CBMERJ', name: 'Sinalização de segurança contra incêndio e pânico', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-16 CBMMG', name: 'Sinalização de emergência', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 20', name: 'Sinalização de emergência', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 020 CBMPR', name: 'Sinalização de emergência', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-013 CBMSC', name: 'Sinalização de emergência', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-20 CBMBA', name: 'Sinalização de emergência', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-20 CBMPE', name: 'Sinalização de segurança', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-011 CBMCE', name: 'Sinalização de emergência', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-020 CBMDF', name: 'Sinalização de emergência', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-20 CBMGO', name: 'Sinalização de segurança contra incêndio', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Sinalização de Risco Químico',
          requirement: 'Obrigatórias placas fotoluminescentes de alta intensidade (mínimo 140 mcd/m² aos 10 minutos). Placas de identificação de rota, saídas e equipamentos, complementadas com placas de advertência de risco químico, proibição de fumo/faísca e Diamante de Hommel (NFPA 704).',
          specs: 'Fotoluminescência: ≥ 140 mcd/m² aos 10 min • Sinalização de produtos perigosos • NBR 13434'
        };
      }
      return {
        status: 'obrigatorio',
        statusLabel: 'Obrigatório por Lei',
        requirement: 'Sinalização de orientação, salvamento, alerta e equipamentos conforme padrão ABNT NBR 13434 com efeito fotoluminescente atestado.',
        specs: '100% das edificações e pavimentos'
      };
    }
  },
  {
    id: 'it_produtos_perigosos',
    category: 'especiais',
    title: 'Armazenamento de Produtos Químicos e Perigosos',
    stateNorms: {
      SP: { code: 'IT-32/CBMSP', name: 'Produtos perigosos em edificações e áreas de risco', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 3-04 CBMERJ', name: 'Armazenamento e manipulação de produtos perigosos', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-33 CBMMG', name: 'Armazenamento de produtos perigosos', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 32', name: 'Armazenamento de produtos perigosos', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 032 CBMPR', name: 'Produtos perigosos', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-026 CBMSC', name: 'Armazenamento de produtos perigosos', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-32 CBMBA', name: 'Produtos perigosos', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-32 CBMPE', name: 'Produtos perigosos', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-023 CBMCE', name: 'Produtos perigosos', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-032 CBMDF', name: 'Produtos perigosos', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-32 CBMGO', name: 'Produtos perigosos', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (occ === 'industria_quimica' || occ === 'deposito_combustivel') {
        return {
          status: 'severo',
          statusLabel: 'Exigência Crítica / Alto Risco',
          requirement: 'Obrigatório manter inventário atualizado das substâncias perigosas, livro de FISPQs/FDSs na portaria principal e bacias de contenção para retenção de efluentes contaminados resultantes da ação de combate dos Bombeiros.',
          specs: 'Livro de FISPQs na entrada • Bacia para retenção de águas de combate contaminadas • NBR 17505'
        };
      }
      return {
        status: 'isento',
        statusLabel: 'Não Aplicável / Isento',
        requirement: 'Atividade sem estoque relevante ou manipulação de produtos químicos tóxicos, corrosivos ou oxidantes.',
        specs: 'Isento por ausência de carga química perigosa'
      };
    }
  },
  {
    id: 'it_subestacao',
    category: 'especiais',
    title: 'Subestações Elétricas e Geradores de Energia',
    stateNorms: {
      SP: { code: 'IT-37/CBMSP', name: 'Subestação elétrica', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-18 CBMERJ', name: 'Subestações e geradores de emergência', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-30 CBMMG', name: 'Subestações elétricas', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 37', name: 'Subestações elétricas', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 037 CBMPR', name: 'Subestações elétricas', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-022 CBMSC', name: 'Subestações elétricas', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-37 CBMBA', name: 'Subestação elétrica', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-37 CBMPE', name: 'Subestações elétricas', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-020 CBMCE', name: 'Subestações e instalações elétricas', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-037 CBMDF', name: 'Subestações elétricas', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-37 CBMGO', name: 'Subestações elétricas', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório - Equipamentos Ex & Zonas',
          requirement: 'Obrigatório laudo de Classificação de Áreas (Zonas 0, 1 e 2 - ABNT NBR IEC 60079). Paredes corta-fogo com TRRF 120min para salas de transformadores e geradores, e sistema fixo de inundação por CO2 ou agente limpo em salas elétricas no-break.',
          specs: 'Estudo de classificação de zonas Ex • Parede corta-fogo TRRF 120 min • Bacia de contenção de óleo'
        };
      }
      return {
        status: 'condicional',
        statusLabel: 'Condicional (Se houver Transformador / Gerador)',
        requirement: 'Exigido caso o imóvel possua cabine primária/subestação própria ou grupo moto-gerador a diesel.',
        specs: 'Portas corta-fogo P-90 • Extintor de CO2 6kg exclusivo'
      };
    }
  },
  {
    id: 'it_gases_espuma',
    category: 'extincao',
    title: 'Sistemas Fixos de Gases Limpos e Espuma Mecânica',
    stateNorms: {
      SP: { code: 'IT-26/CBMSP', name: 'Sistema fixo de gases para combate a incêndio', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-17 CBMERJ', name: 'Sistemas fixos de gases limpos e agentes especiais', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-23 CBMMG', name: 'Sistemas fixos de agentes especiais', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 26', name: 'Sistemas fixos de gases', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 026 CBMPR', name: 'Sistemas fixos de gases', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-016 CBMSC', name: 'Sistemas fixos de gases e agentes especiais', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-26 CBMBA', name: 'Sistemas fixos de gases', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-26 CBMPE', name: 'Agentes especiais de combate', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-019 CBMCE', name: 'Sistemas de gases e agentes limpos', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-026 CBMDF', name: 'Sistemas fixos de gases', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-26 CBMGO', name: 'Sistemas de agentes limpos', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (occ === 'industria_quimica') {
        return {
          status: 'severo',
          statusLabel: 'Obrigatório para Tanques e Reatores',
          requirement: 'Obrigatório sistema fixo de dosagem de líquido gerador de espuma (LGE resistente a álcool AR-AFFF) e canhões monitores para extinção de fogo de classe B em tanques de processo.',
          specs: 'LGE tipo AFFF-AR • Proporcionadores calibrados • Válvulas direcionais de acionamento rápido'
        };
      }
      if (risk === 'alto') {
        return {
          status: 'condicional',
          statusLabel: 'Condicional (Data Centers / Salas Críticas)',
          requirement: 'Exigido em salas de servidores de grande porte ou CPDs onde o uso de água danificaria equipamentos vitais.',
          specs: 'Gases FM-200, Novec 1230 ou CO2 com pré-alarme e interrupção de ventilação'
        };
      }
      return {
        status: 'isento',
        statusLabel: 'Não Aplicável / Isento',
        requirement: 'Não exigido para ocupações sem processos de risco químico concentrado ou data centers de grande porte.',
        specs: 'Isento por inexistência de risco especial'
      };
    }
  },
  {
    id: 'it_glp',
    category: 'especiais',
    title: 'Gás Liquefeito de Petróleo (GLP) e Gás Natural',
    stateNorms: {
      SP: { code: 'IT-28/CBMSP', name: 'Manipulação, armazenamento e utilização de GLP', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 3-01 CBMERJ', name: 'Instalações centrais de GLP e gás canalizado', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-21 CBMMG', name: 'Gás liquefeito de petróleo (GLP)', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 28', name: 'Instalações centrais e uso de GLP', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 028 CBMPR', name: 'Gás liquefeito de petróleo', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-024 CBMSC', name: 'Instalações de GLP', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-28 CBMBA', name: 'Centrais de GLP', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-28 CBMPE', name: 'Instalações de gás', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-017 CBMCE', name: 'Instalações de gás canalizado e GLP', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-028 CBMDF', name: 'Armazenamento e uso de GLP', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-28 CBMGO', name: 'Instalações de GLP e gás natural', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      return {
        status: 'condicional',
        statusLabel: 'Condicional (Se utilizar gás canalizado/GLP)',
        requirement: 'Exigido se o estabelecimento utilizar cilindros de GLP ou central de gás. Central deve situar-se em local aberto, arejado, com afastamento mínimo de ralos, fontes de calor e divisas, além de extintor de pó químico adjacente.',
        specs: 'Central externa ventilada • Afastamentos de segurança: 1,5m a 6m • Válvulas de alívio e bloqueio'
      };
    }
  },
  {
    id: 'it_acesso_viaturas',
    category: 'passiva',
    title: 'Acesso de Viaturas na Edificação e Áreas de Risco',
    stateNorms: {
      SP: { code: 'IT-06/CBMSP', name: 'Acesso de viatura na edificação e áreas de risco', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 2-01 CBMERJ', name: 'Acesso de viaturas e áreas de operação', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-05 CBMMG', name: 'Acesso de viaturas às edificações', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 06', name: 'Acesso de viaturas', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 006 CBMPR', name: 'Acesso de viaturas às edificações', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-006 CBMSC', name: 'Acesso de viaturas', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-06 CBMBA', name: 'Acesso de viaturas', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-06 CBMPE', name: 'Acesso para viaturas de emergência', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-002 CBMCE', name: 'Acesso de viaturas na edificação', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-006 CBMDF', name: 'Acesso de viaturas operacionais', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-06 CBMGO', name: 'Acesso de viaturas na edificação', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'obrigatorio',
          statusLabel: 'Obrigatório - Vias de Circulação Pesada',
          requirement: 'Vias internas transitáveis com largura livre mínima de 4,00m e gabarito vertical de 4,50m livres de fios e galhos para trânsito livre de autobombas e autoescadas dos Bombeiros. Capacidade de suporte no piso de no mínimo 25 toneladas.',
          specs: 'Largura mínima: 4,00 m • Altura livre: 4,50 m • Capacidade estrutural da pista: 25 toneladas'
        };
      }
      return {
        status: 'condicional',
        statusLabel: 'Condicional (Condomínios e Galpões)',
        requirement: 'Exigido em loteamentos fechados, condomínios de prédios e parques industriais com vias internas de circulação.',
        specs: 'Portões com abertura rápida e largura livre mínima de 4,00m'
      };
    }
  },
  {
    id: 'it_procedimentos',
    category: 'gestao',
    title: 'Procedimentos Administrativos & Processo Legal',
    stateNorms: {
      SP: { code: 'IT-01/CBMSP', name: 'Procedimentos administrativos (PT / PTS / FAT)', amparo: 'Decreto Estadual nº 63.911/2018' },
      RJ: { code: 'NT 1-01 CBMERJ', name: 'Procedimentos administrativos e regularização', amparo: 'Decreto Estadual nº 42/2018 (COSCIP)' },
      MG: { code: 'IT-01 CBMMG', name: 'Procedimentos administrativos (PSCIP / PTS)', amparo: 'Decreto Estadual nº 47.998/2020' },
      RS: { code: 'RTCBMRS 01', name: 'Procedimentos administrativos (PPCI / PSPCI)', amparo: 'Lei Complementar nº 14.376/2013' },
      PR: { code: 'NPT 001 CBMPR', name: 'Procedimentos administrativos', amparo: 'Lei Estadual nº 19.449/2018' },
      SC: { code: 'IN-001 CBMSC', name: 'Procedimentos administrativos', amparo: 'Lei Estadual nº 16.157/2013' },
      BA: { code: 'IT-01 CBMBA', name: 'Procedimentos administrativos', amparo: 'Decreto Estadual nº 16.302/2015' },
      PE: { code: 'NT-01 CBMPE', name: 'Procedimentos administrativos', amparo: 'Lei Estadual nº 11.186/1994' },
      CE: { code: 'NT-001 CBMCE', name: 'Procedimentos administrativos e regularização', amparo: 'Lei Estadual nº 13.556/2004' },
      DF: { code: 'NT-001 CBMDF', name: 'Procedimentos administrativos para licenciamento', amparo: 'Decreto Distrital nº 21.361/2000' },
      GO: { code: 'NT-01 CBMGO', name: 'Procedimentos administrativos', amparo: 'Lei Estadual nº 15.802/2006' }
    },
    evaluate: (occ, risk) => {
      if (risk === 'alto') {
        return {
          status: 'severo',
          statusLabel: 'Projeto Técnico Completo (AVCB Obrigatório)',
          requirement: 'Obrigatório trâmite formal de Projeto Técnico (PT/PSCIP/PPCI) com análise rigorosa da comissão técnica de engenharia dos Bombeiros, apresentação de memoriais de cálculo de espuma/hidrantes e vistoria presencial para concessão de AVCB.',
          specs: 'Modalidade: Projeto Técnico (PT) • ART/RRT de projeto e execução • Vistoria in loco compulsória'
        };
      }
      return {
        status: 'obrigatorio',
        statusLabel: 'Enquadramento Legal Conforme Metragem',
        requirement: 'Áreas até 750 m² tramitam por Processo Simplificado (CLCB/PTS); áreas superiores a 750 m² exigem Projeto Técnico pleno com vistoria presencial.',
        specs: 'Linha de corte de 750 m² e altura de 12m'
      };
    }
  }
];

function getCategoryName(cat) {
  switch (cat) {
    case 'extincao': return 'Sistemas Ativos de Extinção';
    case 'deteccao': return 'Detecção, Alarme e Evacuação';
    case 'passiva': return 'Proteção Passiva e Estrutural';
    case 'gestao': return 'Gestão, Brigada e Operação';
    case 'especiais': return 'Riscos Especiais & Instalações';
    default: return 'Geral';
  }
}

function setupItsMatrixExplorer() {
  const stateSelect = document.getElementById('matrixStateSelect');
  const occSelect = document.getElementById('matrixOccupationSelect');
  const searchInput = document.getElementById('matrixSearchInput');
  const catButtons = document.querySelectorAll('#categoryFilterButtons .btn-filter');
  const printMatrixBtn = document.getElementById('btnPrintMatrixReport');
  const syncBtn = document.getElementById('btnSyncAndGoMatrix');

  let currentCategory = 'all';

  function updateView() {
    const selectedState = stateSelect ? stateSelect.value : 'SP';
    const selectedOcc = occSelect ? occSelect.value : 'industria_quimica';
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

    renderItsMatrix({
      stateKey: selectedState,
      occupationKey: selectedOcc,
      category: currentCategory,
      searchQuery
    });
  }

  if (stateSelect) {
    stateSelect.addEventListener('change', updateView);
  }

  if (occSelect) {
    occSelect.addEventListener('change', updateView);
  }

  if (searchInput) {
    searchInput.addEventListener('input', updateView);
  }

  if (catButtons) {
    catButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category') || 'all';
        updateView();
      });
    });
  }

  if (printMatrixBtn) {
    printMatrixBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      const calcState = document.getElementById('selectState')?.value || 'SP';
      const calcOcc = document.getElementById('selectOccupation')?.value || 'comercial_varejo';
      
      if (stateSelect) stateSelect.value = calcState;
      if (occSelect) occSelect.value = calcOcc;
      
      updateView();
      
      const matrixSection = document.getElementById('matriz-its');
      if (matrixSection) {
        matrixSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Render inicial com os valores padrão (I-3 em SP)
  updateView();
}

function renderItsMatrix(params) {
  const { stateKey, occupationKey, category, searchQuery } = params;

  const stateData = STATES_DATABASE[stateKey] || STATES_DATABASE['SP'];
  const occData = OCCUPATION_DATABASE[occupationKey] || OCCUPATION_DATABASE['industria_quimica'];
  const riskGrade = occData.baseRisk;

  // 1. Resumo Executivo da Ocupação no Estado Selecionado
  const summaryBanner = document.getElementById('matrixSummaryBanner');
  if (summaryBanner) {
    const riskBadgeClass = riskGrade === 'alto' ? 'alto' : (riskGrade === 'medio' ? 'medio' : 'baixo');
    const riskBadgeText = riskGrade === 'alto' ? 'Alto Risco (Carga Severa)' : (riskGrade === 'medio' ? 'Médio Risco' : 'Baixo Risco');

    summaryBanner.innerHTML = `
      <div class="summary-state-info">
        <h3>
          <span class="brand-icon-wrapper" style="width: 32px; height: 32px; font-size: 0.85rem;">${stateKey}</span>
          ${stateData.corpo} (${stateKey})
        </h3>
        <p><strong>Norma Regulamentadora Estadual:</strong> ${stateData.normaGeral}</p>
        <p><strong>Atividade Selecionada:</strong> ${occData.code} - ${occData.name}</p>
        <div class="summary-badges-row">
          <span class="risk-badge ${riskBadgeClass}" style="font-size: 0.8rem; padding: 0.3rem 0.75rem;">
            ${riskBadgeText} (~${occData.fireLoad} MJ/m²)
          </span>
          <span style="font-size: 0.8rem; background: var(--color-secondary-subtle); color: var(--color-secondary); padding: 0.3rem 0.75rem; border-radius: 4px; font-weight: 600;">
            Portal: ${stateData.portal}
          </span>
          <span style="font-size: 0.8rem; background: var(--bg-surface-secondary); color: var(--text-main); padding: 0.3rem 0.75rem; border-radius: 4px; font-weight: 600;">
            Licença Obrigatória: ${riskGrade === 'alto' ? stateData.docGrande : stateData.docPequeno}
          </span>
        </div>
      </div>
      <div class="summary-quick-stats">
        <div class="summary-stat-line">
          <span>Norma de Brigada:</span>
          <strong>${stateData.brigadaNorma}</strong>
        </div>
        <div class="summary-stat-line">
          <span>Norma de Hidrantes:</span>
          <strong>${stateData.hidranteNorma}</strong>
        </div>
        <div class="summary-stat-line">
          <span>Tipo de Vistoria:</span>
          <strong>${riskGrade === 'alto' ? 'Presencial Obrigatória (PT)' : 'Processo Simplificado / Eletrônico'}</strong>
        </div>
      </div>
    `;
  }

  // 2. Filtragem das Instruções Técnicas
  const filteredIts = ALL_ITS_DATABASE.filter(it => {
    // Filtro de categoria
    if (category !== 'all' && it.category !== category) {
      return false;
    }

    // Filtro de busca textual
    if (searchQuery) {
      const stateNorm = it.stateNorms[stateKey] || it.stateNorms['SP'];
      const evalData = it.evaluate(occupationKey, riskGrade);

      const targetText = [
        it.title,
        stateNorm.code,
        stateNorm.name,
        stateNorm.amparo,
        evalData.requirement,
        evalData.specs,
        evalData.statusLabel
      ].join(' ').toLowerCase();

      if (!targetText.includes(searchQuery)) {
        return false;
      }
    }

    return true;
  });

  // 3. Contadores de Status
  let countSevero = 0;
  let countObrigatorio = 0;
  let countCondicional = 0;
  let countIsento = 0;

  filteredIts.forEach(it => {
    const evalData = it.evaluate(occupationKey, riskGrade);
    if (evalData.status === 'severo') countSevero++;
    else if (evalData.status === 'obrigatorio') countObrigatorio++;
    else if (evalData.status === 'condicional') countCondicional++;
    else countIsento++;
  });

  const counterEl = document.getElementById('matrixResultsCounter');
  if (counterEl) {
    counterEl.innerHTML = `Exibindo <strong>${filteredIts.length}</strong> Instruções Técnicas para <strong>${occData.code}</strong> em <strong>${stateData.name}</strong> (${countSevero > 0 ? `<strong>${countSevero}</strong> severas, ` : ''}<strong>${countObrigatorio}</strong> obrigatórias, <strong>${countCondicional}</strong> condicionais)`;
  }

  // 4. Renderização dos Cards no Grid
  const cardsGrid = document.getElementById('matrixCardsGrid');
  if (!cardsGrid) return;

  if (filteredIts.length === 0) {
    cardsGrid.innerHTML = `
      <div class="empty-history" style="grid-column: 1 / -1; padding: 3rem 1rem;">
        <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 0.75rem auto; color: var(--text-muted);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p style="font-weight: 600;">Nenhuma Instrução Técnica encontrada para "${searchQuery}".</p>
        <p style="font-size: 0.85rem; margin-top: 0.25rem;">Tente pesquisar por outros termos como "hidrante", "espuma", "brigada", "extintor" ou altere a categoria.</p>
      </div>
    `;
    return;
  }

  cardsGrid.innerHTML = filteredIts.map(it => {
    const stateNorm = it.stateNorms[stateKey] || it.stateNorms['SP'];
    const evalData = it.evaluate(occupationKey, riskGrade);

    return `
      <div class="it-card ${evalData.status}">
        <div class="it-card-top">
          <span class="it-code-tag">${stateNorm.code}</span>
          <span class="it-status-chip ${evalData.status}">
            <span class="legend-dot"></span>
            ${evalData.statusLabel}
          </span>
        </div>
        <h4 class="it-title">${it.title}</h4>
        <span class="it-category-pill">${getCategoryName(it.category)}</span>
        <p class="it-requirement-text">${evalData.requirement}</p>
        <div class="it-specs-box">
          <strong>Parâmetros Técnicos & Dimensionamento:</strong>
          <span class="it-specs-value">${evalData.specs}</span>
        </div>
        <div class="it-card-footer">
          <span class="it-legal-ref">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ${stateNorm.amparo}
          </span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${stateData.corpo.split(' ')[0]}</span>
        </div>
      </div>
    `;
  }).join('');
}
