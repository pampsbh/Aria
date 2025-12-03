import { ChevronDown, ChevronUp } from 'lucide-react';
import { DesdobramentoItemClean } from './DesdobramentoItemClean';
import { useState } from 'react';

type Desdobramento = {
  id: string;
  titulo: string;
  status: 'sucesso' | 'execucao' | 'perigo' | 'aguardando' | 'resolvido' | 'cancelado';
  mensagensNaoLidas: number;
};

type DesdobramentosListCleanProps = {
  desdobramentos: Desdobramento[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function DesdobramentosListClean({
  desdobramentos,
  activeId,
  onSelect,
}: DesdobramentosListCleanProps) {
  const [historicoExpanded, setHistoricoExpanded] = useState(false);

  const desdobramentosAtivos = desdobramentos.filter(
    (d) => d.status !== 'resolvido' && d.status !== 'cancelado'
  );

  const desdobramentosFinalizados = desdobramentos.filter(
    (d) => d.status === 'resolvido' || d.status === 'cancelado'
  );

  return (
    <div className="flex flex-col border-r border-border bg-card">
      {/* Desdobramentos Ativos */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {desdobramentosAtivos.length > 0 ? (
            desdobramentosAtivos.map((desdobramento) => (
              <DesdobramentoItemClean
                key={desdobramento.id}
                titulo={desdobramento.titulo}
                status={desdobramento.status}
                mensagensNaoLidas={desdobramento.mensagensNaoLidas}
                isActive={activeId === desdobramento.id}
                onClick={() => onSelect(desdobramento.id)}
              />
            ))
          ) : (
            <div className="px-4 py-8 text-center text-secondary-foreground text-[14px]">
              Nenhum desdobramento ativo
            </div>
          )}
        </div>
      </div>

      {/* Histórico */}
      {desdobramentosFinalizados.length > 0 && (
        <div className="border-t border-border">
          <button
            onClick={() => setHistoricoExpanded(!historicoExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <span className="text-[14px] text-secondary-foreground">
              Histórico ({desdobramentosFinalizados.length})
            </span>
            {historicoExpanded ? (
              <ChevronUp size={16} className="text-secondary-foreground" />
            ) : (
              <ChevronDown size={16} className="text-secondary-foreground" />
            )}
          </button>

          {historicoExpanded && (
            <div className="pb-2">
              {desdobramentosFinalizados.map((desdobramento) => (
                <DesdobramentoItemClean
                  key={desdobramento.id}
                  titulo={desdobramento.titulo}
                  status={desdobramento.status}
                  mensagensNaoLidas={0}
                  isActive={activeId === desdobramento.id}
                  onClick={() => onSelect(desdobramento.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
