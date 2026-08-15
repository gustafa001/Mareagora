import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GLOBAL_PLACES, getPlacesByCountry, isAutoPlace } from '@/lib/globalPlaces';
import { enCountryName, enPlaceName } from '@/lib/globalNames';
import NavBar from '@/components/NavBar';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';

const BASE = 'https://mareagora.com.br';

function getCountryFlag(code: string): string {
  try {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
}

export function generateStaticParams() {
  const countries = Array.from(new Set(GLOBAL_PLACES.map(p => p.countryCode)));
  return countries.map(countryCode => ({ countryCode }));
}

type CountryPageProps = { params: { countryCode: string } };

export async function generateMetadata({ params }: CountryPageProps) {
  const places = getPlacesByCountry(params.countryCode);
  const first = places[0];
  if (!first) return { title: 'World Tide Tables | MaréAgora' };
  const countryName = enCountryName(first.countryCode, first.countryName);
  return {
    title: `Tide Tables ${countryName} | MaréAgora`,
    description: `Harmonic tide tables for ${places.length} coastal locations in ${countryName}. High and low tide times, wave and wind charts for ${countryName}.`,
    alternates: {
      canonical: `${BASE}/tide/${params.countryCode}`,
      languages: {
        'pt': `${BASE}/mare-mundo/${params.countryCode}`,
        'en': `${BASE}/tide/${params.countryCode}`,
        'x-default': `${BASE}/tide/${params.countryCode}`,
      },
    },
  };
}

export default function TideCountryPage({ params }: CountryPageProps) {
  const allPlaces = getPlacesByCountry(params.countryCode);
  if (allPlaces.length === 0) notFound();

  const curated = allPlaces.filter(p => !isAutoPlace(p.slug));
  const auto = allPlaces.filter(p => isAutoPlace(p.slug));
  const flag = getCountryFlag(params.countryCode);
  const countryName = enCountryName(params.countryCode, allPlaces[0].countryName);

  return (
    <main className="min-h-screen pb-20 bg-[#070d19] text-white">
      <NavBar />

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 pt-24 pb-16 border-b border-white/5">
        <div className="container relative z-10 text-center">
          <Link
            href="/tide"
            className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
          >
            ← World Tides
          </Link>

          <div className="mt-6 flex flex-col gap-3 items-center px-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 opacity-80">
              {flag} {countryName}
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl text-white drop-shadow-md">
              Tide Tables {countryName}
            </h1>
            <p className="text-sm sm:text-lg opacity-90 font-medium font-syne text-white/90">
              Harmonic tide predictions for {allPlaces.length} {allPlaces.length === 1 ? 'coastal location' : 'coastal locations'}
            </p>
          </div>
        </div>
      </section>

      <div className="container -mt-10 relative z-40">
        {curated.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curated.map(p => (
              <Link
                key={p.slug}
                href={`/tide/${p.countryCode}/${p.slug}`}
                className="group rounded-[20px] p-6 border border-white/10 shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-900/20"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-syne text-lg font-bold text-slate-100">{enPlaceName(p.name)}</h2>
                  <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">→</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">📍 {p.lat.toFixed(2)}, {p.lon.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}

        {auto.length > 0 && (
          <details className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <summary className="cursor-pointer font-syne font-bold text-sm text-slate-300 hover:text-white">
              All {auto.length} tide stations in {countryName}
            </summary>
            <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {auto.map(p => (
                <li key={p.slug}>
                  <Link
                    href={`/tide/${p.countryCode}/${p.slug}`}
                    className="block text-xs text-slate-500 hover:text-blue-400 py-1 px-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                  >
                    {enPlaceName(p.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="mt-8 flex justify-center">
          <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
        </div>
      </div>
    </main>
  );
}