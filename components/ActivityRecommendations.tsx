'use client';

import { useState, useEffect } from 'react';
import { TideEvent } from '@/lib/tideUtils';

interface ActivityRecommendationsProps {
  todayTides: TideEvent[];
  nextHigh: TideEvent | null;
  nextLow: TideEvent | null;
  waveHeight?: number;
  loading: boolean;
  slug: string;
  categoria: string;
}

const FALLBACK_DATA: Record<string, any[]> = {
  'porto-de-santos': [
    { icon: '🎣', name: 'Pesca', tip: 'Melhor na virada da maré. Peixes concentram-se no estuário.', rating: 'Ótimo', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '🏊', name: 'Banho', tip: 'Prefira maré baixa a moderada para praias seguras.', rating: 'Bom', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '⛵', name: 'Passeio de barco', tip: 'Verifique sempre a maré e o boletim náutico da Marinha.', rating: 'Moderado', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' },
    { icon: '🚶', name: 'Caminhada na orla', tip: 'Qualquer maré. Evite apenas maré alta durante ressacas.', rating: 'Bom', color: 'text-slate-400 bg-white/5 border-white/10' }
  ],
  'industrial': [
    { icon: '🚢', name: 'Navegação local', tip: 'Cuidado com correntes intensas na troca de marés.', rating: 'Atenção', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' },
    { icon: '🎣', name: 'Pesca', tip: 'Sempre melhor próxima da virada de maré.', rating: 'Bom', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '⛵', name: 'Vela / Barco', tip: 'Planeje travessias para coincidir com corrente a favor.', rating: 'Moderado', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' },
  ],
  'pesca': [
    { icon: '🎣', name: 'Pesca de fundo', tip: 'Maré baixa facilita chegar aos pontos mais profundos.', rating: 'Ótimo', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '🦀', name: 'Coleta / Marisco', tip: 'Aproveite o período de maré mais baixa do dia.', rating: 'Excelente', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '🚣', name: 'Barco miúdo', tip: 'Evite navegar em preamares de sizígia se houver ressacas.', rating: 'Verificar', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' }
  ],
  'surf': [
    { icon: '🏄', name: 'Surf', tip: 'As melhores ondas costumam alinhar durante a maré vazante.', rating: 'Ótimo', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '🏊', name: 'Banho', tip: 'Atenção com correntes de retorno em marés vazantes.', rating: 'Atenção', color: 'text-orange-400 bg-orange-950/30 border-orange-800/50' },
    { icon: '🏖️', name: 'Caminhada', tip: 'Na maré baixa a faixa de areia fica excelente.', rating: 'Livre', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' }
  ],
  'turismo': [
    { icon: '🏊', name: 'Banho de Mar', tip: 'Na maré baixa as águas costumam ficar mais calmas.', rating: 'Ótimo', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '📸', name: 'Piscinas Naturais', tip: 'Acesse apenas nas 2 horas próximas da maré mais baixa.', rating: 'Excelente', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
    { icon: '⛵', name: 'Passeios Náuticos', tip: 'Consulte o marinheiro responsável sobre as condições.', rating: 'Bom', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50' },
  ]
};

function getActivities(nextHigh: TideEvent | null, nextLow: TideEvent | null, waveHeight?: number) {
  const activities = [];

  if (nextLow) {
    activities.push({
      icon: '🎣',
      name: 'Pesca',
      tip: `Melhor na virada da maré baixa às ${nextLow.hora}. Peixes se concentram nos canais expostos.`,
      rating: 'Ótimo',
      color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50',
    });
  }

  if (waveHeight !== undefined && waveHeight !== null) {
    if (waveHeight >= 1.0 && waveHeight <= 2.5) {
      activities.push({
        icon: '🏄',
        name: 'Surf',
        tip: `Ondas de ${waveHeight.toFixed(1)}m. ${nextLow ? `Maré baixa às ${nextLow.hora} para melhores tubos.` : 'Confira a maré baixa.'}`,
        rating: waveHeight >= 1.5 ? 'Ótimo' : 'Bom',
        color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50',
      });
    } else if (waveHeight < 1.0) {
      activities.push({
        icon: '🏄',
        name: 'Surf',
        tip: `Ondas fracas (${waveHeight.toFixed(1)}m). Condições ruins para surf hoje.`,
        rating: 'Fraco',
        color: 'text-orange-400 bg-orange-950/30 border-orange-800/50',
      });
    }
  } else {
    activities.push({
      icon: '🏄',
      name: 'Surf',
      tip: `Verifique as condições do mar local. ${nextLow ? `Maré baixa às ${nextLow.hora}.` : ''}`,
      rating: 'Verificar',
      color: 'text-slate-400 bg-white/5 border-white/10',
    });
  }

  if (nextHigh) {
    activities.push({
      icon: '🤿',
      name: 'Mergulho',
      tip: `Melhor visibilidade na maré alta às ${nextHigh.hora} (${nextHigh.altura_m.toFixed(2)}m).`,
      rating: 'Bom',
      color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/50',
    });
  }

  activities.push({
    icon: '🚣',
    name: 'Caiaque',
    tip: nextLow
      ? `Evite canais rasos na baixamar (${nextLow.hora}). Prefira remar na maré cheia.`
      : 'Verifique a tábua antes de entrar em canais rasos.',
    rating: 'Moderado',
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
  
  const activities = isFallbackNeeded 
    ? (FALLBACK_DATA[slug] || FALLBACK_DATA[categoria] || FALLBACK_DATA['turismo'])
    : getActivities(nextHigh, nextLow, waveHeight ?? undefined);

  return (
    <section className="bg-[#0d1526] text-white rounded-3xl p-6 shadow-xl border border-white/5">
      <h2 className="text-2xl font-bold mb-6 font-syne text-cyan-400 flex items-center gap-2">
        <span>🏖️</span> Atividades Recomendadas
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {loading && !showFallback && (waveHeight === undefined || waveHeight === null) ? (
          <div className="col-span-full py-12 text-center text-slate-500 animate-pulse font-syne tracking-widest uppercase text-xs">
            Analisando condições...
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.name} className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
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
