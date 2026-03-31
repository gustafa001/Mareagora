import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPortBySlug, Port, getNearbySlugs } from '@/lib/ports';
import { 
  getTodayTides, 
  getCurrentTideStatus,
  classifyTideEvents,
  RawPortData,
  TideEvent
} from '@/lib/tideUtils';
import TideChart from '@/components/TideChart';
import TideMonthTable from '@/components/TideMonthTable';
import WaveChart from '@/components/WaveChart';
import WindChart from '@/components/WindChart';
import WeatherCard from '@/components/WeatherCard';
import NavBar from '@/components/NavBar';
import AdSlot from '@/components/ads/AdSlot';
import { AD_SLOTS } from '@/lib/adConfig';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TZ = 'America/Sao_Paulo';

/** Retorna hora atual no fuso de São Paulo */
function getNowBR() {
  const now = new Date();
  const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
  const nowHour = parseInt(now.toLocaleString('en-CA', { hour: '2-digit', hour12: false, timeZone: TZ }));
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: TZ }); // YYYY-MM-DD
  return { currentTime, nowHour, todayStr };
}

function parseCoord(value: number | string | undefined, type: 'lat' | 'lon'): number | null {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  if (!isNaN(n) && n !== 0) return n;

  const str = String(value).trim();
  const match = str.match(/(\d+)[°\s]+(\d+)'?\.?(\d*)\s*([NSWE])?/i);
  if (!match) return null;

  const deg = parseInt(match[1]);
  const min = parseFloat(`${match[2]}.${match[3] || '0'}`);
  const dir = (match[4] || '').toUpperCase();
  let decimal = deg + min / 60;

  if (dir === 'S' || dir === 'W') decimal = -decimal;
  else if (!dir) {
    if (type === 'lat') decimal = -Math.abs(decimal);
    if (type === 'lon') decimal = -Math.abs(decimal);
  }

  return decimal;
}

interface MarePageProps {
  params: { slug: string };
}

function findNextHighTide(mares: TideEvent[], currentTime: string): TideEvent | null {
  const classified = classifyTideEvents(mares);
  for (const event of classified) {
    if (event.tipo === 'high' && event.hora > currentTime) return event;
  }
  return classified.find(e => e.tipo === 'high') || null;
}

function findNextLowTide(mares: TideEvent[], currentTime: string): TideEvent | null {
  const classified = classifyTideEvents(mares);
  for (const event of classified) {
    if (event.tipo === 'low' && event.hora > currentTime) return event;
  }
  return classified.find(e => e.tipo === 'low') || null;
}

export async function generateMetadata({ params }: MarePageProps): Promise<Metadata> {
  const port = getPortBySlug(params.slug);
  if (!port) {
    return {
      title: 'Porto não encontrado | MareAgora',
      description: 'Página de porto não encontrada no MareAgora.',
    };
  }
  const title = `Maré em ${port.name} - ${port.state} | MareAgora 2026`;
  const description = `Tábua de maré oficial para ${port.name} (${port.state}). Dados em tempo real da Marinha do Brasil. Previsão de marés, ondas e condições náuticas para ${port.name}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale: 'pt_BR', siteName: 'MareAgora' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `/mare/${port.slug}/` },
  };
}

export default async function MarePage({ params }: MarePageProps) {
  const port = getPortBySlug(params.slug);
  if (!port) notFound();

  const rawData = (await import(`@/data/${port.dataFile}`)).default as RawPortData;
  const todayTides = getTodayTides(rawData.eventos);

  if (!todayTides) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Dados de maré não disponíveis para {port.name}</h1>
        </div>
      </main>
    );
  }

  const { currentTime, nowHour, todayStr } = getNowBR();

  const classifiedMares = classifyTideEvents(todayTides.mares);
  const tideStatus = getCurrentTideStatus(todayTides, currentTime);
  const nextHighTide = findNextHighTide(todayTides.mares, currentTime);
  const nextLowTide = findNextLowTide(todayTides.mares, currentTime);

  const lat = parseCoord(rawData.lat, 'lat');
  const lon = parseCoord(rawData.lon, 'lon');
  const hasCoords = lat !== null && lon !== null;

  let weatherData = { temp: 26, humidity: 78, pressure: 1013, visibility: 10, wind: "17 km/h", waves: "1.4 m" };
  let waveChartData: { time: string; height: number }[] = [];

  if (hasCoords) {
    try {
      const [waveRes, weatherRes] = await Promise.all([
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=America%2FSao_Paulo&forecast_days=1`, { cache: 'no-store' }),
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,temperature_2m,relative_humidity_2m,surface_pressure&wind_speed_unit=kmh&timezone=America%2FSao_Paulo`, { cache: 'no-store' })
      ]);

      if (waveRes.ok && weatherRes.ok) {
        const waveJson = await waveRes.json();
        const weatherJson = await weatherRes.json();
        const h = waveJson.hourly;

        // Usa todayStr e nowHour já calculados no fuso de SP — sem desvio UTC
        const nowPad = nowHour.toString().padStart(2, '0');
        const idx = h.time.findIndex((t: string) =>
          t.startsWith(todayStr) && t.includes(`T${nowPad}:`)
        );

        const startIdx = idx >= 0 ? idx : 0;
        const waveHeight = h.wave_height[startIdx];

        // Próximas 8 horas de ondas
        waveChartData = h.time
          .slice(startIdx, startIdx + 8)
          .map((t: string, i: number) => ({
            time: t.split('T')[1].substring(0, 5),
            height: h.wave_height[startIdx + i] ?? 0,
          }));

        const current = weatherJson.current;
        weatherData = {
          temp: Math.round(current?.temperature_2m || 26),
          humidity: Math.round(current?.relative_humidity_2m || 78),
          pressure: Math.round(current?.surface_pressure || 1013),
          visibility: 10,
          wind: current?.wind_speed_10m ? `${current.wind_speed_10m.toFixed(0)} km/h` : "17 km/h",
          waves: waveHeight ? `${waveHeight.toFixed(1)} m` : "1.4 m"
        };
      }
    } catch (e) {
      console.error("Erro ao buscar dados meteorológicos:", e);
    }
  } else {
    console.warn(`Porto ${port.slug} sem coordenadas válidas (lat=${rawData.lat}, lon=${rawData.lon}). Usando dados padrão.`);
  }

  const today = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
  const windData = {
    time: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map(t => `${today}T${t}`),
    windspeed_10m: [18, 23, 20, 20, 19, 17],
    winddirection_10m: [45, 45, 90, 90, 135, 135],
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <NavBar />

      <div className="w-full flex justify-center px-4 py-2 bg-slate-100">
        <div className="w-full max-w-[728px] min-h-[90px]">
          <AdSlot slotId={AD_SLOTS.LEADERBOARD_NAV} format="auto" />
        </div>
      </div>

      <section
        className="relative h-[320px] w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 58, 95, 0.5) 100%), url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/40" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-12">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{port.name}</h1>
            <p className="text-lg text-blue-200 mb-3">{port.name} - 2026 | Estado do {port.state}</p>
            <div className="flex flex-wrap gap-3 text-sm text-blue-100">
              <span>Latitude: {lat !== null ? lat.toFixed(4) : String(rawData.lat)}°</span>
              <span>Longitude: {lon !== null ? lon.toFixed(4) : String(rawData.lon)}°</span>
              <span>Fuso: {rawData.fuso}</span>
            </div>
            <p className="mt-3 text-blue-200">
              Nível Médio: <span className="text-white font-semibold">{rawData.nivel_medio?.toFixed(2) || tideStatus.currentHeight.toFixed(2)} m</span>
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md border border-blue-400/30 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-bold text-blue-200">Próxima Alta</span>
                <span className="text-2xl">🌊</span>
              </div>
              <div className="text-3xl font-extrabold text-white">{nextHighTide?.hora || "--:--"}</div>
              <div className="text-lg font-bold text-blue-300 mt-2">+{nextHighTide?.altura_m.toFixed(2) || "--"} m</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-md border border-orange-400/30 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-bold text-orange-200">Próxima Baixa</span>
                <span className="text-2xl">📉</span>
              </div>
              <div className="text-3xl font-extrabold text-white">{nextLowTide?.hora || "--:--"}</div>
              <div className="text-lg font-bold text-orange-300 mt-2">+{nextLowTide?.altura_m.toFixed(2) || "--"} m</div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-bold text-cyan-200">Condições Agora</span>
                <span className="text-xl">🕒</span>
              </div>
              <div className="text-3xl font-extrabold text-white">{currentTime}</div>
              <div className="text-sm font-bold text-cyan-300 mt-2">
                Vento: {weatherData.wind} · Ondas: {weatherData.waves}
              </div>
              <div className="text-xs text-cyan-400/80 mt-1">
                🌡️ {weatherData.temp}°C · 💧 {weatherData.humidity}% · 📊 {weatherData.pressure} hPa
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Tabela de Marés</h2>
            <TideChart tides={classifiedMares} />
          </div>
          <div className="flex justify-center mt-6">
            <div className="w-full max-w-[336px] min-h-[280px]">
              <AdSlot slotId={AD_SLOTS.INCONTENT_RECT} format="rectangle" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Tábua de Marés — Mensal</h2>
          <TideMonthTable eventos={rawData.eventos} />
        </div>
      </section>

      <section className="px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Previsão de Ondas</h2>
              <WaveChart data={waveChartData} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Intensidade e Direção do Vento</h2>
              <WindChart hourly={windData} />
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center px-6 py-4">
        <div className="w-full max-w-[336px] min-h-[280px]">
          <AdSlot slotId={AD_SLOTS.POS_TABELA} format="auto" />
        </div>
      </div>

      <section className="px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Dados Meteorológicos (Open-Meteo)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <WeatherCard title="Temperatura" value={`${weatherData.temp}°C`} icon="thermometer" />
            <WeatherCard title="Umidade" value={`${weatherData.humidity}%`} icon="droplet" />
            <WeatherCard title="Pressão" value={`${weatherData.pressure} hPa`} icon="gauge" />
            <WeatherCard title="Visibilidade" value={`${weatherData.visibility} km`} icon="eye" />
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">📍 Cidades Próximas</h3>
            <div className="flex flex-col gap-3">
              {getNearbySlugs(port).map((p: Port) => (
                <Link
                  key={p.slug}
                  href={`/mare/${p.slug}`}
                  className="group flex flex-col p-3.5 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-gray-50 transition-all"
                >
                  <span className="font-bold text-gray-800 group-hover:text-blue-600">{p.name}</span>
                  <span className="text-xs text-gray-400 capitalize">{p.state} • Ver tábua de maré</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center px-6 py-4">
        <div className="w-full max-w-[728px] min-h-[90px]">
          <AdSlot slotId={AD_SLOTS.PREFOOTER} format="auto" />
        </div>
      </div>

      <footer className="mt-12 py-6 border-t border-slate-200 text-center text-slate-500 text-sm bg-white">
        <p>MareAgora 2026 • Dados oficiais da Marinha do Brasil (DHN)</p>
        <p className="mt-1">Fonte: Diretoria de Hidrografia e Navegação</p>
      </footer>
    </main>
  );
}
