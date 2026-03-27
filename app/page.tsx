import { PORTS } from '@/lib/ports';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default function Home() {
  const regions = ["Norte", "Nordeste", "Sudeste", "Sul"];

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <main className="container pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="font-syne font-extrabold text-[clamp(2.5rem,8vw,4.5rem)] tracking-[-3px] leading-none text-[var(--white)] mb-6">
            Tábua de Marés <span className="text-[var(--foam)]">Brasil 2026</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[var(--muted)] text-lg leading-relaxed">
            Consulte horários e alturas das marés em tempo real para todos os principais portos do Brasil. Dados oficiais da Marinha do Brasil integrados com previsão de ondas e vento.
          </p>
        </div>

        {regions.map((region) => {
          const regionPorts = PORTS.filter(p => p.region === region);
          if (regionPorts.length === 0) return null;

          return (
            <section key={region} className="mb-12">
              <h2 className="font-syne font-bold text-xl text-[var(--sun)] mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[var(--sun)] opacity-30"></span>
                {region}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {regionPorts.map((port) => (
                  <Link 
                    key={port.slug} 
                    href={`/mare/${port.slug}`}
                    className="group card hover:bg-[rgba(14,127,190,0.1)] hover:-translate-y-1 transition-all"
                  >
                    <div className="font-syne font-bold text-base text-[var(--white)] group-hover:text-[var(--foam)] transition-colors">
                      {port.name}
                    </div>
                    <div className="text-[var(--muted)] text-sm mt-1">{port.state} — {port.region}</div>
                    <div className="mt-4 text-[var(--foam)] text-[0.8rem] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver Maré →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mt-24 text-center card p-10 bg-[rgba(13,34,64,0.4)] border-dashed">
          <h3 className="font-syne font-bold text-2xl text-[var(--foam)] mb-4">⚓ Dados Oficiais</h3>
          <p className="text-[var(--muted)] max-w-xl mx-auto mb-6">
            Nossas informações são extraídas diretamente das publicações oficiais do Centro de Hidrografia da Marinha. Precisão técnica para navegação, pesca e esportes náuticos.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="bg-[rgba(56,201,240,0.1)] text-[var(--foam)] px-4 py-2 rounded-full text-sm font-bold">Marinha do Brasil 2026</span>
            <span className="bg-[rgba(56,201,240,0.1)] text-[var(--foam)] px-4 py-2 rounded-full text-sm font-bold">PWA Offline</span>
            <span className="bg-[rgba(56,201,240,0.1)] text-[var(--foam)] px-4 py-2 rounded-full text-sm font-bold">Open-Meteo API</span>
          </div>
        </section>
      </main>

      <footer className="container py-10 border-t border-[rgba(56,201,240,0.07)] text-center">
        <p className="text-[var(--muted)] text-sm">© 2026 MaréAgora · Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
