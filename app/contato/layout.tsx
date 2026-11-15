import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato | MaréAgora',
  description: 'Fale com a equipe do MaréAgora: dúvidas, sugestões e contato comercial.',
  alternates: { canonical: '/contato' },
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
