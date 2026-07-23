import type { Metadata } from 'next';
import SchemaGenerator from '@/components/seo/SchemaGenerator';

export const metadata: Metadata = {
  title: 'Maré Morta (Quadratura) | MaréAgora',
  description: 'Calendário e explicação das marés mortas.',
  alternates: { canonical: 'https://mareagora.com.br/mare-morta' },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <SchemaGenerator 
        type="WebPage"
        url="https://mareagora.com.br/mare-morta"
        title="Maré Morta (Quadratura) | MaréAgora"
        description="Calendário e explicação das marés mortas."
      />
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 font-syne mb-6">
          Maré Morta (Quadratura)
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Calendário e explicação das marés mortas.
        </p>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500">Página otimizada com SEO Programático (Conteúdo em desenvolvimento dinâmico).</p>
        </div>
      </div>
    </main>
  );
}
