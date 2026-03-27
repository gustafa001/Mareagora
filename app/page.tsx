import { PORTS } from '@/lib/ports';
import path from 'path';
import fs from 'fs';
import NavBar from '@/components/NavBar';
import TideCardLive from '@/components/TideCardLive';
import Link from 'next/link';

const REGION_ICONS: Record<string, string> = {
  Norte: '🌿', Nordeste: '☀️', Sudeste: '🏙️', Sul: '🌊',
};
const REGION_DESC: Record<string, string> = {
  Norte: 'Amazônia e litoral norte',
  Nordeste: 'Do Maranhão à Bahia',
  Sudeste: 'Espírito Santo, RJ e SP',
  Sul: 'Paraná, SC e Rio Grande do Sul',
};

function loadPortData(dataFile: string) {
  try {
    const filePath = path.join(process.cwd(), 'data', dataFile);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function Home() {
  const regions = ['Norte', 'Nordeste', 'Sudeste', 'Sul'];
  const totalPorts = PORTS.length;

  return (
    <div className="min-h-screen">
      <NavBar />

      <div className="bg-waves" aria-hidden>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="rgba(56,201,240,.6)">
          <path d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1350,40 1440,60 L1440,120 L0,120Z"/>
        </svg>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="rgba(14,127,190,.5)">
          <path d="M0,80 C200,40 400,100 600,80 C800,60 1000,110 1200,80 C1320,65 1380,85 1440,80 L1440,120 L0,120Z"/>
        </svg>
      </div>

      <main className="container pt-28 pb-20">

        {/* HERO */}
        <div className="text-center mb-16 px-2">
          <div className="inline-flex items-center gap-2 bg-[rgba(14,127,190,0.2)] border border-[rgba(56,201,240,0.3)] rounded-full px-4 py-1.5 text-[var(--foam)] text-sm mb-6">
            <span className="live-dot"></span>
            Dados oficiais · Marinha do Brasil 2026
          </div>
          <h1 className="font-syne font-extrabold text-[clamp(2.8rem,9vw,5rem)] tracking-[-3px] leading-[1.05] text-[var(--white)] mb-5">
            A maré certa,<br/>
            <span className="text-[var(--foam)]">na hora certa.</span>
          </h1>
          <p className="max-w-xl mx-auto text-[var(--muted)] text-lg leading-relaxed mb-8">
            Previsão de marés, ondas e ventos para{' '}
            <strong className="text-[var(--sand)]">{totalPorts} portos</strong>{' '}
            do litoral brasileiro — dados da Marinha em tempo real.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { val: `${totalPorts}`, lbl: 'Portos cobertos' },
              { val: '365', lbl: 'Dias de previsão' },
              { val: '4', lbl: 'Regiões' },
              { val: '24/7', lbl: 'Disponível' },
            ].map(s => (
              <div key={s.lbl} className="bg-[rgba(13,34,64,0.8)] border border-[rgba(56,201,240,0.12)] rounded-2xl px-5 py-3 text-center min-w-[90px]">
                <div className="font-syne font-extrabold text-xl text-[var(--foam)]">{s.val}</div>
                <div className="text-[var(--muted)] text-xs mt-0.5">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-[var(--muted)] text-sm self-center mr-1">Acesso rápido:</span>
            {['porto-de-salvador','porto-do-rio-de-janeiro','porto-de-santos','porto-de-mucuripe-fortaleza','porto-de-maceio'].map(slug => {
              const p = PORTS.find(x => x.slug === slug);
              if (!p) return null;
              return (
                <Link key={slug} href={`/mare/${slug}`}
                  className="bg-[rgba(56,201,240,0.1)] border border-[rgba(56,201,240,0.2)] text-[var(--foam)] text-sm px-3 py-1.5 rounded-full hover:bg-[rgba(56,201,240,0.2)] hover:border-[var(--foam)] transition-all">
                  {p.name.replace('Porto de ','').replace('Porto do ','')}
                </Link>
              );
            })}
          </div>
        </div>

        {/* REGIONS + LIVE CARDS */}
        {regions.map((region) => {
          const regionPorts = PORTS.filter(p => p.region === region);
          if (regionPorts.length === 0) return null;
          return (
            <section key={region} className="mb-14">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[rgba(56,201,240,0.1)] border border-[rgba(56,201,240,0.15)] flex items-center justify-center text-xl flex-shrink-0">
                  {REGION_ICONS[region]}
                </div>
                <div>
                  <h2 className="font-syne font-extrabold text-xl text-[var(--white)] leading-none">{region}</h2>
                  <p className="text-[var(--muted)] text-sm mt-0.5">{REGION_DESC[region]} · {regionPorts.length} localidades</p>
                </div>
                <div className="ml-auto h-px flex-1 bg-gradient-to-r from-[rgba(56,201,240,0.15)] to-transparent max-w-[200px]" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {regionPorts.map((port) => {
                  const data = loadPortData(port.dataFile);
                  return (
                    <TideCardLive key={port.slug} port={port} data={data} />
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* FEATURES */}
        <section className="mt-10 mb-8">
          <div className="text-center mb-8">
            <h2 className="font-syne font-extrabold text-2xl text-[var(--white)] mb-2">
              Tudo que você precisa <span className="text-[var(--foam)]">num só lugar</span>
            </h2>
            <p className="text-[var(--muted)] text-sm">Informações combinadas de maré, ondas e vento</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {icon:'🌊',title:'Tábua Oficial',desc:'Dados da Marinha do Brasil para 2026'},
              {icon:'🌬️',title:'Ondas & Vento',desc:'Previsão em tempo real via Open-Meteo'},
              {icon:'📅',title:'Calendário',desc:'Todos os horários do mês de uma vez'},
              {icon:'📲',title:'Mobile First',desc:'Funciona perfeitamente no celular'},
              {icon:'⚡',title:'Tempo Real',desc:'Altura da maré atualizada ao vivo'},
              {icon:'🔒',title:'Fonte Oficial',desc:'CHM — Centro de Hidrografia da Marinha'},
            ].map(f => (
              <div key={f.title} className="bg-[rgba(13,34,64,0.5)] border border-[rgba(56,201,240,0.08)] rounded-2xl p-4 hover:border-[rgba(56,201,240,0.2)] transition-all">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="font-syne font-bold text-sm text-[var(--white)] mb-1">{f.title}</div>
                <div className="text-[var(--muted)] text-xs leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="bg-[rgba(13,34,64,0.4)] border border-[rgba(56,201,240,0.08)] rounded-3xl p-6 md:p-10 text-center">
          <h3 className="font-syne font-extrabold text-xl text-[var(--foam)] mb-2">Feito para todos</h3>
          <p className="text-[var(--muted)] text-sm mb-6 max-w-md mx-auto">Do pescador ao engenheiro naval — quem vive o mar precisa do MaréAgora.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['🎣 Pescadores','🏄 Surfistas','⛵ Navegantes','🤿 Mergulhadores','🏖️ Turistas','🏗️ Engenharia'].map(a => (
              <span key={a} className="bg-[rgba(56,201,240,0.08)] border border-[rgba(56,201,240,0.15)] text-[var(--muted)] px-4 py-2 rounded-full text-sm hover:text-[var(--foam)] hover:border-[var(--foam)] transition-all cursor-default">
                {a}
              </span>
            ))}
          </div>
        </section>

      </main>

      <footer className="container py-8 border-t border-[rgba(56,201,240,0.07)]">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-[var(--muted)] text-sm">© 2026 MaréAgora · Todos os direitos reservados</p>
          <div className="flex items-center gap-2 bg-[rgba(56,201,240,0.07)] border border-[rgba(56,201,240,0.12)] rounded-full px-4 py-1.5">
            <span className="text-sm">⚓</span>
            <span className="text-[var(--muted)] text-xs">Dados: Marinha do Brasil</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
