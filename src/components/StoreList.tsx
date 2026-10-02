import React, { useState } from 'react';
import type { Store } from '../types';
import { QrCodeRenderer } from './QrCodeRenderer';
import { getStoreOpenStatus } from '../utils/hours';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Printer,
  Sliders,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Store as StoreIcon,
} from 'lucide-react';

interface StoreListProps {
  stores: Store[];
  productionBaseUrl?: string;
  onAddNew: () => void;
  onEdit: (store: Store) => void;
  onDelete: (id: string) => void;
  onDuplicate: (store: Store) => void;
  onCustomizeQr: (store: Store) => void;
  onPrintPlacard: (store: Store) => void;
  onPreviewMobile: (store: Store) => void;
}

export const StoreList: React.FC<StoreListProps> = ({
  stores,
  productionBaseUrl,
  onAddNew,
  onEdit,
  onDelete,
  onDuplicate,
  onCustomizeQr,
  onPrintPlacard,
  onPreviewMobile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');

  // Obter lista única de estados das lojas cadastradas
  const availableStates = Array.from(
    new Set(stores.map((s) => s.address.state.trim().toUpperCase()).filter(Boolean))
  ).sort();

  // Filtragem
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState =
      selectedState === 'ALL' || store.address.state.toUpperCase() === selectedState;

    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6">
      
      {/* Barra de Filtros e Busca */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por filial, código, cidade ou bairro..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition"
          />
        </div>

        {/* Filtro de Estado e Botão Nova Filial */}
        <div className="flex items-center gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos os Estados ({stores.length})</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                Estado: {st}
              </option>
            ))}
          </select>

          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nova Filial
          </button>
        </div>
      </div>

      {/* Grid de Lojas */}
      {filteredStores.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <StoreIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Nenhuma filial encontrada</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Não foram encontradas lojas com os filtros selecionados. Tente alterar o termo de busca ou cadastre uma nova filial.
          </p>
          <button
            onClick={onAddNew}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Filial Agora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStores.map((store) => {
            const status = getStoreOpenStatus(store.hours);
            const cleanWa = store.whatsapp.replace(/\D/g, '');

            return (
              <div
                key={store.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                {/* Topo do Card */}
                <div className="p-6">
                  
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {store.code}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {status.statusText}
                        </span>
                        {store.rating && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            ⭐ {store.rating.score} ({store.rating.count})
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1.5 leading-snug">
                        {store.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {store.address.neighborhood} • {store.address.city}/{store.address.state}
                      </p>
                    </div>

                    {/* Botão de Visualização Rápida no Celular */}
                    <button
                      onClick={() => onPreviewMobile(store)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition shrink-0"
                      title="Ver como o cliente enxerga no smartphone"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Mobile
                    </button>
                  </div>

                  {/* Corpo: QR Code ao lado das Informações de Contato */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                    
                    {/* Renderizador do QR Code da Loja */}
                    <div className="sm:col-span-2 flex justify-center">
                      <QrCodeRenderer
                        store={store}
                        size={155}
                        showControls={true}
                        productionBaseUrl={productionBaseUrl}
                      />
                    </div>

                    {/* Informações Resumidas de Contato e Localização */}
                    <div className="sm:col-span-3 space-y-2.5 text-xs text-slate-600">
                      
                      {/* Endereço */}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-800 leading-tight">
                            {store.address.street}, {store.address.number}
                            {store.address.complement && ` (${store.address.complement})`}
                          </p>
                          <p className="text-[11px] text-slate-400">CEP {store.address.zipCode}</p>
                        </div>
                      </div>

                      {/* Telefones */}
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-slate-700">{store.phone || 'Sem telefone fixo'}</span>
                      </div>

                      {/* WhatsApp */}
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <a
                          href={`https://wa.me/${cleanWa}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline font-medium flex items-center gap-1"
                        >
                          {store.whatsapp}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      {/* Horário Seg-Sex */}
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="font-semibold text-slate-700">Seg-Sex:</span> {store.hours.weekdays}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Barra de Ações do Rodapé do Card */}
                <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  
                  {/* Ações Criativas */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCustomizeQr(store)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-medium transition"
                      title="Alterar cores, formato e logo do QR"
                    >
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      Estilo do QR
                    </button>

                    <button
                      onClick={() => onPrintPlacard(store)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-medium transition"
                      title="Gerar cartaz/display de balcão pronto para imprimir"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      Display Balcão
                    </button>
                  </div>

                  {/* Ações de Gestão */}
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => onDuplicate(store)}
                      className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-200 transition"
                      title="Duplicar filial"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(store)}
                      className="p-1.5 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition"
                      title="Editar dados da filial"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir a filial "${store.name}"?`)) {
                          onDelete(store.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Excluir filial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
