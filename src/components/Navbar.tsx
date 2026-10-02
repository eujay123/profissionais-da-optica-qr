import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import type { ChainSettings } from '../types';

interface NavbarProps {
  chainSettings: ChainSettings;
  isAdminAuthenticated?: boolean;
  onExitAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  chainSettings,
  isAdminAuthenticated,
  onExitAdmin,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#EAE4D7] sticky top-0 z-30 transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Identidade da Marca Oficial */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8DFD0] p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
            <img
              src="/logo-symbol.png"
              alt="Profissionais da Óptica"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-stone-900 tracking-tight">
                {chainSettings.brandName}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-red-600" />
                Moçambique
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              {chainSettings.tagline || 'Qualidade • Eficiência • Garantia'}
            </p>
          </div>
        </div>

        {/* Indicador de Admin (Apenas quando autenticado por Jonas) */}
        {isAdminAuthenticated && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Gestão Jonas
            </span>
            {onExitAdmin && (
              <button
                onClick={onExitAdmin}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline ml-1"
              >
                Sair
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
