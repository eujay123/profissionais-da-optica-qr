import React, { useState } from 'react';
import type { Store, QrTargetType, QrStyleConfig } from '../types';
import { QrCodeRenderer } from './QrCodeRenderer';
import { X, Check, Palette, Upload, Sparkles, Sliders } from 'lucide-react';

interface QrCustomizerModalProps {
  store: Store;
  onSave: (updatedStore: Store) => void;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Azul Corporativo', dots: '#1e3a8a', corner: '#1e3a8a', dot: '#2563eb' },
  { name: 'Verde Esmeralda', dots: '#0f766e', corner: '#115e59', dot: '#0d9488' },
  { name: 'Vermelho Ruby', dots: '#9f1239', corner: '#881337', dot: '#e11d48' },
  { name: 'Roxo Tech', dots: '#581c87', corner: '#4c1d95', dot: '#7c3aed' },
  { name: 'Laranja Elegante', dots: '#9a3412', corner: '#7c2d12', dot: '#ea580c' },
  { name: 'Preto & Grafite', dots: '#0f172a', corner: '#020617', dot: '#334155' },
];

export const QrCustomizerModal: React.FC<QrCustomizerModalProps> = ({
  store,
  onSave,
  onClose,
}) => {
  const [target, setTarget] = useState<QrTargetType>(store.activeQrTarget || 'landing');
  const [dotsColor, setDotsColor] = useState(store.qrStyle?.dotsColor || '#1e3a8a');
  const [cornerSquareColor, setCornerSquareColor] = useState(store.qrStyle?.cornerSquareColor || '#1e3a8a');
  const [cornerDotColor, setCornerDotColor] = useState(store.qrStyle?.cornerDotColor || '#2563eb');
  const [dotsType, setDotsType] = useState<QrStyleConfig['dotsType']>(
    store.qrStyle?.dotsType || 'rounded'
  );
  const [cornersSquareType, setCornersSquareType] = useState<QrStyleConfig['cornersSquareType']>(
    store.qrStyle?.cornersSquareType || 'extra-rounded'
  );
  const [logoUrl, setLogoUrl] = useState<string | undefined>(store.qrStyle?.logoUrl);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(undefined);
  };

  const handleApplyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setDotsColor(preset.dots);
    setCornerSquareColor(preset.corner);
    setCornerDotColor(preset.dot);
  };

  const handleSave = () => {
    const updatedStore: Store = {
      ...store,
      activeQrTarget: target,
      qrStyle: {
        ...store.qrStyle,
        dotsColor,
        cornerSquareColor,
        cornerDotColor,
        dotsType,
        cornersSquareType,
        cornersDotType: 'dot',
        logoUrl,
        backgroundColor: '#ffffff',
      },
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedStore);
    onClose();
  };

  // Preview store object
  const previewStore: Store = {
    ...store,
    activeQrTarget: target,
    qrStyle: {
      dotsColor,
      cornerSquareColor,
      cornerDotColor,
      dotsType,
      cornersSquareType,
      cornersDotType: 'dot',
      logoUrl,
      backgroundColor: '#ffffff',
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row border border-slate-100 max-h-[90vh]">
        
        {/* Painel Esquerdo: Configurações */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                Personalizar QR Code
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Filial {store.name} ({store.code})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 mt-6">
            
            {/* Destino do QR Code */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Destino do Escaneamento
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'landing', label: 'Página da Loja (Recomendado)', desc: 'Mobile-first com todas as ações' },
                  { id: 'vcard', label: 'vCard Direto', desc: 'Salva contato no telefone' },
                  { id: 'maps', label: 'GPS / Maps Direto', desc: 'Abre rota no Google Maps' },
                  { id: 'whatsapp', label: 'WhatsApp Direto', desc: 'Inicia conversa imediata' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTarget(t.id as QrTargetType)}
                    className={`p-3 rounded-xl text-left border transition ${
                      target === t.id
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{t.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Presets de Cores da Marca */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                Cores da Marca
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-slate-300 text-xs text-left transition"
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-xs"
                      style={{ backgroundColor: p.dots }}
                    />
                    <span className="truncate font-medium text-slate-700">{p.name}</span>
                  </button>
                ))}
              </div>

              {/* Seletor Customizado */}
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={dotsColor}
                    onChange={(e) => {
                      setDotsColor(e.target.value);
                      setCornerSquareColor(e.target.value);
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                  />
                  <span className="text-slate-600 font-medium">Cor Principal:</span>
                  <span className="font-mono text-slate-800 uppercase">{dotsColor}</span>
                </div>
              </div>
            </div>

            {/* Formato dos Pontos (Dots Style) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Estilo dos Módulos / Pontos
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'rounded', label: 'Arredondado' },
                  { id: 'dots', label: 'Bolinhas (Dots)' },
                  { id: 'classy', label: 'Elegante (Classy)' },
                  { id: 'classy-rounded', label: 'Suave' },
                  { id: 'extra-rounded', label: 'Super Curvo' },
                  { id: 'square', label: 'Quadrado Tradicional' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setDotsType(s.id as any)}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition ${
                      dotsType === s.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Formato dos Cantos */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Formato dos Cantos (Olhos do QR)
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'extra-rounded', label: 'Arredondado' },
                  { id: 'dot', label: 'Circular' },
                  { id: 'square', label: 'Quadrado' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCornersSquareType(c.id as any)}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition ${
                      cornersSquareType === c.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logotipo Central */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                Logotipo no Centro do QR
              </label>
              
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl border border-slate-300 transition">
                  <Upload className="w-3.5 h-3.5" />
                  Enviar Imagem / Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                {logoUrl && (
                  <div className="flex items-center gap-2">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="w-8 h-8 rounded-lg object-contain border border-slate-200 p-0.5"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Recomendado: imagem quadrada (PNG com fundo transparente ou ícone).
              </p>
            </div>

          </div>

          {/* Botões do Rodapé */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              <Check className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Painel Direito: Preview em Tempo Real */}
        <div className="w-full md:w-80 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Prévia em Tempo Real
          </span>

          <QrCodeRenderer
            store={previewStore}
            size={230}
            showControls={true}
          />

          <p className="text-[11px] text-slate-500 text-center mt-4 max-w-[200px]">
            As alterações são aplicadas instantaneamente e podem ser baixadas em alta definição ou SVG.
          </p>
        </div>

      </div>
    </div>
  );
};
