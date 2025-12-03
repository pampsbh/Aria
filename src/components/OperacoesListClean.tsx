import { Search, Flag } from 'lucide-react';
import { OperacaoItemClean } from './OperacaoItemClean';
import { useState } from 'react';

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
};

type Desdobramento = {
  id: string;
  operacaoId: string;
  status: 'sucesso' | 'execucao' | 'perigo' | 'resolvido' | 'cancelado';
};

type OperacoesListProps = {
  operacoes: Operacao[];
  activeId: string | null;
  onSelect: (id: string) => void;
  desdobramentos?: Desdobramento[];
};

export function OperacoesListClean({ operacoes, activeId, onSelect, desdobramentos = [] }: OperacoesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'todas' | 'prioridade'>('todas');

  // Função para converter horário "HH:MM" em minutos desde meia-noite
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Filtrar operações pela busca
  const operacoesFiltradas = operacoes.filter(o => 
    o.cedente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.idExterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.enteDevedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar por aba ativa
  const filteredByTab = operacoesFiltradas.filter(o => {
    if (activeTab === 'todas') return true;
    if (activeTab === 'prioridade') return o.prioridade;
    return false;
  });

  // Função para verificar se operação tem SLA crítico (< 3 horas)
  const temSlaCritico = (operacao: Operacao): boolean => {
    const desdobramentosAtivos = desdobramentos.filter(
      d => d.operacaoId === operacao.id && d.status !== 'resolvido' && d.status !== 'cancelado'
    );
    const desdobramentosComPrazo = desdobramentosAtivos.filter(d => d.prazo);
    const prazos = desdobramentosComPrazo.map(d => parseFloat(d.prazo || '0'));
    const menorPrazo = prazos.length > 0 ? Math.min(...prazos) : null;
    return menorPrazo !== null && menorPrazo < 3;
  };

  // Ordenar: primeiro por SLA crítico, depois por horário (mais recente primeiro)
  const filteredList = filteredByTab.sort((a, b) => {
    const slaCriticoA = temSlaCritico(a);
    const slaCriticoB = temSlaCritico(b);

    // Se uma tem SLA crítico e outra não, priorizar a que tem
    if (slaCriticoA && !slaCriticoB) return -1;
    if (!slaCriticoA && slaCriticoB) return 1;

    // Se ambas têm ou ambas não têm SLA crítico, ordenar por horário
    const timeA = timeToMinutes(a.horario);
    const timeB = timeToMinutes(b.horario);
    return timeB - timeA; // Descendente (mais recente primeiro)
  });

  return (
    <div className="w-[280px] bg-card border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="px-3 pt-5 pb-3 border-b border-border">
        <h4 className="mb-3 text-secondary-foreground font-[Lato]">Solicitações</h4>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-border rounded-lg bg-input-background focus:outline-none focus:border-primary text-[13px]"
          />
        </div>
        
        {/* Tabs - Minimalista */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveTab('todas')}
            className={`
              px-2.5 py-1.5 rounded-md transition-all text-[12px] flex items-center gap-1 whitespace-nowrap
              ${activeTab === 'todas'
                ? 'bg-primary text-primary-foreground'
                : 'text-secondary-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            Todas
            <span className={`
              px-1.5 py-0.5 rounded-full text-[10px] min-w-[16px] text-center inline-block
              ${activeTab === 'todas'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-secondary-foreground'
              }
            `}>
              {operacoesFiltradas.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('prioridade')}
            className={`
              flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all text-[12px] whitespace-nowrap
              ${activeTab === 'prioridade'
                ? 'bg-primary text-primary-foreground'
                : 'text-secondary-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <Flag size={11} />
            Prioridade
            <span className={`
              px-1.5 py-0.5 rounded-full text-[10px] min-w-[16px] text-center inline-block
              ${activeTab === 'prioridade'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-secondary-foreground'
              }
            `}>
              {operacoesFiltradas.filter(op => op.prioridade).length}
            </span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredList.length > 0 ? (
          filteredList.map((operacao) => (
            <OperacaoItemClean
              key={operacao.id}
              operacao={operacao}
              isActive={activeId === operacao.id}
              onClick={() => onSelect(operacao.id)}
              desdobramentos={desdobramentos}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-secondary-foreground text-[14px]">
            Nenhuma solicitação encontrada
          </div>
        )}
      </div>
    </div>
  );
}