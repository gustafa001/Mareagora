import { getLiveCameraGroups } from '@/lib/live-cameras';
import LiveCameraCard from '@/components/LiveCameraCard';

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
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="mb-4 text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl md:text-5xl font-syne uppercase">
            Praias ao Vivo
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
            Confira as condições do mar em tempo real através de câmeras de parceiros e fontes públicas.
            As transmissões são de responsabilidade de seus respectivos canais de origem.
          </p>
        </div>

        <div className="space-y-12 sm:space-y-16">
          {groups.map((group) => (
            <section key={group.label} className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-2">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.cameras.map((camera) => (
                  <LiveCameraCard key={camera.id} camera={camera} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
