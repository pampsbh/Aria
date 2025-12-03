import { FileText, Download } from 'lucide-react';

type Message = {
  id: string;
  remetente: string;
  conteudo: string;
  timestamp: string;
  tipo: 'enviada' | 'recebida';
  anexos?: string[];
};

type MessageProps = {
  message: Message;
};

export function Message({ message }: MessageProps) {
  const isEnviada = message.tipo === 'enviada';

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return <FileText size={16} />;
  };

  return (
    <div className={`flex ${isEnviada ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isEnviada ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {!isEnviada && (
          <span className="text-secondary-foreground px-2 text-[12px]">
            {message.remetente}
          </span>
        )}
        <div 
          className={`
            rounded-lg px-4 py-2 
            ${isEnviada 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-card text-foreground border border-border'
            }
          `}
        >
          <p className="leading-[21px] whitespace-pre-line">{message.conteudo}</p>
          
          {/* Anexos */}
          {message.anexos && message.anexos.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.anexos.map((anexo, index) => (
                <div 
                  key={index}
                  className={`
                    flex items-center gap-2 p-2 rounded border cursor-pointer
                    hover:opacity-80 transition-opacity
                    ${isEnviada 
                      ? 'bg-primary-foreground/10 border-primary-foreground/20' 
                      : 'bg-muted border-border'
                    }
                  `}
                >
                  {getFileIcon(anexo)}
                  <span className="flex-1 text-[13px] truncate">{anexo}</span>
                  <Download size={14} />
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="text-secondary-foreground px-2 text-[14px]">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
