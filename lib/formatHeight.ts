export type HeightUnit = 'm' | 'ft';

/** Converte metros pra pés quando a preferência do usuário for 'ft'. */
export function formatHeight(heightM: number, unit: HeightUnit): string {
  if (unit === 'ft') {
    return `${(heightM * 3.28084).toFixed(1)} ft`;
  }
  return `${heightM.toFixed(2)} m`;
}
