import type { ReactNode } from 'react';
import type { MareEvento } from '@/lib/mare';
import OpsCard from './OpsCard';

export interface HistoryLogEntry {
  time: string;
  message: string;
}

interface HistoryCardProps {
  yesterdayTides: MareEvento[];
  alertLog: HistoryLogEntry[];
  eventLog: HistoryLogEntry[];
}

export default function HistoryCard({ yesterdayTides, alertLog, eventLog }: HistoryCardProps) {
  return (
    <OpsCard title="Histórico" icon="🕓">
      <div className="grid sm:grid-cols-3 gap-5">
        <HistoryColumn title="Últimas Marés (ontem)">
          {yesterdayTides.length === 0 ? (
            <EmptyRow />
          ) : (
            yesterdayTides.map((t, i) => (
              <Row key={i} time={t.hora} text={`${t.tipo === 'high' ? 'Alta' : 'Baixa'} · ${t.altura_m.toFixed(2)}m`} />
            ))
          )}
        </HistoryColumn>

        <HistoryColumn title="Últimos Alertas">
          {alertLog.length === 0 ? <EmptyRow /> : alertLog.slice(0, 6).map((a, i) => <Row key={i} time={a.time} text={a.message} />)}
        </HistoryColumn>

        <HistoryColumn title="Últimos Eventos">
          {eventLog.length === 0 ? <EmptyRow /> : eventLog.slice(0, 6).map((e, i) => <Row key={i} time={e.time} text={e.message} />)}
        </HistoryColumn>
      </div>
    </OpsCard>
  );
}

function HistoryColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">{title}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function Row({ time, text }: { time: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-500 font-mono tabular-nums w-11 flex-shrink-0">{time}</span>
      <span className="text-slate-300">{text}</span>
    </div>
  );
}

function EmptyRow() {
  return <p className="text-xs text-slate-600">Sem registros.</p>;
}
