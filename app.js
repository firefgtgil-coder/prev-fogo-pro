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
