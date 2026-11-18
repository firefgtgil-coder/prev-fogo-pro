# 🛡️ FireSafe PRO | Controle de Emergências & Prevenção Contra Incêndio

Plataforma corporativa de engenharia para cálculo automático de Grau de Risco, Matriz de ITs por Estado, definição de documento obrigatório (**CLCB** ou **AVCB**), dimensionamento de **Brigada de Incêndio (ABNT NBR 14276)** e especificação de equipamentos mínimos exigidos conforme as Instruções Técnicas dos Corpos de Bombeiros Militares estaduais.

---

## 🚀 Funcionalidades

- **Controle de Emergências Integrado**: Identificação de perigos (NFPA / Hommel), plano de emergência e matriz legal de resposta.
- **Matriz de ITs por Estado**: Consulta dinâmica das exigências normativas de bombeiros por UF (CBMSP, CBMERJ, CBMMG, CBMRS, etc.).
- **Cálculo de Grau de Risco**: Avaliação baseada no tipo de ocupação (códigos D-1, C-1, F-6, I-3, etc.), carga de incêndio (MJ/m²), população fixa e área construída.
- **Enquadramento Legal (CLCB vs AVCB)**: Regras de corte automatizadas (área $\le 750\text{ m}^2$ PTS vs Projeto Técnico completo).
- **Dimensionamento da Brigada de Incêndio (NBR 14276)**: Quantitativo exato de brigadistas por turno e nível de formação (Básico, Intermediário ou Avançado).
- **Equipamentos e Sistemas de Proteção**:
  - Extintores de Incêndio (ABC, CO2) com quantitativo e caminhamento máximo
  - Rede de Hidrantes e Mangotinhos com cálculo de Reserva Técnica de Incêndio (RTI em m³)
  - Iluminação e Sinalização Fotoluminescente de Emergência
  - Sistema de Alarme Manual e Detecção Automática
  - Chuveiros Automáticos (Sprinklers) para grandes áreas ou riscos severos
- **Histórico Local no Navegador**: Salva dimensionamentos recentes em `localStorage`.
- **Exportação para PDF / Impressão**: Layout dedicado para geração de relatórios técnicos em `@media print`.
- **Modo Escuro / Claro**: Suporte nativo a temas com alternância em um clique.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**: Estruturação acessível com ARIA labels e hierarquia visual.
- **CSS3 Moderno**: CSS Grid, Flexbox, variáveis customizadas (`:root`), responsividade mobile-first e temas dinâmicos.
- **JavaScript Vanilla (ES6+)**: Sem dependências externas pesadas, carregamento ultrarrápido.
- **Node.js**: Servidor HTTP nativo simples para execução local e rotas diretas.

---

## 💻 Como Rodar Localmente

1. Inicie o servidor:
   ```bash
   npm start
   # ou
   node server.js
   ```

2. Acesse pelo link simplificado:
   ```
   http://localhost:3456/firesafe
   # ou
   http://localhost:3456/
   ```
   *(Ou abra diretamente o arquivo `index.html` em qualquer navegador)*


---

## ⚖️ Aviso Legal

Os resultados e estimativas gerados por esta plataforma têm caráter orientador de engenharia preliminar. A aprovação definitiva, habite-se e emissão de alvará competem exclusivamente ao Corpo de Bombeiros Militar da Unidade Federativa correspondente, mediante protocolo formal e responsabilidade técnica com ART/RRT de profissional habilitado.
