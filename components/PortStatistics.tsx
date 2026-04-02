'use client';

import { TideEvent, getMoonAge, getTideCoefficient } from '@/lib/tideUtils';

interface PortStatisticsProps {
  eventos: any[];
  portName: string;
  currentMonth?: number;
}

export default function PortStatistics({ eventos, portName, currentMonth }: PortStatisticsProps) {
  // Calcular estatísticas gerais do mês
  const allHeights = eventos.flatMap((e: any) => e.mares?.map((m: TideEvent) => m.altura_m) || []);

  const maxHeight = allHeights.length > 0 ? Math.max(...allHeights) : 0;
  const minHeight = allHeights.length > 0 ? Math.min(...allHeights) : 0;
  const amplitude = maxHeight - minHeight;
  const avgHeight = allHeights.length > 0 ? allHeights.reduce((a: number, b: number) => a + b, 0) / allHeights.length : 0;

  // Contar marés altas e baixas
  const allEvents = eventos.flatMap((e: any) => e.mares || []);
  const highTides = allEvents.filter((e: TideEvent) => e.tipo === 'high').length;
  const lowTides = allEvents.filter((e: TideEvent) => e.tipo === 'low').length;

  // Calcular coeficiente real via getMoonAge + getTideCoefficient
  const allCoeffs = eventos
    .filter((e: any) => e.data)
    .map((e: any) => {
      const date = new Date(e.data);
      const moonAge = getMoonAge(date);
      return getTideCoefficient(date, moonAge);
    });

  const maxCoeff = allCoeffs.length > 0 ? Math.max(...allCoeffs) : 0;
  const minCoeff = allCoeffs.length > 0 ? Math.min(...allCoeffs) : 0;

  return (
    <div className="classic-card">
      <h3 className="card-title mb-6">📊 Estatísticas de Marés — {portName}</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Amplitude */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-700 font-semibold mb-2">Amplitude Média</div>
          <div className="text-2xl font-bold text-blue-900">{amplitude.toFixed(2)} m</div>
          <div className="text-xs text-blue-600 mt-1">Diferença alta/baixa</div>
        </div>

        {/* Maré Máxima */}
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
          <div className="text-sm text-cyan-700 font-semibold mb-2">Maré Máxima</div>
          <div className="text-2xl font-bold text-cyan-900">{maxHeight.toFixed(2)} m</div>
          <div className="text-xs text-cyan-600 mt-1">Nível recorde</div>
        </div>

        {/* Maré Mínima */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="text-sm text-orange-700 font-semibold mb-2">Maré Mínima</div>
          <div className="text-2xl font-bold text-orange-900">{minHeight.toFixed(2)} m</div>
          <div className="text-xs text-orange-600 mt-1">Nível mínimo</div>
        </div>

        {/* Nível Médio */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-700 font-semibold mb-2">Nível Médio</div>
          <div className="text-2xl font-bold text-green-900">{avgHeight.toFixed(2)} m</div>
          <div className="text-xs text-green-600 mt-1">Média geral</div>
        </div>

        {/* Coeficiente Máximo */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-700 font-semibold mb-2">Maior Coef.</div>
          <div className="text-2xl font-bold text-purple-900">{maxCoeff}</div>
          <div className="text-xs text-purple-600 mt-1">Amplitude máxima</div>
        </div>

        {/* Coeficiente Mínimo */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
          <div className="text-sm text-pink-700 font-semibold mb-2">Menor Coef.</div>
          <div className="text-2xl font-bold text-pink-900">{minCoeff}</div>
          <div className="text-xs text-pink-600 mt-1">Amplitude mínima</div>
        </div>
      </div>

      {/* Resumo */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600 font-semibold">Total de Marés Altas</div>
            <div className="text-xl font-bold text-blue-600 mt-1">{highTides}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 font-semibold">Total de Marés Baixas</div>
            <div className="text-xl font-bold text-orange-600 mt-1">{lowTides}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 font-semibold">Variação Mensal</div>
            <div className="text-xl font-bold text-green-600 mt-1">{(amplitude * 30).toFixed(0)} m</div>
          </div>
        </div>
      </div>
    </div>
  );
}
