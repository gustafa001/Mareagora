import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🏝️</div>
        <h2 className="text-2xl font-bold mb-3 font-syne text-white">
          Página não encontrada
        </h2>
        <p className="text-gray-300 mb-6">
          O endereço que você procura não existe ou foi movido.
        </p>
        <Link
          href="/"
          className="inline-block bg-cyan-500 hover:bg-cyan-400 text-[#0f172a] font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
