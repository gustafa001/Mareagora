import { TideQualityResult } from "@/lib/tideQuality";

interface Props {
  result: TideQualityResult | null;
}

const TONES: Record<TideQualityResult["tone"], string> = {
  excelente: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  bom: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  regular: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  calmo: "bg-slate-500/15 text-slate-300 border-slate-400/30",
};

/**
 * Pill com a classificação qualitativa do dia ("Excelente para piscinas
 * naturais", "Condições boas para surfe"...). Renderiza nada quando não há
 * resultado (ex.: antes da hidratação ou sem dados de maré).
 */
export default function TideQualityBadge({ result }: Props) {
  if (!result) return null;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-md ${TONES[result.tone]}`}
      title={result.detail}
    >
      <span aria-hidden>{result.emoji}</span>
      <span>{result.label}</span>
    </div>
  );
}
