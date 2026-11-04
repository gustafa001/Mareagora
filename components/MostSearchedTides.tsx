import Link from 'next/link';
import { getTopCities } from '@/lib/topCities';

export default function MostSearchedTides() {
  const cities = getTopCities();
  if (!cities.length) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-12" aria-labelledby="mais-buscadas">
      <h2 id="mais-buscadas" className="text-2xl font-black text-white font-syne mb-2">
        Tábuas de maré mais buscadas
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        As praias e portos mais consultados hoje, com horários de preamar e baixa-mar.
      </p>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cities.map(c => (
          <li key={c.slug}>
            <Link
              href={c.href}
              className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-400/40 hover:text-white transition-colors"
            >
              Tábua de maré {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
