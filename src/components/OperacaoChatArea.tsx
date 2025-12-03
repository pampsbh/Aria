import { Paperclip, Send, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Message } from './Message';
import { ModalConfirmacao } from './ModalConfirmacao';
import { ChatSwitcher } from './ChatSwitcher';
import { ChatDrawer } from './ChatDrawer';

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
  prazo?: string;
  historicoSolicitacoes?: HistoricoSolicitacao[];
};

type Desdobramento = {
  id: string;
  operacaoId: string;
  titulo: string;
  mensagens: MessageType[];
  status: 'sucesso' | 'execucao' | 'perigo' | 'resolvido' | 'cancelado';
  mensagensNaoLidas: number;
  prazo?: string;
  mensagemOrigem: string;
  timestampOrigem: string;
};

type MessageType = {
  id: string;
  desdobramentoId: string;
  remetente: string;
  conteudo: string;
  timestamp: string;
  tipo: 'enviada' | 'recebida';
  anexos?: string[];
};

type OperacaoChatAreaProps = {
  operacao: Operacao | null;
  desdobramentos: Desdobramento[];
  todosDesdobramentos: Desdobramento[];
  onSendMessage: (desdobramentoId: string, message: string) => void;
  onUpdateStatus: (status: string) => void;
  onMarkAsRead: (desdobramentoId: string) => void;
  onFinalizarDesdobramento: (desdobramentoId: string) => void;
};

export function OperacaoChatArea({ 
  operacao, 
  desdobramentos,
  todosDesdobramentos,
  onSendMessage, 
  onUpdateStatus, 
  onMarkAsRead,
  onFinalizarDesdobramento
}: OperacaoChatAreaProps) {
  const [messageText, setMessageText] = useState('');
  const [activeDesdobramentoId, setActiveDesdobramentoId] = useState<string | null>(
    desdobramentos[0]?.id || null
  );
  const [isModalConcluirOpen, setIsModalConcluirOpen] = useState(false);
  const [isHistoricoDrawerOpen, setIsHistoricoDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get messages from active desdobramento only (buscar em todos os desdobramentos, incluindo histórico)
  const activeDesdobramento = todosDesdobramentos.find(d => d.id === activeDesdobramentoId);
  const currentMessages = activeDesdobramento?.mensagens || [];

  // Garantir que sempre haja um desdobramento selecionado quando disponível
  useEffect(() => {
    if (desdobramentos.length > 0) {
      // Se não há desdobramento ativo ou o ativo não existe mais na lista COMPLETA (incluindo histórico)
      if (!activeDesdobramentoId || !todosDesdobramentos.find(d => d.id === activeDesdobramentoId)) {
        const newActiveId = desdobramentos[0].id;
        setActiveDesdobramentoId(newActiveId);
        onMarkAsRead(newActiveId);
      }
    } else {
      setActiveDesdobramentoId(null);
    }
  }, [desdobramentos, todosDesdobramentos, activeDesdobramentoId, onMarkAsRead]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages]);

  if (!operacao) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <MessageSquareIcon size={64} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-secondary-foreground">
            Selecione uma operação para visualizar
          </p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (messageText.trim() && activeDesdobramentoId && !isDesdobramentoConcluido) {
      onSendMessage(activeDesdobramentoId, messageText);
      setMessageText('');
    }
  };

  // Verificar se o desdobramento ativo está concluído
  const isDesdobramentoConcluido = activeDesdobramento?.status === 'resolvido' || activeDesdobramento?.status === 'cancelado';

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };



  const handleConfirmarConcluir = () => {
    if (activeDesdobramentoId) {
      onFinalizarDesdobramento(activeDesdobramentoId);
    }
  };

  // Progress bar calculation - usar prazo do desdobramento ativo
  const prazoHoras = activeDesdobramento?.prazo ? parseFloat(activeDesdobramento.prazo) : 0;
  const progressPercent = Math.max(100 - (prazoHoras / 48) * 100, 0);
  
  // Pegar as cores diretamente das variáveis CSS
  const getComputedColor = (varName: string) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      return getComputedStyle(root).getPropertyValue(varName).trim();
    }
    return '';
  };
  
  const prazoColor = prazoHoras < 3 
    ? getComputedColor('--destructive') 
    : prazoHoras < 6 
      ? getComputedColor('--chart-3') 
      : prazoHoras < 12
        ? getComputedColor('--primary')
        : getComputedColor('--chart-2');

  // Gradiente dinâmico baseado no SLA
  const getBackgroundGradient = () => {
    if (!activeDesdobramento?.prazo || isDesdobramentoConcluido) {
      return 'linear-gradient(135deg, rgba(219, 222, 222, 0.15) 0%, rgba(255, 255, 255, 1) 100%)';
    }
    
    if (prazoHoras < 1) {
      // Crítico (< 1 hora): Gradiente vermelho intenso
      return 'linear-gradient(135deg, rgba(255, 77, 79, 0.18) 0%, rgba(255, 77, 79, 0.08) 50%, rgba(255, 255, 255, 1) 100%)';
    } else if (prazoHoras < 3) {
      // Urgente (1-3 horas): Gradiente laranja/vermelho
      return 'linear-gradient(135deg, rgba(255, 77, 79, 0.12) 0%, rgba(254, 195, 60, 0.12) 50%, rgba(255, 255, 255, 1) 100%)';
    } else if (prazoHoras < 6) {
      // Atenção (3-6 horas): Gradiente amarelo
      return 'linear-gradient(135deg, rgba(254, 195, 60, 0.18) 0%, rgba(254, 195, 60, 0.08) 50%, rgba(255, 255, 255, 1) 100%)';
    } else if (prazoHoras < 12) {
      // Normal (6-12 horas): Gradiente azul suave
      return 'linear-gradient(135deg, rgba(0, 97, 214, 0.12) 0%, rgba(0, 97, 214, 0.05) 50%, rgba(255, 255, 255, 1) 100%)';
    } else {
      // Confortável (> 12 horas): Gradiente verde suave
      return 'linear-gradient(135deg, rgba(14, 133, 87, 0.15) 0%, rgba(14, 133, 87, 0.06) 50%, rgba(255, 255, 255, 1) 100%)';
    }
  };

  return (
    <div 
      className="h-full flex flex-col transition-all duration-700"
      style={{ background: getBackgroundGradient() }}
    >
      {/* Header Card */}
      <div className="bg-card m-4 rounded-lg shadow-sm flex-shrink-0">
        <div className="px-4 py-2.5 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-foreground">{operacao.cedente}</h3>
                <p className="text-muted-foreground text-[12px]">{operacao.idExterno}</p>
              </div>
              <p className="text-secondary-foreground text-[13px] mt-0.5">{operacao.valor} • {operacao.enteDevedor}</p>
            </div>
          </div>
        </div>
        
        {activeDesdobramento?.prazo && !isDesdobramentoConcluido && (
          <div className="bg-background-2 px-4 py-2 flex items-center gap-2">
            <div className="flex-1 bg-muted h-[5px] rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: prazoColor 
                }}
              />
            </div>
            <p className="text-secondary-foreground">
              Vence em <strong className={prazoHoras < 1 ? 'text-destructive' : ''}>
                {prazoHoras < 1 
                  ? `${Math.round(prazoHoras * 60)} minutos`
                  : `${activeDesdobramento.prazo} horas`
                }
              </strong>
            </p>
          </div>
        )}
      </div>

      {/* Indicador de desdobramento inativo */}
      {isDesdobramentoConcluido && (
        <div className="mx-4 mb-4 bg-muted border border-border rounded-lg p-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-muted-foreground shrink-0" />
          <p className="text-secondary-foreground">
            Esta solicitação já foi finalizada e não permite novas mensagens.
          </p>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
        {activeDesdobramento && (
          <>
            {/* Mensagem de origem em destaque */}
            <div className="bg-[#FFF9E6] border-2 border-chart-3 rounded-lg p-4 mb-4 hover:bg-hover-2 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-chart-3 text-foreground rounded">
                  Mensagem de origem
                </span>
                <span className="text-secondary-foreground">
                  {activeDesdobramento.timestampOrigem}
                </span>
              </div>
              <p className="text-foreground leading-[21px]">
                {activeDesdobramento.mensagemOrigem}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2 mb-4">
              <div className="flex-1 h-[1px] bg-border"></div>
              <span className="text-muted-foreground">Histórico de mensagens</span>
              <div className="flex-1 h-[1px] bg-border"></div>
            </div>
          </>
        )}

        {currentMessages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4 flex-shrink-0">
        {/* Chat Switcher */}
        <ChatSwitcher
          desdobramentos={todosDesdobramentos}
          activeDesdobramentoId={activeDesdobramentoId || ''}
          onSelectDesdobramento={(id) => {
            setActiveDesdobramentoId(id);
            onMarkAsRead(id);
          }}
        />

        <div className="flex items-end gap-2 mt-3">
          <button 
            className="text-secondary-foreground hover:text-primary transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!activeDesdobramentoId || isDesdobramentoConcluido}
          >
            <Paperclip size={20} />
          </button>
          <div className="flex-1 flex items-end bg-input-background border border-border rounded-lg overflow-hidden focus-within:border-primary">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isDesdobramentoConcluido ? "Solicitação já finalizada" : "Digite sua mensagem..."}
              className="flex-1 px-4 py-3 resize-none focus:outline-none bg-input-background disabled:cursor-not-allowed disabled:opacity-50"
              rows={1}
              disabled={!activeDesdobramentoId || isDesdobramentoConcluido}
            />
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!activeDesdobramentoId || isDesdobramentoConcluido}
            className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>

          {/* Botão Finalizar Solicitação */}
          <button
            onClick={() => setIsModalConcluirOpen(true)}
            className="flex items-center gap-2 px-3 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!activeDesdobramentoId || isDesdobramentoConcluido}
          >
            <CheckCircle size={14} />
            Finalizar solicitação
          </button>
        </div>
      </div>

      {/* Modal de Concluir */}
      <ModalConfirmacao
        isOpen={isModalConcluirOpen}
        onClose={() => setIsModalConcluirOpen(false)}
        onConfirm={handleConfirmarConcluir}
        tipo="concluir"
        desdobramentoTitulo={activeDesdobramento?.titulo}
      />

      {/* Drawer de Histórico */}
      <ChatDrawer
        isOpen={isHistoricoDrawerOpen}
        onClose={() => setIsHistoricoDrawerOpen(false)}
        historicoSolicitacoes={operacao.historicoSolicitacoes || []}
      />
    </div>
  );
}

function MessageSquareIcon({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}