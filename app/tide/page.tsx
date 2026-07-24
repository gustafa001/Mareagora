import Link from 'next/link';
import { GLOBAL_PLACES } from '@/lib/globalPlaces';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'World Tide Tables | MaréAgora',
  description: 'Tide predictions and sea conditions for global beaches and ports worldwide.',
  alternates: {
    canonical: 'https://mareagora.com.br/tide',
    languages: {
      'pt': 'https://mareagora.com.br/mare-mundo',
      'en': 'https://mareagora.com.br/tide',
      'x-default': 'https://mareagora.com.br/tide',
    },
  },
};

export default function TideIndexPage() {
  const byCountry = GLOBAL_PLACES.reduce<Record<string, typeof GLOBAL_PLACES>>((acc, p) => {
    (acc[p.countryCode] ??= []).push(p);
    return acc;
  }, {});

  return (
    <main className="min-h-screen pb-20">
      <NavBar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-600 hover:text-white transition-all uppercase tracking-widest bg-blue-50/50 hover:bg-blue-500 px-4 py-2 rounded-xl border border-blue-100 hover:border-blue-500"
          >
            ← Home Page
          </Link>
          <Link
            href="/mare-mundo"
            className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-all uppercase tracking-widest bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-xl border border-slate-200"
          >
            🇧🇷 Versão em Português
          </Link>
        </div>

        <h1 className="font-syne text-3xl sm:text-4xl mb-2 font-bold">World Tide Tables</h1>
        <p className="text-gray-500 mb-8">
          Harmonic tide predictions, waves, wind and weather forecast for coastal cities worldwide.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(byCountry).map(([countryCode, places]) => (
            <section key={countryCode} className="classic-card">
              <h2 className="font-syne text-xl font-bold mb-3 border-b border-gray-100 pb-2 flex items-center justify-between">
                <span>{places[0].countryName}</span>
                <span className="text-xs text-gray-400 font-normal uppercase tracking-wider">{countryCode}</span>
              </h2>
              <ul className="divide-y divide-gray-100">
                {places.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/tide/${p.countryCode}/${p.slug}`}
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-blue-50/50 rounded transition-colors text-sm"
                    >
                      <span className="font-medium text-slate-700">{p.name}</span>
                      <span className="text-xs text-blue-500 font-semibold">Tide Table →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
