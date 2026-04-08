"use client";

import { degToCompass } from "@/lib/tideUtils";
import { useEffect, useState } from "react";

interface WavesCardProps {
  lat: number;
  lon: number;
}

const RESSACA_LIMIT = 2.5;

export default function WavesCard({ lat, lon }: WavesCardProps) {
  const [data, setData] = useState<any>(null);
  const [futureRessaca, setFutureRessaca] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWaves() {
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}`
        + `&hourly=wave_height,wave_period,wave_direction,wind_wave_height`
        + `&wind_speed_unit=kn&timezone=America%2FSao_Paulo&forecast_days=30`;

      try {
        const res = await fetch(url);
        const json = await res.json();
        
        if (!json || !json.hourly || !json.hourly.time) {
          setLoading(false);
          return;
        }

        const h = json.hourly;
        const now = new Date();
        const nowPad = now.getHours().toString().padStart(2, '0');
        const todayStr = now.toLocaleDateString('en-CA'); // formato YYYY-MM-DD

        // 1. Dados Atuais
        const idx = h.time.findIndex((t: string) => {
          return t.startsWith(todayStr) && t.includes(`T${nowPad}:`);
        });
        const i = idx >= 0 ? idx : 0;

        if (h.wave_height && h.wave_height[i] !== undefined) {
          setData({
            height: h.wave_height[i],
            period: h.wave_period ? h.wave_period[i] : 0,
            direction: h.wave_direction ? h.wave_direction[i] : 0,
            windWave: h.wind_wave_height ? h.wind_wave_height[i] : 0,
          });
        }

        // 2. Lógica de Alerta Antecipado (Próximos 30 dias)
        // Procuramos a primeira ocorrência de ressaca APÓS o momento atual
        const futureIdx = h.wave_height.findIndex((height: number, index: number) => {
          return index > i && height >= RESSACA_LIMIT;
        });

        if (futureIdx !== -1) {
          const ressacaDate = new Date(h.time[futureIdx]);
          const formattedDate = ressacaDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            weekday: 'short'
          });
          setFutureRessaca(formattedDate);
        } else {
          setFutureRessaca(null);
        }

        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    fetchWaves();
  }, [lat, lon]);

  if (loading) return <div className="classic-card text-center p-6 text-gray-500 text-sm">Carregando ondas…</div>;
  if (!data) return <div className="classic-card text-center p-6 text-gray-500 text-sm">Sem dados de ondas.</div>;

  const isRessacaNow = data.height >= RESSACA_LIMIT;

  return (
    <div className={`classic-card relative overflow-hidden transition-all duration-500 ${isRessacaNow ? 'bg-red-500/5 border-red-500/20' : ''}`}>
      {/* Badge de Alerta Atual */}
      {isRessacaNow && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-b-xl animate-pulse tracking-widest shadow-lg">
            ⚠️ RESSACA AGORA
          </div>
        </div>
      )}

      {/* Badge de Alerta Antecipado (Apenas se não houver ressaca agora) */}
      {!isRessacaNow && futureRessaca && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="bg-amber-500 text-white text-[9px] font-black px-4 py-1.5 rounded-b-xl tracking-widest shadow-md flex items-center gap-2">
            <span className="animate-bounce">⚠️</span> ALERTA: RESSACA PREVISTA ({futureRessaca})
          </div>
        </div>
      )}
      
      <h3 className={`card-title mb-6 ${(isRessacaNow || futureRessaca) ? 'mt-6' : ''}`}>🌊 Ondas e Vento agora</h3>
      
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Altura das ondas</span>
          <span className={`font-syne font-bold text-base ${isRessacaNow ? 'text-red-600' : 'text-blue-600'}`}>
            {data.height.toFixed(1)} m
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Período</span>
          <span className="font-syne font-bold text-base text-gray-800">{data.period.toFixed(0)} s</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Dir. das ondas</span>
          <span className="font-syne font-bold text-base text-gray-800">{degToCompass(data.direction)} ({data.direction}°)</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-gray-500 text-sm font-medium">Vento</span>
          <span className="font-syne font-bold text-base text-gray-800">{data.windWave.toFixed(1)} m</span>
        </div>
        
        <div className={`flex justify-center items-center gap-6 mt-4 p-5 rounded-2xl border transition-colors duration-500 ${isRessacaNow ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`w-[60px] h-[60px] rounded-full bg-white shadow-sm border flex items-center justify-center relative shrink-0 ${isRessacaNow ? 'border-red-200' : 'border-gray-200'}`}>
            <span 
              className={`text-2xl transition-transform duration-500 ease-out inline-block ${isRessacaNow ? 'text-red-600' : 'text-blue-600'}`} 
              style={{ transform: `rotate(${data.direction}deg)` }}
            >
              ↑
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className={`font-syne font-bold text-3xl leading-none ${isRessacaNow ? 'text-red-600' : 'text-gray-800'}`}>
              {data.height.toFixed(1)}m
            </div>
            <div className="text-gray-500 text-sm font-bold tracking-wide uppercase">{degToCompass(data.direction)}</div>
          </div>
        </div>

        {isRessacaNow && (
          <div className="mt-4 text-center">
            <p className="text-red-600 text-[11px] font-bold italic bg-red-50 py-2 rounded-lg border border-red-100">
              * Condições de ressaca detectadas. Evite atividades no mar.
            </p>
          </div>
        )}

        {!isRessacaNow && futureRessaca && (
          <div className="mt-4 text-center">
            <p className="text-amber-700 text-[10px] font-bold bg-amber-50 py-2 rounded-lg border border-amber-100 px-2">
              Atenção: Monitoramos uma possível ressaca para {futureRessaca}. Planeje-se com antecedência.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
