import { useState, useEffect } from 'react';
import type { Store, ChainSettings } from './types';
import {
  loadStores,
  saveStores,
  loadChainSettings,
  saveChainSettings,
  resetToDemoData,
} from './utils/storage';
import { getStoreOpenStatus } from './utils/hours';
import { Navbar } from './components/Navbar';
import { StoreList } from './components/StoreList';
import { StoreFormModal } from './components/StoreFormModal';
import { QrCustomizerModal } from './components/QrCustomizerModal';
import { PrintPlacardModal } from './components/PrintPlacardModal';
import { StoreLandingPage } from './components/StoreLandingPage';
import { BatchImportExportModal } from './components/BatchImportExportModal';
import { NetworkSettingsModal } from './components/NetworkSettingsModal';
import {
  Store as StoreIcon,
  MapPin,
  Clock,
  QrCode,
} from 'lucide-react';

export function App() {
  const [stores, setStores] = useState<Store[]>(() => loadStores());
  const [chainSettings, setChainSettings] = useState<ChainSettings>(() => loadChainSettings());

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
            // Remove o parâmetro da URL para voltar à administração
            window.history.replaceState({}, '', window.location.pathname);
            setPublicStoreId(null);
          }}
        />
      );
    }
  }

  // Se o admin clicou em "Ver Mobile" para simular o smartphone do cliente
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
      code: `${store.code}-COPIA`,
      name: `${store.name} (Nova)`,
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

  // Redefinir para dados de teste
  const handleResetDemo = () => {
    const reset = resetToDemoData();
    setStores(reset.stores);
    setChainSettings(reset.settings);
  };

  // Métricas rápidas da rede
  const openStoresCount = stores.filter((s) => getStoreOpenStatus(s.hours).isOpen).length;
  const uniqueCities = new Set(stores.map((s) => s.address.city).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        chainSettings={chainSettings}
        totalStores={stores.length}
        onAddNew={() => setIsNewStoreModalOpen(true)}
        onOpenBatch={() => setIsBatchModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Banner de Estatísticas da Rede */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <StoreIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total de Filiais</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stores.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Abertas Agora</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{openStoresCount} filiais</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cidades Atendidas</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{uniqueCities} cidades</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">QR Codes Ativos</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stores.length} gerados</p>
            </div>
          </div>

        </div>

        {/* Lista e Gestão das Lojas */}
        <StoreList
          stores={stores}
          productionBaseUrl={chainSettings.productionBaseUrl}
          onAddNew={() => setIsNewStoreModalOpen(true)}
          onEdit={(store) => setEditingStore(store)}
          onDelete={handleDeleteStore}
          onDuplicate={handleDuplicateStore}
          onCustomizeQr={(store) => setCustomizingQrStore(store)}
          onPrintPlacard={(store) => setPrintingPlacardStore(store)}
          onPreviewMobile={(store) => setPreviewingMobileStore(store)}
        />

      </main>

      {/* Rodapé do Painel */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 no-print">
        <p>
          © {new Date().getFullYear()} {chainSettings.brandName} • Plataforma de QR Codes, Localização e Contatos para Redes de Lojas
        </p>
      </footer>

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
