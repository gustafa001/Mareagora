import React from 'react';

interface OpsCardProps {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Cartão base do dashboard de Operações Portuárias — visual dark/industrial. */
export default function OpsCard({ title, icon, action, className = '', children }: OpsCardProps) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl shadow-lg shadow-black/20 p-5 flex flex-col gap-4 transition-all duration-300 hover:border-white/20 max-w-full overflow-hidden ${className}`}
    >
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-lg opacity-90 flex-shrink-0">{icon}</span>}
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 font-syne break-words">{title}</h3>
        </div>
        {action}
      </header>
      <div className="flex-1 min-w-0">{children}</div>
    </section>
  );
}
