type DesdobramentoItemCleanProps = {
  titulo: string;
  status: 'sucesso' | 'execucao' | 'perigo' | 'aguardando' | 'resolvido' | 'cancelado';
  mensagensNaoLidas: number;
  isActive: boolean;
  onClick: () => void;
};

export function DesdobramentoItemClean({ 
  titulo, 
  status, 
  mensagensNaoLidas, 
  isActive, 
  onClick 
}: DesdobramentoItemCleanProps) {
  
  const getStatusColor = () => {
    switch(status) {
      case 'sucesso': return 'bg-chart-2';
      case 'execucao': return 'bg-chart-1';
      case 'perigo': return 'bg-destructive';
      case 'aguardando': return 'bg-muted-foreground';
      case 'resolvido': return 'bg-chart-2';
      case 'cancelado': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-3 transition-all
        ${isActive 
          ? 'bg-muted/50' 
          : 'hover:bg-muted/30'
        }
      `}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusColor()}`} />
        <p className="truncate text-left text-[14px] text-foreground">
          {titulo}
        </p>
      </div>

      {mensagensNaoLidas > 0 && (
        <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[11px] min-w-[20px] text-center ml-2">
          {mensagensNaoLidas}
        </div>
      )}
    </button>
  );
}
