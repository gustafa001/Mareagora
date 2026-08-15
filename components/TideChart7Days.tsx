'use client';

import { useEffect, useState } from 'react';
import type { MareDia, MareEvento } from '@/lib/mare';
import { useT, WEEKDAYS_SHORT_EN, WEEKDAYS_SHORT_PT } from '@/lib/tideI18n';

interface TideChart7DaysProps {
  /** 7 dias consecutivos de eventos de maré, já ordenados a partir de hoje */
  days: MareDia[];
}

interface FlatEvent extends MareEvento {
  dayIndex: number;
  minutesFromStart: number; // minutos desde o início do range (dia 0, 00:00)
}

export default function TideChart7Days({ days }: TideChart7DaysProps) {
  const { lang, s } = useT();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; time: string; height: number } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const validDays = days.filter(d => d.mares && d.mares.length > 0);
  const weekdays = lang === 'en' ? WEEKDAYS_SHORT_EN : WEEKDAYS_SHORT_PT;

  if (validDays.length === 0) {
    return <div className="text-center p-4 text-slate-400 text-sm">{s.noTideData}</div>;
  }

  const numDays = validDays.length;
  const maxTime = numDays * 24 * 60;

  // Achata todos os eventos dos N dias numa única linha do tempo contínua
  const flatEvents: FlatEvent[] = [];
  validDays.forEach((day, dayIndex) => {
    const mares = [...day.mares].sort((a, b) => a.hora.localeCompare(b.hora));
    mares.forEach(ev => {
      const [h, m] = ev.hora.split(':').map(Number);
      flatEvents.push({ ...ev, dayIndex, minutesFromStart: dayIndex * 24 * 60 + h * 60 + m });
    });
  });

  const generateChartData = () => {
    const data: { x: number; y: number; label?: string; height?: number; time?: string; dateLabel?: string; isEvent?: boolean; type?: 'high' | 'low' }[] = [];

    if (flatEvents[0].minutesFromStart > 0) {
      data.push({ x: 0, y: flatEvents[0].altura_m });
    }

    for (let i = 0; i < flatEvents.length - 1; i++) {
      const cur = flatEvents[i];
      const next = flatEvents[i + 1];
      const type: 'high' | 'low' = cur.altura_m > (next?.altura_m ?? 0) ? 'high' : 'low';

      data.push({
        x: cur.minutesFromStart,
        y: cur.altura_m,
        label: cur.hora,
        height: cur.altura_m,
        time: cur.hora,
        dateLabel: shortDate(validDays[cur.dayIndex].data, weekdays),
        isEvent: true,
        type,
      });

      const steps = 24;
      for (let j = 1; j < steps; j++) {
        const t = cur.minutesFromStart + ((next.minutesFromStart - cur.minutesFromStart) * j) / steps;
        const ratio = j / steps;
        const eased = (1 - Math.cos(ratio * Math.PI)) / 2;
        const height = cur.altura_m + (next.altura_m - cur.altura_m) * eased;
        data.push({ x: t, y: height });
      }
    }

    const last = flatEvents[flatEvents.length - 1];
    const secondLast = flatEvents[flatEvents.length - 2];
    const lastType: 'high' | 'low' = last.altura_m > (secondLast?.altura_m ?? 0) ? 'high' : 'low';
    data.push({
      x: last.minutesFromStart,
      y: last.altura_m,
      label: last.hora,
      height: last.altura_m,
      time: last.hora,
      dateLabel: shortDate(validDays[last.dayIndex].data, weekdays),
      isEvent: true,
      type: lastType,
    });

    if (last.minutesFromStart < maxTime - 1) {
      data.push({ x: maxTime - 1, y: last.altura_m });
    }

    return data;
  };

  const chartData = generateChartData();
  const maxHeight = Math.max(...chartData.map(d => d.y));

  const viewBox = { width: 380 * Math.min(numDays, 3), height: 240 };
  const padding = 25;
  const graphArea = { width: viewBox.width - padding * 2, height: viewBox.height - padding * 2 };
  const graphMaxHeight = maxHeight * 1.1;

  const scaleX = (minutes: number) => (minutes / maxTime) * graphArea.width + padding;
  const scaleY = (height: number) => viewBox.height - padding - (height / graphMaxHeight) * graphArea.height;

  const pathData = chartData.length > 0
    ? `M ${chartData.map(d => `${scaleX(d.x)},${scaleY(d.y)}`).join(' L ')}`
    : '';

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
      const dayIdx = Math.min(Math.floor(minutes / (24 * 60)), numDays - 1);
      const minutesInDay = minutes - dayIdx * 24 * 60;
      const hh = String(Math.floor(minutesInDay / 60)).padStart(2, '0');
      const mm = String(Math.floor(minutesInDay % 60)).padStart(2, '0');
      setTooltipData({ x: svgX, y: svgY, time: `${shortDate(validDays[dayIdx].data, weekdays)} ${hh}:${mm}`, height: Math.max(0, height) });
    }
  };

  const handleSVGMouseLeave = () => setTooltipData(null);

  // Linha do "agora" só faz sentido se o dia 0 do range for hoje
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const isTodayInRange = validDays[0]?.data === todayStr;
  const nowMinutes = isTodayInRange && currentTime
    ? parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1])
    : null;

  return (
    <div className="w-full min-w-0">
      <div className="w-full overflow-x-auto rounded-2xl" style={{ background: '#0f1f3d' }}>
        <svg
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          className="cursor-crosshair"
          style={{ width: `${Math.max(100, numDays * 33)}%`, minWidth: '100%', height: 'auto', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={handleSVGMouseMove}
          onMouseLeave={handleSVGMouseLeave}
        >
          <defs>
            <linearGradient id="tideGradient7d" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.35" />
              <stop offset="50%" stopColor="rgb(6, 182, 212)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0.03" />
            </linearGradient>
            <filter id="glow7d" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid horizontal */}
          {Array.from({ length: Math.ceil(graphMaxHeight * 2) + 1 }, (_, i) => i * 0.5)
            .filter(h => h <= graphMaxHeight)
            .map(h => (
              <g key={`h-${h}`}>
                <line x1={padding} y1={scaleY(h)} x2={viewBox.width - padding} y2={scaleY(h)} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="3,3" />
                <text x={padding - 8} y={scaleY(h) + 4} fontSize="9" fill="rgba(255,255,255,0.3)" textAnchor="end" fontWeight="500">{h.toFixed(1)}m</text>
              </g>
            ))}

          {/* Separadores de dia */}
          {validDays.slice(1).map((_, i) => (
            <line
              key={`day-sep-${i}`}
              x1={scaleX((i + 1) * 24 * 60)}
              y1={padding}
              x2={scaleX((i + 1) * 24 * 60)}
              y2={viewBox.height - padding}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              strokeDasharray="2,4"
            />
          ))}

          <line x1={padding} y1={scaleY(0)} x2={viewBox.width - padding} y2={scaleY(0)} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

          <path d={`${pathData} L ${viewBox.width - padding},${scaleY(0)} L ${padding},${scaleY(0)} Z`} fill="url(#tideGradient7d)" />
          <path d={pathData} stroke="rgb(0, 184, 224)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow7d)" opacity="0.95" />

          {chartData.filter(d => d.isEvent).map((data, idx) => {
            const isHigh = data.type === 'high';
            return (
              <g key={idx} onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
                {hoveredPoint === idx && (
                  <circle cx={scaleX(data.x)} cy={scaleY(data.y)} r="18" fill={isHigh ? 'rgb(6, 182, 212)' : 'rgb(234, 88, 12)'} opacity="0.1" />
                )}
                <circle
                  cx={scaleX(data.x)}
                  cy={scaleY(data.y)}
                  r={hoveredPoint === idx ? 7 : 4.5}
                  fill={isHigh ? 'rgb(6, 182, 212)' : 'rgb(234, 88, 12)'}
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />
                {(hoveredPoint === idx || numDays <= 3) && (
                  <>
                    <text x={scaleX(data.x)} y={scaleY(data.y) - 20} fontSize="9" fontWeight="800" fill={isHigh ? 'rgb(34, 211, 238)' : 'rgb(251, 146, 60)'} textAnchor="middle" className="font-syne">
                      {data.time}
                    </text>
                    <text x={scaleX(data.x)} y={scaleY(data.y) - 9} fontSize="9" fontWeight="700" fill="white" textAnchor="middle" className="font-syne">
                      {data.height?.toFixed(2)}m
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Linha do "agora", só se o dia 0 for hoje */}
          {nowMinutes !== null && (
            <line
              x1={scaleX(nowMinutes)}
              y1={scaleY(0)}
              x2={scaleX(nowMinutes)}
              y2={scaleY(graphMaxHeight)}
              stroke="rgb(239, 68, 68)"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              opacity="0.6"
            />
          )}

          {tooltipData && (
            <g>
              <line x1={tooltipData.x} y1={padding} x2={tooltipData.x} y2={viewBox.height - padding} stroke="rgb(59, 130, 246)" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
              <circle cx={tooltipData.x} cy={tooltipData.y} r="4" fill="rgb(59, 130, 246)" opacity="0.8" />
              <rect x={tooltipData.x - 50} y={tooltipData.y - 35} width="100" height="30" rx="4" fill="rgb(15, 23, 42)" opacity="0.95" stroke="rgb(59, 130, 246)" strokeWidth="1" />
              <text x={tooltipData.x} y={tooltipData.y - 18} fontSize="10" fontWeight="700" fill="rgb(59, 130, 246)" textAnchor="middle">{tooltipData.time}</text>
              <text x={tooltipData.x} y={tooltipData.y - 5} fontSize="10" fill="rgb(226, 232, 240)" textAnchor="middle">{tooltipData.height.toFixed(2)}m</text>
            </g>
          )}

          {/* Rótulos de data, um por dia */}
          {validDays.map((day, i) => (
            <text
              key={`date-${i}`}
              x={scaleX(i * 24 * 60 + 12 * 60)}
              y={viewBox.height - 8}
              fontSize="10"
              fill="rgba(255,255,255,0.4)"
              textAnchor="middle"
              fontWeight="500"
            >
              {shortDate(day.data, weekdays)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

function shortDate(isoDate: string, weekdays: string[]): string {
  const d = new Date(`${isoDate}T00:00:00`);
  return `${weekdays[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}`;
}
