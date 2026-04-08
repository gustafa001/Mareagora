'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceArea, ReferenceLine, Cell, CartesianGrid } from 'recharts';

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
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="waveNormal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="waveRessaca" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#991b1b" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(v: number) => `${v.toFixed(1)}m`}
            domain={[0, (dataMax: number) => Math.max(3, Math.ceil(dataMax + 0.5))]}
          />
          
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const height = payload[0].payload.height;
                const isRessaca = height >= RESSACA_LIMIT;
                return (
                  <div className="backdrop-blur-md bg-slate-900/90 border border-slate-700 p-3 rounded-xl shadow-2xl">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {payload[0].payload.time}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-black font-syne ${isRessaca ? "text-red-400" : "text-cyan-400"}`}>
                        {height.toFixed(2)}m
                      </span>
                      {isRessaca && <span className="animate-pulse text-sm">⚠️</span>}
                    </div>
                    {isRessaca && (
                      <p className="text-red-400/80 text-[9px] font-bold mt-1 uppercase">Ressaca Detectada</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          
          <ReferenceArea 
            y1={RESSACA_LIMIT} 
            fill="rgba(239, 68, 68, 0.05)" 
            ifOverflow="extendDomain"
          />
          
          <ReferenceLine 
            y={RESSACA_LIMIT} 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            strokeWidth={1.5}
            label={{ 
              value: 'RESSACA', 
              position: 'right', 
              fill: '#ef4444', 
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: '0.1em'
            }} 
          />

          <Bar 
            dataKey="height" 
            radius={[6, 6, 0, 0]}
            barSize={24}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.height >= RESSACA_LIMIT ? 'url(#waveRessaca)' : 'url(#waveNormal)'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
