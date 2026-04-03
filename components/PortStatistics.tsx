'use client';

import { TideEvent, getMoonAge, getTideCoefficient, classifyTideEvents } from '@/lib/tideUtils';

interface PortStatisticsProps {
  eventos: any[];
  portName: string;
  currentMonth?: number;
}

function StatCard({ label, value, sub, color, icon }: {
  label: string; value: string; sub: string; color: string; icon: string;
}) {
  return (
    <div style={{
      background: color + '0d',
      border: `1px solid ${color}22`,
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 6,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 10, right: 12, fontSize: '1.4rem', opacity: 0.15 }}>{icon}</div>
      <div style={{ color: '#64748b', fontSize: '0.65rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
      <div style={{ color, fontFamily: 'monospace', fontWeight: 800, fontSize: '1.6rem', lineHeight: 1 }}>{value}</div>
      <div style={{ color: '#475569', fontSize: '0.6rem', fontFamily: 'monospace' }}>{sub}</div>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 99, marginTop: 4 }}>
        <div style={{ height: '100%', width: '60%', background: color + '60', borderRadius: 99 }} />
      </div>
    </div>
  );
}

function SummaryItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '12px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12 }}>
      <div style={{ color: '#475569', fontSize: '0.65rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
      <div style={{ color, fontFamily: 'monospace', fontWeight: 800, fontSize: '1.3rem' }}>{value}</div>
    </div>
  );
}

export default function PortStatistics({ eventos, portName }: PortStatisticsProps) {
  const allHeights = eventos.flatMap((e: any) => e.mares?.map((m: TideEvent) => m.altura_m) || []);
  const maxHeight = allHeights.length > 0 ? Math.max(...allHeights) : 0;
  const minHeight = allHeights.length > 0 ? Math.min(...allHeights) : 0;
  const amplitude = maxHeight - minHeight;
  const avgHeight = allHeights.length > 0 ? allHeights.reduce((a: number, b: number) => a + b, 0) / allHeights.length : 0;

  const allEvents = eventos.flatMap((e: any) => classifyTideEvents(e.mares || []));
  const highTides = allEvents.filter((e: TideEvent) => e.tipo === 'high').length;
  const lowTides = allEvents.filter((e: TideEvent) => e.tipo === 'low').length;

  const allCoeffs = eventos
    .filter((e: any) => e.data)
    .map((e: any) => {
      const date = new Date(e.data);
      const moonAge = getMoonAge(date);
      return getTideCoefficient(date, moonAge);
    });

  const maxCoeff = allCoeffs.length > 0 ? Math.max(...allCoeffs) : 0;
  const minCoeff = allCoeffs.length > 0 ? Math.min(...allCoeffs) : 0;
  const avgPerDay = eventos.length > 0 ? ((highTides + lowTides) / eventos.length).toFixed(1) : '0';

  const stats = [
    { label: 'Amplitude Média',  value: `${amplitude.toFixed(2)} m`, sub: 'Diferença alta/baixa', color: '#38bdf8', icon: '📊' },
    { label: 'Maré Máxima',      value: `${maxHeight.toFixed(2)} m`, sub: 'Nível recorde no ano',  color: '#34d399', icon: '⬆️' },
    { label: 'Maré Mínima',      value: `${minHeight.toFixed(2)} m`, sub: 'Nível mínimo no ano',   color: '#fb923c', icon: '⬇️' },
    { label: 'Nível Médio',      value: `${avgHeight.toFixed(2)} m`, sub: 'Média geral anual',     color: '#a78bfa', icon: '〰️' },
    { label: 'Maior Coeficiente',value: `${maxCoeff}`,               sub: 'Amplitude máxima',      color: '#f472b6', icon: '🌕' },
    { label: 'Menor Coeficiente',value: `${minCoeff}`,               sub: 'Amplitude mínima',      color: '#67e8f9', icon: '🌑' },
  ];

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>📊</div>
          <div>
            <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace' }}>Estatísticas de Marés</div>
            <div style={{ color: '#475569', fontSize: 10, fontFamily: 'monospace', marginTop: 1 }}>{portName} · dados anuais</div>
          </div>
        </div>
        <span style={{ color: '#67e8f9', background: 'rgba(103,232,249,0.1)', border: '1px solid rgba(103,232,249,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 10, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          2026
        </span>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 14 }} />

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <SummaryItem label="Marés altas no ano" value={String(highTides)} color="#38bdf8" />
        <SummaryItem label="Marés baixas no ano" value={String(lowTides)} color="#fb923c" />
        <SummaryItem label="Média por dia" value={`${avgPerDay} marés`} color="#34d399" />
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10 }}>
        <span style={{ color: '#334155', fontSize: '0.62rem', fontFamily: 'monospace' }}>
          📡 Fonte: Marinha do Brasil (CHM) · Coeficientes calculados via ciclo lunar
        </span>
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
  padding: '22px 20px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
};
