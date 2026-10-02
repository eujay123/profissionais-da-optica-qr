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
  Store as StoreIcon,
  Check,
} from 'lucide-react';

interface StoreListProps {
  stores: Store[];
  productionBaseUrl?: string;
  isAdminAuthenticated?: boolean;
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
  isAdminAuthenticated = false,
  onAddNew,
  onEdit,
  onDelete,
  onDuplicate,
  onCustomizeQr,
  onPrintPlacard,
  onPreviewMobile,
}) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id || '');
  const [viewMode, setViewMode] = useState<'featured' | 'grid'>('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedStoreId, setCopiedStoreId] = useState<string | null>(null);

  // Loja em destaque ativo
  const activeStore = stores.find((s) => s.id === selectedStoreId) || stores[0];

  // Filtro de busca para o modo grade
  const filteredStores = stores.filter((store) => {
    return (
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCopyLink = (store: Store) => {
    const base = productionBaseUrl ? productionBaseUrl.replace(/\/+$/, '') : window.location.origin;
    const url = `${base}/?loja=${store.id}`;
    navigator.clipboard.writeText(url);
    setCopiedStoreId(store.id);
    setTimeout(() => setCopiedStoreId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Seletor Horizontal de Filiais (Mobile First com Scroll Suave) */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-2.5 sm:p-3 border border-[#EAE4D7] shadow-xs">
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <StoreIcon className="w-3.5 h-3.5 text-red-600" />
            Rede de Filiais (Moçambique)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('featured')}
              className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                viewMode === 'featured'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Destaque QR
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                viewMode === 'grid'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Lista Completa
            </button>
          </div>
        </div>

        {/* Chips das 6 Filiais */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
          {stores.map((s) => {
            const isSelected = s.id === (activeStore?.id || '');
            const shortName = s.name.replace('Filial ', '');

            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStoreId(s.id);
                  if (viewMode !== 'featured') setViewMode('featured');
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#F3EFE6] border border-[#EAE4D7]'
                }`}
              >
                {shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modo 1: Destaque Centrado (Inspirado nas Referências 1 e 3) */}
      {viewMode === 'featured' && activeStore && (
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4D7] shadow-xl text-center relative overflow-hidden">
            
            {/* Header da Filial Ativa */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 mb-2">
                <span className="font-mono font-bold">{activeStore.code}</span>
                <span>•</span>
                <span>{activeStore.address.neighborhood}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {activeStore.name}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {activeStore.address.street}, {activeStore.address.number} • Maputo
              </p>
            </div>

            {/* Cartão do QR Code em Branco Puro com Sombra Suave (Estilo Referências 1 & 3) */}
            <div className="inline-block p-5 sm:p-6 bg-[#FAF7F2] rounded-3xl border border-[#EAE4D7] shadow-xs mb-6 mx-auto">
              <QrCodeRenderer
                store={activeStore}
                size={230}
                showControls={false}
                productionBaseUrl={productionBaseUrl}
              />
              <p className="text-[11px] text-stone-500 font-medium mt-3">
                Aponte a câmera do telemóvel para abrir a filial
              </p>
            </div>

            {/* Ações Principais em Pílula (Pill Buttons) */}
            <div className="space-y-3">
              <button
                onClick={() => onPreviewMobile(activeStore)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-98 shadow-md shadow-red-600/20 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Abrir Página Mobile da Filial</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => onPrintPlacard(activeStore)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-stone-800 bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D7] transition active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-600" />
                  <span>Display de Balcão</span>
                </button>

                <button
                  onClick={() => handleCopyLink(activeStore)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-stone-800 bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D7] transition active:scale-95"
                >
                  {copiedStoreId === activeStore.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-600" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Ações de Administração (Apenas quando autenticado por Jonas) */}
              {isAdminAuthenticated && (
                <div className="pt-3 border-t border-[#EAE4D7] flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => onCustomizeQr(activeStore)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition"
                  >
                    <Sliders className="w-3 h-3 text-red-600" />
                    Personalizar QR
                  </button>
                  <button
                    onClick={() => onEdit(activeStore)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition"
                  >
                    <Edit className="w-3 h-3 text-stone-600" />
                    Editar
                  </button>
                  <button
                    onClick={() => onDuplicate(activeStore)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition"
                  >
                    <Copy className="w-3 h-3 text-stone-600" />
                    Duplicar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir filial "${activeStore.name}"?`)) {
                        onDelete(activeStore.id);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Excluir
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Modo 2: Lista Completa em Grade (Inspirado na Referência 4) */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          
          {/* Barra de Busca Simples */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar filial por cidade, nome ou bairro..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#EAE4D7] rounded-full focus:outline-hidden focus:ring-2 focus:ring-red-600 transition shadow-xs placeholder:text-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map((store) => {
              const status = getStoreOpenStatus(store.hours);
              const cleanWa = store.whatsapp.replace(/\D/g, '');

              return (
                <div
                  key={store.id}
                  className="bg-white rounded-3xl border border-[#EAE4D7] p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FAF7F2] text-stone-700 border border-[#EAE4D7]">
                          {store.code}
                        </span>
                        <h3 className="text-base font-bold text-stone-900 mt-1">
                          {store.name}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {status.isOpen ? 'Aberto' : 'Fechado'}
                      </span>
                    </div>

                    {/* QR Code Miniatura Centralizado */}
                    <div className="flex justify-center my-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE4D7]">
                      <QrCodeRenderer
                        store={store}
                        size={140}
                        showControls={false}
                        productionBaseUrl={productionBaseUrl}
                      />
                    </div>

                    {/* Detalhes de Endereço & Contato */}
                    <div className="space-y-1.5 text-xs text-stone-600 mt-3">
                      <p className="flex items-start gap-1.5 leading-tight">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span>{store.address.street}, {store.address.number}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{store.phone}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <a
                          href={`https://wa.me/${cleanWa}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline text-emerald-700 font-medium"
                        >
                          {store.whatsapp}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="pt-4 mt-3 border-t border-[#EAE4D7] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onPreviewMobile(store)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Mobile
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onPrintPlacard(store)}
                        className="p-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] text-stone-700 border border-[#EAE4D7] transition"
                        title="Display de Balcão"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyLink(store)}
                        className="p-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] text-stone-700 border border-[#EAE4D7] transition"
                        title="Copiar Link"
                      >
                        {copiedStoreId === store.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {isAdminAuthenticated && (
                        <>
                          <button
                            onClick={() => onEdit(store)}
                            className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Excluir "${store.name}"?`)) onDelete(store.id);
                            }}
                            className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Botão de Nova Filial exclusivo para Admin na lista */}
          {isAdminAuthenticated && (
            <div className="text-center pt-4">
              <button
                onClick={onAddNew}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Nova Filial
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
