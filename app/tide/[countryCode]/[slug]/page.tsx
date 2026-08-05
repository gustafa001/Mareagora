export const runtime = 'nodejs';

import { notFound } from 'next/navigation';
import { getGlobalPlace, getNearbyGlobalPlaces } from '@/lib/globalPlaces';
import { getTideForLocation } from '@/lib/tideRouter';
import { t } from '@/lib/globalPreferences';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getNextHighAndLow, type TideEvent } from '@/lib/tideUtils';
import type { MareDia } from '@/lib/mare';
import rolloutStatus from '@/data/content-rollout-status.json';

const _rollout = rolloutStatus as Record<string, { approved: boolean }>;
function isApproved(slug: string): boolean {
  return _rollout[slug]?.approved === true;
}

import NavBar from '@/components/NavBar';
const TideWeekCard = dynamic(() => import('@/components/TideWeekCard'), { ssr: false });
import MonthlyTideTable from '@/components/MonthlyTideTable';
import SummaryCards from '@/components/SummaryCards';
import WindWaveCharts from '@/components/WindWaveCharts';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import SolunarTable from '@/components/SolunarTable';
import WeatherRadarCard from '@/components/port-operations/WeatherRadarCard';
const DailyScoreCard = dynamic(() => import('@/components/DailyScoreCard'), { ssr: false });
import TideSchemaMarkup from '@/components/TideSchemaMarkup';
import ShareButton from '@/components/ShareButton';
import { generateTideDescription } from '@/lib/tideDescription';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';

const BASE = 'https://mareagora.com.br';
const en = t('en');

interface Props {
  params: { countryCode: string; slug: string };
}

export async function generateMetadata({ params }: Props) {
  const place = getGlobalPlace(params.countryCode, params.slug);
  if (!place) return { title: 'Tide Table | MaréAgora' };
  const year = new Date().getFullYear();
  return {
    title: `Tide Table ${place.name} ${year} | MaréAgora`,
    description: `${place.name} tide table ${year}. Real-time waves, wind, rain radar and full monthly tide schedule for ${place.name}, ${place.countryName}.`,
    robots: isApproved(params.slug) ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: `${BASE}/tide/${params.countryCode}/${params.slug}`,
      languages: {
        'pt': `${BASE}/mare-mundo/${params.countryCode}/${params.slug}`,
        'en': `${BASE}/tide/${params.countryCode}/${params.slug}`,
        'x-default': `${BASE}/tide/${params.countryCode}/${params.slug}`,
      },
    },
  };
}

export default async function TideLocalPage({ params }: Props) {
  const place = getGlobalPlace(params.countryCode, params.slug);
  if (!place) notFound();

  const today = new Date().toISOString().slice(0, 10);
  const year = new Date().getFullYear();

  const { dias: weekDias, isEstimate, stationDistanceKm } = await getTideForLocation(
    { lat: place.lat, lon: place.lon },
    today,
    7
  );

  const { dias: yearDias } = await getTideForLocation(
    { lat: place.lat, lon: place.lon },
    `${year}-01-01`,
    365
  );

  if (!weekDias.length) {
    return (
      <main className="min-h-screen pb-20">
        <NavBar />
        <div className="container py-24 text-center">
          <p className="text-gray-500">{en.noData(place.name)}</p>
          <Link href="/tide" className="mt-4 inline-block text-blue-500 hover:underline">← World Tides</Link>
        </div>
      </main>
    );
  }

  const now = new Date();
  const utcOffsetMin = place.utcOffsetMin ?? 0;
  const placeDate = new Date(now.getTime() + utcOffsetMin * 60 * 1000);
  const currentMin = placeDate.getUTCHours() * 60 + placeDate.getUTCMinutes();
  const todayTides = weekDias[0]?.mares ?? [];

  const { nextHigh, nextLow } = getNextHighAndLow(todayTides as TideEvent[], currentMin);

  const nearby = getNearbyGlobalPlaces(place);

  return (
    <main className="min-h-screen pb-20">
      <TideSchemaMarkup
        locationName={place.name}
        countryOrStateName={place.countryName}
        lat={place.lat}
        lon={place.lon}
        nextHigh={nextHigh ? { hora: nextHigh.hora, altura_m: nextHigh.altura_m } : null}
        nextLow={nextLow ? { hora: nextLow.hora, altura_m: nextLow.altura_m } : null}
        pageUrl={`${BASE}/tide/${params.countryCode}/${params.slug}`}
        parentUrl={`${BASE}/tide`}
        parentName={place.countryName}
        locale="en"
      />
      <NavBar />

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 pt-24 pb-16 border-b border-white/5">
        <div className="container relative z-10">

          {/* Back button */}
          <div className="absolute top-0 left-4 md:left-0 pt-4 md:pt-0">
            <Link
              href="/tide"
              className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
            >
              ← World Tides
            </Link>
          </div>

          {/* hreflang cross-link — visible switcher */}
          <div className="absolute top-0 right-4 md:right-0 pt-4 md:pt-0">
            <Link
              href={`/mare-mundo/${params.countryCode}/${params.slug}`}
              className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md"
              aria-label="Ver em Português"
            >
              🇧🇷 PT
            </Link>
          </div>

          <div className="flex flex-col gap-3 items-center px-2 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 opacity-80">
              {place.countryName} · Harmonic Tide Model
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl text-white drop-shadow-md">
              Tide Table {place.name} — {year}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl opacity-90 font-medium font-syne hidden sm:block text-white/90">
              {place.name} · {place.countryName} · Harmonic Prediction
            </p>

            {isEstimate && (
              <div className="mt-3 bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs rounded-xl px-4 py-2 max-w-md">
                {en.estimateWarning(stationDistanceKm ?? 0)}
              </div>
            )}

            <div className="mt-4 mb-6">
              <p className="text-xs opacity-60">📍 Lat {place.lat.toFixed(4)}, Lon {place.lon.toFixed(4)}</p>
            </div>

            <ShareButton
              title={`Tide Table ${place.name} ${year} | MaréAgora`}
              text={`🌊 Check the tide forecast for ${place.name}, ${place.countryName} — MaréAgora`}
            />

            <div className="mb-20" />
          </div>
        </div>
      </section>

      <div className="container">
        <SummaryCards
          nextHigh={nextHigh as TideEvent | null}
          nextLow={nextLow as TideEvent | null}
          lat={place.lat}
          lon={place.lon}
          todayTides={todayTides as TideEvent[]}
        />

        <div className="mt-12 flex flex-col gap-8">

          <TideWeekCard days={weekDias} />

          <WeatherRadarCard lat={place.lat} lon={place.lon} />

          <MonthlyTideTable
            eventos={yearDias}
            portName={place.name}
            lat={place.lat}
            lon={place.lon}
          />

          {/* Daily Score */}
          <DailyScoreCard
            lat={place.lat}
            lon={place.lon}
            todayTides={todayTides as TideEvent[]}
            utcOffsetMin={place.utcOffsetMin ?? 0}
          />

          <WindWaveCharts lat={place.lat} lon={place.lon} />

          <ActivityRecommendations
            todayTides={todayTides as TideEvent[]}
            nextHigh={nextHigh as TideEvent | null}
            nextLow={nextLow as TideEvent | null}
            waveHeight={undefined}
            loading={false}
            slug={place.slug}
            categoria="turismo"
          />

          <SolunarTable
            lat={place.lat}
            lon={place.lon}
            offsetMinutes={place.utcOffsetMin ?? 0}
            weekTides={weekDias as MareDia[]}
          />

          {/* Nearby places */}
          {nearby.length > 0 && (
            <section className="classic-card">
              <h2 className="text-xl font-bold mb-4 font-syne">{en.nearbyPlaces}</h2>
              <ul className="flex flex-wrap gap-2">
                {nearby.map(({ place: p, distanciaKm }) => (
                  <li key={p.slug}>
                    <Link
                      href={`/tide/${p.countryCode}/${p.slug}`}
                      className="inline-flex items-center gap-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 transition-colors"
                    >
                      {p.name}
                      <span className="text-[10px] text-blue-400">{distanciaKm} km</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Editorial section / About the tides */}
          <section className="rounded-2xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-slate-200 font-syne mb-3 flex items-center gap-2">
              <span>📘</span> About {place.name} Tide Forecast
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {generateTideDescription(place.name, place.countryName, place.countryCode, place.lat, place.lon, 'en', place.slug)}
            </p>
          </section>

          {/* Legal disclaimer */}
          <div className="mt-2 p-6 bg-amber-50 border border-amber-100 rounded-xl">
            <h3 className="flex items-center gap-2 text-amber-800 font-bold mb-2">
              <span className="text-xl">⚠️</span> Notice
            </h3>
            <p className="text-amber-700/90 text-sm leading-relaxed">{en.disclaimer}</p>
          </div>

          {/* AdSense Footer */}
          <div className="mt-4 flex justify-center">
            <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
          </div>
        </div>
      </div>
    </main>
  );
}
