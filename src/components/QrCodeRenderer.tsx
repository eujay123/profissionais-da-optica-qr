import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  Options as QrOptions,
} from 'qr-code-styling';
import type { Store, QrTargetType, QrStyleConfig } from '../types';
import { generateVCard } from '../utils/vcard';
import { Download, Sparkles } from 'lucide-react';

interface QrCodeRendererProps {
  store: Store;
  size?: number;
  overrideTarget?: QrTargetType;
  customStyle?: Partial<QrStyleConfig>;
  showControls?: boolean;
  productionBaseUrl?: string;
}

export function getQrDataForStore(
  store: Store,
  target: QrTargetType,
  productionBaseUrl?: string
): string {
  switch (target) {
    case 'landing': {
      // Prioriza a URL de produção na Vercel (se configurada) para que o QR impresso funcione no mundo real
      const base = (productionBaseUrl && productionBaseUrl.trim().length > 0)
        ? productionBaseUrl.replace(/\/+$/, '')
        : (window.location.origin + window.location.pathname).replace(/\/+$/, '');
      return `${base}/?loja=${encodeURIComponent(store.id)}`;
    }
    case 'vcard':
      return generateVCard(store);
    case 'maps':
      return store.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${store.address.street}, ${store.address.city}`)}`;
    case 'whatsapp': {
      const cleanWa = store.whatsapp.replace(/\D/g, '');
      const msg = encodeURIComponent(store.whatsappMessage || `Olá! Contato com ${store.name}`);
      return `https://wa.me/${cleanWa}?text=${msg}`;
    }
    case 'wifi': {
      const ssid = store.wifi?.ssid || '';
      const pass = store.wifi?.password || '';
      const enc = store.wifi?.encryption || 'WPA';
      return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    }
    default:
      return `${window.location.origin}${window.location.pathname}?loja=${store.id}`;
  }
}

export const QrCodeRenderer: React.FC<QrCodeRendererProps> = ({
  store,
  size = 280,
  overrideTarget,
  customStyle,
  showControls = true,
  productionBaseUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  const target = overrideTarget || store.activeQrTarget || 'landing';
  const qrData = getQrDataForStore(store, target, productionBaseUrl);

  const styleConfig: Partial<QrStyleConfig> = {
    dotsColor: '#1e3a8a',
    backgroundColor: '#ffffff',
    cornerSquareColor: '#1e3a8a',
    cornerDotColor: '#2563eb',
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    ...store.qrStyle,
    ...customStyle,
  };

  useEffect(() => {
    const options: QrOptions = {
      width: size,
      height: size,
      data: qrData,
      margin: 12,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q', // Boa tolerância para permitir logo no centro
      },
      image: styleConfig.logoUrl || undefined,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.35,
        margin: styleConfig.logoMargin ?? 4,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        color: styleConfig.dotsColor || '#1e3a8a',
        type: (styleConfig.dotsType as DotType) || 'rounded',
      },
      backgroundOptions: {
        color: styleConfig.backgroundColor || '#ffffff',
      },
      cornersSquareOptions: {
        color: styleConfig.cornerSquareColor || styleConfig.dotsColor || '#1e3a8a',
        type: (styleConfig.cornersSquareType as CornerSquareType) || 'extra-rounded',
      },
      cornersDotOptions: {
        color: styleConfig.cornerDotColor || styleConfig.dotsColor || '#2563eb',
        type: (styleConfig.cornersDotType as CornerDotType) || 'dot',
      },
    };

    if (!qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling(options);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrCodeInstance.current.append(containerRef.current);
      }
    } else {
      qrCodeInstance.current.update(options);
    }
  }, [qrData, size, styleConfig.dotsColor, styleConfig.backgroundColor, styleConfig.cornerSquareColor, styleConfig.cornerDotColor, styleConfig.dotsType, styleConfig.cornersSquareType, styleConfig.cornersDotType, styleConfig.logoUrl, styleConfig.logoMargin]);

  const handleDownload = (format: 'png' | 'svg' | 'jpeg') => {
    if (!qrCodeInstance.current) return;
    const safeName = `qr_${store.code || 'loja'}_${target}`.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    qrCodeInstance.current.download({
      name: safeName,
      extension: format,
    });
  };

  const getTargetBadge = () => {
    switch (target) {
      case 'landing':
        return { label: 'Página da Loja (Mobile)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'vcard':
        return { label: 'vCard Direto (Agenda)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'maps':
        return { label: 'GPS / Localização Direta', color: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'whatsapp':
        return { label: 'WhatsApp Direto', color: 'bg-green-50 text-green-700 border-green-200' };
      case 'wifi':
        return { label: 'Conexão Wi-Fi Direta', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
  };

  const badge = getTargetBadge();

  return (
    <div className="flex flex-col items-center">
      <div className="relative p-3 bg-white rounded-2xl shadow-sm border border-slate-200 group">
        <div
          ref={containerRef}
          className="flex items-center justify-center overflow-hidden rounded-xl"
          style={{ width: size, height: size }}
        />
        <div className="mt-2 text-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
            <Sparkles className="w-3 h-3 mr-1" />
            {badge.label}
          </span>
        </div>
      </div>

      {showControls && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => handleDownload('png')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
            title="Download em alta definição (PNG)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            PNG (HQ)
          </button>
          <button
            onClick={() => handleDownload('svg')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
            title="Download vetorizado para impressão gráfica (SVG)"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            SVG (Vetor)
          </button>
        </div>
      )}
    </div>
  );
};
