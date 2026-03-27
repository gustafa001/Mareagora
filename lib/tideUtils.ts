export type TideEvent = { hora: string; altura_m: number; tipo?: string };
export type TideDay = { data: string; mares: TideEvent[] };

// Retorna os eventos de maré da data mais próxima do dia atual a partir do JSON do porto
export function getTodayTides(portData: { eventos: TideDay[] }): { tides: TideEvent[], date: string } {
  const today = new Date().toISOString().split('T')[0];
  const day = portData.eventos.find(e => e.data === today);
  
  if (day) return { tides: day.mares, date: today };

  // Encontra a data mais próxima
  const sorted = [...portData.eventos].sort((a, b) => {
    return Math.abs(new Date(a.data).getTime() - new Date(today).getTime()) - 
           Math.abs(new Date(b.data).getTime() - new Date(today).getTime());
  });

  const closest = sorted[0];
  return { tides: closest?.mares ?? [], date: closest?.data ?? today };
}

// Interpolação cosseno entre dois extremos de maré
export function tideAtMinute(min: number, tides: TideEvent[]): number {
  if (tides.length === 0) return 0;
  
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  
  const sorted = [...tides].sort((a, b) => toMin(a.hora) - toMin(b.hora));
  let prev = sorted[sorted.length - 1];
  let next = sorted[0];
  
  for (let i = 0; i < sorted.length; i++) {
    if (toMin(sorted[i].hora) <= min) prev = sorted[i];
    if (toMin(sorted[i].hora) > min) {
      next = sorted[i];
      break;
    }
  }
  
  const t0 = toMin(prev.hora);
  const t1 = toMin(next.hora);
  
  const span = t1 > t0 ? t1 - t0 : 1440 - (t0 - t1);
  const elapsed = min >= t0 ? min - t0 : 1440 - t0 + min;
  const frac = elapsed / span;
  const cos = (1 - Math.cos(frac * Math.PI)) / 2;
  
  return Math.max(0, prev.altura_m + (next.altura_m - prev.altura_m) * cos);
}

// Converte graus em direção (português correto)
export function degToCompass(d: number): string {
  const dirs = ['N','NNE','NE','ENE','L','LSE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  return dirs[Math.round(d / 22.5) % 16];
}

// Helper to get tide status (rising/falling)
export function getTideStatus(min: number, tides: TideEvent[]): { rising: boolean, next: TideEvent, prev: TideEvent } {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const sorted = [...tides].sort((a,b)=>toMin(a.hora)-toMin(b.hora));
  const next = sorted.find(t=>toMin(t.hora)>min) || sorted[0];
  const prev = sorted.filter(t=>toMin(t.hora)<=min).pop() || sorted[sorted.length-1];
  const rising = next.altura_m > prev.altura_m;
  return { rising, next, prev };
}
