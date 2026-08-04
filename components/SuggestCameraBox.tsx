'use client';

import { useState } from 'react';

const CONTACT_EMAIL = 'contatos@mareagora.com.br';

export default function SuggestCameraBox() {
  const [praia, setPraia] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `Sugestão de câmera ao vivo${praia ? `: ${praia}` : ''}`;
    const bodyLines = [
      `Praia/local sugerido: ${praia || '(não informado)'}`,
      `Link da câmera (YouTube, etc.): ${link || '(não informado)'}`,
      '',
      'Comentário adicional:',
      '',
    ];
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailto;
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-xl font-bold font-syne text-slate-800 sm:text-2xl">
          Sua praia não está na lista?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Manda o nome da praia e o link da câmera ao vivo (YouTube) que a gente avalia pra
          adicionar aqui.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 text-left">
          <div>
            <label htmlFor="suggest-praia" className="mb-1 block text-xs font-semibold text-slate-500">
              Praia ou local
            </label>
            <input
              id="suggest-praia"
              type="text"
              value={praia}
              onChange={(e) => setPraia(e.target.value)}
              placeholder="Ex: Praia de Camburi, Vitória - ES"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="suggest-link" className="mb-1 block text-xs font-semibold text-slate-500">
              Link da câmera (opcional)
            </label>
            <input
              id="suggest-link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.youtube.com/live/..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            ✉️ Enviar sugestão
          </button>
          <p className="text-center text-xs text-slate-400">
            Abre seu aplicativo de e-mail com a mensagem pronta para {CONTACT_EMAIL}
          </p>
        </form>
      </div>
    </section>
  );
}
