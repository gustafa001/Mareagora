export const runtime = 'nodejs';

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getGlobalPlace, getNearbyGlobalPlaces } from '@/lib/globalPlaces';
import { getTideForLocation } from '@/lib/tideRouter';
import { getGlobalPreferences, t, formatHeight, formatHour } from '@/lib/globalPreferences';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { TideEvent } from '@/lib/tideUtils';
import type { MareDia } from '@/lib/mare';

// Componentes idênticos ao das páginas BR
import NavBar from '@/components/NavBar';
const TideWeekCard = dynamic(() => import('@/components/TideWeekCard'), { ssr: false });
import MonthlyTideTable from '@/components/MonthlyTideTable';
import SummaryCards from '@/components/SummaryCards';
import WindWaveCharts from '@/components/WindWaveCharts';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import SolunarTable from '@/components/SolunarTable';
import WeatherRadarCard from '@/components/port-operations/WeatherRadarCard';
import WavesCard from '@/components/WavesCard';

interface Props {
  params: { pais: string; slug: string };
}

const BASE = 'https://mareagora.com.br';

export async function generateMetadata({ params }: Props) {
  const place = getGlobalPlace(params.pais, params.slug);
  if (!place) return { title: 'Maré no Mundo | MaréAgora' };
  const ano = new Date().getFullYear();
  return {
    title: `Tábua de Maré ${place.name} ${ano} | MaréAgora`,
    description: `Previsão completa de maré, ondas, vento e condições do mar em ${place.name}, ${place.countryName}. Tábua de marés ${ano} atualizada.`,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${BASE}/mare-mundo/${params.pais}/${params.slug}`,
      languages: {
        'pt': `${BASE}/mare-mundo/${params.pais}/${params.slug}`,
        'en': `${BASE}/tide/${params.pais}/${params.slug}`,
        'x-default': `${BASE}/mare-mundo/${params.pais}/${params.slug}`,
      },
    },
  };
}

export default async function MareMundoLocalPage({ params }: Props) {
  const place = getGlobalPlace(params.pais, params.slug);
  if (!place) notFound();

  const acceptLanguage = headers().get('accept-language');
  const prefs = getGlobalPreferences(acceptLanguage);
  const strings = t(prefs.locale);

  const hoje = new Date().toISOString().slice(0, 10);
  const ano = new Date().getFullYear();

  // Busca 7 dias para os cards de resumo
  const { dias: weekDias, isEstimate, stationDistanceKm } = await getTideForLocation(
    { lat: place.lat, lon: place.lon },
    hoje,
    7
  );

  // Busca 365 dias para a tábua mensal
  const { dias: yearDias } = await getTideForLocation(
    { lat: place.lat, lon: place.lon },
    `${ano}-01-01`,
    365
  );

  if (!weekDias.length) {
    return (
      <main className="min-h-screen pb-20">
        <NavBar />
        <div className="container py-24 text-center">
          <p className="text-gray-500">{strings.noData(place.name)}</p>
          <Link href="/mare-mundo" className="mt-4 inline-block text-blue-500 hover:underline">← Voltar</Link>
        </div>
      </main>
    );
  }

  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const todayTides = weekDias[0]?.mares ?? [];

  const heights = todayTides.length > 0 ? todayTides.map(t => t.altura_m) : [0];
  const maxH = Math.max(...heights);
  const minH = Math.min(...heights);
  const avgH = (maxH + minH) / 2;

  const nextHigh = todayTides.find(t => {
    const [h, m] = t.hora.split(':').map(Number);
    return (h || 0) * 60 + (m || 0) > currentMin && t.altura_m >= avgH;
  }) ?? todayTides.find(t => t.altura_m >= avgH) ?? null;

  const nextLow = todayTides.find(t => {
    const [h, m] = t.hora.split(':').map(Number);
    return (h || 0) * 60 + (m || 0) > currentMin && t.altura_m < avgH;
  }) ?? todayTides.find(t => t.altura_m < avgH) ?? null;

  const nearby = getNearbyGlobalPlaces(place);

  return (
    <main className="min-h-screen pb-20">
      <NavBar />

      {/* Hero Section — mesma estrutura BR mas com gradiente em vez de vídeo */}
      <section className="hero-section relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #020917 0%, #051835 40%, #082952 70%, #0a3a6b 100%)',
          }}
        />
        {/* Animated ocean overlay */}
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 20% 50%, #1d4ed8 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #0891b2 0%, transparent 50%)',
          }}
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="hero-overlay" />

        <div className="container relative z-30 text-white text-center pt-24 md:pt-16">
          {/* Botão Voltar */}
          <div className="absolute top-0 left-4 md:left-0 pt-4 md:pt-0">
            <Link
              href="/mare-mundo"
              className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
            >
              ← Maré no Mundo
            </Link>
          </div>

          {/* Trocar Idioma — EN */}
          <div className="absolute top-0 right-4 md:right-0 pt-4 md:pt-0">
            <Link
              href={`/tide/${params.pais}/${params.slug}`}
              className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md"
              aria-label="View in English"
            >
              🇺🇸 EN
            </Link>
          </div>

          <div className="flex flex-col gap-3 items-center px-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 opacity-80">
              {place.countryName} · Previsão Global
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl">
              Tábua de Maré {place.name} — {ano}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl opacity-90 font-medium font-syne hidden sm:block">
              {place.name} · {place.countryName} · Modelo Harmônico
            </p>

            {isEstimate && (
              <div className="mt-3 bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs rounded-xl px-4 py-2 max-w-md">
                {strings.estimateWarning(stationDistanceKm ?? 0)}
              </div>
            )}

            <div className="mt-4 mb-24">
              <p className="text-xs opacity-60">
                📍 Lat {place.lat.toFixed(4)}, Lon {place.lon.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Cards de resumo — idênticos ao BR */}
        <SummaryCards
          nextHigh={nextHigh as TideEvent | null}
          nextLow={nextLow as TideEvent | null}
          lat={place.lat}
          lon={place.lon}
        />

        <div className="mt-12 flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-8">
          <div className="flex flex-col gap-8">

            {/* Gráfico semanal */}
            <TideWeekCard days={weekDias} />

            {/* Radar de chuva */}
            <div>
              <WeatherRadarCard lat={place.lat} lon={place.lon} />
            </div>

            {/* Tábua mensal de 30 dias */}
            <MonthlyTideTable
              eventos={yearDias}
              portName={place.name}
              lat={place.lat}
              lon={place.lon}
            />

            {/* Gráficos de ondas e vento */}
            <WindWaveCharts lat={place.lat} lon={place.lon} />

            {/* Recomendações de atividades */}
            <ActivityRecommendations
              todayTides={todayTides as TideEvent[]}
              nextHigh={nextHigh as TideEvent | null}
              nextLow={nextLow as TideEvent | null}
              waveHeight={undefined}
              loading={false}
              slug={place.slug}
              categoria="turismo"
            />

            {/* Tabela solunar */}
            <SolunarTable
              lat={place.lat}
              lon={place.lon}
              offsetMinutes={place.utcOffsetMin ?? 0}
              weekTides={weekDias as MareDia[]}
            />

            {/* Locais próximos */}
            {nearby.length > 0 && (
              <section className="classic-card">
                <h2 className="text-xl font-bold mb-4 font-syne">Locais próximos</h2>
                <ul className="flex flex-wrap gap-2">
                  {nearby.map(({ place: p, distanciaKm }) => (
                    <li key={p.slug}>
                      <Link
                        href={`/mare-mundo/${p.countryCode}/${p.slug}`}
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

            {/* Aviso legal */}
            <div className="mt-2 p-6 bg-red-50 border border-red-100 rounded-xl">
              <h3 className="flex items-center gap-2 text-red-800 font-bold mb-2">
                <span className="text-xl">⚠️</span> {strings.disclaimer.split('.')[0]}
              </h3>
              <p className="text-red-700/90 text-sm leading-relaxed">
                {strings.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
