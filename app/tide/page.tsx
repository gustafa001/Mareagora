import Link from 'next/link';
import { GLOBAL_PLACES } from '@/lib/globalPlaces';
import NavBar from '@/components/NavBar';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';

export const metadata = {
  title: 'World Tide Tables | MaréAgora',
  description: 'Harmonic tide predictions, waves, wind and weather forecast for over 150 beaches and ports worldwide.',
  alternates: {
    canonical: 'https://mareagora.com.br/tide',
    languages: {
      'pt': 'https://mareagora.com.br/mare-mundo',
      'en': 'https://mareagora.com.br/tide',
      'x-default': 'https://mareagora.com.br/tide',
    },
  },
};

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

export default function TideIndexPage() {
  const byCountry = GLOBAL_PLACES.reduce<Record<string, typeof GLOBAL_PLACES>>((acc, p) => {
    (acc[p.countryCode] ??= []).push(p);
    return acc;
  }, {});

  const totalPlaces = GLOBAL_PLACES.length;
  const totalCountries = Object.keys(byCountry).length;

  return (
    <main className="min-h-screen pb-20 bg-[#070d19] text-white">
      <NavBar />

      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #020917 0%, #051835 40%, #082952 70%, #0a3a6b 100%)',
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%, #1d4ed8 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #0891b2 0%, transparent 50%)',
          }}
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="hero-overlay" />

        <div className="container relative z-30 text-white text-center pt-20 pb-16 md:pt-16 md:pb-24">
          {/* Top Bar Actions */}
          <div className="flex justify-between items-center w-full mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
            >
              ← Home Page
            </Link>

            <Link
              href="/mare-mundo"
              className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-300 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md"
            >
              🇧🇷 Versão em Português
            </Link>
          </div>

          <div className="flex flex-col gap-3 items-center px-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 opacity-90">
              🌍 Global Tide Coverage
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl">
              World Tide Tables
            </h1>
            <p className="text-sm sm:text-lg opacity-90 font-medium max-w-2xl text-slate-300">
              Harmonic tide predictions, wave charts and weather for <strong className="text-blue-400">{totalPlaces} coastal destinations</strong> across <strong className="text-blue-400">{totalCountries} countries</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Countries and Cities */}
      <div className="container -mt-10 relative z-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(byCountry).map(([countryCode, places]) => {
            const flag = getCountryFlag(countryCode);
            const countryName = places[0].countryName;

            return (
              <section
                key={countryCode}
                className="rounded-[20px] p-6 border border-white/10 shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-900/20"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{flag}</span>
                    <h2 className="font-syne text-lg font-bold text-slate-100">{countryName}</h2>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
                    {places.length} {places.length === 1 ? 'location' : 'locations'}
                  </span>
                </div>

                <ul className="space-y-1">
                  {places.map(p => (
                    <li key={p.slug}>
                      <Link
                        href={`/tide/${p.countryCode}/${p.slug}`}
                        className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-blue-500/15 text-slate-300 hover:text-white transition-all text-sm font-medium group"
                      >
                        <span>{p.name}</span>
                        <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                          Tide table →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {/* AdSense Footer */}
        <div className="mt-8 flex justify-center">
          <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
        </div>
      </div>
    </main>
  );
}
