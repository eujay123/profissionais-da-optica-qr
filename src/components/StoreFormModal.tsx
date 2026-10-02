import React, { useState } from 'react';
import type { Store } from '../types';
import { X, Check, Building2, MapPin, Clock, Share2, Compass } from 'lucide-react';

interface StoreFormModalProps {
  initialStore?: Store | null;
  defaultBrandName: string;
  onSave: (store: Store) => void;
  onClose: () => void;
}

export const StoreFormModal: React.FC<StoreFormModalProps> = ({
  initialStore,
  defaultBrandName,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(initialStore);

  const [formData, setFormData] = useState({
    code: initialStore?.code || `FILIAL-${Math.floor(100 + Math.random() * 900)}`,
    name: initialStore?.name || '',
    brandName: initialStore?.brandName || defaultBrandName,
    tagline: initialStore?.tagline || '',
    managerName: initialStore?.managerName || '',
    phone: initialStore?.phone || '',
    whatsapp: initialStore?.whatsapp || '',
    whatsappMessage: initialStore?.whatsappMessage || 'Olá! Gostaria de falar com a equipe desta loja.',
    email: initialStore?.email || '',
    street: initialStore?.address.street || '',
    number: initialStore?.address.number || '',
    neighborhood: initialStore?.address.neighborhood || '',
    city: initialStore?.address.city || '',
    state: initialStore?.address.state || 'SP',
    zipCode: initialStore?.address.zipCode || '',
    complement: initialStore?.address.complement || '',
    googleMapsUrl: initialStore?.googleMapsUrl || '',
    wazeUrl: initialStore?.wazeUrl || '',
    weekdays: initialStore?.hours.weekdays || '09:00 - 19:00',
    saturday: initialStore?.hours.saturday || '09:00 - 18:00',
    sunday: initialStore?.hours.sunday || 'Fechado',
    holidays: initialStore?.hours.holidays || 'Consulte horários especiais',
    wifiSsid: initialStore?.wifi?.ssid || '',
    wifiPass: initialStore?.wifi?.password || '',
    instagram: initialStore?.social.instagram || '',
    website: initialStore?.social.website || '',
  });

  const [activeTab, setActiveTab] = useState<'info' | 'address' | 'hours' | 'extras'>('info');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateMapsUrl = () => {
    if (!formData.street || !formData.city) {
      alert('Preencha ao menos a rua e a cidade para gerar o link do mapa.');
      return;
    }
    const query = `${formData.street} ${formData.number}, ${formData.neighborhood}, ${formData.city} - ${formData.state}`;
    const url = `https://maps.google.com/?q=${encodeURIComponent(query)}`;
    setFormData((prev) => ({ ...prev, googleMapsUrl: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Por favor, informe o nome da filial.');
      return;
    }

    const finalGoogleMapsUrl =
      formData.googleMapsUrl ||
      `https://maps.google.com/?q=${encodeURIComponent(`${formData.street} ${formData.number} ${formData.city}`)}`;

    const store: Store = {
      id: initialStore?.id || `loja-${formData.code.toLowerCase().replace(/\W/g, '-')}-${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      brandName: formData.brandName.trim() || defaultBrandName,
      tagline: formData.tagline.trim(),
      managerName: formData.managerName.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim(),
      whatsappMessage: formData.whatsappMessage.trim(),
      email: formData.email.trim(),
      address: {
        street: formData.street.trim(),
        number: formData.number.trim(),
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
        zipCode: formData.zipCode.trim(),
        complement: formData.complement.trim(),
      },
      googleMapsUrl: finalGoogleMapsUrl,
      wazeUrl: formData.wazeUrl.trim() || undefined,
      hours: {
        weekdays: formData.weekdays.trim(),
        saturday: formData.saturday.trim(),
        sunday: formData.sunday.trim(),
        holidays: formData.holidays.trim(),
      },
      wifi: formData.wifiSsid ? { ssid: formData.wifiSsid, password: formData.wifiPass, encryption: 'WPA' } : undefined,
      social: {
        instagram: formData.instagram.trim(),
        website: formData.website.trim(),
      },
      activeQrTarget: initialStore?.activeQrTarget || 'landing',
      qrStyle: initialStore?.qrStyle,
      createdAt: initialStore?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(store);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col border border-slate-100 max-h-[92vh]">
        
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? `Editar Filial: ${initialStore?.name}` : 'Cadastrar Nova Filial da Rede'}
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
          {[
            { id: 'info', label: 'Dados & Contatos', icon: Building2 },
            { id: 'address', label: 'Endereço & GPS', icon: MapPin },
            { id: 'hours', label: 'Horários de Funcionamento', icon: Clock },
            { id: 'extras', label: 'Canais Digitais', icon: Share2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Formulário com Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Aba 1: Dados & Contatos */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cód. Filial *
                  </label>
                  <input
                    type="text"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Ex: SP-001"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da Filial / Loja *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Loja Centro - Rua das Flores"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rede / Marca
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gerente Responsável
                  </label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    placeholder="Ex: Carlos Silva"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Slogan ou Destaque da Filial
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Ex: Atendimento exclusivo com estacionamento próprio"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone Fixo Comercial
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ex: +55 11 3456-7890"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp (com DDI e DDD) *
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Ex: 5511999998888"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail da Filial
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ex: filial.centro@rede.com.br"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mensagem Padrão do WhatsApp
                </label>
                <textarea
                  name="whatsappMessage"
                  rows={2}
                  value={formData.whatsappMessage}
                  onChange={handleChange}
                  placeholder="Mensagem pré-preenchida quando o cliente clica no botão do WhatsApp"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Aba 2: Endereço & GPS */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rua / Avenida *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Ex: Rua das Flores"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="Ex: 100"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="complement"
                    value={formData.complement}
                    onChange={handleChange}
                    placeholder="Ex: Sala 10, Piso 2"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    placeholder="Ex: Centro"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ex: São Paulo"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Ex: SP"
                    maxLength={2}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="00000-000"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Link Direto do Google Maps (Navegação GPS)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateMapsUrl}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                  >
                    <Compass className="w-3 h-3" />
                    Gerar link com o endereço acima
                  </button>
                </div>
                <input
                  type="url"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link Direto do Waze (Opcional)
                </label>
                <input
                  type="url"
                  name="wazeUrl"
                  value={formData.wazeUrl}
                  onChange={handleChange}
                  placeholder="https://waze.com/ul?..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* Aba 3: Horários de Funcionamento */}
          {activeTab === 'hours' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Segunda a Sexta-feira
                </label>
                <input
                  type="text"
                  name="weekdays"
                  value={formData.weekdays}
                  onChange={handleChange}
                  placeholder="Ex: 09:00 - 19:00"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sábado
                </label>
                <input
                  type="text"
                  name="saturday"
                  value={formData.saturday}
                  onChange={handleChange}
                  placeholder="Ex: 09:00 - 18:00 ou Fechado"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Domingo
                </label>
                <input
                  type="text"
                  name="sunday"
                  value={formData.sunday}
                  onChange={handleChange}
                  placeholder="Ex: Fechado ou 14:00 - 20:00"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Feriados
                </label>
                <input
                  type="text"
                  name="holidays"
                  value={formData.holidays}
                  onChange={handleChange}
                  placeholder="Ex: Horários sob consulta"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Aba 4: Canais Oficiais & Redes Sociais */}
          {activeTab === 'extras' && (
            <div className="space-y-4">
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-red-600" />
                  Presença Digital da Filial
                </span>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Instagram da Filial ou Rede
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="Ex: @redealpha.centro"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Site / Loja Virtual
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://redealpha.com.br"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rodapé e Botões */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              <Check className="w-4 h-4" />
              {isEditing ? 'Salvar Filial' : 'Criar Filial'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
