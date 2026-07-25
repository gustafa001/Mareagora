import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import SearchPorts from '@/components/SearchPorts';
import { PORTS } from '@/lib/ports';
import MareDiaListing, { buildEstadosDia } from '@/components/mare-dia/MareDiaListing';

export const metadata: Metadata = {
  title: 'Maré Hoje: Horários por Estado | MaréAgora',
  description: 'Previsão atualizada da maré alta e baixa de hoje, com os horários de todos os estados litorâneos do Brasil.',
  alternates: { canonical: 'https://mareagora.com.br/mare-hoje' },
};

export default function Page() {
  const hoje = new Date().toLocaleDateString('en-CA');
  const estados = buildEstadosDia(hoje);

  const agoraBR = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
  const [h, m] = agoraBR.split(':').map(Number);
  const currentMin = (h || 0) * 60 + (m || 0);

  const dataFormatada = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/mare-hoje"
        title="Maré Hoje: Horários por Estado | MaréAgora"
        description="Previsão atualizada da maré alta e baixa de hoje, com os horários de todos os estados litorâneos do Brasil."
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 font-syne mb-2 text-center">
            Maré Hoje
          </h1>
          <p className="text-slate-500 text-center mb-1 capitalize">{dataFormatada}</p>
          <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            Horário de maré alta e baixa de hoje em cada estado litorâneo. O evento destacado é o próximo a acontecer.
          </p>

          <MareDiaListing estados={estados} currentMin={currentMin} />

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
