'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
interface WaveData {
  time: string;
  height: number;
}
interface WaveChartProps {
  data: WaveData[];
}
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
                return (
                  <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg">
                    <p className="font-semibold">{payload[0].payload.time}</p>
                    <p className="text-cyan-300">{payload[0].payload.height.toFixed(1)}m</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="height" 
            fill="#06B6D4" 
            radius={[8, 8, 0, 0]}
            label={{ 
              position: 'top', 
              fill: '#1E3A5F', 
              fontSize: 12,
              fontWeight: 600,
              formatter: (v: unknown) => `${Number(v).toFixed(1)}m`
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
