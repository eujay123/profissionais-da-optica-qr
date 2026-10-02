import React, { useState } from 'react';
import type { ChainSettings } from '../types';
import { X, Check, Globe, Sliders, Sparkles } from 'lucide-react';

interface NetworkSettingsModalProps {
  settings: ChainSettings;
  onSave: (settings: ChainSettings) => void;
  onClose: () => void;
}

export const NetworkSettingsModal: React.FC<NetworkSettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [brandName, setBrandName] = useState(settings.brandName);
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [productionBaseUrl, setProductionBaseUrl] = useState(settings.productionBaseUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      brandName: brandName.trim() || 'Profissional da Óptica',
      tagline: tagline.trim(),
      productionBaseUrl: productionBaseUrl.trim().replace(/\/+$/, ''),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-100">
        
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Configurações da Rede de Óticas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nome Oficial da Rede *
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ex: Profissional da Óptica"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Slogan / Mensagem Institucional
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ex: Saúde Visual, Lentes de Alta Precisão e Armações Exclusivas"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              URL Pública de Produção (Vercel ou Domínio Próprio)
            </label>
            <input
              type="url"
              value={productionBaseUrl}
              onChange={(e) => setProductionBaseUrl(e.target.value)}
              placeholder="https://sua-otica.vercel.app"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono text-blue-700"
            />
            
            <div className="mt-2 p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-slate-600 space-y-1">
              <p className="font-semibold text-blue-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Por que isso é importante?
              </p>
              <p className="text-[11px] leading-relaxed">
                Ao publicar o projeto na Vercel, cole o endereço gerado aqui (ex: <code>https://profissional-da-optica.vercel.app</code>).
                Todos os QR Codes baixados e impressos nos balcões das lojas passarão a apontar diretamente para este site na internet!
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              <Check className="w-4 h-4" />
              Salvar Configurações
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
