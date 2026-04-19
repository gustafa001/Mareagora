"use client";

import { useEffect, useState } from "react";

interface ConditionsCardProps {
  lat: number;
  lon: number;
}

export default function ConditionsCard({ lat, lon }: ConditionsCardProps) {
  const [loading, setLoading] = useState(true);
  const [conditions, setConditions] = useState<any>(null);

  useEffect(() => {
    async function fetchConditions() {
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_period&timezone=America%2FSao_Paulo&forecast_days=1`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        const h = json.hourly;
        const now = new Date();
        const nowH = now.getHours();
        
        const idx = h.time.findIndex((t: string) => {
          const d = new Date(t);
          return d.getHours() === nowH && d.toDateString() === now.toDateString();
        });
        const i = idx >= 0 ? idx : 0;
        const wh = h.wave_height[i];
        const wp = h.wave_period[i];

        let icon = '🏄', label = 'Boas condições', desc = 'Ondas adequadas para a maioria das atividades.';
        if (wh < 0.3) { icon = '😴'; label = 'Mar calmo'; desc = 'Ótimo para mergulho e natação. Poucas ondas para surfe.'; }
        else if (wh < 0.8) { icon = '🤿'; label = 'Condições suaves'; desc = 'Ideal para kayak, mergulho e pesca.'; }
        else if (wh < 1.5) { icon = '🏄'; label = 'Boas condições'; desc = 'Ótimo para surf iniciante e intermediário.'; }
        else if (wh < 2.5) { icon = '🌊'; label = 'Ondas fortes'; desc = 'Para surfistas experientes. Atenção para banho de mar.'; }
        else { icon = '⚠️'; label = 'Mar agitado'; desc = 'Condições adversas. Evite atividades na água.'; }

        setConditions({ icon, label, desc });
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    fetchConditions();
  }, [lat, lon]);

  if (loading) return <div className="classic-card text-center p-6 text-gray-500 text-sm">Calculando condições…</div>;

  return (
    <div className="classic-card">
      <h3 className="card-title mb-4">🏄 Condições da Água</h3>
      <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
        <div className="text-[3.5rem] mb-3 leading-none">{conditions?.icon || '⏳'}</div>
        <div className="font-syne font-extrabold text-[1.4rem] tracking-tight text-gray-800 mb-2">{conditions?.label || 'Calculando…'}</div>
        <div className="text-gray-500 text-sm leading-relaxed px-5">{conditions?.desc || '—'}</div>
      </div>
    </div>
  );
}
