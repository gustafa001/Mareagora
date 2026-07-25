import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import SearchPorts from '@/components/SearchPorts';
import { PORTS } from '@/lib/ports';
import { getEventosDia } from '@/lib/mare';
import { getTideCoefficient } from '@/lib/tideUtils';
import { getStateSlug } from '@/lib/states';
import { getRepresentativePorts } from '@/components/mare-dia/MareDiaListing';

export const metadata: Metadata = {
  title: 'Maré da Semana: Tábua de 7 Dias por Estado | MaréAgora',
  description: 'Tábua de maré e coeficiente para os próximos 7 dias, com o resumo de cada estado litorâneo do Brasil.',
  alternates: { canonical: 'https://mareagora.com.br/mare-semana' },
};

function fmtDiaCurto(date: Date) {
  return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
}

export default function Page() {
  const hoje = new Date();
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() + i);
    return d;
  });

  const estados = getRepresentativePorts().map((port) => {
    const semana = dias.map((d) => {
      const dataStr = d.toLocaleDateString('en-CA');
      const eventos = getEventosDia(port, dataStr);
      const coef = getTideCoefficient(0, eventos.length >= 2 ? eventos : undefined);
      return { data: d, coef: eventos.length >= 2 ? coef.value : null };
    });
    return { port, semana };
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/mare-semana"
        title="Maré da Semana: Tábua de 7 Dias por Estado | MaréAgora"
        description="Tábua de maré e coeficiente para os próximos 7 dias, com o resumo de cada estado litorâneo do Brasil."
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 font-syne mb-2 text-center">
            Maré da Semana
          </h1>
          <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            Coeficiente de maré dos próximos 7 dias em cada estado litorâneo — quanto maior o número, maior a amplitude entre alta e baixa.
          </p>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto mb-10">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 sticky left-0 bg-slate-50">Estado</th>
                  {dias.map((d, i) => (
                    <th key={i} className="text-center px-3 py-3 capitalize">{fmtDiaCurto(d)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {estados.map(({ port, semana }) => (
                  <tr key={port.state} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-4 py-3 sticky left-0 bg-white">
                      <Link href={`/mare/${getStateSlug(port.state)}/${port.slug}`} className="font-semibold text-slate-800 hover:text-blue-600">
                        {port.state}
                      </Link>
                      <p className="text-[10px] text-slate-400">{port.cityName}</p>
                    </td>
                    {semana.map((s, i) => (
                      <td key={i} className="text-center px-3 py-3">
                        {s.coef === null ? (
                          <span className="text-slate-300">—</span>
                        ) : (
                          <span
                            className={`inline-block text-xs font-bold px-2 py-1 rounded-lg ${
                              s.coef >= 90
                                ? 'bg-rose-100 text-rose-700'
                                : s.coef <= 40
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {s.coef}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-400 text-center mb-10">
            Clique no estado para ver a tábua de maré completa (horários e alturas) do porto de referência.
          </p>

          <div className="bg-slate-900 rounded-2xl p-8 text-center">
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
