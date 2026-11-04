'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PORTS, getPortBySlug } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';

const SITE = 'https://mareagora.com.br';

// Lista completa, ordenada por nome. Calculada uma vez no módulo.
const ALL_PORTS = [...PORTS].sort((a, b) =>
  (a.cityName || a.name).localeCompare(b.cityName || b.name, 'pt-BR')
);

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Busca sem acento: "guaruja" encontra "Guarujá".
function normalize(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function pageUrl(port: { slug: string; state: string }) {
  return `${SITE}/mare/${getStateSlug(port.state)}/${port.slug}`;
}

function generateIframeCode(
  port: { slug: string; state: string; cityName: string; name: string },
  theme: string,
  transparent: boolean
) {
  const t = transparent ? '&transparent=1' : '';
  const city = escapeHtml(port.cityName || port.name);
  // O link de texto fica FORA do iframe, no HTML do site parceiro.
  // É ele que vale como backlink (link dentro de iframe conta como link nosso para nós mesmos).
  return `<iframe
  src="${SITE}/widget/porto/${port.slug}?theme=${theme}${t}"
  width="100%"
  height="200"
  style="border:none;border-radius:12px;"
  scrolling="no"
  loading="lazy"
  title="Tábua de maré ${city}"
  id="mareagora-widget"
></iframe>
<p style="font-size:12px;margin:4px 0 0;text-align:center;">
  <a href="${pageUrl(port)}" target="_blank">Tábua de maré ${city} hoje – MaréAgora</a>
</p>`;
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
  const [selected, setSelected] = useState(
    getPortBySlug('copacabana') ? 'copacabana' : ALL_PORTS[0].slug
  );
  const [theme, setTheme] = useState('auto');
  const [transparent, setTransparent] = useState(true);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Permite pré-selecionar via /embed?porto=<slug> (link vindo da página da cidade)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('porto');
    if (p && getPortBySlug(p)) setSelected(p);
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return ALL_PORTS;
    const list = ALL_PORTS.filter(p =>
      normalize(`${p.cityName} ${p.name} ${p.state}`).includes(q)
    );
    // mantém o item selecionado visível mesmo fora do filtro
    const sel = getPortBySlug(selected);
    return sel && !list.includes(sel) ? [sel, ...list] : list;
  }, [query, selected]);

  const port = getPortBySlug(selected) ?? ALL_PORTS[0];
  const iframeCode = generateIframeCode(port, theme, transparent);
  const scriptCode = generateScriptCode();
  const fullCode = `${iframeCode}\n${scriptCode}`;
  const cityLabel = port.cityName || port.name;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignora: navegador sem permissão de clipboard */
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          ← Voltar
        </Link>

        <h1 className="text-3xl font-black text-slate-900 font-syne mb-4">
          Tábua de maré grátis para o seu site
        </h1>
        <p className="text-slate-600 mb-8">
          Coloque a maré de hoje da sua praia ou porto no seu blog, pousada, marina ou escola de surf em 2 minutos.
          Dados oficiais da Marinha do Brasil, atualizados automaticamente, sem custo.
        </p>

        {/* 1. Configurar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">1. Configure</h2>

          <div className="mb-4">
            <label htmlFor="busca-local" className="block text-xs font-semibold text-slate-700 mb-1">
              Buscar praia ou porto
            </label>
            <input
              id="busca-local"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ex.: Guarujá, Maceió, Santos…"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Local</label>
              <select
                value={selected}
                onChange={e => setSelected(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                {filtered.map(p => (
                  <option key={p.slug} value={p.slug}>
                    {(p.cityName || p.name)} — {p.state}
                  </option>
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

        {/* 2. Preview (inclui o link de crédito, igual ao que o parceiro vai ver) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">2. Preview</h2>
          <div className="flex flex-col items-center">
            <iframe
              key={`${selected}-${theme}-${transparent}`}
              src={`/widget/porto/${selected}?theme=${theme}${transparent ? '&transparent=1' : ''}`}
              width="320"
              height="200"
              style={{ border: 'none', borderRadius: 12 }}
              scrolling="no"
              loading="lazy"
              title={`Preview — tábua de maré ${cityLabel}`}
            />
            <p className="mt-1 text-xs text-center">
              <a
                href={pageUrl(port)}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Tábua de maré {cityLabel} hoje – MaréAgora
              </a>
            </p>
          </div>
        </div>

        {/* 3. Código */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">3. Copie o código</h2>
          <p className="text-sm text-slate-600 mb-2">
            Cole no HTML do seu site, onde quiser que a maré apareça. O script ajusta a altura do widget automaticamente.
          </p>
          <p className="text-sm text-slate-600 mb-4">
            O link de crédito abaixo do widget faz parte do código gratuito. Por favor, mantenha-o: é a nossa única
            contrapartida por oferecer os dados sem custo.
          </p>
          <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap break-all">{fullCode}</pre>
          </div>
          <button
            onClick={() => copyToClipboard(fullCode)}
            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            {copied ? 'Copiado!' : 'Copiar código completo'}
          </button>
        </div>

        {/* Parâmetros */}
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
