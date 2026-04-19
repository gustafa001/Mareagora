import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

const articles = [
  {
    slug: 'como-ler-tabua-de-mares',
    title: 'Como Ler a Tábua de Marés: Guia Completo',
    excerpt: 'Aprenda a interpretar a tábua de marés do MaréAgora e entenda cada coluna, horário e altura da maré.',
    date: '2026-01-15',
    category: 'Educativo',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663540123945/mVcVYXQTzdvfCdkZG2aUmm/hero-ocean-sunrise-5oCyapg8htSXDBuPr9S66F.webp',
  },
  {
    slug: 'o-que-causa-as-mares',
    title: 'O Que Causa as Marés? A Ciência Por Trás do Fenômeno',
    excerpt: 'Descubra como a Lua e o Sol influenciam as marés e por que elas mudam todos os dias.',
    date: '2026-01-14',
    category: 'Ciência',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663540123945/mVcVYXQTzdvfCdkZG2aUmm/ocean-waves-abstract-2f6Vp5eNTENW552MgsAQ5e.webp',
  },
  {
    slug: 'piscinas-naturais-brasil',
    title: 'Piscinas Naturais do Brasil: Onde Encontrar e Quando Visitar',
    excerpt: 'Guia completo das melhores piscinas naturais brasileiras e os melhores momentos de maré para visitá-las.',
    date: '2026-01-13',
    category: 'Turismo',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663540123945/mVcVYXQTzdvfCdkZG2aUmm/tide-pools-natural-P6gyeTojKC7aS5g5GXPHfM.webp',
  },
  {
    slug: 'pesca-e-mares',
    title: 'Pesca e Marés: Como as Fases da Maré Influenciam a Pescaria',
    excerpt: 'Entenda como as marés afetam a pesca e aprenda a escolher o melhor momento para pescar.',
    date: '2026-01-12',
    category: 'Pesca',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663540123945/mVcVYXQTzdvfCdkZG2aUmm/port-aerial-view-MV5bbjSBrbfURLmKiDXH6m.webp',
  },
  {
    slug: 'melhores-praias-surf-mares',
    title: 'Melhores Praias para Surf e Como a Maré Influencia as Ondas',
    excerpt: 'Descubra as melhores praias para surf no Brasil e como a maré afeta a formação das ondas.',
    date: '2026-01-11',
    category: 'Surf',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663540123945/mVcVYXQTzdvfCdkZG2aUmm/ocean-waves-abstract-2f6Vp5eNTENW552MgsAQ5e.webp',
  },
  {
    slug: 'mergulho-e-mares',
    title: 'Mergulho e Marés: Como Escolher o Melhor Momento',
    excerpt: 'Guia prático para escolher o melhor momento de maré para suas aventuras de mergulho.',
    date: '2026-01-10',
    category: 'Mergulho',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663540123945/mVcVYXQTzdvfCdkZG2aUmm/tide-pools-natural-P6gyeTojKC7aS5g5GXPHfM.webp',
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-maritime to-blue-700 text-white py-12 md:py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog MaréAgora</h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Artigos educativos sobre marés, praias e atividades náuticas no Brasil
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`}>
                  <a className="group card-maritime hover:no-underline">
                    {/* Image */}
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-maritime text-xs font-semibold rounded-full">
                        {article.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-maritime mb-2 group-hover:text-accent-maritime transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4">
                      {article.excerpt}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(article.date)}
                    </div>

                    {/* Read More */}
                    <div className="mt-4 flex items-center gap-2 text-maritime font-semibold text-sm">
                      Ler Artigo
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Ad Space */}
        <section className="py-8 bg-gray-50 border-t border-gray-200">
          <div className="container text-center text-gray-500 text-sm">
            <p>Espaço para anúncios (AdSense)</p>
          </div>
        </section>
      </main>
    </div>
  );
}
