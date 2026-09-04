import Link from 'next/link';
import { getStateSlug } from '@/lib/states';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'O que é uma tábua de marés?',
    a: 'É a tabela que informa os horários e as alturas das marés alta (preamar) e baixa (baixamar) de uma localidade. No MaréAgora, os dados são calculados a partir das tábuas oficiais da Marinha do Brasil (DHN).',
  },
  {
    q: 'O que é preamar?',
    a: 'Preamar é o momento em que a maré atinge seu nível máximo (maré cheia). É quando a água sobe mais e a praia fica com faixa de areia reduzida.',
  },
  {
    q: 'O que é baixa-mar?',
    a: 'Baixa-mar (ou baixamar) é o momento em que a maré atinge seu nível mínimo (maré seca). A areia fica mais exposta e surgem poças e piscinas naturais.',
  },
  {
    q: 'Quantas marés existem por dia no Brasil?',
    a: 'Na maior parte do litoral brasileiro o regime é semidiurno: duas preamares e duas baixa-mares a cada 24h50min. A amplitude varia conforme a região e a fase lunar.',
  },
  {
    q: 'Como a maré influencia a pesca?',
    a: 'Os peixes se movimentam mais na chamada virada da maré, nas 2 horas ao redor da maré alta e da maré baixa. Coeficientes altos (acima de 70) indicam corrente mais intensa e águas mais produtivas.',
  },
  {
    q: 'Como a maré influencia o surf?',
    a: 'A maré não cria as ondas, mas afeta como elas quebram. Em muitos picos, a maré baixa a média favorece ondas com melhor forma; em outros, é a maré alta que traz o banco ideal.',
  },
  {
    q: 'Por que o horário da maré muda todo dia?',
    a: 'A maré segue o dia lunar, que dura cerca de 24h50min. Por isso os horários de preamar e baixamar atrasam, em média, 50 minutos a cada dia.',
  },
  {
    q: 'O que é maré de sizígia e de quadratura?',
    a: 'Sizígia ocorre nas luas nova e cheia, com a maior variação de nível. Quadratura ocorre nas luas crescente e minguante, com marés menores. Use o coeficiente para saber a intensidade do dia.',
  },
];

const DESTINOS = [
  { nome: 'Tábua de Maré Guarujá', slug: 'guaruja', estado: 'SP' },
  { nome: 'Tábua de Maré Santos', slug: 'porto-de-santos', estado: 'SP' },
  { nome: 'Tábua de Maré Fernando de Noronha', slug: 'arquipelago-de-fernando-de-noronha', estado: 'PE' },
  { nome: 'Tábua de Maré Florianópolis', slug: 'porto-de-florianopolis', estado: 'SC' },
  { nome: 'Tábua de Maré Porto de Tutóia', slug: 'porto-de-tutoia', estado: 'MA' },
  { nome: 'Tábua de Maré São Luís', slug: 'sao-luis', estado: 'MA' },
];

export default function HomeFaq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />

      {/* O que é / como interpretar + influência em pesca e surf */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16 text-slate-300 border-t border-white/5">
        <h2 className="text-3xl font-black text-white mb-8 font-syne tracking-tight text-center md:text-left">
          Como interpretar a tábua de marés
        </h2>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            Para ler a tábua, observe a coluna de <strong className="text-white">horário</strong> (se a maré é
            alta ou baixa) e a coluna de <strong className="text-white">altura em metros</strong>. A preamar marca o
            pico, e a baixamar o menor nível do dia. Em litorais de grande amplitude, como o do Maranhão, a diferença
            entre as duas pode passar de 6 metros — o que muda completamente a faixa de areia entre as marés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Maré e pesca</h3>
            <p className="text-slate-400">
              Planeje a pescaria nas <strong className="text-white">2 horas ao redor da preamar e da baixamar</strong>,
              quando a água se movimenta e os peixes se alimentam. Coeficientes acima de 70 indicam marés mais
              produtivas.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Maré e surf</h3>
            <p className="text-slate-400">
              Verifique a correção de cada pico: em muitas praias a <strong className="text-white">maré baixa a
              média</strong> dá ondas com mais forma; em outras, é a maré alta que ativa o banco. Combine a tábua com a
              previsão de vento e ondulação.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ geral sobre marés no Brasil */}
      <section
        aria-label="Perguntas frequentes sobre marés"
        className="w-full max-w-4xl mx-auto px-6 py-12 text-slate-300 border-t border-white/5"
      >
        <h2 className="text-3xl font-black text-white mb-8 font-syne tracking-tight text-center md:text-left">
          Perguntas Frequentes sobre Marés no Brasil
        </h2>
        <dl className="space-y-5">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-slate-700/60 last:border-0 pb-5 last:pb-0">
              <dt className="font-semibold text-white mb-1">{faq.q}</dt>
              <dd className="text-slate-400 leading-relaxed text-sm">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Links internos principais localidades */}
      <section className="w-full max-w-4xl mx-auto px-6 py-12 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white mb-6 font-syne">Principais localidades com tábua de marés</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DESTINOS.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/mare/${getStateSlug(d.estado)}/${d.slug}`}
                className="block text-blue-400 hover:text-white transition-colors"
              >
                {d.nome} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}