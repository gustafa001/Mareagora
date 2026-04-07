'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceArea, ReferenceLine, Cell } from 'recharts';

interface WaveData {
  time: string;
  height: number;
}

interface WaveChartProps {
  data: WaveData[];
}

const RESSACA_LIMIT = 2.5;

export default function WaveChart({ data }: WaveChartProps) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
            tickFormatter={(v: number) => `${v.toFixed(1)}m`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const height = payload[0].payload.height;
                const isRessaca = height >= RESSACA_LIMIT;
                return (
                  <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg">
                    <p className="font-semibold flex items-center gap-2">
                      {payload[0].payload.time}
                      {isRessaca && <span>⚠️</span>}
                    </p>
                    <p className={isRessaca ? "text-red-400" : "text-cyan-300"}>
                      {height.toFixed(1)}m
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          
          <ReferenceArea 
            y1={RESSACA_LIMIT} 
            fill="rgba(239, 68, 68, 0.08)" 
            ifOverflow="extendDomain"
          />
          
          <ReferenceLine 
            y={RESSACA_LIMIT} 
            stroke="#ef4444" 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Ressaca', 
              position: 'right', 
              fill: '#ef4444', 
              fontSize: 10,
              fontWeight: 600
            }} 
          />

          <Bar 
            dataKey="height" 
            radius={[8, 8, 0, 0]}
            label={{ 
              position: 'top', 
              fill: '#1E3A5F', 
              fontSize: 12,
              fontWeight: 600,
              formatter: (v: unknown) => `${Number(v).toFixed(1)}m`
            }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.height >= RESSACA_LIMIT ? '#ef4444' : '#22d3ee'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
