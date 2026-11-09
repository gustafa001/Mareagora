'use client';

import { useFavoritePorts, MAX_FAVORITES } from '@/hooks/useFavoritePorts';

/** Estrela "Favoritar" das páginas de maré. Começa neutra e só reflete o estado após montar. */
export default function FavoriteButton({ slug, name }: { slug: string; name: string }) {
  const { ready, isFavorite, isFull, toggleFavorite } = useFavoritePorts();
  const fav = ready && isFavorite(slug);
  const blocked = ready && !fav && isFull;

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(slug)}
      disabled={blocked}
      aria-pressed={fav}
      aria-label={fav ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
      title={blocked ? `Limite de ${MAX_FAVORITES} favoritos. Remova um para adicionar.` : undefined}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all backdrop-blur-md disabled:cursor-not-allowed disabled:opacity-50 ${
        fav
          ? 'border-amber-400/60 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25'
          : 'border-white/10 bg-white/5 text-blue-300 hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-white'
      }`}
    >
      <span aria-hidden="true">{fav ? '★' : '☆'}</span>
      {fav ? 'Favorito' : 'Favoritar'}
    </button>
  );
}
