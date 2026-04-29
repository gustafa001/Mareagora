import Link from 'next/link';
import { getPortosProximos } from '@/lib/ports';
import { MapPin } from 'lucide-react';

interface PortosProximosProps {
  slug: string;
}

export default function PortosProximos({ slug }: PortosProximosProps) {
  const portos = getPortosProximos(slug);

  if (!portos.length) return null;

  return (
    <section className="mt-12 mb-16 classic-card w-full">
      <h2 className="text-2xl font-bold mb-6 font-syne text-slate-800 flex items-center gap-2">
        <MapPin className="text-blue-600" size={24} />
        Portos Próximos
      </h2>
      <div className="flex overflow-x-auto pb-4 gap-4 snap-x md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
        {portos.map((porto) => (
          <Link
            key={porto.slug}
            href={`/mare/${porto.slug}`}
            className="flex-shrink-0 w-[240px] md:w-auto bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-blue-300 snap-start flex flex-col group"
            aria-label={`Ver tábua de marés para ${porto.nome}, a ${porto.distanciaKm} km de distância`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                {porto.nome}
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full shrink-0 ml-2">
                {porto.estado}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-auto flex items-center gap-1.5 font-medium">
              <MapPin size={14} className="text-slate-400" /> {porto.distanciaKm} km de distância
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
