import { notFound } from 'next/navigation';
import { getPortBySlug } from '@/lib/ports';
import { getEventosDia } from '@/lib/mare';
import { getNextHighAndLow } from '@/lib/tideUtils';
import { formatHeight } from '@/lib/globalPreferences';
import WidgetCard from '@/components/WidgetCard';

export const runtime = 'nodejs';
export const revalidate = 1800; // 30 min
export const metadata = {
  robots: { index: false, follow: false },
};

function getBRTNow() {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
}

export default async function WidgetPortoPage({ params }: { params: { porto: string } }) {
  const port = getPortBySlug(params.porto);
  if (!port) notFound();

  const brt = getBRTNow();
  const todayStr = brt.toISOString().slice(0, 10);
  const currentMin = brt.getHours() * 60 + brt.getMinutes();

  const todayTides = getEventosDia(port, todayStr);
  const { nextHigh, nextLow } = getNextHighAndLow(todayTides, currentMin);

  const updatedAt = brt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <WidgetCard
      cityName={port.cityName}
      state={port.state}
      nextHigh={nextHigh}
      nextLow={nextLow}
      updatedAt={updatedAt}
    />
  );
}
