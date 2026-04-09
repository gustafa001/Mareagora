'use client';

import { useEffect, useState } from 'react';

interface BeachConditionsProps {
  lat: number;
  lon: number;
}

export default function BeachConditions({ lat, lon }: BeachConditionsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConditions() {
      // Adicionado sea_surface_temperature à marine-api
      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_period,sea_surface_temperature&timezone=America%2FSao_Paulo&forecast_days=1`;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo`;

      try {
        const [marineRes, weatherRes] = await Promise.all([
          fetch(marineUrl).then(r => r.json()),
          fetch(weatherUrl).then(r => r.json())
        ]);

        const now = new Date();
        const hour = now.getHours();
        const waveHeight = marineRes.hourly?.wave_height[hour] || 0;
        const wavePeriod = marineRes.hourly?.wave_period[hour] || 0;
        const waterTemp = marineRes.hourly?.sea_surface_temperature?.[hour] || 0;
        const weather = weatherRes.current;

        setData({
          waveHeight,
          wavePeriod,
          waterTemp,
          temp: weather.temperature_2m,
          feelsLike: weather.apparent_temperature,
          windSpeed: weather.wind_speed_10m,
          isDay: weather.is_day,
          rain: weather.precipitation
        });
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    fetchConditions();
  }, [lat, lon]);

  if (loading || !data) {
    return <div className="classic-card animate-pulse h-32 bg-gray-100/50" />;
  }

  const getStatus = () => {
    if (data.waveHeight >= 2.5) return { label: 'Mar Revolto', color: 'text-red-600', bg: 'bg-red-50', icon: '⚠️' };
    if (data.waveHeight >= 1.5) return { label: 'Mar Agitado', color: 'text-orange-600', bg: 'bg-orange-50', icon: '🌊' };
    if (data.waveHeight >= 0.8) return { label: 'Mar Suave', color: 'text-blue-600', bg: 'bg-blue-50', icon: '🏄' };
    return { label: 'Mar Calmo', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '🏖️' };
  };

  const status = getStatus();

  const activities = [
    { name: 'Banho', ok: data.waveHeight < 1.2 && data.rain < 1, icon: '🏊' },
    { name: 'Surf', ok: data.waveHeight >= 0.8 && data.waveHeight <= 2.5, icon: '🏄' },
    { name: 'Pesca', ok: data.windSpeed < 20 && data.rain < 2, icon: '🎣' },
    { name: 'Caminhada', ok: data.rain < 0.5, icon: '🏃' }
  ];

  return (
    <div className="classic-card">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status da Praia Agora</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{status.icon}</span>
            <span className={`text-xl font-black uppercase ${status.color}`}>{status.label}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-2xl font-black text-slate-800">{data.temp.toFixed(1)}°C</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Ar ({data.feelsLike.toFixed(0)}°C)</div>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="text-right">
            <div className="text-2xl font-black text-blue-600">{data.waterTemp > 0 ? `${data.waterTemp.toFixed(1)}°C` : '--'}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Água 🌡️</div>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="text-right">
            <div className="text-2xl font-black text-slate-800">{data.waveHeight.toFixed(1)}m</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Ondas</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activities.map(act => (
          <div key={act.name} className={`flex items-center gap-3 p-3 rounded-2xl border ${act.ok ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
            <span className="text-xl">{act.icon}</span>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{act.name}</div>
              <div className={`text-[10px] font-bold uppercase ${act.ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                {act.ok ? 'Recomendado' : 'Evitar'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
