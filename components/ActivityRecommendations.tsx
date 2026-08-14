'use client';

import { useState, useEffect } from 'react';
import { TideEvent } from '@/lib/tideUtils';
import { useT, type TDict } from '@/lib/tideI18n';

interface ActivityRecommendationsProps {
  todayTides: TideEvent[];
  nextHigh: TideEvent | null;
  nextLow: TideEvent | null;
  waveHeight?: number;
  loading: boolean;
  slug: string;
  categoria: string;
}

interface ActivityDef {
  icon: string;
  name: keyof TDict;
  tip: keyof TDict | ((s: TDict) => string);
  rating: keyof TDict;
  color: string;
}

function resolve(s: TDict, a: ActivityDef) {
  return {
    icon: a.icon,
    name: s[a.name] as string,
    tip: typeof a.tip === 'function' ? a.tip(s) : (s[a.tip] as string),
    rating: s[a.rating] as string,
    color: a.color,
  };
}

const FALLBACK_DATA: Record<string, ActivityDef[]> = {
  'porto-de-santos': [
    { icon: '🎣', name: 'fishing', tip: 'tip_fall_turn', rating: 'rating_optimal', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '🏊', name: 'seaSwim', tip: 'tip_swim_low', rating: 'rating_good2', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '⛵', name: 'boatTour', tip: 'tip_boat_marinha', rating: 'rating_moderate', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' },
    { icon: '🚶', name: 'walk', tip: 'tip_walk_any', rating: 'rating_good2', color: 'text-slate-400 bg-white/5 border-white/10' }
  ],
  'industrial': [
    { icon: '🚢', name: 'localNav', tip: 'tip_nav_currents', rating: 'rating_attention', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' },
    { icon: '🎣', name: 'fishing', tip: 'tip_fish_turn', rating: 'rating_good2', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '⛵', name: 'sailing', tip: 'tip_sail_current', rating: 'rating_moderate', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' },
  ],
  'pesca': [
    { icon: '🎣', name: 'bottomFishing', tip: 'tip_bottom', rating: 'rating_optimal', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '🦀', name: 'shellfish', tip: 'tip_shellfish', rating: 'rating_excellent2', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '🚣', name: 'smallBoat', tip: 'tip_smallboat', rating: 'rating_check', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' }
  ],
  'surf': [
    { icon: '🏄', name: 'surf', tip: 'tip_surf_ebb', rating: 'rating_optimal', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '🏊', name: 'seaSwim', tip: 'tip_swim_return', rating: 'rating_attention', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' },
    { icon: '🏖️', name: 'walk', tip: 'tip_walk_lowtide', rating: 'rating_free', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' }
  ],
  'turismo': [
    { icon: '🏊', name: 'seaSwim', tip: 'tip_swim_calm', rating: 'rating_optimal', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '📸', name: 'naturalPools', tip: 'tip_pools', rating: 'rating_excellent2', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '⛵', name: 'nauticalTours', tip: 'tip_nautical', rating: 'rating_good2', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
  ]
};

function getActivities(s: TDict, nextHigh: TideEvent | null, nextLow: TideEvent | null, waveHeight?: number): ActivityDef[] {
  const activities: ActivityDef[] = [];

  if (nextLow) {
    activities.push({
      icon: '🎣',
      name: 'fishing',
      tip: (s) => s.tip_fishing_low(nextLow!.hora),
      rating: 'rating_optimal',
      color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50',
    });
  }

  if (waveHeight !== undefined && waveHeight !== null) {
    if (waveHeight >= 1.0 && waveHeight <= 2.5) {
      activities.push({
        icon: '🏄',
        name: 'surf',
        tip: (s) => s.tip_surf(waveHeight, nextLow ? nextLow.hora : ''),
        rating: waveHeight >= 1.5 ? 'rating_optimal' : 'rating_good2',
        color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50',
      });
    } else if (waveHeight < 1.0) {
      activities.push({
        icon: '🏄',
        name: 'surf',
        tip: (s) => s.tip_surf_weak(waveHeight),
        rating: 'rating_weak',
        color: 'text-orange-400 bg-orange-950/30 border-orange-800/50',
      });
    }
  } else {
    activities.push({
      icon: '🏄',
      name: 'surf',
      tip: (s) => s.tip_surf_check(nextLow ? nextLow.hora : ''),
      rating: 'rating_check',
      color: 'text-slate-400 bg-white/5 border-white/10',
    });
  }

  if (nextHigh) {
    activities.push({
      icon: '🤿',
      name: 'diving',
      tip: (s) => s.tip_diving(nextHigh!.hora, nextHigh!.altura_m),
      rating: 'rating_good2',
      color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50',
    });
  }

  activities.push({
    icon: '🚣',
    name: 'kayak',
    tip: nextLow
      ? (s) => s.tip_kayak(nextLow!.hora)
      : (s) => s.tip_kayak_noLow,
    rating: 'rating_moderate',
    color: 'text-orange-400 bg-orange-950/30 border-orange-800/50',
  });

  return activities;
}

export default function ActivityRecommendations({
  todayTides,
  nextHigh,
  nextLow,
  waveHeight,
  loading,
  slug,
  categoria,
}: ActivityRecommendationsProps) {
  const { s } = useT();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        console.error('[AtividadesRecomendadas] Timeout de 4s excedido: ativando fallback.');
        setShowFallback(true);
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  const isFallbackNeeded = showFallback || (!loading && (waveHeight === undefined || waveHeight === null));

  const resolved = isFallbackNeeded
    ? (FALLBACK_DATA[slug] || FALLBACK_DATA[categoria] || FALLBACK_DATA['turismo']).map((a) => resolve(s, a))
    : getActivities(s, nextHigh, nextLow, waveHeight ?? undefined).map((a) => resolve(s, a));

  return (
    <section className="bg-[#0d1526] text-white rounded-3xl p-6 shadow-xl border border-white/5">
      <h2 className="text-2xl font-bold mb-6 font-syne text-cyan-400 flex items-center gap-2">
        <span>🏖️</span> {s.recommendedActivities}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {loading && !showFallback && (waveHeight === undefined || waveHeight === null) ? (
          <div className="col-span-full py-12 text-center text-slate-500 animate-pulse font-syne tracking-widest uppercase text-xs">
            {s.analyzing}
          </div>
        ) : (
          resolved.map((activity) => (
            <div key={activity.name + activity.tip} className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{activity.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-100 text-sm tracking-tight">{activity.name}</span>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-tighter ${activity.color}`}>
                    {activity.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{activity.tip}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}