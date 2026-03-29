"use client";

import { TideEvent, tideAtMinute, degToCompass } from "@/lib/tideUtils";
import { useEffect, useState } from "react";

interface DetailedForecastTableProps {
  lat: number;
  lon: number;
  todayTides: TideEvent[];
}

interface ForecastBlock {
  hour: string;
  hourStr: string;
  windDir: number;
  windSpeed: number;
  windGust: number;
  temp: number;
  waveHeight: number;
  waveDir: number;
  wavePeriod: number;
  tideHeight: number;
}

export default function DetailedForecastTable({ lat, lon, todayTides }: DetailedForecastTableProps) {
  const [data, setData] = useState<ForecastBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Pedidos para exatamente 2 dias para termos dados até ao fim do dia seguinte (cobrindo a noite de hoje)
      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period&timezone=America%2FSao_Paulo&forecast_days=2`;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=America%2FSao_Paulo&forecast_days=2`;

      try {
        const [resMarine, resWeather] = await Promise.all([
          fetch(marineUrl),
          fetch(weatherUrl)
        ]);

        const jsonMarine = await resMarine.json();
        const jsonWeather = await resWeather.json();

        const mw = jsonMarine.hourly;
        const hw = jsonWeather.hourly;

        const blocks: ForecastBlock[] = [];

        // Windfinder usa blocos de 3 em 3 horas. Começamos às 00h de hoje e vamos até amanhã
        // Filtramos para pegar os index 0, 3, 6, 9, 12, 15, 18, 21 (até 48h limitamos a 10 colunas começando da hora atual)
        
        const now = new Date();
        const nowH = now.getHours();
        
        // Encontrar o indice inicial mais próximo de um bloco de 3h no futuro ou atual
        // Ex: se são 07:00, começamos no bloco das 06:00
        let startIndex = hw.time.findIndex((t: string) => {
          const d = new Date(t);
          return d.getHours() >= nowH - 2 && d.toDateString() === now.toDateString();
        });
        
        if (startIndex < 0) startIndex = 0;
        // Ajustar para múltiplo de 3
        startIndex = Math.floor(startIndex / 3) * 3;

        // Pegar próximos 8 blocos (24 horas de previsão 3h)
        for (let i = 0; i < 8; i++) {
          const idx = startIndex + (i * 3);
          if (idx >= hw.time.length) break;

          const dateStr = hw.time[idx];
          const dateObj = new Date(dateStr);
          const blockHour = dateObj.getHours();

          // Interpolar maré exata para este minuto (no dia atual)
          // Se passar para o dia seguinte, o cálculo usará as marés do dia base (ligeiro desvio, mas aceitável para aproximação de 24h)
          const minuteOfDay = blockHour * 60;
          const tideH = tideAtMinute(minuteOfDay, todayTides);

          blocks.push({
            hourStr: dateStr,
            hour: `${String(blockHour).padStart(2, '0')}h`,
            temp: hw.temperature_2m[idx] || 0,
            windSpeed: hw.wind_speed_10m[idx] || 0,
            windDir: hw.wind_direction_10m[idx] || 0,
            windGust: hw.wind_gusts_10m[idx] || 0,
            waveHeight: mw.wave_height[idx] || 0,
            waveDir: mw.wave_direction[idx] || 0,
            wavePeriod: mw.wave_period[idx] || 0,
            tideHeight: tideH
          });
        }

        setData(blocks);
        setLoading(false);

      } catch (err) {
        console.error("Erro DetailedForecastTable", err);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [lat, lon, todayTides]);

  function getWindColor(kmh: number): string {
    if (kmh < 8) return 'bg-[#a78bfa] text-white border border-[#8b5cf6]'; // Roxo claro
    if (kmh < 15) return 'bg-[#8b5cf6] text-white border border-[#7c3aed]'; // Roxo forte
    if (kmh < 22) return 'bg-[#3b82f6] text-white border border-[#2563eb]'; // Azul escuro
    if (kmh < 30) return 'bg-[#06b6d4] text-white border border-[#0891b2]'; // Ciano
    if (kmh < 40) return 'bg-[#10b981] text-white border border-[#059669]'; // Esmeralda/Verde
    if (kmh < 50) return 'bg-[#f59e0b] text-white border border-[#d97706]'; // Laranja
    return 'bg-[#ef4444] text-white border border-[#dc2626]'; // Vermelho
  }

  if (loading) {
    return (
      <div className="classic-card my-8 overflow-hidden relative">
        <h3 className="card-title mb-4 animate-pulse text-gray-400">Previsão Detalhada Hora a Hora...</h3>
        <div className="h-[300px] w-full loading-shimmer rounded-xl"></div>
      </div>
    );
  }

  if (data.length === 0) return null;

  return (
    <div className="classic-card my-12 overflow-hidden shadow-sm border border-[rgba(56,201,240,0.15)] bg-white/95">
      <div className="flex justify-between items-end mb-6">
        <h3 className="card-title !mb-0 text-[#2d3748]">📊 Previsão Horizontal Detalhada</h3>
        <span className="text-xs font-bold uppercase tracking-wider text-[#38c9f0] bg-[#38c9f0]/10 px-3 py-1 rounded-full border border-[#38c9f0]/20">Próximas 24h</span>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="min-w-[760px]">
          {/* Cabeçalho de Horas */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(60px,1fr))] border-b border-gray-200 pb-2 mb-2">
            <div className="text-xs font-bold text-gray-500 uppercase self-end">Hora Local</div>
            {data.map((b, i) => (
              <div key={i} className="text-center font-syne font-bold text-gray-800 text-[15px]">
                {b.hour}
              </div>
            ))}
          </div>

          {/* Vento Direção */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(60px,1fr))] py-2.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="text-[13px] font-medium text-gray-600 self-center">Dir. do vento</div>
            {data.map((b, i) => (
              <div key={i} className="flex justify-center flex-col items-center gap-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold translate-y-1">{degToCompass(b.windDir)}</span>
                <span 
                  className="text-lg text-gray-800 inline-block drop-shadow-sm transition-transform duration-300"
                  style={{ transform: `rotate(${b.windDir}deg)` }}
                >
                  ↑
                </span>
              </div>
            ))}
          </div>

          {/* Vento Velocidade (COLOR CODED) */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(60px,1fr))] py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="text-[13px] font-medium text-gray-600 self-center">Velocidade (km/h)</div>
            {data.map((b, i) => (
              <div key={i} className={`flex items-center justify-center font-bold text-[15px] py-[6px] mx-1 rounded-md shadow-inner transition-colors ${getWindColor(b.windSpeed)}`}>
                {Math.round(b.windSpeed)}
              </div>
            ))}
          </div>

          {/* Vento Rajadas (COLOR CODED) */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(60px,1fr))] py-2 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="text-[13px] font-medium text-gray-600 self-center">Rajadas (km/h)</div>
            {data.map((b, i) => (
              <div key={i} className={`flex items-center justify-center font-bold text-[15px] py-[6px] mx-1 rounded-md shadow-inner opacity-85 transition-colors ${getWindColor(b.windGust)}`}>
                {Math.round(b.windGust)}
              </div>
            ))}
          </div>

          {/* Temperatura */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(60px,1fr))] py-3 border-b border-gray-100/50 bg-[#ff914d]/5 hover:bg-[#ff914d]/10 transition-colors">
            <div className="text-[13px] font-medium text-gray-600 self-center">Temperatura (°C)</div>
            {data.map((b, i) => (
              <div key={i} className="text-center font-bold text-[#ff914d] text-sm">
                {Math.round(b.temp)}°
              </div>
            ))}
          </div>

          {/* Ondas Altura */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(60px,1fr))] py-3.5 border-b border-gray-100/50 bg-[#2a68f6]/5 hover:bg-[#2a68f6]/10 transition-colors">
            <div className="text-[13px] font-medium text-gray-600 self-center">Altura da onda (m)</div>
            {data.map((b, i) => (
              <div key={i} className="text-center font-syne font-extrabold text-[#2a68f6] text-[15px]">
                {b.waveHeight.toFixed(1)}
              </div>
            ))}
          </div>

          {/* Ondas Período / Direção */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(60px,1fr))] py-3.5 border-b border-gray-200 bg-[#2a68f6]/[0.08] hover:bg-[#2a68f6]/[0.12] transition-colors">
            <div className="text-[13px] font-medium text-gray-600 self-center leading-tight">Período (s)<br/><span className="text-[10px] font-normal text-gray-400">Dir. onda</span></div>
            {data.map((b, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-gray-700">{b.wavePeriod.toFixed(0)}</span>
                <div className="flex items-center gap-1 mt-1 opacity-70">
                  <span className="text-[9px] uppercase font-bold text-gray-500">{degToCompass(b.waveDir)}</span>
                  <span className="text-[11px] text-[#2a68f6] transition-transform duration-300" style={{ transform: `rotate(${b.waveDir}deg)`, display: 'inline-block' }}>↑</span>
                </div>
              </div>
            ))}
          </div>

          {/* Altura da Maré Interpolar */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(60px,1fr))] py-4 hover:bg-gray-50 transition-colors mt-2">
            <div className="text-[14px] font-extrabold text-[#2d3748] self-center tracking-tight">Altura Maré (m)</div>
            {data.map((b, i) => (
              <div key={i} className="text-center">
                <span className={`inline-block px-3 py-1.5 rounded-md text-[13px] font-extrabold border shadow-sm ${b.tideHeight > 1.2 ? 'bg-[#38c9f0]/10 text-[#0d2240] border-[#38c9f0]/30' : 'bg-[#ff914d]/10 text-[#0d2240] border-[#ff914d]/30'}`}>
                  {b.tideHeight.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
