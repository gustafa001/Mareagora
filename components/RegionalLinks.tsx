import Link from 'next/link';
import { PORTS, getAllRegions } from '@/lib/ports';

export default function RegionalLinks() {
  const regions = getAllRegions();
  
  // Adicionando Centro-Oeste manualmente como solicitado pelo usuário, 
  // embora seja uma região sem portos marítimos no dataset atual.
  const allDisplayRegions = [
    ...regions.filter(r => r.id !== 'especial'),
    { id: 'centro-oeste', name: 'Região Centro-Oeste' }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 border-t border-white/5">
      <h2 className="text-2xl font-bold text-white mb-8 font-syne flex items-center gap-2">
        <span className="w-2 h-8 bg-cyan-500 rounded-full" />
        Marés por Região do Brasil
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {allDisplayRegions.map((region) => {
          const regionPorts = PORTS.filter(p => p.region === region.id).slice(0, 5);
          
          return (
            <div key={region.id}>
              <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">
                {region.name}
              </h3>
              <ul className="space-y-2">
                {regionPorts.length > 0 ? (
                  regionPorts.map(port => (
                    <li key={port.slug}>
                      <Link 
                        href={`/mare/${port.slug}`}
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                      >
                        Maré {port.cityName || port.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-600 text-xs italic">
                    {region.id === 'centro-oeste' ? 'Região sem portos marítimos.' : 'Nenhum porto cadastrado.'}
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
