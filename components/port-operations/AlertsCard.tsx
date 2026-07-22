import type { OperationalAlert } from '@/lib/portOperations';
import OpsCard from './OpsCard';

interface AlertsCardProps {
  alerts: OperationalAlert[];
}

export default function AlertsCard({ alerts }: AlertsCardProps) {
  return (
    <OpsCard title="Alertas" icon="🔔">
      {alerts.length === 0 ? (
        <div className="flex items-center gap-2.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
          <span>✅</span>
          <span className="text-sm font-bold">Sem alertas operacionais.</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold border ${
                alert.severity === 'danger'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <span>{alert.icon}</span>
              <span>{alert.message}</span>
            </li>
          ))}
        </ul>
      )}
    </OpsCard>
  );
}
