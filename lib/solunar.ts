/**
 * MareAgora — Motor Solunar
 * Calcula nascer/poente/culminação real da lua via astronomy-engine (VSOP87 + NOVAS,
 * precisão de ±1 arco-minuto — mesma família de modelo usada por observatórios) e
 * deriva os períodos maiores/menores da Teoria Solunar (John Alden Knight), cruzando
 * com os dados de maré do porto.
 */

import * as Astronomy from 'astronomy-engine';

const LUNAR_MONTH = 29.530588853;

export interface EventosLua {
  nascer: Date | null;
  poente: Date | null;
  culminacao: Date | null;     // lua "a pino" (período maior)
  antiCulminacao: Date | null; // lua "no fundo" (período maior, oposto)
}

/**
 * Busca nascer, poente, culminação e anti-culminação reais da lua a partir de um
 * instante local (normalmente 00:00 do dia desejado, já ajustado ao fuso do porto).
 * A busca avança até ~1 dia lunar (24h50) a partir de `inicioDoDiaLocal`.
 */
export function getEventosLua(inicioDoDiaLocal: Date, lat: number, lon: number): EventosLua {
  const observer = new Astronomy.Observer(lat, lon, 0);
  const limiteDias = 1.05; // cobre um dia lunar completo (~24h50)

  const nascer = Astronomy.SearchRiseSet(
    Astronomy.Body.Moon, observer, 1, inicioDoDiaLocal, limiteDias
  );
  const poente = Astronomy.SearchRiseSet(
    Astronomy.Body.Moon, observer, -1, inicioDoDiaLocal, limiteDias
  );
  const culminacaoEvento = Astronomy.SearchHourAngle(
    Astronomy.Body.Moon, observer, 0, inicioDoDiaLocal
  );
  const antiCulminacaoEvento = Astronomy.SearchHourAngle(
    Astronomy.Body.Moon, observer, 12, inicioDoDiaLocal
  );

  return {
    nascer: nascer ? nascer.date : null,
    poente: poente ? poente.date : null,
    culminacao: culminacaoEvento ? culminacaoEvento.time.date : null,
    antiCulminacao: antiCulminacaoEvento ? antiCulminacaoEvento.time.date : null,
  };
}

export interface PeriodoSolunar {
  tipo: 'maior' | 'menor';
  inicio: Date;
  fim: Date;
  centro: Date;
}

/** Períodos maiores (2h, centrados na culminação/anti-culminação) e menores (1h, no nascer/poente) */
export function getPeriodosSolunares(
  inicioDoDiaLocal: Date,
  lat: number,
  lon: number
): PeriodoSolunar[] {
  const { nascer, poente, culminacao, antiCulminacao } = getEventosLua(inicioDoDiaLocal, lat, lon);
  const periodos: PeriodoSolunar[] = [];

  const add = (centro: Date | null, tipo: 'maior' | 'menor', duracaoMin: number) => {
    if (!centro) return;
    periodos.push({
      tipo,
      centro,
      inicio: new Date(centro.getTime() - (duracaoMin / 2) * 60000),
      fim: new Date(centro.getTime() + (duracaoMin / 2) * 60000),
    });
  };

  add(culminacao, 'maior', 120);
  add(antiCulminacao, 'maior', 120);
  add(nascer, 'menor', 60);
  add(poente, 'menor', 60);

  return periodos.sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
}

/** Idade da lua (0 a 29.53), calculada a partir da longitude eclíptica real Sol–Lua */
export function getIdadeLua(date: Date): number {
  const elongacao = Astronomy.MoonPhase(date); // 0..360 graus (0 = nova, 180 = cheia)
  return (elongacao / 360) * LUNAR_MONTH;
}

interface MareEventoSimples {
  hora: string;
  altura_m: number;
  tipo?: 'high' | 'low';
}

export interface AvaliacaoSolunar {
  estrelas: number; // 1 a 5
  destaque: boolean; // período maior coincide com maré cheia
}

/**
 * Avalia a qualidade do dia (1–5 estrelas): mais forte perto de lua nova/cheia,
 * mais fraca nos quartos. Ganha +1 estrela se algum período maior coincidir
 * (±45 min) com uma maré alta do porto — cruza dado astronômico com dado de maré real.
 */
export function getAvaliacaoSolunar(
  moonAge: number,
  periodos: PeriodoSolunar[],
  mares: MareEventoSimples[],
  /**
   * Offset UTC do fuso local dos horários de maré (em minutos).
   * Default: -180 (BRT = America/Sao_Paulo).
   * Necessário para converter `p.centro` (Date UTC) para o mesmo
   * referencial dos strings `hora` das marés, evitando divergência
   * entre o servidor (UTC) e o cliente (BRT) nos erros #418/#423.
   */
  offsetMinutes = -180
): AvaliacaoSolunar {
  const distExtremo = Math.min(
    moonAge,
    Math.abs(moonAge - LUNAR_MONTH / 2),
    LUNAR_MONTH - moonAge
  );
  const fase = Math.min(1, distExtremo / (LUNAR_MONTH / 4));
  let estrelas = Math.round(5 - fase * 3);

  const altas = mares.filter(m => m.tipo === 'high');
  const destaque = periodos.some(p => {
    if (p.tipo !== 'maior') return false;
    // Usa getUTCHours/UTCMinutes + offset explícito para ser idêntico em
    // qualquer timezone de servidor ou cliente.
    const centroUtcMin = p.centro.getUTCHours() * 60 + p.centro.getUTCMinutes();
    const centroLocalMin = ((centroUtcMin + offsetMinutes) % 1440 + 1440) % 1440;
    return altas.some(alta => {
      const [h, m] = alta.hora.split(':').map(Number);
      const altaMin = (h || 0) * 60 + (m || 0);
      return Math.abs(altaMin - centroLocalMin) <= 45;
    });
  });

  if (destaque) estrelas = Math.min(5, estrelas + 1);

  return { estrelas: Math.max(1, Math.min(5, estrelas)), destaque };
}

/** Constrói o Date de 00:00 local a partir de "YYYY-MM-DD" e um offset fixo em minutos (padrão BRT -180) */
export function inicioDiaLocal(dataStr: string, offsetMinutes = -180): Date {
  const sinal = offsetMinutes <= 0 ? '-' : '+';
  const abs = Math.abs(offsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return new Date(`${dataStr}T00:00:00${sinal}${hh}:${mm}`);
}
