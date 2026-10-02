import { useState } from 'react';
import type { Store } from '../types';
import { QrCodeRenderer } from './QrCodeRenderer';
import { Printer, X, Sparkles, MapPin, Phone, MessageSquare, Globe } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';

interface PrintPlacardModalProps {
  store: Store;
  productionBaseUrl?: string;
  onClose: () => void;
}

export const PrintPlacardModal: React.FC<PrintPlacardModalProps> = ({
  store,
  productionBaseUrl,
  onClose,
}) => {
  const [template, setTemplate] = useState<'minimal' | 'modern' | 'compact'>('modern');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-400" />
            <h2 className="font-semibold text-lg">Display de Balcão para Impressão</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Controles */}
        <div className="px-6 py-3 bg-slate-800/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium">Modelo do Cartaz:</span>
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-700">
              <button
                onClick={() => setTemplate('modern')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                  template === 'modern'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Moderno (Cor da Rede)
              </button>
              <button
                onClick={() => setTemplate('minimal')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                  template === 'minimal'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Elegante Minimalista
              </button>
              <button
                onClick={() => setTemplate('compact')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                  template === 'compact'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Compacto (Mesa / Balcão)
              </button>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </button>
        </div>

        {/* Área de Visualização do Cartaz (Será o elemento impresso) */}
        <div className="p-8 bg-slate-950 flex justify-center items-center overflow-auto max-h-[70vh]">
          
          <div
            id="printable-card"
            className={`w-[420px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center transition-all ${
              template === 'modern'
                ? 'border-4 border-red-600'
                : template === 'minimal'
                ? 'border border-slate-200'
                : 'border-2 border-slate-900'
            }`}
          >
            {/* Topo com Logo e Marca */}
            <div className="w-full flex flex-col items-center">
              <div className="w-14 h-14 mb-2 flex items-center justify-center">
                <img
                  src="/logo-symbol.png"
                  alt="Profissionais da Óptica"
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  template === 'modern'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {store.brandName}
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 mt-2">
                {store.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Filial {store.code} • Maputo
              </p>
            </div>

            {/* Chamada para Ação */}
            <div className="my-5 bg-slate-50 rounded-2xl p-3 w-full border border-slate-100">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Conecte-se com Nossa Loja
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Aponte a câmera do seu celular para contatos, localização GPS e WhatsApp
              </p>
            </div>

            {/* QR Code Central */}
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-inner">
              <QrCodeRenderer
                store={store}
                size={220}
                showControls={false}
                productionBaseUrl={productionBaseUrl}
              />
            </div>

            {/* Benefícios Rápidos */}
            <div className="grid grid-cols-3 gap-2 w-full mt-5 text-[10px] text-slate-600 font-medium">
              <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                <MessageSquare className="w-4 h-4 text-emerald-600 mb-1" />
                <span>WhatsApp</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                <MapPin className="w-4 h-4 text-blue-600 mb-1" />
                <span>Como Chegar</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                <Phone className="w-4 h-4 text-slate-700 mb-1" />
                <span>Salvar Contato</span>
              </div>
            </div>

            {/* Rodapé com Endereço e Instagram */}
            <div className="mt-6 pt-4 border-t border-slate-200 w-full text-[11px] text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">
                {store.address.street}, {store.address.number} • {store.address.city}/{store.address.state}
              </p>
              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400">
                {store.phone && <span>Tel: {store.phone}</span>}
                {store.social.instagram && (
                  <span className="flex items-center gap-1">
                    <InstagramIcon className="w-3 h-3 text-pink-600" />
                    {store.social.instagram}
                  </span>
                )}
                {store.social.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-indigo-600" />
                    {store.social.website.replace(/^https?:\/\//, '')}
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
