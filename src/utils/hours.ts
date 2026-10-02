import type { BusinessHours } from '../types';

export interface OpenStatus {
  isOpen: boolean;
  statusText: string;
  nextInfo?: string;
  badgeClass: string;
}

/**
 * Avalia se o horário especificado (ex: "08:00 - 19:00" ou "Fechado") está aberto no momento
 */
export function getStoreOpenStatus(hours: BusinessHours): OpenStatus {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Domingo, 1-5 = Seg-Sex, 6 = Sábado
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let todayHours = '';
  if (dayOfWeek === 0) {
    todayHours = hours.sunday;
  } else if (dayOfWeek === 6) {
    todayHours = hours.saturday;
  } else {
    todayHours = hours.weekdays;
  }

  if (!todayHours || todayHours.toLowerCase().includes('fechado')) {
    return {
      isOpen: false,
      statusText: 'Fechado hoje',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    };
  }

  // Tentar extrair intervalo "HH:MM - HH:MM"
  const match = todayHours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) {
    return {
      isOpen: true,
      statusText: todayHours,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
  }

  const openMinutes = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  const closeMinutes = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const remainingMinutes = closeMinutes - currentMinutes;
    const closingSoon = remainingMinutes <= 60;

    return {
      isOpen: true,
      statusText: closingSoon ? `Fecha em breve às ${match[3]}:${match[4]}` : 'Aberto agora',
      nextInfo: `Fecha às ${match[3]}:${match[4]}`,
      badgeClass: closingSoon
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
  } else if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      statusText: `Abre hoje às ${match[1]}:${match[2]}`,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    };
  } else {
    return {
      isOpen: false,
      statusText: 'Fechado no momento',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    };
  }
}
