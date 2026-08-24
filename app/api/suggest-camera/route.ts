import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = 'contatos@mareagora.com.br';
const FROM_EMAIL = 'MaréAgora <sugestoes@mareagora.com.br>';

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente mais tarde.' },
        { status: 429 }
      );
    }

    if (!RESEND_API_KEY) {
      console.error('[suggest-camera] RESEND_API_KEY não configurada');
      return NextResponse.json({ error: 'Serviço de e-mail não configurado' }, { status: 500 });
    }

    const body = await req.json();
    const { praia, link } = body as { praia?: string; link?: string };

    if (!praia || !praia.trim()) {
      return NextResponse.json({ error: 'Informe o nome da praia' }, { status: 400 });
    }

    const trimmedPraia = praia.trim().slice(0, 200);
    const trimmedLink = link ? link.trim().slice(0, 500) : null;

    const subject = `Sugestão de câmera ao vivo: ${trimmedPraia}`;
    const html = `
      <h2>Nova sugestão de câmera</h2>
      <p><strong>Praia/local:</strong> ${escapeHtml(trimmedPraia)}</p>
      <p><strong>Link da câmera:</strong> ${trimmedLink ? escapeHtml(trimmedLink) : '(não informado)'}</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[suggest-camera] Resend error', res.status, errText);
      return NextResponse.json({ error: 'Falha ao enviar' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[suggest-camera POST]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
