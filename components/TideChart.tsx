'use client';

import { TideEvent } from '@/lib/tideUtils';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';

interface TideChartProps {
  mares: TideEvent[];
}

export default function TideChart({ mares }: TideChartProps) {
  if (!mares || mares.length === 0) return null;

  // Sort by time and create smooth curve data
  const sorted = [...mares].sort((a, b) => a.hora.localeCompare(b.hora));
  
  // Generate smooth curve points between tide events
  const chartData: { time: string; height: number; isEvent: boolean; tipo?: 'high' | 'low' }[] = [];
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    
    const [h1, m1] = current.hora.split(':').map(Number);
    const [h2, m2] = next.hora.split(':').map(Number);
    const t1 = h1 * 60 + m1;
    const t2 = h2 * 60 + m2;
    
    // Add the current event point
    chartData.push({ 
      time: current.hora, 
      height: current.altura_m, 
      isEvent: true,
      tipo: current.tipo 
    });
    
    // Generate intermediate points for smooth curve
    const steps = 8;
    for (let j = 1; j < steps; j++) {
      const t = t1 + (t2 - t1) * j / steps;
      const ratio = j / steps;
      // Use sine curve for natural tide shape
      const smoothRatio = (1 - Math.cos(ratio * Math.PI)) / 2;
      const height = current.altura_m + (next.altura_m - current.altura_m) * smoothRatio;
      const hh = Math.floor(t / 60) % 24;
      const mm = Math.floor(t % 60);
      chartData.push({
        time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
        height: Math.round(height * 100) / 100,
        isEvent: false
      });
    }
  }
  
  // Add last event
  chartData.push({ 
    time: sorted[sorted.length - 1].hora, 
    height: sorted[sorted.length - 1].altura_m, 
    isEvent: true,
    tipo: sorted[sorted.length - 1].tipo
  });

  const maxHeight = Math.max(...chartData.map(d => d.height));
  const minHeight = Math.min(...chartData.map(d => d.height));
  const range = maxHeight - minHeight || 1;
  const yMax = maxHeight + range * 0.2;
  const yMin = Math.max(0, minHeight - range * 0.2);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
            interval={3}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
            domain={[yMin, yMax]}
            tickFormatter={(v) => `${v.toFixed(1)}m`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg">
                    <p className="font-semibold">{data.time}</p>
                    <p className="text-blue-300">{data.height.toFixed(2)}m</p>
                    {data.isEvent && (
                      <p className="text-xs text-slate-400">
                        {data.tipo === 'high' ? 'Maré Alta' : 'Maré Baixa'}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          {/* Zero line */}
          <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="3 3" />
          
          <Area
            type="monotone"
            dataKey="height"
            stroke="#0284C7"
            strokeWidth={3}
            fill="url(#tideGradient)"
            dot={({ cx, cy, payload }) => {
              if (payload.isEvent) {
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={6} fill={payload.tipo === 'high' ? '#0EA5E9' : '#F97316'} stroke="white" strokeWidth={2} />
                    <text x={cx} y={cy - 15} textAnchor="middle" fill="#1E3A5F" fontSize={11} fontWeight="600">
                      {payload.time} {payload.height.toFixed(2)}m
                    </text>
                  </g>
                );
              }
              return <></>;
            }}
            activeDot={{ r: 8, fill: '#0284C7', stroke: 'white', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
