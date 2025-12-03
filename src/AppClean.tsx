import { useState } from 'react';
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

// Mock data (same as original)
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
    cedente: 'Carlos Eduardo Lima',
    idExterno: '3245791',
    valor: 'R$ 8.750.000,00',
    enteDevedor: 'Município de São Paulo',
    status: 'em_andamento',
    prioridade: false,
    ultimaAtualizacao: 'Hoje às 15:30',
    horario: '15:30',
    desdobramentosCount: 3,
    mensagensNaoLidas: 2,
    prazo: '12 horas',
    etapaAtual: 3,
    responsavel: 'Ana Paula Souza',
    criado: '27/11/2025 às 09:00',
    atividadeOpera: 'AT-2025-3402',
    demandante: 'Comercial',
    atividadeOrigem: 'Análise do ativo',
    ultimaAtividade: {
      nome: 'Análise do ativo',
      data: 'Nov 27',
      hora: '15:25',
    },
    isAdvogado: false,
    telefone: '(11) 98765-4321',
    historicoSolicitacoes: [],
  },
  {
    id: 'op3',
    cedente: 'Fernanda Almeida Costa',
    idExterno: '3245792',
    valor: 'R$ 22.500.000,00',
    enteDevedor: 'Estado de Minas Gerais',
    status: 'em_andamento',
    prioridade: true,
    ultimaAtualizacao: 'Hoje às 14:15',
    horario: '14:15',
    desdobramentosCount: 5,
    mensagensNaoLidas: 0,
    prazo: '24 horas',
    etapaAtual: 2,
    responsavel: 'Bruno Carvalho',
    criado: '27/11/2025 às 08:30',
    atividadeOpera: 'AT-2025-3403',
    demandante: 'Jurídico',
    atividadeOrigem: 'Parecer jurídico',
    ultimaAtividade: {
      nome: 'Parecer jurídico',
      data: 'Nov 27',
      hora: '14:10',
    },
    isAdvogado: true,
    telefone: '(31) 99123-4567',
    historicoSolicitacoes: [],
  },
];

const mockDesdobramentos: Desdobramento[] = [
  {
    id: 'desdb1',
    operacaoId: 'op1',
    titulo: 'Parecer jurídico',
    status: 'execucao',
    mensagensNaoLidas: 2,
    prazo: '6',
    mensagens: [
      {
        id: 'msg1',
        desdobramentoId: 'desdb1',
        remetente: 'Rafael Costa',
        conteudo: 'Iniciando análise do parecer jurídico. Documentação recebida.',
        timestamp: '14:30',
        tipo: 'recebida',
      },
      {
        id: 'msg2',
        desdobramentoId: 'desdb1',
        remetente: 'Você',
        conteudo: 'Perfeito. Aguardo retorno em até 6 horas.',
        timestamp: '14:35',
        tipo: 'enviada',
      },
    ],
    mensagemOrigem: 'Necessário parecer jurídico para validação da cessão de precatórios do Estado do Paraná.',
    timestampOrigem: '27/11/2025 às 14:00',
  },
  {
    id: 'desdb2',
    operacaoId: 'op1',
    titulo: 'Análise do ativo (Advogado)',
    status: 'sucesso',
    mensagensNaoLidas: 0,
    mensagens: [],
    mensagemOrigem: 'Solicito análise completa do ativo envolvido na operação.',
    timestampOrigem: '27/11/2025 às 14:00',
  },
  {
    id: 'desdb3',
    operacaoId: 'op1',
    titulo: 'Cálculo',
    status: 'execucao',
    mensagensNaoLidas: 1,
    prazo: '8',
    mensagens: [],
    mensagemOrigem: 'Favor realizar cálculo de viabilidade da operação.',
    timestampOrigem: '27/11/2025 às 14:00',
  },
  {
    id: 'desdb4',
    operacaoId: 'op2',
    titulo: 'Emissão de CNDs',
    status: 'execucao',
    mensagensNaoLidas: 1,
    prazo: '12',
    mensagens: [],
    mensagemOrigem: 'Necessário emitir CNDs federais e estaduais.',
    timestampOrigem: '27/11/2025 às 09:00',
  },
];

function AppClean() {
  const [selectedOperacaoId, setSelectedOperacaoId] = useState<string | null>('op1');

  const selectedOperacao = mockOperacoes.find(op => op.id === selectedOperacaoId);
  const desdobramentosOperacao = mockDesdobramentos.filter(d => d.operacaoId === selectedOperacaoId);

  const handleMarkAsRead = (desdobramentoId: string) => {
    // Lógica para marcar como lido
    console.log('Marcar como lido:', desdobramentoId);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Lista de Operações - Versão Limpa */}
      <OperacoesListClean
        operacoes={mockOperacoes}
        activeId={selectedOperacaoId}
        onSelect={setSelectedOperacaoId}
        desdobramentos={mockDesdobramentos}
      />

      {/* Área de Chat */}
      {selectedOperacao && (
        <OperacaoChatArea
          operacao={selectedOperacao}
          desdobramentos={desdobramentosOperacao}
          onMarkAsRead={handleMarkAsRead}
        />
      )}

      {/* Painel Direito - C-Kalil */}
      {selectedOperacao && (
        <CKalilPanel operacao={selectedOperacao} />
      )}
    </div>
  );
}

export default AppClean;
