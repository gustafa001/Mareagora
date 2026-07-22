'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { getPortBySlug } from '@/lib/ports';
import { getEventosDia } from '@/lib/mare';
import { getTideCoefficient, getMoonAge, tideAtMinute, type TideEvent } from '@/lib/tideUtils';
import {
  getPortOperationsConfig,
  buildOperationalPoints,
  summarizeOperationalWindow,
  buildAlerts,
  computeOperationalIndex,
  statusFromIndex,
  type DayForecastSummary,
} from '@/lib/portOperations';
import { usePortOperationsData } from '@/hooks/usePortOperationsData';

import PortHeader from './PortHeader';
import TideStatusCard from './TideStatusCard';
import OperationalWindowCard from './OperationalWindowCard';
import WeatherConditionsCard from './WeatherConditionsCard';
import SeaConditionsCard from './SeaConditionsCard';
import RestrictionsCard from './RestrictionsCard';
import AlertsCard from './AlertsCard';
import ForecastCard from './ForecastCard';
import OperationalIndexGauge from './OperationalIndexGauge';
import HistoryCard, { type HistoryLogEntry } from './HistoryCard';
import PortInfoCard from './PortInfoCard';
import DashboardGrid, { type DashboardGridItem } from './DashboardGrid';

const DAY_LABELS = ['Hoje', 'Amanhã', 'Dia +2', 'Dia +3'];

interface PortOperationsPageProps {
  slug: string;
}

export default function PortOperationsPage({ slug }: PortOperationsPageProps) {
  const port = getPortBySlug(slug);
  if (!port) notFound();

  const config = getPortOperationsConfig(slug);
  const { weather, sea, hourly, loading, error, offline, lastUpdated } = usePortOperationsData(port.lat, port.lon);
  const isUpdating = loading && lastUpdated !== null;

  const forecastRef = useRef<HTMLDivElement>(null);
  const [alertLog, setAlertLog] = useState<HistoryLogEntry[]>([]);
  const [eventLog, setEventLog] = useState<HistoryLogEntry[]>([]);
  const lastStatusRef = useRef<string | null>(null);

  const todayStr = new Date().toLocaleDateString('en-CA');
  const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');

  const todayTides = useMemo(() => getEventosDia(port, todayStr), [port, todayStr]);
  const yesterdayTides = useMemo(() => getEventosDia(port, yesterdayStr), [port, yesterdayStr]);

  const now = new Date();
  const nowMinute = now.getHours() * 60 + now.getMinutes();

  const points = useMemo(
    () => buildOperationalPoints(todayTides, todayStr, config, hourly ?? undefined),
    [todayTides, todayStr, config, hourly]
  );
  const windowSummary = useMemo(() => summarizeOperationalWindow(points, nowMinute), [points, nowMinute]);

  const currentTideHeight = todayTides.length ? tideAtMinute(nowMinute, todayTides as unknown as TideEvent[]) : null;
  const operationalIndex = currentTideHeight != null
    ? computeOperationalIndex(currentTideHeight, sea.windSpeed, sea.waveHeight, config)
    : 0;

  const tideCoefficient = todayTides.length ? getTideCoefficient(getMoonAge(now)).value : null;
  const alerts = useMemo(
    () => buildAlerts(sea, weather, tideCoefficient, config),
    [sea, weather, tideCoefficient, config]
  );

  // Próximos 4 dias (resumo simplificado a partir da tábua de marés local).
  const forecastDays: DayForecastSummary[] = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => {
      const d = new Date(Date.now() + i * 86400000);
      const dateStr = d.toLocaleDateString('en-CA');
      const tides = getEventosDia(port, dateStr);
      if (tides.length === 0) {
        return { date: dateStr, label: DAY_LABELS[i], maxTide: null, minTide: null, bestWindowLabel: null, operationalIndex: 0, status: 'restrita' as const };
      }
      const heights = tides.map(t => t.altura_m);
      const maxTide = Math.max(...heights);
      const minTide = Math.min(...heights);
      const dayPoints = buildOperationalPoints(tides, dateStr, config, i === 0 ? (hourly ?? undefined) : undefined);
      const avgIndex = dayPoints.length
        ? Math.round(dayPoints.reduce((s, p) => s + p.index, 0) / dayPoints.length)
        : 0;
      const idealPoint = dayPoints.find(p => p.status === 'ideal');
      return {
        date: dateStr,
        label: DAY_LABELS[i],
        maxTide,
        minTide,
        bestWindowLabel: idealPoint ? `a partir de ${idealPoint.time}` : 'sem janela ideal',
        operationalIndex: avgIndex,
        status: statusFromIndex(avgIndex),
      };
    });
  }, [port, config, hourly]);

  // Registro simples de sessão: loga mudanças de status e novos alertas.
  useEffect(() => {
    const nowLabel = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (lastStatusRef.current && lastStatusRef.current !== windowSummary.currentStatus) {
      setEventLog(prev => [{ time: nowLabel, message: `Status mudou para ${windowSummary.currentStatus}` }, ...prev].slice(0, 10));
    }
    lastStatusRef.current = windowSummary.currentStatus;
  }, [windowSummary.currentStatus]);

  useEffect(() => {
    if (alerts.length === 0) return;
    const nowLabel = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setAlertLog(prev => {
      const known = new Set(prev.map(p => p.message));
      const fresh = alerts.filter(a => !known.has(a.message)).map(a => ({ time: nowLabel, message: a.message }));
      return fresh.length ? [...fresh, ...prev].slice(0, 10) : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]);

  const gridItems: DashboardGridItem[] = [
    { id: 'tide', span: 2, node: <TideStatusCard todayTides={todayTides} onShowNextDays={() => forecastRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} /> },
    { id: 'window', span: 1, node: <OperationalWindowCard summary={windowSummary} /> },
    { id: 'index', span: 1, node: <OperationalIndexGauge index={operationalIndex} /> },
    { id: 'weather', span: 1, node: <WeatherConditionsCard weather={weather} loading={loading && !lastUpdated} /> },
    { id: 'sea', span: 1, node: <SeaConditionsCard sea={sea} loading={loading && !lastUpdated} /> },
    { id: 'restrictions', span: 2, node: <RestrictionsCard config={config} currentTide={currentTideHeight} /> },
    { id: 'alerts', span: 1, node: <AlertsCard alerts={alerts} /> },
    { id: 'info', span: 1, node: <PortInfoCard port={port} /> },
    { id: 'forecast', span: 2, node: <ForecastCard days={forecastDays} /> },
    { id: 'history', span: 2, node: <HistoryCard yesterdayTides={yesterdayTides} alertLog={alertLog} eventLog={eventLog} /> },
  ];

  return (
    <main className="min-h-screen bg-[#060b14] pb-20">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PortHeader port={port} lastUpdated={lastUpdated} isOnline={!offline} isUpdating={isUpdating} />

        {offline && (
          <StatusBanner tone="warning" message="Você está offline. Exibindo os últimos dados de maré disponíveis localmente." />
        )}
        {!offline && error && (
          <StatusBanner tone="danger" message="Não foi possível atualizar clima e condições do mar agora. Tentando novamente em segundo plano." />
        )}
        {!offline && todayTides.length === 0 && (
          <StatusBanner tone="warning" message="Sem dados de maré cadastrados para este porto hoje." />
        )}

        <DashboardGrid items={gridItems} storageKey={`ops-grid-order:${slug}`} />

        <div ref={forecastRef} />
      </div>
    </main>
  );
}

function StatusBanner({ tone, message }: { tone: 'warning' | 'danger'; message: string }) {
  const styles = tone === 'danger'
    ? 'bg-red-500/10 border-red-500/30 text-red-300'
    : 'bg-amber-500/10 border-amber-500/30 text-amber-300';
  return (
    <div className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${styles}`}>
      {message}
    </div>
  );
}
