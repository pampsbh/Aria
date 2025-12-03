import { Search, Filter, Flag } from 'lucide-react';
import { OperacaoItem } from './OperacaoItem';
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

export function OperacoesList({ operacoes, activeId, onSelect, desdobramentos = [] }: OperacoesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'todas' | 'prioridade' | 'normal'>('todas');

  // Função para converter horário "HH:MM" em minutos desde meia-noite
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Filtrar operações pela busca
  const filtered = operacoes.filter(o => 
    o.cedente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.idExterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.enteDevedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar por aba ativa
  const filteredByTab = filtered.filter(o => {
    if (activeTab === 'todas') return true;
    if (activeTab === 'prioridade') return o.prioridade;
    return !o.prioridade;
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
    <div className="w-[320px] bg-card border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <h2 className="mb-3">Solicitações</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground" size={16} />
          <input
            type="text"
            placeholder="Buscar operações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:border-primary"
          />

        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 bg-[rgb(230,242,255)] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('todas')}
            className={`flex-1 py-2 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 text-xs ${
              activeTab === 'todas'
                ? 'bg-card text-primary shadow-sm'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            Todas
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              activeTab === 'todas'
                ? 'bg-primary text-primary-foreground'
                : 'bg-border text-secondary-foreground'
            }`}>
              {operacoes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('prioridade')}
            className={`flex-1 py-2 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 text-xs ${
              activeTab === 'prioridade'
                ? 'bg-card text-primary shadow-sm'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            <Flag size={13} />
            Prioridade
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              activeTab === 'prioridade'
                ? 'bg-primary text-primary-foreground'
                : 'bg-border text-secondary-foreground'
            }`}>
              {operacoes.filter(o => o.prioridade).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('normal')}
            className={`flex-1 py-2 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 text-xs ${
              activeTab === 'normal'
                ? 'bg-card text-primary shadow-sm'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            Normal
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              activeTab === 'normal'
                ? 'bg-primary text-primary-foreground'
                : 'bg-border text-secondary-foreground'
            }`}>
              {operacoes.filter(o => !o.prioridade).length}
            </span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredList.map((operacao) => (
          <OperacaoItem
            key={operacao.id}
            operacao={operacao}
            isActive={activeId === operacao.id}
            onClick={() => onSelect(operacao.id)}
            desdobramentos={desdobramentos}
          />
        ))}
      </div>
    </div>
  );
}
