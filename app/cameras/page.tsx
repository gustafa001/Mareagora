import Link from 'next/link';
import { getLiveCameraGroups } from '@/lib/live-cameras';
import LiveCameraCard from '@/components/LiveCameraCard';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';

export const metadata = {
  title: 'Câmeras ao Vivo das Praias | MaréAgora',
  description:
    'Veja em tempo real as condições do mar e das praias do litoral brasileiro através de câmeras ao vivo de Santos, Guarujá, Praia Grande, Ubatuba e Rio de Janeiro.',
};

export default function CamerasPage() {
  const groups = getLiveCameraGroups();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Botão Voltar */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-all uppercase tracking-widest bg-white hover:bg-blue-50 px-4 py-2 rounded-xl border border-slate-200 hover:border-blue-300 shadow-sm"
          >
            ← Início
          </Link>
        </div>

        <div className="mb-8 text-center sm:mb-12">
          <h1 className="mb-4 text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl md:text-5xl font-syne uppercase">
            Praias ao Vivo
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
            Confira as condições do mar em tempo real através de câmeras de parceiros e fontes públicas.
            As transmissões são de responsabilidade de seus respectivos canais de origem.
          </p>
        </div>

        {/* AdSense topo */}
        <div className="mb-10 sm:mb-12">
          <AdSlot slotId={AD_SLOTS.LEADERBOARD_NAV} format="horizontal" />
        </div>

        <div className="space-y-12 sm:space-y-16">
          {groups.map((group, index) => (
            <section key={group.label} className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.cameras.map((camera) => (
                  <LiveCameraCard key={camera.id} camera={camera} />
                ))}
              </div>

              {/* AdSense entre a 1ª e a 2ª região, meio do conteúdo */}
              {index === 0 && groups.length > 1 && (
                <div className="flex justify-center pt-4">
                  <AdSlot
                    slotId={AD_SLOTS.INCONTENT_RECT}
                    format="rectangle"
                    style={{ width: 336, height: 280 }}
                  />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* AdSense antes do rodapé */}
        <div className="mt-12 sm:mt-16">
          <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
        </div>
      </div>
    </main>
  );
}
