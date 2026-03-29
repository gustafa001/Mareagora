import { PORTS } from '@/lib/ports';
import NavBar from '@/components/NavBar';
import TideCardLive from '@/components/TideCardLive';
import HeroSearch from '@/components/HeroSearch';
import Footer from '@/components/Footer';
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

export default function Home() {
  const regions = ['Norte', 'Nordeste', 'Sudeste', 'Sul'];
  const totalPorts = PORTS.length;

  return (
    <div className="min-h-screen bg-[var(--ocean)]">
      <NavBar />

      {/* HERO PRO MAX SECTION */}
      <section className="hero-section border-b border-[rgba(56,201,240,0.15)]" style={{ minHeight: '600px', paddingBottom: '30px' }}>
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(6,16,30,0.4) 0%, rgba(6,16,30,0.85) 80%, rgba(10,22,40,1) 100%)' }} />
        <div className="container relative z-10 text-white text-center pt-32 pb-8 px-2">
          
          <div className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-full px-4 py-1.5 text-[var(--foam)] text-[0.8rem] mb-6 shadow-xl uppercase tracking-widest font-bold">
            <span className="live-dot bg-[var(--foam)]"></span>
            Dados Oficiais da Marinha 2026
          </div>
          
          <h1 className="font-syne font-extrabold text-[clamp(2.8rem,9vw,5.5rem)] tracking-[-2px] leading-[1] text-white mb-6 drop-shadow-2xl">
            A maré certa,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--foam)] to-[#2a68f6] filter drop-shadow">na hora certa.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-[rgba(255,255,255,0.8)] text-lg md:text-xl leading-relaxed mb-6 drop-shadow font-light">
            Condições de maré, ondas e ventos em tempo real para{' '}
            <strong className="text-white font-bold bg-[rgba(56,201,240,0.15)] px-2 py-0.5 rounded border border-[rgba(56,201,240,0.2)] mx-1">{totalPorts} portos</strong>{' '}
            em todo o litoral brasileiro.
          </p>

          <HeroSearch />

          {/* Stats em formato Glassmorphism Bento */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 mb-4">
            {[
              { val: `${totalPorts}`, lbl: 'Portos', icon: '📍' },
              { val: '365', lbl: 'Dias de Previsão', icon: '📅' },
              { val: '4', lbl: 'Regiões', icon: '🗺️' },
              { val: '24/7', lbl: 'Disponível', icon: '⚡' },
            ].map(s => (
              <div key={s.lbl} className="glass-card hover:bg-[rgba(255,255,255,0.1)] transition-colors rounded-2xl px-6 py-4 text-center min-w-[120px] max-w-[140px] flex-1">
                <div className="text-2xl mb-1 opacity-80">{s.icon}</div>
                <div className="font-syne font-extrabold text-2xl text-white drop-shadow-sm">{s.val}</div>
                <div className="text-[var(--foam)] text-[10px] sm:text-xs mt-1 font-bold uppercase tracking-wider">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="container pt-8 pb-20 relative z-10">

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <span className="text-[var(--muted)] text-sm self-center mr-1 drop-shadow">Acesso rápido:</span>
            {['salvador','rio-de-janeiro-fiscal','santos','porto-de-mucuripe-fortaleza','maceio'].map(slug => {
              const p = PORTS.find(x => x.slug === slug);
              if (!p) return null;
              return (
                <Link key={slug} href={`/mare/${slug}`}
                  className="bg-[rgba(56,201,240,0.1)] border border-[rgba(56,201,240,0.2)] text-[var(--foam)] text-sm px-3 py-1.5 rounded-full hover:bg-[rgba(56,201,240,0.25)] hover:border-[var(--foam)] transition-all drop-shadow-sm font-medium">
                  {p.name.replace('Porto de ','').replace('Porto do ','')}
                </Link>
              );
            })}
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
                  const globalIndex = PORTS.indexOf(port);
                  return (
                    <TideCardLive key={port.slug} port={port} index={globalIndex} />
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

      <Footer />
    </div>
  );
}
