/**
 * MaréAgora — Classificação de Ressaca (Swell)
 * ---------------------------------------------------------------------------
 * "Ressaca" no sentido de mar agitado por swell de longo período — diferente
 * de vento local (wind wave). Usa swell_wave_height + swell_wave_period do
 * Open-Meteo Marine API (ver hooks/useSeaConditions.ts).
 *
 * Regra de classificação:
 *  - Período curto (<8s) tende a ser vento local (wind chop), menos perigoso
 *    mesmo com altura razoável.
 *  - Período longo (>=10s) indica swell de verdade (energia vinda de longe),
 *    mais perigoso mesmo com altura moderada — típico de frentes frias e
 *    ressacas de fato.
 */

export type RessacaSeverity = 'calmo' | 'moderado' | 'ressaca' | 'ressaca-forte';

export interface RessacaClassification {
  severity: RessacaSeverity;
  label: string;
  color: string;
  description: string;
}

export function classifyRessaca(
  swellHeight: number | null,
  swellPeriod: number | null
): RessacaClassification {
  if (swellHeight === null) {
    return { severity: 'calmo', label: 'Sem dados', color: '#64748b', description: 'Dados de swell indisponíveis no momento.' };
  }

  // período longo aumenta a "nota" de severidade em relação à altura crua
  const longPeriod = swellPeriod !== null && swellPeriod >= 10;
  const effectiveHeight = longPeriod ? swellHeight + 0.4 : swellHeight;

  if (effectiveHeight < 1.0) {
    return { severity: 'calmo', label: 'Mar calmo', color: '#10b981', description: 'Condições tranquilas para banho e atividades na praia.' };
  }
  if (effectiveHeight < 1.8) {
    return { severity: 'moderado', label: 'Mar moderado', color: '#38bdf8', description: 'Ondulação perceptível, mas dentro da normalidade para a região.' };
  }
  if (effectiveHeight < 2.5) {
    return {
      severity: 'ressaca',
      label: 'Ressaca',
      color: '#f59e0b',
      description: longPeriod
        ? 'Swell de período longo — mar agitado mesmo em dias sem vento forte. Atenção redobrada no banho.'
        : 'Mar agitado. Bancos de areia e correntes podem mudar rapidamente.',
    };
  }
  return {
    severity: 'ressaca-forte',
    label: 'Ressaca forte',
    color: '#ef4444',
    description: 'Ondas grandes e correntes de retorno prováveis. Evite o banho de mar e fique atento a avisos da Marinha e da Defesa Civil.',
  };
}
