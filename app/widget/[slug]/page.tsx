export const runtime = 'nodejs';

import { notFound } from 'next/navigation';
import { getGlobalPlace } from '@/lib/globalPlaces';
import { getTideForLocation } from '@/lib/tideRouter';
import { getPortBySlug } from '@/lib/ports';
import { getEventosDia } from '@/lib/mare';

interface Props {
  params: { slug: string };
  searchParams: { cc?: string; lang?: string };
}

export default async function TideWidget({ params, searchParams }: Props) {
  const { slug } = params;
  const cc = searchParams.cc;
  const lang = searchParams.lang ?? 'pt';

  const hoje = new Date().toISOString().slice(0, 10);

  let name = '';
  let todayTides: { hora: string; altura_m: number; tipo?: string }[] = [];
  let lat = 0;
  let lon = 0;

  // Try global place
  if (cc) {
    const place = getGlobalPlace(cc, slug);
    if (!place) notFound();
    name = place.name;
    lat = place.lat;
    lon = place.lon;
    const { dias } = await getTideForLocation({ lat, lon }, hoje, 1);
    todayTides = dias[0]?.mares ?? [];
  } else {
    // Try BR port
    const port = getPortBySlug(slug);
    if (!port) notFound();
    name = port.cityName || port.name;
    lat = port.lat;
    lon = port.lon;
    todayTides = getEventosDia(port, hoje);
  }

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const nextTide = todayTides.find(t => {
    const [h, m] = t.hora.split(':').map(Number);
    return h * 60 + m > nowMin;
  }) ?? todayTides[0];

  const isHigh = nextTide && (nextTide.tipo === 'high' || nextTide.altura_m > 0.8);
  const tideLabel = lang === 'en'
    ? (isHigh ? 'High tide' : 'Low tide')
    : (isHigh ? 'Maré Alta' : 'Maré Baixa');
  const inLabel = lang === 'en' ? 'at' : 'às';
  const poweredBy = lang === 'en' ? 'Powered by' : 'Dados via';
  const pageUrl = cc
    ? `https://mareagora.com.br/tide/${cc}/${slug}`
    : `https://mareagora.com.br/mare/${slug}`;

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>MaréAgora Widget — {name}</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0d1b2e 0%, #0a2440 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card {
            width: 100%;
            max-width: 320px;
            padding: 20px;
            border-radius: 16px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            text-align: center;
          }
          .location {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #64b5f6;
            margin-bottom: 8px;
          }
          .tide-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: rgba(255,255,255,0.5);
            margin-bottom: 4px;
          }
          .tide-icon { font-size: 40px; margin: 8px 0; }
          .tide-time {
            font-size: 28px;
            font-weight: 800;
            color: ${isHigh ? '#38bdf8' : '#34d399'};
          }
          .tide-height {
            font-size: 14px;
            color: rgba(255,255,255,0.6);
            margin-top: 4px;
          }
          .divider {
            height: 1px;
            background: rgba(255,255,255,0.08);
            margin: 14px 0;
          }
          .tides-row {
            display: flex;
            justify-content: space-around;
            gap: 8px;
          }
          .tide-item {
            flex: 1;
            background: rgba(255,255,255,0.04);
            border-radius: 10px;
            padding: 8px 6px;
          }
          .tide-item-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: rgba(255,255,255,0.4);
          }
          .tide-item-time {
            font-size: 14px;
            font-weight: 700;
            margin: 2px 0;
          }
          .tide-item-h {
            font-size: 10px;
            color: rgba(255,255,255,0.5);
          }
          .powered {
            margin-top: 14px;
            font-size: 10px;
            color: rgba(255,255,255,0.3);
          }
          .powered a {
            color: #38bdf8;
            text-decoration: none;
            font-weight: 600;
          }
          .powered a:hover { text-decoration: underline; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="location">{name}</div>

          {nextTide ? (
            <>
              <div className="tide-label">{lang === 'en' ? 'Next tide' : 'Próxima maré'}</div>
              <div className="tide-icon">{isHigh ? '🌊' : '🏖️'}</div>
              <div className="tide-time">
                {tideLabel} {inLabel} {nextTide.hora}
              </div>
              <div className="tide-height">{nextTide.altura_m.toFixed(2)} m</div>
            </>
          ) : (
            <div className="tide-label">{lang === 'en' ? 'No data available' : 'Sem dados disponíveis'}</div>
          )}

          <div className="divider" />

          <div className="tides-row">
            {todayTides.slice(0, 4).map((t, i) => {
              const tHigh = t.tipo === 'high' || t.altura_m > 0.8;
              return (
                <div key={i} className="tide-item">
                  <div className="tide-item-label">{tHigh ? (lang === 'en' ? 'High' : 'Alta') : (lang === 'en' ? 'Low' : 'Baixa')}</div>
                  <div className="tide-item-time" style={{ color: tHigh ? '#38bdf8' : '#34d399' }}>{t.hora}</div>
                  <div className="tide-item-h">{t.altura_m.toFixed(1)}m</div>
                </div>
              );
            })}
          </div>

          <div className="powered">
            {poweredBy} <a href={pageUrl} target="_blank" rel="noopener">MaréAgora.com.br</a>
          </div>
        </div>
      </body>
    </html>
  );
}
