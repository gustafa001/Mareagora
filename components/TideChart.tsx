'use client';

import { TideEvent } from '@/lib/tideUtils';
import { useEffect, useState } from 'react';
import type { TideDay } from '@/lib/tideUtils';

interface TideChartProps {
  tides?: TideEvent[];
  tideDay?: TideDay;
  vento?: string;
  ondas?: string;
}

export default function TideChart({
  tides,
  tideDay,
  vento = '5 km/h',
  ondas = '0.8 m'
}: TideChartProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; time: string; height: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Extrair dados dependendo se é TideDay ou array de TideEvent
  const tidesArray = tideDay ? tideDay.mares : (tides || []);

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

  if (!tidesArray || tidesArray.length === 0) {
    return <div className="text-center p-4">Sem dados de maré</div>;
  }

  const mares = [...tidesArray].sort((a, b) => a.hora.localeCompare(b.hora));

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

  // Handler para movimento do mouse no SVG
  const handleSVGMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Converter coordenadas do viewport para coordenadas do SVG
    const svgX = (x / rect.width) * viewBox.width;
    const svgY = (y / rect.height) * viewBox.height;

    // Converter coordenadas SVG para minutos e altura
    const minutes = ((svgX - padding) / graphArea.width) * maxTime;
    const height = (viewBox.height - padding - svgY) / graphArea.height * graphMaxHeight;

    // Validar se está dentro dos limites
    if (minutes >= 0 && minutes <= maxTime && height >= 0 && height <= graphMaxHeight) {
      setMousePos({ x: svgX, y: svgY });
      
      // Formatar horário
      const hours = Math.floor(minutes / 60);
      const mins = Math.floor(minutes % 60);
      const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      
      setTooltipData({
        x: svgX,
        y: svgY,
        time: timeStr,
        height: Math.max(0, height)
      });
    }
  };

  const handleSVGMouseLeave = () => {
    setTooltipData(null);
    setMousePos(null);
  };

  return (
    <div className="w-full">
      {/* Gráfico */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white dark:from-slate-800/60 dark:via-slate-900/40 dark:to-slate-900 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-sm">
          {/* Efeito aquático */}
          <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-300 dark:bg-cyan-500 rounded-full blur-3xl opacity-30 dark:opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-300 dark:bg-blue-500 rounded-full blur-3xl opacity-20 dark:opacity-15"></div>
          </div>
          <svg 
            viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
            className="w-full h-auto relative z-10 cursor-crosshair"
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleSVGMouseMove}
            onMouseLeave={handleSVGMouseLeave}
          >
            <defs>
              <linearGradient id="tideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.35" />
                <stop offset="50%" stopColor="rgb(6, 182, 212)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0.03" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
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
                  stroke="rgb(71, 85, 105)"
                  strokeWidth="0.8"
                  strokeDasharray="3,3"
                  opacity="0.5"
                />
                <text
                  x={padding - 8}
                  y={scaleY(h) + 4}
                  fontSize="9"
                  fill="rgb(148, 163, 184)"
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
              stroke="rgb(100, 116, 139)"
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* Área preenchida */}
            <path
              d={`${pathData} L ${viewBox.width - padding},${scaleY(0)} L ${padding},${scaleY(0)} Z`}
              fill="url(#tideGradient)"
            />

            {/* Linha principal da maré */}
            <path
              d={pathData}
              stroke="rgb(0, 184, 224)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              opacity="0.95"
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
                      fill={hoveredPoint === idx ? (isHigh ? 'rgb(34, 211, 238)' : 'rgb(251, 146, 60)') : 'rgb(148, 163, 184)'}
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

            {/* Tooltip interativo ao passar o mouse */}
            {tooltipData && (
              <g>
                {/* Linha vertical de referência */}
                <line
                  x1={tooltipData.x}
                  y1={padding}
                  x2={tooltipData.x}
                  y2={viewBox.height - padding}
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.4"
                />

                {/* Ponto de referência */}
                <circle
                  cx={tooltipData.x}
                  cy={tooltipData.y}
                  r="4"
                  fill="rgb(59, 130, 246)"
                  opacity="0.8"
                />

                {/* Caixa de tooltip */}
                <rect
                  x={tooltipData.x - 45}
                  y={tooltipData.y - 35}
                  width="90"
                  height="30"
                  rx="4"
                  fill="rgb(15, 23, 42)"
                  opacity="0.95"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="1"
                />

                {/* Texto do tooltip - Horário */}
                <text
                  x={tooltipData.x}
                  y={tooltipData.y - 18}
                  fontSize="11"
                  fontWeight="700"
                  fill="rgb(59, 130, 246)"
                  textAnchor="middle"
                >
                  {tooltipData.time}
                </text>

                {/* Texto do tooltip - Altura */}
                <text
                  x={tooltipData.x}
                  y={tooltipData.y - 5}
                  fontSize="10"
                  fill="rgb(226, 232, 240)"
                  textAnchor="middle"
                >
                  {tooltipData.height.toFixed(2)}m
                </text>
              </g>
            )}

            {/* Labels de tempo */}
            {[0, 6, 12, 18, 24].map((h) => (
              <text
                key={`time-${h}`}
                x={scaleX(h * 60)}
                y={viewBox.height - 8}
                fontSize="10"
                fill="rgb(148, 163, 184)"
                textAnchor="middle"
                fontWeight="500"
              >
                {String(h).padStart(2, '0')}:00
              </text>
            ))}
          </svg>
        </div>

        {/* Info boxes removido - apenas gráfico */}
      </div>
    </div>
  );
}
