'use client';

import { useMemo, useState } from 'react';
import {
  getPeriodosSolunares,
  getIdadeLua,
  getAvaliacaoSolunar,
  inicioDiaLocal,
  type PeriodoSolunar,
} from '@/lib/solunar';
import { getMoonPhase } from '@/lib/tideUtils';
import type { MareDia } from '@/lib/mare';

interface SolunarTableProps {
  lat: number;
  lon: number;
  offsetMinutes?: number;
  /** 7+ dias de eventos de maré do porto, começando por hoje, para cruzar com os períodos maiores */
  weekTides: MareDia[];
}

function formatHora(d: Date): string {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDataCurta(dataStr: string): string {
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

export default function SolunarTable({ lat, lon, offsetMinutes = -180, weekTides }: SolunarTableProps) {
  const [diaSelecionado, setDiaSelecionado] = useState(0);

  const dias = useMemo(() => weekTides.slice(0, 7), [weekTides]);

  const calculo = useMemo(() => {
    return dias.map(dia => {
      const inicioDia = inicioDiaLocal(dia.data, offsetMinutes);
      const periodos = getPeriodosSolunares(inicioDia, lat, lon);
      const idadeLua = getIdadeLua(inicioDia);
      const avaliacao = getAvaliacaoSolunar(idadeLua, periodos, dia.mares);
      return { data: dia.data, periodos, idadeLua, avaliacao };
    });
  }, [dias, lat, lon, offsetMinutes]);

  if (calculo.length === 0) return null;

  const atual = calculo[Math.min(diaSelecionado, calculo.length - 1)];
  const fase = getMoonPhase(atual.idadeLua);

  const maiores = atual.periodos.filter((p: PeriodoSolunar) => p.tipo === 'maior');
  const menores = atual.periodos.filter((p: PeriodoSolunar) => p.tipo === 'menor');

  return (
    <section className="classic-card">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="text-2xl font-bold font-syne flex items-center gap-2">
          🎣 Tábua Solunar
        </h2>
        <div className="flex items-center gap-1 text-lg" title={`${atual.avaliacao.estrelas} de 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < atual.avaliacao.estrelas ? 'opacity-100' : 'opacity-20'}>
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Navegador de dias */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {calculo.map((c, i) => (
          <button
            key={c.data}
            onClick={() => setDiaSelecionado(i)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              i === diaSelecionado
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="capitalize">{i === 0 ? 'Hoje' : formatDataCurta(c.data)}</div>
            <div className="flex justify-center mt-0.5">
              {'⭐'.repeat(c.avaliacao.estrelas)}
            </div>
          </button>
        ))}
      </div>

      {atual.avaliacao.destaque && (
        <div className="mb-4 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 flex items-center gap-2">
          🌊 Um período maior coincide com a maré cheia hoje — janela de excelente atividade.
        </div>
      )}

      <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
        <span>{fase.icon}</span>
        <span>{fase.name}</span>
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
            Períodos Maiores (2h)
          </h3>
          <div className="space-y-2">
            {maiores.map((p, i) => (
              <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <span className="font-bold text-blue-900">{formatHora(p.inicio)} – {formatHora(p.fim)}</span>
                <span className="text-xs text-blue-600 font-medium">Lua {i === 0 ? 'a pino' : 'no fundo'}</span>
              </div>
            ))}
            {maiores.length === 0 && (
              <p className="text-sm text-slate-400">Sem dados de culminação para este dia.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
            Períodos Menores (1h)
          </h3>
          <div className="space-y-2">
            {menores.map((p, i) => (
              <div key={i} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <span className="font-bold text-amber-900">{formatHora(p.inicio)} – {formatHora(p.fim)}</span>
                <span className="text-xs text-amber-600 font-medium">{i === 0 ? 'Nascer da lua' : 'Poente da lua'}</span>
              </div>
            ))}
            {menores.length === 0 && (
              <p className="text-sm text-slate-400">Sem dados de nascer/poente para este dia.</p>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        Baseado na Teoria Solunar (John Alden Knight): peixes e animais silvestres tendem a se
        alimentar mais nos períodos em que a lua está a pino ou no fundo (maiores) e no
        nascer/poente da lua (menores). Estrelas somam a fase lunar com o cruzamento dos
        períodos maiores e a maré cheia do dia.
      </p>
    </section>
  );
}
