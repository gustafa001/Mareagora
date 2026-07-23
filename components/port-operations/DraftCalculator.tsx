'use client';

import { useState, useMemo } from 'react';
import { TideEvent, tideAtMinute } from '@/lib/tideUtils';

interface DraftCalculatorProps {
  todayTides: TideEvent[];
  /** Profundidade de referência (zero hidrográfico) do porto, se disponível no config */
  baseDepth?: number;
}

export default function DraftCalculator({ todayTides, baseDepth = 12.5 }: DraftCalculatorProps) {
  const [vesselDraft, setVesselDraft] = useState<number>(10.5);
  const [ukc, setUkc] = useState<number>(0.5); // Under Keel Clearance (Margem de Segurança)

  const totalRequired = useMemo(() => vesselDraft + ukc, [vesselDraft, ukc]);

  const windows = useMemo(() => {
    if (todayTides.length === 0) return [];
    
    const results: { start: string; end: string; isSafe: boolean }[] = [];
    let currentWindow: { start: number; isSafe: boolean } | null = null;

    // Analisa minuto a minuto do dia (0 a 1439)
    for (let m = 0; m < 1440; m++) {
      const tideHeight = tideAtMinute(m, todayTides);
      const totalDepth = baseDepth + tideHeight;
      const isSafe = totalDepth >= totalRequired;

      if (currentWindow === null) {
        currentWindow = { start: m, isSafe };
      } else if (currentWindow.isSafe !== isSafe) {
        const end = m - 1;
        results.push({
          start: `${Math.floor(currentWindow.start / 60).toString().padStart(2, '0')}:${(currentWindow.start % 60).toString().padStart(2, '0')}`,
          end: `${Math.floor(end / 60).toString().padStart(2, '0')}:${(end % 60).toString().padStart(2, '0')}`,
          isSafe: currentWindow.isSafe
        });
        currentWindow = { start: m, isSafe };
      }
    }

    // Fecha a última janela
    if (currentWindow) {
      results.push({
        start: `${Math.floor(currentWindow.start / 60).toString().padStart(2, '0')}:${(currentWindow.start % 60).toString().padStart(2, '0')}`,
        end: '23:59',
        isSafe: currentWindow.isSafe
      });
    }

    return results.filter(w => w.isSafe);
  }, [todayTides, baseDepth, totalRequired]);

  return (
    <div className="bg-[#0d1526] rounded-3xl border border-white/5 p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-cyan-500/10 rounded-xl">
          <span className="text-xl">🚢</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-syne">Calculadora de Calado</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Janela Operacional Segura</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-cyan-500/70 uppercase tracking-wider ml-1">Calado (m)</label>
          <input
            type="number"
            step="0.1"
            value={vesselDraft}
            onChange={(e) => setVesselDraft(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-orange-500/70 uppercase tracking-wider ml-1">UKC / Margem (m)</label>
          <input
            type="number"
            step="0.1"
            value={ukc}
            onChange={(e) => setUkc(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-slate-400">Profundidade Necessária:</span>
          <span className="text-white font-bold text-lg">{totalRequired.toFixed(2)}m</span>
        </div>
        <div className="text-[10px] text-slate-500 leading-tight">
          Soma do calado estático + margem de segurança (Under Keel Clearance).
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[120px]">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Janelas de Passagem Segura</h4>
        {windows.length > 0 ? (
          windows.map((w, i) => (
            <div key={i} className="flex items-center justify-between bg-cyan-500/5 border border-cyan-500/10 rounded-2xl px-5 py-3 shadow-inner">
              <div className="flex flex-col">
                <span className="text-xs text-cyan-500 font-bold uppercase tracking-tighter">Disponível</span>
                <span className="text-lg font-black text-cyan-50 font-syne">{w.start} – {w.end}</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] animate-pulse" />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center bg-red-500/5 border border-red-500/10 rounded-2xl">
            <span className="text-2xl mb-2">⚠️</span>
            <span className="text-xs text-red-400 font-bold uppercase tracking-widest">Sem janela segura</span>
            <span className="text-[10px] text-red-300/60 px-4 mt-1">A profundidade total hoje não atende aos requisitos informados.</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 text-[9px] text-slate-600 leading-relaxed italic">
        * Cálculo baseado no Zero Hidrográfico local ({baseDepth}m) + Previsão de Maré Astronômica. Não considera efeitos de maré meteorológica ou assoreamento pontual.
      </div>
    </div>
  );
}
