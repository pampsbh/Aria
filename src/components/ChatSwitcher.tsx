import { AlertTriangle, MessageCircle } from 'lucide-react';

type Desdobramento = {
  id: string;
  titulo: string;
  status: 'sucesso' | 'execucao' | 'perigo' | 'resolvido' | 'cancelado';
  mensagensNaoLidas: number;
  mensagens: any[];
};

type ChatSwitcherProps = {
  desdobramentos: Desdobramento[];
  activeDesdobramentoId: string;
  onSelectDesdobramento: (id: string) => void;
};

export function ChatSwitcher({
  desdobramentos,
  activeDesdobramentoId,
  onSelectDesdobramento,
}: ChatSwitcherProps) {
  const statusColors = {
    sucesso: 'rgba(14, 133, 87, 1.00)',
    execucao: 'rgba(0, 97, 214, 1.00)',
    perigo: 'rgba(255, 77, 79, 1.00)',
    resolvido: 'rgba(165, 171, 171, 1.00)',
    cancelado: 'rgba(165, 171, 171, 1.00)',
  };

  const statusBgColors = {
    sucesso: '#e8f5e9',
    execucao: '#e3f2fd',
    perigo: '#ffebee',
    resolvido: 'rgba(219, 222, 222, 1.00)',
    cancelado: 'rgba(219, 222, 222, 1.00)',
  };

  return (
    <div className="w-full">
      {(() => {
        const ativos = desdobramentos.filter(d => d.status === 'execucao');
        const historico = desdobramentos.filter(d => d.status === 'resolvido' || d.status === 'cancelado');
        
        return (
          <>
            {/* Desdobramentos Ativos */}
            {ativos.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-secondary-foreground text-[12px]">Desdobramentos ativos:</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4 text-sm">
                  {ativos.map((desdobramento) => {
                    const isActive = desdobramento.id === activeDesdobramentoId;
                    const statusColor = statusColors[desdobramento.status];
                    const statusBgColor = statusBgColors[desdobramento.status];

                    return (
                      <button
                        key={desdobramento.id}
                        onClick={() => onSelectDesdobramento(desdobramento.id)}
                        className={`
                          relative px-3 py-2 rounded-lg border transition-all
                          ${isActive 
                            ? 'border-primary bg-[#e3f2fd]' 
                            : 'border-border bg-card hover:border-primary hover:bg-muted'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: statusColor }}
                          />
                          <span className={`font-normal ${isActive ? 'text-primary' : 'text-foreground'}`}>
                            {desdobramento.titulo}
                          </span>
                          {desdobramento.mensagensNaoLidas > 0 && (
                            <span className="relative">
                              <MessageCircle size={16} className="text-primary" />
                              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground px-1 py-0.5 rounded-full min-w-[14px] flex items-center justify-center text-[9px]">
                                {desdobramento.mensagensNaoLidas}
                              </span>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            
            {/* Histórico */}
            {historico.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-secondary-foreground text-[12px]">Histórico:</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {historico.map((desdobramento) => {
                    const isActive = desdobramento.id === activeDesdobramentoId;
                    const statusColor = statusColors[desdobramento.status];
                    const statusBgColor = statusBgColors[desdobramento.status];

                    return (
                      <button
                        key={desdobramento.id}
                        onClick={() => onSelectDesdobramento(desdobramento.id)}
                        className={`
                          relative px-3 py-2 rounded-lg border transition-all opacity-50
                          ${isActive 
                            ? 'border-primary bg-[#e3f2fd]' 
                            : 'border-border bg-card hover:border-primary hover:bg-muted'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: statusColor }}
                          />
                          <span className={`text-sm font-normal ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                            {desdobramento.titulo}
                          </span>
                          {desdobramento.mensagensNaoLidas > 0 && (
                            <span className="relative">
                              <MessageCircle size={16} className="text-primary" />
                              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground px-1 py-0.5 rounded-full min-w-[14px] flex items-center justify-center">
                                {desdobramento.mensagensNaoLidas}
                              </span>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </>
        );
      })()}
    </div>
  );
}
