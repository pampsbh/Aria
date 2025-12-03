import { X, User, Building, Tag, Calendar, Paperclip, Clock } from 'lucide-react';
import { Message } from './Message';

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

type HistoricoItem = {
  id: string;
  cedente: string;
  idExterno: string;
  valor: string;
  enteDevedor: string;
  quantidadeSolicitacoes: number;
  ultimaSolicitacao: string;
  solicitacoes: HistoricoSolicitacao[];
};

type ChatDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  item?: HistoricoItem | null;
  historicoSolicitacoes?: HistoricoSolicitacao[];
};

export function ChatDrawer({ isOpen, onClose, item, historicoSolicitacoes }: ChatDrawerProps) {
  if (!isOpen) return null;

  // Se historicoSolicitacoes foi passado diretamente, usar ele
  const solicitacoes = historicoSolicitacoes || item?.solicitacoes || [];
  
  if (solicitacoes.length === 0) {
    return (
      <>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
        
        {/* Drawer */}
        <div className="fixed top-0 right-0 h-screen w-[900px] bg-card shadow-2xl z-50 flex flex-col animate-slide-in">
          <div className="p-6 flex items-center justify-between border-b border-border">
            <h3>Histórico de Solicitações</h3>
            <button
              onClick={onClose}
              className="text-secondary-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Nenhuma solicitação anterior encontrada</p>
          </div>
        </div>
      </>
    );
  }

  const lastStatus = solicitacoes[solicitacoes.length - 1]?.status || 'concluido';
  const statusColor = lastStatus === 'concluido' ? 'bg-chart-2' : 'bg-muted-foreground';
  const statusLabel = lastStatus === 'concluido' ? 'Concluído' : 'Cancelado';

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-screen w-[900px] bg-card shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-foreground">
                  {item?.cedente}
                </h2>
                <span className={`px-3 py-1 rounded-full text-white ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>
              <p className="text-secondary-foreground">{item?.idExterno}</p>
            </div>
            <button
              onClick={onClose}
              className="text-secondary-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-start gap-2">
              <Tag size={16} className="text-secondary-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-foreground">Valor</p>
                <p className="text-foreground">{item?.valor}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Building size={16} className="text-secondary-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-foreground">Ente Devedor</p>
                <p className="text-foreground">{item?.enteDevedor}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-secondary-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-foreground">Quantidade de solicitações</p>
                <p className="text-foreground">{item?.quantidadeSolicitacoes}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Calendar size={16} className="text-secondary-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-foreground">Última solicitação</p>
                <p className="text-foreground">{item?.ultimaSolicitacao}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de Solicitações */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          <h3 className="mb-4">Histórico de Solicitações</h3>
          
          <div className="space-y-4">
            {solicitacoes.map((solicitacao, index) => {
              const isLast = index === solicitacoes.length - 1;
              
              return (
                <div key={solicitacao.id} className="relative">
                  
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    {/* Header da solicitação */}
                    <div className="p-4 border-b border-border bg-muted">
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-6 h-6 rounded-full shrink-0 flex items-center justify-center
                          ${solicitacao.status === 'concluido' ? 'bg-chart-2' : 'bg-muted-foreground'}
                        `}>
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-foreground">{solicitacao.titulo}</h4>
                            <span className={`
                              px-2 py-0.5 rounded-full text-white shrink-0
                              ${solicitacao.status === 'concluido' ? 'bg-chart-2' : 'bg-muted-foreground'}
                            `}>
                              {solicitacao.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-secondary-foreground">
                            <span>{solicitacao.atividadeOpera}</span>
                            <span>•</span>
                            <span>{solicitacao.solicitante}</span>
                            {solicitacao.quantidadeAnexos > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Paperclip size={10} />
                                  {solicitacao.quantidadeAnexos}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Conteúdo da solicitação */}
                    <div className="p-4">
                      <div className="bg-[#FFF9E6] border border-chart-3 rounded-lg p-3 mb-3">
                        <p className="text-foreground leading-[19px]">
                          {solicitacao.mensagemOrigem}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-secondary-foreground">
                        <span>Solicitado em {solicitacao.dataSolicitacao}</span>
                        {solicitacao.dataEncerramento && (
                          <span>Encerrado em {solicitacao.dataEncerramento}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
