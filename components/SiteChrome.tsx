'use client';

import { usePathname } from 'next/navigation';

/**
 * Esconde o "chrome" do site (rodapé, anúncios, banner de cookies, ondas de fundo)
 * nas rotas /widget/*, que são renderizadas dentro de iframes em sites de terceiros.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/widget')) return null;
  return <>{children}</>;
}
