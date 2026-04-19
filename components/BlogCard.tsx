'use client';

import Link from 'next/link';

export default function BlogCard() {
  return (
    <Link href="/blog" className="block group">
      <div className="p-4 sm:p-6 flex items-center justify-between rounded-3xl border border-white/20 shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/50 transition-all duration-300" style={{ background: '#0f1f3d' }}>
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl sm:text-3xl border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all flex-shrink-0">
            📝
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1 font-syne" style={{ color: '#60a5fa' }}>Blog</div>
            <div className="text-xl sm:text-3xl font-black font-syne leading-tight sm:leading-none drop-shadow-lg truncate" style={{ color: '#ffffff' }}>
              MaréAgora Blog
            </div>
            <div className="text-xs font-bold mt-2 flex items-center gap-1.5" style={{ color: '#93c5fd' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
              Guias e Artigos
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
