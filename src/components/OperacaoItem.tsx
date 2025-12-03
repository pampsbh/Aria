import { AlertCircle, MessageCircle, Flag } from 'lucide-react';

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
  prazo?: string;
};

type OperacaoItemProps = {
  operacao: Operacao;
  isActive: boolean;
  onClick: () => void;
  desdobramentos?: Desdobramento[];
};

export function OperacaoItem({ operacao, isActive, onClick, desdobramentos = [] }: OperacaoItemProps) {
  // Calcular desdobramentos ativos (excluindo resolvidos e cancelados)
  const desdobramentosAtivosData = desdobramentos.filter(
    d => d.operacaoId === operacao.id && d.status !== 'resolvido' && d.status !== 'cancelado'
  );

  const count = desdobramentosAtivosData.length > 0 ? desdobramentosAtivosData.length : operacao.desdobramentosCount;

  // Encontrar o desdobramento com prazo mais crítico
  const desdobramentosComPrazo = desdobramentosAtivosData.filter(d => d.prazo);
  const prazos = desdobramentosComPrazo.map(d => parseFloat(d.prazo || '0'));
  const menorPrazo = prazos.length > 0 ? Math.min(...prazos) : null;

  // Só mostrar barra se prazo < 3 horas (vermelho - crítico)
  const mostrarBarraPrazo = menorPrazo !== null && menorPrazo < 3;
  const progressPercent = menorPrazo ? Math.max(100 - (menorPrazo / 48) * 100, 0) : 0;

  return (
    <button
      onClick={onClick}
      className={`
        w-full min-h-[72px] flex flex-col transition-all border-l-4
        ${isActive 
          ? 'border-l-primary bg-[#b5e8ff]' 
          : 'border-l-transparent hover:bg-muted'
        }
      `}
    >
      <div className="w-full flex items-center px-4 gap-3 py-3">
        <div className="flex-1 min-w-0">
          <p className="truncate text-left">
            {operacao.cedente}
          </p>
          <p className="text-secondary-foreground text-left">
            {operacao.idExterno}
          </p>
          <p className="text-secondary-foreground text-left text-[13px] font-[Lato]">
            {operacao.valor} • {operacao.enteDevedor}
          </p>
          <p className="text-primary text-left mt-1 text-[14px]">
            {count} {count === 1 ? 'desdobramento' : 'desdobramentos'}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-secondary-foreground text-[14px]">
            {operacao.horario}
          </p>
          {operacao.mensagensNaoLidas > 0 && (
            <div className="relative" title={`${operacao.mensagensNaoLidas} mensagens não lidas`}>
              <MessageCircle size={18} className="text-primary" />
              <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground px-1 py-0.5 rounded-full min-w-[14px] flex items-center justify-center text-[9px]">
                {operacao.mensagensNaoLidas}
              </div>
            </div>
          )}
          {operacao.prioridade && (
            <Flag size={16} className="text-destructive" />
          )}
        </div>
      </div>

      {mostrarBarraPrazo && (
        <div className="w-full px-4 pb-2">
          <div className="w-full bg-muted h-[4px] rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 bg-destructive"
              style={{ 
                width: `${progressPercent}%`
              }}
            />
          </div>
        </div>
      )}
    </button>
  );
}
