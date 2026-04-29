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
    { icon: '🎣', name: 'Pesca', tip: 'Melhor na virada da maré. Peixes concentram-se no estuário.', rating: 'Ótimo', color: 'text-green-600 bg-green-50' },
    { icon: '🏊', name: 'Banho', tip: 'Prefira maré baixa a moderada para praias seguras.', rating: 'Bom', color: 'text-blue-600 bg-blue-50' },
    { icon: '⛵', name: 'Passeio de barco', tip: 'Verifique sempre a maré e o boletim náutico da Marinha.', rating: 'Moderado', color: 'text-yellow-600 bg-yellow-50' },
    { icon: '🚶', name: 'Caminhada na orla', tip: 'Qualquer maré. Evite apenas maré alta durante ressacas.', rating: 'Bom', color: 'text-gray-600 bg-gray-50' }
  ],
  'industrial': [
    { icon: '🚢', name: 'Navegação local', tip: 'Cuidado com correntes intensas na troca de marés.', rating: 'Atenção', color: 'text-orange-600 bg-orange-50' },
    { icon: '🎣', name: 'Pesca', tip: 'Sempre melhor próxima da virada de maré.', rating: 'Bom', color: 'text-blue-600 bg-blue-50' },
    { icon: '⛵', name: 'Vela / Barco', tip: 'Planeje travessias para coincidir com corrente a favor.', rating: 'Moderado', color: 'text-yellow-600 bg-yellow-50' },
  ],
  'pesca': [
    { icon: '🎣', name: 'Pesca de fundo', tip: 'Maré baixa facilita chegar aos pontos mais profundos.', rating: 'Ótimo', color: 'text-green-600 bg-green-50' },
    { icon: '🦀', name: 'Coleta / Marisco', tip: 'Aproveite o período de maré mais baixa do dia.', rating: 'Excelente', color: 'text-green-600 bg-green-50' },
    { icon: '🚣', name: 'Barco miúdo', tip: 'Evite navegar em preamares de sizígia se houver ressacas.', rating: 'Verificar', color: 'text-yellow-600 bg-yellow-50' }
  ],
  'surf': [
    { icon: '🏄', name: 'Surf', tip: 'As melhores ondas costumam alinhar durante a maré vazante.', rating: 'Ótimo', color: 'text-blue-600 bg-blue-50' },
    { icon: '🏊', name: 'Banho', tip: 'Atenção com correntes de retorno em marés vazantes.', rating: 'Atenção', color: 'text-orange-600 bg-orange-50' },
    { icon: '🏖️', name: 'Caminhada', tip: 'Na maré baixa a faixa de areia fica excelente.', rating: 'Livre', color: 'text-green-600 bg-green-50' }
  ],
  'turismo': [
    { icon: '🏊', name: 'Banho de Mar', tip: 'Na maré baixa as águas costumam ficar mais calmas.', rating: 'Ótimo', color: 'text-blue-600 bg-blue-50' },
    { icon: '📸', name: 'Piscinas Naturais', tip: 'Acesse apenas nas 2 horas próximas da maré mais baixa.', rating: 'Excelente', color: 'text-green-600 bg-green-50' },
    { icon: '⛵', name: 'Passeios Náuticos', tip: 'Consulte o marinheiro responsável sobre as condições.', rating: 'Bom', color: 'text-blue-600 bg-blue-50' },
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
      color: 'text-green-600 bg-green-50',
    });
  }

  if (waveHeight !== undefined && waveHeight !== null) {
    if (waveHeight >= 1.0 && waveHeight <= 2.5) {
      activities.push({
        icon: '🏄',
        name: 'Surf',
        tip: `Ondas de ${waveHeight.toFixed(1)}m. ${nextLow ? `Maré baixa às ${nextLow.hora} para melhores tubos.` : 'Confira a maré baixa.'}`,
        rating: waveHeight >= 1.5 ? 'Ótimo' : 'Bom',
        color: waveHeight >= 1.5 ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50',
      });
    } else if (waveHeight < 1.0) {
      activities.push({
        icon: '🏄',
        name: 'Surf',
        tip: `Ondas fracas (${waveHeight.toFixed(1)}m). Condições ruins para surf hoje.`,
        rating: 'Fraco',
        color: 'text-orange-600 bg-orange-50',
      });
    }
  } else {
    activities.push({
      icon: '🏄',
      name: 'Surf',
      tip: `Verifique as condições do mar local. ${nextLow ? `Maré baixa às ${nextLow.hora}.` : ''}`,
      rating: 'Verificar',
      color: 'text-gray-600 bg-gray-50',
    });
  }

  if (nextHigh) {
    activities.push({
      icon: '🤿',
      name: 'Mergulho',
      tip: `Melhor visibilidade na maré alta às ${nextHigh.hora} (${nextHigh.altura_m.toFixed(2)}m).`,
      rating: 'Bom',
      color: 'text-blue-600 bg-blue-50',
    });
  }

  activities.push({
    icon: '🚣',
    name: 'Caiaque',
    tip: nextLow
      ? `Evite canais rasos na baixamar (${nextLow.hora}). Prefira remar na maré cheia.`
      : 'Verifique a tábua antes de entrar em canais rasos.',
    rating: 'Moderado',
    color: 'text-yellow-600 bg-yellow-50',
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
    <section className="classic-card">
      <h2 className="card-title">🏖️ Atividades Recomendadas</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {loading && !showFallback && waveHeight === undefined ? (
          <div className="col-span-full py-8 text-center text-gray-400 animate-pulse font-syne">
            Carregando recomendações...
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.name} className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-800 text-sm">{activity.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activity.color}`}>
                    {activity.rating}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{activity.tip}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
