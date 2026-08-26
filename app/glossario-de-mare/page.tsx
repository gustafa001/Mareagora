import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import { PORTS } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';

export const metadata: Metadata = {
  title: 'Glossário de Maré: Termos e Definições | MaréAgora',
  description:
    'Glossário completo com as principais definições de maré: preamar, baixamar, enchente, vazante, amplitude, sizígia e quadratura. Entenda cada termo usado nas tábuas de marés.',
  alternates: { canonical: 'https://mareagora.com.br/glossario-de-mare' },
};

const TERMOS = [
  {
    id: 'preamar',
    titulo: 'Maré de Cima / Maré Alta (Preamar)',
    definicao:
      'A preamar é o momento em que o nível do mar atinge sua altura máxima antes de começar a descer. Em portos com duas preamares por dia (regime semidiurno, comum na maior parte do Brasil), ocorrem duas preamares a cada ~24 horas e 50 minutos.',
    detalhes:
      'A altura exata da preamar varia conforme a fase da lua e a geografia local. Nas sizígias (lua nova ou cheia), a preamar pode ser até o dobro daquela observada em quadratura. Em portos como Belém, a preamar pode elevar o nível do mar em mais de 4 metros.',
    portSlug: 'copacabana',
    portLabel: 'Ver a tábua de maré de Copacabana',
  },
  {
    id: 'baixamar',
    titulo: 'Maré de Baixo / Maré Baixa (Baixamar)',
    definicao:
      'A baixamar é o momento em que o nível do mar atinge sua altura mínima antes de voltar a subir. É o ponto mais baixo do ciclo de maré e expõe bancos de areia, recifes e costões que ficam submersos na preamar.',
    detalhes:
      'A baixamar é o período mais procurado por pescadores de costão, mergulhadores e quem quer caminhar sobre recifes. Em locais com recifes de coral como Porto de Galinhas, a baixamar revela as famosas piscinas naturais. Cuidado: em praias com declive suave, a maré pode recuar dezenas de metros.',
    portSlug: 'jericoacoara',
    portLabel: 'Ver a tábua de maré de Jericoacoara',
  },
  {
    id: 'marca-final',
    titulo: 'Marca Final da Maré',
    definicao:
      'A marca final da maré é a altura máxima ou mínima que o nível do mar atinge em um determinado local, medida em relação a um referencial fixo (geralmente o Zero de Aferição da Marinha). Ela define o ponto exato em que a maré para de subir ou de descer.',
    detalhes:
      'Nos boletins de maré da Marinha do Brasil, a marca final aparece como o valor em metros que indica até onde a água vai chegar (preamar) ou recuar (baixamar). Essa marca é usada por pilotos de navio para calcular o calado seguro e por pescadores para saber se o local estará acessível.',
    portSlug: 'porto-de-santos',
    portLabel: 'Ver a tábua de maré do Porto de Santos',
  },
  {
    id: 'enchente-vazante',
    titulo: 'Enchente e Vazante',
    definicao:
      'Enchente é o período em que a maré está subindo, entre a baixamar e a preamar. Vazante é o período em que a maré está descendo, entre a preamar e a baixamar. São os dois "sentidos" do movimento da maré.',
    detalhes:
      'A enchente e a vazante geram correntes que podem ser fortes em canais e estreitos. Para pescadores, o período de enchente tende a trazer peixes costeiros para mais perto da praia, enquanto a vazante arrasta nutrientes para fora. Em portos como Florianópolis, a troca de enchente para vazante cria correntes perceptíveis no Canal da Barra da Lagoa.',
    portSlug: 'porto-de-florianopolis',
    portLabel: 'Ver a tábua de maré de Florianópolis',
  },
  {
    id: 'amplitude',
    titulo: 'Amplitude de Maré',
    definicao:
      'A amplitude de maré é a diferença de altura entre a preamar e a baixamar consecutivas. Quanto maior a amplitude, mais o nível do mar oscila entre o ponto mais alto e o mais baixo do ciclo.',
    detalhes:
      'No Brasil, a amplitude varia enormemente: no Golfão Maranhense (São Luís), pode ultrapassar 6 metros nas sizígias, enquanto em Florianópolis raramente passa de 1 metro. A amplitude influencia diretamente a força das correntes, a navegação, a pesca e o turismo balnear. Grandes amplitudes significam correntes mais fortes e paisagens que mudam radicalmente a cada 6 horas.',
    portSlug: 'porto-de-belem',
    portLabel: 'Ver a tábua de maré do Porto de Belém',
  },
  {
    id: 'sizigia-quadratura',
    titulo: 'Maré de Sizígia vs. Maré de Quadratura',
    definicao:
      'Sizígia ocorre quando o Sol, a Lua e a Terra estão alinhados (lua nova ou lua cheia), gerando marés vivas com maior amplitude. Quadratura ocorre quando a Lua está em ângulo de 90° em relação ao Sol (quarto crescente ou minguante), gerando marés mortas com menor amplitude.',
    detalhes:
      'Nas sizígias, a força gravitacional do Sol e da Lua se somam, resultando nas preamares mais altas e baixamares mais baixas do ciclo — daí o nome "maré viva". Nas quadraturas, as forças se opõem parcialmente, e a diferença entre preamar e baixamar é menor — "maré morta". Para pescadores, marés vivas costumam ser mais produtivas porque as correntes mais fortes movimentam mais alimento e cardumes.',
    portSlug: 'porto-de-galinhas',
    portLabel: 'Ver a tábua de maré de Porto de Galinhas',
  },
];

function portHref(slug: string) {
  const port = PORTS.find((p) => p.slug === slug);
  if (!port) return '/';
  return `/mare/${getStateSlug(port.state)}/${port.slug}`;
}

export default function GlossarioDeMarePage() {
  const faq = TERMOS.map((t) => ({
    question: `O que é ${t.titulo.split('/')[0].trim().toLowerCase()}?`,
    answer: t.definicao,
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/glossario-de-mare"
        title="Glossário de Maré: Termos e Definições | MaréAgora"
        description="Glossário completo com as principais definições de maré: preamar, baixamar, enchente, vazante, amplitude, sizígia e quadratura."
        faq={faq}
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 font-syne mb-4 text-center">
            Glossário de Maré
          </h1>
          <p className="text-lg text-slate-600 mb-6 text-center max-w-2xl mx-auto">
            Entenda os termos usados nas tábuas de marés e nos boletins da Marinha do Brasil. Cada definição é direta e
            objetiva para você consultar rapidamente.
          </p>

          <nav className="mb-10 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Navegue pelos termos</p>
            <div className="flex flex-wrap justify-center gap-2">
              {TERMOS.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  {t.titulo.split('/')[0].trim()}
                </a>
              ))}
            </div>
          </nav>

          <div className="space-y-8">
            {TERMOS.map((t) => (
              <section key={t.id} id={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">{t.titulo}</h2>
                <p className="text-base text-slate-700 leading-relaxed mb-4">{t.definicao}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{t.detalhes}</p>
                <Link
                  href={portHref(t.portSlug)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  🌊 {t.portLabel} →
                </Link>
              </section>
            ))}
          </div>

          <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white font-syne mb-4">Pronto para aplicar o que aprendeu?</h2>
            <p className="text-sm text-slate-300 mb-6">
              Busque seu porto ou praia e confira a tábua de maré completa com horários de preamar, baixamar, enchente e
              vazante.
            </p>
            <div className="max-w-md mx-auto">
              <Link
                href="/portos"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Ver todos os portos →
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center">
            <Link href="/pesca" className="text-blue-600 font-medium hover:underline">
              Guia de maré para pesca →
            </Link>
            <Link href="/coeficiente" className="text-blue-600 font-medium hover:underline">
              O que é o coeficiente de maré →
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
