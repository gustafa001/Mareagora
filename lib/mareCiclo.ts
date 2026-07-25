import { getMoonAge, getTideCoefficient } from '@/lib/tideUtils';

export interface PicoMare {
  data: Date;
  coeficiente: number;
}

/**
 * Varre os próximos `dias` a partir de hoje e encontra os picos (local máximos ou mínimos)
 * do coeficiente astronômico — ou seja, as datas de sizígia (maré viva) ou quadratura (maré morta).
 */
export function getProximosPicos(tipo: 'viva' | 'morta', dias = 90): PicoMare[] {
  const hoje = new Date();
  hoje.setHours(12, 0, 0, 0);

  const valores: { data: Date; coef: number }[] = [];
  for (let i = 0; i < dias; i++) {
    const d = new Date(hoje);
    d.setDate(d.getDate() + i);
    const coef = getTideCoefficient(getMoonAge(d)).value;
    valores.push({ data: d, coef });
  }

  const picos: PicoMare[] = [];
  for (let i = 1; i < valores.length - 1; i++) {
    const { data, coef } = valores[i];
    const prev = valores[i - 1].coef;
    const next = valores[i + 1].coef;

    if (tipo === 'viva' && coef >= prev && coef >= next && coef >= 85) {
      picos.push({ data, coeficiente: coef });
    }
    if (tipo === 'morta' && coef <= prev && coef <= next && coef <= 45) {
      picos.push({ data, coeficiente: coef });
    }
  }

  return picos;
}
