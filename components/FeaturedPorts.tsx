import Link from 'next/link';
import { getPortBySlug } from '@/lib/ports';
import { getEventosDia } from '@/lib/mare';

const POPULAR_SLUGS = [
  'porto-de-belem',
  'porto-de-itaqui',
  'porto-de-mucuripe-fortaleza',
  'porto-do-recife',
  'porto-de-salvador',
  'porto-de-santos'
];

export default function FeaturedPorts() {
  const todayStr = new Date().toLocaleDateString('en-CA');
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const featuredData = POPULAR_SLUGS.map(slug => {
    const port = getPortBySlug(slug);
    if (!port) return null;

    const tides = getEventosDia(port, todayStr);
    
    // Encontrar a próxima maré
    const nextTide = tides.find(t => {
      const [h, m] = t.hora.split(':').map(Number);
      return (h * 60 + m) > currentMin;
    }) || tides[0]; // Fallback para a primeira do dia seguinte se já passaram todas (simplificado)

    return {
      port,
      nextTide
    };
  }).filter(Boolean);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-white mb-8 font-syne flex items-center gap-2">
        <span className="w-2 h-8 bg-blue-500 rounded-full" />
        Portos em Destaque Agora
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredData.map((item) => {
          if (!item) return null;
          const { port, nextTide } = item;
          const isHigh = nextTide?.tipo === 'high';

          return (
            <Link 
              key={port.slug} 
              href={`/mare/${port.slug}`}
              className="group bg-slate-900/40 border border-white/5 rounded-2xl p-5 hover:bg-slate-800/60 transition-all hover:border-blue-500/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {port.cityName || port.name}
                  </h3>
                  <p className="text-sm text-slate-400">{port.state}</p>
                </div>
                {nextTide && (
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                    isHigh ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {isHigh ? 'Alta ↑' : 'Baixa ↓'}
                  </span>
                )}
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Próxima Maré</p>
                  <p className="text-2xl font-black text-white">{nextTide?.hora || '--:--'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Altura</p>
                  <p className="text-xl font-bold text-slate-300">{nextTide?.altura_m.toFixed(1)}m</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
