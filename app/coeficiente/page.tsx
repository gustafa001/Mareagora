import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import SearchPorts from '@/components/SearchPorts';
import { PORTS } from '@/lib/ports';
import { getMoonAge, getTideCoefficient, getMoonPhase } from '@/lib/tideUtils';

export const metadata: Metadata = {
  title: 'Coeficiente de Maré: O que é e Como Interpretar | MaréAgora',
  description: 'Entenda o que é o coeficiente de maré (20 a 120), veja o valor de hoje e o calendário dos próximos 14 dias, e saiba quais atividades combinam com cada faixa.',
  alternates: { canonical: 'https://mareagora.com.br/coeficiente' },
};

const FAIXAS = [
  { min: 20, max: 40, label: 'Maré Morta (Fraca)', cor: 'bg-emerald-100 text-emerald-700 border-emerald-200', desc: 'Menor variação entre maré alta e baixa. Águas mais estáveis, correnteza fraca — ótimo para banho e navegação tranquila.' },
  { min: 41, max: 70, label: 'Moderada', cor: 'bg-yellow-100 text-yellow-700 border-yellow-200', desc: 'Faixa intermediária. Boa parte do ano fica nela — condições equilibradas para a maioria das atividades náuticas.' },
  { min: 71, max: 89, label: 'Moderada Alta', cor: 'bg-orange-100 text-orange-700 border-orange-200', desc: 'Variação já perceptível. Correntes mais fortes no estirão da maré — atenção redobrada em canais estreitos.' },
  { min: 90, max: 120, label: 'Maré Viva (Forte)', cor: 'bg-rose-100 text-rose-700 border-rose-200', desc: 'Maior amplitude do ciclo lunar (sizígia). Melhor janela para pesca e detectorismo, mas exige mais cuidado em operações portuárias.' },
];

function formatDatePt(date: Date) {
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

export default function Page() {
  const hoje = new Date();
  const idadeHoje = getMoonAge(hoje);
  const coefHoje = getTideCoefficient(idadeHoje);
  const faseHoje = getMoonPhase(idadeHoje);

  const dias = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() + i);
    const idade = getMoonAge(d);
    const coef = getTideCoefficient(idade);
    const fase = getMoonPhase(idade);
    return { data: d, coef, fase };
  });

  const faq = [
    {
      question: 'O que é o coeficiente de maré?',
      answer: 'É um número de 20 a 120 que indica a intensidade da variação da maré em um dia. Quanto maior o coeficiente, maior a diferença entre a maré alta e a maré baixa — valores acima de 90 indicam marés vivas (sizígia), e abaixo de 40 indicam marés mortas (quadratura).',
    },
    {
      question: 'Como o coeficiente é calculado?',
      answer: 'O coeficiente segue o ciclo da lua em relação ao sol. Nas luas nova e cheia (sizígia), Sol e Lua se alinham e a atração gravitacional soma, gerando coeficientes altos. Nos quartos crescente e minguante (quadratura), as forças se cancelam parcialmente, gerando coeficientes baixos.',
    },
    {
      question: 'Qual o melhor coeficiente para pesca?',
      answer: 'Coeficientes acima de 70, especialmente perto de 90-120, tendem a ser mais produtivos: a correnteza mais forte movimenta cardumes e nutrientes. Combine com a Tábua Solunar para achar as melhores janelas de horário em cada porto.',
    },
    {
      question: 'Coeficiente alto é perigoso para o mar?',
      answer: 'Não por si só, mas exige mais atenção: com maré viva, a correnteza é mais forte e a maré baixa expõe mais rochas/bancos de areia. Em portos e canais estreitos, coeficientes altos também aumentam a velocidade da correnteza na virada da maré.',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/coeficiente"
        title="Coeficiente de Maré: O que é e Como Interpretar | MaréAgora"
        description="Entenda o que é o coeficiente de maré, veja o valor de hoje e o calendário dos próximos 14 dias."
        faq={faq}
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black text-slate-900 font-syne mb-4 text-center">
            Coeficiente de Maré
          </h1>
          <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            Um número de 20 a 120 que mede a intensidade da variação da maré. Veja o valor de hoje e o que ele significa na prática.
          </p>

          {/* Card do coeficiente de hoje */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-10 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Coeficiente astronômico de hoje</p>
            <p className="text-6xl font-black text-slate-900 font-syne mb-2">{coefHoje.value}</p>
            <p className="text-lg font-semibold mb-1">{coefHoje.label}</p>
            <p className="text-sm text-slate-500">{faseHoje.icon} {faseHoje.name}</p>
            <p className="text-xs text-slate-400 mt-4 max-w-md mx-auto">
              Este valor é calculado pela posição astronômica da lua. O coeficiente exato de cada porto (na tábua de marés) usa a amplitude real medida ali e pode variar ligeiramente deste número de referência.
            </p>
          </div>

          {/* Tabela de faixas */}
          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Faixas do coeficiente</h2>
          <div className="grid gap-3 mb-10">
            {FAIXAS.map((f) => (
              <div key={f.label} className={`rounded-xl border p-4 flex items-start gap-4 ${f.cor}`}>
                <span className="font-black text-lg font-syne whitespace-nowrap">{f.min}–{f.max}</span>
                <div>
                  <p className="font-bold">{f.label}</p>
                  <p className="text-sm opacity-90">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Calendário 14 dias */}
          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Próximos 14 dias</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-10">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Data</th>
                  <th className="text-left px-4 py-3">Lua</th>
                  <th className="text-right px-4 py-3">Coeficiente</th>
                  <th className="text-right px-4 py-3">Classificação</th>
                </tr>
              </thead>
              <tbody>
                {dias.map((d, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 font-medium text-slate-700 capitalize">{formatDatePt(d.data)}</td>
                    <td className="px-4 py-3 text-slate-500">{d.fase.icon} {d.fase.name}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">{d.coef.value}</td>
                    <td className="px-4 py-3 text-right">{d.coef.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Busca por porto */}
          <div className="bg-slate-900 rounded-2xl p-8 mb-10 text-center">
            <h2 className="text-xl font-bold text-white font-syne mb-4">Veja o coeficiente exato do seu porto ou praia</h2>
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
            <Link href="/lua" className="text-blue-600 font-medium hover:underline">
              Veja também: como a fase da lua influencia a maré →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
