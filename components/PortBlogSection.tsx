import Link from 'next/link';
import { getPostsByPort } from '@/lib/blog';

interface Props {
  portSlug: string;
  portName: string;
}

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const months = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return `${months[parseInt(month)]} de ${year}`;
}

export default function PortBlogSection({ portSlug, portName }: Props) {
  const posts = getPostsByPort(portSlug);

  if (posts.length === 0) {
    return (
      <Link href="/blog" className="block group">
        <div
          className="p-4 sm:p-6 flex items-center justify-between rounded-3xl border border-white/20 shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
          style={{ background: '#0f1f3d' }}
        >
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl sm:text-3xl border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all flex-shrink-0">
              📝
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="text-[10px] font-black uppercase tracking-widest mb-1 font-syne"
                style={{ color: '#60a5fa' }}
              >
                Blog
              </div>
              <div
                className="text-xl sm:text-3xl font-black font-syne leading-tight"
                style={{ color: '#ffffff' }}
              >
                MaréAgora Blog
              </div>
              <div
                className="text-xs font-bold mt-2 flex items-center gap-1.5"
                style={{ color: '#93c5fd' }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                Guias e Artigos sobre marés
              </div>
            </div>
          </div>
          <div className="hidden lg:block text-right max-w-[140px] flex-shrink-0">
            <p className="text-[10px] leading-relaxed font-medium opacity-80" style={{ color: '#cbd5e1' }}>
              Tudo sobre marés, surf, pesca e atividades no litoral.
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black font-syne text-white">
          📝 Artigos sobre {portName}
        </h2>
        <Link
          href="/blog"
          className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
        >
          Ver todos →
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <div
              className="p-4 sm:p-5 rounded-2xl border border-white/10 hover:border-blue-400/40 hover:shadow-blue-500/10 hover:shadow-xl transition-all duration-300"
              style={{ background: '#0f1f3d' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border mb-2"
                    style={{
                      background: 'rgba(59,130,246,0.15)',
                      borderColor: 'rgba(59,130,246,0.3)',
                      color: '#93c5fd',
                    }}
                  >
                    {post.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-black font-syne text-white leading-snug group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1">
                  →
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-[10px] text-slate-600">{formatDate(post.date)}</span>
                <span className="text-[10px] text-slate-600">📖 {post.readingTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
