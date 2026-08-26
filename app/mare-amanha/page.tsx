import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import SearchPorts from '@/components/SearchPorts';
import { PORTS } from '@/lib/ports';
import MareDiaListing, { buildEstadosDia } from '@/components/mare-dia/MareDiaListing';

export const metadata: Metadata = {
  title: 'Maré Amanhã: Horários por Estado | MaréAgora',
  description: 'Previsão de maré alta e baixa para amanhã, com os horários de todos os estados litorâneos do Brasil.',
  alternates: { canonical: 'https://mareagora.com.br/mare-amanha' },
};

export default function Page() {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const amanhaStr = amanha.toLocaleDateString('en-CA');
  const estados = buildEstadosDia(amanhaStr);

  const dataFormatada = amanha.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/mare-amanha"
        title="Maré Amanhã: Horários por Estado | MaréAgora"
        description="Previsão de maré alta e baixa para amanhã, com os horários de todos os estados litorâneos do Brasil."
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-black text-slate-900 font-syne mb-2 text-center">
            Maré Amanhã
          </h1>
          <p className="text-slate-500 text-center mb-1 capitalize">{dataFormatada}</p>
          <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            Horário de maré alta e baixa previsto para amanhã, em cada estado litorâneo.
          </p>

          <MareDiaListing estados={estados} />

          <div className="bg-slate-900 rounded-2xl p-8 mt-10 text-center">
            <h2 className="text-xl font-bold text-white font-syne mb-4">Quer a tábua completa de um porto ou praia específica?</h2>
            <div className="max-w-md mx-auto">
              <SearchPorts ports={PORTS} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
