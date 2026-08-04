import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = 'contatos@mareagora.com.br';
// Enquanto o domínio mareagora.com.br não estiver verificado no Resend,
// o envio só funciona com esse remetente de sandbox deles.
// Depois de verificar o domínio (Resend > Domains), troque para
// algo como 'MaréAgora <sugestoes@mareagora.com.br>'.
const FROM_EMAIL = 'MaréAgora <onboarding@resend.dev>';

export async function POST(req: NextRequest) {
  try {
    if (!RESEND_API_KEY) {
      console.error('[suggest-camera] RESEND_API_KEY não configurada');
      return NextResponse.json({ error: 'Serviço de e-mail não configurado' }, { status: 500 });
    }

    const body = await req.json();
    const { praia, link } = body as { praia?: string; link?: string };

    if (!praia || !praia.trim()) {
      return NextResponse.json({ error: 'Informe o nome da praia' }, { status: 400 });
    }

    const subject = `Sugestão de câmera ao vivo: ${praia}`;
    const html = `
      <h2>Nova sugestão de câmera</h2>
      <p><strong>Praia/local:</strong> ${escapeHtml(praia)}</p>
      <p><strong>Link da câmera:</strong> ${link ? escapeHtml(link) : '(não informado)'}</p>
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
