'use client';

import { useMemo } from 'react';

interface TideEvent {
  hora: string;
  altura_m: number;
}

interface DayEvent {
  data: string;
  mares: TideEvent[];
}

interface PortData {
  eventos: DayEvent[];
  nivel_medio?: number;
}

interface TideTable30DaysProps {
  portData: PortData | null;
}

const TideTable30Days: React.FC<TideTable30DaysProps> = ({ portData }) => {
  const last30Days = useMemo(() => {
    if (!portData?.eventos) return [];

    // Pega os últimos 30 eventos (dias)
    return portData.eventos.slice(-30).map(event => {
      const date = new Date(event.data);
      const dayOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][date.getDay()];
      const dayNum = date.getDate();

      return {
        data: event.data,
        dayOfWeek,
        dayNum,
        mares: event.mares.slice(0, 4), // Garante apenas 4 marés por dia
      };
    });
  }, [portData]);

  if (!last30Days || last30Days.length === 0) {
    return null;
  }

  const getTideType = (index: number) => {
    // Alterna entre preamar (alta) e baixamar (baixa)
    return index % 2 === 0 ? 'preamar' : 'baixamar';
  };

  const getTideColor = (index: number) => {
    return index % 2 === 0 
      ? 'text-blue-500' // Preamar - Azul
      : 'text-orange-500'; // Baixamar - Laranja
  };

  const getTideIcon = (index: number) => {
    return index % 2 === 0 ? '▲' : '▼';
  };

  return (
    <div className="classic-card overflow-hidden">
      <h3 className="card-title mb-4">Tabela de Marés — 30 Dias</h3>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700 z-10">
                DIA
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 min-w-[120px]">
                1ª MARÉ
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 min-w-[120px]">
                2ª MARÉ
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 min-w-[120px]">
                3ª MARÉ
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 min-w-[120px]">
                4ª MARÉ
              </th>
            </tr>
          </thead>
          <tbody>
            {last30Days.map((day, dayIndex) => (
              <tr 
                key={day.data} 
                className={`border-b border-gray-100 transition-colors hover:bg-blue-50 ${
                  dayIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Coluna DIA - Sticky */}
                <td className="sticky left-0 z-10 px-4 py-3 font-semibold text-gray-800 bg-inherit">
                  <div className="flex flex-col">
                    <span className="text-blue-600">{day.dayOfWeek}</span>
                    <span className="text-xs text-gray-500">{day.dayNum}</span>
                  </div>
                </td>

                {/* 4 Colunas de Marés */}
                {[0, 1, 2, 3].map(mIndex => {
                  const tide = day.mares[mIndex];
                  const isPresent = tide !== undefined;
                  const tideType = getTideType(mIndex);
                  const colorClass = getTideColor(mIndex);
                  const icon = getTideIcon(mIndex);

                  return (
                    <td 
                      key={`${day.data}-${mIndex}`}
                      className="px-4 py-3 text-center"
                    >
                      {isPresent ? (
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold text-gray-800">
                            {tide.hora}
                          </div>
                          <div className={`font-bold text-sm ${colorClass}`}>
                            <span className="mr-1">{icon}</span>
                            {tide.altura_m.toFixed(2)} m
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {tideType === 'preamar' ? 'Preamar' : 'Baixamar'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-300 text-xs">—</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="mt-4 flex gap-6 text-xs text-gray-600 px-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-500 font-bold">▲</span>
          <span>Preamar (maré alta)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold">▼</span>
          <span>Baixamar (maré baixa)</span>
        </div>
      </div>
    </div>
  );
};

export default TideTable30Days;
