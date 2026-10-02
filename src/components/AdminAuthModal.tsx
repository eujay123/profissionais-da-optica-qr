import React, { useState } from 'react';
import { Lock, X, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'jonas123') {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] border border-[#E8DFD0] w-full max-w-sm rounded-3xl shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-base font-bold text-stone-900 tracking-tight">
            Acesso Restrito
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Digite a senha de administrador para gerenciar e cadastrar filiais da rede.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Digite sua senha..."
              className={`w-full px-4 py-2.5 text-xs text-stone-900 bg-white border rounded-xl placeholder:text-stone-400 focus:outline-hidden focus:ring-2 transition ${
                error
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                  : 'border-[#E0D7C6] focus:ring-red-600 focus:border-red-600'
              }`}
            />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 mt-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Senha incorreta. Tente novamente.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-md shadow-red-600/20 transition"
          >
            <span>Desbloquear Painel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Profissionais da Óptica • Maputo
          </span>
        </div>

      </div>
    </div>
  );
};
