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
  
  // 1. Obter perguntas específicas do porto
  const config = portosConfig[slug];
  const portFaqs = config?.faqs ?? [];

  // 2. Obter perguntas de fallback da categoria
  const fallbackFaqs = categoryDefaults[categoria]?.faqs ?? [];

  // 3. Mesclar evitando duplicatas e garantindo o máximo possível (mínimo 6 devido aos defaults expandidos)
  const mergedFaqs = [...portFaqs];
  const portQuestions = new Set(portFaqs.map((f) => f.q.toLowerCase().trim()));

  for (const f of fallbackFaqs) {
    if (!portQuestions.has(f.q.toLowerCase().trim())) {
      mergedFaqs.push(f);
    }
  }

  // Pegamos as perguntas resultantes
  const finalFaqs = mergedFaqs;

  if (finalFaqs.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: finalFaqs.map((faq) => ({
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
        {finalFaqs.map((faq, i) => (
          <div key={i} className="border-b border-slate-100 last:border-0 pb-5 last:pb-0">
            <dt className="font-semibold text-slate-800 mb-1">{faq.q}</dt>
            <dd className="text-slate-600 leading-relaxed text-sm">{faq.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
