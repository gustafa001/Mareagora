import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GLOBAL_PLACES, getPlacesByCountry, isAutoPlace } from '@/lib/globalPlaces';
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
  return countries.map(pais => ({ pais }));
}

type CountryPageProps = { params: { pais: string } };

export async function generateMetadata({ params }: CountryPageProps) {
  const places = getPlacesByCountry(params.pais);
  const first = places[0];
  if (!first) return { title: 'Maré no Mundo | MaréAgora' };
  const countryName = first.countryName;
  return {
    title: `Tábua de Marés ${countryName} | MaréAgora`,
    description: `Tábua de marés harmônica para ${places.length} locais costeiros em ${countryName}. Horários de maré alta e baixa, ondas e vento em ${countryName}.`,
    alternates: {
      canonical: `${BASE}/mare-mundo/${params.pais}`,
      languages: {
        'pt': `${BASE}/mare-mundo/${params.pais}`,
        'en': `${BASE}/tide/${params.pais}`,
        'x-default': `${BASE}/mare-mundo/${params.pais}`,
      },
    },
  };
}

export default function MareMundoCountryPage({ params }: CountryPageProps) {
  const allPlaces = getPlacesByCountry(params.pais);
  if (allPlaces.length === 0) notFound();

  const curados = allPlaces.filter(p => !isAutoPlace(p.slug));
  const auto = allPlaces
    .filter(p => isAutoPlace(p.slug))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt'));
  const flag = getCountryFlag(params.pais);
  const countryName = allPlaces[0].countryName;

  return (
    <main className="min-h-screen pb-20 bg-[#070d19] text-white">
      <NavBar />

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 pt-24 pb-16 border-b border-white/5">
        <div className="container relative z-10 text-center">
          <Link
            href="/mare-mundo"
            className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
          >
            ← Maré no Mundo
          </Link>

          <div className="mt-6 flex flex-col gap-3 items-center px-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 opacity-80">
              {flag} {countryName}
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl text-white drop-shadow-md">
              Tábua de Marés {countryName}
            </h1>
            <p className="text-sm sm:text-lg opacity-90 font-medium font-syne text-white/90">
              Previsão harmônica de marés em {allPlaces.length} {allPlaces.length === 1 ? 'local costeiro' : 'locais costeiros'}
            </p>
          </div>
        </div>
      </section>

      <div className="container -mt-10 relative z-40">
        {curados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curados.map(p => (
              <Link
                key={p.slug}
                href={`/mare-mundo/${p.countryCode}/${p.slug}`}
                className="group rounded-[20px] p-6 border border-white/10 shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-900/20"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-syne text-lg font-bold text-slate-100">{p.name}</h2>
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
              Todas as {auto.length} estações de maré em {countryName}
            </summary>
            <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {auto.map(p => (
                <li key={p.slug}>
                  <Link
                    href={`/mare-mundo/${p.countryCode}/${p.slug}`}
                    className="block text-xs text-slate-500 hover:text-blue-400 py-1 px-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                  >
                    {p.name}
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