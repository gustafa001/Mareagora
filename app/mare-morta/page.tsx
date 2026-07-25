import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import SearchPorts from '@/components/SearchPorts';
import { PORTS } from '@/lib/ports';
import { getProximosPicos } from '@/lib/mareCiclo';

export const metadata: Metadata = {
  title: 'Maré Morta (Quadratura): O que é e Próximas Datas | MaréAgora',
  description: 'Entenda quando ocorre a maré morta (quadratura), seu impacto na navegação e praias, e veja as próximas datas com menor coeficiente.',
  alternates: { canonical: 'https://mareagora.com.br/mare-morta' },
};

function formatDataLonga(d: Date) {
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

export default function Page() {
  const picos = getProximosPicos('morta', 90);

  const faq = [
    {
      question: 'O que é maré morta?',
      answer: 'É a maré de menor amplitude do ciclo lunar, também chamada de quadratura. Ocorre quando a Lua forma um ângulo de 90° em relação ao Sol, visto da Terra — nas fases de quarto crescente e quarto minguante — e as forças gravitacionais se cancelam parcialmente, reduzindo o coeficiente de maré (geralmente abaixo de 40-45).',
    },
    {
      question: 'Maré morta é boa para o quê?',
      answer: 'Águas mais estáveis e previsíveis, com correnteza fraca — ideal para banho tranquilo, mergulho, navegação leve e passeios de barco em canais estreitos, onde a corrente da maré viva costuma atrapalhar.',
    },
    {
      question: 'Maré morta é ruim para pesca?',
      answer: 'Costuma ser menos produtiva que a maré viva, já que a correnteza fraca movimenta menos nutrientes e cardumes. Não é ruim, mas geralmente exige mais paciência ou pontos de pesca mais profundos.',
    },
    {
      question: 'Com que frequência ocorre a maré morta?',
      answer: 'Duas vezes por mês, em cada quarto crescente e quarto minguante — já que o ciclo lunar completo dura cerca de 29,5 dias.',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/mare-morta"
        title="Maré Morta (Quadratura): O que é e Próximas Datas | MaréAgora"
        description="Entenda quando ocorre a maré morta (quadratura) e veja as próximas datas com menor coeficiente."
        faq={faq}
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 font-syne mb-4 text-center">
            Maré Morta <span className="text-emerald-500">(Quadratura)</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            A maré de menor amplitude do mês, quando Sol e Lua formam um ângulo de 90°. Veja o que muda na prática e as próximas datas.
          </p>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-10">
            <h2 className="text-xl font-bold text-slate-900 font-syne mb-3">O que muda na maré morta</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>🌊 <strong>Amplitude menor</strong> — a diferença entre maré alta e baixa diminui (coeficiente abaixo de 40-45).</li>
              <li>🏊 <strong>Águas mais estáveis</strong> — boa janela para banho, mergulho e passeios tranquilos.</li>
              <li>⛵ <strong>Navegação mais previsível</strong> — correnteza fraca, mais segura em canais estreitos e manobras de atracação.</li>
              <li>🎣 <strong>Pesca mais parada</strong> — menor movimentação de nutrientes e cardumes que na maré viva.</li>
              <li>🏖️ <strong>Praia menos variável</strong> — a faixa de areia muda pouco entre a maré alta e a baixa.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Próximas datas de maré morta</h2>
          <div className="grid gap-3 mb-10">
            {picos.length === 0 && (
              <p className="text-slate-500 text-sm">Nenhum período encontrado na janela calculada.</p>
            )}
            {picos.map((p, i) => (
              <div key={i} className="bg-white rounded-xl border border-emerald-100 p-4 flex items-center justify-between">
                <p className="font-semibold text-slate-800 capitalize">{formatDataLonga(p.data)}</p>
                <span className="text-sm font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">
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
            <Link href="/mare-viva" className="text-blue-600 font-medium hover:underline">
              Veja também: o que é maré viva (sizígia) →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
