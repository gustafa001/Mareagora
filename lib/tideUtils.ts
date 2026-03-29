export type TideEvent = { hora: string; altura_m: number; tipo?: string };
export type TideDay = { data: string; mares: TideEvent[] };

// Retorna os eventos de maré da data mais próxima do dia atual a partir do JSON do porto
export function getTodayTides(portData: { eventos: TideDay[] } | null): { tides: TideEvent[], date: string } {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  
  if (!portData || !portData.eventos) {
    return { tides: [], date: today };
  }

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
  if (!tides || tides.length === 0) return 0;
  if (tides.length === 1) return tides[0].altura_m;
  
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };
  
  const sorted = [...tides].sort((a, b) => toMin(a.hora) - toMin(b.hora));
  let prev = sorted[sorted.length - 1];
  let next = sorted[0];
  
  for (let i = 0; i < sorted.length; i++) {
    const tMin = toMin(sorted[i].hora);
    if (tMin <= min) {
      prev = sorted[i];
    }
    if (tMin > min) {
      next = sorted[i];
      break;
    }
  }
  
  const t0 = toMin(prev.hora);
  const t1 = toMin(next.hora);
  
  const span = t1 > t0 ? t1 - t0 : 1440 - (t0 - t1);
  const elapsed = min >= t0 ? min - t0 : 1440 - t0 + min;
  const frac = elapsed / (span || 1);
  const cos = (1 - Math.cos(frac * Math.PI)) / 2;
  
  return Math.max(0, (prev.altura_m || 0) + ((next.altura_m || 0) - (prev.altura_m || 0)) * cos);
}

// Converte graus em direção (português correto)
export function degToCompass(d: number): string {
  const dirs = ['N','NNE','NE','ENE','L','LSE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  return dirs[Math.round(d / 22.5) % 16];
}

export function getTideStatus(min: number, tides: TideEvent[]): { rising: boolean, next: TideEvent | null, prev: TideEvent | null } {
  if (!tides || tides.length === 0) {
    return { rising: false, next: null, prev: null };
  }
  
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };
  
  const sorted = [...tides].sort((a,b)=>toMin(a.hora)-toMin(b.hora));
  
  const next = sorted.find(t=>toMin(t.hora)>min) || sorted[0];
  const prevIndex = sorted.findIndex(t => t === next) - 1;
  const prev = prevIndex >= 0 ? sorted[prevIndex] : sorted[sorted.length - 1];
  
  if (!next || !prev) return { rising: false, next: null, prev: null };
  
  const rising = (next.altura_m || 0) > (prev.altura_m || 0);
  return { rising, next, prev };
}
