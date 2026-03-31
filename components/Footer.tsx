import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#06101e] border-t border-[rgba(56,201,240,0.1)] pt-16 pb-8 text-[rgba(255,255,255,0.7)] mt-auto">
      <div className="container">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h2 className="font-syne font-extrabold text-2xl text-white">MaréAgora</h2>
            <p className="text-sm leading-relaxed max-w-sm">
              A plataforma definitiva de previsão de marés, ventos e ondas do Brasil.
              Potencializamos a sua segurança marítima com dados oficiais da Marinha do Brasil e previsão meteorológica global.
            </p>
          </div>
          
          {/* Menu Col 1 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-syne font-bold text-white uppercase tracking-widest text-xs opacity-90">A Plataforma</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/" className="hover:text-[var(--foam)] transition-colors">Portos e Praias</Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-[var(--foam)] transition-colors">Sobre Nós</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[var(--foam)] transition-colors">Ajuda & FAQ</Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-[var(--foam)] transition-colors">Contato</Link>
              </li>
            </ul>
          </div>
          
          {/* Menu Col 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-syne font-bold text-white uppercase tracking-widest text-xs opacity-90">Políticas</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/termos" className="hover:text-[var(--foam)] transition-colors">Termos de Uso</Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-[var(--foam)] transition-colors">Política de Privacidade</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-[rgba(255,255,255,0.05)]">
          <p className="text-xs">
            © {currentYear} MaréAgora. Inovação oceanográfica ao seu dispor.
          </p>
          
          <div className="flex items-center gap-2 bg-[rgba(56,201,240,0.05)] border border-[rgba(56,201,240,0.15)] rounded-full px-4 py-1.5 focus-within:ring-2">
            <span className="text-sm">⚓</span>
            <span className="text-[var(--muted)] text-xs font-bold uppercase tracking-wider">Dados Oficiais: CHM</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
