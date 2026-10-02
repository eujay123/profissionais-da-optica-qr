import type { Store } from '../types';

/**
 * Gera a string no formato RFC 3.0 vCard para a filial
 */
export function generateVCard(store: Store): string {
  const cleanPhone = store.phone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = store.whatsapp.replace(/[^\d+]/g, '');

  const fullStreet = `${store.address.street}, ${store.address.number}${
    store.address.complement ? ` - ${store.address.complement}` : ''
  }${store.address.neighborhood ? ` - ${store.address.neighborhood}` : ''}`;

  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${store.brandName} - ${store.name}`,
    `ORG;CHARSET=UTF-8:${store.brandName};${store.name}`,
    `TITLE;CHARSET=UTF-8:Filial ${store.name} (${store.code})`,
  ];

  if (cleanPhone) {
    vcardLines.push(`TEL;TYPE=WORK,VOICE:${cleanPhone}`);
  }

  if (cleanWhatsapp) {
    vcardLines.push(`TEL;TYPE=CELL,MSG,WHATSAPP:${cleanWhatsapp}`);
  }

  if (store.email) {
    vcardLines.push(`EMAIL;TYPE=WORK,INTERNET:${store.email}`);
  }

  // Endereço completo formatado
  vcardLines.push(
    `ADR;TYPE=WORK;CHARSET=UTF-8:;;${fullStreet};${store.address.city};${store.address.state};${store.address.zipCode};Moçambique`
  );

  if (store.social.website) {
    vcardLines.push(`URL:${store.social.website}`);
  } else if (store.googleMapsUrl) {
    vcardLines.push(`URL:${store.googleMapsUrl}`);
  }

  if (store.coordinates?.lat && store.coordinates?.lng) {
    vcardLines.push(`GEO:${store.coordinates.lat};${store.coordinates.lng}`);
  }

  // Informações adicionais na nota do contato
  const notes = [
    `Filial: ${store.name} (${store.code})`,
    `Horários: Seg-Sex: ${store.hours.weekdays} | Sáb: ${store.hours.saturday} | Dom: ${store.hours.sunday}`,
    store.managerName ? `Gerente: ${store.managerName}` : null,
    store.googleMapsUrl ? `Localização no Mapa: ${store.googleMapsUrl}` : null,
  ]
    .filter(Boolean)
    .join(' \\n ');

  vcardLines.push(`NOTE;CHARSET=UTF-8:${notes}`);
  vcardLines.push('END:VCARD');

  return vcardLines.join('\r\n');
}

/**
 * Dispara o download imediato do arquivo .vcf para o celular/computador
 */
export function downloadVCard(store: Store): void {
  const vcardText = generateVCard(store);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `${store.brandName.toLowerCase().replace(/\s+/g, '_')}_${store.name
    .toLowerCase()
    .replace(/[^\w]/g, '_')}.vcf`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
