import Link from 'next/link';
import { FISHING_SPOTS } from '@/lib/fishingSpots';
import { haversineDistance } from '@/lib/ports';

interface Props {
  cityName: string;
  state: string;
  lat: number;
  lon: number;
}

const MAX_KM = 120;

// Bloco de links internos: leva das páginas de maré (muito indexadas) para /pesca e
// /lugares-de-pesca, e mostra os pontos de pesca cadastrados num raio de 120 km.
export default function FishingNearby({ cityName, state, lat, lon }: Props) {
  const perto = FISHING_SPOTS
    .map((s) => ({ s, km: haversineDistance(lat, lon, s.lat, s.lon) }))
    .filter((x) => x.km <= MAX_KM)
    .sort((a, b) => a.km - b.km)
    .slice(0, 4);

  return (
    <section className="classic-card" aria-labelledby="pesca-perto">
      <h2 id="pesca-perto" className="text-2xl font-bold mb-3 font-syne">
        Pesca perto de {cityName} ({state})
      </h2>
      {perto.length > 0 ? (
        <ul className="mb-4 space-y-2">
          {perto.map(({ s, km }) => (
            <li key={s.id} className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{s.name}</span> — {s.type}, a {Math.max(1, Math.round(km))} km
              {s.species && s.species.length > 0 ? `; espécies: ${s.species.join(', ')}` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-slate-600">
          Veja o coeficiente, a fase da lua e a tábua solunar de hoje para escolher o melhor horário de pescar em {cityName}.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm font-medium">
        <Link href="/pesca" className="text-blue-600 hover:underline">
          Melhor maré para pesca hoje →
        </Link>
        <Link href="/lugares-de-pesca" className="text-blue-600 hover:underline">
          Mapa de lugares de pesca →
        </Link>
      </div>
    </section>
  );
}
