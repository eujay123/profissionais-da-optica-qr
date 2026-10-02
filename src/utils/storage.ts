import type { Store, ChainSettings } from '../types';
import { initialStores, initialChainSettings } from '../data/initialStores';

const STORES_STORAGE_KEY = 'profissionais_optica_filiais_v5';
const SETTINGS_STORAGE_KEY = 'profissionais_optica_settings_v5';

export function loadStores(): Store[] {
  try {
    // Limpa versões de cache antigas do navegador para garantir que o usuário veja as 6 filiais
    localStorage.removeItem('qr_multi_stores_data_v1');
    localStorage.removeItem('profissionais_optica_stores_v2');

    const raw = localStorage.getItem(STORES_STORAGE_KEY);
    if (!raw) {
      saveStores(initialStores);
      return initialStores;
    }
    const parsed = JSON.parse(raw);
    
    // Se por algum motivo houver lojas antigas (Optimax, VISION, Brasil), limpa e recarrega as 6 filiais oficiais
    const hasUnwantedStores = Array.isArray(parsed) && parsed.some((s: any) =>
      s.name?.includes('Optimax') ||
      s.name?.includes('VISION') ||
      s.address?.city === 'São Paulo' ||
      s.address?.state === 'SP'
    );

    if (hasUnwantedStores || !Array.isArray(parsed) || parsed.length === 0) {
      saveStores(initialStores);
      return initialStores;
    }

    return parsed;
  } catch (err) {
    console.error('Erro ao ler lojas do localStorage:', err);
    saveStores(initialStores);
    return initialStores;
  }
}

export function saveStores(stores: Store[]): void {
  try {
    localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(stores));
  } catch (err) {
    console.error('Erro ao salvar lojas no localStorage:', err);
  }
}

export function loadChainSettings(): ChainSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      saveChainSettings(initialChainSettings);
      return initialChainSettings;
    }
    const parsed = JSON.parse(raw);
    return {
      ...initialChainSettings,
      ...parsed,
      productionBaseUrl: parsed.productionBaseUrl || initialChainSettings.productionBaseUrl,
    };
  } catch (err) {
    console.error('Erro ao ler configurações do localStorage:', err);
    return initialChainSettings;
  }
}

export function saveChainSettings(settings: ChainSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Erro ao salvar configurações no localStorage:', err);
  }
}

export function resetToDemoData(): { stores: Store[]; settings: ChainSettings } {
  saveStores(initialStores);
  saveChainSettings(initialChainSettings);
  return { stores: initialStores, settings: initialChainSettings };
}

/**
 * Converte lista de lojas para formato CSV
 */
export function exportStoresToCSV(stores: Store[]): string {
  const headers = [
    'Código',
    'Nome Filial',
    'Rede',
    'Telefone',
    'WhatsApp',
    'Email',
    'Rua',
    'Numero',
    'Bairro',
    'Cidade',
    'Estado',
    'CEP',
    'Google Maps URL',
    'Horario Seg-Sex',
    'Horario Sabado',
    'Horario Domingo',
  ];

  const escapeCSV = (val: string = '') => `"${val.replace(/"/g, '""')}"`;

  const rows = stores.map((s) => [
    escapeCSV(s.code),
    escapeCSV(s.name),
    escapeCSV(s.brandName),
    escapeCSV(s.phone),
    escapeCSV(s.whatsapp),
    escapeCSV(s.email),
    escapeCSV(s.address.street),
    escapeCSV(s.address.number),
    escapeCSV(s.address.neighborhood),
    escapeCSV(s.address.city),
    escapeCSV(s.address.state),
    escapeCSV(s.address.zipCode),
    escapeCSV(s.googleMapsUrl),
    escapeCSV(s.hours.weekdays),
    escapeCSV(s.hours.saturday),
    escapeCSV(s.hours.sunday),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Importa lojas a partir de CSV ou JSON
 */
export function parseImportedData(rawContent: string, format: 'json' | 'csv'): Store[] {
  if (format === 'json') {
    const parsed = JSON.parse(rawContent);
    if (!Array.isArray(parsed)) throw new Error('O arquivo JSON deve conter um array de lojas.');
    return parsed.map((item, index) => ({
      ...item,
      id: item.id || `loja-importada-${Date.now()}-${index}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  // Parse CSV simples
  const lines = rawContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new Error('O arquivo CSV precisa ter cabeçalho e pelo menos uma linha de loja.');

  // Ignora cabeçalho
  const dataLines = lines.slice(1);
  const parseLine = (line: string) => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  return dataLines.map((line, idx) => {
    const cols = parseLine(line);
    const [
      code,
      name,
      brandName,
      phone,
      whatsapp,
      email,
      street,
      number,
      neighborhood,
      city,
      state,
      zipCode,
      googleMapsUrl,
      weekdays,
      saturday,
      sunday,
    ] = cols;

    return {
      id: `loja-${(code || 'filial').toLowerCase().replace(/\W/g, '-')}-${Date.now()}-${idx}`,
      code: code || `LJ-${String(idx + 1).padStart(3, '0')}`,
      name: name || `Filial ${idx + 1}`,
      brandName: brandName || 'Rede de Lojas',
      phone: phone || '',
      whatsapp: whatsapp || '',
      email: email || '',
      address: {
        street: street || '',
        number: number || '',
        neighborhood: neighborhood || '',
        city: city || '',
        state: state || '',
        zipCode: zipCode || '',
      },
      googleMapsUrl: googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${street} ${city}`)}`,
      hours: {
        weekdays: weekdays || '09:00 - 19:00',
        saturday: saturday || '09:00 - 18:00',
        sunday: sunday || 'Fechado',
      },
      social: {},
      activeQrTarget: 'landing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}
