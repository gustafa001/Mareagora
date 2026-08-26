import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import SearchPorts from '@/components/SearchPorts';
import { PORTS } from '@/lib/ports';
import { getProximosPicos } from '@/lib/mareCiclo';

export const metadata: Metadata = {
  title: 'Maré Viva (Sizígia): O que é e Próximas Datas | MaréAgora',
  description: 'Entenda quando ocorre a maré viva (sizígia), seu impacto na pesca, navegação e praias, e veja as próximas datas com maior coeficiente.',
  alternates: { canonical: 'https://mareagora.com.br/mare-viva' },
};

function formatDataLonga(d: Date) {
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

export default function Page() {
  const picos = getProximosPicos('viva', 90);

  const faq = [
    {
      question: 'O que é maré viva?',
      answer: 'É a maré de maior amplitude do ciclo lunar, também chamada de sizígia. Ocorre quando Sol, Terra e Lua ficam alinhados — nas fases de lua nova e lua cheia — e a atração gravitacional do Sol se soma à da Lua, elevando o coeficiente de maré (geralmente acima de 85-90).',
    },
    {
      question: 'Maré viva é boa para pesca?',
      answer: 'Sim, costuma ser o período mais produtivo: a correnteza mais forte movimenta cardumes, nutrientes e isca natural. Combine com a Tábua Solunar do seu porto para achar as melhores janelas de horário.',
    },
    {
      question: 'Maré viva é perigosa?',
      answer: 'Exige mais atenção. A correnteza é mais forte na virada da maré, a maré baixa expõe bancos de areia e rochas normalmente cobertas, e a maré alta pode se aproximar mais de calçadões e construções na orla — em dias de ressaca, o efeito combinado pode causar alagamentos pontuais.',
    },
    {
      question: 'Com que frequência ocorre a maré viva?',
      answer: 'Duas vezes por mês, em cada lua nova e lua cheia — já que o ciclo lunar completo dura cerca de 29,5 dias.',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/mare-viva"
        title="Maré Viva (Sizígia): O que é e Próximas Datas | MaréAgora"
        description="Entenda quando ocorre a maré viva (sizígia) e veja as próximas datas com maior coeficiente."
        faq={faq}
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black text-slate-900 font-syne mb-4 text-center">
            Maré Viva <span className="text-rose-500">(Sizígia)</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            A maré de maior amplitude do mês, quando Sol e Lua se alinham. Veja o que muda na prática e as próximas datas.
          </p>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-10">
            <h2 className="text-xl font-bold text-slate-900 font-syne mb-3">O que muda na maré viva</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>🌊 <strong>Amplitude maior</strong> — a diferença entre maré alta e baixa aumenta bastante (coeficiente acima de 85-90).</li>
              <li>🎣 <strong>Melhor para pesca</strong> — correnteza mais forte movimenta cardumes e nutrientes.</li>
              <li>⚠️ <strong>Correnteza mais forte</strong> — atenção redobrada em canais estreitos e na virada da maré.</li>
              <li>🏖️ <strong>Orla mais afetada</strong> — a maré alta chega mais perto de calçadões; em dias de ressaca, risco de alagamento pontual.</li>
              <li>🪨 <strong>Maré baixa mais seca</strong> — bancos de areia e rochas normalmente cobertas ficam expostos, bom para detectorismo.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Próximas datas de maré viva</h2>
          <div className="grid gap-3 mb-10">
            {picos.length === 0 && (
              <p className="text-slate-500 text-sm">Nenhum pico encontrado na janela calculada.</p>
            )}
            {picos.map((p, i) => (
              <div key={i} className="bg-white rounded-xl border border-rose-100 p-4 flex items-center justify-between">
                <p className="font-semibold text-slate-800 capitalize">{formatDataLonga(p.data)}</p>
                <span className="text-sm font-bold px-3 py-1 rounded-lg bg-rose-100 text-rose-700">
                  Coeficiente {p.coeficiente}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 mb-10 text-center">
            <h2 className="text-xl font-bold text-white font-syne mb-4">Veja o horário exato no seu porto ou praia</h2>
            <div className="max-w-md mx-auto">
              <SearchPorts ports={PORTS} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4 mb-10">
            {faq.map((f) => (
              <div key={f.question} className="bg-white rounded-xl border border-slate-100 p-5">
                <p className="font-bold text-slate-800 mb-1">{f.question}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/mare-morta" className="text-blue-600 font-medium hover:underline">
              Veja também: o que é maré morta (quadratura) →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
