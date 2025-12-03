type Desdobramento = {
  id: string;
  titulo: string;
  operacao: string;
  status: 'novo' | 'em_andamento' | 'pendente' | 'concluido';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  ultimaAtualizacao: string;
  horario: string;
  mensagensNaoLidas: number;
  cedente?: string;
  idExterno?: string;
};

type DesdobramentoItemProps = {
  desdobramento: Desdobramento;
  isActive: boolean;
  onClick: () => void;
};

const statusColors = {
  novo: 'bg-[#b5e8ff]',
  em_andamento: 'bg-white',
  pendente: 'bg-[#f7f7f7]',
  concluido: 'bg-[#e8f5e9]',
};

export function DesdobramentoItem({ desdobramento, isActive, onClick }: DesdobramentoItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full h-[60px] flex items-center px-4 gap-3 transition-all border-l-4
        ${isActive 
          ? 'border-l-[#0061d6] bg-[#b5e8ff]' 
          : 'border-l-transparent hover:bg-[#f7f7f7]'
        }
        ${statusColors[desdobramento.status]}
      `}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[#717979] truncate text-left">
          {desdobramento.cedente || desdobramento.titulo}
        </p>
        <p className="text-[12px] text-[#717979] text-left">
          {desdobramento.idExterno ? `${desdobramento.idExterno} • ${desdobramento.operacao}` : desdobramento.operacao}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-[12px] text-[#717979]">
          {desdobramento.horario}
        </p>
        {desdobramento.mensagensNaoLidas > 0 && (
          <div className="bg-[#e6f2ff] rounded-full px-2 py-1 min-w-[24px] flex items-center justify-center">
            <span className="text-[12px] text-[#717979]">
              {desdobramento.mensagensNaoLidas}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}