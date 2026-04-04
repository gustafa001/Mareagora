'use client';

import { TideEvent } from '@/lib/tideUtils';

interface ActivityRecommendationsProps {
  todayTides: TideEvent[];
  nextHigh: TideEvent | null;
  nextLow: TideEvent | null;
  waveHeight?: number;
}

function getActivities(nextHigh: TideEvent | null, nextLow: TideEvent | null, waveHeight: number) {
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
  waveHeight = 1.0,
}: ActivityRecommendationsProps) {
  const activities = getActivities(nextHigh, nextLow, waveHeight);

  return (
    <section className="classic-card">
      <h2 className="card-title">🏖️ Atividades Recomendadas</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <div key={activity.name} className="flex gap-3 p-3 rounded-xl border border-gray-100">
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
        ))}
      </div>
    </section>
  );
}

