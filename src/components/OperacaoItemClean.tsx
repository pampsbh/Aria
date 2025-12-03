import { Flag } from 'lucide-react';

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

export function OperacaoItemClean({ operacao, isActive, onClick, desdobramentos = [] }: OperacaoItemProps) {
  // Calcular desdobramentos ativos (excluindo resolvidos e cancelados)
  const desdobramentosAtivosData = desdobramentos.filter(
    d => d.operacaoId === operacao.id && d.status !== 'resolvido' && d.status !== 'cancelado'
  );

  const count = desdobramentosAtivosData.length > 0 ? desdobramentosAtivosData.length : operacao.desdobramentosCount;

  // Encontrar o desdobramento com prazo mais crítico
  const desdobramentosComPrazo = desdobramentosAtivosData.filter(d => d.prazo);
  const prazos = desdobramentosComPrazo.map(d => parseFloat(d.prazo || '0'));
  const menorPrazo = prazos.length > 0 ? Math.min(...prazos) : null;

  // Mostrar barra se prazo < 3 horas (crítico)
  const mostrarBarraPrazo = menorPrazo !== null && menorPrazo < 3;
  const progressPercent = menorPrazo ? Math.max(100 - (menorPrazo / 48) * 100, 0) : 0;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex flex-col transition-all border-l-[3px]
        ${isActive 
          ? 'border-l-primary bg-muted/50' 
          : 'border-l-transparent hover:bg-muted/30'
        }
      `}
    >
      <div className="flex items-center gap-2.5 px-3 py-3">
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="truncate text-foreground text-[14px]">
              {operacao.cedente}
            </p>
            {operacao.prioridade && (
              <Flag size={13} className="text-destructive flex-shrink-0" />
            )}
          </div>
          <p className="text-muted-foreground text-[12px]">
            {count} {count === 1 ? 'desdobramento' : 'desdobramentos'}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <p className="text-muted-foreground text-[12px]">
            {operacao.horario}
          </p>
          {operacao.mensagensNaoLidas > 0 && (
            <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[11px] min-w-[20px] text-center">
              {operacao.mensagensNaoLidas}
            </div>
          )}
        </div>
      </div>

      {/* Barra de SLA - apenas para prazos críticos */}
      {mostrarBarraPrazo && (
        <div className="w-full px-4 pb-3">
          <div className="w-full bg-muted h-[3px] rounded-full overflow-hidden">
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