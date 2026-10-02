import { Download, Plus, Store as StoreIcon, Sparkles, Sliders } from 'lucide-react';
import type { ChainSettings } from '../types';

interface NavbarProps {
  chainSettings: ChainSettings;
  totalStores: number;
  onAddNew: () => void;
  onOpenBatch: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  chainSettings,
  totalStores,
  onAddNew,
  onOpenBatch,
  onOpenSettings,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Identidade da Marca & Plataforma */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-red-200 p-1 flex items-center justify-center shadow-md shadow-red-500/10 shrink-0 overflow-hidden">
            <img
              src="/logo-symbol.png"
              alt="Profissionais da Óptica"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                {chainSettings.brandName}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                <Sparkles className="w-3 h-3 mr-0.5" />
                Maputo • Moçambique
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Rede de Lojas • Contatos, Localização e QR Codes Inteligentes
            </p>
          </div>
        </div>

        {/* Ações Globais */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Badge de Total de Filiais */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
            <StoreIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>{totalStores} {totalStores === 1 ? 'filial ativa' : 'filiais ativas'}</span>
          </div>

          {/* Configurações da Rede */}
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-xs"
            title="Configurar nome da rede, slogan e URL da Vercel"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Rede & Vercel</span>
          </button>

          {/* Importar / Exportar */}
          <button
            onClick={onOpenBatch}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-xs"
            title="Importar ou exportar lojas em lote (CSV/JSON)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">CSV / Lote</span>
          </button>

          {/* Cadastrar Nova Filial */}
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Filial</span>
          </button>

        </div>

      </div>
    </header>
  );
};
