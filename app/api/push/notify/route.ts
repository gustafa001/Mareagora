import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { VAPID_EMAIL, getVapidPrivateKey, getVapidPublicKey } from '@/lib/vapid';
import {
  getAllSubscriptions,
  getSubscriptionsByPort,
  markNotified,
  removeSubscription,
} from '@/lib/pushStorage';
import { PORTS } from '@/lib/ports';
import { findIncomingLowTide } from '@/lib/pushLowTide';

/** Quantos envios em paralelo por vez (evita estourar o tempo da função). */
const BATCH_SIZE = 25;

/**
 * GET /api/push/notify — chamado a cada 10 min pelo GitHub Actions
 *   (.github/workflows/push-notify.yml) e pelo Cron diário da Vercel.
 * POST /api/push/notify — para uso manual
 * Body: { portSlug?: string }  — se omitido, notifica todos os portos
 *
 * Para cada porto com inscritos, procura a próxima maré baixa dentro da janela
 * (LEAD_MINUTES, em lib/pushLowTide.ts) e dispara o push. Cada inscrição recebe
 * o aviso de uma maré UMA vez só (lastNotifiedKey), então rodar com frequência
 * não gera notificações repetidas.
 *
 * Proteção: exige CRON_SECRET (ou NOTIFY_SECRET) no ambiente (HTTP 500 se
 * ausente) e valida `Authorization: Bearer <segredo>` (HTTP 401). O Cron da
 * Vercel envia esse header automaticamente.
 * As chaves VAPID são resolvidas em runtime (não no import) para não derrubar
 * o build quando as variáveis não existirem no ambiente de compilação.
 */
async function handleNotify(req: NextRequest) {
  try {
    const notifySecret = process.env.CRON_SECRET || process.env.NOTIFY_SECRET;
    if (!notifySecret) {
      return NextResponse.json(
        { error: 'CRON_SECRET not configured' },
        { status: 500 },
      );
    }

    const auth = req.headers.get('authorization');
    const xNotifySecret = req.headers.get('x-notify-secret');
    if (auth !== `Bearer ${notifySecret}` && xNotifySecret !== notifySecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    webpush.setVapidDetails(VAPID_EMAIL, getVapidPublicKey(), getVapidPrivateKey());

    const body = await req.json().catch(() => ({}));
    const { portSlug } = body as { portSlug?: string };

    const subs = portSlug
      ? await getSubscriptionsByPort(portSlug)
      : await getAllSubscriptions();

    if (subs.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: 'No subscriptions' });
    }

    let totalSent = 0;
    let skipped = 0;
    const failed: string[] = [];

    // Agrupa por porto para calcular a maré uma vez por porto
    const byPort = subs.reduce<Record<string, typeof subs>>((acc, s) => {
      (acc[s.portSlug] ??= []).push(s);
      return acc;
    }, {});

    for (const [slug, portSubs] of Object.entries(byPort)) {
      const port = PORTS.find((p) => p.slug === slug);
      if (!port) continue;

      const incoming = findIncomingLowTide(port);
      if (!incoming) continue; // Nenhuma maré baixa se aproximando neste porto

      const pending = portSubs.filter((s) => s.lastNotifiedKey !== incoming.key);
      skipped += portSubs.length - pending.length;

      const payload = JSON.stringify({
        title: '⚠️ Maré baixa chegando!',
        body: `${port.name} — maré baixa às ${incoming.hora} (${incoming.altura_m.toFixed(2)}m)`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        url: `/mare/${slug}`,
      });

      for (let i = 0; i < pending.length; i += BATCH_SIZE) {
        const batch = pending.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (sub) => {
            try {
              await webpush.sendNotification(
                { endpoint: sub.endpoint, keys: sub.keys },
                payload,
              );
              totalSent++;
            } catch (err: unknown) {
              const status = (err as { statusCode?: number }).statusCode;
              // 410 Gone / 404 = inscrição expirada, remove
              if (status === 410 || status === 404) {
                await removeSubscription(sub.endpoint).catch(() => {});
              } else {
                failed.push(sub.endpoint.slice(0, 40));
                console.error('[push/notify] send error', err);
              }
              return;
            }
            // Enviado: registra a maré avisada. Falha aqui não é falha de envio.
            await markNotified(sub.endpoint, incoming.key).catch((err) =>
              console.error('[push/notify] markNotified error', err),
            );
          }),
        );
      }
    }

    return NextResponse.json({ ok: true, sent: totalSent, skipped, failed });
  } catch (err) {
    console.error('[push/notify]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export const GET = handleNotify;
export const POST = handleNotify;
