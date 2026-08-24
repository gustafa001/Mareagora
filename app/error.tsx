'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[PageError]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-3 font-syne text-white">
          Erro ao carregar
        </h2>
        <p className="text-gray-300 mb-6">
          {error.message || 'Algo deu errado ao carregar esta página.'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-cyan-500 hover:bg-cyan-400 text-[#0f172a] font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
