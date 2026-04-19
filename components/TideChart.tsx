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

  const generateChartData = () => {
    const data: { x: number; y: number; label?: string; height?: number; time?: string; isEvent?: boolean; type?: 'high' | 'low' }[] = [];
    
    // Adicionar ponto inicial (00:00) se necessário
    const [hFirst, mFirst] = mares[0].hora.split(':').map(Number);
    const tFirst = hFirst * 60 + mFirst;
    if (tFirst > 0) {
      data.push({ x: 0, y: mares[0].altura_m });
    }

    for (let i = 0; i < mares.length - 1; i++) {
      const [h1, m1] = mares[i].hora.split(':').map(Number);
      const [h2, m2] = mares[i + 1].hora.split(':').map(Number);
      const t1 = h1 * 60 + m1;
      const t2 = h2 * 60 + m2;

      const type = mares[i].altura_m > (mares[i+1]?.altura_m ?? 0) ? 'high' : 'low';

      data.push({
        x: t1,
        y: mares[i].altura_m,
        label: mares[i].hora,
        height: mares[i].altura_m,
        time: mares[i].hora,
        isEvent: true,
        type
      });

      const steps = 24; // Mais passos para suavidade
      for (let j = 1; j < steps; j++) {
        const t = t1 + ((t2 - t1) * j) / steps;
        const ratio = j / steps;
        // Interpolação senoidal para curva de maré natural
        const eased = (1 - Math.cos(ratio * Math.PI)) / 2;
        const height = mares[i].altura_m + (mares[i + 1].altura_m - mares[i].altura_m) * eased;
        data.push({ x: t, y: height });
      }
    }

    const [hLast, mLast] = mares[mares.length - 1].hora.split(':').map(Number);
    const tLast = hLast * 60 + mLast;
    const lastType = mares[mares.length - 1].altura_m > (mares[mares.length - 2]?.altura_m ?? 0) ? 'high' : 'low';
    
    data.push({
      x: tLast,
      y: mares[mares.length - 1].altura_m,
      label: mares[mares.length - 1].hora,
      height: mares[mares.length - 1].altura_m,
      time: mares[mares.length - 1].hora,
      isEvent: true,
      type: lastType
    });

    // Adicionar ponto final (23:59) se necessário
    if (tLast < 1439) {
      data.push({ x: 1439, y: mares[mares.length - 1].altura_m });
    }

    return data;
  };

  const chartData = generateChartData();
  const maxHeight = Math.max(...chartData.map(d => d.y));

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

  const pathData = chartData.length > 0
    ? `M ${chartData.map(d => `${scaleX(d.x)},${scaleY(d.y)}`).join(' L ')}`
    : '';

  const avgHeight = (Math.max(...mares.map(m => m.altura_m)) + Math.min(...mares.map(m => m.altura_m))) / 2;

  const handleSVGMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const svgX = (x / rect.width) * viewBox.width;
    const svgY = (y / rect.height) * viewBox.height;
    const minutes = ((svgX - padding) / graphArea.width) * maxTime;
    const height = (viewBox.height - padding - svgY) / graphArea.height * graphMaxHeight;

    if (minutes >= 0 && minutes <= maxTime && height >= 0 && height <= graphMaxHeight) {
      setMousePos({ x: svgX, y: svgY });
      const hours = Math.floor(minutes / 60);
      const mins = Math.floor(minutes % 60);
      const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      setTooltipData({ x: svgX, y: svgY, time: timeStr, height: Math.max(0, height) });
    }
  };

  const handleSVGMouseLeave = () => {
    setTooltipData(null);
    setMousePos(null);
  };

  return (
    <div className="w-full">
      {/* Gráfico — fundo igual ao card da tábua (#0f1f3d) sem padding interno */}
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{ background: '#0f1f3d' }}
      >
        <svg
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          className="w-full h-auto cursor-crosshair"
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

          {/* Grid horizontal dinâmico */}
          {Array.from({ length: Math.ceil(graphMaxHeight * 2) + 1 }, (_, i) => i * 0.5)
            .filter(h => h <= graphMaxHeight)
            .map((h) => (
            <g key={`h-${h}`}>
              <line
                x1={padding}
                y1={scaleY(h)}
                x2={viewBox.width - padding}
                y2={scaleY(h)}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.8"
                strokeDasharray="3,3"
              />
              <text
                x={padding - 8}
                y={scaleY(h) + 4}
                fontSize="9"
                fill="rgba(255,255,255,0.3)"
                textAnchor="end"
                fontWeight="500"
              >
                {h.toFixed(1)}m
              </text>
            </g>
          ))}

          {/* Linha base */}
          <line
            x1={padding}
            y1={scaleY(0)}
            x2={viewBox.width - padding}
            y2={scaleY(0)}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />

          {/* Área preenchida */}
          <path
            d={`${pathData} L ${viewBox.width - padding},${scaleY(0)} L ${padding},${scaleY(0)} Z`}
            fill="url(#tideGradient)"
          />

          {/* Linha principal */}
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
              const isHigh = data.type === 'high';

              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer"
                >
                  {hoveredPoint === idx && (
                    <circle
                      cx={scaleX(data.x)}
                      cy={scaleY(data.y)}
                      r="18"
                      fill={isHigh ? 'rgb(6, 182, 212)' : 'rgb(234, 88, 12)'}
                      opacity="0.1"
                    />
                  )}
                  <circle
                    cx={scaleX(data.x)}
                    cy={scaleY(data.y)}
                    r={hoveredPoint === idx ? 7 : 5.5}
                    fill={isHigh ? 'rgb(6, 182, 212)' : 'rgb(234, 88, 12)'}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-200 shadow-lg"
                  />
                  <text
                    x={scaleX(data.x)}
                    y={scaleY(data.y) - 22}
                    fontSize="11"
                    fontWeight="800"
                    fill={isHigh ? 'rgb(34, 211, 238)' : 'rgb(251, 146, 60)'}
                    textAnchor="middle"
                    className="font-syne"
                  >
                    {data.time}
                  </text>
                  <text
                    x={scaleX(data.x)}
                    y={scaleY(data.y) - 10}
                    fontSize="10"
                    fontWeight="700"
                    fill="white"
                    textAnchor="middle"
                    className="font-syne"
                  >
                    {data.height?.toFixed(2)}m
                  </text>
                  <text
                    x={scaleX(data.x)}
                    y={scaleY(data.y) + 18}
                    fontSize="9"
                    fontWeight="600"
                    fill="rgba(255,255,255,0.4)"
                    textAnchor="middle"
                    className="uppercase tracking-tighter"
                  >
                    {isHigh ? 'Alta' : 'Baixa'}
                  </text>
                </g>
              );
            })}

          {/* Linha de hora atual */}
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

          {/* Tooltip */}
          {tooltipData && (
            <g>
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
              <circle cx={tooltipData.x} cy={tooltipData.y} r="4" fill="rgb(59, 130, 246)" opacity="0.8" />
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
              <text x={tooltipData.x} y={tooltipData.y - 18} fontSize="11" fontWeight="700" fill="rgb(59, 130, 246)" textAnchor="middle">
                {tooltipData.time}
              </text>
              <text x={tooltipData.x} y={tooltipData.y - 5} fontSize="10" fill="rgb(226, 232, 240)" textAnchor="middle">
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
              fill="rgba(255,255,255,0.4)"
              textAnchor="middle"
              fontWeight="500"
            >
              {String(h).padStart(2, '0')}:00
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
