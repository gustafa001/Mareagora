/**
 * MareAgora Tide Utilities
 * Funções utilitárias para processar dados de maré
 */

export interface TideEvent {
  hora: string;
  altura_m: number;
  tipo?: 'high' | 'low';
}

export interface TideDay {
  data: string;
  mares: TideEvent[];
}

export interface RawPortData {
  porto: string;
  estado: string;
  lat: number | string;
  lon: number | string;
  fuso: string;
  nivel_medio?: number;
  ano?: number;
  eventos: TideDay[];
}

/**
 * Retorna os dados de maré para o dia atual, ou o dia mais próximo disponível
 */
export function getTodayTides(eventos: any[]): TideDay | null {
  if (!eventos || !Array.isArray(eventos) || eventos.length === 0) return null;
  
  // Normaliza eventos se vierem no formato { dt, height_m }
  const normalizedEvents: TideDay[] = [];
  const eventsByDay: Record<string, any[]> = {};

  eventos.forEach(ev => {
    const dateStr = ev.data || (ev.dt ? ev.dt.split('T')[0] : null);
    if (!dateStr) return;
    if (!eventsByDay[dateStr]) eventsByDay[dateStr] = [];
    
    if (ev.mares || ev.eventos) {
      normalizedEvents.push(ev);
    } else {
      eventsByDay[dateStr].push({
        hora: ev.hora || (ev.dt ? ev.dt.split('T')[1].slice(0, 5) : ''),
        altura_m: ev.altura_m || ev.height_m || 0,
        tipo: ev.tipo
      });
    }
  });

  if (normalizedEvents.length === 0) {
    Object.entries(eventsByDay).forEach(([data, mares]) => {
      normalizedEvents.push({ data, mares });
    });
  }

  const today = new Date().toISOString().split('T')[0];
  const todayData = normalizedEvents.find(e => e.data === today);
  
  if (todayData) return todayData;
  
  // Se não tem dados de hoje, procurar o dia mais próximo (passado ou futuro)
  const sorted = [...normalizedEvents].sort((a, b) => a.data.localeCompare(b.data));
  
  // Procurar o dia mais próximo no passado
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].data < today) return sorted[i];
  }
  
  // Se não achou no passado, retornar o primeiro disponível
  return sorted[0] || null;
}

/**
 * Calcula a idade da lua baseada na data (0 a 29.53)
 */
export function getMoonAge(date: Date): number {
  const LUNAR_MONTH = 29.530588853;
  // Referência: Lua Nova em 2000-01-06 18:14 UTC
  const referenceDate = new Date('2000-01-06T18:14:00Z');
  const diffMs = date.getTime() - referenceDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const age = diffDays % LUNAR_MONTH;
  return age < 0 ? age + LUNAR_MONTH : age;
}

/**
 * Retorna o nome da fase lunar e ícone (aceita idade da lua em dias ou um objeto Date)
 */
export function getMoonPhase(ageOrDate: number | Date): { name: string; icon: string } {
  const age = typeof ageOrDate === 'number' ? ageOrDate : getMoonAge(ageOrDate);
  if (age < 1.84566) return { name: 'Lua Nova', icon: '🌑' };
  if (age < 5.53699) return { name: 'Lua Crescente', icon: '🌒' };
  if (age < 9.22831) return { name: 'Quarto Crescente', icon: '🌓' };
  if (age < 12.91963) return { name: 'Gibosa Crescente', icon: '🌔' };
  if (age < 16.61096) return { name: 'Lua Cheia', icon: '🌕' };
  if (age < 20.30228) return { name: 'Gibosa Minguante', icon: '🌖' };
  if (age < 23.99361) return { name: 'Quarto Minguante', icon: '🌗' };
  if (age < 27.68493) return { name: 'Lua Minguante', icon: '🌘' };
  return { name: 'Lua Nova', icon: '🌑' };
}

/**
 * Calcula a próxima maré alta e a próxima maré baixa a partir da hora atual (em minutos).
 * Mostra SEMPRE a maré mais próxima no futuro, sem filtros de janela mínima ou de amplitude média.
 */
export function getNextHighAndLow(
  todayTides: TideEvent[],
  currentMinute: number,
  nextDayTides?: TideEvent[]
): { nextHigh: TideEvent | null; nextLow: TideEvent | null } {
  const timeToMin = (hStr: string) => {
    const [h, m] = hStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const classifiedToday = classifyTideEvents(todayTides);
  const classifiedNext = nextDayTides ? classifyTideEvents(nextDayTides) : undefined;

  let nextHigh = classifiedToday.find(
    t => t.tipo === 'high' && timeToMin(t.hora) > currentMinute
  ) ?? null;

  if (!nextHigh && classifiedNext) {
    nextHigh = classifiedNext.find(t => t.tipo === 'high') ?? null;
  }
  if (!nextHigh) {
    nextHigh = classifiedToday.find(t => t.tipo === 'high') ?? null;
  }

  let nextLow = classifiedToday.find(
    t => t.tipo === 'low' && timeToMin(t.hora) > currentMinute
  ) ?? null;

  if (!nextLow && classifiedNext) {
    nextLow = classifiedNext.find(t => t.tipo === 'low') ?? null;
  }
  if (!nextLow) {
    nextLow = classifiedToday.find(t => t.tipo === 'low') ?? null;
  }

  return { nextHigh, nextLow };
}

/**
 * Calcula o coeficiente de maré (20 a 120)
 * Se eventos de maré forem fornecidos, calcula com base na amplitude real da maré (range * 55).
 * Caso contrário, utiliza a fórmula astronômica baseada na idade da lua.
 */
export function getTideCoefficient(
  moonAgeOrDate: number | Date,
  todayTides?: TideEvent[]
): { value: number; label: string; color: string } {
  let value: number;

  if (todayTides && todayTides.length >= 2) {
    const heights = todayTides.map(m => m.altura_m);
    const range = Math.max(...heights) - Math.min(...heights);
    value = Math.min(120, Math.max(5, Math.round(range * 55)));
  } else {
    const age = typeof moonAgeOrDate === 'number'
      ? moonAgeOrDate
      : getMoonAge(moonAgeOrDate);
    const LUNAR_MONTH = 29.530588853;
    const angle = (age / LUNAR_MONTH) * 2 * Math.PI * 2;
    const cosVal = Math.cos(angle);
    value = Math.round(70 + cosVal * 50);
  }

  let label = "Moderada";
  let color = "text-yellow-400";

  if (value <= 40) {
    label = "Maré Morta (Fraca)";
    color = "text-emerald-400";
  } else if (value >= 90) {
    label = "Maré Viva (Forte)";
    color = "text-rose-500";
  } else if (value > 70) {
    label = "Moderada Alta";
    color = "text-orange-400";
  }

  return { value, label, color };
}

/**
 * Determina o tipo de cada evento de maré (alta ou baixa)
 */
export function classifyTideEvents(mares: TideEvent[]): TideEvent[] {
  if (!mares || mares.length === 0) return [];
  
  // Ordenar por hora
  const sorted = [...mares].sort((a, b) => a.hora.localeCompare(b.hora));
  
  // Classificar como alta ou baixa baseado na altura relativa
  return sorted.map((event, index, arr) => {
    const prev = arr[index - 1];
    const next = arr[index + 1];
    
    let tipo: 'high' | 'low';
    if (!prev && next) {
      tipo = event.altura_m > next.altura_m ? 'high' : 'low';
    } else if (prev && !next) {
      tipo = event.altura_m > prev.altura_m ? 'high' : 'low';
    } else if (prev && next) {
      const isPeak = event.altura_m > prev.altura_m && event.altura_m > next.altura_m;
      const isValley = event.altura_m < prev.altura_m && event.altura_m < next.altura_m;
      tipo = isPeak ? 'high' : isValley ? 'low' : (event.altura_m > 1.0 ? 'high' : 'low');
    } else {
      tipo = event.altura_m > 1.0 ? 'high' : 'low';
    }
    
    return { ...event, tipo };
  });
}

/**
 * Retorna o status atual da maré
 */
export function getCurrentTideStatus(
  todayTides: TideDay,
  currentTime: string
): {
  status: 'rising' | 'falling';
  nextEvent: TideEvent | null;
  currentHeight: number;
} {
  if (!todayTides || !todayTides.mares || todayTides.mares.length === 0) {
    return { status: 'rising', nextEvent: null, currentHeight: 0 };
  }
  
  const mares = classifyTideEvents(todayTides.mares);
  const [hours, minutes] = currentTime.split(':').map(Number);
  const currentMinutes = hours * 60 + minutes;
  
  // Encontrar próximo evento
  let nextEvent: TideEvent | null = null;
  for (const event of mares) {
    const [eh, em] = event.hora.split(':').map(Number);
    const eventMinutes = eh * 60 + em;
    if (eventMinutes > currentMinutes) {
      nextEvent = event;
      break;
    }
  }
  
  // Se não encontrou próximo, é o primeiro do dia seguinte
  if (!nextEvent && mares.length > 0) {
    nextEvent = mares[0];
  }
  
  // Calcular altura atual por interpolação
  let currentHeight = 1.0;
  for (let i = 0; i < mares.length - 1; i++) {
    const [h1, m1] = mares[i].hora.split(':').map(Number);
    const [h2, m2] = mares[i + 1].hora.split(':').map(Number);
    const t1 = h1 * 60 + m1;
    const t2 = h2 * 60 + m2;
    
    if (currentMinutes >= t1 && currentMinutes <= t2) {
      const ratio = (currentMinutes - t1) / (t2 - t1);
      currentHeight = mares[i].altura_m + (mares[i + 1].altura_m - mares[i].altura_m) * ratio;
      break;
    }
  }
  
  return {
    status: nextEvent?.tipo === 'high' ? 'rising' : 'falling',
    nextEvent,
    currentHeight
  };
}

/**
 * Retorna recomendação baseada nas condições de maré
 */
export function getTideRecommendation(
  tideHeight: number,
  tideStatus: 'rising' | 'falling'
): string {
  if (tideHeight < 0.5) {
    return tideStatus === 'rising' 
      ? '📈 Maré baixa subindo - Boas condições para passeios na praia'
      : '📉 Maré baixa descendo - Cuidado com rochas expostas';
  }
  
  if (tideHeight > 2.0) {
    return tideStatus === 'rising'
      ? '🌊 Maré alta subindo - Ótimo para surf e embarcações'
      : '🌊 Maré alta descendo - Aproveite antes da vazante';
  }
  
  return '⛵ Maré média - Condições estáveis para atividades náuticas';
}

/**
 * Formata a hora para exibição
 */
export function formatTime(hora: string): string {
  return hora;
}

/**
 * Gera dados para o gráfico de maré
 */
export function generateTideCurve(mares: TideEvent[]): { time: string; height: number }[] {
  if (!mares || mares.length === 0) return [];
  
  const sorted = [...mares].sort((a, b) => a.hora.localeCompare(b.hora));
  const points: { time: string; height: number }[] = [];
  
  // Gerar pontos para cada 30 minutos entre os eventos
  for (let i = 0; i < sorted.length - 1; i++) {
    const [h1, m1] = sorted[i].hora.split(':').map(Number);
    const [h2, m2] = sorted[i + 1].hora.split(':').map(Number);
    const t1 = h1 * 60 + m1;
    const t2 = h2 * 60 + m2;
    
    const duration = t2 - t1;
    const steps = Math.max(1, Math.floor(duration / 30));
    
    for (let step = 0; step <= steps; step++) {
      const t = t1 + (duration * step) / steps;
      const ratio = step / steps;
      const height = sorted[i].altura_m + (sorted[i + 1].altura_m - sorted[i].altura_m) * ratio;
      const hh = Math.floor(t / 60) % 24;
      const mm = Math.floor(t % 60);
      points.push({
        time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
        height: Math.round(height * 100) / 100
      });
    }
  }
  
  return points;
}

/**
 * Calcula a altura da maré em um minuto específico
 */
export function tideAtMinute(minute: number, tides: TideEvent[]): number {
  if (!tides || tides.length === 0) return 0;
  
  const sorted = [...tides].sort((a, b) => a.hora.localeCompare(b.hora));
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const [h1, m1] = sorted[i].hora.split(':').map(Number);
    const [h2, m2] = sorted[i + 1].hora.split(':').map(Number);
    const t1 = h1 * 60 + m1;
    const t2 = h2 * 60 + m2;
    
    if (minute >= t1 && minute <= t2) {
      const ratio = (minute - t1) / (t2 - t1);
      return sorted[i].altura_m + (sorted[i + 1].altura_m - sorted[i].altura_m) * ratio;
    }
  }
  
  return sorted[0].altura_m;
}

/**
 * Retorna se a maré está subindo e qual o próximo evento
 */
export function getTideStatus(
  minute: number,
  tides: TideEvent[]
): { rising: boolean; next: TideEvent | null } {
  if (!tides || tides.length === 0) return { rising: true, next: null };

  const sorted = [...tides].sort((a, b) => a.hora.localeCompare(b.hora));

  let next: TideEvent | null = null;
  let prev: TideEvent | null = null;

  for (const tide of sorted) {
    const [h, m] = tide.hora.split(':').map(Number);
    const t = h * 60 + m;
    if (t > minute) {
      next = tide;
      break;
    }
    prev = tide;
  }

  if (!next) next = sorted[0];

  const rising = next
    ? next.altura_m > (prev?.altura_m ?? 0)
    : true;

  return { rising, next };
}

/**
 * Converte graus em direção cardinal
 */
export function degToCompass(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  return dirs[Math.round(deg / 22.5) % 16];
}
