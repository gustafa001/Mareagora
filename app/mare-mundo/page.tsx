import Link from 'next/link';
import { GLOBAL_PLACES, CURATED_PLACES, AUTO_PLACES, FEATURED_PLACES, isAutoPlace } from '@/lib/globalPlaces';
import NavBar from '@/components/NavBar';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';

export const metadata = {
  title: 'Maré no Mundo | MaréAgora',
  description: 'Previsão de marés, ondas e ventos para mais de 150 praias e portos internacionais em todo o mundo.',
  alternates: {
    canonical: 'https://mareagora.com.br/mare-mundo',
    languages: {
      'pt': 'https://mareagora.com.br/mare-mundo',
      'en': 'https://mareagora.com.br/tide',
      'x-default': 'https://mareagora.com.br/mare-mundo',
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

export default function MareMundoPage() {
  const porPais = GLOBAL_PLACES.reduce<Record<string, typeof GLOBAL_PLACES>>((acc, p) => {
    (acc[p.countryCode] ??= []).push(p);
    return acc;
  }, {});

  const totalLocais = GLOBAL_PLACES.length;
  const totalPaises = Object.keys(porPais).length;
  const paisesCurados = new Set(CURATED_PLACES.map(p => p.countryCode));
  const paisesAuto = new Set(AUTO_PLACES.map(p => p.countryCode));
  const paisesSoAuto = Array.from(paisesAuto).filter(c => !paisesCurados.has(c));
  const destaques = FEATURED_PLACES;

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
              ← Página Inicial
            </Link>

            <Link
              href="/tide"
              className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-300 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md"
            >
              🇺🇸 English Version
            </Link>
          </div>

          <div className="flex flex-col gap-3 items-center px-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 opacity-90">
              🌍 Cobertura Internacional
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl">
              Tábua de Marés no Mundo
            </h1>
            <p className="text-sm sm:text-lg opacity-90 font-medium max-w-2xl text-slate-300">
              Previsão harmônica de marés, ondas e tempo real em <strong className="text-blue-400">{totalLocais} destinos costeiros</strong> espalhados por <strong className="text-blue-400">{totalPaises} países</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Destinos em Destaque */}
      <section className="container relative z-40 -mt-4 md:-mt-10">
        <div className="flex items-end justify-between mb-4 px-1">
          <h2 className="font-syne text-xl md:text-2xl font-bold text-white">
            <span className="text-blue-400">★</span> Destinos em Destaque
          </h2>
          <Link href="/mare-mundo" className="text-xs font-bold text-blue-400 hover:text-white uppercase tracking-widest">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destaques.map(p => (
            <Link
              key={p.slug}
              href={`/mare-mundo/${p.countryCode}/${p.slug}`}
              className="group rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(160deg, #0f2747 0%, #0a1830 60%, #071020 100%)',
              }}
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />
              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  {getCountryFlag(p.countryCode)} {p.countryName}
                </p>
                <h3 className="font-syne font-bold text-sm mt-1 text-slate-100 group-hover:text-white">
                  {p.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-2 group-hover:text-blue-400 font-bold transition-colors">
                  Ver maré →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Grid de Países e Cidades */}
      <div className="container mt-10 relative z-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(porPais)
            .filter(([, places]) => places.some(p => !isAutoPlace(p.slug)))
            .map(([countryCode, places]) => {
            const flag = getCountryFlag(countryCode);
            const countryName = places[0].countryName;
            const curados = places.filter(p => !isAutoPlace(p.slug));
            const auto = places.filter(p => isAutoPlace(p.slug));

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
                    <h2 className="font-syne text-lg font-bold text-slate-100">
                      <Link href={`/mare-mundo/${countryCode}`} className="hover:text-blue-400 transition-colors">
                        {countryName}
                      </Link>
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
                    {places.length} {places.length === 1 ? 'local' : 'locais'}
                  </span>
                </div>

                <ul className="space-y-1">
                  {curados.map(p => (
                    <li key={p.slug}>
                      <Link
                        href={`/mare-mundo/${p.countryCode}/${p.slug}`}
                        className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-blue-500/15 text-slate-300 hover:text-white transition-all text-sm font-medium group"
                      >
                        <span>{p.name}</span>
                        <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                          Ver maré →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {auto.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-wider">
                      + {auto.length} mais estaç{auto.length === 1 ? 'ão' : 'ões'}
                    </summary>
                    <ul className="mt-2 space-y-0.5 max-h-48 overflow-y-auto">
                      {auto.map(p => (
                        <li key={p.slug}>
                          <Link
                            href={`/mare-mundo/${p.countryCode}/${p.slug}`}
                            className="flex items-center justify-between py-1 px-3 rounded-lg text-[13px] text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          >
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </section>
            );
          })}
        </div>

        {/* Países só com estações automáticas */}
        {paisesSoAuto.length > 0 && (
          <details className="mt-10 rounded-[20px] border border-white/10 bg-white/5 p-6">
            <summary className="cursor-pointer font-syne font-bold text-slate-300 hover:text-white text-lg">
              🌍 Outros países ({paisesSoAuto.length})
            </summary>
            <div className="mt-4 flex flex-wrap gap-2">
              {paisesSoAuto.map(cc => {
                const places = porPais[cc];
                const countryName = places[0].countryName;
                return (
                  <Link
                    key={cc}
                    href={`/mare-mundo/${cc}`}
                    className="inline-flex items-center gap-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 transition-colors"
                  >
                    {getCountryFlag(cc)} {countryName}
                    <span className="text-[10px] text-blue-400">{places.length}</span>
                  </Link>
                );
              })}
            </div>
          </details>
        )}

        {/* AdSense Rodapé */}
        <div className="mt-8 flex justify-center">
          <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
        </div>
      </div>
    </main>
  );
}
