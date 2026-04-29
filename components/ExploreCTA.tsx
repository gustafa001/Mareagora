import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ExploreCTA() {
  return (
    <section className="mt-8 mb-16 classic-card w-full">
      <h2 className="text-2xl font-bold mb-6 font-syne text-slate-800">Explore o MaréAgora</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/portos" 
          className="group flex items-center justify-between bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl" aria-hidden="true">🗺️</div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Ver todos os portos</h3>
              <p className="text-sm text-slate-500">Navegue pelo mapa do Brasil</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
        </Link>
        
        <Link 
          href="/guia-praias" 
          className="group flex items-center justify-between bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl" aria-hidden="true">🏖️</div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Guia de Praias</h3>
              <p className="text-sm text-slate-500">As melhores dicas litorâneas</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
        </Link>

        <Link 
          href="/blog" 
          className="group flex items-center justify-between bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl" aria-hidden="true">📝</div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Blog — Dicas de maré</h3>
              <p className="text-sm text-slate-500">Notícias e dicas exclusivas</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
        </Link>
      </div>
    </section>
  );
}
