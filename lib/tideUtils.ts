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
 * Retorna os dados de maré para o dia atual
 */
export function getTodayTides(eventos: TideDay[]): TideDay | null {
  const today = new Date().toISOString().split('T')[0];
  return eventos.find(e => e.data === today) || eventos[0] || null;
}

/**
 * Calcula a idade da lua baseada na data
 */
export function getMoonAge(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();
  
  let c, e, jd, b;
  if (month < 3) {
    year--;
    month += 12;
  }
  c = 365.25 * year;
  e = 30.6 * month;
  jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  b = parseInt(jd.toString());
  jd -= b;
  return Math.round(jd * 29.53);
}

/**
 * Retorna o nome da fase lunar
 */
export function getMoonPhaseName(age: number): string {
  if (age < 1) return '🌑 Lua Nova';
  if (age < 7) return '🌒 Crescente';
  if (age < 8) return '🌓 Quarto Crescente';
  if (age < 14) return '🌔 Gibosa Crescente';
  if (age < 15) return '🌕 Lua Cheia';
  if (age < 22) return '🌖 Gibosa Minguante';
  if (age < 23) return '🌗 Quarto Minguante';
  return '🌘 Minguante';
}

/**
 * Calcula o coeficiente de maré
 */
export function getTideCoefficient(date: Date, moonAge: number): number {
  const baseCoefficient = 95;
  const lunarVariation = Math.cos((moonAge / 29.53) * 2 * Math.PI) * 25;
  return Math.round(baseCoefficient + lunarVariation);
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
