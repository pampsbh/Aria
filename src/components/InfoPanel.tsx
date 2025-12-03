import { User, Building, Calendar, Tag, Clock, TrendingUp } from 'lucide-react';

type Desdobramento = {
  id: string;
  titulo: string;
  operacao: string;
  status: 'novo' | 'em_andamento' | 'pendente' | 'concluido';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  ultimaAtualizacao: string;
  horario: string;
  mensagensNaoLidas: number;
  prazo?: string;
  responsavel?: string;
  criado?: string;
  atividadeOpera?: string;
  participantes?: string[];
};

type InfoPanelProps = {
  desdobramento: Desdobramento | null;
};

const statusLabels = {
  novo: 'Novo',
  em_andamento: 'Em Andamento',
  pendente: 'Pendente',
  concluido: 'Concluído',
};

const statusColors = {
  novo: 'bg-[#2196f3] text-white',
  em_andamento: 'bg-[#fec33c] text-white',
  pendente: 'bg-[#ff9800] text-white',
  concluido: 'bg-[#4caf50] text-white',
};

const prioridadeLabels = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
};

const prioridadeColors = {
  baixa: 'bg-[#9e9e9e] text-white',
  media: 'bg-[#2196f3] text-white',
  alta: 'bg-[#ff9800] text-white',
  urgente: 'bg-[#f44336] text-white',
};

export function InfoPanel({ desdobramento }: InfoPanelProps) {
  if (!desdobramento) {
    return (
      <div className="w-[320px] bg-white border-l border-[#e0e0e0] p-6">
        <p className="text-[#a5abab] text-center">
          Nenhum desdobramento selecionado
        </p>
      </div>
    );
  }

  return (
    <div className="w-[320px] bg-white border-l border-[#e0e0e0] flex flex-col h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-[#e0e0e0]">
        <h3 className="text-[#2B313B] mb-2">Informações do Desdobramento</h3>
      </div>

      {/* Status and Priority */}
      <div className="p-4 border-b border-[#e0e0e0]">
        <div className="mb-3">
          <p className="text-[12px] text-[#717979] mb-1">Status</p>
          <span className={`inline-block px-3 py-1 rounded-full text-[12px] ${statusColors[desdobramento.status]}`}>
            {statusLabels[desdobramento.status]}
          </span>
        </div>
        <div>
          <p className="text-[12px] text-[#717979] mb-1">Prioridade</p>
          <span className={`inline-block px-3 py-1 rounded-full text-[12px] ${prioridadeColors[desdobramento.prioridade]}`}>
            {prioridadeLabels[desdobramento.prioridade]}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 border-b border-[#e0e0e0]">
        <h4 className="text-[#2B313B] text-[14px] mb-3">Detalhes</h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Building size={16} className="text-[#717979] mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[#a5abab]">Operação</p>
              <p className="text-[13px] text-[#2B313B] break-words">{desdobramento.operacao}</p>
            </div>
          </div>

          {desdobramento.atividadeOpera && (
            <div className="flex items-start gap-2">
              <Tag size={16} className="text-[#717979] mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#a5abab]">Atividade Opera</p>
                <p className="text-[13px] text-[#2B313B] break-words">{desdobramento.atividadeOpera}</p>
              </div>
            </div>
          )}

          {desdobramento.responsavel && (
            <div className="flex items-start gap-2">
              <User size={16} className="text-[#717979] mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#a5abab]">Responsável</p>
                <p className="text-[13px] text-[#2B313B]">{desdobramento.responsavel}</p>
              </div>
            </div>
          )}

          {desdobramento.criado && (
            <div className="flex items-start gap-2">
              <Calendar size={16} className="text-[#717979] mt-0.5 shrink-0" />
            </div>
          )}

          <div className="flex items-start gap-2">
            <Clock size={16} className="text-[#717979] mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[#a5abab]">Última atualização</p>
              <p className="text-[13px] text-[#2B313B]">{desdobramento.ultimaAtualizacao}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 border-b border-[#e0e0e0]">
        <h4 className="text-[#2B313B] text-[14px] mb-3">Timeline</h4>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-[#0061d6]" />
              <div className="w-[1px] h-full bg-[#e0e0e0] mt-1" />
            </div>
            <div className="flex-1 pb-4">
              <p className="text-[12px] text-[#2B313B]">Desdobramento criado</p>
              <p className="text-[11px] text-[#a5abab]">{desdobramento.criado || 'Hoje, 08:00'}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-[#fec33c]" />
              <div className="w-[1px] h-full bg-[#e0e0e0] mt-1" />
            </div>
            <div className="flex-1 pb-4">
              <p className="text-[12px] text-[#2B313B]">Em análise pelo comercial</p>
              <p className="text-[11px] text-[#a5abab]">Hoje, 09:15</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-[#e0e0e0]" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] text-[#a5abab]">Aguardando resposta</p>
              <p className="text-[11px] text-[#a5abab]">Agora</p>
            </div>
          </div>
        </div>
      </div>

      {/* Participants */}
      {desdobramento.participantes && desdobramento.participantes.length > 0 && (
        <div className="p-4">
          <h4 className="text-[#2B313B] text-[14px] mb-3">Participantes</h4>
          <div className="space-y-2">
            {desdobramento.participantes.map((participante, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#e0e0e0] flex items-center justify-center text-[#717979] text-[12px]">
                  {participante.charAt(0).toUpperCase()}
                </div>
                <p className="text-[13px] text-[#2B313B]">{participante}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}