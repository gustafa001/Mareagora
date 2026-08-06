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

const DIAS_CURTOS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

/**
 * Formata hora de um Date (UTC timestamp) em BRT.
 * Usa en-CA + hour12:false para garantir "HH:MM" idêntico em Node.js e Chrome,
 * eliminando possíveis diferenças de ICU com o locale pt-BR.
 */
function formatHora(d: Date): string {
  return d.toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  });
}

/**
 * Formata string "YYYY-MM-DD" como "dom 06/08" etc.
 * Usa UTC meio-dia para que a mesma data do calendário seja preservada em
 * qualquer fuso — evita o bug em que midnight UTC = noite anterior no BRT,
 * que fazia o servidor mostrar o dia errado (regressão do #425).
 * Lookup manual de dia-da-semana evita divergência de ICU entre servidor/cliente.
 */
function formatDataCurta(dataStr: string): string {
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  // Meio-dia UTC é o mesmo dia em qualquer fuso de UTC−12 a UTC+14
  const d = new Date(Date.UTC(ano, mes - 1, dia, 12, 0, 0));
  const wd = DIAS_CURTOS[d.getUTCDay()];
  return `${wd} ${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`;
}

export default function SolunarTable({ lat, lon, offsetMinutes = -180, weekTides }: SolunarTableProps) {
  const [diaSelecionado, setDiaSelecionado] = useState(0);

  const dias = useMemo(() => weekTides.slice(0, 7), [weekTides]);

  const calculo = useMemo(() => {
    return dias.map(dia => {
      const inicioDia = inicioDiaLocal(dia.data, offsetMinutes);
      const periodos = getPeriodosSolunares(inicioDia, lat, lon);
      const idadeLua = getIdadeLua(inicioDia);
      const avaliacao = getAvaliacaoSolunar(idadeLua, periodos, dia.mares, offsetMinutes);
      return { data: dia.data, periodos, idadeLua, avaliacao };
    });
  }, [dias, lat, lon, offsetMinutes]);

  if (calculo.length === 0) return null;

  const atual = calculo[Math.min(diaSelecionado, calculo.length - 1)];
  const fase = getMoonPhase(atual.idadeLua);

  const maiores = atual.periodos.filter((p: PeriodoSolunar) => p.tipo === 'maior');
  const menores = atual.periodos.filter((p: PeriodoSolunar) => p.tipo === 'menor');

  return (
    <section className="bg-[#0d1526] text-white rounded-3xl p-6 shadow-xl border border-white/5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-2xl font-bold font-syne flex items-center gap-2 text-cyan-400">
          🎣 Tábua Solunar
        </h2>
        <div className="flex items-center gap-1 text-lg" title={`${atual.avaliacao.estrelas} de 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < atual.avaliacao.estrelas ? 'text-orange-400' : 'text-white/10'}>
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Navegador de dias */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-1 px-1 scrollbar-hide">
        {calculo.map((c, i) => (
          <button
            key={c.data}
            onClick={() => setDiaSelecionado(i)}
            className={`shrink-0 px-4 py-3 rounded-2xl text-xs font-semibold border transition-all ${
              i === diaSelecionado
                ? 'bg-cyan-500 text-[#0d1526] border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-cyan-500/50 hover:bg-white/10'
            }`}
          >
            <div className="capitalize mb-1">{i === 0 ? 'Hoje' : formatDataCurta(c.data)}</div>
            <div className="flex justify-center gap-0.5">
              {Array.from({ length: c.avaliacao.estrelas }).map((_, idx) => (
                <span key={idx} className={i === diaSelecionado ? 'text-[#0d1526]' : 'text-orange-400'}>★</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {atual.avaliacao.destaque && (
        <div className="mb-6 text-sm font-semibold text-cyan-100 bg-cyan-950/50 border border-cyan-800/50 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-inner">
          <span className="text-xl">🌊</span>
          <span>Um período maior coincide com a maré cheia hoje — janela de excelente atividade.</span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
        <span className="text-xl">{fase.icon}</span>
        <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">{fase.name}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-[10px] font-black text-cyan-500/70 uppercase tracking-[0.2em] mb-3 px-1">
            Períodos Maiores (2h)
          </h3>
          <div className="space-y-3">
            {maiores.map((p, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/10 transition-colors">
                <span className="font-bold text-lg text-cyan-50">{formatHora(p.inicio)} – {formatHora(p.fim)}</span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{i === 0 ? 'Lua a pino' : 'Lua no fundo'}</span>
              </div>
            ))}
            {maiores.length === 0 && (
              <p className="text-sm text-slate-500 italic px-1">Sem dados de culminação para este dia.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-orange-500/70 uppercase tracking-[0.2em] mb-3 px-1">
            Períodos Menores (1h)
          </h3>
          <div className="space-y-3">
            {menores.map((p, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/10 transition-colors">
                <span className="font-bold text-lg text-orange-50">{formatHora(p.inicio)} – {formatHora(p.fim)}</span>
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">{i === 0 ? 'Nascer da lua' : 'Poente da lua'}</span>
              </div>
            ))}
            {menores.length === 0 && (
              <p className="text-sm text-slate-500 italic px-1">Sem dados de nascer/poente para este dia.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
          Baseado na <strong className="text-slate-400">Teoria Solunar</strong> (John Alden Knight): peixes e animais silvestres tendem a se
          alimentar mais nos períodos em que a lua está a pino ou no fundo (maiores) e no
          nascer/poente da lua (menores). A pontuação considera a fase lunar e o cruzamento dos
          períodos maiores com a maré cheia local.
        </p>
      </div>
    </section>
  );
}
