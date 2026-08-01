// components/CardPrevisaoRessacaResumo.tsx
// Versão compacta e cacheada (Server Component) do card de ressaca — útil em
// listagens/home, onde carregar o RessacaAlert completo (client, com gauge,
// chips e gráfico de 7 dias) seria pesado demais. Usa a mesma classificação
// central de lib/ressaca.ts para nunca divergir do card completo.
import { getSeaConditionsCached } from '@/lib/seaConditions';
import { classifyRessaca, calcularPicoDoDia } from '@/lib/ressaca';
import { degToCompass } from '@/lib/tideUtils';

interface CardPrevisaoRessacaResumoProps {
  lat: number;
  lon: number;
  nomePraia: string;
}

export default async function CardPrevisaoRessacaResumo({
  lat,
  lon,
  nomePraia,
}: CardPrevisaoRessacaResumoProps) {
  let dados;
  try {
    dados = await getSeaConditionsCached(lat, lon);
  } catch {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        Não foi possível carregar a previsão de ressaca para {nomePraia} agora.
        Tente novamente em instantes.
      </div>
    );
  }

  const pico = calcularPicoDoDia(dados.hourlyToday);
  const atual = classifyRessaca(dados.swellHeight, dados.swellPeriod);
  const emAlerta = atual.severity === 'ressaca' || atual.severity === 'ressaca-forte';

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${atual.color} 0%, #0d1526 130%)`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/70">
            Previsão de ressaca
          </p>
          <h3 className="text-lg font-semibold font-syne">{nomePraia}</h3>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            emAlerta ? 'bg-white text-red-700' : 'bg-white/15 text-white'
          }`}
          role="status"
        >
          {emAlerta ? '⚠' : '〜'} {atual.label}
        </span>
      </div>

      <div className="mt-6 flex items-end gap-6">
        <div>
          <span className="text-5xl font-bold tabular-nums font-syne">
            {(dados.swellHeight ?? 0).toFixed(1).replace('.', ',')}
          </span>
          <span className="ml-1 text-xl font-medium text-white/80">m</span>
          <p className="mt-1 text-xs text-white/70">agora</p>
        </div>

        {pico && (
          <div className="flex flex-col gap-2 pb-1 text-sm text-white/85">
            <div>
              <span className="font-semibold">{pico.alturaM.toFixed(1)}m</span>
              <span className="ml-1 text-white/60">pico às {pico.horario}</span>
            </div>
            {pico.direcaoGraus !== null && (
              <div>
                <span className="font-semibold">{degToCompass(pico.direcaoGraus)}</span>
                <span className="ml-1 text-white/60">direção do swell</span>
              </div>
            )}
          </div>
        )}
      </div>

      <svg
        className="motion-safe:animate-[drift_9s_linear_infinite] absolute inset-x-0 bottom-0 h-10 w-[200%] opacity-25"
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 20 C 40 0, 80 40, 120 20 S 200 0, 240 20 S 320 40, 360 20 S 400 0, 400 20 V40 H0 Z"
          fill="white"
        />
      </svg>

      <p className="relative mt-6 text-[11px] text-white/60">
        Fonte: Open-Meteo (modelo GFS Wave) · atualizado a cada hora
      </p>
    </div>
  );
}
