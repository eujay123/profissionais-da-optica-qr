export interface StoreAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
}

export interface BusinessHours {
  weekdays: string;   // ex: "08:30 - 19:00"
  saturday: string;   // ex: "09:00 - 18:00"
  sunday: string;     // ex: "Fechado" ou "12:00 - 18:00"
  holidays?: string;  // ex: "Consulte nossos canais"
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  website?: string;
  tiktok?: string;
}

export interface WifiInfo {
  ssid?: string;
  password?: string;
  encryption?: 'WPA' | 'WEP' | 'nopass';
}

export interface QrStyleConfig {
  dotsColor: string;
  backgroundColor: string;
  cornerSquareColor: string;
  cornerDotColor: string;
  dotsType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  cornersSquareType: 'dot' | 'square' | 'extra-rounded';
  cornersDotType: 'dot' | 'square';
  logoUrl?: string;
  logoMargin?: number;
}

export type QrTargetType = 'landing' | 'vcard' | 'maps' | 'whatsapp' | 'wifi';

export interface Store {
  id: string;
  code: string;                 // Código interno da filial (ex: "OPT-01")
  name: string;                 // Nome da filial (ex: "Filial Centro - Rua Principal")
  brandName: string;            // Nome da rede: "Profissional da Óptica"
  tagline?: string;             // Slogan ou especialidade da filial
  address: StoreAddress;
  phone: string;                // Telefone fixo da ótica
  whatsapp: string;             // WhatsApp da loja
  whatsappMessage?: string;     // Mensagem geral de atendimento
  examWhatsappMessage?: string; // Mensagem rápida para agendamento de exame de vista
  email: string;
  managerName?: string;         // Gerente da filial
  opticianName?: string;        // Óptico / Optometrista responsável
  googleMapsUrl: string;        // Link de navegação GPS
  wazeUrl?: string;             // Link Waze
  coordinates?: {
    lat: number;
    lng: number;
  };
  hours: BusinessHours;
  services?: string[];          // Serviços da ótica (Exame de vista, ajuste, lentes etc.)
  rating?: {
    score: number;
    count: number;
  };
  social: SocialMedia;
  wifi?: WifiInfo;
  qrStyle?: Partial<QrStyleConfig>;
  activeQrTarget?: QrTargetType;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChainSettings {
  brandName: string;
  tagline?: string;
  productionBaseUrl?: string;   // URL pública da Vercel (ex: https://profissional-da-optica.vercel.app)
  defaultLogoUrl?: string;
  defaultQrStyle: QrStyleConfig;
}
