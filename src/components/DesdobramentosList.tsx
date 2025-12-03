import { Search, Filter } from 'lucide-react';
import { DesdobramentoItem } from './DesdobramentoItem';
import { useState } from 'react';

type Desdobramento = {
  id: string;
  titulo: string;
  operacao: string;
  status: 'novo' | 'em_andamento' | 'pendente' | 'concluido';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  ultimaAtualizacao: string;
  horario: string;
  mensagensNaoLidas: number;
  cedente?: string;
  idExterno?: string;
};

type DesdobramentosListProps = {
  desdobramentos: Desdobramento[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function DesdobramentosList({ desdobramentos, activeId, onSelect }: DesdobramentosListProps) {
  const [activeTab, setActiveTab] = useState<'enviadas' | 'recebidas'>('enviadas');
  const [searchTerm, setSearchTerm] = useState('');

  const enviadas = desdobramentos.filter(d => d.status !== 'novo');
  const recebidas = desdobramentos.filter(d => d.status === 'novo');

  const currentList = activeTab === 'enviadas' ? enviadas : recebidas;
  const filteredList = currentList.filter(d => 
    d.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.operacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.cedente && d.cedente.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.idExterno && d.idExterno.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-[320px] bg-white border-r border-[#e0e0e0] flex flex-col h-screen">
      {/* Tabs */}
      <div className="flex border-b border-[#e0e0e0] px-4 pt-4">
        <button
          onClick={() => setActiveTab('enviadas')}
          className={`
            pb-2 px-3 text-[14px] transition-colors relative
            ${activeTab === 'enviadas' 
              ? 'text-[#0061d6]' 
              : 'text-[#a5abab]'
            }
          `}
        >
          Enviadas ({enviadas.length})
          {activeTab === 'enviadas' && (
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#0061d6]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('recebidas')}
          className={`
            pb-2 px-3 text-[14px] transition-colors relative
            ${activeTab === 'recebidas' 
              ? 'text-[#0061d6]' 
              : 'text-[#a5abab]'
            }
          `}
        >
          Recebidas ({recebidas.length})
          {activeTab === 'recebidas' && (
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#0061d6]" />
          )}
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[#e0e0e0]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717979]" size={16} />
          <input
            type="text"
            placeholder="Buscar operações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-[#e0e0e0] rounded-lg text-[14px] focus:outline-none focus:border-[#0061d6]"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717979] hover:text-[#0061d6]">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredList.map((desdobramento) => (
          <DesdobramentoItem
            key={desdobramento.id}
            desdobramento={desdobramento}
            isActive={activeId === desdobramento.id}
            onClick={() => onSelect(desdobramento.id)}
          />
        ))}
      </div>
    </div>
  );
}