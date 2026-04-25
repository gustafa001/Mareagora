import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { VAPID_EMAIL, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from '@/lib/vapid';
import { getAllSubscriptions, getSubscriptionsByPort, removeSubscription } from '@/lib/pushStorage';
import { PORTS } from '@/lib/ports';
import { getEventosDia } from '@/lib/mare';

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/**
 * POST /api/push/notify
 * Body: { portSlug?: string }  — se omitido, notifica todos os portos
 *
 * Verifica se há maré baixa nas próximas 2h para o porto e dispara push.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { portSlug } = body as { portSlug?: string };

    // Pega hoje no horário de Brasília
    const nowBR = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    );
    const todayStr = nowBR.toISOString().slice(0, 10);
    const nowMs = nowBR.getTime();
    const twoHoursMs = 2 * 60 * 60 * 1000;

    const subs = portSlug
      ? await getSubscriptionsByPort(portSlug)
      : await getAllSubscriptions();

    if (subs.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: 'No subscriptions' });
    }

    let totalSent = 0;
    const failed: string[] = [];

    // Agrupa por porto para evitar buscar dados repetidamente
    const byPort = subs.reduce<Record<string, typeof subs>>((acc, s) => {
      if (!acc[s.portSlug]) acc[s.portSlug] = [];
      acc[s.portSlug].push(s);
      return acc;
    }, {});

    for (const [slug, portSubs] of Object.entries(byPort)) {
      const port = PORTS.find((p) => p.slug === slug);
      if (!port) continue;

      const eventos = getEventosDia(port, todayStr);
      const lowTides = eventos.filter((ev) => ev.tipo === 'low');

      // Acha a próxima maré baixa dentro das próximas 2h
      const incoming = lowTides.find((ev) => {
        const evMs = new Date(ev.dt_iso).getTime();
        return evMs > nowMs && evMs - nowMs <= twoHoursMs;
      });

      if (!incoming) continue; // Nenhuma maré baixa se aproximando neste porto

      const payload = JSON.stringify({
        title: '⚠️ Maré baixa chegando!',
        body: `${port.name} — maré baixa às ${incoming.hora} (${incoming.altura_m.toFixed(2)}m)`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        url: `/mare/${slug}`,
      });

      for (const sub of portSubs) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys,
            },
            payload,
          );
          totalSent++;
        } catch (err: unknown) {
          const status = (err as { statusCode?: number }).statusCode;
          // 410 Gone = subscription expired, remove it
          if (status === 410 || status === 404) {
            await removeSubscription(sub.endpoint);
          } else {
            failed.push(sub.endpoint.slice(0, 40));
            console.error('[push/notify] send error', err);
          }
        }
      }
    }

    return NextResponse.json({ ok: true, sent: totalSent, failed });
  } catch (err) {
    console.error('[push/notify POST]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
