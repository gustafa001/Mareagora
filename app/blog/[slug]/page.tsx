import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts, getPost, getRelatedPosts } from '@/lib/blog';
import NavBar from '@/components/NavBar';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} — MaréAgora Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://mareagora.com.br/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const months = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return `${months[parseInt(month)]} de ${year}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Guias e Tutoriais': 'from-blue-500/30 to-cyan-500/20 border-blue-400/30 text-blue-300',
  'Surf e Esportes': 'from-violet-500/30 to-purple-500/20 border-violet-400/30 text-violet-300',
  'Pesca': 'from-orange-500/30 to-amber-500/20 border-orange-400/30 text-orange-300',
  'Oceanografia': 'from-teal-500/30 to-emerald-500/20 border-teal-400/30 text-teal-300',
  'Segurança': 'from-red-500/30 to-rose-500/20 border-red-400/30 text-red-300',
  'Mergulho': 'from-cyan-500/30 to-sky-500/20 border-cyan-400/30 text-cyan-300',
  'Passeios e Turismo': 'from-green-500/30 to-emerald-500/20 border-green-400/30 text-green-300',
  'Praias': 'from-yellow-500/30 to-amber-500/20 border-yellow-400/30 text-yellow-300',
  'Estatísticas': 'from-indigo-500/30 to-blue-500/20 border-indigo-400/30 text-indigo-300',
  'Fotografia': 'from-pink-500/30 to-rose-500/20 border-pink-400/30 text-pink-300',
};

function getCategoryStyle(category: string): string {
  return (
    CATEGORY_COLORS[category] ??
    'from-slate-500/30 to-slate-600/20 border-slate-400/30 text-slate-300'
  );
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.category, post.tags, 3);
  const catStyle = getCategoryStyle(post.category);

  return (
    <div className="min-h-screen" style={{ background: 'var(--ocean)' }}>
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <span className="text-slate-700">/</span>
          <Link href="/blog" className="hover:text-blue-400 transition-colors">
            Blog
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-slate-400 truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Article header */}
        <header className="mb-10">
          <div className="mb-4">
            <span
              className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-gradient-to-r ${catStyle}`}
            >
              {post.category}
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black text-white leading-tight mb-6"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <span>📅</span>
              <span>{formatDate(post.date)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>📖</span>
              <span>{post.readingTime}</span>
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold text-slate-500 bg-white/5 border border-white/10 rounded-full px-3 py-1"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article body */}
        <article className="prose-blog text-white whitespace-pre-wrap">
          {post.content}
        </article>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>←</span>
            <span>Voltar ao Blog</span>
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2
              className="text-xl font-black text-white uppercase tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Veja Também
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => {
                const relCatStyle = getCategoryStyle(rel.category);
                return (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group block"
                  >
                    <div
                      className="glass-card rounded-xl p-4 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(13,34,64,0.85) 0%, rgba(6,16,30,0.95) 100%)',
                      }}
                    >
                      <span
                        className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border bg-gradient-to-r ${relCatStyle} mb-2`}
                      >
                        {rel.category}
                      </span>
                      <h3
                        className="text-sm font-bold text-white leading-snug group-hover:text-blue-300 transition-colors flex-grow"
                        style={{ fontFamily: 'var(--font-syne)' }}
                      >
                        {rel.title}
                      </h3>
                      <span className="text-xs text-slate-600 mt-2">
                        {rel.readingTime}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
