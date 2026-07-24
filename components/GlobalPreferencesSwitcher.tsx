'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { GlobalPreferences, Locale, HeightUnit, HourFormat } from '@/lib/globalPreferences';

export default function GlobalPreferencesSwitcher({ initialPrefs }: { initialPrefs: GlobalPreferences }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [prefs, setPrefs] = useState<GlobalPreferences>(initialPrefs);

  async function updatePref<K extends keyof GlobalPreferences>(key: K, value: GlobalPreferences[K]) {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    
    await fetch('/mare-mundo/preferencias', {
      method: 'POST',
      body: JSON.stringify({ [key]: value }),
      headers: { 'Content-Type': 'application/json' },
    });

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex gap-4 items-center text-sm">
      <select
        value={prefs.locale}
        onChange={(e) => updatePref('locale', e.target.value as Locale)}
        className="bg-transparent border-b border-gray-300 py-1"
        disabled={isPending}
      >
        <option value="pt">Português</option>
        <option value="en">English</option>
      </select>

      <select
        value={prefs.unit}
        onChange={(e) => updatePref('unit', e.target.value as HeightUnit)}
        className="bg-transparent border-b border-gray-300 py-1"
        disabled={isPending}
      >
        <option value="m">Metros (m)</option>
        <option value="ft">Pés (ft)</option>
      </select>

      <select
        value={prefs.hourFormat}
        onChange={(e) => updatePref('hourFormat', e.target.value as HourFormat)}
        className="bg-transparent border-b border-gray-300 py-1"
        disabled={isPending}
      >
        <option value="24h">24h</option>
        <option value="12h">12h (AM/PM)</option>
      </select>
    </div>
  );
}
