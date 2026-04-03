'use client';

import { TideEvent } from '@/lib/tideUtils';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis, ReferenceLine, CartesianGrid,
} from 'recharts';

interface TideChartProps {
  tides: TideEvent[];
}

export default function TideChart({ tides }: TideChartProps) {
  if (!tides || tides.length === 0) return null;

  const sorted = [...tides].sort((a, b) => a.hora.localeCompare(b.hora));

  const chartData: {
    time: string; height: number; isEvent: boolean; tipo?: 'high' | 'low';
  }[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    const [h1, m1] = current.hora.split(':').map(Number);
    const [h2, m2] = next.hora.split(':').map(Number);
    const t1 = h1 * 60 + m1;
    const t2 = h2 * 60 + m2;

    chartData.push({ time: current.hora, height: current.altura_m, isEvent: true, tipo: current.tipo });

    const steps = 10;
    for (let j = 1; j < steps; j++) {
      const t = t1 + (t2 - t1) * j / steps;
      const ratio = j / steps;
      const smooth = (1 - Math.cos(ratio * Math.PI)) / 2;
      const height = current.altura_m + (next.altura_m - current.altura_m) * smooth;
      const hh = Math.floor(t / 60) % 24;
      const mm = Math.floor(t % 60);
      chartData.push({
        time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
        height: Math.round(height * 100) / 100,
        isEvent: false,
      });
    }
  }

  const last = sorted[sorted.length - 1];
  chartData.push({ time: last.hora, height: last.altura_m, isEvent: true, tipo: last.tipo });

  const maxH = Math.max(...chartData.map(d => d.height));
  const minH = Math.min(...chartData.map(d => d.height));
  const range = maxH - minH || 1;
  const yMax = maxH + range * 0.25;
  const yMin = Math.max(0, minH - range * 0.15);

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>📈</div>
          <div>
            <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace' }}>Gráfico de Marés — Hoje</div>
            <div style={{ color: '#475569', fontSize: 10, fontFamily: 'monospace', marginTop: 1 }}>interpolação cossenoidal · UTC-3</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} />
            <span style={{ color: '#64748b', fontSize: 10, fontFamily: 'monospace' }}>Preamar</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
            <span style={{ color: '#64748b', fontSize: 10, fontFamily: 'monospace' }}>Baixamar</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tideGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
              interval={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
              domain={[yMin, yMax]}
              tickFormatter={(v) => `${v.toFixed(1)}m`}
              width={42}
            />

            <ReferenceLine
              y={0}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{
                    background: 'rgba(15,23,42,0.97)',
                    border: '1px solid rgba(56,189,248,0.2)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    fontFamily: 'monospace',
                  }}>
                    <div style={{ color: '#94a3b8', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.time}</div>
                    <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.1rem' }}>{d.height.toFixed(2)} m</div>
                    {d.isEvent && (
                      <div style={{ color: d.tipo === 'high' ? '#38bdf8' : '#f97316', fontSize: 10, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {d.tipo === 'high' ? '▲ Preamar' : '▼ Baixamar'}
                      </div>
                    )}
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="height"
              stroke="#38bdf8"
              strokeWidth={2.5}
              fill="url(#tideGrad)"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (!payload.isEvent || cx == null || cy == null) return <g key={`e-${cx}-${cy}`} />;
                const isHigh = payload.tipo === 'high';
                const color = isHigh ? '#38bdf8' : '#f97316';
                return (
                  <g key={`dot-${cx}-${cy}`}>
                    {/* Glow ring */}
                    <circle cx={cx} cy={cy} r={10} fill={color} fillOpacity={0.12} />
                    <circle cx={cx} cy={cy} r={6} fill={color} stroke="rgba(15,23,42,0.9)" strokeWidth={2} />
                    {/* Label */}
                    <text
                      x={cx}
                      y={isHigh ? cy - 18 : cy + 26}
                      textAnchor="middle"
                      fill={color}
                      fontSize={10}
                      fontWeight={700}
                      fontFamily="monospace"
                    >
                      {payload.time} {payload.height.toFixed(2)}m
                    </text>
                  </g>
                );
              }}
              activeDot={{ r: 7, fill: '#38bdf8', stroke: 'rgba(15,23,42,0.9)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(56,189,248,0.1)',
  borderRadius: 20,
  padding: '22px 20px 12px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
};
