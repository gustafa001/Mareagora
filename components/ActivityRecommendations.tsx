'use client';

import { TideEvent } from '@/lib/tideUtils';
import { useEffect, useState } from 'react';

interface ActivityRecommendationsProps {
  todayTides: TideEvent[];
  nextHigh: TideEvent | null;
  nextLow: TideEvent | null;
  waveHeight?: number;
}

interface Activity {
  emoji: string;
  activity: string;
  status: 'ideal' | 'good' | 'wait' | 'flexible';
  time: string;
  tip: string;
  color: string;
  glow: string;
  details: { icon: string; label: string }[];
}

function statusBadge(status: Activity['status']) {
  const map = {
    ideal:    { label: 'Ideal agora', color: '#34d399', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)' },
    good:     { label: 'Bom agora',   color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.3)' },
    wait:     { label: 'Aguardar',    color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)' },
    flexible: { label: 'Flexível',    color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.3)' },
  };
  const s = map[status];
  return (
    <span style={{
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 20,
      padding: '3px 8px',
      fontSize: 9,
      fontWeight: 700,
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>{s.label}</span>
  );
}

export default function ActivityRecommendations({
  todayTides, nextHigh, nextLow, waveHeight = 0,
}: ActivityRecommendationsProps) {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const toMin = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  };

  let bestFishTime = nextLow || nextHigh;
  if (nextLow && nextHigh) {
    const lowMin = toMin(nextLow.hora);
    const highMin = toMin(nextHigh.hora);
    bestFishTime = Math.abs(lowMin - currentMin) < Math.abs(highMin - currentMin) ? nextLow : nextHigh;
  }

  const activities: Activity[] = [
    {
      emoji: '🏄',
      activity: 'Surf',
      status: waveHeight >= 0.8 ? 'ideal' : 'wait',
      time: waveHeight >= 0.8 ? 'Agora é bom!' : nextHigh ? `Próximo em ${nextHigh.hora}` : 'Verificar depois',
      tip: waveHeight >= 0.8
        ? `Ondas em ${waveHeight.toFixed(1)}m — espere maré média para melhor formação`
        : 'Ondas baixas agora. Melhora com maré alta gerando movimento de água',
      color: '#38bdf8',
      glow: 'rgba(56,189,248,0.12)',
      details: [
        { icon: '🌊', label: `Ondas: ${waveHeight.toFixed(1)} m` },
        { icon: '⬆️', label: nextHigh ? `Alta: ${nextHigh.hora} (${nextHigh.altura_m.toFixed(2)}m)` : '—' },
      ],
    },
    {
      emoji: '🎣',
      activity: 'Pesca',
      status: 'good',
      time: bestFishTime ? `Melhor em ${bestFishTime.hora}` : 'Verificar depois',
      tip: 'Melhores resultados na virada da maré — peixe se alimenta na mudança de corrente',
      color: '#fb923c',
      glow: 'rgba(251,146,60,0.12)',
      details: [
        { icon: '🔄', label: `Virada: ${bestFishTime?.hora || '—'}` },
        { icon: '📏', label: bestFishTime ? `${bestFishTime.altura_m.toFixed(2)} m` : '—' },
      ],
    },
    {
      emoji: '🤿',
      activity: 'Mergulho',
      status: nextHigh && nextHigh.altura_m > 1.0 ? 'good' : 'wait',
      time: nextHigh ? `Próximo em ${nextHigh.hora}` : 'Verificar depois',
      tip: `Maré alta ${nextHigh ? nextHigh.altura_m.toFixed(2) + 'm' : '--'} — maior profundidade e melhor visibilidade`,
      color: '#34d399',
      glow: 'rgba(52,211,153,0.12)',
      details: [
        { icon: '📈', label: `Alta: ${nextHigh?.hora || '—'}` },
        { icon: '💧', label: `${nextHigh?.altura_m.toFixed(2) || '—'} m` },
      ],
    },
    {
      emoji: '🚣',
      activity: 'Caiaque',
      status: 'flexible',
      time: 'Flexível',
      tip: 'Evite os picos de alta e baixa — maré média oferece corrente mais suave e segura',
      color: '#a78bfa',
      glow: 'rgba(167,139,250,0.12)',
      details: [
        { icon: '🔃', label: 'Maré média ideal' },
        { icon: '💨', label: 'Atenção ao vento' },
      ],
    },
  ];

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17,
            flexShrink: 0,
          }}>💡</div>
          <div>
            <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              Atividades — Hoje
            </div>
            <div style={{ color: '#475569', fontSize: 10, fontFamily: 'monospace', marginTop: 1 }}>
              baseado em marés e ondas atuais
            </div>
          </div>
        </div>
      </div>

      {/* Grid — 1 coluna no mobile, 2 no desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 12,
      }}>
        {activities.map((a, idx) => (
          <div key={idx} style={{
            background: a.glow,
            border: `1px solid ${a.color}25`,
            borderRadius: 16,
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {/* Activity header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{
                  fontSize: '1.6rem',
                  lineHeight: 1,
                  flexShrink: 0,
                  filter: `drop-shadow(0 0 8px ${a.color}60)`,
                }}>{a.emoji}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    color: '#e2e8f0',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>{a.activity}</div>
                  <div style={{
                    color: a.color,
                    fontSize: '0.68rem',
                    fontFamily: 'monospace',
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>{a.time}</div>
                </div>
              </div>
              {statusBadge(a.status)}
            </div>

            {/* Tip */}
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 10,
              padding: '8px 10px',
            }}>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', lineHeight: 1.5 }}>
                💬 {a.tip}
              </span>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', gap: 8 }}>
              {a.details.map((d, di) => (
                <div key={di} style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 8,
                  padding: '5px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  minWidth: 0,
                }}>
                  <span style={{ fontSize: '0.75rem', flexShrink: 0 }}>{d.icon}</span>
                  <span style={{
                    color: '#64748b',
                    fontSize: '0.62rem',
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer tip */}
      <div style={{
        marginTop: 14,
        padding: '10px 14px',
        background: 'rgba(251,191,36,0.06)',
        border: '1px solid rgba(251,191,36,0.12)',
        borderRadius: 12,
      }}>
        <span style={{ color: '#78716c', fontSize: '0.7rem', fontFamily: 'monospace' }}>
          💡 Combine com a previsão de vento e ondas para melhorar seu planejamento
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
  padding: '22px 16px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
};
