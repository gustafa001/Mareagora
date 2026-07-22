'use client';

import { useEffect, useState, type ReactNode } from 'react';

export interface DashboardGridItem {
  id: string;
  span?: 1 | 2;
  node: ReactNode;
}

interface DashboardGridProps {
  items: DashboardGridItem[];
  storageKey: string;
}

/**
 * Grid responsivo (4 colunas desktop / 2 tablet / 1 celular) com
 * reordenação por arrastar-e-soltar. A ordem é persistida por porto em
 * localStorage — puramente cosmético, não afeta nenhuma regra de negócio.
 */
export default function DashboardGrid({ items, storageKey }: DashboardGridProps) {
  const [order, setOrder] = useState<string[]>(items.map(i => i.id));
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedOrder: string[] = JSON.parse(saved);
        const valid = savedOrder.filter(id => items.some(i => i.id === id));
        const missing = items.map(i => i.id).filter(id => !valid.includes(id));
        setOrder([...valid, ...missing]);
        return;
      }
    } catch {
      // ignora localStorage indisponível (ex: modo privado)
    }
    setOrder(items.map(i => i.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, items.length]);

  function persist(newOrder: string[]) {
    setOrder(newOrder);
    try { localStorage.setItem(storageKey, JSON.stringify(newOrder)); } catch { /* noop */ }
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...order];
    const from = next.indexOf(dragId);
    const to = next.indexOf(targetId);
    next.splice(from, 1);
    next.splice(to, 0, dragId);
    persist(next);
    setDragId(null);
  }

  const byId = new Map(items.map(i => [i.id, i]));
  const ordered = order.map(id => byId.get(id)).filter(Boolean) as DashboardGridItem[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {ordered.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDragId(item.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(item.id)}
          className={`${item.span === 2 ? 'sm:col-span-2' : ''} cursor-grab active:cursor-grabbing transition-opacity ${dragId === item.id ? 'opacity-40' : 'opacity-100'}`}
        >
          {item.node}
        </div>
      ))}
    </div>
  );
}
