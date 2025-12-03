# 📋 ARIA - Sistema de Gestão de Desdobramentos Opera

## 📖 Visão Geral

**ARIA** é um sistema interno desenvolvido para gestão eficiente de desdobramentos do pipeline Opera. Inspirado no design do Blip Desk, o sistema oferece uma experiência de comunicação moderna e organizada, onde cada desdobramento funciona como um chat independente.

### ✨ Características Principais

- 🎯 **Interface tipo Chat**: Cada desdobramento é tratado como uma conversa independente
- 📊 **Painel Circuito Kalil**: Visualização vertical de etapas do processo
- 🚦 **Sistema de Prioridades**: Separação visual entre operações prioritárias e normais
- ⏱️ **Gestão de SLA**: Gradientes dinâmicos que mudam conforme prazo se aproxima
- 🎨 **Design System Consistente**: Variáveis CSS customizadas em todo o projeto
- 📱 **Layout Responsivo**: Interface adaptável com painéis recolhíveis

---

## 🏗️ Arquitetura

### Estrutura do Projeto

```
/
├── App.tsx                          # Aplicação principal
├── AppClean.tsx                     # Versão limpa (backup)
├── components/
│   ├── CKalilPanel.tsx             # Painel do Circuito Kalil
│   ├── ChatSwitcher.tsx            # Seletor de desdobramentos
│   ├── ChatDrawer.tsx              # Drawer do histórico
│   ├── Message.tsx                 # Componente de mensagem
│   ├── ModalConfirmacao.tsx        # Modal de confirmação
│   ├── OperacaoChatArea.tsx        # Área principal do chat
│   ├── OperacoesListClean.tsx      # Lista de operações
│   ├── DesdobramentosListClean.tsx # Lista de desdobramentos
│   └── ui/                         # Componentes UI reutilizáveis
├── styles/
│   └── globals.css                 # Design system e variáveis CSS
└── imports/                        # Componentes e assets importados
```

### Fluxo de Dados

```
App.tsx (Estado Global)
    ├── OperacoesListClean (Painel Esquerdo)
    │   └── Lista de operações com filtros por aba
    │
    ├── OperacaoChatArea (Área Central)
    │   ├── Header com info da operação
    │   ├── Barra de progresso SLA
    │   ├── ChatSwitcher (tabs de desdobramentos)
    │   ├── Área de mensagens
    │   └── Input de mensagens
    │
    └── CKalilPanel (Painel Direito)
        ├── Circuito Kalil (etapas)
        └── Informações da origem
```

---

## 🎨 Design System

### Variáveis de Cor

O projeto utiliza um sistema de cores baseado em variáveis CSS definidas em `/styles/globals.css`:

#### Cores Principais
```css
--primary: rgba(0, 97, 214, 1.00)           /* Azul principal */
--secondary: rgba(0, 0, 0, 0)               /* Secundário transparente */
--destructive: rgba(255, 77, 79, 1.00)      /* Vermelho (ações destrutivas) */
--muted: rgba(219, 222, 222, 1.00)          /* Cinza suave */
--accent: rgba(0, 97, 214, 1.00)            /* Acento azul */
```

#### Cores de Chart (SLA)
```css
--chart-1: rgba(0, 97, 214, 1.00)           /* Azul */
--chart-2: rgba(14, 133, 87, 1.00)          /* Verde */
--chart-3: rgba(254, 195, 60, 1.00)         /* Amarelo */
--chart-4: rgba(255, 77, 79, 1.00)          /* Vermelho */
```

#### Cores de Background
```css
--background: rgba(255, 255, 255, 1.00)     /* Fundo principal */
--card: rgba(255, 255, 255, 1.00)           /* Cards */
--input-background: rgba(255, 255, 255, 1.00) /* Inputs */
```

### Tipografia

#### Fontes
- **Verdana**: Títulos (H1, H2, H3)
- **Lato**: Corpo de texto, labels, botões, inputs
- **Oswald**: Display (elementos especiais)

#### Tamanhos
```css
--text-h1: 40px
--text-h2: 28px
--text-h3: 24px
--text-h4: 20px
--text-base: 16px
--text-sm: 14px
--text-display: 34px
```

#### Pesos
```css
--font-weight-regular: 400
--font-weight-bold: 700
--font-weight-extrabold: 800
```

### Border Radius
```css
--radius: 4px
--radius-sm: 2px
--radius-md: 4px
--radius-lg: 6px
--radius-xl: 8px
```

---

## 📦 Componentes Principais

### 1. **App.tsx**
Componente raiz que gerencia todo o estado da aplicação.

**Estado:**
- `operacoes`: Lista de todas as operações
- `desdobramentos`: Lista de todos os desdobramentos
- `selectedOperacaoId`: ID da operação selecionada
- `leftPanelOpen/rightPanelOpen`: Estado dos painéis laterais

**Funções principais:**
- `handleSendMessage()`: Envia nova mensagem
- `handleMarkAsRead()`: Marca desdobramento como lido
- `handleFinalizarDesdobramento()`: Finaliza um desdobramento
- `handleUpdateStatus()`: Atualiza status da operação

### 2. **OperacoesListClean.tsx**
Lista de operações com sistema de abas (Prioritárias/Normais).

**Props:**
- `operacoes`: Array de operações
- `activeId`: ID da operação ativa
- `onSelect`: Callback ao selecionar operação
- `desdobramentos`: Array de desdobramentos (para contadores)

**Funcionalidades:**
- Abas separadas por prioridade
- Ordenação por prioridade e data
- Contadores de desdobramentos ativos
- Indicador visual de prioridade (bandeira)

### 3. **OperacaoChatArea.tsx**
Área principal do chat com gradiente dinâmico baseado em SLA.

**Props:**
- `operacao`: Operação selecionada
- `desdobramentos`: Desdobramentos ativos
- `todosDesdobramentos`: Todos os desdobramentos (incluindo histórico)
- `onSendMessage`: Callback para enviar mensagem
- `onFinalizarDesdobramento`: Callback para finalizar

**Funcionalidades:**
- Gradiente de fundo que muda com SLA
- Barra de progresso colorida
- Troca entre desdobramentos via ChatSwitcher
- Indicador de solicitação finalizada
- Mensagem de origem destacada

**Sistema de Gradiente SLA:**
```typescript
< 1h:   Vermelho intenso (crítico)
1-3h:   Laranja/Vermelho (urgente)
3-6h:   Amarelo (atenção)
6-12h:  Azul (normal)
> 12h:  Verde (confortável)
```

### 4. **CKalilPanel.tsx**
Painel lateral direito com Circuito Kalil e informações da origem.

**Props:**
- `operacao`: Operação selecionada (pode ser null)

**Seções:**
- **Circuito Kalil**: Steps verticais com etapas do processo
- **Informações da Origem**: Dados da solicitação

**Features:**
- Etapas ativas destacadas em azul
- Etapas paralelas identificadas
- Última atividade com timestamp
- Informações de contato do cedente

### 5. **ChatSwitcher.tsx**
Seletor de desdobramentos em formato de abas horizontais.

**Props:**
- `desdobramentos`: Lista de desdobramentos
- `activeDesdobramentoId`: ID do desdobramento ativo
- `onSelectDesdobramento`: Callback ao trocar desdobramento

**Funcionalidades:**
- Scroll horizontal para múltiplos desdobramentos
- Badge de mensagens não lidas
- Indicadores de status (cores)
- Filtro de desdobramentos válidos

### 6. **Message.tsx**
Componente individual de mensagem.

**Props:**
- `message`: Objeto da mensagem

**Tipos de mensagem:**
- **Enviada**: Alinhada à direita, fundo azul
- **Recebida**: Alinhada à esquerda, fundo cinza
- **Sistema**: Texto centralizado

**Features:**
- Suporte a anexos (clicáveis)
- Timestamp
- Nome do remetente
- Auto-scroll ao adicionar nova mensagem

### 7. **ModalConfirmacao.tsx**
Modal de confirmação para finalizar desdobramentos.

**Props:**
- `isOpen`: Estado do modal
- `onClose`: Callback ao fechar
- `onConfirm`: Callback ao confirmar
- `tipo`: Tipo de ação ('concluir')
- `desdobramentoTitulo`: Título do desdobramento

---

## 🗄️ Estrutura de Dados

### Operacao
```typescript
type Operacao = {
  id: string;
  cedente: string;                  // Nome do cedente
  idExterno: string;                // ID externo da operação
  valor: string;                    // Valor formatado (R$)
  enteDevedor: string;              // Ente devedor
  status: 'novo' | 'em_andamento' | 'pendente' | 'concluido';
  prioridade: boolean;              // Se é prioritária
  ultimaAtualizacao: string;        // Data/hora última atualização
  horario: string;                  // Horário (HH:MM)
  desdobramentosCount: number;      // Total de desdobramentos
  mensagensNaoLidas: number;        // Total de mensagens não lidas
  prazo?: string;                   // Prazo em horas
  etapaAtual: number;               // Etapa atual no Circuito Kalil
  etapasParalelas?: number[];       // Etapas paralelas
  responsavel?: string;             // Responsável pela operação
  criado?: string;                  // Data de criação
  atividadeOpera?: string;          // ID da atividade Opera
  demandante?: string;              // Área demandante
  atividadeOrigem?: string;         // Atividade de origem
  ultimaAtividade?: {
    nome: string;
    data: string;
    hora: string;
  };
  isAdvogado: boolean;              // Se envolve advogado
  telefone: string;                 // Telefone do cedente
  historicoSolicitacoes?: HistoricoSolicitacao[];
};
```

### Desdobramento
```typescript
type Desdobramento = {
  id: string;
  operacaoId: string;               // ID da operação pai
  titulo: string;                   // Título do desdobramento
  status: 'sucesso' | 'execucao' | 'perigo' | 'resolvido' | 'cancelado';
  mensagensNaoLidas: number;
  prazo?: string;                   // Prazo em horas (string)
  mensagens: Message[];             // Array de mensagens
  mensagemOrigem: string;           // Mensagem que originou
  timestampOrigem: string;          // Data/hora de origem
};
```

### Message
```typescript
type Message = {
  id: string;
  desdobramentoId: string;
  remetente: string;                // Nome do remetente
  conteudo: string;                 // Texto da mensagem
  timestamp: string;                // Horário (HH:MM)
  tipo: 'enviada' | 'recebida';
  anexos?: string[];                // Nomes dos arquivos anexados
};
```

### HistoricoSolicitacao
```typescript
type HistoricoSolicitacao = {
  id: string;
  titulo: string;
  mensagemOrigem: string;
  dataSolicitacao: string;
  dataEncerramento?: string;
  status: 'concluido' | 'cancelado';
  solicitante: string;
  quantidadeAnexos: number;
  atividadeOpera: string;
};
```

---

## 🎯 Funcionalidades

### 1. Sistema de Abas
- **Prioritárias**: Operações com `prioridade: true`
- **Normais**: Operações com `prioridade: false`
- Contador de operações por aba
- Ícone de bandeira para identificação visual

### 2. Ordenação de Operações
1. Primeiro por **prioridade** (prioritárias primeiro)
2. Depois por **data da última mensagem** (mais recente primeiro)

### 3. Filtro de Desdobramentos
Apenas desdobramentos com títulos válidos são exibidos:
- Emissão de CNDs
- Emissão de CNDs automáticas
- Documentoscopia
- Validação bancária
- Análise do ativo (Advogado)
- Parecer jurídico
- Cálculo
- Análise do ativo - Estudo do processo judicial
- Análise de Prioridade da Operação
- Escritura de cessão
- Conferência inicial
- Validação do cedente - dados bancários
- Análise do Ativo - cedente
- Análise do cedente - Estudo do processo
- Ligação de confirmação

### 4. Gradiente Dinâmico (SLA)
O background do chat muda de cor conforme o prazo:
- **< 1h**: Vermelho intenso (crítico)
- **1-3h**: Gradiente laranja/vermelho (urgente)
- **3-6h**: Amarelo (atenção)
- **6-12h**: Azul suave (normal)
- **> 12h**: Verde suave (confortável)
- **Finalizado**: Cinza suave

### 5. Barra de Progresso SLA
Cores da barra seguem a mesma lógica:
- **< 3h**: Vermelho
- **3-6h**: Amarelo
- **6-12h**: Azul
- **> 12h**: Verde

### 6. Circuito Kalil
Visualização vertical com 7 etapas:
1. Análise de Regularidade
2. Análise do Ativo
3. Cálculo
4. Emissão de CNDs
5. Parecer Jurídico
6. Avaliação de Risco
7. Formalização

**Recursos:**
- Etapas paralelas agrupadas visualmente
- Etapa atual destacada em azul
- Última atividade com timestamp
- Conexões visuais entre etapas

### 7. Painéis Recolhíveis
- **Painel Esquerdo**: Lista de operações (280px)
- **Painel Direito**: Circuito Kalil (300px)
- Botões sutis para recolher/expandir
- Transições suaves (300ms)

### 8. Gestão de Mensagens
- Envio de mensagens (Enter ou botão)
- Auto-scroll para última mensagem
- Mensagem de origem destacada
- Suporte a anexos (exibição)
- Indicador de mensagens não lidas

### 9. Finalização de Desdobramentos
- Modal de confirmação
- Atualização de status para 'resolvido'
- Adição ao histórico da operação
- Bloqueio de novas mensagens
- Indicador visual de finalização

---

## 🚀 Como Usar

### Navegação Básica

1. **Selecionar Operação**
   - Clique em uma operação no painel esquerdo
   - Use as abas "Prioritárias" / "Normais"

2. **Trocar Desdobramento**
   - Use o ChatSwitcher (abas horizontais)
   - Clique no desdobramento desejado
   - Badges indicam mensagens não lidas

3. **Enviar Mensagem**
   - Digite no campo de texto
   - Pressione Enter ou clique no botão enviar
   - Mensagem aparece à direita (azul)

4. **Finalizar Desdobramento**
   - Clique em "Finalizar solicitação"
   - Confirme no modal
   - Desdobramento vai para histórico

5. **Recolher Painéis**
   - Use botões no topo dos painéis laterais
   - Maximiza área do chat

### Indicadores Visuais

| Cor | Significado |
|-----|-------------|
| 🔴 Vermelho | Crítico/Urgente (< 3h) |
| 🟡 Amarelo | Atenção (3-6h) |
| 🔵 Azul | Normal (6-12h) |
| 🟢 Verde | Confortável (> 12h) |
| ⚫ Cinza | Finalizado |

### Status de Desdobramento

- **Execução**: Em andamento (amarelo)
- **Sucesso**: Completo com sucesso (verde)
- **Perigo**: Requer atenção (vermelho)
- **Resolvido**: Finalizado (cinza)
- **Cancelado**: Cancelado (cinza)

---

## 🛠️ Desenvolvimento

### Estrutura de Estado

O estado é gerenciado no `App.tsx` e passado via props:

```typescript
const [operacoes, setOperacoes] = useState(mockOperacoes);
const [desdobramentos, setDesdobramentos] = useState(mockDesdobramentos);
const [selectedOperacaoId, setSelectedOperacaoId] = useState<string | null>('op1');
```

### Adicionar Nova Operação

```typescript
const novaOperacao: Operacao = {
  id: 'op_unique_id',
  cedente: 'Nome do Cedente',
  idExterno: '1234567',
  valor: 'R$ 1.000.000,00',
  enteDevedor: 'Estado/Município',
  status: 'novo',
  prioridade: false,
  ultimaAtualizacao: 'Hoje às 10:00',
  horario: '10:00',
  desdobramentosCount: 0,
  mensagensNaoLidas: 0,
  etapaAtual: 1,
  // ... outros campos
};

setOperacoes(prev => [...prev, novaOperacao]);
```

### Adicionar Novo Desdobramento

```typescript
const novoDesdobramento: Desdobramento = {
  id: 'desdb_unique_id',
  operacaoId: 'op1',
  titulo: 'Emissão de CNDs',
  status: 'execucao',
  mensagensNaoLidas: 0,
  prazo: '24',
  mensagens: [],
  mensagemOrigem: 'Texto da solicitação inicial',
  timestampOrigem: '27/11/2025 às 10:00',
};

setDesdobramentos(prev => [...prev, novoDesdobramento]);
```

### Personalizar Design System

Edite `/styles/globals.css` para alterar cores, fontes e espaçamentos:

```css
:root {
  /* Altere as cores principais */
  --primary: rgba(0, 97, 214, 1.00);
  --destructive: rgba(255, 77, 79, 1.00);
  
  /* Ajuste a tipografia */
  --text-base: 16px;
  --font-lato: 'Lato', sans-serif;
  
  /* Modifique bordas */
  --radius: 4px;
}
```

### Adicionar Novo Tipo de Desdobramento

1. Adicione o título na lista de títulos válidos em `ChatSwitcher.tsx`
2. O filtro já está aplicado automaticamente

### Customizar Gradientes SLA

Em `OperacaoChatArea.tsx`, função `getBackgroundGradient()`:

```typescript
const getBackgroundGradient = () => {
  if (prazoHoras < 1) {
    return 'linear-gradient(135deg, rgba(255, 77, 79, 0.18) 0%, ...)';
  }
  // Adicione novos ranges conforme necessário
};
```

---

## 📝 Convenções de Código

### Nomenclatura
- **Componentes**: PascalCase (`OperacaoChatArea.tsx`)
- **Funções**: camelCase (`handleSendMessage`)
- **Constantes**: camelCase (`mockOperacoes`)
- **Tipos**: PascalCase (`type Operacao`)

### Organização de Props
```typescript
type ComponentProps = {
  // Props obrigatórias primeiro
  operacao: Operacao;
  desdobramentos: Desdobramento[];
  
  // Callbacks
  onSendMessage: (id: string, message: string) => void;
  onUpdateStatus: (status: string) => void;
};
```

### Estilos
- Use variáveis CSS do design system
- Evite cores hardcoded
- Use classes Tailwind quando possível
- Styles inline apenas para valores dinâmicos

```typescript
// ✅ BOM
<div className="bg-card text-foreground" />

// ❌ EVITAR
<div style={{ backgroundColor: '#ffffff', color: '#000000' }} />

// ✅ OK para valores dinâmicos
<div style={{ background: getBackgroundGradient() }} />
```

---

## 🔍 Troubleshooting

### Gradiente não aparece
- Verifique se o desdobramento ativo tem a propriedade `prazo`
- Confirme que `isDesdobramentoConcluido` está correto
- Teste os valores rgba() das variáveis CSS

### Mensagens não atualizam
- Verifique se `messagesEndRef` está presente
- Confirme que `useEffect` do scroll está sendo executado
- Teste se `currentMessages` está sendo atualizado

### Painéis não recolhem
- Verifique estados `leftPanelOpen` e `rightPanelOpen`
- Confirme classes de transição Tailwind
- Teste os valores de largura (`w-[280px]`, `w-0`)

### Desdobramentos não aparecem no ChatSwitcher
- Confirme que o título está na lista de títulos válidos
- Verifique se `operacaoId` corresponde à operação selecionada
- Teste se desdobramentos ativos estão sendo filtrados corretamente

---

## 📚 Referências

### Bibliotecas Utilizadas
- **React**: Framework principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Ícones

### Inspiração de Design
- **Blip Desk**: Interface de chat e organização
- **Material Design**: Componentes e interações
- **Notion**: Sistema de etapas e organização

### Variáveis CSS
Todas as variáveis estão documentadas em `/styles/globals.css` com comentários explicativos.

---

## 📄 Licença

Sistema interno - Uso restrito.

---

## 👥 Contribuindo

Para contribuir com o projeto:

1. Mantenha consistência com o design system
2. Use variáveis CSS em vez de cores hardcoded
3. Documente novas funcionalidades
4. Teste em diferentes resoluções
5. Siga as convenções de nomenclatura

---

## 📮 Contato

Para dúvidas ou sugestões sobre o sistema ARIA, entre em contato com a equipe de desenvolvimento.

---

**Versão**: 1.0  
**Última atualização**: Dezembro 2025
