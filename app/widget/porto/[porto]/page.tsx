import { notFound } from 'next/navigation';
import { getPortBySlug } from '@/lib/ports';
import { getEventosDia } from '@/lib/mare';
import { getNextHighAndLow } from '@/lib/tideUtils';
import { formatHeight } from '@/lib/globalPreferences';

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
    <main className="min-h-screen bg-white flex items-center justify-center p-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="w-full max-w-[320px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo-mark.png" alt="MaréAgora" className="w-6 h-6 rounded" />
          <div>
            <h1 className="text-sm font-bold leading-tight">{port.cityName}</h1>
            <p className="text-[10px] text-slate-400">{port.state} — MaréAgora</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Próxima alta</p>
            {nextHigh ? (
              <>
                <p className="text-xl font-black leading-none">{nextHigh.hora}</p>
                <p className="text-xs text-slate-300 mt-1">{formatHeight(nextHigh.altura_m, 'm')}</p>
              </>
            ) : (
              <p className="text-xs text-slate-500">—</p>
            )}
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Próxima baixa</p>
            {nextLow ? (
              <>
                <p className="text-xl font-black leading-none">{nextLow.hora}</p>
                <p className="text-xs text-slate-300 mt-1">{formatHeight(nextLow.altura_m, 'm')}</p>
              </>
            ) : (
              <p className="text-xs text-slate-500">—</p>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[9px] text-slate-500">Atualizado às {updatedAt}</p>
        </div>
      </div>
    </main>
  );
}
