'use client';

import { useState } from 'react';

export default function SuggestCameraBox() {
  const [praia, setPraia] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!praia.trim()) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/suggest-camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ praia, link }),
      });

      if (!res.ok) throw new Error('Falha no envio');

      setStatus('sent');
      setPraia('');
      setLink('');
    } catch {
      setStatus('error');
    }
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

        {status === 'sent' ? (
          <div className="mt-6 rounded-lg bg-emerald-50 px-4 py-6 text-sm font-medium text-emerald-700">
            ✅ Sugestão enviada, obrigado!
          </div>
        ) : (
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
                required
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
              disabled={status === 'sending'}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {status === 'sending' ? 'Enviando...' : '✉️ Enviar sugestão'}
            </button>

            {status === 'error' && (
              <p className="text-center text-xs text-red-500">
                Não deu pra enviar agora. Tenta de novo em instantes.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
