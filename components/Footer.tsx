import Link from 'next/link';
import { getTopCities } from '@/lib/topCities';

export default function Footer() {
  const topCities = getTopCities();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-blue-500/20 flex-shrink-0">
                <img
                  src="/logo-mark.png"
                  alt="MaréAgora"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-black text-xl">MaréAgora</span>
            </div>
            <p className="text-sm">Previsão de marés em tempo real</p>
            <p className="text-xs mt-1">Dados oficiais da Marinha do Brasil • DHN</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <Link href="/portos" className="hover:text-white transition-colors">Portos</Link>
            <Link href="/guia-praias" className="hover:text-white transition-colors">Guia de Praias</Link>
            <Link href="/glossario-de-mare" className="hover:text-white transition-colors">Glossário</Link>
            <Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link>
            <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link>
            <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
            <Link href="/embed" className="hover:text-white transition-colors">Widget para o seu site</Link>
          </nav>
        </div>

        {topCities.length > 0 && (
          <div className="border-t border-slate-800 mt-8 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 text-center">
              Tábuas de maré mais buscadas
            </p>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {topCities.map(c => (
                <li key={c.slug}>
                  <Link href={c.href} className="hover:text-white transition-colors">
                    Tábua de maré {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} MaréAgora. Todos os direitos reservados.</p>
          <p className="mt-1">As previsões são baseadas em dados oficiais e não substituem instrumentos náuticos profissionais.</p>
        </div>
      </div>
    </footer>
  );
}
