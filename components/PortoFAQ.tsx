import { getPortBySlug } from '@/lib/ports';
import { PortoCategory } from '@/data/porto-seo-config';

interface PortoFAQProps {
  slug: string;
  categoria?: PortoCategory;
}

export default function PortoFAQ({ slug, categoria = 'turismo' }: PortoFAQProps) {
  const port = getPortBySlug(slug);
  if (!port) return null;

  const nome = port.cityName;

  const faqs = [
    {
      q: "O que é tábua de marés?",
      a: "É a previsão dos horários e alturas de maré alta (preamar) e maré baixa (baixamar) para um porto ou praia. Os dados do MaréAgora são oficiais da Marinha do Brasil (DHN)."
    },
    {
      q: "O que significa o coeficiente de maré?",
      a: "O coeficiente indica a intensidade da maré: valores acima de 70 indicam maré viva (forte), abaixo de 40 indicam maré morta (fraca). Marés vivas ocorrem próximas à lua cheia e lua nova."
    },
    {
      q: "Como a maré afeta as praias e o banho de mar?",
      a: "Na maré baixa a faixa de areia fica mais ampla e piscinas naturais ficam acessíveis. Na maré alta as ondas chegam mais perto da orla. Para banho seguro, prefira o período de maré baixa a moderada."
    },
    {
      q: "Qual é o melhor horário de maré para pescar?",
      a: "As 2 horas antes e depois da maré baixa são as mais produtivas para a pesca. O movimento da água na vazante ativa a alimentação dos peixes. Marés vivas potencializam esse efeito."
    },
    {
      q: "As marés do litoral brasileiro são semidiurnas?",
      a: "Na maior parte do litoral brasileiro sim — ocorrem dois ciclos completos de maré alta e baixa a cada 24 horas. Algumas regiões do Pará e Maranhão têm marés mistas com grande amplitude, podendo superar 7 metros."
    },
    {
      q: "Com que frequência os dados de maré são atualizados?",
      a: "As previsões são baseadas nos dados oficiais da Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil, calculados astronomicamente para o ano inteiro com alta precisão."
    }
  ];

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
