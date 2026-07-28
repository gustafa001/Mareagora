'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mareagora_recent_ports';
const MAX_RECENT = 4;

export function useRecentPorts() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRecentSlugs(JSON.parse(saved));
    } catch {
      // localStorage indisponível (modo privado, cookies bloqueados, etc.) — ignora
    }
  }, []);

  const addRecentPort = useCallback((slug: string) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const current: string[] = saved ? JSON.parse(saved) : [];
      const updated = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentSlugs(updated);
    } catch {
      // ignora — não é crítico
    }
  }, []);

  return { recentSlugs, addRecentPort };
}
