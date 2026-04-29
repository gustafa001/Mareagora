import Link from 'next/link';
import { getPosts } from '@/lib/blog';

export default function RecentBlogPosts() {
  const latestPosts = getPosts().slice(0, 3);

  if (latestPosts.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 border-t border-white/5">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white font-syne flex items-center gap-2">
          <span className="w-2 h-8 bg-emerald-500 rounded-full" />
          Guias e Dicas
        </h2>
        <Link href="/blog" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          Ver blog completo →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {latestPosts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all hover:border-emerald-500/30"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">
              {post.category}
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-3 leading-tight">
              {post.title}
            </h3>
            <div className="mt-auto flex items-center gap-3 text-slate-500 text-xs">
              <span className="flex items-center gap-1">
                ⏱️ {post.readingTime}
              </span>
              <span>•</span>
              <span>Leia mais →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
