import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import SearchPorts from '@/components/SearchPorts';
import { PORTS } from '@/lib/ports';
import { getMoonAge, getTideCoefficient, getMoonPhase } from '@/lib/tideUtils';

export const metadata: Metadata = {
  title: 'Maré para Pesca: Melhores Horários, Lua e Pressão | MaréAgora',
  description:
    'Guia completo de maré para pesca: como usar o coeficiente de maré, a tábua solunar e o barômetro de pressão atmosférica para achar os melhores horários e dias para pescar.',
  alternates: { canonical: 'https://mareagora.com.br/pesca' },
};

const FATORES = [
  {
    icon: '🌊',
    titulo: 'Coeficiente de Maré',
    desc: 'Quanto maior o coeficiente (acima de 70), mais forte é a correnteza — isso movimenta cardumes e nutrientes, geralmente melhorando a pesca. Marés muito fracas (abaixo de 40) tendem a deixar os peixes menos ativos.',
    link: { href: '/coeficiente', label: 'Ver coeficiente de hoje' },
  },
  {
    icon: '🌙',
    titulo: 'Tábua Solunar',
    desc: 'Peixes se alimentam mais nos períodos em que a lua está a pino ou no fundo (períodos maiores, ~2h) e no nascer/poente da lua (períodos menores, ~1h). Quando esses períodos coincidem com a maré cheia, a janela é ainda melhor.',
    link: { href: '/lua', label: 'Entenda as fases da lua' },
  },
  {
    icon: '🌡️',
    titulo: 'Pressão Atmosférica (Barômetro)',
    desc: 'Pressão subindo ou caindo rápido costuma antecipar uma "arrancada" de fome antes da mudança de tempo. Pressão estável mantém a atividade em ritmo normal. Quedas bruscas e sustentadas tendem a interromper a alimentação.',
    link: null,
  },
  {
    icon: '💨',
    titulo: 'Vento e Ondas',
    desc: 'Vento forte de terra para o mar dificulta o arremesso e pode turvar demais a água na arrebentação; vento fraco a moderado costuma ser mais favorável. Ondas maiores revolvem o fundo e podem espantar cardumes da praia.',
    link: null,
  },
];

const BAROMETRO_FAIXAS = [
  { label: 'Muito Bom', cor: 'bg-emerald-100 text-emerald-700 border-emerald-200', desc: 'Pressão subindo rápido (≥ 1,0 hPa em 3h). Sinal clássico de boa atividade dos peixes.' },
  { label: 'Bom', cor: 'bg-cyan-100 text-cyan-700 border-cyan-200', desc: 'Pressão em alta suave (0,3 a 1,0 hPa em 3h). Tendência positiva para a pesca.' },
  { label: 'Médio', cor: 'bg-slate-100 text-slate-700 border-slate-200', desc: 'Pressão estável (variação menor que 0,3 hPa em 3h). Atividade normal dos peixes.' },
  { label: 'Bom no início', cor: 'bg-amber-100 text-amber-700 border-amber-200', desc: 'Pressão em queda (0,3 a 1,0 hPa em 3h). Boa pesca ao início, mas os peixes tendem a parar de se alimentar em pouco tempo.' },
  { label: 'Mau', cor: 'bg-rose-100 text-rose-700 border-rose-200', desc: 'Queda brusca de pressão (≥ 1,0 hPa em 3h). Geralmente indica frente fria ou mau tempo chegando — atividade tende a cair bastante.' },
];

function formatDatePt(date: Date) {
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

export default function Page() {
  const hoje = new Date();
  const idadeHoje = getMoonAge(hoje);
  const coefHoje = getTideCoefficient(idadeHoje);
  const faseHoje = getMoonPhase(idadeHoje);

  const coefBom = coefHoje.value >= 70;

  const faq = [
    {
      question: 'Qual o melhor horário do dia para pescar?',
      answer:
        'Geralmente amanhecer e entardecer, quando a luz é mais baixa e muitas espécies se alimentam. Combine isso com a tábua solunar do seu porto: se um período maior ou menor cair perto do nascer/pôr do sol, a janela costuma ser ainda melhor.',
    },
    {
      question: 'Maré alta ou baixa é melhor para pescar?',
      answer:
        'Depende do local e da espécie. Em geral, a virada da maré (quando ela muda de sentido) e o período de maior correnteza — perto da maré alta ou baixa — costumam concentrar mais atividade do que a água parada no meio da tábua.',
    },
    {
      question: 'Que fase da lua é melhor para pescar?',
      answer:
        'Lua nova e lua cheia (sizígia) geram marés vivas, com correnteza mais forte e coeficiente mais alto — normalmente mais produtivas. Quartos crescente e minguante (quadratura) trazem marés mais fracas e água mais parada.',
    },
    {
      question: 'A pressão atmosférica realmente afeta a pesca?',
      answer:
        'É uma das variáveis mais citadas por pescadores experientes: peixes têm um órgão sensível a variações de pressão (bexiga natatória) e mudam de profundidade e apetite conforme ela sobe, cai ou se estabiliza — principalmente antes da chegada de frentes frias.',
    },
    {
      question: 'Dá para ver a pressão e a tábua solunar de um porto específico?',
      answer:
        'Sim — busque seu porto ou praia abaixo. Cada página de porto no MaréAgora traz a Tábua Solunar do dia e o Barômetro de Pesca com a pressão atual e a tendência das últimas horas.',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/pesca"
        title="Maré para Pesca: Melhores Horários, Lua e Pressão | MaréAgora"
        description="Guia completo de maré para pesca: coeficiente de maré, tábua solunar e barômetro de pressão atmosférica."
        faq={faq}
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 font-syne mb-4 text-center">
            Maré para Pesca
          </h1>
          <p className="text-lg text-slate-600 mb-6 text-center max-w-2xl mx-auto">
            Os quatro fatores que mais influenciam uma boa pescaria: maré, lua, pressão atmosférica e vento. Veja o
            resumo de hoje e busque o seu porto para os dados completos.
          </p>

          <div className="mb-10 text-center">
            <Link
              href="/lugares-de-pesca"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              🗺️ Ver mapa de píers, molhes e praias de pesca
            </Link>
          </div>

          {/* Card do dia */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-10 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2 capitalize">
              {formatDatePt(hoje)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-4">
              <div>
                <p className="text-4xl font-black text-slate-900 font-syne">{coefHoje.value}</p>
                <p className="text-sm text-slate-500">Coeficiente — {coefHoje.label}</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-100" />
              <div>
                <p className="text-4xl">{faseHoje.icon}</p>
                <p className="text-sm text-slate-500">{faseHoje.name}</p>
              </div>
            </div>
            <p className={`mt-6 inline-block px-4 py-2 rounded-full text-sm font-bold border ${coefBom ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {coefBom ? '🎣 Coeficiente favorável para pesca hoje' : 'Coeficiente moderado — combine com a tábua solunar do seu porto'}
            </p>
          </div>

          {/* Os 4 fatores */}
          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">O que observar antes de sair para pescar</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {FATORES.map((f) => (
              <div key={f.titulo} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{f.icon}</span>
                  <p className="font-bold text-slate-800">{f.titulo}</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{f.desc}</p>
                {f.link && (
                  <Link href={f.link.href} className="text-sm text-blue-600 font-medium hover:underline">
                    {f.link.label} →
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Barômetro explicado */}
          <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">Como ler o Barômetro de Pesca</h2>
          <p className="text-sm text-slate-600 mb-4">
            Cada página de porto no MaréAgora traz um Barômetro de Pesca com a pressão atual e a variação das últimas
            3 horas, classificada em 5 faixas:
          </p>
          <div className="grid gap-3 mb-10">
            {BAROMETRO_FAIXAS.map((b) => (
              <div key={b.label} className={`rounded-xl border p-4 flex items-start gap-4 ${b.cor}`}>
                <span className="font-black text-sm font-syne whitespace-nowrap uppercase tracking-wide">{b.label}</span>
                <p className="text-sm opacity-90">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Busca por porto */}
          <div className="bg-slate-900 rounded-2xl p-8 mb-10 text-center">
            <h2 className="text-xl font-bold text-white font-syne mb-4">
              Veja a tábua solunar e o barômetro do seu porto ou praia
            </h2>
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

          <div className="text-center flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center">
            <Link href="/lugares-de-pesca" className="text-blue-600 font-medium hover:underline">
              Veja também: mapa de lugares de pesca →
            </Link>
            <Link href="/coeficiente" className="text-blue-600 font-medium hover:underline">
              Veja também: o que é o coeficiente de maré →
            </Link>
            <Link href="/lua" className="text-blue-600 font-medium hover:underline">
              Como a lua influencia a maré →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
