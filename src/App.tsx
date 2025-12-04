import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OperacoesListClean } from './components/OperacoesListClean';
import { OperacaoChatArea } from './components/OperacaoChatArea';
import { CKalilPanel } from './components/CKalilPanel';

type Operacao = {
  id: string;
  cedente: string;
  idExterno: string;
  valor: string;
  enteDevedor: string;
  status: 'novo' | 'em_andamento' | 'pendente' | 'concluido';
  prioridade: boolean;
  ultimaAtualizacao: string;
  horario: string;
  desdobramentosCount: number;
  mensagensNaoLidas: number;
  prazo?: string;
  etapaAtual: number;
  etapasParalelas?: number[];
  responsavel?: string;
  criado?: string;
  atividadeOpera?: string;
  demandante?: string;
  atividadeOrigem?: string;
  ultimaAtividade?: {
    nome: string;
    data: string;
    hora: string;
  };
  isAdvogado: boolean;
  telefone: string;
  historicoSolicitacoes?: HistoricoSolicitacao[];
};

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

type Desdobramento = {
  id: string;
  operacaoId: string;
  titulo: string;
  status: 'sucesso' | 'execucao' | 'perigo' | 'resolvido' | 'cancelado';
  mensagensNaoLidas: number;
  prazo?: string;
  mensagens: Message[];
  mensagemOrigem: string;
  timestampOrigem: string;
};

type Message = {
  id: string;
  desdobramentoId: string;
  remetente: string;
  conteudo: string;
  timestamp: string;
  tipo: 'enviada' | 'recebida';
  anexos?: string[];
};

// Mock data
const mockOperacoes: Operacao[] = [
  {
    id: 'op1',
    cedente: 'Mariana Oliveira Santos',
    idExterno: '3245789',
    valor: 'R$ 15.234.500,00',
    enteDevedor: 'Estado do Paraná',
    status: 'em_andamento',
    prioridade: true,
    ultimaAtualizacao: 'Hoje às 16:45',
    horario: '16:45',
    desdobramentosCount: 7,
    mensagensNaoLidas: 7,
    prazo: '6 horas',
    etapaAtual: 4,
    etapasParalelas: [3, 4, 5],
    responsavel: 'Rafael Costa',
    criado: '27/11/2025 às 14:00',
    atividadeOpera: 'AT-2025-3401',
    demandante: 'Jurídico',
    atividadeOrigem: 'Emissão de CNDs',
    ultimaAtividade: {
      nome: 'Emissão de CNDs',
      data: 'Nov 27',
      hora: '16:40',
    },
    isAdvogado: true,
    telefone: '(41) 99876-5432',
    historicoSolicitacoes: [],
  },
  {
    id: 'op2',
    cedente: 'Roberto Henrique Almeida',
    idExterno: '3198456',
    valor: 'R$ 8.567.300,00',
    enteDevedor: 'Estado de Minas Gerais',
    status: 'em_andamento',
    prioridade: true,
    ultimaAtualizacao: 'Hoje às 15:20',
    horario: '15:20',
    desdobramentosCount: 1,
    mensagensNaoLidas: 2,
    prazo: '8 horas',
    etapaAtual: 5,
    etapasParalelas: [3, 4, 5],
    responsavel: 'Juliana Ferreira',
    criado: '27/11/2025 às 10:00',
    atividadeOpera: 'AT-2025-3402',
    demandante: 'Jurídico',
    atividadeOrigem: 'Parecer jurídico',
    ultimaAtividade: {
      nome: 'Parecer jurídico',
      data: 'Nov 27',
      hora: '15:15',
    },
    isAdvogado: true,
    telefone: '(31) 98765-4321',
    historicoSolicitacoes: [],
  },
  {
    id: 'op3',
    cedente: 'Patrícia Fernandes Costa',
    idExterno: '3256871',
    valor: 'R$ 22.890.000,00',
    enteDevedor: 'União Federal',
    status: 'em_andamento',
    prioridade: true,
    ultimaAtualizacao: 'Hoje às 14:10',
    horario: '14:10',
    desdobramentosCount: 3,
    mensagensNaoLidas: 5,
    prazo: '4 horas',
    etapaAtual: 6,
    etapasParalelas: [6],
    responsavel: 'Fernando Lima',
    criado: '27/11/2025 às 08:00',
    atividadeOpera: 'AT-2025-3403',
    demandante: 'Financeiro',
    atividadeOrigem: 'Parecer jurídico',
    ultimaAtividade: {
      nome: 'Parecer jurídico',
      data: 'Nov 27',
      hora: '14:05',
    },
    isAdvogado: true,
    telefone: '(11) 99234-8765',
    historicoSolicitacoes: [],
  },
  {
    id: 'op4',
    cedente: 'Eduardo Martins Rodrigues',
    idExterno: '3187524',
    valor: 'R$ 4.125.600,00',
    enteDevedor: 'Estado do Rio de Janeiro',
    status: 'novo',
    prioridade: false,
    ultimaAtualizacao: 'Hoje às 13:45',
    horario: '13:45',
    desdobramentosCount: 1,
    mensagensNaoLidas: 1,
    prazo: '12 horas',
    etapaAtual: 2,
    etapasParalelas: [1, 2],
    responsavel: 'Amanda Silva',
    criado: '27/11/2025 às 13:00',
    atividadeOpera: 'AT-2025-3404',
    demandante: 'Comercial',
    atividadeOrigem: 'Cálculo',
    ultimaAtividade: {
      nome: 'Cálculo',
      data: 'Nov 27',
      hora: '13:40',
    },
    isAdvogado: false,
    telefone: '(21) 98876-5432',
    historicoSolicitacoes: [],
  },
  {
    id: 'op5',
    cedente: 'Camila Souza Barros',
    idExterno: '3209845',
    valor: 'R$ 6.478.900,00',
    enteDevedor: 'Município de São Paulo',
    status: 'pendente',
    prioridade: false,
    ultimaAtualizacao: 'Hoje às 11:30',
    horario: '11:30',
    desdobramentosCount: 2,
    mensagensNaoLidas: 3,
    prazo: '18 horas',
    etapaAtual: 1,
    etapasParalelas: [1, 2],
    responsavel: 'Pedro Santos',
    criado: '27/11/2025 às 09:30',
    atividadeOpera: 'AT-2025-3405',
    demandante: 'Operacional',
    atividadeOrigem: 'Análise do ativo - Estudo do processo judicial',
    ultimaAtividade: {
      nome: 'Análise do ativo - Estudo do processo judicial',
      data: 'Nov 27',
      hora: '11:25',
    },
    isAdvogado: true,
    telefone: '(11) 97654-8901',
    historicoSolicitacoes: [],
  },
  {
    id: 'op6',
    cedente: 'Thiago Pereira Lopes',
    idExterno: '3234567',
    valor: 'R$ 12.345.000,00',
    enteDevedor: 'Estado de São Paulo',
    status: 'em_andamento',
    prioridade: false,
    ultimaAtualizacao: 'Hoje às 10:15',
    horario: '10:15',
    desdobramentosCount: 1,
    mensagensNaoLidas: 0,
    prazo: '24 horas',
    etapaAtual: 3,
    etapasParalelas: [3, 4, 5],
    responsavel: 'Larissa Matos',
    criado: '27/11/2025 às 08:45',
    atividadeOpera: 'AT-2025-3406',
    demandante: 'Jurídico',
    atividadeOrigem: 'Cálculo',
    ultimaAtividade: {
      nome: 'Cálculo',
      data: 'Nov 27',
      hora: '10:10',
    },
    isAdvogado: false,
    telefone: '(11) 98123-4567',
    historicoSolicitacoes: [],
  },
  {
    id: 'op7',
    cedente: 'Bruna Cardoso Mendes',
    idExterno: '3178965',
    valor: 'R$ 18.756.200,00',
    enteDevedor: 'União Federal',
    status: 'em_andamento',
    prioridade: true,
    ultimaAtualizacao: 'Hoje às 09:30',
    horario: '09:30',
    desdobramentosCount: 1,
    mensagensNaoLidas: 1,
    prazo: '10 horas',
    etapaAtual: 7,
    etapasParalelas: [7],
    responsavel: 'Carlos Eduardo',
    criado: '27/11/2025 às 07:00',
    atividadeOpera: 'AT-2025-3407',
    demandante: 'Operacional',
    atividadeOrigem: 'Escritura de cessão',
    ultimaAtividade: {
      nome: 'Escritura de cessão',
      data: 'Nov 27',
      hora: '09:25',
    },
    isAdvogado: true,
    telefone: '(11) 99123-8765',
    historicoSolicitacoes: [],
  },
  {
    id: 'op8',
    cedente: 'Daniela Lima Carvalho',
    idExterno: '3221098',
    valor: 'R$ 9.876.500,00',
    enteDevedor: 'Estado do Paraná',
    status: 'pendente',
    prioridade: false,
    ultimaAtualizacao: 'Hoje às 08:20',
    horario: '08:20',
    desdobramentosCount: 1,
    mensagensNaoLidas: 2,
    prazo: '16 horas',
    etapaAtual: 2,
    etapasParalelas: [1, 2],
    responsavel: 'Gabriel Rocha',
    criado: '27/11/2025 às 07:15',
    atividadeOpera: 'AT-2025-3408',
    demandante: 'Comercial',
    atividadeOrigem: 'Emissão de CNDs automáticas',
    ultimaAtividade: {
      nome: 'Emissão de CNDs automáticas',
      data: 'Nov 27',
      hora: '08:15',
    },
    isAdvogado: false,
    telefone: '(41) 98234-5678',
    historicoSolicitacoes: [],
  },
  {
    id: 'op9',
    cedente: 'Lucas Henrique Barbosa',
    idExterno: '3267890',
    valor: 'R$ 5.890.400,00',
    enteDevedor: 'Estado de Santa Catarina',
    status: 'em_andamento',
    prioridade: false,
    ultimaAtualizacao: 'Hoje às 12:50',
    horario: '12:50',
    desdobramentosCount: 1,
    mensagensNaoLidas: 1,
    prazo: '20 horas',
    etapaAtual: 3,
    etapasParalelas: [3, 4, 5],
    responsavel: 'Marina Santos',
    criado: '27/11/2025 às 11:30',
    atividadeOpera: 'AT-2025-3409',
    demandante: 'Comercial',
    atividadeOrigem: 'Cálculo',
    ultimaAtividade: {
      nome: 'Cálculo',
      data: 'Nov 27',
      hora: '12:45',
    },
    isAdvogado: false,
    telefone: '(48) 98765-1234',
    historicoSolicitacoes: [],
  },
  {
    id: 'op10',
    cedente: 'Ana Carolina Souza Lima',
    idExterno: '3289456',
    valor: 'R$ 7.234.800,00',
    enteDevedor: 'Município do Rio de Janeiro',
    status: 'novo',
    prioridade: false,
    ultimaAtualizacao: 'Hoje às 14:30',
    horario: '14:30',
    desdobramentosCount: 2,
    mensagensNaoLidas: 2,
    prazo: '15 horas',
    etapaAtual: 1,
    etapasParalelas: [1, 2],
    responsavel: 'Ricardo Alves',
    criado: '27/11/2025 às 14:00',
    atividadeOpera: 'AT-2025-3410',
    demandante: 'Operacional',
    atividadeOrigem: 'Análise do ativo - Estudo do processo judicial',
    ultimaAtividade: {
      nome: 'Análise do ativo - Estudo do processo judicial',
      data: 'Nov 27',
      hora: '14:25',
    },
    isAdvogado: true,
    telefone: '(21) 97654-3210',
    historicoSolicitacoes: [],
  },
  {
    id: 'op11',
    cedente: 'Felipe Augusto Mendes',
    idExterno: '3245123',
    valor: 'R$ 11.456.200,00',
    enteDevedor: 'Estado do Rio Grande do Sul',
    status: 'pendente',
    prioridade: false,
    ultimaAtualizacao: 'Hoje às 09:15',
    horario: '09:15',
    desdobramentosCount: 1,
    mensagensNaoLidas: 1,
    prazo: '22 horas',
    etapaAtual: 2,
    etapasParalelas: [1, 2],
    responsavel: 'Beatriz Costa',
    criado: '27/11/2025 às 08:30',
    atividadeOpera: 'AT-2025-3411',
    demandante: 'Jurídico',
    atividadeOrigem: 'Documentoscopia',
    ultimaAtividade: {
      nome: 'Documentoscopia',
      data: 'Nov 27',
      hora: '09:10',
    },
    isAdvogado: true,
    telefone: '(51) 99234-5678',
    historicoSolicitacoes: [],
  },
];

const mockDesdobramentos: Desdobramento[] = [
  {
    id: 'desdb1',
    operacaoId: 'op1',
    titulo: 'Emissão de CNDs',
    status: 'execucao',
    mensagensNaoLidas: 2,
    prazo: '0.82',
    mensagens: [
      {
        id: 'm1',
        desdobramentoId: 'desdb1',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Emissão de CNDs',
        timestamp: '14:00',
        tipo: 'recebida',
      },
      {
        id: 'm2',
        desdobramentoId: 'desdb1',
        remetente: 'Área Tributária',
        conteudo: 'Aguardando emissão das certidões federais e estaduais',
        timestamp: '14:30',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Necessária emissão de certidões negativas de débitos para prosseguimento.',
    timestampOrigem: '27/11/2025 às 14:00',
  },
  {
    id: 'desdb2',
    operacaoId: 'op1',
    titulo: 'Documentoscopia',
    status: 'execucao',
    mensagensNaoLidas: 3,
    prazo: '14',
    mensagens: [
      {
        id: 'm4',
        desdobramentoId: 'desdb2',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Documentoscopia',
        timestamp: '15:00',
        tipo: 'recebida',
      },
      {
        id: 'm5',
        desdobramentoId: 'desdb2',
        remetente: 'Área Jurídica',
        conteudo: 'Verificação de autenticidade dos documentos em andamento',
        timestamp: '16:20',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Análise de autenticidade documental requerida.',
    timestampOrigem: '27/11/2025 às 15:00',
  },
  {
    id: 'desdb1a',
    operacaoId: 'op1',
    titulo: 'Validação bancária',
    status: 'execucao',
    mensagensNaoLidas: 1,
    prazo: '22',
    mensagens: [
      {
        id: 'm1a',
        desdobramentoId: 'desdb1a',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Validação bancária',
        timestamp: '13:00',
        tipo: 'recebida',
      },
      {
        id: 'm2a',
        desdobramentoId: 'desdb1a',
        remetente: 'Área Financeira',
        conteudo: 'Dados bancários em validação junto ao banco',
        timestamp: '13:45',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Confirmação dos dados bancários do cedente necessária.',
    timestampOrigem: '27/11/2025 às 13:00',
  },

  {
    id: 'desdb1d',
    operacaoId: 'op1',
    titulo: 'Análise de Prioridade da Operação',
    status: 'resolvido',
    mensagensNaoLidas: 0,
    mensagens: [
      {
        id: 'm1d',
        desdobramentoId: 'desdb1d',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Análise de Prioridade',
        timestamp: '10:00',
        tipo: 'recebida',
      },
      {
        id: 'm2d',
        desdobramentoId: 'desdb1d',
        remetente: 'Você',
        conteudo: 'Bom dia! Iniciando análise da prioridade desta operação. Qual o valor envolvido e prazo estimado do cedente?',
        timestamp: '10:05',
        tipo: 'enviada',
      },
      {
        id: 'm3d',
        desdobramentoId: 'desdb1d',
        remetente: 'Comitê',
        conteudo: 'Valor: R$ 2.450.000,00. Cedente solicitou prazo de 15 dias para conclusão.',
        timestamp: '10:20',
        tipo: 'recebida',
      },
      {
        id: 'm4d',
        desdobramentoId: 'desdb1d',
        remetente: 'Você',
        conteudo: 'Entendido. Vou precisar do histórico de operações anteriores do cedente e o relatório de risco atualizado.',
        timestamp: '10:22',
        tipo: 'enviada',
      },
      {
        id: 'm5d',
        desdobramentoId: 'desdb1d',
        remetente: 'Comitê',
        conteudo: 'Segue documentação solicitada em anexo.',
        timestamp: '11:10',
        tipo: 'recebida',
        anexos: ['historico_cedente_AGU20006033.pdf', 'relatorio_risco_nov2025.xlsx'],
      },
      {
        id: 'm6d',
        desdobramentoId: 'desdb1d',
        remetente: 'Você',
        conteudo: 'Perfeito! Analisando os documentos. O histórico do cedente é positivo, sem inadimplências nos últimos 24 meses.',
        timestamp: '11:25',
        tipo: 'enviada',
      },
      {
        id: 'm7d',
        desdobramentoId: 'desdb1d',
        remetente: 'Você',
        conteudo: 'Baseado na análise, recomendo aprovação com prioridade ALTA. Segue parecer técnico completo.',
        timestamp: '11:28',
        tipo: 'enviada',
        anexos: ['parecer_prioridade_op1.pdf'],
      },
      {
        id: 'm8d',
        desdobramentoId: 'desdb1d',
        remetente: 'Comitê',
        conteudo: 'Operação aprovada com prioridade alta. Obrigado pela análise!',
        timestamp: '11:30',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Análise de prioridade da operação requerida.',
    timestampOrigem: '27/11/2025 às 10:00',
  },
  {
    id: 'desdb1e',
    operacaoId: 'op1',
    titulo: 'Conferência inicial',
    status: 'cancelado',
    mensagensNaoLidas: 0,
    mensagens: [
      {
        id: 'm1e',
        desdobramentoId: 'desdb1e',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Conferência inicial',
        timestamp: '09:00',
        tipo: 'recebida',
      },
      {
        id: 'm2e',
        desdobramentoId: 'desdb1e',
        remetente: 'Você',
        conteudo: 'Iniciando conferência dos documentos recebidos. Já recebi os anexos?',
        timestamp: '09:05',
        tipo: 'enviada',
      },
      {
        id: 'm3e',
        desdobramentoId: 'desdb1e',
        remetente: 'Gestão',
        conteudo: 'Aguarde, estamos reavaliando o fluxo desta operação.',
        timestamp: '09:15',
        tipo: 'recebida',
      },
      {
        id: 'm4e',
        desdobramentoId: 'desdb1e',
        remetente: 'Sistema',
        conteudo: 'Desdobramento cancelado - Substituído por análise prioritária. Esta operação foi reclassificada como alta prioridade.',
        timestamp: '09:30',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Conferência inicial dos documentos.',
    timestampOrigem: '27/11/2025 às 09:00',
  },

  {
    id: 'desdb4',
    operacaoId: 'op3',
    titulo: 'Parecer jurídico',
    status: 'perigo',
    mensagensNaoLidas: 2,
    prazo: '15',
    mensagens: [
      {
        id: 'm9',
        desdobramentoId: 'desdb4',
        remetente: 'Sistema',
        conteudo: 'URGENTE - Parecer jurídico necessário',
        timestamp: '14:00',
        tipo: 'recebida',
      },
      {
        id: 'm10',
        desdobramentoId: 'desdb4',
        remetente: 'Área Jurídica',
        conteudo: 'Processo apresenta irregularidades que precisam ser sanadas',
        timestamp: '14:05',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Documentação do processo apresenta inconsistências nas datas. Solicitar esclarecimentos ao advogado do cedente.',
    timestampOrigem: '27/11/2025 às 14:00',
  },
  {
    id: 'desdb5',
    operacaoId: 'op3',
    titulo: 'Análise do ativo (Advogado)',
    status: 'execucao',
    mensagensNaoLidas: 2,
    prazo: '20',
    mensagens: [
      {
        id: 'm11',
        desdobramentoId: 'desdb5',
        remetente: 'Sistema',
        conteudo: 'Desdobramento - Análise do ativo',
        timestamp: '13:00',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Sentença judicial precisa ser analisada para verificar trânsito em julgado.',
    timestampOrigem: '27/11/2025 às 13:00',
  },
  {
    id: 'desdb6',
    operacaoId: 'op3',
    titulo: 'Cálculo',
    status: 'resolvido',
    mensagensNaoLidas: 0,
    prazo: '28',
    mensagens: [
      {
        id: 'm12',
        desdobramentoId: 'desdb6',
        remetente: 'Sistema',
        conteudo: 'Desdobramento - Revisão de cálculo',
        timestamp: '09:00',
        tipo: 'recebida',
      },
      {
        id: 'm12a',
        desdobramentoId: 'desdb6',
        remetente: 'Você',
        conteudo: 'Iniciando revisão do cálculo apresentado. Preciso da planilha detalhada e da tabela de atualização aplicada.',
        timestamp: '09:15',
        tipo: 'enviada',
      },
      {
        id: 'm12b',
        desdobramentoId: 'desdb6',
        remetente: 'Área de Cálculo',
        conteudo: 'Segue planilha com memória de cálculo completa e tabela IPCA-E utilizada.',
        timestamp: '09:30',
        tipo: 'recebida',
        anexos: ['memoria_calculo_op3.xlsx', 'tabela_ipca_2024_2025.pdf'],
      },
      {
        id: 'm12c',
        desdobramentoId: 'desdb6',
        remetente: 'Você',
        conteudo: 'Analisando a planilha... Identifiquei que o índice de setembro/2025 está diferente do publicado pelo IBGE.',
        timestamp: '09:50',
        tipo: 'enviada',
      },
      {
        id: 'm12d',
        desdobramentoId: 'desdb6',
        remetente: 'Área de Cálculo',
        conteudo: 'Verificando... Você está correto! Houve um erro de digitação. Índice correto: 1,0247',
        timestamp: '10:00',
        tipo: 'recebida',
      },
      {
        id: 'm12e',
        desdobramentoId: 'desdb6',
        remetente: 'Você',
        conteudo: 'Refazendo o cálculo com o índice corrigido...',
        timestamp: '10:05',
        tipo: 'enviada',
      },
      {
        id: 'm12f',
        desdobramentoId: 'desdb6',
        remetente: 'Você',
        conteudo: 'Novo valor atualizado: R$ 456.789,12 (diferença de R$ 1.234,56 em relação ao cálculo anterior). Segue planilha revisada.',
        timestamp: '10:20',
        tipo: 'enviada',
        anexos: ['memoria_calculo_op3_REVISADA.xlsx'],
      },
      {
        id: 'm13',
        desdobramentoId: 'desdb6',
        remetente: 'Área de Cálculo',
        conteudo: 'Valores conferidos e aprovados. Obrigado pela revisão criteriosa!',
        timestamp: '10:30',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Valor apresentado requer validação com tabela atualizada.',
    timestampOrigem: '27/11/2025 às 09:00',
  },

  {
    id: 'desdb8',
    operacaoId: 'op5',
    titulo: 'Análise do ativo - Estudo do processo judicial',
    status: 'execucao',
    mensagensNaoLidas: 2,
    prazo: '36',
    mensagens: [
      {
        id: 'm15',
        desdobramentoId: 'desdb8',
        remetente: 'Sistema',
        conteudo: 'Desdobramento - Estudo do processo',
        timestamp: '11:00',
        tipo: 'recebida',
      },
      {
        id: 'm16',
        desdobramentoId: 'desdb8',
        remetente: 'Área Jurídica',
        conteudo: 'Processo completo, aguardando parecer final',
        timestamp: '11:25',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Processo judicial incompleto. Faltam documentos essenciais da fase de execução.',
    timestampOrigem: '27/11/2025 às 11:00',
  },
  {
    id: 'desdb9',
    operacaoId: 'op5',
    titulo: 'Emissão de CNDs automáticas',
    status: 'perigo',
    mensagensNaoLidas: 1,
    prazo: '20',
    mensagens: [
      {
        id: 'm17',
        desdobramentoId: 'desdb9',
        remetente: 'Sistema',
        conteudo: 'URGENTE - Emissão de CNDs pendente',
        timestamp: '11:30',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Sistema da Receita Federal fora do ar. Aguardando normalização para emissão das certidões.',
    timestampOrigem: '27/11/2025 às 11:30',
  },
  {
    id: 'desdb10',
    operacaoId: 'op6',
    titulo: 'Cálculo',
    status: 'execucao',
    mensagensNaoLidas: 0,
    prazo: '40',
    mensagens: [
      {
        id: 'm18',
        desdobramentoId: 'desdb10',
        remetente: 'Sistema',
        conteudo: 'Desdobramento - Cálculo iniciado',
        timestamp: '10:00',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Divergência entre valor do processo e valor solicitado. Aguardando justificativa do cedente.',
    timestampOrigem: '27/11/2025 às 10:00',
  },
  {
    id: 'desdb11',
    operacaoId: 'op7',
    titulo: 'Escritura de cessão',
    status: 'execucao',
    mensagensNaoLidas: 1,
    prazo: '2',
    mensagens: [
      {
        id: 'm19',
        desdobramentoId: 'desdb11',
        remetente: 'Sistema',
        conteudo: 'Desdobramento - Escritura de cessão',
        timestamp: '09:00',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Tabelião solicitou ajustes na minuta. Necessário revisão jurídica urgente.',
    timestampOrigem: '27/11/2025 às 09:00',
  },


  {
    id: 'desdb14',
    operacaoId: 'op10',
    titulo: 'Análise do ativo - Estudo do processo judicial',
    status: 'execucao',
    mensagensNaoLidas: 1,
    prazo: '15',
    mensagens: [
      {
        id: 'm24',
        desdobramentoId: 'desdb14',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Estudo do processo',
        timestamp: '14:15',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Processo judicial requer análise detalhada dos autos.',
    timestampOrigem: '27/11/2025 às 14:15',
  },


  // Desdobramentos finalizados para histórico
  {
    id: 'desdb17',
    operacaoId: 'op1',
    titulo: 'Análise do Ativo - cedente',
    status: 'resolvido',
    mensagensNaoLidas: 0,
    prazo: '0',
    mensagens: [
      {
        id: 'm29',
        desdobramentoId: 'desdb17',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Análise do cedente',
        timestamp: '08:00',
        tipo: 'recebida',
      },
      {
        id: 'm30',
        desdobramentoId: 'desdb17',
        remetente: 'Você',
        conteudo: 'Bom dia! Iniciando conferência cadastral do cedente. Preciso do CNPJ completo e documentos societários.',
        timestamp: '08:10',
        tipo: 'enviada',
      },
      {
        id: 'm31',
        desdobramentoId: 'desdb17',
        remetente: 'Área Cadastral',
        conteudo: 'CNPJ: 12.345.678/0001-90. Segue contrato social e última alteração em anexo.',
        timestamp: '08:45',
        tipo: 'recebida',
        anexos: ['contrato_social_AGU.pdf', 'alteracao_contratual_2025.pdf'],
      },
      {
        id: 'm32',
        desdobramentoId: 'desdb17',
        remetente: 'Você',
        conteudo: 'Documentos recebidos. Verificando situação na Receita Federal...',
        timestamp: '09:00',
        tipo: 'enviada',
      },
      {
        id: 'm33',
        desdobramentoId: 'desdb17',
        remetente: 'Você',
        conteudo: 'Situação regular confirmada. Empresa ativa desde 2010, sem pendências. Validando assinaturas dos sócios.',
        timestamp: '09:30',
        tipo: 'enviada',
      },
      {
        id: 'm34',
        desdobramentoId: 'desdb17',
        remetente: 'Você',
        conteudo: 'Conferência cadastral concluída com sucesso! Segue relatório de validação completo.',
        timestamp: '10:10',
        tipo: 'enviada',
        anexos: ['relatorio_validacao_cadastral.pdf'],
      },
      {
        id: 'm35',
        desdobramentoId: 'desdb17',
        remetente: 'Área Cadastral',
        conteudo: 'Cadastro validado com sucesso. Operação liberada para prosseguir.',
        timestamp: '10:15',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Validação cadastral necessária para prosseguir com análise.',
    timestampOrigem: '26/11/2025 às 08:00',
  },
  {
    id: 'desdb18',
    operacaoId: 'op1',
    titulo: 'Análise do cedente - Estudo do processo',
    status: 'resolvido',
    mensagensNaoLidas: 0,
    prazo: '0',
    mensagens: [
      {
        id: 'm31',
        desdobramentoId: 'desdb18',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Validação do cedente',
        timestamp: '09:00',
        tipo: 'recebida',
      },
      {
        id: 'm32a',
        desdobramentoId: 'desdb18',
        remetente: 'Você',
        conteudo: 'Preciso validar a procuração apresentada. Podem enviar o documento digitalizado em alta resolução?',
        timestamp: '09:15',
        tipo: 'enviada',
      },
      {
        id: 'm32b',
        desdobramentoId: 'desdb18',
        remetente: 'Área Jurídica',
        conteudo: 'Segue procuração pública lavrada em 15/11/2025.',
        timestamp: '09:40',
        tipo: 'recebida',
        anexos: ['procuracao_publica_livro345_folha78.pdf'],
      },
      {
        id: 'm32c',
        desdobramentoId: 'desdb18',
        remetente: 'Você',
        conteudo: 'Documento recebido. Verificando autenticidade no sistema do Cartório...',
        timestamp: '10:00',
        tipo: 'enviada',
      },
      {
        id: 'm32d',
        desdobramentoId: 'desdb18',
        remetente: 'Você',
        conteudo: 'Procuração autêntica confirmada. Poderes suficientes para representação. Analisando prazo de validade...',
        timestamp: '10:45',
        tipo: 'enviada',
      },
      {
        id: 'm32e',
        desdobramentoId: 'desdb18',
        remetente: 'Você',
        conteudo: 'Procuração válida até 15/11/2027. Todos os requisitos atendidos. Segue parecer jurídico de aprovação.',
        timestamp: '11:20',
        tipo: 'enviada',
        anexos: ['parecer_procuracao_aprovada.pdf'],
      },
      {
        id: 'm32',
        desdobramentoId: 'desdb18',
        remetente: 'Área Jurídica',
        conteudo: 'Procuração validada e aprovada. Cedente está habilitado para seguir com a operação.',
        timestamp: '11:30',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Procuração do cedente requer validação jurídica.',
    timestampOrigem: '26/11/2025 às 09:00',
  },
  {
    id: 'desdb19',
    operacaoId: 'op2',
    titulo: 'Emissão de CNDs',
    status: 'resolvido',
    mensagensNaoLidas: 0,
    prazo: '0',
    mensagens: [
      {
        id: 'm33',
        desdobramentoId: 'desdb19',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Emissão de CNDs',
        timestamp: '10:00',
        tipo: 'recebida',
      },
      {
        id: 'm33a',
        desdobramentoId: 'desdb19',
        remetente: 'Você',
        conteudo: 'Iniciando processo de emissão das certidões. Qual o CNPJ do cedente?',
        timestamp: '10:10',
        tipo: 'enviada',
      },
      {
        id: 'm33b',
        desdobramentoId: 'desdb19',
        remetente: 'Área Tributária',
        conteudo: 'CNPJ: 98.765.432/0001-10. Precisamos de CND Federal, Estadual e Municipal.',
        timestamp: '10:20',
        tipo: 'recebida',
      },
      {
        id: 'm33c',
        desdobramentoId: 'desdb19',
        remetente: 'Você',
        conteudo: 'Acessando sistema da Receita Federal para emissão da CND Federal...',
        timestamp: '10:30',
        tipo: 'enviada',
      },
      {
        id: 'm33d',
        desdobramentoId: 'desdb19',
        remetente: 'Você',
        conteudo: 'CND Federal emitida com sucesso! Empresa sem pendências fiscais federais.',
        timestamp: '11:15',
        tipo: 'enviada',
        anexos: ['CND_Federal_98765432000110.pdf'],
      },
      {
        id: 'm33e',
        desdobramentoId: 'desdb19',
        remetente: 'Você',
        conteudo: 'Emitindo CND Estadual (Estado de São Paulo)...',
        timestamp: '11:40',
        tipo: 'enviada',
      },
      {
        id: 'm33f',
        desdobramentoId: 'desdb19',
        remetente: 'Você',
        conteudo: 'CND Estadual emitida! Sem débitos de ICMS.',
        timestamp: '12:20',
        tipo: 'enviada',
        anexos: ['CND_Estadual_SP_98765432000110.pdf'],
      },
      {
        id: 'm33g',
        desdobramentoId: 'desdb19',
        remetente: 'Você',
        conteudo: 'Emitindo CND Municipal (Prefeitura de São Paulo)...',
        timestamp: '12:45',
        tipo: 'enviada',
      },
      {
        id: 'm33h',
        desdobramentoId: 'desdb19',
        remetente: 'Você',
        conteudo: 'Processo completo! Todas as 3 certidões negativas foram emitidas. Segue pacote consolidado.',
        timestamp: '13:15',
        tipo: 'enviada',
        anexos: ['Pacote_CNDs_Completo.zip'],
      },
      {
        id: 'm34',
        desdobramentoId: 'desdb19',
        remetente: 'Área Tributária',
        conteudo: 'Todas as certidões emitidas com sucesso. Empresa regularizada para prosseguir.',
        timestamp: '13:20',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Emissão de certidões negativas necessárias.',
    timestampOrigem: '25/11/2025 às 10:00',
  },
  {
    id: 'desdb20',
    operacaoId: 'op3',
    titulo: 'Documentoscopia',
    status: 'cancelado',
    mensagensNaoLidas: 0,
    prazo: '0',
    mensagens: [
      {
        id: 'm35',
        desdobramentoId: 'desdb20',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Documentoscopia',
        timestamp: '11:00',
        tipo: 'recebida',
      },
      {
        id: 'm35a',
        desdobramentoId: 'desdb20',
        remetente: 'Você',
        conteudo: 'Vou iniciar a análise documentoscópica. Quais documentos precisam ser validados?',
        timestamp: '11:10',
        tipo: 'enviada',
      },
      {
        id: 'm35b',
        desdobramentoId: 'desdb20',
        remetente: 'Gestão',
        conteudo: 'Aguarde um momento. Verificando se esta análise não foi duplicada...',
        timestamp: '11:20',
        tipo: 'recebida',
      },
      {
        id: 'm35c',
        desdobramentoId: 'desdb20',
        remetente: 'Gestão',
        conteudo: 'Confirmado: os documentos já passaram por validação completa no desdobramento "Análise do ativo". Não há necessidade de revalidação.',
        timestamp: '11:35',
        tipo: 'recebida',
      },
      {
        id: 'm36',
        desdobramentoId: 'desdb20',
        remetente: 'Você',
        conteudo: 'Entendido. Documentos já foram validados em etapa anterior. Cancelando este desdobramento para evitar retrabalho.',
        timestamp: '11:45',
        tipo: 'enviada',
      },
    ],
    mensagemOrigem: 'Análise de autenticidade dos documentos apresentados.',
    timestampOrigem: '24/11/2025 às 11:00',
  },
  {
    id: 'desdb21',
    operacaoId: 'op5',
    titulo: 'Ligação de confirmação',
    status: 'resolvido',
    mensagensNaoLidas: 0,
    prazo: '0',
    mensagens: [
      {
        id: 'm37',
        desdobramentoId: 'desdb21',
        remetente: 'Sistema',
        conteudo: 'Desdobramento criado - Ligação de confirmação',
        timestamp: '14:00',
        tipo: 'recebida',
      },
      {
        id: 'm37a',
        desdobramentoId: 'desdb21',
        remetente: 'Você',
        conteudo: 'Preciso realizar ligação de confirmação com o cedente. Qual o telefone de contato do representante legal?',
        timestamp: '14:10',
        tipo: 'enviada',
      },
      {
        id: 'm37b',
        desdobramentoId: 'desdb21',
        remetente: 'Área Comercial',
        conteudo: 'Contato: Dr. Roberto Silva - (41) 99876-5432. Melhor horário: 15h às 17h.',
        timestamp: '14:20',
        tipo: 'recebida',
      },
      {
        id: 'm37c',
        desdobramentoId: 'desdb21',
        remetente: 'Você',
        conteudo: 'Perfeito. Vou realizar a ligação agora às 15h00.',
        timestamp: '14:55',
        tipo: 'enviada',
      },
      {
        id: 'm37d',
        desdobramentoId: 'desdb21',
        remetente: 'Você',
        conteudo: 'Ligação realizada com sucesso! Dr. Roberto confirmou:\n- Valor da operação: R$ 1.850.000,00 ✓\n- Prazo solicitado: 20 dias ✓\n- Dados bancários para depósito ✓\n- Autorização para prosseguimento ✓',
        timestamp: '15:15',
        tipo: 'enviada',
      },
      {
        id: 'm37e',
        desdobramentoId: 'desdb21',
        remetente: 'Você',
        conteudo: 'Segue gravação da ligação e termo de confirmação assinado digitalmente pelo cedente.',
        timestamp: '15:25',
        tipo: 'enviada',
        anexos: ['gravacao_ligacao_23nov2025.mp3', 'termo_confirmacao_assinado.pdf'],
      },
      {
        id: 'm38',
        desdobramentoId: 'desdb21',
        remetente: 'Área Comercial',
        conteudo: 'Cedente confirmou todos os dados por telefone. Validação concluída com sucesso!',
        timestamp: '15:30',
        tipo: 'recebida',
      },
    ],
    mensagemOrigem: 'Ligação de confirmação necessária para validar dados do cedente.',
    timestampOrigem: '23/11/2025 às 14:00',
  },
];

export default function App() {
  const [selectedOperacaoId, setSelectedOperacaoId] = useState<string | null>('op1');
  const [operacoes, setOperacoes] = useState(mockOperacoes);
  const [desdobramentos, setDesdobramentos] = useState(mockDesdobramentos);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const selectedOperacao = operacoes.find(o => o.id === selectedOperacaoId) || null;
  // Todos os desdobramentos da operação (incluindo finalizados para exibir no histórico)
  const todosDesdobramentosOperacao = desdobramentos.filter(d => d.operacaoId === selectedOperacaoId);
  // Filtrar apenas desdobramentos ativos (não resolvidos ou cancelados) para o chat
  const operacaoDesdobramentos = desdobramentos.filter(
    d => d.operacaoId === selectedOperacaoId && d.status !== 'resolvido' && d.status !== 'cancelado'
  );

  // Calcular mensagens não lidas e contagem de desdobramentos por operação (apenas desdobramentos ativos)
  // Filtrar apenas operações que possuem pelo menos um desdobramento ativo
  const operacoesComMensagensNaoLidas = operacoes
    .map(op => {
      const desdobramentosOp = desdobramentos.filter(
        d => d.operacaoId === op.id && d.status !== 'resolvido' && d.status !== 'cancelado'
      );
      const totalNaoLidas = desdobramentosOp.reduce((total, d) => total + d.mensagensNaoLidas, 0);
      return { 
        ...op, 
        mensagensNaoLidas: totalNaoLidas,
        desdobramentosCount: desdobramentosOp.length
      };
    })
    .filter(op => op.desdobramentosCount > 0);

  const handleSendMessage = (desdobramentoId: string, messageText: string) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage: Message = {
      id: Date.now().toString(),
      desdobramentoId,
      remetente: 'Você',
      conteudo: messageText,
      timestamp,
      tipo: 'enviada',
    };

    setDesdobramentos(prev =>
      prev.map(d =>
        d.id === desdobramentoId
          ? { ...d, mensagens: [...d.mensagens, newMessage] }
          : d
      )
    );
  };

  const handleUpdateStatus = (status: string) => {
    if (!selectedOperacaoId) return;

    setOperacoes(prev =>
      prev.map(o =>
        o.id === selectedOperacaoId
          ? { ...o, status: status as Operacao['status'] }
          : o
      )
    );
  };

  const handleMarkAsRead = (desdobramentoId: string) => {
    setDesdobramentos(prev =>
      prev.map(d =>
        d.id === desdobramentoId
          ? { ...d, mensagensNaoLidas: 0 }
          : d
      )
    );
  };

  const handleFinalizarDesdobramento = (desdobramentoId: string) => {
    const desdobramento = desdobramentos.find(d => d.id === desdobramentoId);
    if (!desdobramento || !selectedOperacaoId) return;

    // Atualizar status do desdobramento para 'resolvido'
    setDesdobramentos(prev =>
      prev.map(d =>
        d.id === desdobramentoId
          ? { ...d, status: 'resolvido' }
          : d
      )
    );

    // Adicionar ao histórico da operação
    const now = new Date();
    const dataEncerramento = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const novoHistorico: HistoricoSolicitacao = {
      id: `hist_${Date.now()}`,
      titulo: desdobramento.titulo,
      mensagemOrigem: desdobramento.mensagemOrigem,
      dataSolicitacao: desdobramento.timestampOrigem,
      dataEncerramento,
      status: 'concluido',
      solicitante: 'Sistema',
      quantidadeAnexos: 0,
      atividadeOpera: selectedOperacao?.atividadeOpera || 'N/A',
    };

    setOperacoes(prev =>
      prev.map(o =>
        o.id === selectedOperacaoId
          ? {
              ...o,
              historicoSolicitacoes: [...(o.historicoSolicitacoes || []), novoHistorico],
            }
          : o
      )
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Painel Esquerdo - Solicitações */}
      <div className={`relative transition-all duration-300 ${leftPanelOpen ? 'w-[280px]' : 'w-0'}`}>
        {/* Botão Toggle Esquerdo - No meio vertical */}
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="absolute top-1/2 -translate-y-1/2 -right-3 z-10 bg-transparent hover:bg-card/50 border border-border rounded-md p-1.5 transition-all"
          title={leftPanelOpen ? 'Recolher Solicitações' : 'Expandir Solicitações'}
        >
          {leftPanelOpen ? <ChevronLeft size={16} className="text-secondary-foreground" /> : <ChevronRight size={16} className="text-secondary-foreground" />}
        </button>
        
        <div className={`${leftPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
          <OperacoesListClean
            operacoes={operacoesComMensagensNaoLidas}
            activeId={selectedOperacaoId}
            onSelect={setSelectedOperacaoId}
            desdobramentos={desdobramentos}
          />
        </div>
      </div>

      {/* Área Central - Chat */}
      <div className="flex-1">
        <OperacaoChatArea
          operacao={selectedOperacao}
          desdobramentos={operacaoDesdobramentos}
          todosDesdobramentos={todosDesdobramentosOperacao}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
          onMarkAsRead={handleMarkAsRead}
          onFinalizarDesdobramento={handleFinalizarDesdobramento}
        />
      </div>

      {/* Painel Direito - Informações */}
      <div className={`relative transition-all duration-300 ${rightPanelOpen ? 'w-[300px]' : 'w-0'}`}>
        {/* Botão Toggle Direito - No meio vertical */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="absolute top-1/2 -translate-y-1/2 -left-3 z-10 bg-transparent hover:bg-card/50 border border-border rounded-md p-1.5 transition-all"
          title={rightPanelOpen ? 'Recolher Informações' : 'Expandir Informações'}
        >
          {rightPanelOpen ? <ChevronRight size={16} className="text-secondary-foreground" /> : <ChevronLeft size={16} className="text-secondary-foreground" />}
        </button>
        
        <div className={`${rightPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
          <CKalilPanel operacao={selectedOperacao} />
        </div>
      </div>
    </div>
  );
}