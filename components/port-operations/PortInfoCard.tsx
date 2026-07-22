import type { Port } from '@/lib/ports';
import { getSunTimes } from '@/lib/portOperations';
import { getMoonAge, getMoonPhase } from '@/lib/tideUtils';
import OpsCard from './OpsCard';

interface PortInfoCardProps {
  port: Port;
}

export default function PortInfoCard({ port }: PortInfoCardProps) {
  const now = new Date();
  const { sunrise, sunset } = getSunTimes(now.getFullYear(), now.getMonth() + 1, now.getDate(), port.lat, port.lon);
  const moon = getMoonPhase(getMoonAge(now));

  const rows: { label: string; value: string }[] = [
    { label: 'Nome', value: port.name },
    { label: 'Cidade', value: port.cityName },
    { label: 'Estado', value: port.state },
    { label: 'Latitude', value: port.lat.toFixed(4) },
    { label: 'Longitude', value: port.lon.toFixed(4) },
    { label: 'Fuso horário', value: 'UTC-3 (Brasília)' },
    { label: 'Nascer do Sol', value: sunrise },
    { label: 'Pôr do Sol', value: sunset },
    { label: 'Fase da Lua', value: `${moon.icon} ${moon.name}` },
  ];

  return (
    <OpsCard title="Informações do Porto" icon="🗺️">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="col-span-2 sm:col-span-1 flex justify-between sm:flex-col sm:justify-start gap-1">
            <dt className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{row.label}</dt>
            <dd className="text-sm font-bold text-slate-200 text-right sm:text-left">{row.value}</dd>
          </div>
        ))}
      </dl>
    </OpsCard>
  );
}
