import React, { useState } from 'react';
import type { Store } from '../types';
import { downloadVCard } from '../utils/vcard';
import { getStoreOpenStatus } from '../utils/hours';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  UserPlus,
  Share2,
  Navigation,
  Globe,
  Wifi,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  Store as StoreIcon,
  Eye,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';

interface StoreLandingPageProps {
  store: Store;
  onBackToAdmin?: () => void;
  isStandalone?: boolean;
}

export const StoreLandingPage: React.FC<StoreLandingPageProps> = ({
  store,
  onBackToAdmin,
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [shared, setShared] = useState(false);
  const [showNavOptions, setShowNavOptions] = useState(false);

  const status = getStoreOpenStatus(store.hours);
  const cleanWhatsapp = store.whatsapp.replace(/\D/g, '');
  const cleanPhone = store.phone.replace(/[^\d+]/g, '');

  const fullAddress = `${store.address.street}, ${store.address.number}${
    store.address.complement ? ` - ${store.address.complement}` : ''
  }, ${store.address.neighborhood}, ${store.address.city} - ${store.address.state}, CEP ${store.address.zipCode}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleCopyWifi = () => {
    if (store.wifi?.password) {
      navigator.clipboard.writeText(store.wifi.password);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2500);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${store.brandName} - ${store.name}`,
      text: `Contatos e localização da filial ${store.name}: ${fullAddress}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-0 sm:py-6 px-0 sm:px-4">
      <div className="w-full max-w-md bg-white sm:rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-200/80">
        
        {/* Barra superior de navegação / admin */}
        {onBackToAdmin && (
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
            <button
              onClick={onBackToAdmin}
              className="flex items-center gap-1.5 hover:text-indigo-300 font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Painel da Rede
            </button>
            <span className="text-slate-400 font-mono">Modo Visualização Mobile</span>
          </div>
        )}

        {/* Banner Oficial Superior */}
        <div className="relative w-full h-36 sm:h-44 bg-slate-900 overflow-hidden">
          <img
            src="/banner-header.jpg"
            alt="Profissionais da Óptica"
            className="w-full h-full object-cover object-center brightness-95"
            onError={(e) => {
              // Fallback se imagem não carregar
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-950/60 to-transparent" />
          
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition text-white"
              title="Compartilhar filial"
            >
              {shared ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Cabeçalho Visual da Loja */}
        <div className="relative bg-gradient-to-b from-red-950 to-slate-900 text-white px-6 pt-0 pb-10 text-center">
          
          {/* Logo Símbolo da Marca Centralizado */}
          <div className="-mt-12 mb-3 inline-block">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-xl border-2 border-red-500/50 mx-auto flex items-center justify-center overflow-hidden">
              <img
                src="/logo-symbol.png"
                alt="Logo Profissionais da Óptica"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Badge da Rede */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-red-200 border border-white/10 mb-2">
              <StoreIcon className="w-3.5 h-3.5 text-red-300" />
              {store.brandName}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">{store.name}</h1>
          <p className="text-xs text-red-200 mt-1 font-mono">Cód. {store.code} • Maputo, Moçambique</p>

          {/* Avaliação no Google */}
          {store.rating && (
            <div className="mt-2 flex items-center justify-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ⭐ {store.rating.score.toFixed(1)} ({store.rating.count} avaliações no Google)
              </span>
            </div>
          )}

          {store.tagline && (
            <p className="text-xs text-slate-300 mt-2 italic max-w-xs mx-auto">
              "{store.tagline}"
            </p>
          )}

          {/* Status de Horário (Aberto/Fechado) */}
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border bg-white text-slate-800">
            <span
              className={`w-2 h-2 rounded-full ${
                status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            {status.statusText}
          </div>
        </div>

        {/* Ações Rápidas Principais (Botões de Alto Destaque) */}
        <div className="px-5 -mt-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 grid grid-cols-2 gap-3">
            
            {/* Como Chegar */}
            <div className="relative">
              <button
                onClick={() => setShowNavOptions(!showNavOptions)}
                className="w-full flex flex-col items-center justify-center p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-500/20 active:scale-95"
              >
                <Navigation className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Como Chegar</span>
                <span className="text-[10px] text-blue-100">GPS & Rotas</span>
              </button>

              {/* Menu de Apps de GPS */}
              {showNavOptions && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-30">
                  <a
                    href={store.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    Abrir no Google Maps
                  </a>
                  {store.wazeUrl && (
                    <a
                      href={store.wazeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-sky-500" />
                      Abrir no Waze
                    </a>
                  )}
                  <a
                    href={`https://maps.apple.com/?q=${encodeURIComponent(
                      `${store.address.street} ${store.address.number} ${store.address.city}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    Abrir no Apple Maps
                  </a>
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                store.whatsappMessage || `Olá, gostaria de atendimento na filial ${store.name}!`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">WhatsApp</span>
              <span className="text-[10px] text-emerald-100">Falar com Equipe</span>
            </a>

            {/* Ligar */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition shadow-sm active:scale-95"
            >
              <Phone className="w-5 h-5 mb-1 text-slate-200" />
              <span className="text-xs font-bold">Ligar para Loja</span>
              <span className="text-[10px] text-slate-300">{store.phone}</span>
            </a>

            {/* Salvar nos Contatos (vCard) */}
            <button
              onClick={() => downloadVCard(store)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition shadow-sm active:scale-95"
            >
              <UserPlus className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">Salvar Contato</span>
              <span className="text-[10px] text-amber-100">Baixar vCard</span>
            </button>
          </div>

          {/* Destaque da Ótica: Agendar Exame de Vista */}
          <div className="mt-3">
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                store.examWhatsappMessage || `Olá! Gostaria de agendar um exame de vista na ${store.brandName} (${store.name}).`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 hover:brightness-105 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Agendar Exame de Vista</p>
                  <p className="text-[11px] text-blue-100 mt-0.5">Avaliação visual e consulta de lentes</p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-white text-indigo-700 px-3 py-1 rounded-full group-hover:scale-105 transition shrink-0">
                Agendar
              </span>
            </a>
          </div>
        </div>

        {/* Conteúdo Detalhado da Loja */}
        <div className="p-5 space-y-4 flex-1">

          {/* Card de Serviços Especializados da Ótica */}
          {store.services && store.services.length > 0 && (
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                Serviços Ópticos da Unidade
              </h2>
              {store.opticianName && (
                <p className="text-[11px] text-blue-800 font-medium mt-1">
                  Responsável: <span className="font-semibold">{store.opticianName}</span>
                </p>
              )}
              <div className="mt-2.5 grid grid-cols-1 gap-1.5">
                {store.services.map((srv, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Card de Localização */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Endereço da Unidade
                </h2>
                <p className="text-sm font-medium text-slate-800 mt-1 leading-snug">
                  {store.address.street}, {store.address.number}
                  {store.address.complement && ` (${store.address.complement})`}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {store.address.neighborhood} - {store.address.city}/{store.address.state}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">CEP: {store.address.zipCode}</p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition shadow-xs"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    {copiedAddress ? 'Copiado!' : 'Copiar Endereço'}
                  </button>

                  <a
                    href={store.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                  >
                    Ver no Mapa
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Horários */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Horário de Funcionamento
                </h2>

                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Segunda a Sexta</span>
                    <span className="text-slate-900 font-semibold">{store.hours.weekdays}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Sábado</span>
                    <span className="text-slate-900 font-semibold">{store.hours.saturday}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Domingo</span>
                    <span className="text-slate-900 font-semibold">{store.hours.sunday}</span>
                  </div>
                  {store.hours.holidays && (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600 font-medium">Feriados</span>
                      <span className="text-slate-900 font-semibold">{store.hours.holidays}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Wi-Fi da Loja (se configurado) */}
          {store.wifi?.ssid && (
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200/80">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-purple-200 text-purple-800 rounded-xl mt-0.5">
                  <Wifi className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                    Wi-Fi para Clientes na Loja
                  </h2>
                  <p className="text-xs text-slate-700 mt-1">
                    Rede: <span className="font-semibold text-slate-900">{store.wifi.ssid}</span>
                  </p>
                  {store.wifi.password && (
                    <div className="mt-2 flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-purple-200">
                      <span className="text-xs text-slate-600">
                        Senha: <span className="font-mono font-bold text-slate-900">{store.wifi.password}</span>
                      </span>
                      <button
                        onClick={handleCopyWifi}
                        className="text-xs text-purple-700 hover:text-purple-900 font-medium flex items-center gap-1"
                      >
                        {copiedWifi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedWifi ? 'Copiada' : 'Copiar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Redes Sociais e E-mail */}
          <div className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              Canais Oficiais
            </h2>
            <div className="flex items-center justify-center gap-3">
              {store.social.website && (
                <a
                  href={store.social.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  <Globe className="w-4 h-4 text-indigo-600" />
                  Site
                </a>
              )}
              {store.social.instagram && (
                <a
                  href={`https://instagram.com/${store.social.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-600" />
                  Instagram
                </a>
              )}
              {store.social.facebook && (
                <a
                  href={store.social.facebook.startsWith('http') ? store.social.facebook : `https://${store.social.facebook}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-600" />
                  Facebook
                </a>
              )}
            </div>

            {store.email && (
              <p className="text-center text-xs text-slate-400 mt-3 font-mono">
                {store.email}
              </p>
            )}
          </div>
        </div>

        {/* Rodapé da Landing Page */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center">
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} {store.brandName} • Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
