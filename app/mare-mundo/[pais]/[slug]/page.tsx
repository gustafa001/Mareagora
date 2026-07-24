export const runtime = 'nodejs';

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getGlobalPlace, getNearbyGlobalPlaces } from '@/lib/globalPlaces';
import { getTideForLocation } from '@/lib/tideRouter';
import { getGlobalPreferences, t, formatHeight, formatHour } from '@/lib/globalPreferences';
import TideWeekCard from '@/components/TideWeekCard';
import TideTable from '@/components/TideTable';
import WavesCard from '@/components/WavesCard';
import Link from 'next/link';
import type { TideEvent } from '@/lib/tideUtils';

interface Props {
  params: { pais: string; slug: string };
}

export async function generateMetadata({ params }: Props) {
  const place = getGlobalPlace(params.pais, params.slug);
  if (!place) return { title: 'Maré no Mundo | MaréAgora' };
  return {
    title: `Maré em ${place.name} | MaréAgora`,
    description: `Previsão de maré, ondas e condições do mar em ${place.name}, ${place.countryName}.`,
  };
}

export default async function MareMundoLocalPage({ params }: Props) {
  const place = getGlobalPlace(params.pais, params.slug);
  if (!place) notFound();

  const acceptLanguage = headers().get('accept-language');
  const prefs = getGlobalPreferences(acceptLanguage);
  const strings = t(prefs.locale);

  const hoje = new Date().toISOString().slice(0, 10);
  const { dias, isEstimate, stationDistanceKm } = await getTideForLocation(
    { lat: place.lat, lon: place.lon },
    hoje,
    7
  );

  if (!dias.length) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500">{strings.noData(place.name)}</p>
      </main>
    );
  }

  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const nearby = getNearbyGlobalPlaces(place);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-syne text-3xl mb-1">{strings.tideTitle} {place.name}</h1>
      <p className="text-gray-400 text-sm mb-6">{place.countryName}</p>

      {isEstimate && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-8">
          {strings.estimateWarning(stationDistanceKm ?? 0)}
        </div>
      )}

      {/* Componentes existentes recebem os dados crus (hora 24h, metro) — sem alteração neles.
          A formatação por preferência (formatHeight/formatHour) fica só nos textos ao redor. */}
      <TideWeekCard days={dias} />

      <div className="mt-8">
        <TideTable tides={dias[0].mares as TideEvent[]} currentMin={currentMin} />
        <p className="text-xs text-gray-400 mt-2">
          {dias[0].mares[0] && (
            <>Ex.: {formatHour(dias[0].mares[0].hora, prefs.hourFormat)} — {formatHeight(dias[0].mares[0].altura_m, prefs.unit)}</>
          )}
        </p>
      </div>

      <div className="mt-8">
        <WavesCard lat={place.lat} lon={place.lon} />
      </div>

      {nearby.length > 0 && (
        <section className="mt-8">
          <h2 className="font-syne text-lg mb-3">{strings.nearbyPlaces}</h2>
          <ul className="flex flex-wrap gap-2">
            {nearby.map(({ place: p, distanciaKm }) => (
              <li key={p.slug}>
                <Link
                  href={`/mare-mundo/${p.countryCode}/${p.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {p.name} ({distanciaKm} km)
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-gray-400 mt-8">{strings.disclaimer}</p>
    </main>
  );
}
