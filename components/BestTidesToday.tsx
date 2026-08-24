import Link from "next/link";
import { PORTS } from "@/lib/ports";
import { getStateSlug } from "@/lib/states";
import { getEventosDia } from "@/lib/mare";
import { classifyToday } from "@/lib/tideQuality";

/**
 * Seção "Melhores do litoral hoje": destaca portos/praias com classificação
 * qualitativa alta no dia (piscinas naturais, surfe). Server Component puro —
 * roda no build/ISR e não hidrata no cliente.
 */
export default function BestTidesToday() {
  const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

  const destaques = PORTS.map((port) => {
    const quality = classifyToday(getEventosDia(port, hoje), null);
    return quality ? { port, quality } : null;
  })
    .filter((d): d is NonNullable<typeof d> => d !== null && d.quality.score >= 80)
    .sort((a, b) => b.quality.score - a.quality.score)
    .slice(0, 6);

  if (!destaques.length) return null;

  return (
    <section className="container py-12">
      <h2 className="text-xl sm:text-2xl font-bold font-syne text-white mb-1">
        Melhores do litoral hoje
      </h2>
      <p className="text-sm text-white/60 mb-5">
        Classificação gerada automaticamente a partir da tábua de marés de hoje.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {destaques.map(({ port, quality }) => (
          <Link
            key={port.slug}
            href={`/mare/${getStateSlug(port.state)}/${port.slug}`}
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${
              quality.tone === "excelente"
                ? "border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/20"
                : "border-sky-400/30 bg-sky-500/10 hover:bg-sky-500/20"
            }`}
          >
            <span className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">
                {port.cityName || port.name}
              </span>
              <span className="text-[11px] text-white/50">{port.state}</span>
            </span>
            <span className="shrink-0 text-xs font-medium text-white/80 text-right">
              {quality.emoji} {quality.label.replace(/^(Excelente|Bom|Condições boas) (para|de) /i, "")}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
