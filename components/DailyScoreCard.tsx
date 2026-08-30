'use client';

import { useEffect, useState } from 'react';
import type { TideEvent } from '@/lib/tideUtils';
import { useT, type TDict } from '@/lib/tideI18n';

interface Props {
  lat: number;
  lon: number;
  todayTides: TideEvent[];
  utcOffsetMin?: number;
}

interface ActivityScore {
  name: string;
  emoji: string;
  score: number;
  label: string;
  color: string;
  reasons: string[];
}

interface MarineData {
  waveHeight: number;   // metros
  wavePeriod: number;   // segundos
  windSpeed: number;    // km/h
  windDir: number;      // graus
}

function getScoreLabel(score: number, s: TDict): string {
  if (score >= 9) return s.rating_excellent;
  if (score >= 7) return s.rating_great;
  if (score >= 5) return s.rating_good;
  if (score >= 3) return s.rating_fair;
  return s.rating_poor;
}

function getScoreColor(score: number): string {
  if (score >= 8) return '#10b981'; // green
  if (score >= 6) return '#3b82f6'; // blue
  if (score >= 4) return '#f59e0b'; // amber
  return '#ef4444';                 // red
}

/** Calcula a hora local no local consultado (não no navegador do usuário) */
function localNow(utcOffsetMin: number): { h: number; m: number; totalMin: number } {
  const utcMs = Date.now();
  const localMs = utcMs + utcOffsetMin * 60 * 1000;
  const d = new Date(localMs);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  return { h, m, totalMin: h * 60 + m };
}

function calcSolunarBonus(tides: TideEvent[], utcOffsetMin: number): number {
  const { totalMin: nowMin } = localNow(utcOffsetMin);
  // Major solunar period = 1h around high/low tides
  for (const t of tides) {
    const [h, m] = (t.hora || '00:00').split(':').map(Number);
    const tMin = (h || 0) * 60 + (m || 0);
    if (Math.abs(tMin - nowMin) <= 60) return 2;   // within 1h of major period
    if (Math.abs(tMin - nowMin) <= 120) return 1;  // within 2h (minor)
  }
  return 0;
}

function calcTidalRange(tides: TideEvent[]): number {
  if (!tides.length) return 0;
  const heights = tides.map(t => t.altura_m ?? 0);
  return Math.max(...heights) - Math.min(...heights);
}

function isTideRising(tides: TideEvent[], utcOffsetMin: number): boolean | null {
  const { totalMin: nowMin } = localNow(utcOffsetMin);
  const sorted = [...tides].sort((a, b) => {
    const [ah, am] = (a.hora || '0:0').split(':').map(Number);
    const [bh, bm] = (b.hora || '0:0').split(':').map(Number);
    return (ah * 60 + am) - (bh * 60 + bm);
  });
  for (let i = 0; i < sorted.length - 1; i++) {
    const [ah, am] = (sorted[i].hora || '0:0').split(':').map(Number);
    const [bh, bm] = (sorted[i + 1].hora || '0:0').split(':').map(Number);
    const aMin = ah * 60 + am;
    const bMin = bh * 60 + bm;
    if (nowMin >= aMin && nowMin <= bMin) {
      return (sorted[i + 1].altura_m ?? 0) > (sorted[i].altura_m ?? 0);
    }
  }
  return null;
}

function currentTideHeight(tides: TideEvent[], utcOffsetMin: number): number {
  const { totalMin: nowMin } = localNow(utcOffsetMin);
  const sorted = [...tides].sort((a, b) => {
    const [ah, am] = (a.hora || '0:0').split(':').map(Number);
    const [bh, bm] = (b.hora || '0:0').split(':').map(Number);
    return (ah * 60 + am) - (bh * 60 + bm);
  });
  for (let i = 0; i < sorted.length - 1; i++) {
    const [ah, am] = (sorted[i].hora || '0:0').split(':').map(Number);
    const [bh, bm] = (sorted[i + 1].hora || '0:0').split(':').map(Number);
    const aMin = ah * 60 + am;
    const bMin = bh * 60 + bm;
    if (nowMin >= aMin && nowMin <= bMin) {
      const ratio = (nowMin - aMin) / (bMin - aMin);
      return (sorted[i].altura_m ?? 0) + ratio * ((sorted[i + 1].altura_m ?? 0) - (sorted[i].altura_m ?? 0));
    }
  }
  return sorted[sorted.length - 1]?.altura_m ?? 0;
}

function computeScores(tides: TideEvent[], marine: MarineData | null, utcOffsetMin: number, s: TDict): ActivityScore[] {
  const range = calcTidalRange(tides);
  const rising = isTideRising(tides, utcOffsetMin);
  const curH = currentTideHeight(tides, utcOffsetMin);
  const solunar = calcSolunarBonus(tides, utcOffsetMin);

  const heights = tides.map(t => t.altura_m ?? 0);
  const maxH = Math.max(...heights) || 1;
  const minH = Math.min(...heights) || 0;
  const midH = (maxH + minH) / 2;

  const wave = marine?.waveHeight ?? 0;
  const wind = marine?.windSpeed ?? 0;
  const period = marine?.wavePeriod ?? 0;

  // ─── SURF ──────────────────────────────────────────────────────────
  let surfScore = 5;
  const surfReasons: string[] = [];

  // Wave height: ideal 0.8–2.0m
  if (wave >= 0.8 && wave <= 2.0) {
    surfScore += 2;
    surfReasons.push(s.r_wave_ideal(wave));
  } else if (wave > 2.0 && wave <= 3.0) {
    surfScore += 1;
    surfReasons.push(s.r_wave_big(wave));
  } else if (wave < 0.5) {
    surfScore -= 2;
    surfReasons.push(s.r_wave_tooCalm(wave));
  } else if (wave > 3.0) {
    surfScore -= 1;
    surfReasons.push(s.r_wave_choppy(wave));
  }

  // Wave period: >=10s is quality swell
  if (period >= 10) { surfScore += 1; surfReasons.push(s.r_period_long); }
  else if (period >= 7) { surfReasons.push(s.r_period_med); }
  else if (period > 0 && period < 6) { surfScore -= 1; surfReasons.push(s.r_period_short); }

  // Wind: <15km/h ideal, offshore better (can't know direction quality without coast bearing)
  if (wind < 15) { surfScore += 1; surfReasons.push(s.r_wind_light); }
  else if (wind > 30) { surfScore -= 2; surfReasons.push(s.r_wind_strong(Math.round(wind))); }
  else if (wind > 20) { surfScore -= 1; surfReasons.push(s.r_wind_moderate(Math.round(wind))); }

  // Tide: mid-tide is best for most breaks
  if (Math.abs(curH - midH) < (range * 0.25)) {
    surfScore += 1; surfReasons.push(s.r_midTide);
  }

  if (!marine) surfReasons.push(s.r_estimate_noWave);
  surfScore = Math.max(0, Math.min(10, surfScore));

  // ─── PESCA ─────────────────────────────────────────────────────────
  let pescaScore = 4;
  const pescaReasons: string[] = [];

  // Solunar bonus
  if (solunar === 2) { pescaScore += 3; pescaReasons.push(s.r_solunar_major); }
  else if (solunar === 1) { pescaScore += 1; pescaReasons.push(s.r_solunar_minor); }

  // Tidal range: larger = better for fishing
  if (range >= 1.5) { pescaScore += 2; pescaReasons.push(s.r_spring_tide(range)); }
  else if (range >= 0.8) { pescaScore += 1; pescaReasons.push(s.r_moderate_range(range)); }
  else { pescaScore -= 1; pescaReasons.push(s.r_neap_tide); }

  // Rising tide is generally better for fishing
  if (rising === true) { pescaScore += 1; pescaReasons.push(s.r_flooding); }

  // Wind: fishing is better with calm sea
  if (wind < 20) { pescaScore += 1; pescaReasons.push(s.r_wind_favorable); }
  else if (wind > 35) { pescaScore -= 2; pescaReasons.push(s.r_wind_strong_fish(Math.round(wind))); }

  // Wave height for fishing
  if (wave > 0 && wave < 1.0) { pescaScore += 1; pescaReasons.push(s.r_sea_good_fish); }
  else if (wave >= 2.0) { pescaScore -= 1; pescaReasons.push(s.r_sea_rough_fish(wave)); }

  if (!marine) pescaReasons.push(s.r_no_weather);
  pescaScore = Math.max(0, Math.min(10, pescaScore));

  // ─── PRAIA ─────────────────────────────────────────────────────────
  let praiaScore = 5;
  const praiaReasons: string[] = [];

  // Low tide = more beach
  if (curH <= minH + range * 0.3) {
    praiaScore += 2; praiaReasons.push(s.r_low_tide_moreSand);
  } else if (curH >= maxH - range * 0.3) {
    praiaScore -= 1; praiaReasons.push(s.r_high_tide_lessSand);
  }

  // Calm sea
  if (wave < 0.5) { praiaScore += 2; praiaReasons.push(s.r_calm_swim); }
  else if (wave < 1.0) { praiaScore += 1; praiaReasons.push(s.r_moderate_sea); }
  else if (wave >= 1.5) { praiaScore -= 1; praiaReasons.push(s.r_high_waves_beach(wave)); }

  // Wind
  if (wind < 20) { praiaScore += 1; praiaReasons.push(s.r_pleasant_wind); }
  else if (wind > 35) { praiaScore -= 2; praiaReasons.push(s.r_strong_wind_sand); }

  if (!marine) praiaReasons.push(s.r_estimate_noWeather);
  praiaScore = Math.max(0, Math.min(10, praiaScore));

  // ─── MERGULHO ──────────────────────────────────────────────────────
  let mergulhoScore = 5;
  const mergulhoReasons: string[] = [];

  // Slack tide (around high or low) = best visibility
  const { totalMin: nowMinMerg } = localNow(utcOffsetMin);
  const nearSlack = tides.some(t => {
    const [h2, m2] = (t.hora || '0:0').split(':').map(Number);
    const tMin = h2 * 60 + m2;
    return Math.abs(tMin - nowMinMerg) <= 45;
  });
  if (nearSlack) { mergulhoScore += 2; mergulhoReasons.push(s.r_nearSlack); }

  // Calm sea for diving
  if (wave < 0.5) { mergulhoScore += 2; mergulhoReasons.push(s.r_calm_diving); }
  else if (wave < 1.0) { mergulhoScore += 1; mergulhoReasons.push(s.r_acceptable); }
  else if (wave >= 1.5) { mergulhoScore -= 2; mergulhoReasons.push(s.r_strong_waves(wave)); }

  // Wind
  if (wind < 15) { mergulhoScore += 1; mergulhoReasons.push(s.r_calm_wind); }
  else if (wind > 25) { mergulhoScore -= 2; mergulhoReasons.push(s.r_wind_high_diving); }

  // Neap tide = clearer water generally
  if (range < 1.0) { mergulhoScore += 1; mergulhoReasons.push(s.r_neap_clear); }

  if (!marine) mergulhoReasons.push(s.r_estimate_noWeather);
  mergulhoScore = Math.max(0, Math.min(10, mergulhoScore));

  return [
    { name: s.surf, emoji: '🏄', score: surfScore, label: getScoreLabel(surfScore, s), color: getScoreColor(surfScore), reasons: surfReasons },
    { name: s.fishing, emoji: '🎣', score: pescaScore, label: getScoreLabel(pescaScore, s), color: getScoreColor(pescaScore), reasons: pescaReasons },
    { name: s.beach, emoji: '🏖️', score: praiaScore, label: getScoreLabel(praiaScore, s), color: getScoreColor(praiaScore), reasons: praiaReasons },
    { name: s.diving, emoji: '🤿', score: mergulhoScore, label: getScoreLabel(mergulhoScore, s), color: getScoreColor(mergulhoScore), reasons: mergulhoReasons },
  ] as ActivityScore[];
}

export default function DailyScoreCard({ lat, lon, todayTides, utcOffsetMin = 0 }: Props) {
  const { s } = useT();
  const [mounted, setMounted] = useState(false);
  const [marine, setMarine] = useState<MarineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    // Usar timezone=auto para a Open-Meteo detectar pelo lat/lon
    // e buscar o índice da hora LOCAL do lugar, não do navegador
    const marineUrl =
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
      `&hourly=wave_height,wave_period&forecast_days=1&timezone=auto`;
    const windUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=windspeed_10m,winddirection_10m&wind_speed_unit=kmh&forecast_days=1&timezone=auto`;

    Promise.all([
      fetch(marineUrl).then(r => r.json()).catch(() => null),
      fetch(windUrl).then(r => r.json()).catch(() => null),
    ]).then(([marineData, windData]) => {
      // Hora local do lugar (não do navegador)
      const { h: localH } = localNow(utcOffsetMin);
      const wh = marineData?.hourly?.wave_height?.[localH] ?? 0;
      const wp = marineData?.hourly?.wave_period?.[localH] ?? 0;
      const ws = windData?.hourly?.windspeed_10m?.[localH] ?? 0;
      const wd = windData?.hourly?.winddirection_10m?.[localH] ?? 0;
      setMarine({ waveHeight: wh, wavePeriod: wp, windSpeed: ws, windDir: wd });
    }).finally(() => setLoading(false));
  }, [lat, lon, utcOffsetMin]);

  if (!mounted) {
    return (
      <div className="rounded-[24px] overflow-hidden shadow-2xl p-6 bg-[#0d1b2e] border border-white/5 animate-pulse min-h-[260px] flex items-center justify-center">
        <div className="text-slate-500 font-syne text-xs uppercase tracking-widest">{s.loadingScore}</div>
      </div>
    );
  }

  const scores = computeScores(todayTides, loading ? null : marine, utcOffsetMin, s);
  const overall = Math.round(scores.reduce((s, a) => s + a.score, 0) / scores.length);

  return (
    <section
      className="rounded-[24px] overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #0d1b2e 0%, #0a2440 50%, #0d1b2e 100%)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center justify-between border-b border-white/10"
        style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 100%)' }}
      >
        <div>
          <h2 className="text-white font-syne font-bold text-xl flex items-center gap-2">
            <span>📊</span> {s.dayScore}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">{s.scoreSubtitle}</p>
        </div>

        {/* Overall Score */}
        <div className="flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg font-tideMono"
            style={{
              background: `conic-gradient(${getScoreColor(overall)} ${overall * 36}deg, rgba(255,255,255,0.1) 0deg)`,
              boxShadow: `0 0 20px ${getScoreColor(overall)}44`,
            }}
          >
            {loading ? '…' : overall}
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
            {loading ? '' : getScoreLabel(overall, s)}
          </span>
        </div>
      </div>

      {/* Scores Grid */}
      <div className="p-5 grid grid-cols-2 gap-3">
        {scores.map((activity, idx) => (
          <button
            key={activity.name}
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            className="rounded-2xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: expanded === idx
                ? `linear-gradient(135deg, ${activity.color}22, ${activity.color}11)`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${expanded === idx ? activity.color + '44' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activity.emoji}</span>
                <span className="text-white text-sm font-semibold">{activity.name}</span>
              </div>
              <span
                className="text-sm font-black font-tideMono"
                style={{ color: activity.color }}
              >
                {loading ? '…' : activity.score}/10
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: loading ? '0%' : `${activity.score * 10}%`,
                  background: `linear-gradient(90deg, ${activity.color}, ${activity.color}bb)`,
                  boxShadow: `0 0 8px ${activity.color}66`,
                }}
              />
            </div>

            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: activity.color }}
            >
              {loading ? s.calculating : activity.label}
            </span>

            {/* Expanded reasons */}
            {expanded === idx && !loading && (
              <ul className="mt-3 space-y-1">
                {activity.reasons.map((r, i) => (
                  <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1">
                    <span className="text-slate-500 mt-0.5">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-5 pb-4 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest">
          {s.footerHint}
        </p>
      </div>
    </section>
  );
}
