'use client';
import { useEffect, useState } from 'react';

/**
 * Mostra o resumo SEO (gerado por generateSEOContent, comentado no page.tsx
 * como "AI Overview Target") como um slider que passa frase por frase,
 * em vez do parágrafo estático inteiro.
 *
 * IMPORTANTE: todas as frases continuam presentes no HTML (apenas escondidas
 * via CSS quando não é a vez delas) — isso preserva o texto completo pra
 * crawlers e para engines de IA que possam citar o parágrafo inteiro,
 * já que remover fisicamente o texto do DOM reduziria o valor desse bloco
 * pra SEO/AI Overview.
 */
export default function SeoOverviewTicker({
  title,
  text,
  dateStr,
}: {
  title: string;
  text: string;
  /** Data (YYYY-MM-DD) calculada no servidor. Quando passada, o título mostra
   *  "{title} (dd/mm/aaaa)" e a data acompanha o relógio do navegador após
   *  montar, para não ficar um dia atrasada em páginas servidas do cache (ISR). */
  dateStr?: string;
}) {
  const [liveDate, setLiveDate] = useState<string | null>(null);

  useEffect(() => {
    if (!dateStr) return;
    const update = () =>
      setLiveDate(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [dateStr]);

  const shownDate = dateStr ? (liveDate ?? dateStr) : null;
  const fullTitle = shownDate ? `${title} (${shownDate.split('-').reverse().join('/')})` : title;

  // Divide em frases (por ponto final seguido de espaço/maiúscula), sem perder o texto original.
  const sentences = text
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú])/)
    .map(s => s.trim())
    .filter(Boolean);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (sentences.length <= 1) return;
    const timer = setInterval(() => {
      setActive(i => (i + 1) % sentences.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sentences.length]);

  return (
    <div className="bg-slate-900/50 border-b border-slate-800 py-3">
      <div className="container">
        <h2 className="text-base font-bold text-white mb-1">{fullTitle}</h2>

        <div className="relative min-h-[2.8em] sm:min-h-[1.8em]">
          {sentences.map((sentence, i) => (
            <p
              key={i}
              aria-hidden={i !== active}
              className="text-slate-300 leading-relaxed text-sm md:text-base transition-opacity duration-500 absolute inset-0"
              style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? 'auto' : 'none' }}
            >
              {sentence}
            </p>
          ))}
        </div>

        {sentences.length > 1 && (
          <div className="flex gap-1.5 mt-2">
            {sentences.map((_, i) => (
              <button
                key={i}
                aria-label={`Ver frase ${i + 1}`}
                onClick={() => setActive(i)}
                className="h-1 rounded-full transition-all"
                style={{
                  width: i === active ? '18px' : '6px',
                  background: i === active ? '#38c9f0' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
