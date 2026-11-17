# 🔥 PREV-FOGO PRO | Dimensionamento de Segurança Contra Incêndio & Pânico

Plataforma profissional para cálculo automático de Grau de Risco, definição de documento obrigatório (**CLCB** ou **AVCB**), dimensionamento de **Brigada de Incêndio (ABNT NBR 14276)** e especificação de equipamentos mínimos exigidos conforme as Instruções Técnicas dos Corpos de Bombeiros Militares estaduais.

---

## 🚀 Funcionalidades

- **Cálculo de Grau de Risco**: Avaliação baseada no tipo de atividade/ocupação (códigos das ITs: D-1, C-1, F-6, I-3, etc.), carga de incêndio específica em MJ/m², população fixa e área construída.
- **Enquadramento Legal (CLCB vs AVCB)**: Regra de corte para áreas $\le 750\text{ m}^2$ (Processo Técnico Simplificado) e $> 750\text{ m}^2$ ou risco alto (Projeto Técnico completo e vistoria presencial).
- **Dimensionamento da Brigada de Incêndio (NBR 14276)**: Quantidade de brigadistas calculada com base na população do turno e nível de formação exigido (Básico, Intermediário ou Avançado), com periodicidade de reciclagem anual.
- **Equipamentos e Sistemas de Proteção**:
  - Extintores de Incêndio (ABC, CO2) com quantitativo e caminhamento máximo
  - Rede de Hidrantes e Mangotinhos com cálculo de Reserva Técnica de Incêndio (RTI em m³)
  - Iluminação e Sinalização Fotoluminescente de Emergência
  - Sistema de Alarme Manual e Detecção Automática
  - Chuveiros Automáticos (Sprinklers) para grandes áreas ou riscos severos
- **Requisitos Especiais & Gestão**: Laudo elétrico (NBR 5410 / NR-10), Plano de Emergência Contra Incêndio (PECI) e plano de manutenção preventiva com selo INMETRO.
- **Base Normativa por UF**: Normas e portais de São Paulo (CBMSP), Rio de Janeiro (CBMERJ), Minas Gerais (CBMMG), Rio Grande do Sul (CBMRS), Paraná (CBMPR), Santa Catarina (CBMSC), Bahia (CBMBA), Pernambuco (CBMPE), Ceará (CBMCE), Distrito Federal (CBMDF) e Goiás (CBMGO).
- **Histórico Local no Navegador**: Salva dimensionamentos recentes em `localStorage`.
- **Exportação para PDF / Impressão**: Layout dedicado para geração de relatórios técnicos em `@media print`.
- **Modo Escuro / Claro**: Suporte nativo a temas com alternância em um clique.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**: Estruturação acessível com ARIA labels e hierarquia visual.
- **CSS3 Moderno**: CSS Grid, Flexbox, variáveis customizadas (`:root`), responsividade mobile-first e temas dinâmicos.
- **JavaScript Vanilla (ES6+)**: Sem frameworks pesados, carregamento instantâneo e alta performance.
- **Node.js**: Servidor HTTP nativo simples para execução local.

---

## 💻 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/firefgtgil-coder/prev-fogo-pro.git
   cd prev-fogo-pro
   ```

2. Inicie o servidor local:
   ```bash
   node server.js
   ```

3. Abra no navegador:
   ```
   http://localhost:3456
   ```
   *(Ou abra diretamente o arquivo `index.html` em qualquer navegador)*

---

## ⚖️ Aviso Legal

Os resultados e estimativas gerados por esta plataforma têm caráter orientador de engenharia preliminar. A aprovação definitiva, habite-se e emissão de alvará competem exclusivamente ao Corpo de Bombeiros Militar da Unidade Federativa correspondente, mediante protocolo formal e responsabilidade técnica com ART/RRT de profissional habilitado.
