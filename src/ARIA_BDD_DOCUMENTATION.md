# Aria - Documentação BDD (Behavior-Driven Development)

## Sobre o Sistema

**Aria** é um sistema interno para gestão de desdobramentos do pipeline Opera, com design inspirado no Blip Desk e foco em comunicação eficiente. O sistema agrupa mensagens por operação, onde cada desdobramento funciona como um chat independente.

---

## Estrutura de Histórias de Usuário (BDD)

### Template Padrão

```gherkin
Feature: [Nome da Funcionalidade]
  Como [tipo de usuário]
  Eu quero [realizar algo]
  Para que [obter algum benefício]

  Scenario: [Descrição do cenário]
    Given [contexto inicial]
    When [ação executada]
    Then [resultado esperado]
    And [resultado adicional, se necessário]
```

---

## 1. GESTÃO DE OPERAÇÕES

### Feature 1.1: Visualizar Lista de Operações

```gherkin
Feature: Visualizar lista de operações
  Como analista do pipeline Opera
  Eu quero visualizar todas as operações em andamento
  Para que eu possa acompanhar o status de cada uma

  Scenario: Acessar o sistema pela primeira vez
    Given que eu acesso o sistema Aria
    Then eu devo ver a lista de operações no painel esquerdo
    And cada operação deve exibir seu título
    And cada operação deve exibir o número de mensagens não lidas
    And cada operação deve exibir a data da última atualização

  Scenario: Operações ordenadas por prioridade e data
    Given que existem operações prioritárias e normais
    When eu visualizo a lista de operações
    Then as operações prioritárias devem aparecer primeiro
    And dentro de cada grupo, as operações devem estar ordenadas pela data da última mensagem (mais recente primeiro)

  Scenario: Identificar operações prioritárias visualmente
    Given que existe uma operação com prioridade
    When eu visualizo a lista de operações
    Then a operação prioritária deve exibir um ícone de bandeira (Flag)
    And a operação deve estar na aba "Prioritárias"
```

### Feature 1.2: Sistema de Abas (Prioritárias vs Normais)

```gherkin
Feature: Separar operações por abas
  Como analista do pipeline Opera
  Eu quero visualizar operações separadas por prioridade
  Para que eu possa focar nas tarefas urgentes

  Scenario: Alternar entre abas
    Given que estou na aba "Normais"
    When eu clico na aba "Prioritárias"
    Then eu devo ver apenas operações marcadas como prioritárias
    And o contador da aba deve mostrar o número correto de operações

  Scenario: Contador de operações por aba
    Given que existem 3 operações prioritárias e 7 normais
    When eu visualizo as abas
    Then a aba "Prioritárias" deve exibir "(3)"
    And a aba "Normais" deve exibir "(7)"
```

### Feature 1.3: Selecionar Operação

```gherkin
Feature: Selecionar operação para visualizar detalhes
  Como analista do pipeline Opera
  Eu quero clicar em uma operação
  Para que eu possa visualizar seus desdobramentos e detalhes

  Scenario: Selecionar operação pela primeira vez
    Given que nenhuma operação está selecionada
    When eu clico em uma operação "Cessão de Precatórios AGU"
    Then a operação deve ficar destacada visualmente
    And os desdobramentos da operação devem aparecer no painel central
    And os detalhes devem aparecer no painel direito

  Scenario: Trocar de operação
    Given que estou visualizando a operação "Cessão de Precatórios AGU"
    When eu clico em outra operação "Análise Financeira XYZ"
    Then a nova operação deve ficar destacada
    And os desdobramentos devem ser atualizados
    And os detalhes devem ser atualizados
```

---

## 2. GESTÃO DE DESDOBRAMENTOS

### Feature 2.1: Visualizar Desdobramentos de uma Operação

```gherkin
Feature: Visualizar desdobramentos ativos
  Como analista do pipeline Opera
  Eu quero visualizar os desdobramentos de uma operação
  Para que eu possa acompanhar as diferentes frentes de trabalho

  Scenario: Visualizar desdobramentos ativos
    Given que selecionei uma operação
    When eu visualizo a área de chat central
    Then eu devo ver apenas os desdobramentos ativos (não resolvidos/cancelados)
    And cada desdobramento deve exibir seu título
    And cada desdobramento deve exibir o número de mensagens não lidas

  Scenario: Identificar status do desdobramento por cor
    Given que selecionei uma operação com múltiplos desdobramentos
    When eu visualizo os desdobramentos
    Then desdobramentos em "execução" devem ter badge azul
    And desdobramentos em "alerta" devem ter badge amarelo
    And desdobramentos em "perigo" devem ter badge vermelho
    And desdobramentos "aguardando" devem ter badge cinza
```

### Feature 2.2: Selecionar Desdobramento para Conversar

```gherkin
Feature: Selecionar desdobramento ativo
  Como analista do pipeline Opera
  Eu quero selecionar um desdobramento específico
  Para que eu possa visualizar e enviar mensagens

  Scenario: Selecionar desdobramento pela primeira vez
    Given que uma operação está selecionada
    And nenhum desdobramento está selecionado
    When eu clico em um desdobramento "Parecer jurídico"
    Then o desdobramento deve ficar destacado
    And as mensagens do desdobramento devem aparecer na área de chat
    And o campo de input deve ficar habilitado

  Scenario: Marcar desdobramento como lido automaticamente
    Given que um desdobramento tem 2 mensagens não lidas
    When eu clico neste desdobramento
    Then o contador de mensagens não lidas deve zerar
    And o contador total da operação deve diminuir em 2
```

### Feature 2.3: Visualizar SLA (Prazo) do Desdobramento

```gherkin
Feature: Visualizar prazo do desdobramento
  Como analista do pipeline Opera
  Eu quero ver o prazo de um desdobramento
  Para que eu possa priorizar meu trabalho

  Scenario: Visualizar barra de SLA em desdobramento ativo
    Given que selecionei um desdobramento com prazo de 48 horas
    And o desdobramento está ativo (não concluído)
    When eu visualizo o cabeçalho do chat
    Then eu devo ver uma barra de progresso do prazo
    And a barra deve mostrar "Vence em 48 horas"

  Scenario: SLA em estado de alerta (menos de 24h)
    Given que um desdobramento tem prazo de 10 horas restantes
    When eu visualizo o SLA
    Then a barra de progresso deve ficar amarela
    And deve exibir "Vence em 10 horas"

  Scenario: SLA em estado crítico (menos de 1h)
    Given que um desdobramento tem 45 minutos restantes
    When eu visualizo o SLA
    Then a barra de progresso deve ficar vermelha
    And deve exibir "Vence em 45 minutos" em vermelho

  Scenario: Não exibir SLA em desdobramento concluído
    Given que selecionei um desdobramento com status "resolvido"
    When eu visualizo o cabeçalho do chat
    Then a barra de SLA NÃO deve aparecer
```

---

## 3. SISTEMA DE MENSAGENS

### Feature 3.1: Visualizar Histórico de Mensagens

```gherkin
Feature: Visualizar mensagens de um desdobramento
  Como analista do pipeline Opera
  Eu quero ver todo o histórico de mensagens
  Para que eu possa entender o contexto da conversa

  Scenario: Visualizar mensagem de origem
    Given que selecionei um desdobramento
    When eu visualizo a área de chat
    Then a primeira seção deve exibir a "Mensagem de origem"
    And deve mostrar o timestamp de origem
    And deve ter um divisor visual antes do histórico

  Scenario: Diferenciar mensagens enviadas e recebidas
    Given que estou visualizando um desdobramento com mensagens
    When eu vejo o histórico
    Then mensagens "enviadas" devem aparecer à direita com fundo azul
    And mensagens "recebidas" devem aparecer à esquerda com fundo branco/border
    And mensagens recebidas devem exibir o nome do remetente

  Scenario: Visualizar anexos em mensagens
    Given que uma mensagem contém anexos
    When eu visualizo esta mensagem
    Then eu devo ver uma lista de arquivos anexados
    And cada anexo deve exibir um ícone de arquivo
    And cada anexo deve exibir o nome do arquivo
    And cada anexo deve ter um ícone de download
```

### Feature 3.2: Enviar Mensagens

```gherkin
Feature: Enviar mensagem em um desdobramento ativo
  Como analista do pipeline Opera
  Eu quero enviar mensagens em um desdobramento
  Para que eu possa comunicar atualizações e respostas

  Scenario: Enviar mensagem em desdobramento ativo
    Given que selecionei um desdobramento ativo
    When eu digito "Documento recebido e em análise" no campo de texto
    And pressiono Enter ou clico no botão enviar
    Then a mensagem deve aparecer no chat como "enviada"
    And o campo de texto deve ser limpo
    And a mensagem deve ter timestamp atual

  Scenario: Impossibilitar envio em desdobramento concluído
    Given que selecionei um desdobramento com status "resolvido"
    When eu visualizo o campo de input
    Then o campo deve estar desabilitado
    And deve exibir mensagem "Esta solicitação já foi finalizada e não permite novas mensagens"
    And o botão de anexar deve estar desabilitado
```

### Feature 3.3: Alternar Entre Desdobramentos (Chat Switcher)

```gherkin
Feature: Trocar de desdobramento rapidamente
  Como analista do pipeline Opera
  Eu quero trocar entre desdobramentos sem sair da operação
  Para que eu possa ser mais eficiente

  Scenario: Usar o seletor de desdobramentos
    Given que estou conversando no desdobramento "Parecer jurídico"
    When eu clico no seletor acima do campo de mensagem
    And seleciono "Cálculo"
    Then o chat deve alternar para o desdobramento "Cálculo"
    And as mensagens devem ser atualizadas
    And o desdobramento deve ser marcado como lido
```

---

## 4. HISTÓRICO DE DESDOBRAMENTOS

### Feature 4.1: Visualizar Desdobramentos Finalizados

```gherkin
Feature: Acessar histórico de desdobramentos
  Como analista do pipeline Opera
  Eu quero visualizar desdobramentos já concluídos
  Para que eu possa consultar o histórico de trabalho

  Scenario: Abrir seção de histórico
    Given que selecionei uma operação
    When eu clico no botão "Histórico" no painel de desdobramentos
    Then a seção deve expandir
    And deve exibir desdobramentos com status "resolvido" ou "cancelado"
    And cada item deve exibir uma tag indicando o status final

  Scenario: Visualizar conversa de desdobramento resolvido
    Given que abri o histórico
    When eu clico em um desdobramento "resolvido"
    Then o chat deve exibir toda a conversa
    And deve exibir mensagens com anexos enviados durante a resolução
    And deve mostrar indicador "Esta solicitação já foi finalizada"
    And NÃO deve exibir a barra de SLA

  Scenario: Badge de status em desdobramentos finalizados
    Given que visualizo o histórico
    When vejo a lista de desdobramentos finalizados
    Then desdobramentos "resolvido" devem ter badge verde
    And desdobramentos "cancelado" devem ter badge cinza escuro
```

---

## 5. PAINEL DE DETALHES (C-Kalil + Origem)

### Feature 5.1: Visualizar Componente C-Kalil (Steps Verticais)

```gherkin
Feature: Visualizar etapas do processo
  Como analista do pipeline Opera
  Eu quero ver as etapas do processo no painel direito
  Para que eu possa entender em que fase estamos

  Scenario: Visualizar steps verticais
    Given que selecionei uma operação
    When eu visualizo o painel direito
    Then eu devo ver a seção "Etapas do Processo"
    And as etapas devem estar organizadas verticalmente
    And etapas concluídas devem ter check verde
    And a etapa atual deve estar destacada em azul
    And etapas futuras devem estar em cinza

  Scenario: Navegação visual entre etapas
    Given que visualizo as etapas
    When o processo avança para a próxima etapa
    Then a etapa anterior deve ganhar check verde
    And a nova etapa atual deve ficar azul
```

### Feature 5.2: Visualizar Dados de Origem da Solicitação

```gherkin
Feature: Visualizar informações da origem
  Como analista do pipeline Opera
  Eu quero ver os dados de origem da solicitação
  Para que eu tenha contexto completo da operação

  Scenario: Visualizar seção de origem
    Given que selecionei uma operação
    When eu visualizo o painel direito
    Then eu devo ver a seção "Origem da Solicitação"
    And deve exibir o título da operação
    And deve exibir a descrição completa
    And deve exibir a data de criação
    And deve exibir o responsável/solicitante

  Scenario: Campos vazios tratados adequadamente
    Given que uma operação não tem responsável definido
    When eu visualizo a origem
    Then o campo "Responsável" deve exibir "Não informado" ou estar oculto
```

---

## 6. FILTROS E BUSCA

### Feature 6.1: Buscar Operações

```gherkin
Feature: Buscar operações por texto
  Como analista do pipeline Opera
  Eu quero buscar operações por palavra-chave
  Para que eu possa encontrar rapidamente uma operação específica

  Scenario: Buscar operação por título
    Given que existem 10 operações visíveis
    When eu digito "Cessão" na barra de busca
    Then apenas operações com "Cessão" no título devem aparecer
    And operações que não correspondem devem ser ocultadas

  Scenario: Busca sem resultados
    Given que digitei um termo na busca
    When nenhuma operação corresponde ao termo
    Then deve exibir mensagem "Nenhuma operação encontrada"
```

---

## 7. REGRAS DE NEGÓCIO

### RN01: Títulos Válidos de Desdobramentos

```gherkin
Feature: Validar títulos de desdobramentos
  Como sistema Aria
  Eu quero aceitar apenas títulos válidos de desdobramentos
  Para que mantenha consistência com o pipeline Opera

  Scenario: Apenas títulos da lista específica são aceitos
    Given uma lista pré-definida de títulos válidos
    When um desdobramento é criado
    Then o título deve estar na lista de títulos válidos
    
  Lista de Títulos Válidos:
    - "Parecer jurídico"
    - "Análise do ativo (Advogado)"
    - "Análise do ativo - Estudo do processo judicial"
    - "Análise do Ativo - cedente"
    - "Análise do cedente - Estudo do processo"
    - "Cálculo"
    - "Emissão de CNDs"
    - "Escritura de cessão"
    - "Documentoscopia"
    - "Ligação de confirmação"
    - "Análise de Prioridade da Operação"
    - "Conferência inicial"
```

### RN02: Ordenação de Operações

```gherkin
Rule: As operações devem ser ordenadas primeiro por prioridade, depois por data da última mensagem

  Scenario: Ordenação correta aplicada
    Given operações com diferentes prioridades e datas
    When a lista é renderizada
    Then operações prioritárias devem vir primeiro (ordenadas por data DESC)
    And operações normais devem vir depois (ordenadas por data DESC)
```

### RN03: Mensagens Não Lidas

```gherkin
Rule: Contador de mensagens não lidas deve ser preciso

  Scenario: Contador atualiza ao selecionar desdobramento
    Given um desdobramento com 3 mensagens não lidas
    When eu seleciono este desdobramento
    Then o contador deve zerar imediatamente
    And a operação pai deve atualizar seu contador total
```

---

## 8. DESIGN SYSTEM E UI

### Feature 8.1: Consistência Visual com Design System

```gherkin
Feature: Usar variáveis CSS do Design System
  Como desenvolvedor
  Eu quero que todos os componentes usem variáveis CSS
  Para que o design seja consistente e fácil de atualizar

  Scenario: Cores usando variáveis CSS
    Given qualquer componente do sistema
    When eu inspeciono o CSS
    Then cores devem usar var(--primary), var(--background), etc.
    And NÃO devem usar valores hardcoded como #1E40AF

  Scenario: Tipografia usando fontes definidas
    Given qualquer texto no sistema
    When eu inspeciono a fonte
    Then deve usar apenas as fontes definidas em /styles/globals.css
    And NÃO deve usar font-size, font-weight ou line-height do Tailwind
```

---

## 9. CASOS DE USO PRINCIPAIS

### Caso de Uso 1: Analista Responde a um Desdobramento Urgente

```gherkin
Scenario: Responder desdobramento com prazo crítico
  Given que faço login no sistema Aria
  And existe uma operação prioritária "Cessão AGU20006033"
  And esta operação tem um desdobramento "Parecer jurídico" com SLA de 2 horas
  
  When eu clico na aba "Prioritárias"
  And seleciono a operação "Cessão AGU20006033"
  And clico no desdobramento "Parecer jurídico"
  
  Then eu vejo a barra de SLA vermelha indicando urgência
  And eu vejo "Vence em 2 horas" em vermelho
  And eu vejo o histórico de mensagens
  And eu vejo a mensagem de origem do desdobramento
  
  When eu digito "Análise concluída. Processo aprovado." e envio
  
  Then a mensagem aparece no chat como enviada
  And o timestamp é registrado
  And outras áreas podem ver minha resposta em tempo real
```

### Caso de Uso 2: Consultar Histórico de Desdobramento Resolvido

```gherkin
Scenario: Revisar como um desdobramento foi resolvido
  Given que estou visualizando uma operação
  And esta operação tem desdobramentos finalizados
  
  When eu clico em "Histórico" para expandir
  
  Then eu vejo desdobramentos com status "resolvido" e "cancelado"
  And cada um tem uma tag colorida de status
  
  When eu clico em um desdobramento "Emissão de CNDs" (resolvido)
  
  Then eu vejo toda a conversa que levou à resolução
  And eu vejo os documentos anexados (CND_Federal.pdf, etc.)
  And eu vejo o indicador "Esta solicitação já foi finalizada"
  And eu NÃO vejo a barra de SLA
  And o campo de input está desabilitado
```

---

## 10. CRITÉRIOS DE ACEITAÇÃO GERAIS

### Performance
- A lista de operações deve carregar em menos de 1 segundo
- A troca entre operações deve ser instantânea (< 200ms)
- O scroll do chat deve ser suave

### Acessibilidade
- Todas as cores devem ter contraste mínimo de 4.5:1
- Navegação por teclado deve funcionar (Tab, Enter, Esc)
- Leitores de tela devem anunciar corretamente os estados

### Responsividade
- Layout deve funcionar em telas de 1024px a 1920px+
- Painéis devem ter largura mínima para não quebrar o layout

---

## Como Usar Esta Documentação

### Para Product Owner:
Use as Features como base para criar User Stories no backlog

### Para Desenvolvedores:
Use os Scenarios como critérios de aceitação durante o desenvolvimento

### Para QA:
Use os Scenarios como casos de teste para validação

### Para Escrever Novas Histórias:

```gherkin
Feature: [Nome descritivo]
  Como [papel do usuário]
  Eu quero [objetivo]
  Para que [benefício/valor]

  Scenario: [Caso específico]
    Given [pré-condição]
    And [contexto adicional]
    When [ação do usuário]
    And [ação complementar]
    Then [resultado esperado]
    And [validação adicional]
```

---

## Glossário

- **Operação**: Representa um caso completo do pipeline Opera (ex: Cessão de Precatórios)
- **Desdobramento**: Sub-tarefa de uma operação (ex: Parecer jurídico, Cálculo)
- **SLA**: Service Level Agreement - prazo para conclusão em horas
- **C-Kalil**: Componente de visualização de steps/etapas verticais
- **Status válidos**: execução, alerta, perigo, aguardando, resolvido, cancelado

---

**Versão**: 1.0  
**Data**: Dezembro 2025  
**Sistema**: Aria - Gestão de Desdobramentos Pipeline Opera
