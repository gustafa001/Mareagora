import Link from 'next/link';
import { getStateSlug } from '@/lib/states';
import {
  getReferencePort,
  haversineDistance,
  isEstimatedLocation,
  type Port,
} from '@/lib/ports';

const CHM_TABUAS_URL = 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/tabuas-das-mares';

function describeOffset(offsetMinutes: number | undefined): string {
  if (!offsetMinutes) return 'sem defasagem de horário';
  const sinal = offsetMinutes > 0 ? '+' : '−';
  return `com defasagem de ${sinal}${Math.abs(offsetMinutes)} min`;
}

/**
 * Aviso exibido nos locais derivados (sem marégrafo próprio).
 * Componente de servidor, sem estado nem efeitos: não interfere na hidratação
 * de PortPageContent/HomeHero. Não renderiza nada para portos e estações.
 */
export default function EstimateNotice({ port }: { port: Port }) {
  if (!isEstimatedLocation(port)) return null;
  const reference = getReferencePort(port);
  if (!reference) return null;

  const name = port.cityName || port.name;
  const referenceName = reference.cityName || reference.name;
  const km = Math.max(1, Math.round(haversineDistance(port.lat, port.lon, reference.lat, reference.lon)));
  const referenceHref = `/mare/${getStateSlug(reference.state)}/${reference.slug}`;

  return (
    <div className="container mt-4">
      <aside
        role="note"
        aria-label="Aviso sobre a previsão estimada"
        className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"
      >
        <p className="font-semibold">Previsão estimada para {name}</p>
        <p className="mt-1">
          {name} não tem marégrafo próprio. Os horários vêm da estação de{' '}
          <Link href={referenceHref} className="font-medium underline">
            {referenceName}
          </Link>{' '}
          (Marinha do Brasil), a cerca de {km} km, {describeOffset(port.offsetMinutes)}. Essa defasagem ainda
          não foi confirmada em tábua oficial, então o horário real na praia pode ser diferente.
        </p>
        <p className="mt-1">
          Use como referência para pesca esportiva, lazer e passeios; não use para navegação. Em recifes,
          piscinas naturais e bancos de areia, chegue com folga antes da baixa-mar e confira a{' '}
          <a
            href={CHM_TABUAS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
          >
            tábua oficial da Marinha
          </a>{' '}
          do porto mais próximo.
        </p>
      </aside>
    </div>
  );
}

