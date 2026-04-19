// Tarefa 3: componente PortoFAQ com schema.org FAQPage
import { portosConfig, categoryDefaults, PortoCategory } from '@/data/porto-seo-config';

interface PortoFAQProps {
  slug: string;
  categoria?: PortoCategory;
}

export default function PortoFAQ({ slug, categoria = 'turismo' }: PortoFAQProps) {
  const config = portosConfig[slug];
  const faqs = config?.faqs ?? categoryDefaults[categoria]?.faqs ?? [];

  if (faqs.length === 0) return null;

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
      <h2 className="text-2xl font-bold mb-6 font-syne">Perguntas Frequentes</h2>
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
