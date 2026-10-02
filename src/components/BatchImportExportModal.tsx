import React, { useState } from 'react';
import type { Store } from '../types';
import { exportStoresToCSV, parseImportedData } from '../utils/storage';
import { X, Download, Upload, FileText, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface BatchImportExportModalProps {
  stores: Store[];
  onImport: (newStores: Store[], mode: 'replace' | 'append') => void;
  onResetDemo: () => void;
  onClose: () => void;
}

export const BatchImportExportModal: React.FC<BatchImportExportModalProps> = ({
  stores,
  onImport,
  onResetDemo,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'reset'>('export');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [rawText, setRawText] = useState('');
  const [fileFormat, setFileFormat] = useState<'csv' | 'json'>('csv');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDownloadCSV = () => {
    const csv = exportStoresToCSV(stores);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rede_lojas_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(stores, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rede_lojas_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = () => {
    const sampleCSV = `Código,Nome Filial,Rede,Telefone,WhatsApp,Email,Rua,Numero,Bairro,Cidade,Estado,CEP,Google Maps URL,Horario Seg-Sex,Horario Sabado,Horario Domingo
EX-001,Filial Exemplo,Rede Alpha,+55 11 3000-0000,5511999999999,exemplo@rede.com,Rua Exemplo,100,Centro,São Paulo,SP,01000-000,https://maps.google.com,09:00 - 19:00,09:00 - 18:00,Fechado`;
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_lojas.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isJson = file.name.endsWith('.json');
    setFileFormat(isJson ? 'json' : 'csv');

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawText((event.target?.result as string) || '');
      setErrorMessage('');
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!rawText.trim()) {
      setErrorMessage('Por favor, selecione um arquivo ou cole o conteúdo para importar.');
      return;
    }

    try {
      const parsed = parseImportedData(rawText, fileFormat);
      if (parsed.length === 0) {
        setErrorMessage('Nenhuma loja encontrada para importar.');
        return;
      }

      onImport(parsed, importMode);
      setSuccessMessage(`${parsed.length} loja(s) importada(s) com sucesso!`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar arquivo de importação.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col border border-slate-100 max-h-[90vh]">
        
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Importação & Exportação em Massa
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Dados ({stores.length} lojas)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Importar em Lote
          </button>
          <button
            onClick={() => setActiveTab('reset')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'reset'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Redefinir Dados
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Aba de Exportação */}
          {activeTab === 'export' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Exporte todos os dados das lojas cadastradas na rede para planilha ou backup completo:
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleDownloadCSV}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/30 transition text-center group"
                >
                  <Download className="w-8 h-8 text-indigo-600 mb-2 group-hover:scale-110 transition" />
                  <span className="font-bold text-slate-900 text-sm">Planilha CSV</span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Compatível com Excel e Google Sheets
                  </span>
                </button>

                <button
                  onClick={handleDownloadJSON}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/30 transition text-center group"
                >
                  <Download className="w-8 h-8 text-emerald-600 mb-2 group-hover:scale-110 transition" />
                  <span className="font-bold text-slate-900 text-sm">Arquivo JSON</span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Backup completo com estilos de QR
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Aba de Importação */}
          {activeTab === 'import' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="text-slate-600">
                  Carregue um arquivo com múltiplas lojas da sua rede:
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Baixar Modelo CSV
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-indigo-500 transition bg-slate-50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700">
                  <span>Clique para selecionar um arquivo .csv ou .json</span>
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ou cole o conteúdo CSV / JSON na caixa abaixo
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Conteúdo do Arquivo:
                </label>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Cole aqui o conteúdo CSV ou JSON..."
                  className="w-full p-2.5 font-mono text-[11px] border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Modo de Inserção:</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-indigo-600"
                    />
                    <span>Adicionar às existentes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-rose-600"
                    />
                    <span className="text-rose-700 font-medium">Substituir todas</span>
                  </label>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleProcessImport}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
              >
                Processar e Importar Lojas
              </button>
            </div>
          )}

          {/* Aba de Reset */}
          {activeTab === 'reset' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 space-y-2">
                <h3 className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Redefinir para Dados de Demonstração
                </h3>
                <p>
                  Esta ação restaurará as 4 lojas originais de exemplo da rede ("Rede Alpha - Moda & Casa" em SP, RJ e BH) com todos os contatos e horários originais.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onResetDemo();
                  setSuccessMessage('Dados de demonstração restaurados com sucesso!');
                  setTimeout(() => onClose(), 1200);
                }}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition shadow-md shadow-amber-600/20"
              >
                Restaurar Lojas de Exemplo
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
