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
    <div className="container mt-3">
      <aside
        role="note"
        aria-label="Aviso sobre a previsão estimada"
        className="text-xs leading-relaxed text-slate-500"
      >
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true">ⓘ</span>
            <span>
              Previsão estimada com base na estação de {referenceName}.{' '}
              <span className="underline decoration-dotted underline-offset-2 group-open:hidden">Saiba mais</span>
            </span>
          </summary>
          <div className="mt-2 space-y-1.5 border-l-2 border-slate-200 pl-3">
            <p>
              {name} não tem marégrafo próprio. Os horários vêm da estação de{' '}
              <Link href={referenceHref} className="font-medium underline">
                {referenceName}
              </Link>{' '}
              (Marinha do Brasil), a cerca de {km} km, {describeOffset(port.offsetMinutes)}. Essa defasagem
              ainda não foi confirmada em tábua oficial, então o horário real na praia pode ser diferente.
            </p>
            <p>
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
          </div>
        </details>
      </aside>
    </div>
  );
}
