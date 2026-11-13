import type { MareResumo } from '@/lib/monthlyTideCalc';
import { getCurvaDia } from '@/lib/tideDay';

/**
 * Gráfico da maré do dia (SVG renderizado no servidor, sem JavaScript no cliente).
 * A linha é uma curva estimada entre os extremos oficiais, que ficam marcados.
 */
export default function TideDayCurve({ mares, label }: { mares: MareResumo[]; label: string }) {
  const curva = getCurvaDia(mares);
  if (curva.length === 0) return null;

  const W = 640;
  const H = 230;
  const padL = 40;
  const padR = 16;
  const padT = 28;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const alturas = curva.map(p => p.altura);
  const minH = Math.min(...alturas, ...mares.map(m => m.altura_m));
  const maxH = Math.max(...alturas, ...mares.map(m => m.altura_m));
  const span = Math.max(maxH - minH, 0.2);
  const lo = minH - span * 0.12;
  const hi = maxH + span * 0.18;

  const x = (min: number) => padL + (min / 1440) * plotW;
  const y = (h: number) => padT + (1 - (h - lo) / (hi - lo)) * plotH;
  const toMin = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const linha = curva.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.min).toFixed(1)},${y(p.altura).toFixed(1)}`).join(' ');
  const area = `${linha} L${x(1440).toFixed(1)},${(padT + plotH).toFixed(1)} L${x(0).toFixed(1)},${(padT + plotH).toFixed(1)} Z`;

  // 3 linhas de grade horizontais com a altura em metros.
  const grade = [0, 0.5, 1].map(f => lo + (hi - lo) * f);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      className="w-full h-auto"
    >
      <title>{label}</title>
      <defs>
        <linearGradient id="tide-day-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38c9f0" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#38c9f0" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {grade.map(g => (
        <g key={g}>
          <line x1={padL} x2={W - padR} y1={y(g)} y2={y(g)} stroke="#ffffff" strokeOpacity="0.07" />
          <text x={padL - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="#7f9ab7">
            {g.toFixed(1).replace('.', ',')}
          </text>
        </g>
      ))}

      {[0, 6, 12, 18, 24].map(h => (
        <text key={h} x={x(h * 60)} y={H - 10} textAnchor={h === 0 ? 'start' : h === 24 ? 'end' : 'middle'} fontSize="11" fill="#7f9ab7">
          {String(h).padStart(2, '0')}h
        </text>
      ))}

      <path d={area} fill="url(#tide-day-fill)" />
      <path d={linha} fill="none" stroke="#38c9f0" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {mares.map(m => {
        const cx = x(toMin(m.hora));
        const cy = y(m.altura_m);
        const cor = m.alta ? '#5b8cff' : '#ff914d';
        const acima = m.alta;
        return (
          <g key={`${m.hora}-${m.alta ? 'a' : 'b'}`}>
            <circle cx={cx} cy={cy} r="5.5" fill={cor} stroke="#0d1b2e" strokeWidth="2" />
            <text
              x={cx}
              y={acima ? cy - 12 : cy + 20}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#e8f1f8"
            >
              {m.hora}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
