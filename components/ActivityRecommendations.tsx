'use client';

import { TideEvent } from '@/lib/tideUtils';

interface ActivityRecommendationsProps {
  todayTides: TideEvent[];
  nextHigh: TideEvent | null;
  nextLow: TideEvent | null;
  waveHeight?: number;
}

export default function ActivityRecommendations({
  todayTides,
  nextHigh,
  nextLow,
  waveHeight = 0,
}: ActivityRecommendationsProps) {

  const getActivityRecommendation = () => {
    const recommendations = [];

    // 🏄 SURF
    if (waveHeight >= 0.8) {
      recommendations.push({
        emoji: '🏄',
        activity: 'SURF',
        icon: '⭐',
        time: 'Agora é bom!',
        tip: `Ondas em ${waveHeight.toFixed(1)}m - Espere maré média (entre alta e baixa)`,
        color: 'from-blue-500 to-blue-600',
      });
    } else {
      recommendations.push({
        emoji: '🏄',
        activity: 'SURF',
        icon: '⏳',
        time: nextHigh ? `Próximo em ${nextHigh.hora}` : 'Verificar depois',
        tip: 'Ondas baixas. Melhor com maré alta gerando movimento de água',
        color: 'from-blue-400 to-blue-500',
      });
    }

    // 🎣 PESCA
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    let bestFishTime = nextLow || nextHigh;
    if (nextLow && nextHigh) {
      const lowMin = parseInt(nextLow.hora.split(':')[0]) * 60 + parseInt(nextLow.hora.split(':')[1]);
      const highMin = parseInt(nextHigh.hora.split(':')[0]) * 60 + parseInt(nextHigh.hora.split(':')[1]);
      bestFishTime = Math.abs(lowMin - currentMin) < Math.abs(highMin - currentMin) ? nextLow : nextHigh;
    }

    recommendations.push({
      emoji: '🎣',
      activity: 'PESCA',
      icon: '✅',
      time: bestFishTime ? `Melhor em ${bestFishTime.hora}` : 'Verificar depois',
      tip: 'Melhores resultados na virada da maré quando o peixe se alimenta',
      color: 'from-orange-500 to-orange-600',
    });

    // 🤿 MERGULHO
    recommendations.push({
      emoji: '🤿',
      activity: 'MERGULHO',
      icon: '💧',
      time: nextHigh ? `Próximo em ${nextHigh.hora}` : 'Verificar depois',
      tip: `Maré alta ${nextHigh ? nextHigh.altura_m.toFixed(2) : '--'}m - Maior profundidade e visibilidade`,
      color: 'from-cyan-500 to-cyan-600',
    });

    // 🚣 CAIAQUE
    recommendations.push({
      emoji: '🚣',
      activity: 'CAIAQUE',
      icon: '🌊',
      time: 'Flexível',
      tip: 'Melhor evitar picos de maré alta/baixa. Maré média é ideal',
      color: 'from-emerald-500 to-emerald-600',
    });

    return recommendations;
  };

  const activities = getActivityRecommendation();

  return (
    <div className="classic-card">
      <h3 className="card-title mb-6">💡 Recomendações de Atividades — Hoje</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${activity.color} rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activity.emoji}</span>
                <div>
                  <h4 className="font-bold text-lg">{activity.activity}</h4>
                  <p className="text-xs opacity-90">{activity.time}</p>
                </div>
              </div>
              <span className="text-xl">{activity.icon}</span>
            </div>

            <p className="text-sm opacity-95 bg-white/10 px-3 py-2 rounded-lg">
              💬 {activity.tip}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>💡 Dica:</strong> Combine as recomendações com a previsão de vento e ondas para melhorar seu planejamento.
        </p>
      </div>
    </div>
  );
}
