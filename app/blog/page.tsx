import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/blog';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Blog — MaréAgora',
  description:
    'Guias, dicas e previsões de marés para todo o litoral do Brasil. Surf, pesca, mergulho e navegação com dados da Marinha do Brasil.',
  openGraph: {
    title: 'Blog — MaréAgora',
    description:
      'Guias, dicas e previsões de marés para todo o litoral do Brasil. Surf, pesca, mergulho e navegação com dados da Marinha do Brasil.',
    url: 'https://mareagora.com.br/blog',
    type: 'website',
  },
};

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

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const months = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return `${months[parseInt(month)]} de ${year}`;
}

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="min-h-screen" style={{ background: 'var(--ocean)' }}>
      <NavBar />

      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(42,104,246,0.6) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(56,201,240,0.4) 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-8">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300">Blog</span>
          </nav>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4">
              <span>🌊</span>
              <span>MaréAgora Blog</span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Guias e Artigos
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Tudo sobre marés, surf, pesca, mergulho e atividades no litoral brasileiro. Conteúdo baseado em dados oficiais da <span className="text-blue-400 font-semibold">Marinha do Brasil</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const catStyle = getCategoryStyle(post.category);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article
                  className="glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/30"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(13,34,64,0.85) 0%, rgba(6,16,30,0.95) 100%)',
                  }}
                >
                  {/* Category badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-gradient-to-r ${catStyle}`}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-lg font-black text-white leading-snug mb-3 group-hover:text-blue-300 transition-colors"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow mb-4">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold text-slate-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-slate-600 border-t border-white/5 pt-4 mt-auto">
                    <span>{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1">
                      <span>📖</span>
                      <span>{post.readingTime}</span>
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
