import { getStateSlug } from "@/lib/states";
import Link from 'next/link';
import { PORTS, getAllRegions, getPortBySlug, type Port } from '@/lib/ports';

const MAX_PER_REGION = 8;

// Locais mais buscados por região, em ordem de prioridade. Slugs inexistentes são
// ignorados e a lista é completada com os demais portos da região (sem duplicar).
const PRIORITY_SLUGS: Record<string, string[]> = {
  norte: ['porto-de-belem', 'ilha-do-mosqueiro', 'porto-de-macapa'],
  nordeste: [
    'sao-luis', 'porto-do-recife', 'porto-de-salvador', 'porto-de-mucuripe-fortaleza',
    'porto-de-maceio', 'porto-de-natal', 'porto-de-galinhas', 'praia-do-forte',
  ],
  sudeste: [
    'porto-de-santos', 'guaruja', 'ubatuba', 'rio-de-janeiro-fiscal',
    'cabo-frio', 'buzios', 'porto-de-vitoria',
  ],
  sul: [
    'porto-de-paranagua', 'porto-de-itajai', 'balneario-camboriu',
    'joaquina', 'porto-do-rio-grande',
  ],
};

function portsForRegion(regionId: string): Port[] {
  const seen = new Set<string>();
  const out: Port[] = [];
  const add = (p: Port | undefined) => {
    if (p && p.region === regionId && !seen.has(p.slug) && out.length < MAX_PER_REGION) {
      seen.add(p.slug);
      out.push(p);
    }
  };
  (PRIORITY_SLUGS[regionId] ?? []).forEach(slug => add(getPortBySlug(slug)));
  PORTS.forEach(add);
  return out;
}

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
          const regionPorts = portsForRegion(region.id);
          
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
                        href={`/mare/${getStateSlug(port.state)}/${port.slug}`}
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
