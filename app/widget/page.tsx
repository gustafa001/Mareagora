import Link from 'next/link';
import { PORTS } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';

export const metadata = {
  title: 'Widget de Marés — Adicione ao seu Site | MaréAgora',
  description: 'Incorpore gratuitamente a tábua de marés do MaréAgora no seu site, blog ou aplicativo de pesca, surf ou náutica. Widget leve e responsivo.',
};

export default function WidgetPage() {
  const examplePort = PORTS.find(p => p.slug === 'porto-de-santos') ?? PORTS[0];
  const exampleUrl = `https://mareagora.com.br/widget/${examplePort.slug}`;
  const embedCode = `<iframe
  src="${exampleUrl}"
  width="320"
  height="260"
  frameborder="0"
  style="border-radius:16px;overflow:hidden"
  title="Tábua de Marés — MaréAgora"
></iframe>`;

  return (
    <main className="min-h-screen bg-slate-950 py-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-4xl">📡</span>
          <h1 className="text-4xl font-black text-white font-syne mt-4 mb-4">
            Widget de Marés Gratuito
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Adicione a tábua de marés ao seu site, blog de pesca, surfcamp ou aplicativo náutico.
            Totalmente gratuito. Sempre atualizado.
          </p>
        </div>

        {/* Preview */}
        <section className="rounded-3xl bg-slate-900/50 border border-white/10 p-8 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Prévia do Widget</h2>
          <div className="flex justify-center">
            <iframe
              src={exampleUrl}
              width="320"
              height="260"
              frameBorder="0"
              style={{ borderRadius: '16px', overflow: 'hidden' }}
              title="Prévia do widget de marés"
            />
          </div>
        </section>

        {/* Embed code */}
        <section className="rounded-3xl bg-slate-900/50 border border-white/10 p-8 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Código de Incorporação</h2>
          <p className="text-slate-400 text-sm mb-4">
            Substitua <code className="text-cyan-400 bg-slate-800 px-1 rounded">porto-de-santos</code> pelo slug do porto desejado:
          </p>
          <pre className="bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-emerald-400 overflow-x-auto whitespace-pre-wrap">
            {embedCode}
          </pre>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">🌍 Para locais internacionais</p>
              <code className="text-xs text-cyan-400">
                {`https://mareagora.com.br/widget/barcelona?cc=es`}
              </code>
            </div>
            <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">🇺🇸 Widget em inglês</p>
              <code className="text-xs text-cyan-400">
                {`https://mareagora.com.br/widget/miami?cc=us&lang=en`}
              </code>
            </div>
          </div>
        </section>

        {/* Available ports list */}
        <section className="rounded-3xl bg-slate-900/50 border border-white/10 p-8 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Portos Brasileiros Disponíveis</h2>
          <div className="flex flex-wrap gap-2">
            {PORTS.slice(0, 30).map(port => (
              <Link
                key={port.slug}
                href={`/widget/${port.slug}`}
                target="_blank"
                className="text-xs bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition-all"
              >
                {port.cityName || port.name}
              </Link>
            ))}
            <span className="text-xs text-slate-600 px-3 py-1.5">+ {PORTS.length - 30} mais...</span>
          </div>
        </section>

        {/* Benefits */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '⚡', title: 'Leve', desc: 'Menos de 5KB de dados. Não impacta a velocidade do seu site.' },
            { icon: '🔄', title: 'Sempre Atualizado', desc: 'Dados harmônicos em tempo real. Sem necessidade de manutenção.' },
            { icon: '🆓', title: '100% Gratuito', desc: 'Sem limites de uso, sem cadastro. Apenas incorpore e use.' },
          ].map(b => (
            <div key={b.title} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="text-white font-bold mb-2">{b.title}</h3>
              <p className="text-slate-500 text-sm">{b.desc}</p>
            </div>
          ))}
        </section>

        <div className="text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            ← Voltar ao MaréAgora
          </Link>
        </div>
      </div>
    </main>
  );
}
