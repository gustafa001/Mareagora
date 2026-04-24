import { getPortBySlug } from '@/lib/ports';
import { portosConfig, categoryDefaults, PortoCategory } from '@/data/porto-seo-config';

interface PortoFAQProps {
  slug: string;
  categoria?: PortoCategory;
}

export default function PortoFAQ({ slug, categoria = 'turismo' }: PortoFAQProps) {
  const port = getPortBySlug(slug);
  if (!port) return null;

  const nome = port.cityName;
  const isCommercial = port.name.toLowerCase().includes('porto') || port.name.toLowerCase().includes('terminal') || categoria === 'industrial';

  let faqs = [];

  if (isCommercial) {
    faqs = [
      {
        q: `Como a maré afeta as operações de atracação em ${nome}?`,
        a: `As operações de atracação em ${nome} dependem estritamente da tábua de marés. Navios de grande calado aguardam a preamar para manobrar com segurança no canal de acesso.`,
      },
      {
        q: `O que é coeficiente de maré e como afeta navios de grande calado?`,
        a: `O coeficiente indica a amplitude da maré. Em ${nome}, coeficientes altos significam marés de sizígia, permitindo a entrada de navios mais pesados, mas gerando correntes mais fortes.`,
      },
      {
        q: `Qual é a amplitude média das marés em ${nome}?`,
        a: `A amplitude varia conforme a fase lunar, mas em ${nome} as maiores variações ocorrem nas luas nova e cheia, exigindo planejamento rigoroso da praticagem.`,
      },
      {
        q: `As marés em ${nome} são semidiurnas ou diurnas?`,
        a: `O regime de marés na costa brasileira, incluindo ${nome}, é predominantemente semidiurno, com duas marés altas e duas marés baixas a cada dia lunar.`,
      },
      {
        q: `Como verificar a tábua de marés oficial da Marinha para ${nome}?`,
        a: `A tábua oficial pode ser consultada no site do CHM (Centro de Hidrografia da Marinha). Aqui no MaréAgora, facilitamos a leitura desses mesmos dados oficiais para ${nome}.`,
      },
      {
        q: `Em que horários é mais seguro navegar pelo Canal de ${nome}?`,
        a: `A navegação é mais segura durante o estofo da maré (momento de inversão), quando as correntes de maré em ${nome} são mínimas.`,
      },
      {
        q: `Maré viva vs maré morta: qual a diferença prática para ${nome}?`,
        a: `Marés vivas (sizígia) oferecem maior calado na maré alta, mas correntes fortes. Marés mortas (quadratura) têm menor variação, resultando em correntes mais fracas no porto de ${nome}.`,
      },
    ];
  } else {
    faqs = [
      {
        q: `Qual é o melhor horário de maré para surfar em ${nome}?`,
        a: `O momento ideal varia, mas em ${nome} a meia maré (enchendo ou vazando) costuma oferecer as melhores condições e formação de ondas.`,
      },
      {
        q: `Quando a maré baixa revela piscinas naturais em ${nome}?`,
        a: `As piscinas naturais de ${nome} ficam expostas durante a baixamar, especialmente em dias de maré de sizígia (lua nova ou cheia) com coeficientes altos.`,
      },
      {
        q: `Como a fase lunar influencia a maré em ${nome}?`,
        a: `Nas fases de lua nova e cheia, a atração gravitacional é maior, gerando marés vivas com maior amplitude em ${nome}. Nas luas minguante e crescente, ocorrem as marés mortas.`,
      },
      {
        q: `É seguro tomar banho na maré alta em ${nome}?`,
        a: `Depende da praia. Na maré alta em ${nome}, as ondas podem quebrar mais perto da areia ou em bancadas mais rasas, exigindo atenção redobrada dos banhistas.`,
      },
      {
        q: `Qual é a amplitude típica da maré em ${nome}?`,
        a: `A amplitude em ${nome} segue o padrão da sua região. Marés de sizígia apresentam variação significativamente maior entre a maré alta e baixa do que marés de quadratura.`,
      },
      {
        q: `Como usar a tábua de marés para planejar a pesca em ${nome}?`,
        a: `Os melhores momentos para pesca em ${nome} são geralmente nas duas horas que antecedem e sucedem o pico da maré alta ou baixa, quando a movimentação de água ativa os peixes.`,
      },
      {
        q: `O que significa coeficiente 92 na previsão de marés?`,
        a: `Um coeficiente de 92 indica uma maré viva muito forte em ${nome}. Isso significa que a maré alta será excepcionalmente alta e a maré baixa muito mais seca que o normal.`,
      },
    ];
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <section
      aria-label="Perguntas frequentes"
      className="classic-card mt-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      <h2 className="text-2xl font-bold mb-6 font-syne">Perguntas Frequentes sobre {nome}</h2>
      <dl className="space-y-5">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-slate-100 last:border-0 pb-5 last:pb-0">
            <dt className="font-semibold text-slate-800 mb-1">{faq.q}</dt>
            <dd className="text-slate-600 leading-relaxed text-sm">{faq.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
