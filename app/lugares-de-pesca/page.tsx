import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';
import { groupFishingSpotsByRegion } from '@/lib/fishingSpots';

const FishingSpotsMap = dynamic(() => import('@/components/FishingSpotsMap'), { ssr: false });

export const metadata: Metadata = {
  title: 'Lugares de Pesca no Brasil — Mapa de Píers, Molhes e Praias | MaréAgora',
  description:
    'Mapa com os principais lugares de pesca do Brasil: píers, molhes, costões e praias. Encontre o ponto mais perto de você e veja a maré do local.',
  alternates: { canonical: 'https://mareagora.com.br/lugares-de-pesca' },
};

const REGION_LABEL: Record<string, string> = {
  norte: 'Norte',
  nordeste: 'Nordeste',
  'centro-oeste': 'Centro-Oeste',
  sudeste: 'Sudeste',
  sul: 'Sul',
};

export default function Page() {
  const grupos = groupFishingSpotsByRegion();

  return (
    <main className="min-h-screen bg-slate-50">
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/lugares-de-pesca"
        title="Lugares de Pesca no Brasil — Mapa de Píers, Molhes e Praias | MaréAgora"
        description="Mapa com os principais lugares de pesca do Brasil: píers, molhes, costões e praias."
      />
      <NavBar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 font-syne mb-4 text-center">
            Lugares de Pesca
          </h1>
          <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            Píers, molhes, costões e praias mais procurados para pesca no Brasil. Clique em um ponto no mapa
            pra ver a maré do local e as espécies mais comuns.
          </p>

          <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <span>✅</span>
            <p>
              Os 12 pontos abaixo já foram conferidos no Google Maps. Conhece um bom lugar de pesca que não está
              aqui? <Link href="/contato" className="font-medium underline">Manda pra gente</Link>.
            </p>
          </div>

          <div className="mb-8">
            <AdSlot slotId={AD_SLOTS.LEADERBOARD_NAV} format="horizontal" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-4 mb-8">
            <FishingSpotsMap />
          </div>

          <div className="mb-12">
            <AdSlot slotId={AD_SLOTS.INCONTENT_RECT} format="auto" />
          </div>

          {grupos.map((grupo) => (
            <div key={grupo.region} className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 font-syne mb-4">
                {REGION_LABEL[grupo.region]}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grupo.spots.map((spot) => (
                  <div key={spot.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    <p className="font-bold text-slate-800 mb-1">{spot.name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                      {spot.type} · {spot.state}
                    </p>
                    {spot.description && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-2">{spot.description}</p>
                    )}
                    {spot.species && spot.species.length > 0 && (
                      <p className="text-sm text-slate-500">🐟 {spot.species.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center">
            <Link href="/pesca" className="text-blue-600 font-medium hover:underline">
              Veja também: os fatores que mais influenciam uma boa pescaria →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
