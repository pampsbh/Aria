import { Check, Circle, Clock, ExternalLink } from 'lucide-react';

type Operacao = {
  id: string;
  cedente: string;
  idExterno: string;
  valor: string;
  enteDevedor: string;
  status: 'novo' | 'em_andamento' | 'pendente' | 'concluido';
  prioridade: boolean;
  etapaAtual: number; // 0-7 for the 8 stages
  etapasParalelas?: number[]; // Array of parallel stage indices
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
};

type CKalilPanelProps = {
  operacao: Operacao | null;
};

type Etapa = {
  nome: string;
  index: number;
  grupo?: number; // Para agrupar etapas paralelas
};

// Estrutura de etapas com grupos paralelos
const etapasEstrutura: Etapa[] = [
  { nome: 'Conferência inicial', index: 0 },
  { nome: 'Análise do ativo', index: 1, grupo: 1 },
  { nome: 'Validação do cedente', index: 2, grupo: 1 },
  { nome: 'Cálculo', index: 3, grupo: 2 },
  { nome: 'Análise do cedente', index: 4, grupo: 2 },
  { nome: 'Providências jurídicas', index: 5, grupo: 2 },
  { nome: 'Parecer jurídico', index: 6 },
  { nome: 'Formalização', index: 7 },
];

export function CKalilPanel({ operacao }: CKalilPanelProps) {
  if (!operacao) {
    return (
      <div className="w-[300px] bg-card border-l border-border p-4">
        <p className="text-muted-foreground text-center text-[13px]">
          Nenhuma operação selecionada
        </p>
      </div>
    );
  }

  const etapaAtual = operacao.etapaAtual || 0;
  const etapasParalelas = operacao.etapasParalelas || [etapaAtual];

  // Função para verificar o estado de uma etapa
  const getEtapaStatus = (index: number) => {
    if (etapasParalelas.includes(index)) return 'atual';
    if (index < Math.min(...etapasParalelas)) return 'concluida';
    return 'futura';
  };

  // Agrupar etapas por grupo
  const grupos: { [key: number]: Etapa[] } = {};
  const etapasSemGrupo: Etapa[] = [];

  etapasEstrutura.forEach(etapa => {
    if (etapa.grupo !== undefined) {
      if (!grupos[etapa.grupo]) grupos[etapa.grupo] = [];
      grupos[etapa.grupo].push(etapa);
    } else {
      etapasSemGrupo.push(etapa);
    }
  });

  const renderEtapa = (etapa: Etapa, isLastInGroup: boolean = true) => {
    const status = getEtapaStatus(etapa.index);
    const isConcluida = status === 'concluida';
    const isAtual = status === 'atual';
    const isFutura = status === 'futura';

    return (
      <div key={etapa.index} className="flex gap-3">
        {/* Line and Circle */}
        <div className="flex flex-col items-center">
          {/* Circle/Check */}
          <div 
            className={`
              w-6 h-6 rounded-full flex items-center justify-center shrink-0
              ${isConcluida ? 'bg-chart-2' : ''}
              ${isAtual ? 'bg-primary' : ''}
              ${isFutura ? 'bg-border' : ''}
            `}
          >
            {isConcluida && <Check size={14} className="text-white" />}
            {isAtual && <Circle size={10} className="text-white fill-white" />}
            {isFutura && <Circle size={10} className="text-muted-foreground" />}
          </div>
          
          {/* Vertical line */}
          {isLastInGroup && (
            <div 
              className={`
                w-[2px] h-10 
                ${isConcluida ? 'bg-chart-2' : 'bg-border'}
              `}
            />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 pb-4">
          <p 
            className={`
              text-[13px]
              ${isConcluida ? 'text-chart-2' : ''}
              ${isAtual ? 'text-primary' : ''}
              ${isFutura ? 'text-muted-foreground' : ''}
            `}
          >
            {etapa.nome}
          </p>
          {isAtual && (
            <p className="text-primary mt-0.5 text-[11px]">Em andamento</p>
          )}
          {isConcluida && (
            <p className="text-chart-2 mt-0.5 text-[11px]">Concluída</p>
          )}
        </div>
      </div>
    );
  };

  const renderGrupoParalelo = (grupoEtapas: Etapa[], grupoIndex: number, isLast: boolean) => {
    // Determina se alguma etapa do grupo está ativa ou concluída
    const algumaConcluida = grupoEtapas.some(e => getEtapaStatus(e.index) === 'concluida');
    const algumaAtual = grupoEtapas.some(e => getEtapaStatus(e.index) === 'atual');

    return (
      <div key={`grupo-${grupoIndex}`} className="flex gap-3">
        {/* Linha principal */}
        <div className="flex flex-col items-center">
          {/* Círculo do grupo */}
          <div 
            className={`
              w-6 h-6 rounded-full flex items-center justify-center shrink-0
              ${algumaConcluida && !algumaAtual ? 'bg-chart-2' : ''}
              ${algumaAtual ? 'bg-primary' : ''}
              ${!algumaConcluida && !algumaAtual ? 'bg-border' : ''}
            `}
          >
            {algumaConcluida && !algumaAtual && <Check size={14} className="text-white" />}
            {algumaAtual && <Circle size={10} className="text-white fill-white" />}
            {!algumaConcluida && !algumaAtual && <Circle size={10} className="text-muted-foreground" />}
          </div>
          
          {/* Linha vertical do grupo */}
          {!isLast && (
            <div 
              className={`
                w-[2px] h-full min-h-[60px]
                ${algumaConcluida ? 'bg-chart-2' : 'bg-border'}
              `}
            />
          )}
        </div>

        {/* Etapas paralelas */}
        <div className="flex-1 pb-4">
          <div className="border-l-2 border-border pl-4 space-y-3">
            {grupoEtapas.map((etapa, idx) => {
              const status = getEtapaStatus(etapa.index);
              const isConcluida = status === 'concluida';
              const isAtual = status === 'atual';
              const isFutura = status === 'futura';

              return (
                <div key={etapa.index} className="flex items-start gap-2">
                  <div 
                    className={`
                      w-3 h-3 rounded-full shrink-0 mt-1
                      ${isConcluida ? 'bg-chart-2' : ''}
                      ${isAtual ? 'bg-primary' : ''}
                      ${isFutura ? 'bg-border' : ''}
                    `}
                  />
                  <div>
                    <p 
                      className={`
                        text-[13px]
                        ${isConcluida ? 'text-chart-2' : ''}
                        ${isAtual ? 'text-primary' : ''}
                        ${isFutura ? 'text-muted-foreground' : ''}
                      `}
                    >
                      {etapa.nome}
                    </p>
                    {isAtual && (
                      <p className="text-primary mt-0.5 text-[11px]">Em andamento</p>
                    )}
                    {isConcluida && (
                      <p className="text-chart-2 mt-0.5 text-[11px]">Concluída</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[300px] bg-card border-l border-border flex flex-col h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h4 className="text-secondary-foreground font-normal text-[16px] font-[Lato]">Circuito Kalil</h4>
        <button
          onClick={() => window.open('https://opera.com/circuito-kalil', '_blank')}
          className="text-secondary-foreground hover:text-primary transition-colors"
          title="Abrir Circuito Kalil em nova aba"
        >
          <ExternalLink size={16} />
        </button>
      </div>

      {/* C-Kalil */}
      <div className="p-3 flex-1">
        <div className="space-y-1">
          {/* Conferência inicial */}
          {renderEtapa(etapasEstrutura[0])}
          
          {/* Grupo 1: Análise do ativo + Validação do cedente */}
          {renderGrupoParalelo(grupos[1], 1, false)}
          
          {/* Grupo 2: Cálculo + Análise do cedente + Providências jurídicas */}
          {renderGrupoParalelo(grupos[2], 2, false)}
          
          {/* Parecer jurídico */}
          {renderEtapa(etapasEstrutura[6])}
          
          {/* Formalização */}
          {renderEtapa(etapasEstrutura[7], false)}
        </div>

        {/* Última Atividade */}
        {operacao.ultimaAtividade && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-secondary-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-secondary-foreground mb-1">Última atividade</p>
                <p className="text-foreground text-[14px]">{operacao.ultimaAtividade.nome}</p>
                <p className="text-muted-foreground mt-1 text-[12px]">
                  {operacao.ultimaAtividade.data} — {operacao.ultimaAtividade.hora}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}