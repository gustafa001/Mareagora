'use client';

import { TideEvent } from '@/lib/tideUtils';
import { Wind, Waves } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TideChartProps {
  tides: TideEvent[];
  vento?: string;
  ondas?: string;
}

export default function TideChart({
  tides,
  vento = '5 km/h',
  ondas = '0.8 m'
}: TideChartProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hh}:${mm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!tides || tides.length === 0) {
    return <div className="text-center p-4">Sem dados de maré</div>;
  }

  const mares = [...tides].sort((a, b) => a.hora.localeCompare(b.hora));

  // Gerar dados do gráfico com interpolação suave
  const generateChartData = () => {
    const data: { x: number; y: number; label?: string; height?: number; time?: string; isEvent?: boolean }[] = [];

    for (let i = 0; i < mares.length - 1; i++) {
      const [h1, m1] = mares[i].hora.split(':').map(Number);
      const [h2, m2] = mares[i + 1].hora.split(':').map(Number);
      const t1 = h1 * 60 + m1;
      const t2 = h2 * 60 + m2;

      // Ponto do evento atual
      data.push({
        x: t1,
        y: mares[i].altura_m,
        label: mares[i].hora,
        height: mares[i].altura_m,
        time: mares[i].hora,
        isEvent: true
      });

      // Interpolar pontos entre eventos
      const steps = 12;
      for (let j = 1; j < steps; j++) {
        const t = t1 + ((t2 - t1) * j) / steps;
        const ratio = j / steps;
        // Easing coseno para interpolação suave
        const eased = (1 - Math.cos(ratio * Math.PI)) / 2;
        const height = mares[i].altura_m + (mares[i + 1].altura_m - mares[i].altura_m) * eased;
        data.push({ x: t, y: height });
      }
    }

    // Último ponto
    const [hLast, mLast] = mares[mares.length - 1].hora.split(':').map(Number);
    const tLast = hLast * 60 + mLast;
    data.push({
      x: tLast,
      y: mares[mares.length - 1].altura_m,
      label: mares[mares.length - 1].hora,
      height: mares[mares.length - 1].altura_m,
      time: mares[mares.length - 1].hora,
      isEvent: true
    });

    return data;
  };

  const chartData = generateChartData();
  const maxHeight = Math.max(...chartData.map(d => d.y));
  const minHeight = Math.min(...chartData.map(d => d.y));

  // SVG dimensions
  const viewBox = { width: 380, height: 240 };
  const padding = 25;
  const graphArea = {
    width: viewBox.width - padding * 2,
    height: viewBox.height - padding * 2,
  };

  const maxTime = 24 * 60;
  const graphMaxHeight = maxHeight * 1.1;

  const scaleX = (minutes: number) => (minutes / maxTime) * graphArea.width + padding;
  const scaleY = (height: number) => viewBox.height - padding - (height / graphMaxHeight) * graphArea.height;

  // Path SVG
  const pathData = chartData.length > 0
    ? `M ${chartData.map(d => `${scaleX(d.x)},${scaleY(d.y)}`).join(' L ')}`
    : '';

  // Próximo evento
  const nextEvent = mares.find(m => m.hora > currentTime);
  const displayNextEvent = nextEvent || mares[0];

  // Altura atual (interpolada)
  let currentHeight = 1.0;
  if (currentTime) {
    const [ch, cm] = currentTime.split(':').map(Number);
    const currentMinutes = ch * 60 + cm;
    for (let i = 0; i < mares.length - 1; i++) {
      const [h1, m1] = mares[i].hora.split(':').map(Number);
      const [h2, m2] = mares[i + 1].hora.split(':').map(Number);
      const t1 = h1 * 60 + m1;
      const t2 = h2 * 60 + m2;
      if (currentMinutes >= t1 && currentMinutes <= t2) {
        const ratio = (currentMinutes - t1) / (t2 - t1);
        currentHeight = mares[i].altura_m + (mares[i + 1].altura_m - mares[i].altura_m) * ratio;
        break;
      }
    }
  }

  // Determinar se é maré alta ou baixa (próxima)
  const isNextHigh = displayNextEvent.altura_m >= (mares[0]?.altura_m ?? 0) && 
                     displayNextEvent.altura_m >= (mares[mares.length - 1]?.altura_m ?? 0);
  
  // Status da maré (subindo ou descendo)
  const avgHeight = (Math.max(...mares.map(m => m.altura_m)) + Math.min(...mares.map(m => m.altura_m))) / 2;
  const isRising = displayNextEvent.altura_m > avgHeight;

  return (
    <div className="w-full">
      {/* Gráfico */}
      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        <div className="bg-gradient-to-b from-blue-50 via-cyan-50 to-white rounded-2xl p-4 relative">
          <svg 
            viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="tideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0.02" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid horizontal */}
            {[0, 0.5, 1, 1.5, 2].map((h) => (
              <g key={`h-${h}`}>
                <line
                  x1={padding}
                  y1={scaleY(h)}
                  x2={viewBox.width - padding}
                  y2={scaleY(h)}
                  stroke="rgb(226, 232, 240)"
                  strokeWidth="0.8"
                  strokeDasharray="3,3"
                />
                <text
                  x={padding - 8}
                  y={scaleY(h) + 4}
                  fontSize="9"
                  fill="rgb(100, 116, 139)"
                  textAnchor="end"
                  fontWeight="500"
                >
                  {h.toFixed(1)}m
                </text>
              </g>
            ))}

            {/* Linha base (0m) */}
            <line
              x1={padding}
              y1={scaleY(0)}
              x2={viewBox.width - padding}
              y2={scaleY(0)}
              stroke="rgb(148, 163, 184)"
              strokeWidth="1.5"
            />

            {/* Área preenchida */}
            <path
              d={`${pathData} L ${viewBox.width - padding},${scaleY(0)} L ${padding},${scaleY(0)} Z`}
              fill="url(#tideGradient)"
            />

            {/* Linha principal da maré */}
            <path
              d={pathData}
              stroke="rgb(6, 182, 212)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {/* Pontos de eventos */}
            {chartData
              .filter(d => d.isEvent)
              .map((data, idx) => {
                const isHigh = mares[idx]?.altura_m > (mares[idx + 1]?.altura_m ?? 0) && 
                              mares[idx]?.altura_m > (mares[idx - 1]?.altura_m ?? 0);

                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                  >
                    {/* Círculo de highlight */}
                    {hoveredPoint === idx && (
                      <circle
                        cx={scaleX(data.x)}
                        cy={scaleY(data.y)}
                        r="18"
                        fill={isHigh ? 'rgb(6, 182, 212)' : 'rgb(234, 88, 12)'}
                        opacity="0.1"
                      />
                    )}

                    {/* Ponto principal */}
                    <circle
                      cx={scaleX(data.x)}
                      cy={scaleY(data.y)}
                      r={hoveredPoint === idx ? 7 : 5.5}
                      fill={isHigh ? 'rgb(6, 182, 212)' : 'rgb(234, 88, 12)'}
                      stroke="white"
                      strokeWidth="2"
                      className="transition-all duration-200"
                    />

                    {/* Label */}
                    <text
                      x={scaleX(data.x)}
                      y={scaleY(data.y) - 20}
                      fontSize="11"
                      fontWeight="700"
                      fill={hoveredPoint === idx ? (isHigh ? 'rgb(6, 182, 212)' : 'rgb(234, 88, 12)') : 'rgb(51, 65, 85)'}
                      textAnchor="middle"
                      className="transition-colors duration-200"
                    >
                      {data.time}
                    </text>
                    <text
                      x={scaleX(data.x)}
                      y={scaleY(data.y) - 8}
                      fontSize="10"
                      fill="rgb(100, 116, 139)"
                      textAnchor="middle"
                    >
                      {data.height?.toFixed(2)}m
                    </text>
                  </g>
                );
              })}

            {/* Indicador de hora atual */}
            {currentTime && (
              <line
                x1={scaleX((parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1])))}
                y1={scaleY(0)}
                x2={scaleX((parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1])))}
                y2={scaleY(graphMaxHeight)}
                stroke="rgb(239, 68, 68)"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                opacity="0.6"
              />
            )}

            {/* Labels de tempo */}
            {[0, 6, 12, 18, 24].map((h) => (
              <text
                key={`time-${h}`}
                x={scaleX(h * 60)}
                y={viewBox.height - 8}
                fontSize="10"
                fill="rgb(100, 116, 139)"
                textAnchor="middle"
                fontWeight="500"
              >
                {String(h).padStart(2, '0')}:00
              </text>
            ))}
          </svg>
        </div>

        {/* Info boxes */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
            <div className="text-xs font-semibold text-slate-600 mb-1">Maré Atual</div>
            <div className="text-3xl font-black text-cyan-600">{currentHeight.toFixed(2)}m</div>
            <div className="text-xs text-slate-500 mt-2 font-medium">
              {isRising ? '↗ Enchente' : '↘ Vazante'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
            <div className="text-xs font-semibold text-slate-600 mb-1">Próximo Evento</div>
            <div className="text-3xl font-black text-orange-600">{displayNextEvent.hora}</div>
            <div className="text-xs text-slate-500 mt-2 font-medium">
              {displayNextEvent.altura_m.toFixed(2)}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
