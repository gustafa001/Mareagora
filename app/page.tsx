'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNearestPort } from '@/lib/ports';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!navigator.geolocation) {
      router.replace('/mare/porto-de-santos');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = getNearestPort(pos.coords.latitude, pos.coords.longitude);
        router.replace(`/mare/${nearest.slug}`);
      },
      () => {
        // Se usuário negar ou timeout, vai para Porto de Santos como padrão
        router.replace('/mare/porto-de-santos');
      },
      { timeout: 5000 }
    );
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center text-white">
        <div className="text-5xl mb-4">🌊</div>
        <p className="text-lg text-blue-200">Localizando o porto mais próximo…</p>
      </div>
    </div>
  );
}
