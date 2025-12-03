import { Paperclip, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { Message } from './Message';

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
};

type MessageType = {
  id: string;
  remetente: string;
  conteudo: string;
  timestamp: string;
  tipo: 'enviada' | 'recebida';
  anexos?: string[];
};

type ChatAreaProps = {
  desdobramento: Desdobramento | null;
  messages: MessageType[];
  onSendMessage: (message: string) => void;
  onUpdateStatus: (status: string) => void;
};

export function ChatArea({ desdobramento, messages, onSendMessage, onUpdateStatus }: ChatAreaProps) {
  const [messageText, setMessageText] = useState('');

  if (!desdobramento) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <MessageSquare size={64} className="text-[#a5abab] mx-auto mb-4" />
          <p className="text-[#717979] text-[16px]">
            Selecione um desdobramento para visualizar
          </p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Progress bar calculation
  const prazoHoras = desdobramento.prazo ? parseInt(desdobramento.prazo) : 0;
  const progressPercent = Math.min((prazoHoras / 48) * 100, 100);
  const prazoColor = prazoHoras < 6 ? '#ff4444' : prazoHoras < 12 ? '#fec33c' : '#4caf50';

  return (
    <div className="flex-1 flex flex-col bg-[#f5f5f5]">
      {/* Header Card */}
      <div className="bg-white m-4 rounded-lg shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#e0e0e0]">
          <div className="flex-1">
            <p className="text-[14px] text-[#717979]">{desdobramento.titulo}</p>
            <p className="text-[12px] text-[#717979]">{desdobramento.operacao}</p>
          </div>
          <button 
            onClick={() => onUpdateStatus('concluido')}
            className="bg-[#0061d6] text-white px-4 py-2 rounded text-[14px] hover:bg-[#0052b8] transition-colors"
          >
            Fechar ticket
          </button>
        </div>
        
        {desdobramento.prazo && (
          <div className="bg-[rgba(254,195,60,0.2)] px-4 py-2 flex items-center gap-2">
            <div className="flex-1 bg-[#dbdede] h-[5px] rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: prazoColor 
                }}
              />
            </div>
            <p className="text-[12px] text-[#717979]">
              Vence em <strong>{desdobramento.prazo}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[#e0e0e0] p-4">
        <div className="flex items-end gap-2">
          <button className="text-[#717979] hover:text-[#0061d6] transition-colors mb-2">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 flex items-end bg-white border border-[#e0e0e0] rounded-lg overflow-hidden focus-within:border-[#0061d6]">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 resize-none focus:outline-none text-[14px]"
              rows={1}
            />
          </div>
          <button 
            onClick={handleSend}
            className="bg-[#0061d6] text-white p-3 rounded-lg hover:bg-[#0052b8] transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => onUpdateStatus('concluido')}
            className="flex items-center gap-2 px-3 py-2 bg-[#4caf50] text-white rounded text-[12px] hover:bg-[#45a049] transition-colors"
          >
            <CheckCircle size={14} />
            Concluir
          </button>
          <button 
            onClick={() => onUpdateStatus('pendente')}
            className="flex items-center gap-2 px-3 py-2 bg-[#fec33c] text-white rounded text-[12px] hover:bg-[#f5b92b] transition-colors"
          >
            <Clock size={14} />
            Marcar como pendente
          </button>
          <button 
            onClick={() => onUpdateStatus('em_andamento')}
            className="flex items-center gap-2 px-3 py-2 bg-[#ff9800] text-white rounded text-[12px] hover:bg-[#f08700] transition-colors"
          >
            <AlertCircle size={14} />
            Devolver área
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageSquare({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
