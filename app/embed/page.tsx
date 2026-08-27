'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PORTS } from '@/lib/ports';

const featured = PORTS.filter(p =>
  ['copacabana', 'porto-de-santos', 'porto-de-florianopolis', 'porto-de-galinhas', 'jericoacoara', 'porto-de-belem', 'porto-de-salvador', 'maragogi', 'pipa', 'praia-do-rosa'].includes(p.slug)
);

function generateIframeCode(slug: string, theme: string, transparent: boolean) {
  const t = transparent ? '&transparent=1' : '';
  return `<iframe
  src="https://mareagora.com.br/widget/porto/${slug}?theme=${theme}${t}"
  width="100%"
  height="200"
  style="border:none;border-radius:12px;"
  scrolling="no"
  loading="lazy"
  title="Maré — MaréAgora"
  id="mareagora-widget"
></iframe>`;
}

function generateScriptCode() {
  return `<script>
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'mareagora-widget-height') {
    var iframe = document.getElementById('mareagora-widget');
    if (iframe) iframe.style.height = e.data.height + 'px';
  }
});
</script>`;
}

export default function EmbedPage() {
  const [selected, setSelected] = useState('copacabana');
  const [theme, setTheme] = useState('auto');
  const [transparent, setTransparent] = useState(true);

  const iframeCode = generateIframeCode(selected, theme, transparent);
  const scriptCode = generateScriptCode();
  const fullCode = `${iframeCode}\n${scriptCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          ← Voltar
        </Link>

        <h1 className="text-3xl font-black text-slate-900 font-syne mb-4">Incorporar Widget de Maré</h1>
        <p className="text-slate-600 mb-8">
          Adicione a tábua de maré ao seu site em 2 minutos. O widget se adapta automaticamente ao tema do seu site.
        </p>

        {/* Configurador */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">1. Configure</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Porto</label>
              <select
                value={selected}
                onChange={e => setSelected(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                {featured.map(p => (
                  <option key={p.slug} value={p.slug}>{p.cityName} — {p.state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tema</label>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="auto">Auto (segue o navegador)</option>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fundo</label>
              <select
                value={transparent ? '1' : '0'}
                onChange={e => setTransparent(e.target.value === '1')}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="1">Transparente</option>
                <option value="0">Sólido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">2. Preview</h2>
          <div className="flex justify-center">
            <iframe
              src={`/widget/porto/${selected}?theme=${theme}${transparent ? '&transparent=1' : ''}`}
              width="320"
              height="200"
              style={{ border: 'none', borderRadius: 12 }}
              scrolling="no"
              loading="lazy"
              title="Preview Widget"
            />
          </div>
        </div>

        {/* Código */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">3. Copie o código</h2>
          <p className="text-sm text-slate-600 mb-4">
            Cole este código no HTML do seu site. O script ajusta a altura do iframe automaticamente.
          </p>
          <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap break-all">{fullCode}</pre>
          </div>
          <button
            onClick={() => copyToClipboard(fullCode)}
            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            Copiar código completo
          </button>
        </div>

        {/* Query params */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Parâmetros URL</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2">Param</th>
                <th className="pb-2">Valores</th>
                <th className="pb-2">Padrão</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr>
                <td className="py-1 font-mono text-xs">theme</td>
                <td className="py-1">light, dark, auto</td>
                <td className="py-1">auto</td>
              </tr>
              <tr>
                <td className="py-1 font-mono text-xs">transparent</td>
                <td className="py-1">0, 1</td>
                <td className="py-1">0</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 text-center">
          Widget gratuito por MaréAgora • Dados oficiais da Marinha do Brasil
        </p>
      </div>
    </main>
  );
}
