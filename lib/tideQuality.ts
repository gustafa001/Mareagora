/**
 * MaréAgora — Classificação qualitativa do dia (piscinas naturais, surfe,
 * pesca) a partir dos eventos de maré do dia e da hora local atual.
 *
 * Funções puras e defensivas: nunca lançam; retornam null quando não há
 * dados suficientes. Usadas por components/TideQualityBadge.tsx.
 */

export interface MareEventoLite {
  hora: string; // "03:40"
  altura_m: number;
  tipo?: string;
}

export interface TideQualityResult {
  /** 0–100 */
  score: number;
  label: string;
  detail: string;
  emoji: string;
  /** classes Tailwind para o pill */
  tone: "excelente" | "bom" | "regular" | "calmo";
}

type Lang = "pt" | "en";

const LABELS: Record<Lang, Record<"piscinasExcelente" | "piscinasBoa" | "surfe" | "pesca" | "calma", { label: string; detail: (d: string) => string }>> = {
  pt: {
    piscinasExcelente: { label: "Excelente para piscinas naturais", detail: (h) => `Baixa-mar seca (${h} m) hoje` },
    piscinasBoa: { label: "Bom para piscinas naturais", detail: (h) => `Baixa-mar em ${h} m` },
    surfe: { label: "Condições boas para surfe", detail: (a) => `Amplitude de ${a} m` },
    pesca: { label: "Janela favorável para pesca", detail: (a) => `Maré em movimento (amplitude ${a} m)` },
    calma: { label: "Dia de maré calma", detail: (a) => `Amplitude pequena (${a} m)` },
  },
  en: {
    piscinasExcelente: { label: "Excellent for natural pools", detail: (h) => `Dry low tide (${h} m) today` },
    piscinasBoa: { label: "Good for natural pools", detail: (h) => `Low tide at ${h} m` },
    surfe: { label: "Good surfing conditions", detail: (a) => `${a} m tidal range` },
    pesca: { label: "Favorable fishing window", detail: (a) => `Moving tide (${a} m range)` },
    calma: { label: "Calm tide day", detail: (a) => `Small tidal range (${a} m)` },
  },
};

const SURFE_ESTADO: Record<Lang, Record<string, string>> = {
  pt: { subindo: "maré enchendo", baixando: "maré secando", neutro: "hoje" },
  en: { subindo: "rising tide", baixando: "falling tide", neutro: "today" },
};

function toMin(hora: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hora?.trim() ?? "");
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** Estado da maré agora: subindo, baixando ou próximo de virada. */
function estadoAgora(
  eventos: MareEventoLite[],
  nowMin: number
): "subindo" | "baixando" | null {
  const pts = eventos
    .map((e) => ({ min: toMin(e.hora), h: e.altura_m }))
    .filter((p): p is { min: number; h: number } => p.min !== null && typeof p.h === "number")
    .sort((a, b) => a.min - b.min);
  if (pts.length < 2) return null;

  let prev = pts[pts.length - 1]; // antes da primeira virada do dia
  prev = { min: prev.min - 24 * 60, h: prev.h };
  let next: { min: number; h: number } | null = null;
  for (const p of pts) {
    if (p.min > nowMin) {
      next = p;
      break;
    }
    prev = p;
  }
  if (!next) next = { ...pts[0], min: pts[0].min + 24 * 60 };

  // Perto da virada (< 30 min), considerar "subindo" se o próximo evento é
  // mais alto que o anterior (preia-mar adiante).
  return next.h >= prev.h ? "subindo" : "baixando";
}

/**
 * Classifica o dia para as atividades litorâneas mais buscadas.
 * Prioridade: piscinas naturais > surfe > pesca > dia calmo.
 */
export function classifyToday(
  eventos: MareEventoLite[] | undefined,
  nowMin: number | null,
  lang: Lang = "pt"
): TideQualityResult | null {
  if (!eventos || eventos.length < 2) return null;

  const alturas = eventos.map((e) => e.altura_m).filter((h) => Number.isFinite(h));
  if (alturas.length < 2) return null;

  const L = LABELS[lang];
  const minH = Math.min(...alturas);
  const maxH = Math.max(...alturas);
  const amplitude = maxH - minH;
  const amp = amplitude.toFixed(2);
  const low = minH.toFixed(2);

  const estado = nowMin === null ? null : estadoAgora(eventos, nowMin);
  const estadoWord =
    lang === "en"
      ? estado === "subindo"
        ? SURFE_ESTADO.en.subindo
        : estado === "baixando"
          ? SURFE_ESTADO.en.baixando
          : SURFE_ESTADO.en.neutro
      : estado === "subindo"
        ? SURFE_ESTADO.pt.subindo
        : estado === "baixando"
          ? SURFE_ESTADO.pt.baixando
          : SURFE_ESTADO.pt.neutro;

  // 1) Piscinas naturais: maré baixa bem seca é o gatilho (padrão NE/SE).
  if (minH <= 0.35) {
    return {
      score: 95,
      label: L.piscinasExcelente.label,
      detail: L.piscinasExcelente.detail(low),
      emoji: "🤿",
      tone: "excelente",
    };
  }
  if (minH <= 0.55 && amplitude >= 0.6) {
    return {
      score: 80,
      label: L.piscinasBoa.label,
      detail: L.piscinasBoa.detail(low),
      emoji: "🤿",
      tone: "bom",
    };
  }

  // 2) Surfe: amplitude generosa com maré em movimento ajuda.
  if (amplitude >= 0.9) {
    return {
      score: 75,
      label: L.surfe.label,
      detail: `${L.surfe.detail(amp)} — ${estadoWord}`,
      emoji: "🏄",
      tone: "bom",
    };
  }

  // 3) Pesca: peixe activity acompanha água em movimento.
  if (amplitude >= 0.4) {
    return {
      score: 65,
      label: L.pesca.label,
      detail: L.pesca.detail(amp),
      emoji: "🎣",
      tone: "regular",
    };
  }

  // 4) Quadratura: dia de marés fracas.
  return {
    score: 40,
    label: L.calma.label,
    detail: L.calma.detail(amp),
    emoji: "😌",
    tone: "calmo",
  };
}
