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

interface MarePageProps {
  params?: {
    slug?: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TZ = 'America/Sao_Paulo';

function getNowBR() {
  const now = new Date();
  const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
  const nowHour = parseInt(now.toLocaleString('en-CA', { hour: '2-digit', hour12: false, timeZone: TZ }));
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: TZ });
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

/** ✅ NOME CORRIGIDO AQUI */
interface MareSlugPageProps {
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

export async function generateMetadata({ params }: MareSlugPageProps): Promise<Metadata> {
  const port = getPortBySlug(params.slug);
  if (!port) {
    return {
      title: 'Porto não encontrado | MareAgora',
      description: 'Página de porto não encontrada no MareAgora.',
    };
  }

  const title = `Maré em ${port.name} - ${port.state} | MareAgora 2026`;
  const description = `Tábua de maré oficial para ${port.name} (${port.state}). Dados em tempo real da Marinha do Brasil.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale: 'pt_BR', siteName: 'MareAgora' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `/mare/${port.slug}/` },
  };
}

export default async function MarePage({ params }: MareSlugPageProps) {
  const port = getPortBySlug(params.slug);
  if (!port) notFound();

  const rawData = (await import(`@/data/${port.dataFile}`)).default as RawPortData;
  const todayTides = getTodayTides(rawData.eventos);

  if (!todayTides) {
    return (
      <main className="min-h-screen bg-slate-900 text-white">
        <h1>Dados de maré não disponíveis para {port.name}</h1>
      </main>
    );
  }

  const { currentTime } = getNowBR();

  const classifiedMares = classifyTideEvents(todayTides.mares);
  const tideStatus = getCurrentTideStatus(todayTides, currentTime);
  const nextHighTide = findNextHighTide(todayTides.mares, currentTime);
  const nextLowTide = findNextLowTide(todayTides.mares, currentTime);

  return (
    <main className="min-h-screen bg-slate-100">
      <NavBar />

      <section className="p-6">
        <h1 className="text-3xl font-bold">{port.name}</h1>

        <p>Próxima maré alta: {nextHighTide?.hora}</p>
        <p>Próxima maré baixa: {nextLowTide?.hora}</p>

        <TideChart tides={classifiedMares} />
        <TideMonthTable eventos={rawData.eventos} />
      </section>

      <footer className="text-center py-6 text-sm">
        MareAgora 2026
      </footer>
    </main>
  );
}
