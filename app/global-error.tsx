'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="bg-[#0f172a] text-white font-dm-sans min-h-screen flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="text-6xl mb-4">🌊</div>
          <h1 className="text-2xl font-bold mb-3 font-syne">
            Algo deu errado
          </h1>
          <p className="text-gray-300 mb-6">
            Encontramos um problema inesperado. Por favor, tente novamente.
          </p>
          <button
            onClick={() => reset()}
            className="bg-cyan-500 hover:bg-cyan-400 text-[#0f172a] font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
