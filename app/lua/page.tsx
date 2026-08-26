import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import SearchPorts from '@/components/SearchPorts';
import { PORTS } from '@/lib/ports';
import { getMoonAge, getMoonPhase, getTideCoefficient } from '@/lib/tideUtils';

export const metadata: Metadata = {
  title: 'Fases da Lua e a Maré: Calendário Lunar 2026 | MaréAgora',
  description: 'Calendário das fases da lua dos próximos 30 dias e como cada fase influencia a maré: sizígia (lua nova e cheia) e quadratura (quartos crescente e minguante).',
  alternates: { canonical: 'https://mareagora.com.br/lua' },
};

function formatDatePt(date: Date) {
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

const FASES_INFO = [
  { nome: 'Lua Nova', icon: '🌑', tipo: 'Sizígia', desc: 'Sol e Lua alinhados do mesmo lado da Terra. Maior atração gravitacional combinada — marés altas mais altas e baixas mais baixas.' },
  { nome: 'Quarto Crescente', icon: '🌓', tipo: 'Quadratura', desc: 'Lua a 90° do Sol em relação à Terra. As forças gravitacionais se cancelam parcialmente — menor variação entre maré alta e baixa.' },
  { nome: 'Lua Cheia', icon: '🌕', tipo: 'Sizígia', desc: 'Sol e Lua alinhados em lados opostos da Terra. Mesmo efeito da lua nova: marés vivas, de maior amplitude.' },
  { nome: 'Quarto Minguante', icon: '🌗', tipo: 'Quadratura', desc: 'Novamente a 90° do Sol. Segunda janela de maré morta do mês, com águas mais estáveis.' },
];

export default function Page() {
  const hoje = new Date();
  const idadeHoje = getMoonAge(hoje);
  const faseHoje = getMoonPhase(idadeHoje);

  const dias = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() + i);
    const idade = getMoonAge(d);
    const fase = getMoonPhase(idade);
    const coef = getTideCoefficient(idade);
    return { data: d, fase, coef };
  });

  // Detecta as próximas transições de fase (mudança de nome em relação ao dia anterior)
  const proximasFases = dias.filter((d, i) => i === 0 || d.fase.name !== dias[i - 1].fase.name);

  const faq = [
    {
      question: 'Por que a lua influencia a maré?',
      answer: 'A gravidade da lua puxa as águas dos oceanos, criando uma protuberância na direção da lua (e outra do lado oposto, por inércia). Conforme a Terra gira, cada ponto da costa passa por essas protuberâncias, gerando o ciclo de maré alta e baixa — geralmente duas de cada por dia no Brasil (marés semidiurnas).',
    },
    {
      question: 'O que é sizígia?',
      answer: 'É quando Sol, Terra e Lua ficam alinhados — nas fases de lua nova e lua cheia. A atração do Sol se soma à da Lua, gerando as marés de maior amplitude do mês (maré viva), com coeficiente acima de 90.',
    },
    {
      question: 'O que é quadratura?',
      answer: 'É quando a Lua forma um ângulo de 90° em relação ao Sol, visto da Terra — nas fases de quarto crescente e quarto minguante. As forças gravitacionais do Sol e da Lua se cancelam parcialmente, gerando as marés de menor amplitude do mês (maré morta ou fraca).',
    },
    {
      question: 'Quantas luas cheias e novas tem por mês?',
      answer: 'Normalmente uma de cada, já que o ciclo lunar completo dura cerca de 29,5 dias. Ou seja, todo mês tem em geral duas janelas de maré viva (lua nova e lua cheia) e duas de maré morta (quarto crescente e minguante).',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/lua"
        title="Fases da Lua e a Maré: Calendário Lunar 2026 | MaréAgora"
        description="Calendário das fases da lua dos próximos 30 dias e como cada fase influencia a maré."
        faq={faq}
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black text-slate-900 font-syne mb-4 text-center">
            Fases da Lua e a Maré
          </h1>
          <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            A lua rege a força das marés. Veja a fase de hoje, o calendário dos próximos 30 dias e entenda sizígia e quadratura.
          </p>

          {/* Card da fase de hoje */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-10 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Fase de hoje</p>
            <p className="text-6xl mb-2">{faseHoje.icon}</p>
            <p className="text-2xl font-bold text-slate-900 font-syne">{faseHoje.name}</p>
          </div>

          {/* Explicação sizígia/quadratura */}
          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Como cada fase afeta a maré</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {FASES_INFO.map((f) => (
              <div key={f.nome} className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="font-bold text-slate-800">{f.nome}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.tipo === 'Sizígia' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {f.tipo}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Próximas transições de fase */}
          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Próximas fases</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-10">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Data</th>
                  <th className="text-left px-4 py-3">Fase</th>
                  <th className="text-right px-4 py-3">Coeficiente esperado</th>
                </tr>
              </thead>
              <tbody>
                {proximasFases.slice(0, 8).map((d, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 font-medium text-slate-700 capitalize">{formatDatePt(d.data)}</td>
                    <td className="px-4 py-3 text-slate-700">{d.fase.icon} {d.fase.name}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">{d.coef.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calendário 30 dias */}
          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Calendário lunar — próximos 30 dias</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-10">
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {dias.map((d, i) => (
                <div key={i} className="rounded-lg border border-slate-100 p-2 text-center">
                  <p className="text-[10px] text-slate-400 capitalize">{formatDatePt(d.data)}</p>
                  <p className="text-xl leading-none my-1">{d.fase.icon}</p>
                  <p className="text-[10px] font-semibold text-slate-600">{d.coef.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Busca por porto */}
          <div className="bg-slate-900 rounded-2xl p-8 mb-10 text-center">
            <h2 className="text-xl font-bold text-white font-syne mb-4">Veja a maré do seu porto ou praia hoje</h2>
            <div className="max-w-md mx-auto">
              <SearchPorts ports={PORTS} />
            </div>
          </div>

          {/* FAQ */}
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
            <Link href="/coeficiente" className="text-blue-600 font-medium hover:underline">
              Veja também: o que é o coeficiente de maré →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
