'use client';

import Link from 'next/link';
import { getPortBySlug, PORTS } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';

export default function WidgetIndexPage() {
  const featured = PORTS.filter(p =>
    ['copacabana', 'porto-de-santos', 'porto-de-florianopolis', 'porto-de-galinhas', 'jericoacoara', 'porto-de-belem', 'porto-de-salvador', 'maragogi'].includes(p.slug)
  );

  const embedUrl = (slug: string) => {
    const port = getPortBySlug(slug);
    if (!port) return '';
    return `/widget/porto/${port.slug}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          ← Voltar
        </Link>
        <h1 className="text-3xl font-black text-slate-900 font-syne mb-4">Widget de Maré</h1>
        <p className="text-slate-600 mb-8">
          Incorporne a tábua de maré do seu porto favorito em qualquer site. Copie o iframe abaixo e cole no seu blog, pousada ou escola de surf.
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Como usar</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            <li>Escolha um porto na lista abaixo</li>
            <li>Copie o código do iframe</li>
            <li>Cole no HTML do seu site onde quiser que o widget apareça</li>
          </ol>
        </div>

        <div className="space-y-4">
          {featured.map(port => {
            const url = embedUrl(port.slug);
            const iframeCode = `<iframe src="https://mareagora.com.br${url}" width="320" height="180" frameborder="0" style="border-radius:12px;border:1px solid #e2e8f0;" loading="lazy" title="Maré ${port.cityName}"></iframe>`;
            return (
              <div key={port.slug} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{port.cityName}</h3>
                    <p className="text-xs text-slate-500">{port.state} — {getStateSlug(port.state)}</p>
                  </div>
                  <Link
                    href={url}
                    target="_blank"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Preview →
                  </Link>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 font-mono text-xs text-slate-700 break-all">
                  {iframeCode}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(iframeCode)}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Copiar código
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 mt-8 text-center">
          Widget gratuito por MaréAgora • Dados oficiais da Marinha do Brasil
        </p>
      </div>
    </main>
  );
}
