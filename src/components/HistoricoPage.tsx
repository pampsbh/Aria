import { Search, Filter, Paperclip, ChevronRight } from 'lucide-react';
import { useState } from 'react';
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

const mockHistorico: HistoricoItem[] = [
  {
    id: 'hist1',
    cedente: 'Maria Fernandes Silva',
    idExterno: 'OP-2024-010',
    valor: 'R$ 15.432.100,00',
    enteDevedor: 'Estado do Rio de Janeiro',
    quantidadeSolicitacoes: 3,
    ultimaSolicitacao: '10 Set 2024',
    solicitacoes: [
      {
        id: 'sol1',
        titulo: 'Conferência inicial — Recepção de documentos',
        mensagemOrigem: 'Falta RG atualizado do cedente. Favor solicitar documento com melhor qualidade de imagem.',
        dataSolicitacao: '05 Set 2024',
        dataEncerramento: '06 Set 2024',
        status: 'concluido',
        solicitante: 'Operacional',
        quantidadeAnexos: 1,
        atividadeOpera: 'AT-2024-1100',
      },
      {
        id: 'sol2',
        titulo: 'Validação do cedente — Conferência bancária',
        mensagemOrigem: 'Dados bancários divergentes. Solicitar comprovante de conta corrente atualizado.',
        dataSolicitacao: '07 Set 2024',
        dataEncerramento: '08 Set 2024',
        status: 'concluido',
        solicitante: 'Financeiro',
        quantidadeAnexos: 2,
        atividadeOpera: 'AT-2024-1101',
      },
      {
        id: 'sol3',
        titulo: 'Cálculo — Renegociação de proposta',
        mensagemOrigem: 'Cedente solicitou redução no deságio de 80% para 75%. Avaliar viabilidade comercial.',
        dataSolicitacao: '09 Set 2024',
        dataEncerramento: '10 Set 2024',
        status: 'concluido',
        solicitante: 'Jurídico',
        quantidadeAnexos: 0,
        atividadeOpera: 'AT-2024-1102',
      },
    ],
  },
  {
    id: 'hist2',
    cedente: 'Pedro Henrique Costa',
    idExterno: 'OP-2024-011',
    valor: 'R$ 8.765.432,00',
    enteDevedor: 'União Federal',
    quantidadeSolicitacoes: 2,
    ultimaSolicitacao: '18 Set 2024',
    solicitacoes: [
      {
        id: 'sol4',
        titulo: 'Emissão de CNDs automáticas',
        mensagemOrigem: 'Precisamos do ECAC do cedente para emitir as CNDs federais.',
        dataSolicitacao: '12 Set 2024',
        dataEncerramento: '14 Set 2024',
        status: 'concluido',
        solicitante: 'Operacional',
        quantidadeAnexos: 3,
        atividadeOpera: 'AT-2024-1110',
      },
      {
        id: 'sol5',
        titulo: 'Providências jurídicas — Emissão de certidões',
        mensagemOrigem: 'CND Municipal vencida. Confirmar se município permite emissão online ou precisa ser presencial.',
        dataSolicitacao: '15 Set 2024',
        dataEncerramento: '18 Set 2024',
        status: 'concluido',
        solicitante: 'Jurídico',
        quantidadeAnexos: 5,
        atividadeOpera: 'AT-2024-1111',
      },
    ],
  },
  {
    id: 'hist3',
    cedente: 'Juliana Alves Santos',
    idExterno: 'OP-2024-012',
    valor: 'R$ 12.345.678,00',
    enteDevedor: 'Município de São Paulo',
    quantidadeSolicitacoes: 4,
    ultimaSolicitacao: '25 Set 2024',
    solicitacoes: [
      {
        id: 'sol6',
        titulo: 'Análise do cedente — Conferência cadastral',
        mensagemOrigem: 'CPF do cedente com divergência. Solicitar documentos atualizados (RG e CPF).',
        dataSolicitacao: '20 Set 2024',
        dataEncerramento: '21 Set 2024',
        status: 'concluido',
        solicitante: 'Financeiro',
        quantidadeAnexos: 2,
        atividadeOpera: 'AT-2024-1120',
      },
      {
        id: 'sol7',
        titulo: 'Validação do cedente — Conferência de endereço',
        mensagemOrigem: 'Endereço divergente entre documentos. Solicitar comprovante de residência atualizado.',
        dataSolicitacao: '22 Set 2024',
        dataEncerramento: '23 Set 2024',
        status: 'concluido',
        solicitante: 'Operacional',
        quantidadeAnexos: 1,
        atividadeOpera: 'AT-2024-1121',
      },
      {
        id: 'sol8',
        titulo: 'Análise do ativo — Conferência processual',
        mensagemOrigem: 'Falta certidão de objeto e pé do processo. Solicitar certidão atualizada (máx. 30 dias).',
        dataSolicitacao: '24 Set 2024',
        dataEncerramento: '25 Set 2024',
        status: 'concluido',
        solicitante: 'Jurídico',
        quantidadeAnexos: 3,
        atividadeOpera: 'AT-2024-1122',
      },
      {
        id: 'sol9',
        titulo: 'Cálculo — Ajuste de proposta',
        mensagemOrigem: 'Valor calculado diverge do informado pelo cedente. Confirmar cálculo com a área técnica.',
        dataSolicitacao: '25 Set 2024',
        dataEncerramento: '25 Set 2024',
        status: 'concluido',
        solicitante: 'Área Técnica',
        quantidadeAnexos: 0,
        atividadeOpera: 'AT-2024-1123',
      },
    ],
  },
  {
    id: 'hist4',
    cedente: 'Roberto Silva Oliveira',
    idExterno: 'OP-2024-013',
    valor: 'R$ 6.543.210,00',
    enteDevedor: 'Estado de Minas Gerais',
    quantidadeSolicitacoes: 1,
    ultimaSolicitacao: '02 Out 2024',
    solicitacoes: [
      {
        id: 'sol10',
        titulo: 'Conferência de procuração',
        mensagemOrigem: 'Procuração não possui poderes específicos para cessão. Solicitar procuração atualizada.',
        dataSolicitacao: '28 Set 2024',
        dataEncerramento: '02 Out 2024',
        status: 'concluido',
        solicitante: 'Jurídico',
        quantidadeAnexos: 1,
        atividadeOpera: 'AT-2024-1130',
      },
    ],
  },
  {
    id: 'hist5',
    cedente: 'Ana Paula Rodrigues',
    idExterno: 'OP-2024-014',
    valor: 'R$ 9.876.543,00',
    enteDevedor: 'União Federal',
    quantidadeSolicitacoes: 3,
    ultimaSolicitacao: '08 Out 2024',
    solicitacoes: [
      {
        id: 'sol11',
        titulo: 'Conferência inicial — Documentação básica',
        mensagemOrigem: 'Falta comprovante de estado civil. Se casado, enviar certidão de casamento.',
        dataSolicitacao: '05 Out 2024',
        dataEncerramento: '06 Out 2024',
        status: 'concluido',
        solicitante: 'Operacional',
        quantidadeAnexos: 2,
        atividadeOpera: 'AT-2024-1140',
      },
      {
        id: 'sol12',
        titulo: 'Emissão de CND Federal',
        mensagemOrigem: 'Podemos emitir CND Federal, mas precisamos da procuração digital válida do cedente.',
        dataSolicitacao: '06 Out 2024',
        dataEncerramento: '07 Out 2024',
        status: 'concluido',
        solicitante: 'Operacional',
        quantidadeAnexos: 4,
        atividadeOpera: 'AT-2024-1141',
      },
      {
        id: 'sol13',
        titulo: 'Validação bancária',
        mensagemOrigem: 'Conta informada não é de titularidade do cedente. Confirmar se é conta conjunta.',
        dataSolicitacao: '07 Out 2024',
        dataEncerramento: '08 Out 2024',
        status: 'concluido',
        solicitante: 'Financeiro',
        quantidadeAnexos: 0,
        atividadeOpera: 'AT-2024-1142',
      },
    ],
  },
  {
    id: 'hist6',
    cedente: 'Carlos Eduardo Mendes',
    idExterno: 'OP-2024-015',
    valor: 'R$ 4.567.890,00',
    enteDevedor: 'Município do Rio de Janeiro',
    quantidadeSolicitacoes: 2,
    ultimaSolicitacao: '20 Out 2024',
    solicitacoes: [
      {
        id: 'sol14',
        titulo: 'Análise do cedente — Restrições cadastrais',
        mensagemOrigem: 'Cedente possui restrições no Serasa. Verificar possibilidade de quitação antes da formalização.',
        dataSolicitacao: '15 Out 2024',
        dataEncerramento: '18 Out 2024',
        status: 'concluido',
        solicitante: 'Área Técnica',
        quantidadeAnexos: 0,
        atividadeOpera: 'AT-2024-1150',
      },
      {
        id: 'sol15',
        titulo: 'Cálculo — Renegociação de valores',
        mensagemOrigem: 'Valor proposto está acima do cálculo interno. Renegociar ágio máximo de 85%.',
        dataSolicitacao: '19 Out 2024',
        dataEncerramento: '20 Out 2024',
        status: 'concluido',
        solicitante: 'Comercial',
        quantidadeAnexos: 0,
        atividadeOpera: 'AT-2024-1151',
      },
    ],
  },
  {
    id: 'hist7',
    cedente: 'Fernanda Lima Souza',
    idExterno: 'OP-2024-016',
    valor: 'R$ 11.234.567,00',
    enteDevedor: 'Estado da Bahia',
    quantidadeSolicitacoes: 1,
    ultimaSolicitacao: '22 Out 2024',
    solicitacoes: [
      {
        id: 'sol16',
        titulo: 'Validação do cedente — Documentação pessoal',
        mensagemOrigem: 'URGENTE: Cedente desistiu da operação. Cancelar todos os procedimentos em andamento.',
        dataSolicitacao: '22 Out 2024',
        dataEncerramento: undefined,
        status: 'cancelado',
        solicitante: 'Comercial',
        quantidadeAnexos: 2,
        atividadeOpera: 'AT-2024-1160',
      },
    ],
  },
  {
    id: 'hist8',
    cedente: 'Ricardo Santos Pereira',
    idExterno: 'OP-2024-017',
    valor: 'R$ 7.890.123,00',
    enteDevedor: 'União Federal',
    quantidadeSolicitacoes: 5,
    ultimaSolicitacao: '05 Nov 2024',
    solicitacoes: [
      {
        id: 'sol17',
        titulo: 'Conferência inicial',
        mensagemOrigem: 'Documentação inicial completa. Prosseguir para próximas etapas.',
        dataSolicitacao: '01 Nov 2024',
        dataEncerramento: '01 Nov 2024',
        status: 'concluido',
        solicitante: 'Operacional',
        quantidadeAnexos: 6,
        atividadeOpera: 'AT-2024-1170',
      },
      {
        id: 'sol18',
        titulo: 'Emissão de CND Estadual',
        mensagemOrigem: 'CND Estadual emitida com sucesso. Certidão válida por 180 dias.',
        dataSolicitacao: '02 Nov 2024',
        dataEncerramento: '02 Nov 2024',
        status: 'concluido',
        solicitante: 'Operacional',
        quantidadeAnexos: 1,
        atividadeOpera: 'AT-2024-1171',
      },
      {
        id: 'sol19',
        titulo: 'Validação bancária',
        mensagemOrigem: 'Dados bancários validados e chave PIX ativa confirmada.',
        dataSolicitacao: '03 Nov 2024',
        dataEncerramento: '03 Nov 2024',
        status: 'concluido',
        solicitante: 'Financeiro',
        quantidadeAnexos: 0,
        atividadeOpera: 'AT-2024-1172',
      },
      {
        id: 'sol20',
        titulo: 'Análise do ativo — Estudo processual',
        mensagemOrigem: 'Processo em fase de execução. Risco baixo identificado. Aprovado para prosseguimento.',
        dataSolicitacao: '04 Nov 2024',
        dataEncerramento: '04 Nov 2024',
        status: 'concluido',
        solicitante: 'Jurídico',
        quantidadeAnexos: 3,
        atividadeOpera: 'AT-2024-1173',
      },
      {
        id: 'sol21',
        titulo: 'Parecer jurídico final',
        mensagemOrigem: 'Parecer favorável emitido. Operação aprovada para formalização.',
        dataSolicitacao: '05 Nov 2024',
        dataEncerramento: '05 Nov 2024',
        status: 'concluido',
        solicitante: 'Jurídico',
        quantidadeAnexos: 2,
        atividadeOpera: 'AT-2024-1174',
      },
    ],
  },
];

type HistoricoPageProps = {
  onSelectItem?: (id: string) => void;
};

export function HistoricoPage({ onSelectItem }: HistoricoPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoricoItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredList = mockHistorico.filter(item =>
    item.cedente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idExterno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item: HistoricoItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
    onSelectItem?.(item.id);
  };

  return (
    <div className="flex-1 bg-[#f5f5f5] h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#e0e0e0] p-6">
        <h1 className="text-[24px] text-[#2B313B] mb-4">Histórico de Solicitações</h1>
        
        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717979]" size={18} />
            <input
              type="text"
              placeholder="Buscar por cedente, ID ou solicitante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-lg text-[14px] focus:outline-none focus:border-[#0858C5]"
            />
          </div>
          <button className="px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#717979] hover:text-[#0858C5] hover:border-[#0858C5] transition-colors flex items-center gap-2">
            <Filter size={18} />
            <span className="text-[14px]">Filtros</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {filteredList.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="w-full bg-white border border-[#e0e0e0] rounded-lg p-4 hover:border-[#0858C5] hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Main info */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] text-[#2B313B] truncate">
                        {item.cedente} — {item.idExterno}
                      </h3>
                      <p className="text-[13px] text-[#717979] mt-0.5">
                        {item.valor} • {item.enteDevedor}
                      </p>
                    </div>
                    <div className={`
                      px-3 py-1 rounded-full text-[11px] shrink-0
                      ${item.solicitacoes[item.solicitacoes.length - 1].status === 'concluido' ? 'bg-[#0E8557] text-white' : 'bg-[#717979] text-white'}
                    `}>
                      {item.solicitacoes[item.solicitacoes.length - 1].status === 'concluido' ? 'Concluído' : 'Cancelado'}
                    </div>
                  </div>

                  {/* Dates and details */}
                  <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#717979] mt-3">
                    <span>
                      <strong className="text-[#2B313B]">{item.quantidadeSolicitacoes}</strong> {item.quantidadeSolicitacoes === 1 ? 'solicitação' : 'solicitações'}
                    </span>
                    <span>•</span>
                    <span>
                      Última solicitação: <strong className="text-[#2B313B]">{item.ultimaSolicitacao}</strong>
                    </span>
                  </div>
                </div>

                {/* Arrow icon */}
                <ChevronRight 
                  size={20} 
                  className="text-[#a5abab] group-hover:text-[#0858C5] transition-colors shrink-0 mt-1" 
                />
              </div>
            </button>
          ))}
        </div>

        {filteredList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#a5abab] text-[16px]">
              Nenhuma solicitação encontrada
            </p>
          </div>
        )}
      </div>

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}