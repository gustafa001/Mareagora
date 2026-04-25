import { NextRequest, NextResponse } from 'next/server';
import { addSubscription, removeSubscription } from '@/lib/pushStorage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, portSlug } = body as {
      subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
      portSlug: string;
    };

    if (!subscription?.endpoint || !subscription?.keys || !portSlug) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await addSubscription({
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      portSlug,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[push/subscribe POST]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
    await removeSubscription(endpoint);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[push/subscribe DELETE]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
