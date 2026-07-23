import type { PortOperationsConfig } from '@/lib/portOperations';
import OpsCard from './OpsCard';

interface RestrictionsCardProps {
  config: PortOperationsConfig;
  currentTide: number | null;
}

export default function RestrictionsCard({ config, currentTide }: RestrictionsCardProps) {
  const isVerified = config.verified === true;
  const availableDraft = currentTide != null ? config.maxDraftM + currentTide : config.maxDraftM;

  const items = [
    { label: 'Calado disponível', value: `${availableDraft.toFixed(1)}m`, icon: '⚓' },
    { label: 'Calado máx. autorizado', value: `${config.maxDraftM.toFixed(1)}m`, icon: '📏' },
    { label: 'Canal', value: config.channel, icon: '🧭' },
    { label: 'Berços', value: config.berths, icon: '🏗️' },
    { label: 'Praticagem', value: config.pilotage, icon: '🧑‍✈️' },
    { label: 'Rebocadores', value: config.tugboats, icon: '🚢' },
  ];

  return (
    <OpsCard title="Restrições Operacionais" icon="🚧">
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-white/5 border border-white/5 p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
              <span>{item.icon}</span>{item.label}
            </p>
            <p className={`text-sm font-bold mt-1 leading-snug ${isVerified ? 'text-slate-200' : 'text-slate-400'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {isVerified ? (
        config.sourceUrl && (
          <p className="mt-3 text-[11px] text-slate-500 leading-snug">
            Dados oficiais verificados em {config.lastVerified ? new Date(config.lastVerified + 'T00:00:00').toLocaleDateString('pt-BR') : '—'} —{' '}
            <a
              href={config.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-300 transition-colors"
            >
              ver fonte oficial
            </a>
          </p>
        )
      ) : (
        <p className="mt-3 text-[11px] text-amber-300/90 leading-snug">
          ⚠️ Ainda não temos dados oficiais específicos de calado/canal/berços para este porto. O Índice Operacional acima usa uma estimativa genérica apenas como referência aproximada — não use estes dados para decisões de navegação. Consulte a Praticagem/Capitania dos Portos responsável.
        </p>
      )}
    </OpsCard>
  );
}
