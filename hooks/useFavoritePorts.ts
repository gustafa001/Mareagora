'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mareagora_favorite_ports';
export const MAX_FAVORITES = 5;
const SYNC_EVENT = 'mareagora:favorites-changed';

function read(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string').slice(0, MAX_FAVORITES) : [];
  } catch {
    return [];
  }
}

/**
 * Favoritos do usuário, guardados só no navegador (localStorage).
 * O estado inicial é sempre vazio e só é preenchido depois de montar no
 * cliente — igual ao do servidor, então não gera erro de hidratação.
 */
export function useFavoritePorts() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setFavoriteSlugs(read());
    sync();
    setReady(true);
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggleFavorite = useCallback((slug: string): boolean => {
    try {
      const current = read();
      const isFav = current.includes(slug);
      if (!isFav && current.length >= MAX_FAVORITES) return false;
      const updated = isFav ? current.filter((s) => s !== slug) : [...current, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setFavoriteSlugs(updated);
      window.dispatchEvent(new Event(SYNC_EVENT));
      return true;
    } catch {
      return false; // localStorage indisponível — não é crítico
    }
  }, []);

  return {
    favoriteSlugs,
    ready,
    isFavorite: (slug: string) => favoriteSlugs.includes(slug),
    isFull: favoriteSlugs.length >= MAX_FAVORITES,
    toggleFavorite,
  };
}
