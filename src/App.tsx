import { useState, useEffect } from 'react';
import type { Store, ChainSettings } from './types';
import {
  loadStores,
  saveStores,
  loadChainSettings,
  saveChainSettings,
  resetToDemoData,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { StoreList } from './components/StoreList';
import { StoreFormModal } from './components/StoreFormModal';
import { QrCustomizerModal } from './components/QrCustomizerModal';
import { PrintPlacardModal } from './components/PrintPlacardModal';
import { StoreLandingPage } from './components/StoreLandingPage';
import { BatchImportExportModal } from './components/BatchImportExportModal';
import { NetworkSettingsModal } from './components/NetworkSettingsModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { InstagramIcon } from './components/SocialIcons';
import {
  Plus,
  Mail,
  Sliders,
  Download,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

export function App() {
  const [stores, setStores] = useState<Store[]>(() => loadStores());
  const [chainSettings, setChainSettings] = useState<ChainSettings>(() => loadChainSettings());

  // Controle de Acesso Restrito do Jonas (Senha: jonas123)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Modais e Estados de Visualização
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isNewStoreModalOpen, setIsNewStoreModalOpen] = useState(false);
  const [customizingQrStore, setCustomizingQrStore] = useState<Store | null>(null);
  const [printingPlacardStore, setPrintingPlacardStore] = useState<Store | null>(null);
  const [previewingMobileStore, setPreviewingMobileStore] = useState<Store | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSaveChainSettings = (newSettings: ChainSettings) => {
    setChainSettings(newSettings);
    saveChainSettings(newSettings);
  };

  // Detecção de acesso direto por QR Code escaneado (URL pública ?loja=ID)
  const [publicStoreId, setPublicStoreId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storeParam = params.get('loja');
    if (storeParam) {
      setPublicStoreId(storeParam);
    }
  }, []);

  // Salvar alterações no storage
  const handleUpdateStores = (newStores: Store[]) => {
    setStores(newStores);
    saveStores(newStores);
  };

  // Se a URL contém ?loja=ID (cliente que escaneou o QR Code)
  if (publicStoreId) {
    const foundStore = stores.find((s) => s.id === publicStoreId || s.code === publicStoreId);
    if (foundStore) {
      return (
        <StoreLandingPage
          store={foundStore}
          isStandalone={true}
          onBackToAdmin={() => {
            window.history.replaceState({}, '', window.location.pathname);
            setPublicStoreId(null);
          }}
        />
      );
    }
  }

  // Se clicou em "Ver Mobile" para simular o smartphone do cliente
  if (previewingMobileStore) {
    return (
      <StoreLandingPage
        store={previewingMobileStore}
        isStandalone={false}
        onBackToAdmin={() => setPreviewingMobileStore(null)}
      />
    );
  }

  // Adicionar ou editar loja
  const handleSaveStore = (savedStore: Store) => {
    const exists = stores.some((s) => s.id === savedStore.id);
    let updated: Store[];
    if (exists) {
      updated = stores.map((s) => (s.id === savedStore.id ? savedStore : s));
    } else {
      updated = [savedStore, ...stores];
    }
    handleUpdateStores(updated);
    setEditingStore(null);
    setIsNewStoreModalOpen(false);
  };

  // Excluir loja
  const handleDeleteStore = (id: string) => {
    const updated = stores.filter((s) => s.id !== id);
    handleUpdateStores(updated);
  };

  // Duplicar loja
  const handleDuplicateStore = (store: Store) => {
    const newStore: Store = {
      ...store,
      id: `loja-${Date.now()}`,
      code: `${store.code}-NOVA`,
      name: `${store.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    handleUpdateStores([newStore, ...stores]);
  };

  // Atualizar estilo do QR
  const handleSaveQrStyle = (updatedStore: Store) => {
    const updated = stores.map((s) => (s.id === updatedStore.id ? updatedStore : s));
    handleUpdateStores(updated);
    setCustomizingQrStore(null);
  };

  // Importação em lote
  const handleBatchImport = (importedStores: Store[], mode: 'replace' | 'append') => {
    let finalStores: Store[];
    if (mode === 'replace') {
      finalStores = importedStores;
    } else {
      finalStores = [...stores, ...importedStores];
    }
    handleUpdateStores(finalStores);
  };

  // Redefinir para dados oficiais
  const handleResetDemo = () => {
    const reset = resetToDemoData();
    setStores(reset.stores);
    setChainSettings(reset.settings);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* Top Navbar Minimalista */}
      <Navbar
        chainSettings={chainSettings}
        isAdminAuthenticated={isAdminAuthenticated}
        onExitAdmin={() => setIsAdminAuthenticated(false)}
      />

      {/* Painel Administrativo do Jonas (Apenas quando autenticado por senha) */}
      {isAdminAuthenticated && (
        <div className="bg-stone-900 text-white border-b border-stone-800 py-2.5 px-4 animate-in slide-in-from-top duration-200">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-stone-200">Modo de Gestão Ativo (Jonas)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewStoreModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Nova Filial
              </button>
              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                Importar/Exportar Lote
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition"
              >
                <Sliders className="w-3.5 h-3.5" />
                Configurar Rede
              </button>
              <button
                onClick={() => setIsAdminAuthenticated(false)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-stone-400 hover:text-white transition ml-2"
                title="Sair do modo administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal Limpo e Mobile First */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* Gestão e Visualização das Filiais */}
        <StoreList
          stores={stores}
          productionBaseUrl={chainSettings.productionBaseUrl}
          isAdminAuthenticated={isAdminAuthenticated}
          onAddNew={() => setIsNewStoreModalOpen(true)}
          onEdit={(store) => setEditingStore(store)}
          onDelete={handleDeleteStore}
          onDuplicate={handleDuplicateStore}
          onCustomizeQr={(store) => setCustomizingQrStore(store)}
          onPrintPlacard={(store) => setPrintingPlacardStore(store)}
          onPreviewMobile={(store) => setPreviewingMobileStore(store)}
        />

      </main>

      {/* Rodapé Elegante com Contatos Oficiais e Botão '+' Discreto */}
      <footer className="bg-white/80 backdrop-blur-xs border-t border-[#EAE4D7] py-6 sm:py-8 px-4 text-center text-xs text-stone-500 no-print">
        <div className="max-w-4xl mx-auto space-y-3">
          
          {/* Canais Oficiais da Rede */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <a
              href="https://instagram.com/prof.optica"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-600 hover:text-pink-600 transition"
            >
              <InstagramIcon className="w-4 h-4 text-pink-600" />
              <span>@prof.optica</span>
            </a>

            <span className="text-stone-300">•</span>

            <a
              href="mailto:profissionaisdaoptica@hotmail.com"
              className="inline-flex items-center gap-1.5 text-stone-600 hover:text-red-600 transition"
            >
              <Mail className="w-4 h-4 text-red-600" />
              <span>profissionaisdaoptica@hotmail.com</span>
            </a>
          </div>

          {/* Copyright e Acesso Discreto do Jonas */}
          <div className="flex items-center justify-center gap-2 pt-2 text-stone-400 text-[11px]">
            <span>© {new Date().getFullYear()} {chainSettings.brandName} • Maputo, Moçambique</span>
            
            {/* Botão '+' Discreto para Acesso por Senha (jonas123) */}
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setIsNewStoreModalOpen(true);
                } else {
                  setIsAdminAuthModalOpen(true);
                }
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full text-stone-300 hover:text-stone-600 hover:bg-stone-200/50 transition opacity-60 hover:opacity-100"
              title="Acesso de Gestão"
              aria-label="Acesso de Gestão"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </footer>

      {/* Modal de Senha do Jonas (jonas123) */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminAuthModalOpen(false);
          setIsNewStoreModalOpen(true);
        }}
      />

      {/* Modais do Sistema */}
      {(isNewStoreModalOpen || editingStore) && (
        <StoreFormModal
          initialStore={editingStore}
          defaultBrandName={chainSettings.brandName}
          onSave={handleSaveStore}
          onClose={() => {
            setIsNewStoreModalOpen(false);
            setEditingStore(null);
          }}
        />
      )}

      {customizingQrStore && (
        <QrCustomizerModal
          store={customizingQrStore}
          onSave={handleSaveQrStyle}
          onClose={() => setCustomizingQrStore(null)}
        />
      )}

      {printingPlacardStore && (
        <PrintPlacardModal
          store={printingPlacardStore}
          productionBaseUrl={chainSettings.productionBaseUrl}
          onClose={() => setPrintingPlacardStore(null)}
        />
      )}

      {isBatchModalOpen && (
        <BatchImportExportModal
          stores={stores}
          onImport={handleBatchImport}
          onResetDemo={handleResetDemo}
          onClose={() => setIsBatchModalOpen(false)}
        />
      )}

      {isSettingsModalOpen && (
        <NetworkSettingsModal
          settings={chainSettings}
          onSave={handleSaveChainSettings}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

    </div>
  );
}

export default App;
