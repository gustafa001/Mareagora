import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Widget de Tábua de Maré Grátis para o Seu Site | MaréAgora',
  description:
    'Coloque a tábua de maré de hoje no seu site, blog, pousada ou escola de surf. Widget grátis com dados oficiais da Marinha do Brasil, para qualquer praia ou porto.',
  alternates: { canonical: '/embed' },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
