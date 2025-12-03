import { X, AlertTriangle, CheckCircle, CornerUpLeft } from 'lucide-react';

type ModalConfirmacaoProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tipo: 'concluir' | 'devolver' | 'derrubada';
  desdobramentoTitulo?: string;
  operacaoNome?: string;
};

export function ModalConfirmacao({ 
  isOpen, 
  onClose, 
  onConfirm, 
  tipo,
  desdobramentoTitulo,
  operacaoNome 
}: ModalConfirmacaoProps) {
  if (!isOpen) return null;

  const configs = {
    concluir: {
      icon: <CheckCircle size={48} className="text-chart-2" />,
      titulo: 'Finalizar solicitação',
      mensagem: `Tem certeza que deseja finalizar a solicitação "${desdobramentoTitulo}"?`,
      submensagem: 'O desdobramento será marcado como resolvido e movido para o histórico.',
      confirmText: 'Sim, finalizar',
      confirmClass: 'bg-chart-2 hover:bg-chart-2/90',
    },
    devolver: {
      icon: <CornerUpLeft size={48} className="text-primary" />,
      titulo: 'Devolver para área',
      mensagem: `Tem certeza que deseja devolver a solicitação "${desdobramentoTitulo}"?`,
      submensagem: 'Esta solicitação será devolvida para o time operacional e movida para o histórico.',
      confirmText: 'Sim, devolver',
      confirmClass: 'bg-primary hover:bg-primary/90',
    },
    derrubada: {
      icon: <AlertTriangle size={48} className="text-destructive" />,
      titulo: 'Solicitar derrubada',
      mensagem: `Tem certeza que deseja solicitar a derrubada da operação "${operacaoNome}"?`,
      submensagem: 'Toda a operação será encaminhada no Opera para análise de derrubada e removida deste sistema.',
      confirmText: 'Sim, solicitar derrubada',
      confirmClass: 'bg-destructive hover:bg-destructive/90',
    },
  };

  const config = configs[tipo];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-[480px] max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2>{config.titulo}</h2>
          <button
            onClick={onClose}
            className="text-secondary-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              {config.icon}
            </div>
            <p className="text-foreground mb-2">
              {config.mensagem}
            </p>
            <p className="text-secondary-foreground">
              {config.submensagem}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${config.confirmClass}`}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
