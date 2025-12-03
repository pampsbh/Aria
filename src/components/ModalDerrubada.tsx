import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

type Submotivo = string;
type Motivo = {
  nome: string;
  submotivos?: Submotivo[];
};
type TipoEncerramento = {
  nome: string;
  motivos: Motivo[];
};

const TIPOS_ENCERRAMENTO: TipoEncerramento[] = [
  {
    nome: 'Desistência de Cessão',
    motivos: [
      { nome: 'Fechou ou está negociando com a concorrência' },
      { nome: 'Não quis informar o motivo / Outros' },
      { nome: 'Pendência para o titular não solucionada' },
      { nome: 'Titular não tem interesse' },
    ],
  },
  {
    nome: 'Recusada Operações',
    motivos: [
      { nome: 'Ainda não virou precatório/PPR/direito creditório' },
      {
        nome: 'Ausência de condições jurídicas',
        submotivos: [
          'Necessidade de alvará para cessão',
          'Necessidade de inventário para cessão',
          'Outros',
        ],
      },
      { nome: 'Ausência de documentos obrigatórios' },
      { nome: 'Compliance (cedente reprovado)' },
      {
        nome: 'Crédito não pertence ao titular',
        submotivos: ['Cessão anterior', 'Sucessão (falecimento)'],
      },
      {
        nome: 'Critérios de Cálculo',
        submotivos: [
          'Crédito inferior ao valor total de débitos',
          'Decotes',
          'Dívidas do cedente',
          'Honorários',
        ],
      },
      { nome: 'Duplicidade do processo judicial' },
      { nome: 'Operação em duplicidade na esteira' },
      { nome: 'Questões jurídicas identificadas na diligência' },
      {
        nome: 'Tese que não compramos',
        submotivos: [
          'Anistia política',
          'Prescrição/decadência',
          'TUNEP',
          'Verbas vinculadas',
        ],
      },
    ],
  },
];

type ModalDerrubadaProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    tipo: string;
    motivo: string;
    submotivo: string | null;
    observacoes: string;
  }) => void;
  operacaoNome: string;
};

export function ModalDerrubada({
  isOpen,
  onClose,
  onConfirm,
  operacaoNome,
}: ModalDerrubadaProps) {
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [motivoSelecionado, setMotivoSelecionado] = useState('');
  const [submotivoSelecionado, setSubmotivoSelecionado] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const tipoAtual = TIPOS_ENCERRAMENTO.find((t) => t.nome === tipoSelecionado);
  const motivoAtual = tipoAtual?.motivos.find((m) => m.nome === motivoSelecionado);
  const temSubmotivos = motivoAtual?.submotivos && motivoAtual.submotivos.length > 0;

  // Reset campos dependentes quando tipo muda
  useEffect(() => {
    setMotivoSelecionado('');
    setSubmotivoSelecionado('');
  }, [tipoSelecionado]);

  // Reset submotivo quando motivo muda
  useEffect(() => {
    setSubmotivoSelecionado('');
  }, [motivoSelecionado]);

  const isFormValid =
    tipoSelecionado &&
    motivoSelecionado &&
    (!temSubmotivos || submotivoSelecionado) &&
    observacoes.trim().length > 0;

  const handleConfirm = () => {
    if (!isFormValid) return;

    onConfirm({
      tipo: tipoSelecionado,
      motivo: motivoSelecionado,
      submotivo: temSubmotivos ? submotivoSelecionado : null,
      observacoes: observacoes.trim(),
    });

    // Reset form
    setTipoSelecionado('');
    setMotivoSelecionado('');
    setSubmotivoSelecionado('');
    setObservacoes('');
  };

  const handleClose = () => {
    setTipoSelecionado('');
    setMotivoSelecionado('');
    setSubmotivoSelecionado('');
    setObservacoes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[520px] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
          <h2 className="text-[#2c2c2c]">
            Confirmar solicitação de derrubada
          </h2>
          <button
            onClick={handleClose}
            className="text-[#717979] hover:text-[#2c2c2c] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-[14px] text-[#717979]">
            Tem certeza que deseja solicitar a derrubada desta operação?
            <br />
            Selecione abaixo o motivo do encerramento.
          </p>

          {/* Tipo de encerramento */}
          <div>
            <label className="block text-[13px] text-[#2c2c2c] mb-1.5">
              Tipo de encerramento <span className="text-[#FF4D4F]">*</span>
            </label>
            <select
              value={tipoSelecionado}
              onChange={(e) => setTipoSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md text-[14px] text-[#2c2c2c] focus:outline-none focus:border-[#0858C5] focus:ring-1 focus:ring-[#0858C5] bg-white"
            >
              <option value="">Selecione o tipo</option>
              {TIPOS_ENCERRAMENTO.map((tipo) => (
                <option key={tipo.nome} value={tipo.nome}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Motivo do encerramento */}
          <div>
            <label className="block text-[13px] text-[#2c2c2c] mb-1.5">
              Motivo do encerramento <span className="text-[#FF4D4F]">*</span>
            </label>
            <select
              value={motivoSelecionado}
              onChange={(e) => setMotivoSelecionado(e.target.value)}
              disabled={!tipoSelecionado}
              className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md text-[14px] text-[#2c2c2c] focus:outline-none focus:border-[#0858C5] focus:ring-1 focus:ring-[#0858C5] bg-white disabled:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:text-[#bfbfbf]"
            >
              <option value="">Selecione o motivo</option>
              {tipoAtual?.motivos.map((motivo) => (
                <option key={motivo.nome} value={motivo.nome}>
                  {motivo.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Submotivo */}
          <div>
            <label className="block text-[13px] text-[#2c2c2c] mb-1.5">
              Submotivo {temSubmotivos && <span className="text-[#FF4D4F]">*</span>}
            </label>
            <select
              value={submotivoSelecionado}
              onChange={(e) => setSubmotivoSelecionado(e.target.value)}
              disabled={!motivoSelecionado || !temSubmotivos}
              className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md text-[14px] text-[#2c2c2c] focus:outline-none focus:border-[#0858C5] focus:ring-1 focus:ring-[#0858C5] bg-white disabled:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:text-[#bfbfbf]"
            >
              <option value="">
                {temSubmotivos ? 'Selecione o submotivo' : 'Não há submotivos'}
              </option>
              {motivoAtual?.submotivos?.map((submotivo) => (
                <option key={submotivo} value={submotivo}>
                  {submotivo}
                </option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-[13px] text-[#2c2c2c] mb-1.5">
              Observações <span className="text-[#FF4D4F]">*</span>
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Digite aqui os detalhes sobre a solicitação de derrubada..."
              rows={4}
              className="w-full px-3 py-2 border border-[#d9d9d9] rounded-md text-[14px] text-[#2c2c2c] placeholder:text-[#bfbfbf] focus:outline-none focus:border-[#0858C5] focus:ring-1 focus:ring-[#0858C5] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e0e0e0]">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-[14px] text-[#2c2c2c] bg-white border border-[#d9d9d9] rounded-md hover:bg-[#fafafa] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className="px-4 py-2 text-[14px] text-white bg-[#FF4D4F] rounded-md hover:bg-[#ff3333] transition-colors disabled:bg-[#ffcccb] disabled:cursor-not-allowed"
          >
            Confirmar derrubada
          </button>
        </div>
      </div>
    </div>
  );
}