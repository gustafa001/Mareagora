import Link from 'next/link';
import { GLOBAL_PLACES } from '@/lib/globalPlaces';

export const metadata = {
  title: 'Maré no Mundo | MaréAgora',
  description: 'Maré calculada por modelo harmônico pra praias e portos internacionais selecionados.',
};

export default function MareMundoPage() {
  const porPais = GLOBAL_PLACES.reduce<Record<string, typeof GLOBAL_PLACES>>((acc, p) => {
    (acc[p.countryCode] ??= []).push(p);
    return acc;
  }, {});

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-600 hover:text-white transition-all uppercase tracking-widest bg-blue-50/50 hover:bg-blue-500 px-4 py-2 rounded-xl border border-blue-100 hover:border-blue-500"
        >
          ← Voltar à Página Inicial
        </Link>
      </div>

      <h1 className="font-syne text-3xl mb-2">Maré no mundo</h1>
      <p className="text-gray-500 mb-8">
        Maré calculada por modelo harmônico pra praias e portos internacionais selecionados.
      </p>

      {Object.entries(porPais).map(([countryCode, places]) => (
        <section key={countryCode} className="mb-8">
          <h2 className="font-syne text-lg mb-3">{places[0].countryName}</h2>
          <ul className="divide-y divide-gray-100">
            {places.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/mare-mundo/${p.countryCode}/${p.slug}`}
                  className="block py-3 px-2 hover:bg-gray-50 rounded"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
